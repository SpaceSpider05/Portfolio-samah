<?php

use App\Ai\Contracts\AiProvider;
use App\Mail\AiBookingAdminNotification;
use App\Mail\AiBookingConfirmation;
use App\Models\AiConversation;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('returns localized starter suggestions', function (): void {
    $this->getJson('/api/v1/ai/suggestions?locale=en')
        ->assertOk()
        ->assertJsonPath('assistant', 'Samah AI')
        ->assertJsonPath('enabled', true)
        ->assertJsonFragment(['Which marketing service fits my business?']);
});

it('returns a non-streaming AI chat reply and persists the conversation', function (): void {
    Mail::fake();

    $this->mock(AiProvider::class, function ($mock): void {
        $mock->shouldReceive('complete')
            ->once()
            ->andReturn('SEO is a strong fit for sustainable inbound demand. Book a consultation for a scoped plan.');
    });

    $response = $this->postJson('/api/v1/ai/chat', [
        'message' => 'Do I need SEO for a local clinic?',
        'locale' => 'en',
        'stream' => false,
    ]);

    $response->assertOk()
        ->assertJsonPath('bookingCreated', false)
        ->assertJsonStructure(['sessionId', 'reply', 'suggestions']);

    expect($response->json('reply'))->toContain('SEO');

    $this->assertDatabaseCount('ai_conversations', 1);
});

it('creates a booking when the assistant emits a lead payload', function (): void {
    Mail::fake();

    $this->mock(AiProvider::class, function ($mock): void {
        $mock->shouldReceive('complete')
            ->once()
            ->andReturn(
                "Perfect — I've prepared your consultation request.\n".
                '[[LEAD:{"name":"Amina Benali","email":"amina@example.com","phone":"+212600000000","company":"Atelier","website":"https://example.com","industry":"E-commerce","service":"SEO Growth Systems","goals":"More organic leads","budget":"Medium","timeline":"This quarter","notes":"Local SEO focus"}]]'
            );
    });

    $this->postJson('/api/v1/ai/chat', [
        'message' => 'Please book me for SEO help.',
        'locale' => 'en',
        'stream' => false,
    ])
        ->assertOk()
        ->assertJsonPath('bookingCreated', true);

    $this->assertDatabaseHas('bookings', [
        'email' => 'amina@example.com',
        'name' => 'Amina Benali',
        'service' => 'SEO Growth Systems',
        'status' => 'pending',
        'source' => 'ai_agent',
    ]);

    expect(Booking::query()->count())->toBe(1);
    expect(AiConversation::query()->whereNotNull('booking_id')->count())->toBe(1);

    Mail::assertQueued(AiBookingConfirmation::class);
    Mail::assertQueued(AiBookingAdminNotification::class);
});

it('rejects empty chat messages', function (): void {
    $this->postJson('/api/v1/ai/chat', [
        'message' => '',
        'stream' => false,
    ])->assertUnprocessable();
});
