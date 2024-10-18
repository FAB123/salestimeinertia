<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
 */

use App\Http\Controllers\AccountTransactionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WorkorderController;
use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'App\Http\Controllers'], function () {
    Route::group(['prefix' => 'v2'], function () {

        Route::group(['prefix' => 'login'], function () {
            Route::post("dologin", "LoginController@doApiLogin");
            Route::post("getstores", "LoginController@getAllStores");
        });

        Route::middleware('auth:sanctum')->group(function () {
            Route::get("get_required_info/{api}", "ConfigurationController@getConfigDatas");

            //login routes
            Route::group(['prefix' => 'login'], function () {
                Route::get("logout", "LoginController@logout");
                Route::post('home', 'LoginController@home');
            });

            //dashboard routes
            Route::group(['prefix' => 'dashboard'], function () {
                Route::get("get_basic_info", "HomeController@get_basic_info");

                Route::get('get_sales_graph/{month}/{year}', 'HomeController@get_sales_graph');
                Route::get('get_purchase_graph/{month}/{year}', 'HomeController@get_purchase_graph');
            });

            //item routes
            Route::group(['prefix' => 'items'], function () {
                // Route::get("get_all_items/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "ItemController@getAll");
                // Route::get('get_item_by_id/{item_id}', 'ItemController@get_item_by_id');
                // Route::get('validate_barcode/{barcode}', 'ItemController@validatebarcode');
                // Route::get('get_inventory_details/{item_id}', 'ItemController@get_inventory_details');
                // Route::post("delete_items", "ItemController@delete_item");
                // Route::post('save_item', 'ItemController@save_item');
                // Route::post('bulkinsert', 'ItemController@bulk_insert');
                // Route::post('generate_barcode', 'ItemController@generate_barcode');

                //search items with barcode / item name
        
                Route::get('search_items_by_barcode/{keyword}/{api}', 'ItemController@search_items_by_barcode');

                Route::get('search_items/{type}/{keyword}/{api}', 'ItemController@search_items');
                Route::get('get_all_item_category', 'ItemController@get_all_item_category');
                Route::get('get_all_item_by_category/{category}', 'ItemController@get_all_item_by_category');
                Route::get('get_all_item_for_pos', 'ItemController@get_all_item_for_pos');



                // //search item category
                // Route::get('search_category/{keyword}', 'ItemController@search_category');

                // //get items for ob

                // Route::get('search_items_for_ob', 'ItemController@search_items_for_opening_balance');
                // Route::post('save_items_ob', 'ItemController@save_items_opening_balance');
            });

            //customer routes
            Route::group(['prefix' => 'customers'], function () {
                Route::get("get_all_customers/{page}/{size}/{keyword}/{sortitem}/{sortdir}", "CustomerController@get_all_customers");
                Route::get('get_customer_by_id/{customer_id}', 'CustomerController@get_customer_by_id');
                Route::post("delete_customer", "CustomerController@delete_customer");
                Route::post('save_customer/{api}', 'CustomerController@save_customer');

                Route::get('search_customers/{keyword}', 'CustomerController@search_customers');
                Route::get('get_all_customers_list', 'CustomerController@get_all_customers_list');
            });

            //sales routes
            Route::group(['prefix' => 'sales'], function () {
                Route::post('save_sale/{api}', 'SalesController@save_sale');
                Route::get('get_sale/{sale_id}', 'SalesController@get_sale');
                Route::get('get_sales_history/{item_id}/{type}/{customer}', 'SalesController@get_sales_history');
                Route::get('get_daily_sales/{from}/{to}/{page}/{size}/{sortitem}/{sortdir}', 'SalesController@get_daily_sales');
                Route::get('get_sale_by_id/{sale_id}/{api}', 'SalesController@get_sale_by_id');
            });

            //workorder route
            Route::controller(WorkorderController::class)->group(function () {
                Route::group(['prefix' => 'workorder'], function () {
                    Route::post('save_work_order', 'save_work_order');
                    Route::get('get_workorder_by_id/{workorder_id}', 'get_workorder');
                    Route::get('get_workorder_details_by_id/{workorder_id}', "get_workorder_by_id");
                    Route::post('update_work_order_status', 'update_work_order_status');
                    Route::post('get_workorder_details_by_customer', 'get_workorder_details_by_customer');
                    Route::get('get_workorder_basic_by_id/{workorder_id}', 'get_workorder_basic_by_id');
                });
                Route::group(['prefix' => 'sales'], function () {
                    Route::get('workorder_details/{workorder_id}', "workorder_details");
                });
            });

            //Suspended Sales routes
            Route::group(['prefix' => 'suspended_sales'], function () {
                Route::post('save_suspended', 'SuspendedSalesController@save_suspended');
                Route::get('get_suspended_details/{type}/{suspended_id}/{api}', 'SuspendedSalesController@get_suspended_details');
                Route::get('get_all_suspended/{page}/{size}/{keyword}/{sortitem}/{sortdir}', 'SuspendedSalesController@get_all_suspended');
            });

            //message routes //messages/send_text_message
            Route::group(['prefix' => 'messages'], function () {
                Route::post('send_text_message', 'MessageController@send_text_message');
            });


            //configuration routes
            Route::group(['prefix' => 'configurations'], function () {
                Route::get("get_all_configuration", "ConfigurationController@getConfigDatas");
                Route::get("csid_status", "ConfigurationController@csid_status");
                Route::post("save_configuration", "ConfigurationController@save_configuration");
                //location section
                Route::get('get_all_stores', "ConfigurationController@get_all_stores");
                Route::get('get_store_by_id/{location_id}', "ConfigurationController@get_store_by_id");
                Route::get('delete_store_by_id/{location_id}', "ConfigurationController@delete_store_by_id");
                Route::post('save_store', "ConfigurationController@save_store");
                Route::get('search_branches/{keyword}', "ConfigurationController@search_branches");
                //table section
                Route::get('get_all_tables', "ConfigurationController@get_all_tables");
                Route::get('get_table_by_id/{table_id}', "ConfigurationController@get_table_by_id");
                Route::get('delete_table_by_id/{table_id}', "ConfigurationController@delete_table_by_id");
                Route::post('save_table', "ConfigurationController@save_table");
                //unit section
                Route::get('get_all_units', "ConfigurationController@get_all_units");
                Route::get('get_unit_by_id/{unit_id}', "ConfigurationController@get_unit_by_id");
                Route::get('delete_unit_by_id/{unit_id}', "ConfigurationController@delete_unit_by_id");
                Route::post('save_unit', "ConfigurationController@save_unit");

                //payments
                Route::get('get_all_payments', "ConfigurationController@get_all_payments");
                Route::get('get_all_active_payments', "ConfigurationController@get_all_active_payments");

                //workorder status
                Route::get('get_all_workorder_status', "ConfigurationController@get_all_workorder_status");
                Route::get('get_workorder_status_by_id/{workorder_id}', "ConfigurationController@get_workorder_status_by_id");

                Route::get('get_payment_option_by_id/{payment_id}', "ConfigurationController@get_payment_option_by_id");
                Route::post('change_payment_option_status_by_id', "ConfigurationController@change_payment_option_status_by_id");
                Route::post('save_payment_option', "ConfigurationController@save_payment_option");
                Route::post('generate_csid', "ConfigurationController@generate_csid");
                Route::post('save_template_by_id', "ConfigurationController@save_template_by_id");
                Route::post('save_company_logo', "ConfigurationController@save_company_logo");
                Route::get('get_company_logo', "ConfigurationController@get_company_logo");
                Route::get('remove_company_logo', "ConfigurationController@remove_company_logo");

                Route::get('activate_location', "ConfigurationController@activate_location");
                Route::get('reset_token', "ConfigurationController@reset_token");
                Route::post('set_token', "ConfigurationController@set_token");
                Route::get('token_info', 'ConfigurationController@token_info');
            });

            //requierd

            Route::controller(AccountTransactionController::class)->group(function () {
                //transaction Section
                Route::post("accounts/save_voucher_data", "save_voucher_data");
            });

            Route::controller(ReportController::class)->group(function () {
                Route::group(['prefix' => 'reports'], function () {
                    Route::get('customer_ledger_details/{from}/{to}/{option1}/{location}/{page}/{size}/{sortitem}/{sortdir}', 'get_customer_ledger_details');
                });
            });
        });
    });
});
