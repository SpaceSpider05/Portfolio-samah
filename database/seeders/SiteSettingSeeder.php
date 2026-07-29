<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'contact_email' => 'hello@samah.studio',
                'contact_phone' => '+1 (555) 010-2040',
                'booking_notify_email' => 'admin@samah.studio',
                'mail_from_name' => 'Samah',
            ],
        );
    }
}
