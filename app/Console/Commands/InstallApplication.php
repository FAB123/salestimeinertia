<?php

namespace App\Console\Commands;

use App\Models\Employee\Employee;
use Spatie\Permission\Models\Permission;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class InstallApplication extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'application:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install Application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Begin Permission Installation...");
        Artisan::call('migrate:fresh');
        Artisan::call('db:seed');
        $permission_list = [
            'dashboard',
            'customers',
            'add_customers',
            'view_customers',
            'suppliers',
            'add_suppliers',
            'view_suppliers',
            'sales',
            'cash_sales',
            'cash_sales_return',
            'credit_sales',
            'credit_sales_return',
            'quotation',
            'workorder',
            'purchase',
            'new_cash_purchase',
            'cash_purchase_return',
            'new_credit_purchase',
            'credit_purchase_return',
            'requisition',
            'employee',
            'add_employee',
            'view_employee',
            'items',
            'add_items',
            'view_items',
            'opening_stock',
            'price_updater',
            'bundleditems',
            'add_bundleditems',
            'view_bundleditems',
            'accounts',
            'reports',
            'messages',
            'configurations',
            'store_1'
        ];

        $list = [];
        foreach ($permission_list as $permission) {
            $list[] = Permission::create(['name' => $permission]);
        }

        $user = Employee::find(1);

        $user->givePermissionTo($list);

        // CLEAR CACHE OF YOUR APP
        Artisan::call('optimize:clear');
        Artisan::call('config:cache');

        session()->flush();
        $this->info("Permission Installation Compleeted.");
    }
}
