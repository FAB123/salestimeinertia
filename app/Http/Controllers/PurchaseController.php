<?php

namespace App\Http\Controllers;

use App\Models\Account\AccountLedgerEntry;
use App\Models\Account\AccountsTransaction;
use App\Models\Account\AccountVoucher;
use App\Models\Configurations\Configuration;
use App\Models\Configurations\StoreUnit;
use App\Models\Inventory;
use App\Models\Item\BoxedItem;
use App\Models\Item\Item;
use App\Models\Item\ItemsQuantity;
use App\Models\Item\ItemsTax;
use App\Models\PurchasePayment;
use App\Models\Purchase\Purchase;
use App\Models\Purchase\PurchaseItem;
use App\Models\Purchase\PurchaseItemsTaxes;
use App\Models\Requisition\Requisition;
use App\Models\Requisition\RequisitionItem;
use App\Models\Supplier\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function cash_purchase()
    {
        return Inertia::render('Screens/purchase/CashPurchase');
    }
    public function cash_purchase_return()
    {
        return Inertia::render('Screens/purchase/CashPurchaseReturn');
    }
    public function credit_purchase()
    {
        return Inertia::render('Screens/purchase/CreditPurchase');
    }
    public function credit_purchase_return()
    {
        return Inertia::render('Screens/purchase/CreditPurchaseReturn');
    }
    public function requisition()
    {
        return Inertia::render('Screens/purchase/Requisition');
    }
    //save or update Purchase
    public function save_purchase(Request $request)
    {
        $store_id = $request->session()->get('store');
        $purchase_type = $request->input('purchase_type');
        $cart_items = $request->input('cartItems');
        $supplier_info = $request->input('supplierInfo');
        $payment_info = $request->input('paymentInfo');
        $supplier_id = $supplier_info ? $supplier_info["supplier_id"] : null;
        $purchase_id = $request->input('purchase_id');

        $purchase_date = $request->date('purchaseDate');
        $formated_purchase_date = $purchase_date->setTimezone('Asia/Qatar')->format('Y-m-d');

        if ($request->input('invoiceImage')) {
            $image_64 = $request->input('invoiceImage');
            $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
            $image = str_replace($replace, '', $image_64);
            $image = str_replace(' ', '+', $image);
            $image_name = Str::random(10) . '.png';
            Storage::disk('public')->put('purchase_bills/' . $image_name, base64_decode($image), 'public');
        }

        if ($purchase_type == 'CAP' || $purchase_type == 'CRP') {
            $sub_total = $payment_info['subtotal'];
            $tax = $payment_info['tax'];
            $discount = $payment_info['discount'];
            $total = $payment_info['total'];
        } else {
            $sub_total = $payment_info['subtotal'] * -1;
            $tax = $payment_info['tax'] * -1;
            $discount = $payment_info['discount'] * -1;
            $total = $payment_info['total'] * -1;
        }

        $purchase_data = array(
            'supplier_id' => $supplier_info ? $supplier_info["supplier_id"] : null,
            'employee_id' => decrypt(auth()->user()->encrypted_employee),
            'purchase_type' => $purchase_type,
            'purchase_date' => $formated_purchase_date,
            'sub_total' => $sub_total,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'comments' => $request->input('comments'),
            'reference' => $request->input('reference'),
            'location_id' => $store_id,
        );

        isset($image_name) && $purchase_data['pic_filename'] = $image_name;

        try {
            DB::beginTransaction();
            if ($purchase_id) {
                $old_purchase = PurchaseItem::where('purchase_id', $purchase_id)->get();
                foreach ($old_purchase as $item) {
                    if ($purchase_type == 'CAPR' || $purchase_type == 'CRPR') {
                        $inventory_quantity = $item['purchase_quantity'];
                        ItemsQuantity::where([
                            ['item_id', $item['item_id']],
                            ['location_id', $store_id]
                        ])->increment('quantity', $item['purchase_quantity']);
                    } else {
                        $inventory_quantity = $item['purchase_quantity'] * -1;
                        ItemsQuantity::where([
                            ['item_id', $item['item_id']],
                            ['location_id', $store_id]
                        ])->decrement('quantity', $item['purchase_quantity']);
                    }
                }
                PurchasePayment::where('purchase_id', $purchase_id)->delete();
                PurchaseItem::where('purchase_id', $purchase_id)->delete();
                PurchaseItemsTaxes::where('purchase_id', $purchase_id)->delete();
                Inventory::where('trans_comment', 'RECV ' . $purchase_id)->delete();
            }


            $purchase = Purchase::updateOrCreate([
                'purchase_id' => $purchase_id
            ], $purchase_data);

            if ($purchase->purchase_id) {
                //db transaction starting
                $item_list = [];
                $item_tax_list = [];
                $inventory_list = [];
                foreach ($cart_items as $item) {
                    $cur_item_info = Item::find($item['item_id']);

                    //adjust avarage cost
                    if ($cur_item_info->cost_price != $item['cost_price'] && Configuration::find('calc_average_cost') != "0") {
                        $this->calculate_avarage_cost($item['item_id'], $store_id, $item['cost_price'], $item['quantity'], $cur_item_info->cost_price);
                    }

                    //adjust item quantity
                    if ($item['stock_type'] === 1) {
                        if ($item['is_boxed'] === 0) {
                            if ($purchase_type == 'CAPR' || $purchase_type == 'CRPR') {
                                $inventory_quantity = $item['quantity'] * -1;
                                ItemsQuantity::where([
                                    ['item_id', $item['item_id']],
                                    ['location_id', $store_id]
                                ])->decrement('quantity', $item['quantity']);
                            } else {
                                $inventory_quantity = $item['quantity'];
                                ItemsQuantity::where([
                                    ['item_id', $item['item_id']],
                                    ['location_id', $store_id]
                                ])->increment('quantity', $item['quantity']);
                            }

                            //insert inventory data
                            $inventory_list[] = [
                                'item_id' => $item['item_id'],
                                'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                'trans_comment' => 'RECV ' . $purchase->purchase_id,
                                'location_id' => $store_id,
                                'quantity' => $inventory_quantity,
                            ];
                        } else {
                            $boxed_items = BoxedItem::where('boxed_item_id', $item['item_id'])->get();
                            foreach ($boxed_items as $boxed_item) {
                                if ($boxed_item['details']['stock_type'] === 1) {
                                    //insert inventory data
                                    $item_pack_quantity = $item['quantity'] * $boxed_item['quantity'];
                                    $inventory_list[] = [
                                        'item_id' => $boxed_item['item_id'],
                                        'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                        'trans_comment' => '[PACK] RECV ' . $purchase->purchase_id,
                                        'location_id' => $store_id,
                                        'quantity' => ($purchase_type === 'CAPR' || $purchase_type === 'CRPR') ? $item_pack_quantity : $item_pack_quantity * -1,
                                    ];

                                    if ($purchase_type === 'CAPR' || $purchase_type === 'CRPR') {
                                        ItemsQuantity::where([
                                            ['item_id', $boxed_item['item_id']],
                                            ['location_id', $store_id]
                                        ])->decrement('quantity', $item['quantity'] * $boxed_item['quantity']);
                                    } else {
                                        ItemsQuantity::where([
                                            ['item_id', $boxed_item['item_id']],
                                            ['location_id', $store_id]
                                        ])->increment('quantity', $item['quantity'] * $boxed_item['quantity']);
                                    }
                                }
                            }
                        }
                    }

                    if ($purchase_type == 'CAP' || $purchase_type == 'CRP') {
                        $purchase_quantity = $item['quantity'];
                        $item_cost_price = $item['cost_price'];
                        $item_discount = $item['discount'];
                        $item_sub_total = $item['subTotal'];
                    } else {
                        $purchase_quantity = $item['quantity'] * -1;
                        $item_cost_price = bcmul($item['cost_price'], -1);
                        $item_discount = $item['discount'] * -1;
                        $item_sub_total = $item['subTotal'] * -1;
                    }

                    //set item list for sales item
                    $item_list[] = [
                        'purchase_id' => $purchase->purchase_id,
                        'item_id' => $item['item_id'],
                        'description' => isset($item['description']) ? $item['description'] : null,
                        'serialnumber' => isset($item['serial']) ? $item['serial'] : null,
                        'purchase_quantity' => $purchase_quantity,
                        'item_cost_price' => $item_cost_price,
                        'item_sub_total' => $item_sub_total,
                        'discount' => $item_discount,
                        'discount_type' => $item['discount_type'],
                        'location_id' => $store_id,
                    ];

                    $line = 0;
                    foreach ($item['vatList'] as $vat) {
                        $line++;

                        if ($purchase_type == 'CAP' || $purchase_type == 'CRP') {
                            $vat_amount = $vat['amount'];
                        } else {
                            $vat_amount = $vat['amount'] * -1;
                        }
                        $item_tax_list[] = [
                            'purchase_id' => $purchase->purchase_id,
                            'item_id' => $item['item_id'],
                            'line' => $line,
                            'tax_name' => $vat['tax_name'],
                            'percent' => $vat['percent'],
                            'amount' => $vat_amount,
                        ];
                    }
                }

                if (!$this->create_account_entry($purchase->purchase_id, $payment_info, $purchase_type, $supplier_id)) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'message' => "purchase.error_purchases_or_update",
                        'info' => 'Error Inserting Account Entry',
                    ], 200);
                }

                if ($purchase_type == 'CAP' || $purchase_type == 'CAPR') {
                    if (count($payment_info['payment']) > 0) {
                        //inserting payment details
                        $payment_details = [];
                        foreach ($payment_info['payment'] as $payment) {
                            $payment_details[] = [
                                'purchase_id' => $purchase->purchase_id,
                                'payment_id' => $payment['payment_id'],
                                'amount' => $payment['amount'],
                            ];
                        }
                        PurchasePayment::insert($payment_details);
                    }
                }

                PurchaseItem::insert($item_list);
                PurchaseItemsTaxes::insert($item_tax_list);
                // Inventory::insert($inventory_list);
                foreach ($inventory_list as $inventory) {
                    Inventory::create($inventory);
                }

                DB::commit();

                return response()->json([
                    'status' => true,
                    'receipt_id' => $purchase->purchase_id,
                    'message' => "purchase.new_purchases_or_update",
                ], 200);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "purchase.error_purchases_or_update",
                'info' => $e->getMessage(),
            ], 200);
        }
    }


    //save or update Purchase
    public function save_requisition(Request $request)
    {
        $cart_items = $request->input('cartItems');
        $store_id = $request->session()->get('store');
        $requisition_id = $request->input('requisition_id');
        $store_from = $request->input('storeFrom');
        $store_to = $request->input('storeTo');

        $requisition_data = array(
            'employee_id' => decrypt(auth()->user()->encrypted_employee),
            'store_from' => $store_from,
            'store_to' => $store_to,
            'total' => $request->input('cartTotal'),
            'qty' => $request->input('cartQty'),
            'comments' => $request->input('comments'),
            'location_id' => $store_id,
        );

        try {
            DB::beginTransaction();
            // if ($requisition_id) {
            //     $old_purchase = RequisitionItem::where('requisition_id', $requisition_id)->get();
            //     foreach ($old_purchase as $item) {

            //         $inventory_quantity = $item['purchase_quantity'];
            //         ItemsQuantity::where([
            //             ['item_id', $item['item_id']],
            //             ['location_id', $store_id]
            //         ])->increment('quantity', $item['purchase_quantity']);

            //         $inventory_quantity = $item['purchase_quantity'] * -1;
            //         ItemsQuantity::where([
            //             ['item_id', $item['item_id']],
            //             ['location_id', $store_id]
            //         ])->decrement('quantity', $item['purchase_quantity']);
            //     }
            //     RequisitionItem::where('requisition_id', $requisition_id)->delete();
            //     Inventory::where('trans_comment', 'RECV ' . $requisition_id)->delete();
            // }


            $requisition = Requisition::updateOrCreate([
                'requisition_id' => $requisition_id
            ], $requisition_data);

            if ($requisition->requisition_id) {
                //db transaction starting
                $item_list = [];
                $inventory_list = [];
                foreach ($cart_items as $item) {
                    //adjust item quantity
                    if ($item['stock_type'] === 1) {
                        if ($item['is_boxed'] === 0) {
                            ItemsQuantity::where([
                                ['item_id', $item['item_id']],
                                ['location_id', $store_from]
                            ])->decrement('quantity', $item['quantity']);

                            ItemsQuantity::where([
                                ['item_id', $item['item_id']],
                                ['location_id', $store_to]
                            ])->increment('quantity', $item['quantity']);

                            $inventory_quantity = $item['quantity'];

                            //insert inventory data
                            $inventory_list[] = [
                                'item_id' => $item['item_id'],
                                'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                'trans_comment' => 'REQ ' . $requisition->requisition_id,
                                'location_id' => $store_from,
                                'quantity' => $inventory_quantity * -1,
                            ];

                            $inventory_list[] = [
                                'item_id' => $item['item_id'],
                                'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                'trans_comment' => 'REQ ' . $requisition->requisition_id,
                                'location_id' => $store_to,
                                'quantity' => $inventory_quantity,
                            ];
                        } else {
                            $boxed_items = BoxedItem::where('boxed_item_id', $item['item_id'])->get();
                            foreach ($boxed_items as $boxed_item) {
                                if ($boxed_item['details']['stock_type'] === 1) {
                                    //insert inventory data
                                    $inventory_quantity = $item['quantity'] * $boxed_item['quantity'];

                                    $inventory_list[] = [
                                        'item_id' => $boxed_item['item_id'],
                                        'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                        'trans_comment' => '[PACK] REQ ' . $requisition->requisition_id,
                                        'location_id' => $store_from,
                                        'quantity' =>  $inventory_quantity * -1,
                                    ];

                                    $inventory_list[] = [
                                        'item_id' => $boxed_item['item_id'],
                                        'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                        'trans_comment' => '[PACK] REQ ' . $requisition->requisition_id,
                                        'location_id' => $store_to,
                                        'quantity' =>  $inventory_quantity,
                                    ];

                                    ItemsQuantity::where([
                                        ['item_id', $boxed_item['item_id']],
                                        ['location_id', $store_from]
                                    ])->decrement('quantity', $item['quantity'] * $boxed_item['quantity']);

                                    ItemsQuantity::where([
                                        ['item_id', $boxed_item['item_id']],
                                        ['location_id', $store_to]
                                    ])->increment('quantity', $item['quantity'] * $boxed_item['quantity']);
                                }
                            }
                        }
                    }

                    //set item list for sales item
                    $item_list[] = [
                        'requisition_id' => $requisition->requisition_id,
                        'item_id' => $item['item_id'],
                        'requisition_quantity' => $item['quantity'],
                        'item_cost_price' => $item['cost_price'],
                    ];
                }


                RequisitionItem::insert($item_list);

                foreach ($inventory_list as $inventory) {
                    Inventory::create($inventory);
                }

                DB::commit();

                return response()->json([
                    'status' => true,
                    'receipt_id' => $requisition->requisition_id,
                    'message' => "requisition.new_requisition_or_update",
                ], 200);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "requisition.error_requisition_or_update",
                'info' => $e->getMessage(),
            ], 200);
        }
    }

    public function get_purchase_image($purchase_id)
    {
        $purchase = Purchase::find($purchase_id);
        // $image = $company_logo->value != '0' ? base64_encode(Storage::disk('public')->get("company_logo/$company_logo->value")) : null;
        $pic_filename = $purchase->pic_filename ? base64_encode(Storage::disk('public')->get("purchase_bills/" . $purchase->pic_filename)) : null;
        // $pic_filename = $purchase->pic_filename ? asset('storage/purchase_bills/' . $purchase->pic_filename) : null;
        return response()->json([
            'status' => true,
            'pic_filename' => $pic_filename,
        ], 200);
    }

    public function get_requisition_by_id(Request $request, $requisition_id)
    {
        if ($requisition_id) {
            $items = RequisitionItem::select(
                'item_name',
                "item_name_ar",
                "requisition_quantity as quantity",
                DB::raw("CONCAT(pos_store_units.unit_name_en,' - ',pos_store_units.unit_name_ar) as unit"),
                DB::raw('(requisition_quantity * cost_price) as total'),
                "item_cost_price as cost_price"
            )
                ->join('items', 'requisition_items.item_id', '=', 'items.item_id')
                ->join('store_units', 'store_units.unit_id', '=', 'items.unit_type')
                ->where('requisition_id', $requisition_id)->get();
            $data = [
                'purchase_id' => $requisition_id,
                'cartItems' => $items,

            ];
            if ($items) {
                return response()->json([
                    'status' => true,
                    'data' => $data,
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'sales.no_invoice_number',
                ], 200);
            }
        } else {
            return response()->json([
                'error' => true,
                'message' => 'sales.no_invoice_number',
            ], 200);
        }
    }

    public function get_purchase_by_id(Request $request, $purchase_id)
    {
        if ($purchase_id) {
            $location_id = $request->session()->get('store');
            $purchases = Purchase::find($purchase_id);
            $supplier_id = $purchases->supplier_id;

            $items = PurchaseItem::with(['details'])->where('purchase_id', $purchase_id)->get();
            $new_item = $items->map(function ($item) use ($location_id) {
                $item_taxs = ItemsTax::where('item_id', $item->item_id)->get();
                $sub_total = $item->item_sub_total;
                $total = 0;
                $total_percent = 0;
                $total_tax = 0;
                $tax_details = $item_taxs->map(function ($item_tax) use ($sub_total, &$total, &$total_percent, &$total_tax) {
                    $tax_fraction = $item_tax->percent / 100;
                    $tax_amount = number_format($sub_total * $tax_fraction, 2, '.', '');

                    $total += $sub_total + $tax_amount;
                    $total_percent += $item_tax->percent;
                    $total_tax += $tax_amount;
                    return [
                        "tax_name" => $item_tax->tax_name,
                        "percent" => $item_tax->percent,
                        "amount" => $tax_amount,
                    ];
                });

                //fine tune it
                $unit = StoreUnit::find($item->details->unit_type);
                $stock = ItemsQuantity::where('location_id', $location_id)
                    ->find($item->item_id);
                return [
                    "item_id" => $item->item_id,
                    "item_name" => $item->details->item_name,
                    "item_name_ar" => $item->details->item_name_ar,
                    "cost_price" => $item->item_cost_price,
                    "quantity" => $item->purchase_quantity,
                    "discount" => $item->discount,
                    "discount_type" => $item->discount_type,
                    "unit" => "{$unit->unit_name_en} - {$unit->unit_name_ar}",
                    "allowdesc" => $item->details->allowdesc,
                    "is_serialized" => $item->details->is_serialized,
                    "stock_type" => $item->details->stock_type,
                    "vatList" => $tax_details,
                    "vat" => "{$total_tax} [{$total_percent}%]",
                    "subTotal" => $item->item_sub_total,
                    "total" => $total,
                    "vatPercentage" => $total_percent,
                    "stock" => $stock->quantity,
                ];
            });

            $pic_filename = $purchases->pic_filename ? asset('storage/purchase_bills/' . $purchases->pic_filename) : null;

            $data = [
                'purchase_id' => $purchase_id,
                'supplierInfo' => $supplier_id ? Supplier::with(['details', 'opening_balance'])->find($supplier_id)->makeVisible('supplier_id') : null,
                'cartItems' => $new_item,
                'reference' => $purchases->reference,
                'comments' => $purchases->comments,
                'purchases' => $purchases,
                "invoiceImage" => $pic_filename,
            ];

            if ($items) {
                return response()->json([
                    'status' => true,
                    'data' => $data,
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'sales.no_invoice_number',
                ], 200);
            }
        } else {
            return response()->json([
                'error' => true,
                'message' => 'sales.no_invoice_number',
            ], 200);
        }
    }

    public function calculate_avarage_cost($item_id, $store_id, $new_cost, $new_quantity, $current_cost)
    {
        $current_quantity = ItemsQuantity::where([['item_id', $item_id], ['location_id', $store_id]])->first()->quantity;
        $old_total_cost = bcmul($current_quantity, $current_cost, 3);
        $new_total_cost = bcmul($new_quantity, $new_cost, 3);
        $total_quantity = bcadd($current_quantity, $new_quantity, 3);
        if ($total_quantity == 0) {
            return 0;
        }
        $total_cost = bcadd($old_total_cost, $new_total_cost, 3);

        $average_cost_price = bcdiv($total_cost, $total_quantity, 3);

        // $average_price = bcdiv(bcadd(bcmul($new_quantity, $new_cost), bcmul($current_quantity, $current_cost)), $total_quantity);
        return Item::where('item_id', $item_id)->update(array('cost_price' => $average_cost_price));
    }

    // public function calculateAverageCostWithOldQuantity($oldQuantity, $newQuantity, $oldTotalCost, $newTotalCost)
    // {
    //     $totalCost = $newTotalCost - $oldTotalCost;
    //     $quantity = $newQuantity - $oldQuantity;
    //     if ($quantity == 0) {
    //         return 0;
    //     }
    //     return $totalCost / $quantity;
    // }

    private function create_account_entry($purchase_id, $payment_info, $purchase_type, $supplier_id = null)
    {
        try {
            $transaction_type = ($purchase_type == 'CAPR' || $purchase_type == 'CRPR') ? 'R' : 'P';
            $description = ($transaction_type == 'P') ? 'PURCHASE' : 'PURCHASE RETURN';
            $transactions_data = [
                'transaction_type' => 'P',
                'document_no' => $purchase_id,
                'inserted_by' => decrypt(auth()->user()->encrypted_employee),
                'description' => "{$description} {$purchase_id}",
            ];

            //db transaction starting
            DB::beginTransaction();
            $transaction = AccountsTransaction::create($transactions_data);

            if ($purchase_type == 'CAPR' || $purchase_type == 'CAP') {
                if ($supplier_id) {
                    $ledger_data = [
                        [
                            'transaction_id' => $transaction->transaction_id,
                            'account_id' => '431', //account payable
                            'entry_type' => $transaction_type == 'P' ? 'C' : 'D',
                            'amount' => $payment_info['total'],
                            'person_id' => $supplier_id ? $supplier_id : null,
                            'person_type' => $supplier_id ? 'S' : null,
                        ], [
                            'transaction_id' => $transaction->transaction_id,
                            'account_id' => '449', //vat payable
                            'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                            'amount' => $payment_info['tax'],
                        ],
                        [
                            'transaction_id' => $transaction->transaction_id,
                            'account_id' => '211', //stock
                            'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                            'amount' => $payment_info['subtotal'],
                        ],
                    ];
                } else {
                    if (count($payment_info['payment']) > 0) {
                        $available_amount = 0;
                        $tax_payment_done = false;
                        $payable_tax = $payment_info['tax'];
                        $payable_amount = $payment_info['subtotal'];
                        foreach ($payment_info['payment'] as $payment) {
                            $available_amount = $payment['amount'];
                            //insert amount to specified ledger
                            $ledger_data[] = [
                                'transaction_id' => $transaction->transaction_id,
                                'account_id' => $payment['type'],
                                'entry_type' => $transaction_type == 'P' ? 'C' : 'D',
                                'amount' => $available_amount,
                                'person_id' => $supplier_id ? $supplier_id : null,
                                'person_type' => $supplier_id ? 'S' : null,
                            ];

                            while ($available_amount > 0) {
                                if (!$tax_payment_done) {
                                    $ledger_data[] = [
                                        'transaction_id' => $transaction->transaction_id,
                                        'account_id' => '449', //tax payabel
                                        'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                                        'amount' => ($available_amount >= $payable_tax) ? $payable_tax : $available_amount,
                                    ];
                                    //update availabe fund
                                    if ($available_amount >= $payable_tax) {
                                        $available_amount = bcsub($available_amount, $payable_tax, 2);
                                        $tax_payment_done = true;
                                    } else {
                                        $payable_tax = bcsub($payable_tax, $available_amount, 2);
                                        $available_amount = 0;
                                    }
                                }

                                if ($available_amount > 0) {
                                    $ledger_data[] = [
                                        'transaction_id' => $transaction->transaction_id,
                                        'account_id' => '211', //stock
                                        'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                                        'amount' => ($available_amount >= $payable_amount) ? $payable_amount : $available_amount,
                                    ];

                                    //update availabe fund
                                    if ($available_amount >= $payable_amount) {
                                        $available_amount = bcsub($available_amount, $payable_amount, 2);
                                    } else {
                                        $payable_amount = bcsub($payable_amount, $available_amount, 2);
                                        $available_amount = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                $ledger_data = [
                    [
                        'transaction_id' => $transaction->transaction_id,
                        'account_id' => '431', //account payable
                        'entry_type' => $transaction_type == 'P' ? 'C' : 'D',
                        'amount' => $payment_info['total'],
                        'person_id' => $supplier_id ? $supplier_id : null,
                        'person_type' => $supplier_id ? 'S' : null,
                    ], [
                        'transaction_id' => $transaction->transaction_id,
                        'account_id' => '449', //vat payable
                        'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                        'amount' => $payment_info['tax'],
                    ],
                    [
                        'transaction_id' => $transaction->transaction_id,
                        'account_id' => '211', //stock
                        'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                        'amount' => $payment_info['subtotal'],
                    ],
                ];
            }

            //applying aditional discount
            if ($payment_info['discount'] != 0) {
                $ledger_data[] = [
                    'transaction_id' => $transaction->transaction_id,
                    'account_id' => '821', //aditional discount
                    'entry_type' => $transaction_type == 'P' ? 'C' : 'D',
                    'amount' => $payment_info['discount'],
                ];
                $ledger_data[] = [
                    'transaction_id' => $transaction->transaction_id,
                    'account_id' => $supplier_id ? '241' : $payment_info['payment'][0]['type'],
                    'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                    'person_id' => $supplier_id ? $supplier_id : null,
                    'amount' => $payment_info['discount'],
                ];
            }

            foreach ($ledger_data as $ledger) {
                AccountLedgerEntry::insert($ledger);
            }

            //inserting payment vouchar
            if ($purchase_type == 'CAPR' || $purchase_type == 'CAP') {
                if ($supplier_id) {
                    if (count($payment_info['payment']) > 0) {
                        $voucher = AccountVoucher::create(['document_type' => 'TP']);
                        $type = $transaction_type == 'P' ? 'PURCHASE' : 'PURCHASE RETURN';
                        $voucher_transactions_data = [
                            'transaction_type' => 'TR',
                            'document_no' => $voucher->document_id,
                            'inserted_by' => decrypt(auth()->user()->encrypted_employee),
                            'description' => 'Voucher Against ' . $type . ' - ' . $purchase_id,
                        ];
                        $voucher_transaction = AccountsTransaction::create($voucher_transactions_data);
                        foreach ($payment_info['payment'] as $payment) {
                            $voucher_ledger_from_data = [
                                'transaction_id' => $voucher_transaction->transaction_id,
                                'account_id' => 431, //account payable
                                'entry_type' => $transaction_type == 'P' ? 'D' : 'C',
                                'amount' => $payment['amount'],
                                'person_id' => $supplier_id ? $supplier_id : null,
                                'person_type' => $supplier_id ? 'S' : null,
                            ];
                            AccountLedgerEntry::insert($voucher_ledger_from_data);

                            $voucher_ledger_to_data = [
                                'transaction_id' => $voucher_transaction->transaction_id,
                                'account_id' => $payment['type'],
                                'entry_type' => $transaction_type == 'P' ? 'C' : 'D',
                                'amount' => $payment['amount'],
                            ];

                            AccountLedgerEntry::insert($voucher_ledger_to_data);
                        }
                    }
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            info($e);
            return false;
        }
        return true;
    }
}
