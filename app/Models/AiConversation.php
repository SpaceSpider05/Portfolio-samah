<?php

namespace App\Models;

use Database\Factories\AiConversationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiConversation extends Model
{
    /** @use HasFactory<AiConversationFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'session_id',
        'locale',
        'visitor_email',
        'visitor_name',
        'messages',
        'lead_payload',
        'visitor_profile',
        'summary',
        'follow_up_sent_at',
        'message_count',
        'preview',
        'booking_id',
        'status',
        'last_message_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'messages' => 'array',
            'lead_payload' => 'array',
            'visitor_profile' => 'array',
            'last_message_at' => 'datetime',
            'follow_up_sent_at' => 'datetime',
            'message_count' => 'integer',
        ];
    }

    /**
     * @return HasMany<AiMemoryNote, $this>
     */
    public function memoryNotes(): HasMany
    {
        return $this->hasMany(AiMemoryNote::class);
    }

    /**
     * @return BelongsTo<Booking, $this>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
