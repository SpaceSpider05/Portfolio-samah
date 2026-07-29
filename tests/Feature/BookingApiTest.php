<?php

use App\Mail\BookingAdminNotification;
use App\Mail\BookingConfirmation;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('stores a booking and queues client + admin emails', function (): void {
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
        ->assertJsonPath('message', 'Your booking request has been received. We will respond within 24 hours.');

    $this->assertDatabaseHas('bookings', [
        'email' => 'amina@example.com',
        'phone' => '+212600000000',
        'service' => 'SEO Growth Systems',
        'business_type' => 'E-commerce',
        'status' => 'pending',
    ]);

    Mail::assertQueued(BookingConfirmation::class, function (BookingConfirmation $mail) {
        return $mail->hasTo('amina@example.com')
            && $mail->booking->service === 'SEO Growth Systems';
    });

    Mail::assertQueued(BookingAdminNotification::class, function (BookingAdminNotification $mail) {
        return $mail->booking->email === 'amina@example.com';
    });
});

it('renders the client confirmation with a 24-hour response promise', function (): void {
    $booking = Booking::factory()->make([
        'name' => 'Amina Benali',
        'email' => 'amina@example.com',
        'service' => 'SEO Growth Systems',
    ]);

    $mailable = new BookingConfirmation($booking);

    $mailable->assertHasSubject('We received your booking — we’ll reply within 24 hours');
    $mailable->assertSeeInHtml('within 24 hours');
    $mailable->assertSeeInHtml('Amina Benali');
});

it('renders the admin notification for a new book-a-call', function (): void {
    $booking = Booking::factory()->make([
        'name' => 'Amina Benali',
        'email' => 'amina@example.com',
        'service' => 'SEO Growth Systems',
        'notes' => 'Need a strategy call.',
    ]);

    $mailable = new BookingAdminNotification($booking);

    $mailable->assertHasSubject('New book-a-call: Amina Benali');
    $mailable->assertSeeInHtml('New book-a-call request');
    $mailable->assertSeeInHtml('amina@example.com');
    $mailable->assertSeeInHtml('Need a strategy call.');
    $mailable->assertSeeInHtml('Reply to client');
});

it('validates required booking fields', function (): void {
    Mail::fake();

    $this->postJson('/api/v1/bookings', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'phone', 'service']);

    expect(Booking::query()->count())->toBe(0);
    Mail::assertNothingOutgoing();
});
