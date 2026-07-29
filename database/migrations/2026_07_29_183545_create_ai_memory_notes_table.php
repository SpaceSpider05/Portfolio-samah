<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_memory_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_conversation_id')
                ->nullable()
                ->constrained('ai_conversations')
                ->nullOnDelete();
            $table->string('topic')->nullable()->index();
            $table->text('note');
            $table->unsignedInteger('usefulness')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_memory_notes');
    }
};
