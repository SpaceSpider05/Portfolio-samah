<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:255', 'unique:projects,slug'],
            'title' => ['required', 'string', 'max:255'],
            'client' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'challenge' => ['required', 'string'],
            'solution' => ['required', 'string'],
            'results' => ['required', 'array', 'min:1'],
            'results.*' => ['string', 'max:255'],
            'technologies' => ['required', 'array', 'min:1'],
            'technologies.*' => ['string', 'max:120'],
            'coverImage' => ['required', 'string', 'max:2048'],
            'galleryImages' => ['sometimes', 'array', 'max:24'],
            'galleryImages.*.path' => ['required_with:galleryImages', 'string', 'max:2048'],
            'galleryImages.*.description' => ['nullable', 'string', 'max:500'],
            'videoPreview' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', Rule::enum(ProjectStatus::class)],
            'isPublished' => ['sometimes', 'boolean'],
            'sortOrder' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
