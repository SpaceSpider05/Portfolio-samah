<?php

use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(AdminUserSeeder::class);
});

it('allows an admin to create a service', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->postJson('/api/v1/services', [
            'slug' => 'brand-strategy',
            'title' => 'Brand Strategy',
            'description' => 'Positioning, messaging, and visual systems that scale.',
            'hoverDemo' => 'seo',
            'cta' => 'Build the brand',
            'isPublished' => true,
            'sortOrder' => 3,
        ])
        ->assertCreated()
        ->assertJsonPath('slug', 'brand-strategy')
        ->assertJsonPath('title', 'Brand Strategy')
        ->assertJsonPath('isPublished', true);

    $this->assertDatabaseHas('services', [
        'slug' => 'brand-strategy',
        'title' => 'Brand Strategy',
        'hover_demo' => 'seo',
        'is_published' => true,
        'sort_order' => 3,
    ]);
});

it('rejects unauthenticated service creation', function (): void {
    $this->postJson('/api/v1/services', [
        'slug' => 'brand-strategy',
        'title' => 'Brand Strategy',
        'description' => 'Positioning systems.',
        'hoverDemo' => 'seo',
        'cta' => 'Build the brand',
    ])->assertUnauthorized();
});
