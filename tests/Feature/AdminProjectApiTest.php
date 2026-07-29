<?php

use App\Models\Project;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(AdminUserSeeder::class);
});

it('allows an admin to create a project', function (): void {
    $login = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->assertOk();

    $token = $login->json('token');

    $this->withToken($token)
        ->postJson('/api/v1/projects', [
            'slug' => 'aurora-rebrand',
            'title' => 'Aurora Rebrand',
            'client' => 'Aurora Labs',
            'category' => 'Brand + Performance',
            'summary' => 'A cinematic relaunch for a wellness brand.',
            'challenge' => 'Fragmented messaging across markets.',
            'solution' => 'Unified brand system and paid creative tests.',
            'results' => ['+120% organic', '3.1x ROAS'],
            'technologies' => ['Next.js', 'Meta Ads'],
            'coverImage' => '/images/project-lumen.svg',
            'galleryImages' => [
                [
                    'path' => '/images/project-northline.svg',
                    'description' => 'Homepage redesign mockup',
                ],
                [
                    'path' => '/images/project-velvet.svg',
                    'description' => 'Campaign creative board',
                ],
            ],
            'isPublished' => true,
            'sortOrder' => 1,
        ])
        ->assertCreated()
        ->assertJsonPath('slug', 'aurora-rebrand')
        ->assertJsonPath('title', 'Aurora Rebrand')
        ->assertJsonPath('isPublished', true)
        ->assertJsonPath('galleryImages.0.path', '/images/project-northline.svg')
        ->assertJsonPath('galleryImages.0.description', 'Homepage redesign mockup')
        ->assertJsonCount(2, 'galleryImages');

    $this->assertDatabaseHas('projects', [
        'slug' => 'aurora-rebrand',
        'client' => 'Aurora Labs',
        'is_published' => true,
    ]);

    expect(Project::query()->where('slug', 'aurora-rebrand')->value('gallery_images'))
        ->toBe([
            [
                'path' => '/images/project-northline.svg',
                'description' => 'Homepage redesign mockup',
            ],
            [
                'path' => '/images/project-velvet.svg',
                'description' => 'Campaign creative board',
            ],
        ]);
});

it('returns a published project by slug', function (): void {
    $project = Project::factory()->create([
        'slug' => 'northline-growth',
        'is_published' => true,
    ]);

    $this->getJson('/api/v1/projects/northline-growth')
        ->assertOk()
        ->assertJsonPath('id', (string) $project->id)
        ->assertJsonPath('slug', 'northline-growth');
});

it('hides unpublished projects from the public show route', function (): void {
    Project::factory()->create([
        'slug' => 'draft-case',
        'is_published' => false,
    ]);

    $this->getJson('/api/v1/projects/draft-case')->assertNotFound();
});
