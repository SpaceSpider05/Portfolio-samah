<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingRequest extends FormRequest
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
            'contactEmail' => ['required', 'email', 'max:255'],
            'contactPhone' => ['nullable', 'string', 'max:50'],
            'bookingNotifyEmail' => ['required', 'email', 'max:255'],
            'mailFromName' => ['nullable', 'string', 'max:255'],
        ];
    }
}
