@component('emails.layouts.brand', [
    'title' => 'New AI booking',
    'heading' => 'New booking from Samah AI',
    'eyebrow' => 'AI agent lead',
    'ctaUrl' => 'mailto:'.$booking->email,
    'ctaLabel' => 'Reply to client',
    'footerNote' => 'This visitor talked with the AI agent and asked to book a service.',
])
    <p style="margin:0 0 18px;">
        A visitor completed a booking request through the Samah AI agent. Review the details below —
        this is a real booking in your database.
    </p>

    <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B06669;">
        Client details
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse;">
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;width:34%;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">{{ $booking->name }}</td>
        </tr>
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;">
                <a href="mailto:{{ $booking->email }}" style="color:#B06669;font-weight:600;text-decoration:none;">{{ $booking->email }}</a>
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#422B23;font-weight:600;">{{ $booking->phone }}</td>
        </tr>
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Service</td>
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
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;">
                <span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:#FBF6F6;color:#8F4F52;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">
                    AI agent
                </span>
            </td>
        </tr>
    </table>

    @if ($booking->notes)
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B06669;">
            Notes from the AI conversation
        </p>
        <p style="margin:0 0 8px;padding:14px 16px;background-color:#F7F3ED;border-radius:12px;color:#52392F;white-space:pre-wrap;">
            {{ $booking->notes }}
        </p>
    @endif

    <p style="margin:22px 0 0;">
        — {{ config('app.name') }} · AI bookings
    </p>
@endcomponent
