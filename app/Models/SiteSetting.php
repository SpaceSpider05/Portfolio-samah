<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'contact_email',
    'contact_phone',
    'booking_notify_email',
    'mail_from_name',
])]
class SiteSetting extends Model
{
    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    public static function current(): self
    {
        $existing = static::query()->first();

        if ($existing) {
            return $existing;
        }

        return static::query()->create([
            'contact_email' => (string) config('mail.from.address', 'hello@samah.studio'),
            'contact_phone' => null,
            'booking_notify_email' => (string) config('mail.admin_address', config('mail.from.address')),
            'mail_from_name' => (string) config('mail.from.name', 'Samah'),
        ]);
    }
}
