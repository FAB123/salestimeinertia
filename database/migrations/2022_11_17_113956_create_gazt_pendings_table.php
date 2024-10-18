<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGaztPendingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gazt_jobs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('document_id')->index();
            $table->enum('bill_type', ['B2B', 'B2C'])->index();
            $table->enum('inv_type', ['INV', 'CRE', 'DEB'])->index();
            $table->string('log', 255)->nullable();
            $table->boolean('status')->default(0)->comment('0: inserted, 1 : Compleeted, 2: Error');
            $table->binary('hash')->nullable();
            $table->unsignedBigInteger('inserted_by')->index();
            $table->foreign('inserted_by')->references('employee_id')->on('employees');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gazt_pendings');
    }
}
