<?php

use App\Http\Controllers\Api\V1\AboutController;
use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\SiteSettingController;
use App\Http\Controllers\Api\V1\StatsController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::get('/about', [AboutController::class, 'show']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project:slug}', [ProjectController::class, 'show']);
    Route::get('/stats', [StatsController::class, 'show']);
    Route::get('/site-settings', [SiteSettingController::class, 'show']);

    Route::post('/bookings', [BookingController::class, 'store'])
        ->middleware('throttle:8,1');

    Route::middleware(['auth:sanctum', EnsureUserIsAdmin::class])->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/manage/projects', [ProjectController::class, 'indexAll']);
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::patch('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

        Route::get('/manage/services', [ServiceController::class, 'indexAll']);
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{service}', [ServiceController::class, 'update']);
        Route::patch('/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

        Route::get('/manage/bookings', [BookingController::class, 'index']);

        Route::get('/manage/about', [AboutController::class, 'showManage']);
        Route::put('/manage/about', [AboutController::class, 'update']);

        Route::get('/manage/site-settings', [SiteSettingController::class, 'showManage']);
        Route::put('/manage/site-settings', [SiteSettingController::class, 'update']);

        Route::get('/manage/account', [AccountController::class, 'show']);
        Route::put('/manage/account', [AccountController::class, 'update']);

        Route::post('/media', [MediaController::class, 'store']);
    });
});
