<?php

namespace App\Providers;

use App\Ai\Contracts\AiProvider;
use App\Ai\Providers\GroqProvider;
use Illuminate\Support\ServiceProvider;

class AiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AiProvider::class, function (): AiProvider {
            return match (config('ai.provider')) {
                default => $this->app->make(GroqProvider::class),
            };
        });
    }

    public function boot(): void
    {
        //
    }
}
