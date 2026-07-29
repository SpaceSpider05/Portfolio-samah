<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_conversations', function (Blueprint $table) {
            $table->json('visitor_profile')->nullable()->after('lead_payload');
            $table->text('summary')->nullable()->after('visitor_profile');
            $table->timestamp('follow_up_sent_at')->nullable()->after('summary');
            $table->unsignedInteger('message_count')->default(0)->after('follow_up_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('ai_conversations', function (Blueprint $table) {
            $table->dropColumn([
                'visitor_profile',
                'summary',
                'follow_up_sent_at',
                'message_count',
            ]);
        });
    }
};
