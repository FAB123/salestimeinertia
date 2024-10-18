<?php

namespace App\Http\Controllers;

use App\AppClasses\AppTransilator;
use App\Models\Customer\Customer;
use App\Models\Employee\Employee;
use App\Models\Item\Item;
use App\Models\Supplier\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Screens/DashBoard/DashBoard');
    }

    public function unauthorized()
    {
        return Inertia::render('Screens/DashBoard/Unauthorized');
    }

    public function transilate(Request $request)
    {
        $query = $request->input('query');
        $transilator = new AppTransilator;

        return response()->json([
            'error' => false,
            'data' => $transilator->en2ar($query)
        ], 200);
    }

    private function get_sales_data($month, $year)
    {

        $sales = DB::table('sales')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            // ->whereDate('created_at', '>=', now()->subDays(7))
            ->selectRaw('sum(total) as total, DATE(created_at) as date, sale_type')
            ->groupBy(['date', 'sale_type'])
            ->get();

        $data = json_decode($sales, true);

        // Initialize arrays for  'cash_sale', 'cash_sale_return', 'credit_sale', and 'credit_sale_return'
        $cash_sale = [];
        $cash_sale_return = [];
        $credit_sale = [];
        $credit_sale_return = [];


        // Loop through the data to populate the arrays
        foreach ($data as $item) {
            if ($item['sale_type'] === 'CAS') {
                $cash_sale[] = $item['total'];
                $cash_sale_return[] = 0;
                $credit_sale[] = 0;
                $credit_sale_return[] = 0;
            } elseif ($item['sale_type'] === 'CASR') {
                $cash_sale_return[] = $item['total'];
                $cash_sale[] = 0;
                $credit_sale[] = 0;
                $credit_sale_return[] = 0;
            } elseif ($item['sale_type'] === 'CRS') {
                $credit_sale[] = $item['total'];
                $cash_sale[] = 0;
                $cash_sale_return[] = 0;
                $credit_sale_return[] = 0;
            } elseif ($item['sale_type'] === 'CRSR') {
                $credit_sale_return[] = $item['total'];
                $cash_sale[] = 0;
                $cash_sale_return[] = 0;
                $credit_sale[] = 0;
            }
        }

        // Extract dates
        $dates = array_column($data, 'date');

        // Prepare the final array
        $result = [
            'dates' => $dates,
            'cash_sale' => $cash_sale,
            'cash_sale_return' => $cash_sale_return,
            'credit_sale' => $credit_sale,
            'credit_sale_return' => $credit_sale_return
        ];

        return $result;
    }

    private function get_purchase_data($month, $year)
    {


        $purchases = DB::table('purchases')
            ->whereMonth('purchase_date', $month)
            ->whereYear('purchase_date', $year)
            // ->whereDate('created_at', '>=', now()->subDays(7))
            ->selectRaw('sum(total) as total, DATE(purchase_date) as date, purchase_type')
            ->groupBy(['date', 'purchase_type'])
            ->get();

        $data = json_decode($purchases, true);

        // Initialize arrays for  'cash_purchase', 'cash_purchase_return', 'credit_purchase', and 'credit_purchase_return'
        $cash_purchase = [];
        $cash_purchase_return = [];
        $credit_purchase = [];
        $credit_purchase_return = [];


        // Loop through the data to populate the arrays
        foreach ($data as $item) {
            if ($item['purchase_type'] === 'CAP') {
                $cash_purchase[] = $item['total'];
                $cash_purchase_return[] = 0;
                $credit_purchase[] = 0;
                $credit_purchase_return[] = 0;
            } elseif ($item['purchase_type'] === 'CAPR') {
                $cash_purchase[] = 0;
                $cash_purchase_return[] = $item['total'];
                $credit_purchase[] = 0;
                $credit_purchase_return[] = 0;
            } elseif ($item['purchase_type'] === 'CRP') {
                $cash_purchase[] = 0;
                $cash_purchase_return[] = 0;
                $credit_purchase[] = $item['total'];
                $credit_purchase_return[] = 0;
            } elseif ($item['purchase_type'] === 'CRPR') {
                $cash_purchase[] = 0;
                $cash_purchase_return[] = 0;
                $credit_purchase[] = 0;
                $credit_purchase_return[] = $item['total'];
            }
        }

        // Extract dates
        $dates = array_column($data, 'date');

        // Prepare the final array
        $result = [
            'dates' => $dates,
            'cash_purchase' => $cash_purchase,
            'cash_purchase_return' => $cash_purchase_return,
            'credit_purchase' => $credit_purchase,
            'credit_purchase_return' => $credit_purchase_return
        ];

        return $result;
    }
    public function get_basic_info()
    {
        $data['total_items'] = Item::normalitems()->count();
        $data['total_customer'] = Customer::count();
        $data['total_supplier'] = Supplier::count();
        $data['total_employee'] = Employee::count();

        return response()->json([
            'data' => $data,
        ], 200);
    }

    public function get_sales_graph($month, $year)
    {
        return response()->json([
            'data' => $this->get_sales_data($month, $year),
        ], 200);
    }

    public function get_purchase_graph($month, $year)
    {
        return response()->json([
            'data' => $this->get_purchase_data($month, $year),
        ], 200);
    }
}
