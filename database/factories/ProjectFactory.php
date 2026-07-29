<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'slug' => Str::slug($title),
            'title' => Str::title($title),
            'client' => fake()->company(),
            'category' => fake()->randomElement(['Brand + Performance', 'Demand Gen', 'Content']),
            'summary' => fake()->sentence(12),
            'challenge' => fake()->paragraph(),
            'solution' => fake()->paragraph(),
            'results' => ['+40% traffic', '2.1x ROAS', '-20% CAC'],
            'technologies' => ['Next.js', 'Meta Ads', 'GA4'],
            'cover_image' => '/images/project-lumen.svg',
            'gallery_images' => [],
            'video_preview' => null,
            'is_published' => true,
            'status' => ProjectStatus::Completed,
            'sort_order' => 0,
        ];
    }
}
