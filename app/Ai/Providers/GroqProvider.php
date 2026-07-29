<?php

namespace App\Ai\Providers;

use App\Ai\Contracts\AiProvider;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GroqProvider implements AiProvider
{
    public function complete(array $messages): string
    {
        $response = $this->client()
            ->post('/chat/completions', [
                'model' => config('ai.model'),
                'temperature' => config('ai.temperature'),
                'max_tokens' => config('ai.max_tokens'),
                'messages' => $messages,
                'stream' => false,
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Groq request failed: '.$response->status().' '.$response->body()
            );
        }

        $content = $response->json('choices.0.message.content');

        if (! is_string($content) || $content === '') {
            throw new RuntimeException('Groq returned an empty completion.');
        }

        return $content;
    }

    public function stream(array $messages): \Generator
    {
        $response = $this->client()
            ->withOptions(['stream' => true])
            ->post('/chat/completions', [
                'model' => config('ai.model'),
                'temperature' => config('ai.temperature'),
                'max_tokens' => config('ai.max_tokens'),
                'messages' => $messages,
                'stream' => true,
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Groq stream failed: '.$response->status().' '.$response->body()
            );
        }

        $body = $response->toPsrResponse()->getBody();
        $buffer = '';

        while (! $body->eof()) {
            $buffer .= $body->read(1024);

            while (($pos = strpos($buffer, "\n")) !== false) {
                $line = trim(substr($buffer, 0, $pos));
                $buffer = substr($buffer, $pos + 1);

                if ($line === '' || ! str_starts_with($line, 'data:')) {
                    continue;
                }

                $payload = trim(substr($line, 5));

                if ($payload === '[DONE]') {
                    return;
                }

                $decoded = json_decode($payload, true);
                if (! is_array($decoded)) {
                    continue;
                }

                $delta = $decoded['choices'][0]['delta']['content'] ?? null;
                if (is_string($delta) && $delta !== '') {
                    yield $delta;
                }
            }
        }
    }

    private function client(): PendingRequest
    {
        $apiKey = config('ai.groq.api_key');

        if (! is_string($apiKey) || $apiKey === '') {
            throw new RuntimeException('GROQ_API_KEY is not configured.');
        }

        return Http::baseUrl((string) config('ai.groq.base_url'))
            ->withToken($apiKey)
            ->acceptJson()
            ->timeout((int) config('ai.timeout'))
            ->connectTimeout((int) config('ai.connect_timeout'))
            ->retry(2, 200, function (\Throwable $exception): bool {
                return $exception instanceof ConnectionException
                    || ($exception instanceof RequestException && $exception->response?->serverError());
            });
    }
}
