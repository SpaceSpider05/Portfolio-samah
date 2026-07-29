<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateSiteSettingRequest;
use App\Http\Resources\Api\V1\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function show(): JsonResponse
    {
        return (new SiteSettingResource(SiteSetting::current()))->response();
    }

    public function showManage(): JsonResponse
    {
        return (new SiteSettingResource(SiteSetting::current()))->response();
    }

    public function update(UpdateSiteSettingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $settings = SiteSetting::current();

        $settings->update([
            'contact_email' => $validated['contactEmail'],
            'contact_phone' => $validated['contactPhone'] ?? null,
            'booking_notify_email' => $validated['bookingNotifyEmail'],
            'mail_from_name' => $validated['mailFromName'] ?? $settings->mail_from_name,
        ]);

        return (new SiteSettingResource($settings->refresh()))
            ->response()
            ->setStatusCode(200);
    }
}
