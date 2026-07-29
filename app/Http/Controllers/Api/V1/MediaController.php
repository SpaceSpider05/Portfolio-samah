<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMediaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function store(StoreMediaRequest $request): JsonResponse
    {
        $folder = $request->validated('folder') ?? 'projects';
        $file = $request->file('file');

        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $filename, 'public');

        $publicPath = '/storage/'.$path;

        return response()->json([
            'path' => $path,
            'url' => rtrim((string) config('app.url'), '/').$publicPath,
            'coverImage' => $publicPath,
        ], 201);
    }
}
