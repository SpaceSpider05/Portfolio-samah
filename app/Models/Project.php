<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'slug',
    'title',
    'client',
    'category',
    'summary',
    'challenge',
    'solution',
    'results',
    'technologies',
    'cover_image',
    'gallery_images',
    'video_preview',
    'is_published',
    'status',
    'sort_order',
])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'gallery_images' => '[]',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'results' => 'array',
            'technologies' => 'array',
            'gallery_images' => 'array',
            'is_published' => 'boolean',
            'status' => ProjectStatus::class,
        ];
    }

    /**
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Completed);
    }
}
