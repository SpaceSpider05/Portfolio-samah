<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Booking
 */
class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'service' => $this->service,
            'businessType' => $this->business_type,
            'goals' => $this->goals,
            'scheduledAt' => $this->scheduled_at?->toIso8601String(),
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
