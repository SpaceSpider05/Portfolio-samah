<?php

namespace App\Ai\Services;

use App\Actions\CreateBooking;
use App\Ai\Contracts\AiProvider;
use App\Ai\Knowledge\KnowledgeBase;
use App\Ai\Prompts\SystemPrompt;
use App\Models\AiConversation;
use App\Models\AiMemoryNote;
use Illuminate\Support\Str;

class AiAssistantService
{
    public function __construct(
        private AiProvider $provider,
        private KnowledgeBase $knowledgeBase,
        private CreateBooking $createBooking,
    ) {}

    /**
     * @return array{
     *     sessionId: string,
     *     reply: string,
     *     lead: array<string, mixed>|null,
     *     profile: array<string, mixed>,
     *     bookingCreated: bool,
     *     suggestions: list<string>
     * }
     */
    public function chat(string $message, ?string $sessionId = null, string $locale = 'en'): array
    {
        $conversation = $this->resolveConversation($sessionId, $locale);
        $history = $this->normalizeHistory($conversation->messages ?? []);
        $history[] = ['role' => 'user', 'content' => $message];

        $messages = $this->buildProviderMessages($conversation, $history, $message, $locale);
        $reply = $this->provider->complete($messages);
        $parsed = $this->parseAssistantPayload($reply);

        return $this->finalizeTurn($conversation, $history, $parsed, $locale);
    }

    /**
     * @return \Generator<int, array{event: string, data: mixed}>
     */
    public function streamChat(string $message, ?string $sessionId = null, string $locale = 'en'): \Generator
    {
        $conversation = $this->resolveConversation($sessionId, $locale);
        $history = $this->normalizeHistory($conversation->messages ?? []);
        $history[] = ['role' => 'user', 'content' => $message];

        yield ['event' => 'meta', 'data' => [
            'sessionId' => $conversation->session_id,
            'suggestions' => $this->suggestions($locale),
            'profile' => $conversation->visitor_profile ?? [],
        ]];

        $messages = $this->buildProviderMessages($conversation, $history, $message, $locale);
        $raw = '';

        foreach ($this->provider->stream($messages) as $chunk) {
            $raw .= $chunk;
            yield ['event' => 'token', 'data' => ['text' => $chunk]];
        }

        $parsed = $this->parseAssistantPayload($raw);
        $result = $this->finalizeTurn($conversation, $history, $parsed, $locale);

        yield ['event' => 'done', 'data' => $result];
    }

    /**
     * @return list<string>
     */
    public function suggestions(string $locale = 'en'): array
    {
        return match (strtolower(substr($locale, 0, 2))) {
            'fr' => [
                'Quel service marketing me convient ?',
                'Comment développer mon Instagram ?',
                'Ai-je besoin du SEO ?',
                'Génère des légendes pour mon business.',
                'Donne-moi des idées marketing.',
                'Réserver une consultation.',
            ],
            'ar' => [
                'ما هي خدمة التسويق المناسبة لعملي؟',
                'كيف أنمّي حساب إنستغرام؟',
                'هل أحتاج إلى تحسين محركات البحث؟',
                'أنشئ تعليقات لمنشوراتي.',
                'أعطني أفكار تسويقية.',
                'أحجز استشارة.',
            ],
            default => [
                'Which marketing service fits my business?',
                'How can I grow my Instagram?',
                'Do I need SEO?',
                'How much should I spend on ads?',
                'Generate captions for my business.',
                'Give me marketing ideas.',
                'Recommend the best package.',
                'Book a consultation.',
                'Type /book to start a booking.',
            ],
        };
    }

    private function resolveConversation(?string $sessionId, string $locale): AiConversation
    {
        if (is_string($sessionId) && $sessionId !== '') {
            $existing = AiConversation::query()->where('session_id', $sessionId)->first();
            if ($existing) {
                return $existing;
            }
        }

        return AiConversation::query()->create([
            'session_id' => (string) Str::uuid(),
            'locale' => $locale,
            'messages' => [],
            'visitor_profile' => [],
            'status' => 'active',
            'message_count' => 0,
            'last_message_at' => now(),
        ]);
    }

    /**
     * @param  list<array{role: string, content: string}>  $history
     * @return list<array{role: string, content: string}>
     */
    private function buildProviderMessages(
        AiConversation $conversation,
        array $history,
        string $latestUserMessage,
        string $locale,
    ): array {
        $knowledge = $this->knowledgeBase->compiledContext($latestUserMessage);
        $profile = is_array($conversation->visitor_profile) ? $conversation->visitor_profile : [];
        $memoryNotes = AiMemoryNote::query()
            ->latest()
            ->limit(12)
            ->pluck('note')
            ->filter(fn ($note): bool => is_string($note) && $note !== '')
            ->values()
            ->all();

        $system = SystemPrompt::build($knowledge, $locale, $profile, $memoryNotes);
        $trimmed = array_slice($history, -28);

        return [
            ['role' => 'system', 'content' => $system],
            ...$trimmed,
        ];
    }

    /**
     * @param  list<array{role: string, content: string}>  $history
     * @param  array{
     *     reply: string,
     *     profile: array<string, mixed>|null,
     *     lead: array<string, mixed>|null,
     *     memory: array<string, mixed>|null
     * }  $parsed
     * @return array{
     *     sessionId: string,
     *     reply: string,
     *     lead: array<string, mixed>|null,
     *     profile: array<string, mixed>,
     *     bookingCreated: bool,
     *     suggestions: list<string>
     * }
     */
    private function finalizeTurn(
        AiConversation $conversation,
        array $history,
        array $parsed,
        string $locale,
    ): array {
        $cleanReply = $parsed['reply'];
        $lead = $parsed['lead'];
        $bookingCreated = false;

        $history[] = ['role' => 'assistant', 'content' => $cleanReply];

        if (is_array($parsed['profile'])) {
            $conversation->visitor_profile = $this->mergeProfile(
                is_array($conversation->visitor_profile) ? $conversation->visitor_profile : [],
                $parsed['profile'],
            );
            $this->syncVisitorColumns($conversation, $conversation->visitor_profile);
        }

        if (is_array($lead)) {
            $conversation->lead_payload = $lead;
            $this->syncVisitorColumns($conversation, $lead);
            $bookingCreated = $this->maybeCreateBookingFromLead($conversation, $lead);
        }

        if (is_array($parsed['memory'])) {
            $this->storeMemoryNote($conversation, $parsed['memory']);
        }

        $conversation->messages = $history;
        $conversation->locale = $locale;
        $conversation->message_count = count($history);
        $conversation->preview = $this->previewFromHistory($history);
        $conversation->last_message_at = now();
        $conversation->save();

        return [
            'sessionId' => $conversation->session_id,
            'reply' => $cleanReply,
            'lead' => $lead,
            'profile' => is_array($conversation->visitor_profile) ? $conversation->visitor_profile : [],
            'bookingCreated' => $bookingCreated,
            'suggestions' => $this->suggestions($locale),
        ];
    }

    /**
     * @return list<array{role: string, content: string}>
     */
    private function normalizeHistory(mixed $messages): array
    {
        if (! is_array($messages)) {
            return [];
        }

        $normalized = [];

        foreach ($messages as $message) {
            if (! is_array($message)) {
                continue;
            }
            $role = $message['role'] ?? null;
            $content = $message['content'] ?? null;
            if (! is_string($role) || ! is_string($content)) {
                continue;
            }
            if (! in_array($role, ['user', 'assistant'], true)) {
                continue;
            }
            $normalized[] = ['role' => $role, 'content' => $content];
        }

        return $normalized;
    }

    /**
     * @param  list<array{role: string, content: string}>  $history
     */
    private function previewFromHistory(array $history): ?string
    {
        for ($i = count($history) - 1; $i >= 0; $i--) {
            if (($history[$i]['role'] ?? null) !== 'user') {
                continue;
            }

            $content = trim((string) ($history[$i]['content'] ?? ''));

            if ($content === '') {
                continue;
            }

            return mb_substr($content, 0, 140);
        }

        return null;
    }

    /**
     * @return array{
     *     reply: string,
     *     profile: array<string, mixed>|null,
     *     lead: array<string, mixed>|null,
     *     memory: array<string, mixed>|null
     * }
     */
    private function parseAssistantPayload(string $reply): array
    {
        $profile = $this->extractJsonBlock($reply, 'PROFILE');
        $lead = $this->extractJsonBlock($reply, 'LEAD');
        $memory = $this->extractJsonBlock($reply, 'MEMORY');

        $clean = preg_replace('/\[\[(PROFILE|LEAD|MEMORY):\{.*?\}\]\]/s', '', $reply) ?? $reply;

        return [
            'reply' => trim($clean),
            'profile' => $profile,
            'lead' => $lead,
            'memory' => $memory,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function extractJsonBlock(string $reply, string $tag): ?array
    {
        if (! preg_match('/\[\['.$tag.':(\{.*?\})\]\]/s', $reply, $matches)) {
            return null;
        }

        $decoded = json_decode($matches[1], true);

        return is_array($decoded) ? $decoded : null;
    }

    /**
     * @param  array<string, mixed>  $current
     * @param  array<string, mixed>  $incoming
     * @return array<string, mixed>
     */
    private function mergeProfile(array $current, array $incoming): array
    {
        foreach ($incoming as $key => $value) {
            if (! is_string($key)) {
                continue;
            }

            if (is_string($value)) {
                $trimmed = trim($value);
                if ($trimmed === '' || strtolower($trimmed) === 'unknown') {
                    continue;
                }
                $current[$key] = $trimmed;

                continue;
            }

            if (is_scalar($value) || is_array($value)) {
                $current[$key] = $value;
            }
        }

        return $current;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function syncVisitorColumns(AiConversation $conversation, array $data): void
    {
        if (isset($data['email']) && is_string($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $conversation->visitor_email = trim($data['email']);
        }

        if (isset($data['name']) && is_string($data['name']) && trim($data['name']) !== '') {
            $conversation->visitor_name = trim($data['name']);
        }
    }

    /**
     * @param  array<string, mixed>  $memory
     */
    private function storeMemoryNote(AiConversation $conversation, array $memory): void
    {
        $note = isset($memory['note']) && is_string($memory['note']) ? trim($memory['note']) : '';
        if ($note === '' || mb_strlen($note) < 12) {
            return;
        }

        // Never store personal contact details in shared memory.
        if (preg_match('/@|\\+?\\d{7,}/', $note)) {
            return;
        }

        $topic = isset($memory['topic']) && is_string($memory['topic'])
            ? Str::limit(strtolower(trim($memory['topic'])), 40, '')
            : 'general';

        AiMemoryNote::query()->create([
            'ai_conversation_id' => $conversation->id,
            'topic' => $topic !== '' ? $topic : 'general',
            'note' => Str::limit($note, 500),
            'usefulness' => 1,
        ]);
    }

    /**
     * @param  array<string, mixed>  $lead
     */
    private function maybeCreateBookingFromLead(AiConversation $conversation, array $lead): bool
    {
        if ($conversation->booking_id) {
            return false;
        }

        $name = isset($lead['name']) && is_string($lead['name']) ? trim($lead['name']) : '';
        $email = isset($lead['email']) && is_string($lead['email']) ? trim($lead['email']) : '';

        if ($name === '' || $email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $phone = isset($lead['phone']) && is_string($lead['phone']) ? trim($lead['phone']) : '';
        if ($phone === '' || strtolower($phone) === 'not provided') {
            return false;
        }

        $service = isset($lead['service']) && is_string($lead['service']) && trim($lead['service']) !== ''
            ? trim($lead['service'])
            : 'Marketing Consultation';

        $notesParts = [];
        foreach (['company', 'website', 'industry', 'goals', 'budget', 'timeline', 'notes', 'sells', 'challenge'] as $key) {
            if (isset($lead[$key]) && is_string($lead[$key]) && trim($lead[$key]) !== '') {
                $notesParts[] = ucfirst($key).': '.trim($lead[$key]);
            }
        }
        $notesParts[] = 'Source: Samah AI assistant (/book)';

        $booking = $this->createBooking->execute([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'service' => $service,
            'businessType' => isset($lead['industry']) && is_string($lead['industry'])
                ? $lead['industry']
                : (isset($lead['company']) && is_string($lead['company']) ? $lead['company'] : null),
            'notes' => implode("\n", $notesParts),
            'source' => 'ai_agent',
        ]);

        $conversation->booking_id = $booking->id;

        return true;
    }
}
