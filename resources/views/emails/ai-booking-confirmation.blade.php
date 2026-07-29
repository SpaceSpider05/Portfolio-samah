@php
    $frontendUrl = $frontendUrl ?? rtrim((string) config('app.frontend_url'), '/');
@endphp

@component('emails.layouts.brand', [
    'title' => 'Request received',
    'heading' => 'Thanks for reaching out through Samah AI',
    'eyebrow' => 'Agent-assisted booking',
    'ctaUrl' => $frontendUrl.'/book',
    'ctaLabel' => 'Visit booking page',
    'footerNote' => 'You contacted us through our AI assistant. A real human will follow up shortly.',
])
    <p style="margin:0 0 16px;">Hi {{ $booking->name }},</p>

    <p style="margin:0 0 16px;">
        Thank you for contacting us through our agent assistant. We’re really happy you reached out —
        your request has been saved and our team has been notified.
    </p>

    <p style="margin:0 0 22px;padding:14px 16px;background-color:#FBF6F6;border-left:4px solid #DBA1A2;border-radius:0 12px 12px 0;">
        We’ll follow up within <strong>24 hours</strong> to tell you what’s next.
    </p>

    <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B06669;">
        What we received
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse;">
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;width:34%;">Service</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">{{ $booking->service }}</td>
        </tr>
        @if ($booking->business_type)
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Business</td>
                <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">{{ $booking->business_type }}</td>
            </tr>
        @endif
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Source</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">Samah AI assistant</td>
        </tr>
    </table>

    <p style="margin:0;">Talk soon,<br><strong>{{ config('app.name') }}</strong></p>
@endcomponent
