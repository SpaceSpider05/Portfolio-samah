<?php

namespace App\Support;

class MediaUrl
{
    public static function resolve(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/images/')) {
            return $path;
        }

        if (str_starts_with($path, '/storage/')) {
            return rtrim((string) config('app.url'), '/').$path;
        }

        return rtrim((string) config('app.url'), '/').'/storage/'.ltrim($path, '/');
    }
}
