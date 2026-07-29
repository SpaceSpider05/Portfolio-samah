<?php

namespace App\Http\Controllers\Api\V1;

use App\Ai\Services\AiAssistantService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AiChatRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiChatController extends Controller
{
    public function suggestions(AiAssistantService $assistant): JsonResponse
    {
        $locale = request()->string('locale')->toString() ?: 'en';

        return response()->json([
            'assistant' => config('ai.assistant_name'),
            'enabled' => (bool) config('ai.enabled'),
            'suggestions' => $assistant->suggestions($locale),
        ]);
    }

    public function chat(AiChatRequest $request, AiAssistantService $assistant): JsonResponse|StreamedResponse
    {
        if (! config('ai.enabled')) {
            return response()->json([
                'message' => 'Samah AI is temporarily unavailable. Please book a consultation instead.',
            ], 503);
        }

        $validated = $request->validated();
        $message = $validated['message'];
        $sessionId = $validated['sessionId'] ?? null;
        $locale = $validated['locale'] ?? 'en';
        $stream = (bool) ($validated['stream'] ?? true);

        if (! $stream) {
            $result = $assistant->chat($message, $sessionId, $locale);

            return response()->json($result);
        }

        return response()->stream(function () use ($assistant, $message, $sessionId, $locale): void {
            foreach ($assistant->streamChat($message, $sessionId, $locale) as $event) {
                echo 'event: '.$event['event']."\n";
                echo 'data: '.json_encode($event['data'], JSON_UNESCAPED_UNICODE)."\n\n";

                if (function_exists('ob_flush')) {
                    @ob_flush();
                }
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream; charset=utf-8',
            'Cache-Control' => 'no-cache, no-transform',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }
}
