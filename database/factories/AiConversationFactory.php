<?php

namespace Database\Factories;

use App\Models\AiConversation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<AiConversation>
 */
class AiConversationFactory extends Factory
{
    protected $model = AiConversation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'session_id' => (string) Str::uuid(),
            'locale' => 'en',
            'visitor_email' => null,
            'visitor_name' => null,
            'messages' => [],
            'lead_payload' => null,
            'visitor_profile' => [],
            'summary' => null,
            'preview' => null,
            'follow_up_sent_at' => null,
            'message_count' => 0,
            'status' => 'active',
            'last_message_at' => now(),
        ];
    }
}
