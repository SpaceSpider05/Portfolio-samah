<?php

namespace App\Http\Resources\Api\V1;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SiteSetting
 */
class SiteSettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'contactEmail' => $this->contact_email,
            'contactPhone' => $this->contact_phone,
            'bookingNotifyEmail' => $this->booking_notify_email,
            'mailFromName' => $this->mail_from_name,
        ];
    }
}
