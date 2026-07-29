<?php

namespace App\Http\Resources\Api\V1;

use App\Models\AiConversation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AiConversation
 */
class AiConversationResource extends JsonResource
{
    protected bool $withMessages = false;

    public function withMessages(bool $withMessages = true): static
    {
        $this->withMessages = $withMessages;

        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $payload = [
            'id' => (string) $this->id,
            'sessionId' => $this->session_id,
            'locale' => $this->locale,
            'visitorName' => $this->visitor_name,
            'visitorEmail' => $this->visitor_email,
            'status' => $this->status,
            'messageCount' => (int) ($this->message_count ?? 0),
            'bookingId' => $this->booking_id ? (string) $this->booking_id : null,
            'visitorProfile' => $this->visitor_profile ?? [],
            'leadPayload' => $this->lead_payload,
            'summary' => $this->summary,
            'followUpSentAt' => $this->follow_up_sent_at?->toIso8601String(),
            'lastMessageAt' => $this->last_message_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];

        if ($this->withMessages) {
            $payload['messages'] = is_array($this->messages) ? array_values($this->messages) : [];
        } else {
            $payload['preview'] = $this->previewText();
        }

        return $payload;
    }

    private function previewText(): ?string
    {
        $messages = is_array($this->messages) ? $this->messages : [];

        for ($i = count($messages) - 1; $i >= 0; $i--) {
            $message = $messages[$i];
            if (! is_array($message)) {
                continue;
            }
            if (($message['role'] ?? null) === 'user' && is_string($message['content'] ?? null)) {
                return mb_substr(trim($message['content']), 0, 140);
            }
        }

        return null;
    }
}
