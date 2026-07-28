<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\AboutResource;
use App\Models\AboutProfile;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    public function show(): JsonResponse
    {
        $about = AboutProfile::query()
            ->where('is_active', true)
            ->with(['timelineEvents', 'achievements'])
            ->latest('id')
            ->firstOrFail();

        return (new AboutResource($about))->response();
    }
}
