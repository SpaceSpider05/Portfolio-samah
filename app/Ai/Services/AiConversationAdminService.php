<?php

namespace App\Ai\Services;

use App\Ai\Contracts\AiProvider;
use App\Mail\AiFollowUpMail;
use App\Models\AiConversation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use RuntimeException;

class AiConversationAdminService
{
    public function __construct(private AiProvider $provider) {}

    public function summarize(AiConversation $conversation): AiConversation
    {
        $transcript = $this->transcript($conversation);

        if ($transcript === '') {
            throw new RuntimeException('This conversation has no messages to summarize.');
        }

        $profile = is_array($conversation->visitor_profile)
            ? json_encode($conversation->visitor_profile, JSON_UNESCAPED_UNICODE)
            : '{}';

        $prompt = <<<PROMPT
Summarize this website chat between a visitor and Samah AI for the human agency owner.

Return 5-8 short bullet points covering:
- who the visitor is
- business / offer
- goals and challenges
- services they care about
- readiness / next step
- any contact details mentioned

Be factual. Do not invent details.

Visitor profile JSON: {$profile}

Transcript:
{$transcript}
PROMPT;

        $summary = trim($this->provider->complete([
            ['role' => 'system', 'content' => 'You write concise CRM summaries for a digital marketing agency.'],
            ['role' => 'user', 'content' => $prompt],
        ]));

        $conversation->summary = Str::limit($summary, 5000);
        $conversation->save();

        return $conversation->fresh() ?? $conversation;
    }

    /**
     * @param  array{subject?: string|null, message?: string|null}  $options
     */
    public function sendFollowUp(AiConversation $conversation, array $options = []): AiConversation
    {
        $email = $conversation->visitor_email;
        if (! is_string($email) || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('This conversation has no valid visitor email yet.');
        }

        $name = $conversation->visitor_name ?: 'there';
        $subject = isset($options['subject']) && is_string($options['subject']) && trim($options['subject']) !== ''
            ? trim($options['subject'])
            : 'Following up on your chat with Samah AI';

        $message = isset($options['message']) && is_string($options['message']) && trim($options['message']) !== ''
            ? trim($options['message'])
            : $this->defaultFollowUpBody($conversation, $name);

        Mail::to($email)->send(new AiFollowUpMail(
            visitorName: $name,
            subjectLine: $subject,
            bodyText: $message,
            summary: $conversation->summary,
        ));

        $conversation->follow_up_sent_at = now();
        $conversation->save();

        return $conversation->fresh() ?? $conversation;
    }

    public function draftFollowUp(AiConversation $conversation): string
    {
        $name = $conversation->visitor_name ?: 'there';
        $summary = $conversation->summary ?: $this->transcript($conversation, 1800);

        $prompt = <<<PROMPT
Write a warm, premium follow-up email body (no subject line) from Samah to {$name}.

Goals:
- Mention you noticed they chatted with Samah AI on the website
- Reference their situation using the summary/transcript (only real details)
- Offer a real human conversation / consultation
- Keep it short (120-160 words), confident, not pushy
- End with an open invitation to reply

Summary / context:
{$summary}
PROMPT;

        return trim($this->provider->complete([
            ['role' => 'system', 'content' => 'You write concise, premium client outreach emails for a digital marketing consultant named Samah.'],
            ['role' => 'user', 'content' => $prompt],
        ]));
    }

    private function defaultFollowUpBody(AiConversation $conversation, string $name): string
    {
        $interest = null;
        if (is_array($conversation->visitor_profile)) {
            $interest = $conversation->visitor_profile['interest']
                ?? $conversation->visitor_profile['goals']
                ?? null;
        }

        $interestLine = is_string($interest) && $interest !== ''
            ? " I noticed you were exploring {$interest}."
            : '';

        return "Hi {$name},\n\n"
            ."I saw you spoke with Samah AI on my website.{$interestLine} "
            ."I'd love to help personally if you want a real conversation with a human — "
            ."strategy, next steps, or a clear plan for your marketing.\n\n"
            ."I'm happy to jump on a call whenever it suits you.\n\n"
            ."Warmly,\nSamah";
    }

    private function transcript(AiConversation $conversation, int $limit = 8000): string
    {
        $messages = is_array($conversation->messages) ? $conversation->messages : [];
        $lines = [];

        foreach ($messages as $message) {
            if (! is_array($message)) {
                continue;
            }
            $role = $message['role'] ?? null;
            $content = $message['content'] ?? null;
            if (! is_string($role) || ! is_string($content) || trim($content) === '') {
                continue;
            }
            $label = $role === 'assistant' ? 'AI' : 'Visitor';
            $lines[] = $label.': '.trim($content);
        }

        return Str::limit(implode("\n\n", $lines), $limit);
    }
}
