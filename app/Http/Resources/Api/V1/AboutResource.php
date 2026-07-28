<?php

namespace App\Http\Resources\Api\V1;

use App\Models\AboutProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AboutProfile
 */
class AboutResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'role' => $this->role,
            'photoUrl' => $this->photo_url,
            'bio' => $this->bio,
            'mission' => $this->mission,
            'timeline' => $this->timelineEvents->map(fn ($event) => [
                'id' => (string) $event->id,
                'year' => $event->year,
                'title' => $event->title,
                'description' => $event->description,
            ])->values(),
            'achievements' => $this->achievements->map(fn ($item) => [
                'id' => (string) $item->id,
                'label' => $item->label,
                'value' => $item->value,
                'suffix' => $item->suffix,
            ])->values(),
        ];
    }
}
