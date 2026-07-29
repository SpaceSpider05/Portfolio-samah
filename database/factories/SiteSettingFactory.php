<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSetting>
 */
class SiteSettingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contact_email' => 'hello@samah.studio',
            'contact_phone' => '+1 (555) 010-2040',
            'booking_notify_email' => 'admin@samah.studio',
            'mail_from_name' => 'Samah',
        ];
    }
}
