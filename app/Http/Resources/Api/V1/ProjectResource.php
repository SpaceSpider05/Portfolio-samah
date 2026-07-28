<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Project
 */
class ProjectResource extends JsonResource
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
            'client' => $this->client,
            'category' => $this->category,
            'summary' => $this->summary,
            'challenge' => $this->challenge,
            'solution' => $this->solution,
            'results' => $this->results,
            'technologies' => $this->technologies,
            'coverImage' => $this->cover_image,
            'videoPreview' => $this->video_preview,
        ];
    }
}
