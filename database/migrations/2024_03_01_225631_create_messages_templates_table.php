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
        Schema::create('messages_templates', function (Blueprint $table) {
            $table->bigIncrements('template_id');
            $table->string('template_name');
            $table->string('whatsapp_template_en', 500)->nullable();
            $table->string('whatsapp_template_ar', 500)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages_templates');
    }
};

