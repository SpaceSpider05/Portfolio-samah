<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('throttles admin login after five attempts per minute', function (): void {
    $payload = [
        'email' => 'attacker@example.com',
        'password' => 'wrong-password',
    ];

    for ($attempt = 1; $attempt <= 5; $attempt++) {
        $this->postJson('/api/v1/auth/login', $payload)
            ->assertUnprocessable();
    }

    $this->postJson('/api/v1/auth/login', $payload)
        ->assertStatus(429);
});
