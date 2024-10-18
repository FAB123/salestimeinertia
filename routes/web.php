<?php

use App\Http\Controllers\AccountHeadController;
use App\Http\Controllers\AccountTransactionController;
use App\Http\Controllers\BoxedItemController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\QuatationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SuspendedSalesController;
use App\Http\Controllers\TodoListController;
use App\Http\Controllers\WorkorderController;
use App\Http\Controllers\ZatkaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
 */

//Login Functions
Route::controller(LoginController::class)->group(function () {
    Route::get('/login', 'index')->name('login');
    Route::post('/login', 'dologin')->name('do.login');
    Route::post('/activate', 'activate')->name('do.activate');
    Route::post('/activate-api', 'activate_api')->name('do.activate.api');
    Route::get('/logout', 'logout')->name('logout');
    Route::get('/install', 'install')->name('install');
    Route::post('/do-install', 'doInstall')->name('doInstall');
});

Route::middleware('auth')->group(function () {
    Route::get('/unauthorized', [HomeController::class, 'unauthorized'])->name('unauthorized');
    Route::get('/', [HomeController::class, 'index'])->middleware('validate.permission:dashboard')->name('root');
    Route::post('/transilate', [HomeController::class, 'transilate']);
    Route::get('/dashboard', [HomeController::class, 'index'])->middleware('validate.permission:dashboard')->name('dashboard');
    Route::get('/dashboard/get_basic_info', [HomeController::class, 'get_basic_info'])->name('get_basic_info');
    Route::get('/dashboard/get_sales_graph/{month}/{year}', [HomeController::class, 'get_sales_graph'])->name('get_sales_graph');
    Route::get('/dashboard/get_purchase_graph/{month}/{year}', [HomeController::class, 'get_purchase_graph'])->name('get_purchase_graph');

    //customer routes
    Route::controller(CustomerController::class)->group(function () {
        Route::group(['prefix' => 'customers'], function () {
            Route::get('view_customers', 'index')->middleware('validate.permission:view_customers')->name('customers');
            Route::get('add_customers', 'add_customers')->middleware('validate.permission:add_customers')->name('add_customers');
            Route::get('edit_customer/{customer_id}', 'edit_customers')->name('edit_customers');
            Route::get("get_all_customers/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "get_all_customers");
            Route::get('get_customer_by_id/{customer_id}', 'get_customer_by_id');
            Route::post("delete_customer", "delete_customer");
            Route::post('save_customer', 'save_customer');
            Route::post('bulkinsert', 'bulk_insert');
            Route::get('search_customers/{keyword}', 'search_customers');
            Route::get('get_all_customers_list', 'get_all_customers_list');
        });
    });

    //employee routes
    Route::controller(EmployeeController::class)->group(function () {
        Route::group(['prefix' => 'employee'], function () {
            Route::get('view_employee', 'index')->middleware('validate.permission:view_employee')->name('view_employee');
            Route::get('add_employee', 'add_employee')->middleware('validate.permission:add_employee')->name('add_employee');
            Route::get('edit_employee/{employee_id}', 'edit_employee')->name('edit_employee');

            Route::get("get_all_employees/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "getAll");
            Route::get('get_employee_by_id/{employee_id}', 'get_employee_by_id');
            Route::get('get_default_permissions', 'get_default_permissions');
            Route::post("delete_employees", "delete_employees");
            Route::post('save_employee', 'save_employee');
            Route::get('get_all_employees_list', 'get_all_employees_list');
            Route::get('search_employees/{keyword}', 'search_employees');
        });
    });

    //message routes
    Route::controller(MessageController::class)->group(function () {
        Route::group(['prefix' => 'messages'], function () {
            Route::get('/', 'index')->name('message');
            Route::post('send_text_email', 'send_text_email');
            Route::get('getmessagingtemplate/{template}', 'getmessagingtemplate');
            Route::post('savemessagingtemplate', 'savemessagingtemplate');
        });
    });

    //supplier routes
    Route::controller(SupplierController::class)->group(function () {
        Route::group(['prefix' => 'suppliers'], function () {
            Route::get('view_suppliers', 'index')->middleware('validate.permission:view_suppliers')->name('suppliers');
            Route::get('add_suppliers', 'add_suppliers')->middleware('validate.permission:add_suppliers')->name('add_suppliers');
            Route::get('edit_supplier/{supplier_id}', 'edit_suppliers')->name('edit_suppliers');
            Route::get("get_all_suppliers/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "getAll");
            Route::get('get_supplier_by_id/{supplier_id}', 'get_supplier_by_id');
            Route::post("delete_suppliers", "delete_supplier");
            Route::post('save_supplier', 'save_supplier');
            Route::post('bulkinsert', 'bulk_insert');
            Route::get('get_all_suppliers_list', 'get_all_suppliers_list');
            Route::get('search_suppliers/{keyword}', 'search_suppliers');
        });
    });

    //item routes
    Route::controller(ItemController::class)->group(function () {
        Route::group(['prefix' => 'items'], function () {
            Route::get('view_items', 'index')->middleware('validate.permission:view_items')->name('view_items');
            Route::get('add_items', 'add_items')->middleware('validate.permission:add_items')->name('add_items');
            Route::get('edit_item/{item_id}', 'edit_item')->name('edit_item');
            Route::get('opening_stock', 'opening_stock')->middleware('validate.permission:opening_stock')->name('opening_stock');
            Route::get("get_all_items/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "getAll");
            Route::get('get_item_by_id/{item_id}', 'get_item_by_id');
            Route::get('search_items_by_barcode/{keyword}', 'search_items_by_barcode');
            Route::get('validate_barcode/{barcode}', 'validatebarcode');
            Route::get('get_inventory_details/{item_id}/{page}', 'get_inventory_details');
            Route::post("delete_items", "delete_item");
            Route::post('save_item', 'save_item');
            Route::post('bulkinsert', 'bulk_insert');
            Route::post('generate_barcode', 'generate_barcode');

            //search items with barcode / item name
            Route::get('search_items/{type}/{keyword}', 'search_items');

            //search item category
            Route::get('search_category/{keyword}', 'search_category');

            //get items for ob

            Route::get('search_items_for_ob/{keyword}', 'search_items_for_opening_balance');
            Route::post('save_items_ob', 'save_items_opening_balance');
        });
    });

    //Boxed item routes
    Route::controller(BoxedItemController::class)->group(function () {
        Route::group(['prefix' => 'bundleditems'], function () {
            Route::get('view_bundleditems', 'index')->middleware('validate.permission:view_bundleditems')->name('bundleditems');
            Route::get('add_bundleditems', 'add_bundleditems')->middleware('validate.permission:add_bundleditems')->name('add_bundleditems');
            Route::get('edit_bundleditems/{item_id}', 'edit_bundleditems')->name('edit_bundleditems');
            Route::get("get_all_boxed_items/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "getAll");
            Route::get('get_boxed_item_by_id/{item_id}', 'get_item_by_id');
            Route::post('save_boxed_item', 'save_item');
        });
    });

    //sales routes
    Route::controller(SalesController::class)->group(function () {
        Route::group(['prefix' => 'sales'], function () {
            Route::get('cash_sales', 'cash_sales')->middleware('validate.permission:cash_sales');
            Route::get('cash_sales_return', 'cash_sales_return')->middleware('validate.permission:cash_sales_return');
            Route::get('credit_sales', 'credit_sales')->middleware('validate.permission:credit_sales');
            Route::get('credit_sales_return', 'credit_sales_return')->middleware('validate.permission:credit_sales_return');
            Route::get('quotation', 'quotation')->middleware('validate.permission:quotation');
            Route::get('workorder', 'workorder')->middleware('validate.permission:workorder');
            Route::get('suspended', 'suspended');
            Route::get('daily_sales', 'daily_sales');
            Route::get('workorder_status', 'workorder_status');
            Route::get('e_invoice', 'show_e_invoice');


            Route::post('save_sale', 'save_sale');
            Route::get('get_sale/{sale_id}', 'get_sale');
            Route::get('get_sales_history/{item_id}/{type}/{customer}', 'get_sales_history');
            Route::get('get_daily_sales/{from}/{to}/{page}/{size}/{sortitem}/{sortdir}', 'get_daily_sales');
            Route::get('get_sale_by_id/{sale_id}', 'get_sale_by_id');
        });
    });

    //purchase routes
    Route::controller(PurchaseController::class)->group(function () {
        Route::group(['prefix' => 'purchase'], function () {
            Route::get('new_cash_purchase', 'cash_purchase')->middleware('validate.permission:new_cash_purchase');
            Route::get('cash_purchase_return', 'cash_purchase_return')->middleware('validate.permission:cash_purchase_return');
            Route::get('new_credit_purchase', 'credit_purchase')->middleware('validate.permission:new_credit_purchase');
            Route::get('credit_purchase_return', 'credit_purchase_return')->middleware('validate.permission:credit_purchase_return');

            Route::get('requisition', 'requisition')->middleware('validate.permission:requisition');

            Route::post('save_purchase', 'save_purchase');
            Route::post('save_requisition', 'save_requisition');

            Route::post('get_purchase', 'get_purchase');
            Route::get('get_purchase_image/{purchase_id}', 'get_purchase_image');
            Route::get('get_purchase_by_id/{purchase_id}', 'get_purchase_by_id');
            Route::get('get_requisition_by_id/{requisition_id}', 'get_requisition_by_id');
        });
    });

    //workorder rout
    Route::controller(WorkorderController::class)->group(function () {
        Route::group(['prefix' => 'workorder'], function () {
            Route::post('save_work_order', 'save_work_order');
            Route::get('get_workorder_by_id/{workorder_id}', 'get_workorder');
            Route::get('get_workorder_details_by_id/{workorder_id}', "get_workorder_by_id");
            Route::post('update_work_order_status', 'update_work_order_status');
            Route::post('get_workorder_details_by_customer', 'get_workorder_details_by_customer');
        });
        Route::group(['prefix' => 'sales'], function () {
            Route::get('workorder_details/{workorder_id}', "workorder_details");
        });
    });

    //qutation route
    Route::controller(QuatationController::class)->group(function () {
        Route::group(['prefix' => 'quatation'], function () {
            Route::post('save_quatation', 'save_quatation');
            Route::get('get_quotation/{quotation_id}', 'get_quotation');
            Route::get('get_quotation_by_id/{quotation_id}', 'get_quotation_by_id');
            Route::get('get_quatation_details/{quatation_id}', 'get_quatation_details');
        });
    });

    //Suspended Sales routes
    Route::controller(SuspendedSalesController::class)->group(function () {
        Route::group(['prefix' => 'suspended_sales'], function () {
            Route::post('save_suspended', 'save_suspended');
            Route::get('get_suspended_details/{type}/{suspended_id}', 'get_suspended_details');
            Route::get('get_all_suspended/{page}/{size}/{keyword}/{sortitem}/{sortdir}', 'get_all_suspended');
        });
    });

    //http://localhost:8000/gazt/gazt_job_requests/1/10/null/id/asc

    //gazt routes
    Route::controller(ZatkaController::class)->group(function () {
        Route::group(['prefix' => 'gazt'], function () {
            Route::get('gazt_api_request/{document_id}', 'gazt_api_request');
            Route::get('gazt_job_requests/{page}/{size}/{sortitem}/{sortdir}/{type}/{status}', 'gazt_job_requests');
        });
    });

    //configuration routes
    Route::controller(ConfigurationController::class)->group(function () {
        Route::group(['prefix' => 'configurations'], function () {
            Route::get("/", "index")->middleware('validate.permission:configurations');

            Route::get("get_all_configuration", "getConfigDatas");
            Route::get("csid_status", "csid_status");
            Route::post("save_configuration", "save_configuration");
            //location section
            Route::get('get_all_stores', "get_all_stores");
            Route::get('get_store_by_id/{location_id}', "get_store_by_id");
            Route::get('delete_store_by_id/{location_id}', "delete_store_by_id");
            Route::post('save_store', "save_store");
            Route::get('search_branches/{keyword}', "search_branches");
            //table section
            Route::get('get_all_tables', "get_all_tables");
            Route::get('get_table_by_id/{table_id}', "get_table_by_id");
            Route::get('delete_table_by_id/{table_id}', "delete_table_by_id");
            Route::post('save_table', "save_table");
            //unit section
            Route::get('get_all_units', "get_all_units");
            Route::get('get_unit_by_id/{unit_id}', "get_unit_by_id");
            Route::get('delete_unit_by_id/{unit_id}', "delete_unit_by_id");
            Route::post('save_unit', "save_unit");

            //workorder_status
            Route::get('get_all_workorder_status', "get_all_workorder_status");
            Route::get('get_workorder_status_by_id/{workorder_id}', "get_workorder_status_by_id");
            Route::get('delete_workorder_status_by_id/{workorder_id}', "delete_workorder_status_by_id");
            Route::post('save_workorder_status', "save_workorder_status");

            //payments
            Route::get('get_all_payments', "get_all_payments");
            Route::get('get_all_active_payments', "get_all_active_payments");

            Route::get('get_payment_option_by_id/{payment_id}', "get_payment_option_by_id");
            Route::post('change_payment_option_status_by_id', "change_payment_option_status_by_id");
            Route::post('save_payment_option', "save_payment_option");
            Route::post('generate_csid', "generate_csid");
            Route::post('save_template_by_id', "save_template_by_id");
            Route::post('save_company_logo', "save_company_logo");
            Route::get('get_company_logo', "get_company_logo");
            Route::get('remove_company_logo', "remove_company_logo");
        });
    });

    //accounts routes
    Route::controller(AccountHeadController::class)->group(function () {
        Route::group(['prefix' => 'accounts'], function () {
            //Head Section
            Route::get('/', 'index')->middleware('validate.permission:accounts');
            Route::get("get_all_account_heads", "get_all_account_heads");
            Route::get("get_all_account_head_list", "get_all_account_head_list");
            Route::get("get_all_account_payment_head_list", "get_all_account_payment_head_list");
            Route::get("delete_account_head", "delete_account_head");
            Route::post("update_account_heads", "update_account_heads");
            Route::get("validate_account_head", "validate_account_head");
            Route::post("create_new_account_head", "create_new_account_head");
            Route::get("get_account_heads_ob", "get_account_heads_openning_balance");
            Route::post("update_account_head_ob", "update_account_head_ob");
        });
    });

    Route::controller(AccountTransactionController::class)->group(function () {
        //transaction Section
        Route::post("accounts/save_voucher_data", "save_voucher_data");
    });

    //report routes
    Route::controller(ReportController::class)->group(function () {
        Route::group(['prefix' => 'reports'], function () {
            Route::get('/', 'index')->name('report');
            Route::get('show/{type}/{from}/{to}/{option1}/{option2}/{location}', 'show')->name('show');

            Route::get('detailed_sales/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_detailed_sales');
            Route::get('detailed_purchases/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_detailed_purchases');
            Route::get('detailed_workorder/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_detailed_workorder');
            Route::get('detailed_quotation/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_detailed_quotation');
            Route::get('detailed_requisition/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_detailed_requisition');

            Route::get('summary_sales/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_summary_sales');
            Route::get('customer_sales/{from}/{to}/{option1}/{option2}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_specific_customer_detailed_sales');
            Route::get('employee_sales/{from}/{to}/{option1}/{option2}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_specific_employee_detailed_sales');
            Route::get('category_sales/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_specific_category_summary_sales');
            Route::get('item_sales/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_item_summary_sales');

            Route::get('summary_purchase/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_summary_purchases');
            Route::get('supplier_purchase/{from}/{to}/{option1}/{option2}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_specific_supplier_detailed_purchase');
            Route::get('employee_purchase/{from}/{to}/{option1}/{option2}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_specific_employee_detailed_purchase');
            Route::get('category_purchase/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_category_summary_purchase');
            Route::get('item_purchase/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_item_summary_purchase');

            Route::get('summary_workorder/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_summary_workorder');
            Route::get('summary_qutatation/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_all_summary_qutatation');

            Route::get('inventory_summary/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_inventory_summary');
            Route::get('low_inventory/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_low_inventory');

            Route::get('sales_tax/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_sales_tax');
            Route::get('purchase_tax/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_purchase_tax');
            Route::get('generate_tax_reports/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_generate_tax_reports');

            Route::get('journal_report/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_general_journal');
            Route::get('ledger_accounts_balances/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_ledger_accounts_balances');
            Route::get('ledger_details/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_ledger_details');
            Route::get('customer_ledger_details/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_customer_ledger_details');
            Route::get('supplier_ledger_details/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_supplier_ledger_details');
            Route::get('trail_balance/{from}/{to}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_trail_balance');
        });
    });

    //TodoList routes
    Route::controller(TodoListController::class)->group(function () {
        Route::group(['prefix' => 'todo'], function () {
            Route::post('save_todo_tag', 'save_todo_tag')->name('save_todo_tag');
            Route::get('get_todo_tags', 'get_todo_tags')->name('get_todo_tags');
            Route::post('save_todo', 'save_todo')->name('save_todo');
            Route::get('done_todo/{encrypted_todo_id}', 'done_todo')->name('done_todo');
            Route::get('delete_todo/{encrypted_todo_id}', 'delete_todo')->name('delete_todo');
            Route::get('get_todo_by_id/{encrypted_todo_id}', 'get_todo_by_id')->name('get_todo_by_id');
            Route::get('get_todo_list/{event}/{type}/{page}', 'get_todo_list')->name('get_todo_list');
        });
    });
});
