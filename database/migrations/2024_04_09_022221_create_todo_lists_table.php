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
        Schema::create('todo_lists', function (Blueprint $table) {
            $table->bigIncrements('todo_id');
            $table->string('title', 100);
            $table->dateTime('todo_date', $precision = 0)->nullable();
            $table->json('tags')->nullable();
            $table->string('message', 500);
            $table->boolean('done')->default(0)->comment('1 : YES, 0: FALSE');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todo_lists');
    }
};
