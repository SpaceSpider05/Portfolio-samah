<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@samah.studio'],
            [
                'name' => 'Samah Admin',
                'password' => 'admin123',
                'is_admin' => true,
            ],
        );
    }
}
