<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('forum_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Reporter
            $table->string('reportable_type'); // Discussion or Reply
            $table->unsignedBigInteger('reportable_id');
            $table->string('reason'); // spam, inappropriate, offensive, etc
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // pending, reviewed, resolved, rejected
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['reportable_type', 'reportable_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_reports');
    }
};
