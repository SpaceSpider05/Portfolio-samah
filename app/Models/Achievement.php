<?php

namespace App\Models;

use Database\Factories\AchievementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['about_profile_id', 'label', 'value', 'suffix', 'sort_order'])]
class Achievement extends Model
{
    /** @use HasFactory<AchievementFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<AboutProfile, $this>
     */
    public function aboutProfile(): BelongsTo
    {
        return $this->belongsTo(AboutProfile::class);
    }
}
