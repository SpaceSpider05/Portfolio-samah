<?php

namespace App\Support;

class ProjectGallery
{
    /**
     * Normalize gallery payloads from legacy string paths or object entries.
     *
     * @return list<array{path: string, description: string}>
     */
    public static function normalize(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        $normalized = [];

        foreach ($items as $item) {
            if (is_string($item) && $item !== '') {
                $normalized[] = [
                    'path' => $item,
                    'description' => '',
                ];

                continue;
            }

            if (! is_array($item)) {
                continue;
            }

            $path = $item['path'] ?? $item['url'] ?? $item['src'] ?? null;

            if (! is_string($path) || $path === '') {
                continue;
            }

            $description = $item['description'] ?? $item['caption'] ?? '';

            $normalized[] = [
                'path' => $path,
                'description' => is_string($description) ? $description : '',
            ];
        }

        return array_values($normalized);
    }

    /**
     * @param  list<array{path: string, description: string}>  $items
     * @return list<array{path: string|null, description: string}>
     */
    public static function resolveForApi(array $items): array
    {
        return array_map(
            fn (array $item) => [
                'path' => MediaUrl::resolve($item['path']),
                'description' => $item['description'],
            ],
            $items,
        );
    }
}
