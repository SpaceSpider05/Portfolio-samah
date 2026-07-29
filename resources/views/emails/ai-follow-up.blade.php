@php
    $frontendUrl = $frontendUrl ?? rtrim((string) config('app.frontend_url'), '/');
    $paragraphs = preg_split("/\n\s*\n/", trim($bodyText)) ?: [trim($bodyText)];
@endphp

@component('emails.layouts.brand', [
    'title' => 'A note from Samah',
    'heading' => 'Let’s continue the conversation',
    'eyebrow' => 'Personal follow-up',
    'ctaUrl' => $frontendUrl.'/book',
    'ctaLabel' => 'Book a consultation',
    'footerNote' => 'You received this because you chatted with Samah AI on the website. Reply anytime — a real human is here.',
])
    @foreach ($paragraphs as $paragraph)
        <p style="margin:0 0 16px;white-space:pre-wrap;">{{ $paragraph }}</p>
    @endforeach
@endcomponent
