<?php

namespace App\Http\Controllers;

use App\GAZT\Xml\InvoiceTypeCode;
use App\helpers\generateB2B;
use App\Helpers\GenerateTVL;
use App\Jobs\ZatkaEinvoice;
use App\Models\Account\AccountLedgerEntry;
use App\Models\Account\AccountsTransaction;
use App\Models\Account\AccountVoucher;
use App\Models\Configurations\Configuration;
use App\Models\Configurations\StoreUnit;
use App\Models\Configurations\Token;
use App\Models\Customer\Customer;
use App\Models\GaztJob;
use App\Models\Inventory;
use App\Models\Item\BoxedItem;
use App\Models\Item\Item;
use App\Models\Item\ItemsQuantity;
use App\Models\Item\ItemsTax;
use App\Models\Purchase\PurchaseItem;
use App\Models\Quotations\Quotation;
use App\Models\SalesPayment;
use App\Models\Sales\Sale;
use App\Models\Sales\SalesItem;
use App\Models\Sales\SalesItemsTaxes;
use App\Models\Workorders\Workorder;
use App\Models\Workorders\WorkorderUpdate;
use Carbon\Carbon;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use NumberFormatter;


class SalesController extends Controller
{

    public function cash_sales()
    {
        return Inertia::render('Screens/sales/CashSale');
    }
    public function cash_sales_return()
    {
        return Inertia::render('Screens/sales/CashSaleReturn');
    }
    public function credit_sales()
    {
        return Inertia::render('Screens/sales/CreditSale');
    }
    public function credit_sales_return()
    {
        return Inertia::render('Screens/sales/CreditSaleReturn');
    }
    public function quotation()
    {
        return Inertia::render('Screens/sales/Quatation');
    }
    public function workorder()
    {
        return Inertia::render('Screens/sales/Workorder');
    }
    public function suspended()
    {
        return Inertia::render('Screens/sales/Suspended');
    }
    public function daily_sales()
    {
        return Inertia::render('Screens/sales/DailyReport');
    }
    public function workorder_status()
    {
        return Inertia::render('Screens/sales/WorkOrderStatus');
    }

    public function show_e_invoice()
    {
        return Inertia::render('Screens/sales/Einvoices');
    }

    //save or update sales
    public function save_sale(Request $request, $api = false)
    {
        // if ($api) {
        //     $store_id = $request->header('Store');
        // } else {
        //     $store_id = $request->session()->get('store');
        // }

        $store_id = $api ? $request->header('Store') : $request->session()->get('store');

        $bill_type = $request->input('billType');
        $sale_type = $request->input('sale_type');
        $cart_items = $request->input('cartItems');
        $customer_info = $request->input('customerInfo');
        $payment_info = $request->input('paymentInfo');
        $print_after_sale = $request->input('printAfterSale');
        $workorder_id = $request->input('workorderID');
        $quotation_id = $request->input('quotationID');
        $customer_id = $customer_info ? $customer_info["customer_id"] : null;

        if ($sale_type === 'CAS' || $sale_type === 'CRS') {
            $sub_total = $payment_info['subtotal'];
            $tax = $payment_info['tax'];
            $discount = $payment_info['discount'];
            $total = $payment_info['total'];
            $invoice_type = InvoiceTypeCode::INVOICE;
        } else {
            $sub_total = $payment_info['subtotal'] * -1;
            $tax = $payment_info['tax'] * -1;
            $discount = $payment_info['discount'] * -1;
            $total = $payment_info['total'] * -1;
            $invoice_type = InvoiceTypeCode::CREDIT_NOTE;
        }

        try {
            if ($sale_type === 'CAS') {
                $enable_token = Configuration::where('key', 'enable_token')->pluck('value')->first();
                if ($enable_token) {
                    $currentToken = Token::where('location_id', $store_id)->pluck('last_token')->first();
                    Token::where('location_id', $store_id)->increment('last_token');
                } else {
                    $currentToken = null;
                }
            } else {
                $currentToken = null;
            }

            $sales = Sale::create([
                'customer_id' => $customer_id,
                'employee_id' => decrypt(auth()->user()->encrypted_employee),
                'bill_type' => $bill_type,
                'sale_type' => $sale_type,
                'sale_status' => 0,
                //'table_id' => '',
                'token' => $currentToken,
                'sub_total' => $sub_total,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'comments' => $request->input('comments'),
                'location_id' => $store_id,
            ]);


            //db transaction starting
            DB::beginTransaction();

            $total_cost_price = 0;
            $item_list = [];
            $item_tax_list = [];
            $inventory_list = [];

            foreach ($cart_items as $item) {
                // Calculate total cost price
                $total_cost_price += bcmul($item['cost_price'], $item['quantity']);

                // Calculate inventory quantity
                $inventory_quantity = $item['quantity'] * (($sale_type === 'CASR' || $sale_type === 'CRSR') ? 1 : -1);

                // Adjust inventory for stock items
                if ($item['stock_type'] == 1 || $item['is_boxed'] == 1) {
                    if ($item['is_boxed'] == 0) {
                        ItemsQuantity::where([
                            ['item_id', $item['item_id']],
                            ['location_id', $store_id]
                        ])->increment('quantity', $inventory_quantity);

                        $inventory_list[] = [
                            'item_id' => $item['item_id'],
                            'trans_user' => decrypt(auth()->user()->encrypted_employee),
                            'trans_comment' => 'POS ' . $sales->sale_id,
                            'location_id' => $store_id,
                            'quantity' => $inventory_quantity,
                        ];
                    } else {
                        $boxed_items = BoxedItem::where('boxed_item_id', $item['item_id'])->get();
                        foreach ($boxed_items as $boxed_item) {
                            if ($boxed_item['details']['stock_type'] === 1) {
                                $item_pack_quantity = $item['quantity'] * $boxed_item['quantity'];
                                ItemsQuantity::where([
                                    ['item_id', $boxed_item['item_id']],
                                    ['location_id', $store_id]
                                ])->increment('quantity', $item_pack_quantity * (($sale_type === 'CASR' || $sale_type === 'CRSR') ? 1 : -1));

                                $inventory_list[] = [
                                    'item_id' => $boxed_item['item_id'],
                                    'trans_user' => decrypt(auth()->user()->encrypted_employee),
                                    'trans_comment' => '[PACK] POS ' . $sales->sale_id,
                                    'location_id' => $store_id,
                                    'quantity' => $item_pack_quantity * (($sale_type === 'CASR' || $sale_type === 'CRSR') ? 1 : -1),
                                ];
                            }
                        }
                    }
                }

                // Calculate item details
                $item_sold_quantity = $item['quantity'] * (($sale_type === 'CAS' || $sale_type === 'CRS') ? 1 : -1);
                $item_cost_price = bcmul($item['cost_price'], $item_sold_quantity);
                $item_unit_price = $item['unit_price'] * (($sale_type === 'CAS' || $sale_type === 'CRS') ? 1 : -1);
                $item_discount = $item['discount'] * (($sale_type === 'CAS' || $sale_type === 'CRS') ? 1 : -1);
                $item_sub_total = $item['subTotal'] * (($sale_type === 'CAS' || $sale_type === 'CRS') ? 1 : -1);

                // Add item to sales item list
                $item_list[] = [
                    'sale_id' => $sales->sale_id,
                    'item_id' => $item['item_id'],
                    'description' => $item['description'] ?? null,
                    'serialnumber' => $item['serial'] ?? null,
                    'sold_quantity' => $item_sold_quantity,
                    'item_cost_price' => $item_cost_price,
                    'discount' => $item_discount,
                    'discount_type' => $item['discount_type'],
                    'item_unit_price' => $item_unit_price,
                    'item_sub_total' => $item_sub_total,
                    'location_id' => $store_id,
                ];

                // Add item taxes
                foreach ($item['vatList'] as $index => $vat) {
                    $vat_amount = $vat['amount'] * (($sale_type === 'CAS' || $sale_type === 'CRS') ? 1 : -1);
                    $item_tax_list[] = [
                        'sale_id' => $sales->sale_id,
                        'item_id' => $item['item_id'],
                        'line' => $index + 1,
                        'tax_name' => $vat['tax_name'],
                        'percent' => $vat['percent'],
                        'amount' => $vat_amount,
                    ];
                }
            }

            if (!$this->create_account_entry($sales->sale_id, $payment_info, $total_cost_price, $sale_type, $customer_id)) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => "sales.error_sales_or_update",
                    'info' => 'Error Inserting Account Entry',
                ], 200);
            }

            // if ($sale_type === 'CAS' || $sale_type === 'CASR') {
            //     if (count($payment_info['payment']) > 0) {
            //         //inserting payment details
            //         $payment_details = [];
            //         foreach ($payment_info['payment'] as $payment) {
            //             $amount = $sale_type === 'CAS' ? $payment['amount'] : $payment['amount'] * -1;
            //             $payment_details[] = [
            //                 'sale_id' => $sales->sale_id,
            //                 'payment_id' => $payment['payment_id'],
            //                 'amount' => $amount,
            //             ];
            //         }
            //         SalesPayment::insert($payment_details);
            //     }
            // }

            // Insert payment details
            if (in_array($sale_type, ['CAS', 'CASR'])) {
                $payment_details = [];
                foreach ($payment_info['payment'] as $payment) {
                    $amount = ($sale_type === 'CAS') ? $payment['amount'] : $payment['amount'] * -1;
                    $payment_details[] = [
                        'sale_id' => $sales->sale_id,
                        'payment_id' => $payment['payment_id'],
                        'amount' => $amount,
                    ];
                }
                SalesPayment::insert($payment_details);
            }

            // Insert sales items and taxes
            SalesItem::insert($item_list);
            SalesItemsTaxes::insert($item_tax_list);

            // Insert inventory adjustments
            foreach ($inventory_list as $inventory) {
                Inventory::create($inventory);
            }

            // Update sale status
            Sale::where('sale_id', $sales->sale_id)->update(['sale_status' => 1]);

            // Update related work order or quotation
            if ($workorder_id) {
                $this->updateWorkorder($workorder_id, $request->input('send_message'));
            } else if ($quotation_id) {
                Quotation::updateOrCreate(
                    ['quotation_id' => $quotation_id],
                    ['status' => 1]
                );
            }

            // Handle electronic invoicing
            // if (Configuration::find(['enable_einvoice'])->pluck('value')[0] == "1")
            if (Configuration::find('enable_einvoice')->value == "1") {
                $gazt_job = GaztJob::create([
                    'document_id' => $sales->sale_id,
                    'bill_type' => $bill_type,
                    'inv_type' => ($sale_type === 'CAS' || $sale_type === 'CRS') ? 'INV' : 'DEB',
                    'status' => 0,
                    'inserted_by' => decrypt(auth()->user()->encrypted_employee),
                ]);

                DB::commit();

                if ($bill_type == 'B2B') {
                    ZatkaEinvoice::dispatch($gazt_job->id);
                } elseif ($print_after_sale) {
                    $invoice_data = $this->fetch_sale($sales->sale_id);
                }
            } else {
                DB::commit();
                if ($print_after_sale) {
                    $invoice_data = $this->fetch_sale($sales->sale_id);
                }
            }

            return response()->json([
                'status' => true,
                'print_after_sale' => $print_after_sale,
                'invoice_data' => $print_after_sale ? $invoice_data : null,
                'message' => "sales.new_sales_or_update",
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "sales.error_sales_or_update",
                'info' => $e->getMessage(),
            ], 200);
        }
    }

    public function get_sale($sale_id)
    {
        $sale = $this->fetch_sale($sale_id == 'null' ? null : $sale_id);
        if ($sale) {
            return response()->json([
                'error' => false,
                'invoice_data' => $sale,
            ], 200);
        } else {
            return response()->json([
                'error' => true,
                'message' => 'sales.no_invoice_number',
            ], 200);
        }
    }

    public function get_sales_history($item_id, $type, $customer = null)
    {
        if ($type == "salesHistory") {
            $data = SalesItem::join('sales', 'sales.sale_id', 'sales_items.sale_id')
                ->select('created_at as date', 'sales.sale_id as sale_id', 'item_unit_price as price', 'sold_quantity as quantity')
                ->where('item_id', $item_id)->orderBy('date', 'desc')->limit(15)->get();
        } else if ($type == "customerHistory") {
            $data = SalesItem::join('sales', 'sales.sale_id', 'sales_items.sale_id')
                ->select('created_at as date', 'sales.sale_id as sale_id', 'item_unit_price as price', 'sold_quantity as quantity')
                ->where('sales.customer_id', $customer)
                ->where('item_id', $item_id)->orderBy('date', 'desc')->limit(15)->get();
        } else if ($type == "costHistory") {
            $data = PurchaseItem::join('purchases', 'purchases.purchase_id', 'purchase_items.purchase_id')
                ->select('created_at as date', 'purchases.purchase_id as sale_id', 'item_cost_price as price', 'purchase_quantity as quantity')
                ->where('item_id', $item_id)->orderBy('date', 'desc')->limit(15)->get();
        } else if ($type == "details") {
            $data = Item::join('items_quantities', 'items_quantities.item_id', 'items.item_id')
                ->select('item_name', 'item_name_ar', 'category', 'shelf', 'cost_price', 'unit_price', 'wholesale_price', 'minimum_price')
                ->where('items.item_id', $item_id)->first();
        }

        return response()->json([
            'status' => true,
            'data' => $data,
        ], 200);
    }

    //get sales
    private function fetch_sale($sale_id = null)
    {

        $salesQuery = Sale::with([
            'customer' => function ($query) {
                $query->with('details');
            },
            'employee' => function ($query) {
                $query->select(['name', 'employee_id']);
            },
            'payment',
        ]);

        // Fetch the specific quotation or the latest one
        $sale = $sale_id ? $salesQuery->find($sale_id) : $salesQuery->latest('sale_id')->first();

        if (!$sale) {
            return false;
        }

        $items = SalesItem::select(
            'sales_items.sale_id',
            'sales_items.item_id',
            'sales_items.*',
            'items.item_name',
            'items.item_name_ar',
            'items.category',
            DB::raw("CONCAT(pos_store_units.unit_name_en, ' ', pos_store_units.unit_name_ar) AS unit_name")
        )
            ->with(['tax_details' => function ($query) use ($sale) {
                $query->where('sale_id', $sale['sale_id'])->select(['percent', 'amount', 'item_id']);
            }])
            ->join('items', 'items.item_id', '=', 'sales_items.item_id')
            ->join('store_units', 'items.unit_type', '=', 'store_units.unit_id')
            ->where('sales_items.sale_id', $sale['sale_id'])
            ->get();

        $arFormatter = new NumberFormatter('ar', NumberFormatter::SPELLOUT);
        $enFormatter = new NumberFormatter('en', NumberFormatter::SPELLOUT);

        $sale['items'] = $items->map(function ($item) {
            return [
                'item_id' => $item->item_id,
                'item_name' => $item->item_name,
                'item_name_ar' => $item->item_name_ar,
                'category' => $item->category,
                'description' => $item->description,
                'serialnumber' => $item->serialnumber,
                'quantity' => $item->sold_quantity,
                'unit_name' => $item->unit_name,
                'item_unit_price' => $item->item_unit_price,
                'discount' => $item->discount,
                'discount_type' => $item->discount_type,
                'item_sub_total' => $item->item_sub_total,
                'location_id' => $item->location_id,
                'tax_amount' => $item->tax_details->sum('amount'),
                'tax_percent' => $item->tax_details->sum('percent'),
            ];
        });

        $sale['total_en'] = $enFormatter->format($sale['total'] - $sale['discount']);
        $sale['total_ar'] = $arFormatter->format($sale['total'] - $sale['discount']);

        $tvl_generator = new GenerateTVL;

        $store_data = Configuration::find(['company_name', 'company_name_ar', 'vat_number'])->pluck('value', 'key');

        $formatted_datetime = $sale['created_at']->isoFormat('YYYY-MM-DDTHH:mm:ss[Z]');

        $qr_data = $tvl_generator->generate([$store_data['company_name_ar'] ? $store_data['company_name_ar'] : $store_data['company_name'], $store_data['vat_number'], $formatted_datetime, $sale['total'], $sale['tax']]);
        // $sale['qr_codes'] = base64_encode(QrCode::format('png')->size(300)->generate($qr_data));

        $writer = new PngWriter();

        $qrCode = QrCode::create($qr_data)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin());

        $sale["qr_codes"] = base64_encode($writer->write($qrCode)->getString());
        $sale["qr_codes_string"] = $qr_data;

        // Ensure that the customer exists before making fields visible and hiding others
        $sale["customer"] =  $sale["customer"] ? $sale["customer"]->makeVisible(['customer_id'])->makeHidden("encrypted_customer") :  $sale["customer"];

        // Always modify the employee object fields
        $sale["employee"] = $sale["employee"]->makeVisible(['employee_id'])->makeHidden("encrypted_employee");
        return $sale;
    }

    // private function create_account_entry1($sale_id, $payment_info, $total_cost_price, $sale_type, $customer_id = null)
    // {
    //     try {
    //         $transaction_type = ($sale_type == 'CASR' || $sale_type == 'CRSR') ? 'R' : 'S';
    //         $description = ($transaction_type == 'S') ? 'SALES' : 'SALES RETURN';
    //         $transactions_data = [
    //             'transaction_type' => 'S',
    //             'document_no' => $sale_id,
    //             'inserted_by' => decrypt(auth()->user()->encrypted_employee),
    //             'description' => "{$description} {$sale_id}",
    //         ];

    //         //db transaction starting
    //         DB::beginTransaction();
    //         $transaction = AccountsTransaction::create($transactions_data);
    //         $ledger_data = [
    //             [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => '704', //cost of goods sold
    //                 'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
    //                 'amount' => $total_cost_price,
    //             ],
    //             [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => '211', //stock
    //                 'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                 'amount' => $total_cost_price,
    //             ],
    //         ];

    //         if ($sale_type == 'CASR' || $sale_type == 'CAS') {
    //             if ($customer_id) {
    //                 $ledger_data[] = [
    //                     'transaction_id' => $transaction->transaction_id,
    //                     'account_id' => '241', //account recivable
    //                     'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
    //                     'amount' => $payment_info['total'],
    //                     'person_id' => $customer_id ? $customer_id : null,
    //                     'person_type' => $customer_id ? 'C' : null,
    //                 ];
    //                 $ledger_data[] = [
    //                     'transaction_id' => $transaction->transaction_id,
    //                     'account_id' => '449', //tax payable
    //                     'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                     'amount' => $payment_info['tax'],
    //                 ];
    //                 $ledger_data[] = [
    //                     'transaction_id' => $transaction->transaction_id,
    //                     'account_id' => '500', //sales
    //                     'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                     'amount' => $payment_info['subtotal'],
    //                 ];
    //             } else {
    //                 if (count($payment_info['payment']) > 0) {
    //                     $available_amount = 0;
    //                     $tax_payment_done = false;
    //                     $payable_tax = $payment_info['tax'];
    //                     $payable_amount = $payment_info['subtotal'];
    //                     foreach ($payment_info['payment'] as $payment) {
    //                         $available_amount = $payment['amount'];
    //                         //insert amount to specified ledger
    //                         $ledger_data[] = [
    //                             'transaction_id' => $transaction->transaction_id,
    //                             'account_id' => $payment['type'],
    //                             'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
    //                             'amount' => $available_amount,
    //                             'person_id' => $customer_id ? $customer_id : null,
    //                             'person_type' => $customer_id ? 'C' : null,
    //                         ];

    //                         while ($available_amount > 0) {
    //                             if (!$tax_payment_done) {
    //                                 $ledger_data[] = [
    //                                     'transaction_id' => $transaction->transaction_id,
    //                                     'account_id' => '449', //tax payabel
    //                                     'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                                     'amount' => ($available_amount >= $payable_tax) ? $payable_tax : $available_amount,
    //                                 ];
    //                                 //update availabe fund
    //                                 if ($available_amount >= $payable_tax) {
    //                                     $available_amount = bcsub($available_amount, $payable_tax, 2);
    //                                     $tax_payment_done = true;
    //                                 } else {
    //                                     $payable_tax = bcsub($payable_tax, $available_amount, 2);
    //                                     $available_amount = 0;
    //                                 }
    //                             }

    //                             if ($available_amount > 0) {
    //                                 $ledger_data[] = [
    //                                     'transaction_id' => $transaction->transaction_id,
    //                                     'account_id' => '500', //sales
    //                                     'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                                     'amount' => ($available_amount >= $payable_amount) ? $payable_amount : $available_amount,
    //                                 ];

    //                                 //update availabe fund
    //                                 if ($available_amount >= $payable_amount) {
    //                                     $available_amount = bcsub($available_amount, $payable_amount, 2);
    //                                 } else {
    //                                     $payable_amount = bcsub($payable_amount, $available_amount, 2);
    //                                     $available_amount = 0;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         } else {
    //             $ledger_data[] = [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => '241', //account recivable
    //                 'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
    //                 'amount' => $payment_info['total'],
    //                 'person_id' => $customer_id ? $customer_id : null,
    //                 'person_type' => $customer_id ? 'C' : null,
    //             ];
    //             $ledger_data[] = [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => '449', //tax payable
    //                 'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                 'amount' => $payment_info['tax'],
    //             ];
    //             $ledger_data[] = [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => '500', //sales
    //                 'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                 'amount' => $payment_info['subtotal'],
    //             ];
    //         }

    //         //applying aditional discount
    //         if ($payment_info['discount'] != 0) {
    //             $ledger_data[] = [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => '821', //aditional discount
    //                 'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
    //                 'amount' => $payment_info['discount'],
    //             ];
    //             $ledger_data[] = [
    //                 'transaction_id' => $transaction->transaction_id,
    //                 'account_id' => $customer_id ? '241' : $payment_info['payment'][0]['type'],
    //                 'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                 'person_id' => $customer_id ? $customer_id : null,
    //                 'amount' => $payment_info['discount'],
    //             ];
    //         }

    //         foreach ($ledger_data as $ledger) {
    //             AccountLedgerEntry::insert($ledger);
    //         }

    //         //inserting payment vouchar
    //         if ($sale_type == 'CAS' || $sale_type == 'CASR') {
    //             if ($customer_id) {
    //                 if (count($payment_info['payment']) > 0) {
    //                     $voucher = AccountVoucher::create(['document_type' => 'TP']);
    //                     $type = $transaction_type == 'S' ? 'SALES' : 'SALES RETURN';
    //                     $voucher_transactions_data = [
    //                         'transaction_type' => 'TR',
    //                         'document_no' => $voucher->document_id,
    //                         'inserted_by' => decrypt(auth()->user()->encrypted_employee),
    //                         'description' => 'Voucher Against ' . $type . ' - ' . $sale_id,
    //                     ];
    //                     $voucher_transaction = AccountsTransaction::create($voucher_transactions_data);
    //                     foreach ($payment_info['payment'] as $payment) {
    //                         $voucher_ledger_from_data = [
    //                             'transaction_id' => $voucher_transaction->transaction_id,
    //                             'account_id' => 241,
    //                             'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
    //                             'amount' => $payment['amount'],
    //                             'person_id' => $customer_id ? $customer_id : null,
    //                             'person_type' => $customer_id ? 'C' : null,
    //                         ];
    //                         AccountLedgerEntry::insert($voucher_ledger_from_data);

    //                         $voucher_ledger_to_data = [
    //                             'transaction_id' => $voucher_transaction->transaction_id,
    //                             'account_id' => $payment['type'],
    //                             'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
    //                             'amount' => $payment['amount'],
    //                         ];

    //                         AccountLedgerEntry::insert($voucher_ledger_to_data);
    //                     }
    //                 }
    //             }
    //         }
    //         DB::commit();
    //     } catch (\Exception $e) {

    //         DB::rollBack();
    //         info($e);
    //         return false;
    //     }
    //     return true;
    // }
    private function create_account_entry($sale_id, $payment_info, $total_cost_price, $sale_type, $customer_id = null)
    {


        try {
            $transaction_type = ($sale_type == 'CASR' || $sale_type == 'CRSR') ? 'R' : 'S';
            $description = ($transaction_type == 'S') ? 'SALES' : 'SALES RETURN';

            $transactions_data = [
                'transaction_type' => 'S',
                'document_no' => $sale_id,
                'inserted_by' => decrypt(auth()->user()->encrypted_employee),
                'description' => "{$description} {$sale_id}",
            ];

            // Start database transaction
            DB::beginTransaction();

            // Create account transaction
            $transaction = AccountsTransaction::create($transactions_data);

            // Prepare ledger entries
            $ledger_data = [
                [
                    'transaction_id' => $transaction->transaction_id,
                    'account_id' => '704', // cost of goods sold
                    'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
                    'amount' => $total_cost_price,
                ],
                [
                    'transaction_id' => $transaction->transaction_id,
                    'account_id' => '211', // stock
                    'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                    'amount' => $total_cost_price,
                ],
            ];

            if ($sale_type == 'CASR' || $sale_type == 'CAS') {
                if ($customer_id) {
                    $ledger_data = array_merge($ledger_data, $this->prepareCreditOrCreditReturnLedgerData($transaction, $transaction_type, $payment_info, $customer_id));
                } else {
                    $ledger_data = array_merge($ledger_data, $this->prepareCashOrCashReturnLedgerData($transaction, $transaction_type, $payment_info, $customer_id));
                }
            } else {
                $ledger_data = array_merge($ledger_data, $this->prepareCreditOrCreditReturnLedgerData($transaction, $transaction_type, $payment_info, $customer_id));
            }

            // Apply additional discount if any
            if ($payment_info['discount'] != 0) {
                $ledger_data[] = [
                    'transaction_id' => $transaction->transaction_id,
                    'account_id' => '821', // additional discount
                    'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
                    'amount' => $payment_info['discount'],
                ];
                $ledger_data[] = [
                    'transaction_id' => $transaction->transaction_id,
                    'account_id' => $customer_id ? '241' : $payment_info['payment'][0]['type'],
                    'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                    'amount' => $payment_info['discount'],
                    'person_id' => $customer_id ? $customer_id : null,
                ];
            }

            // Insert ledger entries
            foreach ($ledger_data as $ledger) {
                AccountLedgerEntry::insert($ledger);
            }

            // Handle payment vouchers for cash sales or returns
            if ($sale_type == 'CAS' || $sale_type == 'CASR') {
                if ($customer_id && count($payment_info['payment']) > 0) {
                    $this->createPaymentVoucher($sale_id, $transaction_type, $payment_info, $customer_id);
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

    //get daily sales
    public function get_daily_sales($from, $to, $page, $size, $sortitem, $sortdir)
    {
        $from_date = Carbon::createFromFormat('d-m-Y', $from)->startOfDay()->setTimezone('Asia/Qatar');
        $to_date = Carbon::createFromFormat('d-m-Y', $to)->endOfDay()->setTimezone('Asia/Qatar');

        $per_page = $size ? $size : 10;
        try {
            $data = Sale::whereBetween('created_at', [$from_date, $to_date])->with(['payment'])->paginate($per_page, ['*'], 'page', $page);
            $total = SalesPayment::join('sales', 'sales_payments.sale_id', 'sales.sale_id')
                ->join('payment_options', 'sales_payments.payment_id', 'payment_options.payment_id')
                ->select(DB::raw("SUM(amount) as amount"), 'sales_payments.payment_id', 'payment_options.payment_name_en', 'payment_options.payment_name_ar')
                ->whereBetween('sales.created_at', [$from_date, $to_date])
                ->groupBy(DB::raw("payment_id"))
                ->get()->transform(function ($payment) {
                    return [
                        "item" => $payment["payment_name_en"] . " : " . $payment["payment_name_ar"],
                        "amount" => $payment["amount"],
                    ];
                });

            return response()->json([
                'status' => true,
                'data' => $data,
                'summary_data' => $total,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'info' => $e->getMessage(),
            ], 200);
        }
    }

    public function get_sale_by_id(Request $request, $sale_id, $api = false)
    {
        if ($sale_id) {
            if ($api) {
                $location_id = $request->header('Store');
            } else {
                $location_id = $request->session()->get('store');
            }
            $sales = Sale::find($sale_id);
            if ($sales) {
                $customer_id = $sales->customer_id;
                $items = SalesItem::with(['details'])->where('sale_id', $sale_id)->get();
                $new_item = $items->map(function ($item) use ($location_id) {
                    $item_taxs = ItemsTax::where('item_id', $item->item_id)->get();
                    $sub_total = $item->item_sub_total;
                    $total = 0;
                    $total_percent = 0;
                    $total_tax = 0;
                    $tax_details = $item_taxs->map(function ($item_tax) use ($sub_total, &$total, &$total_percent, &$total_tax) {
                        $tax_fraction = $item_tax->percent / 100;
                        $tax_amount = number_format($sub_total * $tax_fraction, 2);
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
                        "minimum_price" => $item->details->minimum_price,
                        "quantity" => $item->sold_quantity,
                        "stock" => $stock->quantity,
                        "stock_type" => $item->details->stock_type,
                        "subTotal" => $item->item_sub_total,
                        "total" => $total,
                        "unit" => "{$unit->unit_name_en} - {$unit->unit_name_ar}",
                        "unit_price" => $item->item_unit_price,
                        "allowdesc" => $item->details->allowdesc,
                        "cost_price" => $item->item_cost_price,
                        "discount" => $item->discount,
                        "discount_type" => $item->discount_type,
                        "is_serialized" => $item->details->is_serialized,
                        "is_boxed" => $item->details->is_boxed,
                        "vatList" => $tax_details,
                        "vat" => "{$total_tax} [{$total_percent}%]",
                        "vatPercentage" => $total_percent,
                    ];
                });

                $data = [
                    'sale_id' => $sale_id,
                    'customerInfo' => $customer_id ? Customer::with(['details', 'opening_balance'])->find($customer_id)->makeVisible('customer_id') : null,
                    'cartItems' => $new_item,
                    'billType' => $sales->bill_type,
                    'comments' => $sales->comments,
                ];

                if ($items) {
                    return response()->json([
                        'status' => true,
                        'data' => $data,
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'sales.invalid_sale_id',
                    ], 200);
                }
            }
            return response()->json([
                'error' => true,
                'message' => 'sales.invalid_sale_id',
            ], 200);
        } else {
            return response()->json([
                'error' => true,
                'message' => 'sales.invalid_sale_id',
            ], 200);
        }
    }

    public function get_invoice_data()
    {
        $uuid = Str::uuid();
        $invoice_data = [
            "uuid" => $uuid,
            'bill_type' => InvoiceTypeCode::INVOICE,
            'invoice_type' => InvoiceTypeCode::SIMPIFIED_TAX_INVOICE,
            // "file_name" => " time + invoicenumber",
            "filename" => "test",
            "invoice_counter" => 1,
            'invoice_number' => 'SME00062',
            "previous_invoice_hash" => "NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==",
            "trans_time" => new \DateTime(),
            'invoice_reference_commands' => 'Order Canceled',
            'invoice_reference' => 'SME00052',
            "client_data" => [
                'name' => 'FAb',
                'street_name' => 'Ajwad Street',
                'additional_street_name' => 'A Road',
                'building_number' => '3353',
                'plot_identification' => '3434',
                'city' => 'jeddha',
                'city_sub_division_name' => 'fgff',
                'postal_zone' => '34534',
                'country_subentity' => 'SA',
                'party_identification_type' => 'NAT',
                'party_identification_id' => '2345',
            ],
            'cart_total' => [
                'total_without_discount' => 966,
                'total_after_discount' => 964,
                'total_with_vat' => 1108.90,
                'prepaid_amount' => 0,
                'payable_amount' => 1108.90,
                'discount' => 2,
                'tax_amount' => 144.90,
            ],
            'items' => [
                [
                    'item_name' => 'ALFA',
                    'price' => 22,
                    'tax' => 144.90,
                    'rounding_amount' => 1110.90, //amount without discount  include tax
                    'qty' => 44,
                    'unit_code' => "PCE",
                    'total_include_discount' => 966, //amount without discount without tax
                ],
            ],
        ];
        return $invoice_data;
    }

    public function generate_pdf()
    {
        $generate_b2b_pdf = new generateB2B();
        $generate_b2b_pdf->generate();
    }

    // Function to update work order
    private function updateWorkorder($workorder_id, $send_message)
    {
        Workorder::updateOrCreate(
            ['workorder_id' => $workorder_id],
            [
                'workorder_status' => 4,
                'comments' => 'updated by sale'
            ]
        );

        WorkorderUpdate::create([
            'workorder_id' => $workorder_id,
            'workorder_status' => 4,
            'comments' => 'updated by sale',
        ]);

        sendMessage($workorder_id, 3);

        if ($send_message) {
            sendMessage($workorder_id, 4);
        }
    }

    /**
     * Prepare ledger data for cash or cash return transactions.
     */
    private function prepareCashOrCashReturnLedgerData($transaction, $transaction_type, $payment_info, $customer_id)
    {
        $ledger_data = [];
        $available_amount = 0;
        $tax_payment_done = false;
        $payable_tax = $payment_info['tax'];
        $payable_amount = $payment_info['subtotal'];
        foreach ($payment_info['payment'] as $payment) {
            $available_amount = $payment['amount'];

            // Insert amount to specified ledger
            $ledger_data[] = [
                'transaction_id' => $transaction->transaction_id,
                'account_id' => $payment['type'],
                'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
                'amount' => $available_amount,
                'person_id' => $customer_id ? $customer_id : null,
                'person_type' => $customer_id ? 'C' : null,
            ];

            while ($available_amount > 0) {
                if (!$tax_payment_done) {
                    $ledger_data[] = [
                        'transaction_id' => $transaction->transaction_id,
                        'account_id' => '449', // tax payable
                        'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                        'amount' => ($available_amount >= $payable_tax) ? $payable_tax : $available_amount,
                    ];

                    if ($available_amount >= $payable_tax) {
                        $available_amount -= $payable_tax;
                        $tax_payment_done = true;
                    } else {
                        $payable_tax -= $available_amount;
                        $available_amount = 0;
                    }
                }

                if ($available_amount > 0) {
                    $ledger_data[] = [
                        'transaction_id' => $transaction->transaction_id,
                        'account_id' => '500', // sales
                        'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                        'amount' => ($available_amount >= $payable_amount) ? $payable_amount : $available_amount,
                    ];

                    //update availabel fund
                    if ($available_amount >= $payable_amount) {
                        $available_amount -= $payable_amount;
                    } else {
                        $payable_amount -= $available_amount;
                        $available_amount = 0;
                    }
                }
            }
        }

        return $ledger_data;
    }

    /**
     * Prepare ledger data for credit or credit return transactions.
     */
    private function prepareCreditOrCreditReturnLedgerData($transaction, $transaction_type, $payment_info, $customer_id)
    {
        return [
            [
                'transaction_id' => $transaction->transaction_id,
                'account_id' => '241', // account receivable
                'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
                'amount' => $payment_info['total'],
                'person_id' => $customer_id ? $customer_id : null,
                'person_type' => $customer_id ? 'C' : null,
            ],
            [
                'transaction_id' => $transaction->transaction_id,
                'account_id' => '449', // tax payable
                'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                'amount' => $payment_info['tax'],
            ],
            [
                'transaction_id' => $transaction->transaction_id,
                'account_id' => '500', // sales
                'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                'amount' => $payment_info['subtotal'],
            ],
        ];
    }

    /**
     * Create payment voucher for cash sales or returns.
     */
    private function createPaymentVoucher($sale_id, $transaction_type, $payment_info, $customer_id)
    {
        $voucher = AccountVoucher::create(['document_type' => 'TP']);
        $type = $transaction_type == 'S' ? 'SALES' : 'SALES RETURN';

        $voucher_transactions_data = [
            'transaction_type' => 'TR',
            'document_no' => $voucher->document_id,
            'inserted_by' => decrypt(auth()->user()->encrypted_employee),
            'description' => 'Voucher Against ' . $type . ' - ' . $sale_id,
        ];

        $voucher_transaction = AccountsTransaction::create($voucher_transactions_data);

        foreach ($payment_info['payment'] as $payment) {
            $voucher_ledger_from_data = [
                'transaction_id' => $voucher_transaction->transaction_id,
                'account_id' => 241,
                'entry_type' => $transaction_type == 'S' ? 'C' : 'D',
                'amount' => $payment['amount'],
                'person_id' => $customer_id ? $customer_id : null,
                'person_type' => $customer_id ? 'C' : null,
            ];
            AccountLedgerEntry::insert($voucher_ledger_from_data);

            $voucher_ledger_to_data = [
                'transaction_id' => $voucher_transaction->transaction_id,
                'account_id' => $payment['type'],
                'entry_type' => $transaction_type == 'S' ? 'D' : 'C',
                'amount' => $payment['amount'],
            ];
            AccountLedgerEntry::insert($voucher_ledger_to_data);
        }
    }
}
