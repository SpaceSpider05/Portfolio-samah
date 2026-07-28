<?php

namespace App\Models;

use Database\Factories\TimelineEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['about_profile_id', 'year', 'title', 'description', 'sort_order'])]
class TimelineEvent extends Model
{
    /** @use HasFactory<TimelineEventFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<AboutProfile, $this>
     */
    public function aboutProfile(): BelongsTo
    {
        return $this->belongsTo(AboutProfile::class);
    }
}
