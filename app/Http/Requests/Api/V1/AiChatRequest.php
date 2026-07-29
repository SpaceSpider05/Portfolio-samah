<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class AiChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'min:1', 'max:4000'],
            'sessionId' => ['nullable', 'uuid'],
            'locale' => ['nullable', 'string', 'max:8'],
            'stream' => ['sometimes', 'boolean'],
        ];
    }
}
