<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            EmployeeTableSeeder::class,
            StockTableSeeder::class,
            ConfigTableSeeder::class,
            TaxSchmesTableSeeder::class,
            DinnerTableSeeder::class,
            StoreUnitTableSeeder::class,
            AccountHeadTableSeeder::class,
            OpeningBalanceTableSeeder::class,
            PaymentTableSeeder::class,
            InvoiceTemplateSeeder::class,
            WorkorderStatusSeeder::class,
            MessageTemplateSeeder::class
        ]);
    }
}
