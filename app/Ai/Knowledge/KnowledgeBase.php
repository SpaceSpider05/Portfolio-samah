<?php

namespace App\Ai\Knowledge;

use Illuminate\Support\Facades\File;

class KnowledgeBase
{
    /**
     * @return array<string, string>
     */
    public function documents(): array
    {
        $path = (string) config('ai.knowledge_path');

        if (! File::isDirectory($path)) {
            return [];
        }

        $documents = [];

        foreach (File::files($path) as $file) {
            if (strtolower($file->getExtension()) !== 'md') {
                continue;
            }

            $documents[$file->getFilenameWithoutExtension()] = File::get($file->getPathname());
        }

        ksort($documents);

        return $documents;
    }

    public function compiledContext(?string $query = null): string
    {
        $documents = $this->documents();

        if ($documents === []) {
            return 'No knowledge documents are available.';
        }

        if ($query) {
            $documents = $this->rankRelevant($documents, $query);
        }

        $sections = [];

        foreach ($documents as $name => $body) {
            $sections[] = "## {$name}\n\n".trim($body);
        }

        return implode("\n\n---\n\n", $sections);
    }

    /**
     * @param  array<string, string>  $documents
     * @return array<string, string>
     */
    private function rankRelevant(array $documents, string $query): array
    {
        $tokens = preg_split('/\W+/u', mb_strtolower($query), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $tokens = array_values(array_unique(array_filter(
            $tokens,
            fn (string $token): bool => mb_strlen($token) > 2
        )));

        if ($tokens === []) {
            return $documents;
        }

        $scored = [];

        foreach ($documents as $name => $body) {
            $haystack = mb_strtolower($name.' '.$body);
            $score = 0;

            foreach ($tokens as $token) {
                $score += substr_count($haystack, $token);
            }

            $scored[$name] = ['score' => $score, 'body' => $body];
        }

        uasort($scored, fn (array $a, array $b): int => $b['score'] <=> $a['score']);

        $top = array_slice($scored, 0, 6, true);
        $relevant = [];

        foreach ($top as $name => $item) {
            if ($item['score'] === 0 && count($relevant) >= 3) {
                continue;
            }
            $relevant[$name] = $item['body'];
        }

        return $relevant !== [] ? $relevant : $documents;
    }
}
