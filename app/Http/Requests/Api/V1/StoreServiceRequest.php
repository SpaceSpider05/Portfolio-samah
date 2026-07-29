<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:255', 'unique:services,slug'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'hoverDemo' => ['required', Rule::in(['seo', 'social', 'ads'])],
            'cta' => ['required', 'string', 'max:255'],
            'isPublished' => ['sometimes', 'boolean'],
            'sortOrder' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
