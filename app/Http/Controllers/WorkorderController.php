<?php

namespace App\Http\Controllers;

use App\Models\Configurations\StoreUnit;
use App\Models\Item\ItemsQuantity;
use App\Models\Item\ItemsTax;
use App\Models\Workorders\Workorder;
use App\Models\Workorders\WorkordersItem;
use App\Models\Workorders\WorkordersItemsTax;
use App\Models\Workorders\WorkorderUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WorkorderController extends Controller
{
    public function workorder_details($workorder_id)
    {
        $work_order = $this->fetch_workorder_details($workorder_id);
        return Inertia::render('Screens/sales/WorkorderDetails', ['data' => $work_order]);
    }

    public function get_workorder_basic_by_id($workorder_id)
    {
        try {
            $work_order = $this->fetch_workorder_details($workorder_id);
            return response()->json([
                'status' => true,
                'work_order' => $work_order,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }

    //save or update work_order
    public function save_work_order(Request $request)
    {
        // $bill_type = $request->input('billType');
        $cart_items = $request->input('cartItems');
        $customer_info = $request->input('customerInfo');
        $store_id = $request->input('store_id');
        $payment_info = $request->input('paymentInfo');
        $send_message = $request->input('send_message');

        try {
            $work_order = Workorder::create([
                // 'workorder_time' => Carbon::now(),
                'customer_id' => $customer_info["customer_id"],
                'employee_id' => decrypt(auth()->user()->encrypted_employee),
                'comments' => $request->input('comments'),
                'sub_total' => $payment_info['subtotal'],
                'tax' => $payment_info['tax'],
                'total' => $payment_info['total'],
                'workorder_status' => 1,
                'location_id' => $store_id,
            ]);

            WorkorderUpdate::create([
                'workorder_id' => $work_order->workorder_id,
                'workorder_status' => 1,
                'comments' => $request->input('comments'),
            ]);

            if ($work_order->workorder_id) {
                //db transaction starting
                DB::beginTransaction();
                $item_list = [];
                $item_tax_list = [];
                foreach ($cart_items as $item) {
                    $item_list[] = [
                        'workorder_id' => $work_order->workorder_id,
                        'item_id' => $item['item_id'],
                        'description' => isset($item['description']) ? $item['description'] : null,
                        'serialnumber' => isset($item['serial']) ? $item['serial'] : null,
                        'workorder_quantity' => $item['quantity'],
                        'item_unit_price' => $item['unit_price'],
                        'discount' => $item['discount'],
                        'discount_type' => $item['discount_type'],
                        'item_sub_total' => $item['subTotal'],
                        'location_id' => $store_id,
                    ];
                    $line = 0;
                    foreach ($item['vatList'] as $vat) {
                        $line++;
                        $item_tax_list[] = [
                            'workorder_id' => $work_order->workorder_id,
                            'item_id' => $item['item_id'],
                            'line' => $line,
                            'tax_name' => $vat['tax_name'],
                            'percent' => $vat['percent'],
                            'amount' => $vat['amount'],
                        ];
                    }
                }
                WorkordersItem::insert($item_list);
                WorkordersItemsTax::insert($item_tax_list);
                DB::commit();

                sendMessage($work_order->workorder_id, 1);

                return response()->json([
                    'status' => true,
                    'invoice_data' => $this->fetch_workorder($work_order->workorder_id),
                    'message' => "sales.new_workorder_or_update",
                ], 200);
            }
            return response()->json([
                'status' => false,
                'message' => "sales.new_workorder_or_update",
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "sales.error_new_or_update",
                'info' => $e->getMessage(),
            ], 200);
        }
    }

    //find workorder by customer / workorder id
    public function get_workorder_details_by_customer(Request $request)
    {
        $customer_id = $request->input('customer'); //customer
        $workorder_id  = $request->input('workorder_id'); //workorder_id
        $deliverd = $request->input('deliverd');

        $work_order = Workorder::with(['customer', 'status'])
            ->when($deliverd == 1, function ($query) {
                $query->where('workorder_status', '!=', 4);
            })
            ->where('customer_id', $customer_id)
            ->orWhere('workorder_id', $workorder_id)
            ->get();

        return response()->json([
            'error' => false,
            'data' => $work_order,
        ], 200);
    }

    //workorder update
    public function update_work_order_status(Request $request)
    {
        try {
            $workorder_id = $request->input('workorder_id');
            $status_type = $request->input('status_type');
            Workorder::updateOrCreate(
                [
                    'workorder_id' => $workorder_id,
                ],
                [
                    'workorder_status' => $status_type,
                    'comments' => $request->input('comments'),
                ]
            );

            WorkorderUpdate::create([
                'workorder_id' => $workorder_id,
                'workorder_status' => $status_type,
                'comments' => $request->input('comments'),
            ]);

            if ($status_type == 3) {
                sendMessage($workorder_id, 2);
            } else if ($status_type == 4) {
                sendMessage($workorder_id, 3);
                sendMessage($workorder_id, 4);
            }

            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Throwable $th) {
            info(
                $th->getMessage()
            );
            return response()->json([
                'error' => true,

                'message' => "status.new_status_or_update",
            ], 200);
        }
    }

    public function get_workorder($workorder_id)
    {
        $workorder = $this->fetch_workorder($workorder_id == 'null' ? null : $workorder_id);
        if ($workorder) {
            return response()->json([
                'error' => false,
                'invoice_data' => $workorder,
            ], 200);
        } else {
            return response()->json([
                'error' => true,
                'message' => 'sales.no_invoice_number',
            ], 200);
        }
    }

    public function get_workorder_by_id($workorder_id)
    {
        try {
            $workorder = $this->fetch_workorder_details($workorder_id);

            return response()->json([
                'status' => true,
                'data' => $workorder,
            ], 200);
        } catch (\Throwable $th) {
            info($th);
            return response()->json([
                'status' => false,
                'message' => 'sales.no_invoice_number',
            ], 200);
        }
    }

    public function fetch_workorder_details($workorder_id)
    {
        try {
            $workorder = Workorder::with([
                'status',
                'details' => function ($query) {
                    $query->with('details');
                    $query->orderBy('created_at', 'desc');
                },
                'customer' => function ($query) {
                    $query->with('details');
                },
                'employee' => function ($query) {
                    $query->select(['name', 'employee_id']);
                },
            ])
                ->find($workorder_id);

            $items = WorkordersItem::with([
                'details' => function ($query) {
                    $query->select(['item_name', 'item_name_ar', 'category', 'item_id', 'unit_type']);
                },
                'tax_details' => function ($query) use ($workorder) {
                    $query->where('workorder_id', $workorder['workorder_id'])->select(['percent', 'amount', 'tax_name', 'item_id']);
                },
            ])->where('workorder_id', $workorder['workorder_id'])->get();

            $workorder["cartItems"] = $items->map(function ($item, $key) {

                // $item_taxs = ItemsTax::where('item_id', $item->item_id)->get();
                // $sub_total = $item->item_sub_total;
                // $total = 0;
                // $total_percent = 0;
                // $total_tax = 0;
                // $tax_details = $item_taxs->map(function ($item_tax) use ($sub_total, &$total, &$total_percent, &$total_tax) {
                //     $tax_fraction = $item_tax->percent / 100;
                //     $tax_amount = number_format($sub_total * $tax_fraction, 2);
                //     $total += $sub_total + $tax_amount;
                //     $total_percent += $item_tax->percent;
                //     $total_tax += $tax_amount;
                //     return [
                //         "tax_name" => $item_tax->tax_name,
                //         "percent" => $item_tax->percent,
                //         "amount" => $tax_amount,
                //     ];
                // });
                $stock = ItemsQuantity::where('location_id', $item->location_id)
                    ->find($item->item_id);

                $unit = StoreUnit::find($item->details->unit_type);

                $total_tax = $item->tax_details->sum('amount');
                $total_tax_percent = $item->tax_details->sum('percent');

                return [
                    //old
                    'category' => $item->details->category,
                    'description' => $item->description,
                    'serialnumber' => $item->serialnumber,
                    "unit" => "{$unit->unit_name_en} - {$unit->unit_name_ar}",
                    'location_id' => $item->location_id,
                    "item_id" => $item->item_id,
                    "item_name" => $item->details->item_name,
                    "item_name_ar" => $item->details->item_name_ar,
                    "minimum_price" => $item->details->minimum_price,
                    "quantity" => $item->workorder_quantity,
                    "stock" => $stock->quantity,
                    "stock_type" => $item->details->stock_type,
                    "subTotal" => $item->item_sub_total,
                    "total" => $item->item_sub_total + $total_tax,
                    "unit_price" => $item->item_unit_price,
                    "allowdesc" => $item->details->allowdesc,
                    "cost_price" => $item->item_cost_price,
                    "discount" => $item->discount,
                    "discount_type" => $item->discount_type,
                    "is_serialized" => $item->details->is_serialized,
                    "is_boxed" => $item->details->is_boxed,
                    "vatList" => $item->tax_details,
                    "vat" => "{$total_tax} [{$total_tax_percent}%]",
                    "vatPercentage" => $total_tax_percent,
                ];
            });

            return  $workorder;
        } catch (\Throwable $th) {
            info($th);
            return response()->json([
                'status' => false,
                'message' => 'sales.no_invoice_number',
            ], 200);
        }
    }

    //get quatation
    private function fetch_workorder($workorder_id = null)
    {
        if ($workorder_id) {
            $workorder = Workorder::with([
                'status',
                'customer' => function ($query) {
                    $query->with('details');
                },
                'employee' => function ($query) {
                    $query->select(['name', 'employee_id']);
                },
            ])->find($workorder_id);
        } else {
            $workorder = Workorder::with([
                'status',
                'customer' => function ($query) {
                    $query->with('details');
                },
                'employee' => function ($query) {
                    $query->select(['name', 'employee_id']);
                },
            ])->latest('workorder_id')->first();
        }

        if ($workorder) {
            $items = WorkordersItem::with([
                'details' => function ($query) {
                    $query->select(['item_name', 'item_name_ar', 'category', 'item_id', 'unit_type']);
                },
                'tax_details' => function ($query) use ($workorder) {
                    $query->where('workorder_id', $workorder['workorder_id'])->select(['percent', 'amount', 'item_id']);
                },
            ])->where('workorder_id', $workorder['workorder_id'])->get();

            $workorder["items"] = $items->map(function ($item, $key) {
                $unit = StoreUnit::find($item->details->unit_type);
                return [
                    'item_id' => $item->item_id,
                    'item_name' => $item->details->item_name,
                    'item_name_ar' => $item->details->item_name_ar,
                    'category' => $item->details->category,
                    'description' => $item->description,
                    'serialnumber' => $item->serialnumber,
                    'quantity' => $item->workorder_quantity,
                    "unit_name" => "{$unit->unit_name_en} - {$unit->unit_name_ar}",
                    'item_unit_price' => $item->item_unit_price,
                    'discount' => $item->discount,
                    'discount_type' => $item->discount_type,
                    'item_sub_total' => $item->item_sub_total,
                    'location_id' => $item->location_id,
                    'tax_amount' => $item->tax_details->sum('amount'),
                    'tax_percent' => $item->tax_details->sum('percent'),
                ];
            });

            $workorder["customer"] = $workorder["customer"]->makeVisible(['customer_id'])->makeHidden("encrypted_customer");
            $workorder["employee"] = $workorder["employee"]->makeVisible(['employee_id'])->makeHidden("encrypted_employee");

            return $workorder;
        } else {
            return false;
        }
    }
}
