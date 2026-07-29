<x-mail::message>
# New booking request

A new consultation request just came in.

**Name:** {{ $booking->name }}  
**Email:** {{ $booking->email }}  
**Phone:** {{ $booking->phone }}  
**Service:** {{ $booking->service }}  
@if ($booking->business_type)
**Business type:** {{ $booking->business_type }}  
@endif
**Status:** {{ $booking->status }}

@if ($booking->notes)
**Notes:**  
{{ $booking->notes }}
@endif

Reply directly to this email to contact the client.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
