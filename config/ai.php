<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | Supported: "groq" (swap via AiServiceProvider binding later).
    |
    */

    'provider' => env('AI_PROVIDER', 'groq'),

    'enabled' => (bool) env('AI_ENABLED', true),

    'model' => env('AI_MODEL', 'llama-3.3-70b-versatile'),

    'temperature' => (float) env('AI_TEMPERATURE', 0.5),

    'max_tokens' => (int) env('AI_MAX_TOKENS', 1200),

    'timeout' => (int) env('AI_TIMEOUT', 45),

    'connect_timeout' => (int) env('AI_CONNECT_TIMEOUT', 10),

    'knowledge_path' => env('AI_KNOWLEDGE_PATH', base_path('knowledge')),

    'assistant_name' => env('AI_ASSISTANT_NAME', 'Samah AI'),

    'booking_path' => env('AI_BOOKING_PATH', '/book'),

    'groq' => [
        'api_key' => env('GROQ_API_KEY'),
        'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
    ],

];
