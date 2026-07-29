<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Project;
use App\Support\MediaUrl;
use App\Support\ProjectGallery;
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
            'coverImage' => MediaUrl::resolve($this->cover_image),
            'galleryImages' => ProjectGallery::resolveForApi(
                ProjectGallery::normalize($this->gallery_images),
            ),
            'videoPreview' => $this->video_preview,
            'isPublished' => (bool) $this->is_published,
            'status' => $this->status?->value ?? 'completed',
            'sortOrder' => (int) $this->sort_order,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
