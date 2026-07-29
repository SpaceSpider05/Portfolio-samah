<?php

use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(AdminUserSeeder::class);
    Storage::fake('public');
});

it('allows an admin to upload a project cover image', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');
    $file = UploadedFile::fake()->image('cover.jpg', 1200, 800);

    $response = $this->withToken($token)
        ->post('/api/v1/media', [
            'file' => $file,
            'folder' => 'projects',
        ], [
            'Accept' => 'application/json',
        ])
        ->assertCreated()
        ->assertJsonStructure(['path', 'url', 'coverImage']);

    expect($response->json('coverImage'))->toStartWith('/storage/projects/');
    Storage::disk('public')->assertExists($response->json('path'));
});

it('rejects unauthenticated media uploads', function (): void {
    $this->post('/api/v1/media', [
        'file' => UploadedFile::fake()->image('cover.jpg'),
    ], [
        'Accept' => 'application/json',
    ])->assertUnauthorized();
});
