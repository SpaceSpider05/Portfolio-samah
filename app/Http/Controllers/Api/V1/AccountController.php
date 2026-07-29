<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateAccountRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    public function show(): JsonResponse
    {
        /** @var User $user */
        $user = request()->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function update(UpdateAccountRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        if (! empty($validated['password'])) {
            if (! Hash::check((string) ($validated['currentPassword'] ?? ''), $user->password)) {
                throw ValidationException::withMessages([
                    'currentPassword' => ['The current password is incorrect.'],
                ]);
            }

            $user->password = $validated['password'];
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'isAdmin' => $user->isAdmin(),
            'message' => 'Account updated.',
        ]);
    }
}
