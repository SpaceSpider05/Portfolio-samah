<?php

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(AdminUserSeeder::class);
});

it('allows an admin to update account name and email', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->putJson('/api/v1/manage/account', [
            'name' => 'Samah Admin',
            'email' => 'owner@samah.studio',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Samah Admin')
        ->assertJsonPath('email', 'owner@samah.studio');

    $this->assertDatabaseHas('users', [
        'email' => 'owner@samah.studio',
        'name' => 'Samah Admin',
        'is_admin' => true,
    ]);
});

it('allows an admin to change password with the current password', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->putJson('/api/v1/manage/account', [
            'name' => 'Admin',
            'email' => 'admin@samah.studio',
            'currentPassword' => 'admin123',
            'password' => 'new-secure-pass',
            'password_confirmation' => 'new-secure-pass',
        ])
        ->assertOk();

    /** @var User $user */
    $user = User::query()->where('email', 'admin@samah.studio')->firstOrFail();

    expect(Hash::check('new-secure-pass', $user->password))->toBeTrue();
});

it('rejects password changes with the wrong current password', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->putJson('/api/v1/manage/account', [
            'name' => 'Admin',
            'email' => 'admin@samah.studio',
            'currentPassword' => 'wrong-password',
            'password' => 'new-secure-pass',
            'password_confirmation' => 'new-secure-pass',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['currentPassword']);
});
