<?php

namespace App\Ai\Contracts;

interface AiProvider
{
    /**
     * @param  list<array{role: string, content: string}>  $messages
     */
    public function complete(array $messages): string;

    /**
     * Stream assistant tokens. Yields plain text chunks.
     *
     * @param  list<array{role: string, content: string}>  $messages
     * @return \Generator<int, string>
     */
    public function stream(array $messages): \Generator;
}
