<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'photoUrl' => ['required', 'string', 'max:2048'],
            'bio' => ['required', 'string'],
            'mission' => ['required', 'string'],
            'timeline' => ['required', 'array', 'max:20'],
            'timeline.*.year' => ['required', 'string', 'max:20'],
            'timeline.*.title' => ['required', 'string', 'max:255'],
            'timeline.*.description' => ['required', 'string'],
            'achievements' => ['required', 'array', 'max:12'],
            'achievements.*.label' => ['required', 'string', 'max:255'],
            'achievements.*.value' => ['required', 'integer', 'min:0'],
            'achievements.*.suffix' => ['nullable', 'string', 'max:20'],
        ];
    }
}
