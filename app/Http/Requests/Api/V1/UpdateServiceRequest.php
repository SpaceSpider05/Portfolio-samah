<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
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
        $serviceId = $this->route('service')?->id;

        return [
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('services', 'slug')->ignore($serviceId)],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'hoverDemo' => ['sometimes', Rule::in(['seo', 'social', 'ads'])],
            'cta' => ['sometimes', 'string', 'max:255'],
            'isPublished' => ['sometimes', 'boolean'],
            'sortOrder' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
