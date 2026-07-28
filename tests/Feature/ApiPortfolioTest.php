<?php

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\PortfolioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed([
        AdminUserSeeder::class,
        PortfolioSeeder::class,
    ]);
});

it('returns the about profile for the public site', function (): void {
    $this->getJson('/api/v1/about')
        ->assertOk()
        ->assertJsonPath('name', 'Samah')
        ->assertJsonStructure([
            'name',
            'role',
            'photoUrl',
            'bio',
            'mission',
            'timeline',
            'achievements',
        ]);
});

it('returns published projects and services', function (): void {
    $this->getJson('/api/v1/projects')
        ->assertOk()
        ->assertJsonCount(3);

    $this->getJson('/api/v1/services')
        ->assertOk()
        ->assertJsonCount(3);

    $this->getJson('/api/v1/stats')
        ->assertOk()
        ->assertJsonStructure(['metrics', 'chart']);
});

it('allows admin login and protects manage routes', function (): void {
    $this->getJson('/api/v1/manage/projects')->assertUnauthorized();

    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    expect($token)->toBeString()->not->toBeEmpty();

    $this->withToken($token)
        ->getJson('/api/v1/manage/projects')
        ->assertOk()
        ->assertJsonCount(3);

    $this->withToken($token)
        ->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('email', 'admin@samah.studio');
});

it('rejects non-admin users from admin login', function (): void {
    User::factory()->create([
        'email' => 'member@example.com',
        'password' => 'password',
        'is_admin' => false,
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email' => 'member@example.com',
        'password' => 'password',
    ])->assertForbidden();
});
