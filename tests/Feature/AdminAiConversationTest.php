<?php

use App\Ai\Contracts\AiProvider;
use App\Mail\AiFollowUpMail;
use App\Models\AiConversation;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(AdminUserSeeder::class);
});

function adminToken(): string
{
    return test()->postJson('/api/v1/auth/login', [
        'email' => 'admin@samah.studio',
        'password' => 'admin123',
    ])->json('token');
}

it('lists AI conversations for admins', function (): void {
    AiConversation::factory()->create([
        'visitor_name' => 'Sara',
        'visitor_email' => 'sara@example.com',
        'messages' => [
            ['role' => 'user', 'content' => 'Hi, I need SEO help'],
            ['role' => 'assistant', 'content' => 'Happy to help — what’s your name?'],
        ],
        'message_count' => 2,
    ]);

    test()->withToken(adminToken())
        ->getJson('/api/v1/manage/ai-conversations')
        ->assertOk()
        ->assertJsonFragment(['visitorName' => 'Sara'])
        ->assertJsonFragment(['visitorEmail' => 'sara@example.com']);
});

it('shows a full transcript for admins', function (): void {
    $conversation = AiConversation::factory()->create([
        'messages' => [
            ['role' => 'user', 'content' => 'Hi'],
            ['role' => 'assistant', 'content' => 'Hi! What’s your name?'],
        ],
    ]);

    test()->withToken(adminToken())
        ->getJson('/api/v1/manage/ai-conversations/'.$conversation->id)
        ->assertOk()
        ->assertJsonPath('messages.0.content', 'Hi')
        ->assertJsonPath('messages.1.content', 'Hi! What’s your name?');
});

it('summarizes a conversation', function (): void {
    test()->mock(AiProvider::class, function ($mock): void {
        $mock->shouldReceive('complete')
            ->once()
            ->andReturn("- Visitor wants SEO\n- Sells products online");
    });

    $conversation = AiConversation::factory()->create([
        'messages' => [
            ['role' => 'user', 'content' => 'Do I need SEO? I sell products.'],
            ['role' => 'assistant', 'content' => 'Likely yes — do you have a website?'],
        ],
    ]);

    test()->withToken(adminToken())
        ->postJson('/api/v1/manage/ai-conversations/'.$conversation->id.'/summarize')
        ->assertOk()
        ->assertJsonPath('summary', "- Visitor wants SEO\n- Sells products online");

    expect($conversation->fresh()->summary)->toContain('SEO');
});

it('sends a follow-up email when visitor email exists', function (): void {
    Mail::fake();

    $conversation = AiConversation::factory()->create([
        'visitor_name' => 'Omar',
        'visitor_email' => 'omar@example.com',
        'messages' => [
            ['role' => 'user', 'content' => 'I need Meta ads help'],
        ],
    ]);

    test()->withToken(adminToken())
        ->postJson('/api/v1/manage/ai-conversations/'.$conversation->id.'/follow-up', [
            'subject' => 'Let’s talk',
            'message' => "Hi Omar,\n\nI saw your chat with Samah AI and I’d love to help personally.",
        ])
        ->assertOk()
        ->assertJsonPath('message', 'Follow-up email sent.');

    Mail::assertSent(AiFollowUpMail::class, function (AiFollowUpMail $mail) {
        return $mail->hasTo('omar@example.com')
            && $mail->visitorName === 'Omar';
    });

    expect($conversation->fresh()->follow_up_sent_at)->not->toBeNull();
});

it('merges visitor profile updates from assistant markers', function (): void {
    Mail::fake();

    test()->mock(AiProvider::class, function ($mock): void {
        $mock->shouldReceive('complete')
            ->once()
            ->andReturn(
                "Nice to meet you, Amina.\n".
                '[[PROFILE:{"name":"Amina","sells":"products","interest":"SEO"}]]'
            );
    });

    $response = test()->postJson('/api/v1/ai/chat', [
        'message' => 'Hi, my name is Amina',
        'stream' => false,
    ])->assertOk();

    expect($response->json('profile.name'))->toBe('Amina');
    expect($response->json('profile.sells'))->toBe('products');

    test()->assertDatabaseHas('ai_conversations', [
        'visitor_name' => 'Amina',
    ]);
});
