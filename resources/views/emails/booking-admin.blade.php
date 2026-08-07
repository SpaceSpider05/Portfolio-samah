@component('emails.layouts.brand', [
    'title' => 'New booking',
    'heading' => 'New book-a-call request',
    'eyebrow' => 'Admin notification',
    'ctaUrl' => 'mailto:'.$booking->email,
    'ctaLabel' => 'Reply to client',
    'footerNote' => "Tip: use Reply in your inbox — this email is set to reply directly to the client.",
])
    <p style="margin:0 0 18px;">
        A new consultation booking just landed. Review the details below and reply when you're ready.
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
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;color:#96836D;">Status</td>
            <td style="padding:10px 0;border-bottom:1px solid #EFE8DE;">
                <span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:#FBF6F6;color:#8F4F52;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">
                    {{ $booking->status }}
                </span>
            </td>
        </tr>
    </table>

    @if ($booking->notes)
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B06669;">
            Notes
        </p>
        <p style="margin:0 0 8px;padding:14px 16px;background-color:#F7F3ED;border-radius:12px;color:#52392F;">
            {{ $booking->notes }}
        </p>
    @endif
@endcomponent
