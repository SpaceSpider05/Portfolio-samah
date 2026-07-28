<?php

namespace App\Models;

use Database\Factories\SiteMetricFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['label', 'value', 'suffix', 'prefix', 'sort_order'])]
class SiteMetric extends Model
{
    /** @use HasFactory<SiteMetricFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'float',
        ];
    }
}
