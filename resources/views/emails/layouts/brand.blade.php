<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <title>{{ $title ?? config('app.name') }}</title>
</head>
@php
    $siteUrl = rtrim((string) config('app.frontend_url'), '/');
    $logoUrl = $siteUrl.'/images/email-logo.png';
@endphp
<body style="margin:0;padding:0;background-color:#F7F3ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#52392F;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3ED;margin:0;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#422B23;border-radius:24px 24px 0 0;">
                    <tr>
                        <td style="padding:28px 32px 22px;text-align:center;">
                            <a href="{{ $siteUrl }}" style="text-decoration:none;display:inline-block;">
                                <img
                                    src="{{ $logoUrl }}"
                                    width="160"
                                    height="48"
                                    alt="{{ config('app.name') }}"
                                    style="display:block;margin:0 auto 14px;border:0;outline:none;text-decoration:none;height:auto;max-width:160px;"
                                >
                            </a>
                            <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#DBA1A2;">
                                Digital Marketing Strategist
                            </p>
                            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;font-weight:700;color:#F7F3ED;">
                                {{ $heading }}
                            </h1>
                            @isset($eyebrow)
                                <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#EFD8D6;">
                                    {{ $eyebrow }}
                                </p>
                            @endisset
                        </td>
                    </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:0 0 24px 24px;overflow:hidden;border:1px solid #E4D9C9;border-top:0;">
                    <tr>
                        <td style="height:4px;background-color:#DBA1A2;font-size:0;line-height:0;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="padding:28px 32px 8px;color:#52392F;font-size:15px;line-height:1.65;">
                            {{ $slot }}
                        </td>
                    </tr>

                    @isset($ctaUrl)
                        <tr>
                            <td align="center" style="padding:8px 32px 28px;">
                                <a href="{{ $ctaUrl }}"
                                   style="display:inline-block;background-color:#DBA1A2;color:#422B23;text-decoration:none;font-weight:600;font-size:14px;padding:14px 28px;border-radius:999px;">
                                    {{ $ctaLabel ?? 'Open site' }}
                                </a>
                            </td>
                        </tr>
                    @endisset

                    <tr>
                        <td style="padding:0 32px 28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3ED;border-radius:16px;">
                                <tr>
                                    <td style="padding:16px 18px;font-size:13px;line-height:1.5;color:#6F6151;">
                                        {{ $footerNote ?? 'Reply to this email if you need anything else.' }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
                    <tr>
                        <td align="center" style="padding:20px 12px 0;font-size:12px;line-height:1.5;color:#96836D;">
                            &copy; {{ date('Y') }} Grow With Samah. All rights reserved.<br>
                            <a href="{{ $siteUrl }}" style="color:#B06669;text-decoration:none;">growwithsamah.com</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
