<?php

use App\Mail\BookingAdminNotification;
use App\Mail\BookingConfirmation;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('stores a booking and emails the customer a confirmation', function (): void {
    Mail::fake();

    $payload = [
        'name' => 'Amina Benali',
        'email' => 'amina@example.com',
        'phone' => '+212600000000',
        'service' => 'SEO Growth Systems',
        'businessType' => 'E-commerce',
        'notes' => 'Looking to grow organic traffic for a skincare brand.',
    ];

    $this->postJson('/api/v1/bookings', $payload)
        ->assertCreated()
        ->assertJsonPath('name', 'Amina Benali')
        ->assertJsonPath('email', 'amina@example.com')
        ->assertJsonPath('service', 'SEO Growth Systems')
        ->assertJsonPath('status', 'pending')
        ->assertJsonPath('message', 'Your booking request has been received. A confirmation email is on its way.');

    $this->assertDatabaseHas('bookings', [
        'email' => 'amina@example.com',
        'phone' => '+212600000000',
        'service' => 'SEO Growth Systems',
        'business_type' => 'E-commerce',
        'status' => 'pending',
    ]);

    Mail::assertSent(BookingConfirmation::class, function (BookingConfirmation $mail) {
        return $mail->hasTo('amina@example.com')
            && $mail->booking->service === 'SEO Growth Systems';
    });

    Mail::assertSent(BookingAdminNotification::class);
});

it('validates required booking fields', function (): void {
    Mail::fake();

    $this->postJson('/api/v1/bookings', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'phone', 'service']);

    expect(Booking::query()->count())->toBe(0);
    Mail::assertNothingSent();
});
