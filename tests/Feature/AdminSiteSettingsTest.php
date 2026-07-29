<?php

use App\Models\SiteSetting;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(AdminUserSeeder::class);
});

it('allows an admin to update email and contact settings', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->putJson('/api/v1/manage/site-settings', [
            'contactEmail' => 'hello@studio.test',
            'contactPhone' => '+212600111222',
            'bookingNotifyEmail' => 'bookings@studio.test',
            'mailFromName' => 'Samah Studio',
        ])
        ->assertOk()
        ->assertJsonPath('contactEmail', 'hello@studio.test')
        ->assertJsonPath('bookingNotifyEmail', 'bookings@studio.test');

    $this->assertDatabaseHas('site_settings', [
        'contact_email' => 'hello@studio.test',
        'booking_notify_email' => 'bookings@studio.test',
    ]);

    $this->getJson('/api/v1/site-settings')
        ->assertOk()
        ->assertJsonPath('contactEmail', 'hello@studio.test')
        ->assertJsonPath('contactPhone', '+212600111222');

    expect(SiteSetting::query()->count())->toBe(1);
});

it('rejects unauthenticated site setting updates', function (): void {
    $this->putJson('/api/v1/manage/site-settings', [
        'contactEmail' => 'hello@studio.test',
        'bookingNotifyEmail' => 'bookings@studio.test',
    ])->assertUnauthorized();
});
