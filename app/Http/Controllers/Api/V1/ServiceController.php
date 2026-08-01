<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreServiceRequest;
use App\Http\Requests\Api\V1\UpdateServiceRequest;
use App\Http\Resources\Api\V1\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

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

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $service = Service::query()->create([
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'hover_demo' => $validated['hoverDemo'],
            'cta' => $validated['cta'],
            'is_published' => $validated['isPublished'] ?? true,
            'sort_order' => $validated['sortOrder'] ?? 0,
        ]);

        Cache::forget('stats.public');

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        $validated = $request->validated();

        $service->update([
            'slug' => $validated['slug'] ?? $service->slug,
            'title' => $validated['title'] ?? $service->title,
            'description' => $validated['description'] ?? $service->description,
            'hover_demo' => $validated['hoverDemo'] ?? $service->hover_demo,
            'cta' => $validated['cta'] ?? $service->cta,
            'is_published' => array_key_exists('isPublished', $validated)
                ? $validated['isPublished']
                : $service->is_published,
            'sort_order' => $validated['sortOrder'] ?? $service->sort_order,
        ]);

        Cache::forget('stats.public');

        return new ServiceResource($service->refresh());
    }

    public function destroy(Service $service): Response
    {
        $service->delete();

        Cache::forget('stats.public');

        return response()->noContent();
    }
}
