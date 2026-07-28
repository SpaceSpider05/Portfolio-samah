<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ChartPoint;
use App\Models\SiteMetric;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function show(): JsonResponse
    {
        $metrics = SiteMetric::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (SiteMetric $metric) => [
                'id' => (string) $metric->id,
                'label' => $metric->label,
                'value' => $metric->value,
                'suffix' => $metric->suffix,
                'prefix' => $metric->prefix,
            ])
            ->values();

        $chart = ChartPoint::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (ChartPoint $point) => [
                'label' => $point->label,
                'value' => $point->value,
            ])
            ->values();

        return response()->json([
            'metrics' => $metrics,
            'chart' => $chart,
        ]);
    }
}
