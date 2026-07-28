<?php

namespace App\Models;

use Database\Factories\ChartPointFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['label', 'value', 'sort_order'])]
class ChartPoint extends Model
{
    /** @use HasFactory<ChartPointFactory> */
    use HasFactory;
}
