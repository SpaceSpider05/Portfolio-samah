<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $services = Service::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return ServiceResource::collection($services);
    }

    public function indexAll(): AnonymousResourceCollection
    {
        $services = Service::query()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return ServiceResource::collection($services);
    }

    public function store(Request $request): ServiceResource
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:255', 'unique:services,slug'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'hoverDemo' => ['required', 'in:seo,social,ads'],
            'cta' => ['required', 'string', 'max:255'],
            'isPublished' => ['boolean'],
            'sortOrder' => ['integer', 'min:0'],
        ]);

        $service = Service::query()->create([
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'hover_demo' => $validated['hoverDemo'],
            'cta' => $validated['cta'],
            'is_published' => $validated['isPublished'] ?? true,
            'sort_order' => $validated['sortOrder'] ?? 0,
        ]);

        return new ServiceResource($service);
    }

    public function update(Request $request, Service $service): ServiceResource
    {
        $validated = $request->validate([
            'slug' => ['sometimes', 'string', 'max:255', 'unique:services,slug,'.$service->id],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'hoverDemo' => ['sometimes', 'in:seo,social,ads'],
            'cta' => ['sometimes', 'string', 'max:255'],
            'isPublished' => ['boolean'],
            'sortOrder' => ['integer', 'min:0'],
        ]);

        $service->update([
            'slug' => $validated['slug'] ?? $service->slug,
            'title' => $validated['title'] ?? $service->title,
            'description' => $validated['description'] ?? $service->description,
            'hover_demo' => $validated['hoverDemo'] ?? $service->hover_demo,
            'cta' => $validated['cta'] ?? $service->cta,
            'is_published' => $validated['isPublished'] ?? $service->is_published,
            'sort_order' => $validated['sortOrder'] ?? $service->sort_order,
        ]);

        return new ServiceResource($service);
    }

    public function destroy(Service $service): Response
    {
        $service->delete();

        return response()->noContent();
    }
}
