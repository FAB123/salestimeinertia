<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->bigIncrements('customer_id');
            $table->string('name', 255);
            $table->string('mobile', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('company_name', 100)->nullable();
            $table->enum('identity_type', ['PAS', 'IQA', 'TIN', 'CRN', 'GCC', 'MOM', 'SAG', 'NAT'])->index();
            $table->string('party_id', 30)->nullable();
            $table->integer('payment_type')->nullable();
            $table->integer('customer_type')->nullable()->comment('1 : Wholesale, 0: Retail');
            $table->boolean('billing_type')->default(1)->comment('1 : B2B, 0: B2C');
            $table->boolean('status')->default(1)->comment('1 : Active, 0: Disabled');
            $table->unsignedBigInteger('location_id');
            $table->foreign('location_id')->references('location_id')->on('stock_locations');
            $table->softDeletes();
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
        Schema::dropIfExists('customers');
    }
}
