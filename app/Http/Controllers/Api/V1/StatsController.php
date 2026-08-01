<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class StatsController extends Controller
{
    public function show(): JsonResponse
    {
        $payload = Cache::remember('stats.public', 60, function (): array {
            $completedProjects = Project::query()->completed()->count();
            $clients = Project::query()
                ->completed()
                ->select('client')
                ->distinct()
                ->count('client');
            $services = Service::query()->published()->count();

            $metrics = [
                [
                    'id' => 'projects',
                    'label' => 'Projects completed',
                    'value' => $completedProjects,
                    'suffix' => '',
                    'prefix' => null,
                ],
                [
                    'id' => 'clients',
                    'label' => 'Clients',
                    'value' => $clients,
                    'suffix' => '',
                    'prefix' => null,
                ],
                [
                    'id' => 'services',
                    'label' => 'Services offered',
                    'value' => $services,
                    'suffix' => '',
                    'prefix' => null,
                ],
            ];

            $chart = Project::query()
                ->completed()
                ->select('category')
                ->selectRaw('count(*) as total')
                ->groupBy('category')
                ->orderByDesc('total')
                ->limit(5)
                ->get()
                ->map(fn ($row) => [
                    'label' => Str::limit((string) $row->category, 18, ''),
                    'value' => (int) $row->total,
                ])
                ->values()
                ->all();

            if ($chart === []) {
                $chart = [
                    ['label' => 'Ready', 'value' => 1],
                ];
            }

            return [
                'metrics' => $metrics,
                'chart' => $chart,
            ];
        });

        return response()->json($payload);
    }
}
