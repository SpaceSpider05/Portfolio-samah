<?php

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

it('allows an admin to load and update about settings', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->getJson('/api/v1/manage/about')
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

    $this->withToken($token)
        ->putJson('/api/v1/manage/about', [
            'name' => 'Samah Studio',
            'role' => 'Brand & Growth Lead',
            'photoUrl' => '/images/about-portrait.jpg',
            'bio' => 'Updated biography for the settings page.',
            'mission' => 'Updated mission statement.',
            'timeline' => [
                [
                    'year' => '2026',
                    'title' => 'Settings live',
                    'description' => 'Admin can edit biography content.',
                ],
            ],
            'achievements' => [
                [
                    'label' => 'Clients',
                    'value' => 42,
                    'suffix' => '+',
                ],
            ],
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Samah Studio')
        ->assertJsonPath('role', 'Brand & Growth Lead')
        ->assertJsonPath('timeline.0.title', 'Settings live')
        ->assertJsonPath('achievements.0.value', 42);

    $this->getJson('/api/v1/about')
        ->assertOk()
        ->assertJsonPath('name', 'Samah Studio')
        ->assertJsonPath('mission', 'Updated mission statement.')
        ->assertJsonCount(1, 'timeline')
        ->assertJsonCount(1, 'achievements');
});

it('rejects unauthenticated about updates', function (): void {
    $this->putJson('/api/v1/manage/about', [
        'name' => 'Nope',
        'role' => 'Nope',
        'photoUrl' => '/images/about-portrait.jpg',
        'bio' => 'Nope',
        'mission' => 'Nope',
        'timeline' => [],
        'achievements' => [],
    ])->assertUnauthorized();
});
