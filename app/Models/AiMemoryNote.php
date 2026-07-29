<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiMemoryNote extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'ai_conversation_id',
        'topic',
        'note',
        'usefulness',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'usefulness' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<AiConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(AiConversation::class, 'ai_conversation_id');
    }
}
