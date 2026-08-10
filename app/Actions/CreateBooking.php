<?php

namespace App\Actions;

use App\Mail\AiBookingAdminNotification;
use App\Mail\AiBookingConfirmation;
use App\Mail\BookingAdminNotification;
use App\Mail\BookingConfirmation;
use App\Models\Booking;
use App\Models\SiteSetting;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CreateBooking
{
    /**
     * @param  array{
     *     name: string,
     *     email: string,
     *     phone: string,
     *     service: string,
     *     businessType?: string|null,
     *     notes?: string|null,
     *     goals?: list<string>|null,
     *     scheduledAt?: string|null,
     *     source?: string|null,
     *     idempotencyKey?: string|null
     * }  $data
     */
    public function execute(array $data): Booking
    {
        $source = $data['source'] ?? 'website';
        if (! in_array($source, ['website', 'ai_agent'], true)) {
            $source = 'website';
        }

        $idempotencyKey = isset($data['idempotencyKey']) && is_string($data['idempotencyKey'])
            ? trim($data['idempotencyKey'])
            : null;
        if ($idempotencyKey === '') {
            $idempotencyKey = null;
        }

        if ($idempotencyKey !== null) {
            $existingByKey = Booking::query()
                ->where('idempotency_key', $idempotencyKey)
                ->first();
            if ($existingByKey) {
                return $existingByKey;
            }
        }

        // Soft dedupe for double-clicks / retries without a client key.
        $recentDuplicate = Booking::query()
            ->where('email', $data['email'])
            ->where('service', $data['service'])
            ->where('phone', $data['phone'])
            ->where('created_at', '>=', now()->subMinutes(2))
            ->latest('id')
            ->first();

        if ($recentDuplicate) {
            $sameNotes = trim((string) ($recentDuplicate->notes ?? '')) === trim((string) ($data['notes'] ?? ''));
            if ($sameNotes) {
                return $recentDuplicate;
            }
        }

        try {
            $booking = DB::transaction(function () use ($data, $source, $idempotencyKey): Booking {
                return Booking::query()->create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'service' => $data['service'],
                    'business_type' => $data['businessType'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'goals' => $data['goals'] ?? null,
                    'scheduled_at' => $data['scheduledAt'] ?? null,
                    'status' => 'pending',
                    'source' => $source,
                    'idempotency_key' => $idempotencyKey,
                ]);
            });
        } catch (QueryException $exception) {
            // Race: another request inserted the same idempotency key first.
            if ($idempotencyKey !== null) {
                $existing = Booking::query()
                    ->where('idempotency_key', $idempotencyKey)
                    ->first();
                if ($existing) {
                    return $existing;
                }
            }

            throw $exception;
        }

        $this->dispatchNotifications($booking, $source);

        return $booking;
    }

    private function dispatchNotifications(Booking $booking, string $source): void
    {
        if ($source === 'ai_agent') {
            Mail::to($booking->email)->send(new AiBookingConfirmation($booking));
        } else {
            Mail::to($booking->email)->send(new BookingConfirmation($booking));
        }

        $adminAddress = SiteSetting::current()->booking_notify_email
            ?: config('mail.admin_address');

        if (is_string($adminAddress) && $adminAddress !== '') {
            if ($source === 'ai_agent') {
                Mail::to($adminAddress)->send(new AiBookingAdminNotification($booking));
            } else {
                Mail::to($adminAddress)->send(new BookingAdminNotification($booking));
            }
        }
    }
}
