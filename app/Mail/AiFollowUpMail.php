<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AiFollowUpMail extends Mailable
{
    use SerializesModels;

    public function __construct(
        public string $visitorName,
        public string $subjectLine,
        public string $bodyText,
        public ?string $summary = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.ai-follow-up',
            with: [
                'visitorName' => $this->visitorName,
                'bodyText' => $this->bodyText,
                'summary' => $this->summary,
                'frontendUrl' => rtrim((string) config('app.frontend_url'), '/'),
            ],
        );
    }

    /**
     * @return array<int, mixed>
     */
    public function attachments(): array
    {
        return [];
    }
}
