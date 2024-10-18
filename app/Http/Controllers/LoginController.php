<?php

namespace App\Http\Controllers;

use App\Models\Configurations\StockLocation;
use App\Models\Employee\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class LoginController extends Controller
{
    public function index()
    {
        $validate = validateAppStatus();
        if (!$validate) {
            $activation_code = get_activation_code();
            return Inertia::render('Screens/Login/Activate', ['activation_code' => $activation_code]);
        }
        if (Auth::check()) {
            return redirect()->route('dashboard');
        } else {
            $stores = StockLocation::all('location_id', 'location_name_en', 'location_name_ar');
            if (count($stores) > 0) {
                return Inertia::render('Screens/Login/ShowLogin', [
                    'stores' => $stores,
                    'status' => $validate
                ]);
            } else {
                return Inertia::render('Screens/Install/DoInstall');
            }
        }
    }

    public function doLogin(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
            'store' => 'required',
        ]);

        $user = Employee::where('username', request('username'))->first();

        if (!$user) {
            return redirect()->route('login')->with('message', 'Store User Not Allowed');
        } else if (!$user->can('store_' . request('store'))) {
            return redirect()->route('login')->with('message', 'Store Login Not Allowed');
        }

        if (Auth::attempt(['username' => request('username'), 'password' => request('password')], request('remember'))) {
            $request->session()->regenerate();
            $request->session()->put('store', request('store'));
            return redirect()->route('dashboard');
        } else {
            return redirect()->route('login')->with('message', 'Invalid Login Data');
        }
    }
    public function logout(Request $request)
    {
        auth()->logout();
        $request->session()->flush();
        return redirect()->route('login');
    }

    public function activate(Request $request)
    {
        $key = $request->input('activation_key');
        if (activateApp($key)) {
            return redirect()->route('login')->with('message', 'Program Activated');
        } else {
            return redirect()->route('login')->with('message', 'Invalid Activated Data');
        }
    }

    public function activate_api(Request $request)
    {
        $key = $request->input('activation_key');
        if (activateApp($key)) {
            return response()->json([
                'status' => true,
            ], 200);
        } else {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }

    public function install()
    {
        return Inertia::render('Screens/Login/Installer/WelcomeInstaller');
    }

    public function doInstall()
    {
        if ($this->checkDbExist()) {
            if ($this->checkTableExist()) {
                return 'alredy installed';
            }
        } else {
            return 'DB not found. Create new DB!';
        }

        if ($this->installer()) {
            return Inertia::render('Screens/Login/Installer/FinishedInstaller');
        } else {
            return 'error installing Software.';
        }
    }

    public function checkDbExist()
    {
        try {
            $db_name = env('DB_DATABASE', false);
            $query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME =  ?";
            $database = DB::select($query, [$db_name]);
            if (!empty($database)) {
                return true;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    public function checkTableExist()
    {
        try {
            $has_table = Schema::hasTable('configurations');
            return $has_table;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function createDB()
    {
        try {
            $db_name = env('DB_DATABASE');
            $conn = mysqli_connect(
                config('database.connections.mysql.host'),
                env('DB_USERNAME'),
                env('DB_PASSWORD')
            );
            if (!$conn) {
                return false;
            }
            $sql = 'CREATE Database IF NOT EXISTS ' . $db_name;
            $exec_query = mysqli_query($conn, $sql);
            if (!$exec_query) {
                info("t1");
                die('Could not create database: ' . mysqli_error($conn));
            }
            info("t2");
            return 'Database created successfully with name ' . $db_name;
        } catch (\Exception $e) {
            info($e);
            return false;
        }
    }

    public function installer()
    {
        try {
            Artisan::call('migrate:fresh');
            Artisan::call('db:seed');
            $permission_list = [
                'dashboard', 'customers', 'add_customers', 'view_customers',
                'suppliers', 'add_suppliers', 'view_suppliers',
                'sales', 'cash_sales', 'cash_sales_return', 'credit_sales',
                'credit_sales_return', 'quotation', 'workorder',
                'purchase', 'new_cash_purchase', 'cash_purchase_return',
                'new_credit_purchase', 'credit_purchase_return', 'requisition',
                'employee', 'add_employee', 'view_employee',
                'items', 'add_items', 'view_items', 'opening_stock',
                'bundleditems', 'add_bundleditems', 'view_bundleditems',
                'accounts', 'reports', 'messages', 'configurations'
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
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }

    public function getAllStores()
    {
        try {
            $stores = StockLocation::all('location_id', 'location_name_en', 'location_name_ar');
            return response()->json([
                'status' => 200,
                'stores' => $stores,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 200);
        }
    }

    public function doApiLogin(Request $request)
    {
        //find spesified user from employee tabel
        $employee = Employee::where('username', $request->input('username'))->first();
        if ($employee && Hash::check($request->input('password'), $employee->password)) {
            $token = $employee->createToken('for-api')->plainTextToken;
            //get selected data from store with store_id

            $store = StockLocation::limit(50)->orderBy('location_name_en', 'ASC')->find(request('store'));

            $permissions = $employee->getPermissionNames();

            $resp = [
                "storeID" => $request->input('store'),
                "store" => $store,
                "display_name" => $employee->name,
                "Permissions" => $permissions,
            ];

            return response()->json([
                'auth' => true,
                'token' => $token,
                'info' => $resp,
                'message' => 'login Successfully',
            ], 200);
        } else {
            return response()->json([
                'auth' => false,
                'message' => 'login Failed',
            ], 401);
        }
    }
}
