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
        Schema::create('workorder_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('status_name_en', 100);
            $table->string('status_name_ar', 100);
            $table->boolean('editable')->default(0)->comment('0: editable, 1 : not editable');
            $table->string('whatsapp_message', 500)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workorder_statuses');
    }
};
