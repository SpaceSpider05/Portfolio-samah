<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
        $projectId = $this->route('project')?->id;

        return [
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($projectId)],
            'title' => ['sometimes', 'string', 'max:255'],
            'client' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'summary' => ['sometimes', 'string'],
            'challenge' => ['sometimes', 'string'],
            'solution' => ['sometimes', 'string'],
            'results' => ['sometimes', 'array', 'min:1'],
            'results.*' => ['string', 'max:255'],
            'technologies' => ['sometimes', 'array', 'min:1'],
            'technologies.*' => ['string', 'max:120'],
            'coverImage' => ['sometimes', 'string', 'max:2048'],
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
