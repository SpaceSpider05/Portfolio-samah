<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
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
            'description' => fake()->paragraph(),
            'hover_demo' => fake()->randomElement(['seo', 'social', 'ads']),
            'cta' => fake()->words(3, true),
            'is_published' => true,
            'sort_order' => 0,
        ];
    }
}
