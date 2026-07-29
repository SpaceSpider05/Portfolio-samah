<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Service
 */
class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'hoverDemo' => $this->hover_demo,
            'cta' => $this->cta,
            'isPublished' => (bool) $this->is_published,
            'sortOrder' => (int) $this->sort_order,
        ];
    }
}
