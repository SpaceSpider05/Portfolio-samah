<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service' => fake()->randomElement([
                'SEO Growth Systems',
                'Social Content Engines',
                'Paid Acquisition',
            ]),
            'business_type' => fake()->randomElement(['SaaS', 'E-commerce', 'Agency', 'Local business']),
            'goals' => [fake()->sentence(3), fake()->sentence(4)],
            'scheduled_at' => null,
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->e164PhoneNumber(),
            'status' => 'pending',
            'notes' => fake()->paragraph(),
        ];
    }
}
