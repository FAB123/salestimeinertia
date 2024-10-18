<?php

namespace App\Http\Controllers;

use App\Models\Configurations\StockLocation;
use App\Models\Employee\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        return Inertia::render('Screens/Employee/ShowEmployee');
    }
    public function add_employee()
    {
        return Inertia::render('Screens/Employee/AddEmployee', [
            'stores' => $this->get_store_list()
        ]);
    }

    public function edit_employee($employee_id)
    {
        $decrypted_employee_id = decrypt($employee_id);
        $employee = Employee::find($decrypted_employee_id);
        $permissions = $employee->getPermissionNames();

        return Inertia::render('Screens/Employee/AddEmployee', [
            'employee_id' => $employee_id,
            'employee_data' => $employee,
            'permissions' => $permissions,
            'stores' => $this->get_store_list()
        ]);
    }

    public function getAll($page, $size = 10, $keyword, $sortitem, $sortdir)
    {
        $query = Employee::query();
        if ($keyword != 'null') {

            $query->whereRaw("name LIKE '%" . $keyword . "%'")
                ->orWhereRaw("address_line_1 LIKE '%" . $keyword . "%'")
                ->orWhereRaw("email LIKE '%" . $keyword . "%'")
                ->orWhereRaw("username LIKE '%" . $keyword . "%'")
                ->orWhereRaw("mobile LIKE '%" . $keyword . "%'");
        }

        if ($sortitem != 'null') {
            $query->orderBy($sortitem, $sortdir);
        }

        $result = $query->paginate($size, ['*'], 'page', $page);

        return response()->json([
            'data' => $result,
        ], 200);
    }

    public function get_all_employees_list(Request $request)
    {
        $result = Employee::select('name', 'email', 'employee_id as account_id')->get()->makeVisible('employee_id')->toArray();
        return response()->json([
            'data' => $result,
        ], 200);
    }

    //search_employees by  name
    public function search_employees($keyword)
    {
        $query = Employee::query();
        $query->whereRaw("name LIKE '%" . $keyword . "%'")
            ->orWhereRaw("mobile LIKE '%" . $keyword . "%'")
            ->orWhereRaw("email LIKE '%" . $keyword . "%'");

        $result = $query->get();
        $result->makeVisible('employee_id');

        return response()->json([
            'data' => $result,
        ], 200);
    }

    // //get employee by id
    // public function get_employee_by_id($employee_id)
    // {
    //     try {
    //         $decrypted_employee_id = decrypt($employee_id);
    //         $employee = Employee::find($decrypted_employee_id);
    //         $employee->makeVisible('username')->toArray();
    //         // $employee['permissions'] = $this->convert_permissions_for_edit($decrypted_employee_id);

    //         return response()->json([
    //             'status' => true,
    //             'data' => $employee,
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'info' => $e->getMessage(),
    //         ], 200);
    //     }
    // }

    //update or save employee
    public function save_employee(Request $request)
    {
        $encrypted_employee_id = $request->input('employee_id');
        $permission = $request->input('permission');
        $employee_id = isset($encrypted_employee_id) ? decrypt($encrypted_employee_id) : null;
        try {
            $data = [
                'name' => $request->input('name'),
                'mobile' => $request->input('mobile'),
                'email' => $request->input('email'),
                'address_line_1' => $request->input('address_line_1'),
                'username' => $request->input('username'),
                'status' => 1,
                'lang' => $request->input('lang'),
                'comments' => $request->input('comments'),
            ];

            if ($request->input('password')) {
                $data['password'] = bcrypt($request->input('password'));
            }

            $saved_employee = Employee::updateOrCreate([
                'employee_id' => $employee_id,
            ], $data);

            if ($saved_employee->employee_id) {
                $saved_employee->syncPermissions($permission);
            }

            return response()->json([
                'error' => false,
                'message' => "customers.new_customer_or_update",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => "customers.error_new_or_update",
                'info' => $e->getMessage(),
            ], 200);
        }
    }

    public function get_store_list()
    {
        return StockLocation::all('location_id', 'location_name_en', 'location_name_ar')
            ->map(function ($item) {
                return [
                    'permission_id' => 'store_' . $item->location_id,
                    'label' => $item->location_name_en . ' - ' . $item->location_name_ar
                ];
            });
    }
}
