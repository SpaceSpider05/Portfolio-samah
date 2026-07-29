@php
    $frontendUrl = $frontendUrl ?? rtrim((string) config('app.frontend_url'), '/');
@endphp

@component('emails.layouts.brand', [
    'title' => 'Booking received',
    'heading' => 'We received your booking',
    'eyebrow' => 'Consultation request confirmed',
    'ctaUrl' => $frontendUrl.'/book',
    'ctaLabel' => 'Book another call',
    'footerNote' => 'Need to add details? Just reply to this email and we’ll include them before our follow-up.',
])
    <p style="margin:0 0 16px;">Hi {{ $booking->name }},</p>

    <p style="margin:0 0 16px;">
        Thank you for booking a call with <strong>{{ config('app.name') }}</strong>.
        We’ve got your request and will review it carefully.
    </p>

    <p style="margin:0 0 22px;padding:14px 16px;background-color:#FBF6F6;border-left:4px solid #DBA1A2;border-radius:0 12px 12px 0;">
        We’ll get back to you <strong>within 24 hours</strong>.
    </p>

    <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B06669;">
        Your booking summary
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
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">{{ $booking->phone }}</td>
        </tr>
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">{{ $booking->email }}</td>
        </tr>
    </table>

    @if ($booking->notes)
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B06669;">
            What you shared
        </p>
        <p style="margin:0 0 8px;padding:14px 16px;background-color:#F7F3ED;border-radius:12px;color:#52392F;">
            {{ $booking->notes }}
        </p>
    @endif

    <p style="margin:22px 0 0;">
        Talk soon,<br>
        <strong>{{ config('app.name') }}</strong>
    </p>
@endcomponent
