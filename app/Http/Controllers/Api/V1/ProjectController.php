<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $projects = Project::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return ProjectResource::collection($projects);
    }

    public function indexAll(): AnonymousResourceCollection
    {
        $projects = Project::query()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return ProjectResource::collection($projects);
    }

    public function show(Project $project): ProjectResource
    {
        abort_unless($project->is_published, 404);

        return new ProjectResource($project);
    }

    public function store(Request $request): ProjectResource
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:255', 'unique:projects,slug'],
            'title' => ['required', 'string', 'max:255'],
            'client' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'challenge' => ['required', 'string'],
            'solution' => ['required', 'string'],
            'results' => ['required', 'array'],
            'technologies' => ['required', 'array'],
            'coverImage' => ['required', 'string', 'max:255'],
            'videoPreview' => ['nullable', 'string', 'max:255'],
            'isPublished' => ['boolean'],
            'sortOrder' => ['integer', 'min:0'],
        ]);

        $project = Project::query()->create([
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'client' => $validated['client'],
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'challenge' => $validated['challenge'],
            'solution' => $validated['solution'],
            'results' => $validated['results'],
            'technologies' => $validated['technologies'],
            'cover_image' => $validated['coverImage'],
            'video_preview' => $validated['videoPreview'] ?? null,
            'is_published' => $validated['isPublished'] ?? true,
            'sort_order' => $validated['sortOrder'] ?? 0,
        ]);

        return new ProjectResource($project);
    }

    public function update(Request $request, Project $project): ProjectResource
    {
        $validated = $request->validate([
            'slug' => ['sometimes', 'string', 'max:255', 'unique:projects,slug,'.$project->id],
            'title' => ['sometimes', 'string', 'max:255'],
            'client' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'summary' => ['sometimes', 'string'],
            'challenge' => ['sometimes', 'string'],
            'solution' => ['sometimes', 'string'],
            'results' => ['sometimes', 'array'],
            'technologies' => ['sometimes', 'array'],
            'coverImage' => ['sometimes', 'string', 'max:255'],
            'videoPreview' => ['nullable', 'string', 'max:255'],
            'isPublished' => ['boolean'],
            'sortOrder' => ['integer', 'min:0'],
        ]);

        $project->update([
            'slug' => $validated['slug'] ?? $project->slug,
            'title' => $validated['title'] ?? $project->title,
            'client' => $validated['client'] ?? $project->client,
            'category' => $validated['category'] ?? $project->category,
            'summary' => $validated['summary'] ?? $project->summary,
            'challenge' => $validated['challenge'] ?? $project->challenge,
            'solution' => $validated['solution'] ?? $project->solution,
            'results' => $validated['results'] ?? $project->results,
            'technologies' => $validated['technologies'] ?? $project->technologies,
            'cover_image' => $validated['coverImage'] ?? $project->cover_image,
            'video_preview' => array_key_exists('videoPreview', $validated) ? $validated['videoPreview'] : $project->video_preview,
            'is_published' => $validated['isPublished'] ?? $project->is_published,
            'sort_order' => $validated['sortOrder'] ?? $project->sort_order,
        ]);

        return new ProjectResource($project);
    }

    public function destroy(Project $project): Response
    {
        $project->delete();

        return response()->noContent();
    }
}
