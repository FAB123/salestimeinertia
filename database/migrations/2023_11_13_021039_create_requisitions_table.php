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
        Schema::create('requisitions', function (Blueprint $table) {
            $table->bigIncrements('requisition_id');
            $table->unsignedBigInteger('employee_id')->index();
            $table->foreign('employee_id')->references('employee_id')->on('employees');
            $table->unsignedBigInteger('store_from')->index();
            $table->foreign('store_from')->references('location_id')->on('stock_locations');
            $table->unsignedBigInteger('store_to')->index();
            $table->foreign('store_to')->references('location_id')->on('stock_locations');
            $table->double('total', 15, 3);
            $table->double('qty', 15, 3);
            $table->string('comments', 255)->nullable();
            $table->unsignedBigInteger('location_id')->index();
            $table->foreign('location_id')->references('location_id')->on('stock_locations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requisitions');
    }
};
