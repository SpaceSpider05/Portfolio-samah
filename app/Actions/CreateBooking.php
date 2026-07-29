<?php

namespace App\Actions;

use App\Mail\AiBookingAdminNotification;
use App\Mail\AiBookingConfirmation;
use App\Mail\BookingAdminNotification;
use App\Mail\BookingConfirmation;
use App\Models\Booking;
use App\Models\SiteSetting;
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
     *     source?: string|null
     * }  $data
     */
    public function execute(array $data): Booking
    {
        return DB::transaction(function () use ($data): Booking {
            $source = $data['source'] ?? 'website';
            if (! in_array($source, ['website', 'ai_agent'], true)) {
                $source = 'website';
            }

            $booking = Booking::query()->create([
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
            ]);

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

            return $booking;
        });
    }
}
