<x-mail::message>
# Booking confirmed

Hi {{ $booking->name }},

Thanks for booking with **{{ config('app.name') }}**. We’ve received your request and will follow up shortly.

**Service:** {{ $booking->service }}
@if ($booking->business_type)
**Business:** {{ $booking->business_type }}
@endif
**Phone:** {{ $booking->phone }}
**Email:** {{ $booking->email }}

@if ($booking->notes)
**What you shared:**
{{ $booking->notes }}
@endif

<x-mail::button :url="$frontendUrl . '/book'">
View booking page
</x-mail::button>

If anything looks off, reply to this email and we’ll help right away.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
