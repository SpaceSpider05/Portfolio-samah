<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ProjectStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreProjectRequest;
use App\Http\Requests\Api\V1\UpdateProjectRequest;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use App\Support\ProjectGallery;
use Illuminate\Http\JsonResponse;
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

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $validated = $request->validated();

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
            'gallery_images' => ProjectGallery::normalize($validated['galleryImages'] ?? []),
            'video_preview' => $validated['videoPreview'] ?? null,
            'is_published' => $validated['isPublished'] ?? true,
            'status' => $validated['status'] ?? ProjectStatus::Completed,
            'sort_order' => $validated['sortOrder'] ?? 0,
        ]);

        return (new ProjectResource($project))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateProjectRequest $request, Project $project): ProjectResource
    {
        $validated = $request->validated();

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
            'gallery_images' => array_key_exists('galleryImages', $validated)
                ? ProjectGallery::normalize($validated['galleryImages'])
                : $project->gallery_images,
            'video_preview' => array_key_exists('videoPreview', $validated)
                ? $validated['videoPreview']
                : $project->video_preview,
            'is_published' => array_key_exists('isPublished', $validated)
                ? $validated['isPublished']
                : $project->is_published,
            'status' => $validated['status'] ?? $project->status,
            'sort_order' => $validated['sortOrder'] ?? $project->sort_order,
        ]);

        return new ProjectResource($project->refresh());
    }

    public function destroy(Project $project): Response
    {
        $project->delete();

        return response()->noContent();
    }
}
