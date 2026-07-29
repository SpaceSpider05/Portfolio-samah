<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateAboutRequest;
use App\Http\Resources\Api\V1\AboutResource;
use App\Models\AboutProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AboutController extends Controller
{
    public function show(): JsonResponse
    {
        return (new AboutResource($this->activeAbout()))->response();
    }

    public function showManage(): JsonResponse
    {
        return (new AboutResource($this->activeAbout()))->response();
    }

    public function update(UpdateAboutRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $about = $this->activeAbout();

        DB::transaction(function () use ($about, $validated): void {
            $about->update([
                'name' => $validated['name'],
                'role' => $validated['role'],
                'photo_url' => $validated['photoUrl'],
                'bio' => $validated['bio'],
                'mission' => $validated['mission'],
            ]);

            $about->timelineEvents()->delete();
            $about->achievements()->delete();

            foreach ($validated['timeline'] as $index => $event) {
                $about->timelineEvents()->create([
                    'year' => $event['year'],
                    'title' => $event['title'],
                    'description' => $event['description'],
                    'sort_order' => $index,
                ]);
            }

            foreach ($validated['achievements'] as $index => $item) {
                $about->achievements()->create([
                    'label' => $item['label'],
                    'value' => $item['value'],
                    'suffix' => $item['suffix'] ?? '',
                    'sort_order' => $index,
                ]);
            }
        });

        return (new AboutResource($about->fresh(['timelineEvents', 'achievements'])))->response();
    }

    private function activeAbout(): AboutProfile
    {
        return AboutProfile::query()
            ->where('is_active', true)
            ->with(['timelineEvents', 'achievements'])
            ->latest('id')
            ->firstOrFail();
    }
}
