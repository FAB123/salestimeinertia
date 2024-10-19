<?php

namespace App\Http\Controllers;

use App\Models\Account\AccountOpeningBalance;
use App\Models\Configurations\StockLocation;
use App\Models\Configurations\TaxScheme;
use App\Models\Inventory;
use App\Models\Item\Item;
use App\Models\Item\ItemsQuantity;
use App\Models\Item\ItemsTax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        return Inertia::render('Screens/items/ViewItems');
    }

    public function add_items()
    {
        return Inertia::render('Screens/items/AddItems');
    }
    public function opening_stock()
    {
        return Inertia::render('Screens/items/OpeningStock');
    }
    public function price_updater()
    {
        return Inertia::render('Screens/items/PriceUpdater');
    }

    public function edit_item($item_id)
    {
        return Inertia::render('Screens/items/AddItems', ['itemId' => $item_id]);
    }

    //get all items
    public function getAll(Request $request, $page, $size = 10, $keyword, $sortitem, $sortdir)
    {
        $location_id = $request->session()->get('store');

        $result = Item::join('items_quantities', 'items_quantities.item_id', 'items.item_id')
            ->where('items_quantities.location_id', $location_id)
            ->when($keyword != 'null', function ($query) use ($keyword) {
                $query->whereRaw("item_name LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("barcode LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("shelf LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("item_name_ar LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("category LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("cost_price LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("unit_price LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("wholesale_price LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("description LIKE '%" . $keyword . "%'");
            })->when(
                $sortitem != 'null',
                function ($query) use ($sortitem, $sortdir) {
                    $query->orderBy($sortitem, $sortdir);
                }
            )->paginate($size, ['*'], 'page', $page);

        return response()->json([
            'data' => $result,
        ], 200);
    }

    //save or update Item
    public function save_item(Request $request)
    {
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $fileName = Storage::disk('public')->put('item_img', $image, 'public');
            $fileName = explode("/", $fileName)[1];
        }

        $item = array(
            'barcode' => $request->input('barcode'),
            'item_name' => $request->input('item_name'),
            'item_name_ar' => $request->input('item_name_ar'),
            'category' => $request->input('category'),
            'cost_price' => $request->input('cost_price'),
            'unit_price' => $request->input('unit_price'),
            'wholesale_price' => $request->input('wholesale_price'),
            'minimum_price' => $request->input('minimum_price'),
            'reorder_level' => $request->input('reorder_level'),
            'unit_type' => $request->input('unit_type'),
            'pos_view' => $request->input('pos_view') == 'true' ? 1 : 0,
            'stock_type' => $request->input('stock_type') == 'true' ? 1 : 0,
            'allowdesc' => $request->input('allowdesc') == 'true' ? 1 : 0,
            'is_serialized' => $request->input('is_serialized') == 'true' ? 1 : 0,
            'shelf' => $request->input('shelf'),
            'is_boxed' => 0,
            'description' => $request->input('description'),
        );

        isset($fileName) && $item['pic_filename'] = $fileName;

        try {
            //db transaction starting
            DB::beginTransaction();
            //insert or update item table
            $saved_item = Item::updateOrCreate([
                'item_id' => $request->input('itemID') ? decrypt($request->input('itemID')) : null,
            ], $item);

            ItemsTax::find($saved_item->item_id) && ItemsTax::find($saved_item->item_id)->delete();
            foreach (json_decode($request->input('vatList'), true) as $item) {
                if ($item['percent']) {
                    ItemsTax::insert([
                        'item_id' => $saved_item->item_id,
                        'tax_name' => $item['tax_name'],
                        'percent' => $item['percent'],
                    ]);
                }
            }

            if (!$request->input('itemID')) {
                // pos_items_quantities
                $locations = StockLocation::all();
                foreach ($locations as $location) {
                    ItemsQuantity::updateOrInsert(
                        ['location_id' => $location['location_id'], 'item_id' => $saved_item['item_id']],
                        ['quantity' => 0]
                    );

                    AccountOpeningBalance::updateOrInsert(
                        ['account_sub_id' => $saved_item['item_id'], 'location_id' => $location['location_id'], 'account_id' => 211, 'year' => date('Y')],
                        ['amount' => 0, 'inserted_by' => decrypt(auth()->user()->encrypted_employee)]
                    );
                }
            }

            DB::commit();
            return response()->json([
                'error' => false,
                'item_id' => $saved_item->item_id,
                'message' => "items.new_item_or_update",
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => true,
                'message' => "items.error_new_or_update",
                'info' => $e->getMessage(),
            ], 200);
        }
    }

    public function save_price_update(Request $request)
    {
        try {
            Item::updateOrCreate([
                'barcode' => $request->input('barcode'),
            ], [
                'item_name' => $request->input('item_name'),
                'item_name_ar' => $request->input('item_name_ar'),
                'category' => $request->input('category'),
                'cost_price' => $request->input('cost_price'),
                'unit_price' => $request->input('unit_price'),
                'price_updated' => 1
            ]);

            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Exception $e) {
            info($e->getMessage());
            return response()->json([
                'error' => true,
            ], 200);
        }
    }
    //delete Item from array
    public function delete_item(Request $request)
    {
        foreach ($request->input() as $item) {
            try {
                Item::find(decrypt($item))->delete();
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => $e,
                ], 200);
            }
        }
        return response()->json([
            'status' => true,
            'message' => "items.delete",
        ], 200);
    }

    //get item by id
    public function get_item_by_id(Request $request, $item_id)
    {
        $decrypted_item_id = decrypt($item_id);
        $location_id = $request->session()->get('store');
        $item = Item::with('vat_list', 'opening_balance')->find($decrypted_item_id);
        $item_quantity = ItemsQuantity::where('location_id', $location_id)->find($item_id);
        $item['item_quantity'] = $item_quantity ? $item_quantity->quantity : "0.00";
        $item['pic_filename'] = $item->pic_filename ? asset('storage/item_img/' . $item->pic_filename) : null;

        return response()->json([
            'data' => $item,
        ], 200);
    }

    //get item by barcode
    public function get_item_by_barcode($barcode)
    {
        $item = Item::where('barcode', $barcode)->first();
        return response()->json([
            'status' => $item ? true : false,
            'data' => $item,
        ], 200);
    }

    //validate barcode
    public function validatebarcode($barcode)
    {
        $item = Item::where('barcode', '=', $barcode)->count();
        return response()->json([
            'status' => ($item > 0) ? false : true,
        ], 200);
    }

    //search_items by barcode or item name
    public function search_items(Request $request, $type, $keyword, $api = false)
    {
        if ($api) {
            $location_id = $request->header('Store');
        } else {
            $location_id = $request->session()->get('store');
        }

        $result = Item::when($type == "P", function ($query) {
            $query->where('stock_type', 1);
        })
            ->whereRaw("item_name LIKE '%" . $keyword . "%'")
            ->orWhereRaw("barcode LIKE '%" . $keyword . "%'")
            ->orWhereRaw("item_name_ar LIKE '%" . $keyword . "%'")
            ->limit(15)
            ->with(['vat_list', 'item_unit', 'item_quantity' => function ($q) use ($location_id) {
                $q->where('items_quantities.location_id', $location_id);
            }])
            ->get();
        $result->makeVisible('item_id');

        return response()->json([
            'data' => $result,
        ], 200);
    }

    public function get_all_item_category()
    {
        $result = Item::select('category')->groupBy('category')->get();

        return response()->json([
            'data' => $result,
        ], 200);
    }

    public function get_all_item_by_category($category)
    {
        $result = Item::where('pos_view', 1)
            ->where("category", $category)
            ->with(['vat_list', 'item_unit'])->get();

        return response()->json([
            'data' => $result->makeVisible('item_id'),
        ], 200);
    }

    public function get_all_item_for_pos()
    {
        $result = Item::where('pos_view', 1)->with(['vat_list', 'item_unit'])->get();

        return response()->json([
            'data' => $result->makeVisible('item_id'),
        ], 200);
    }

    //search_items by barcode or item name
    public function search_items_by_barcode(Request $request, $keyword, $api = false)
    {
        if ($api) {
            $location_id = $request->header('Store');
        } else {
            $location_id = $request->session()->get('store');
        }

        $item = Item::where("barcode", $keyword)->orWhere("item_id", $keyword)->with(['vat_list', 'item_unit'])->first();
        if ($item) {
            $item->makeVisible('item_id');
            $item->makeHidden('encrypted_item');
            $item['item_quantity'] = ItemsQuantity::select('quantity')->where('location_id', $location_id)->find($item->item_id)->quantity;
        }

        return response()->json([
            'data' => $item,
        ], 200);
    }

    //search_category by barcode or item name
    public function search_category($keyword = null)
    {
        $query = Item::query();
        $query->whereRaw("category LIKE '%" . $keyword . "%'");
        $query->select('category');
        $query->groupBy('category');
        $result = $query->get();

        return response()->json([
            'data' => $result,
        ], 200);
    }

    //insert bulk items from excel
    public function bulk_insert(Request $request)
    {
        ini_set('max_execution_time', 60000000);
        ini_set('memory_limit', '1000M');
        $failed_data = array();
        foreach ($request->input() as $data) {

            try {
                info(date("H:i:s"));

                $itemExists = Item::where('barcode', $data['barcode'])->exists();

                if (!$itemExists) {

                    //db transaction starting
                    DB::beginTransaction();
                    $item = Item::Create([
                        'barcode' => isset($data['barcode']) ? $data['barcode'] : null,
                        'item_name' => isset($data['item_name']) ? $data['item_name'] : null,
                        'item_name_ar' => isset($data['item_name_ar']) ? $data['item_name_ar'] : null,
                        'category' => isset($data['category']) ? $data['category'] : "",
                        'cost_price' => isset($data['cost_price']) && $data['cost_price'] !== "NULL" ? $data['cost_price'] : 0,
                        'unit_price' => isset($data['unit_price']) && $data['unit_price'] !== "" ? $data['unit_price'] : 0,
                        // 'cost_price' => isset($data['cost_price']) ? $data['cost_price'] == "" ? 0 : $data['cost_price'] : 0,
                        // 'unit_price' => isset($data['unit_price']) ? $data['unit_price'] : 0,
                        'wholesale_price' => isset($data['wholesale_price']) ? $data['wholesale_price'] : 0,
                        'minimum_price' => isset($data['minimum_price']) ? $data['minimum_price'] : 0,
                        'reorder_level' => isset($data['reorder_level']) ? $data['reorder_level'] : 0,
                        'allowdesc' => isset($data['allowdesc']) ? $data['allowdesc'] : 0,
                        'is_serialized' => isset($data['allowserial']) ? $data['allowserial'] : 0,
                        'shelf' => isset($data['shelf']) ? $data['shelf'] : null,
                        'stock_type' => isset($data['stock_type']) ? $data['stock_type'] : 1,
                        'unit_type' => isset($data['unit_type']) ? $data['unit_type'] : 1,
                        'is_boxed' => 0,
                        'description' => isset($data['comments']) ? $data['comments'] : null,
                    ]);

                    $vat_list = TaxScheme::all();
                    foreach ($vat_list as $vat) {
                        if ($vat['percent']) {
                            ItemsTax::insert([
                                'item_id' => $item->item_id,
                                'tax_name' => $vat['tax_name'],
                                'percent' => $vat['percent'],
                            ]);
                        }
                    }

                    // pos_items_quantities
                    $locations = StockLocation::all();
                    foreach ($locations as $location) {
                        ItemsQuantity::updateOrInsert(
                            ['location_id' => $location['location_id'], 'item_id' => $item['item_id']],
                            ['quantity' => 0]
                        );

                        AccountOpeningBalance::updateOrInsert(
                            ['account_sub_id' => $item['item_id'], 'location_id' => $location['location_id'], 'account_id' => 211, 'year' => date('Y')],
                            ['amount' => 0, 'inserted_by' => decrypt(auth()->user()->encrypted_employee)]
                        );
                    }
                    DB::commit();
                }
            } catch (\Exception $e) {
                info($data['barcode']);

                DB::rollBack();
                $data["error"] = $e;
                info($e);
                $failed_data[] = $data;
            }
        }
        return response()->json([
            'failed' => $failed_data,
        ], 200);
    }

    //search_items for oprning balance
    public function search_items_for_opening_balance(Request $request, $keyword)
    {
        $store_id = $request->session()->get('store');
        $page = $request->input('page', 1);
        $per_page = $request->input('size') ? $request->input('size') : 10;
        $items = $this->fetch_ob_items($keyword, $store_id, $per_page, $page);

        return response()->json([
            'items' => $items,
        ], 200);
    }

    public function save_items_opening_balance(Request $request)
    {
        $item = $request->input('item');
        $location_id = $request->session()->get('store');
        foreach ($request->input('item') as $item) {
            $item_id = $item['item_id'];
            DB::table('items_quantities')
                ->updateOrInsert(
                    ['location_id' => $location_id, 'item_id' => $item_id],
                    ['quantity' => $item['quantity']]
                );
            $opening_balance = bcmul($item['cost_price'], $item['quantity']);
            DB::table('account_opening_balances')
                ->updateOrInsert(
                    ['account_sub_id' => $item_id, 'location_id' => $location_id, 'account_id' => 211, 'year' => date('Y')],
                    ['amount' => $opening_balance, 'ob' => 1, 'inserted_by' => decrypt(auth()->user()->encrypted_employee)]
                );
        }

        $items = $this->fetch_ob_items('null', $location_id, 10, 1);

        return response()->json([
            'items' => $items,
        ], 200);
    }

    private function fetch_ob_items($keyword = 'null', $store, $per_page, $page)
    {
        // $items = Item::select('items.item_id as item_id',
        //     'items.item_name as item_name',
        //     'items.item_name_ar as item_name_ar',
        //     'items.cost_price as cost_price',
        //     DB::raw('0 as quantity'),
        //     DB::raw("CONCAT(pos_store_units.unit_name_en,' - ',pos_store_units.unit_name_ar)  AS unit_name"))
        //     ->join('store_units', 'items.unit_type', 'store_units.unit_id')
        //     ->rightJoin('account_opening_balances', 'items.item_id', 'account_opening_balances.account_sub_id')
        //     ->leftJoin('items_quantities', 'items.item_id', 'items_quantities.item_id')
        //     ->where('items.stock_type', '1')
        //     ->where('items.is_boxed', '0')
        //     ->where('account_opening_balances.account_id', '211')
        //     ->where('account_opening_balances.ob', '0')
        //     ->where('account_opening_balances.location_id', $store)
        //     ->paginate($per_page, ['*'], 'page', $page);
        // return $items;
        $items = AccountOpeningBalance::select(
            'items.item_id as item_id',
            'items.item_name as item_name',
            'items.item_name_ar as item_name_ar',
            'items.cost_price as cost_price',
            DB::raw('0 as quantity'),
            DB::raw("CONCAT(pos_store_units.unit_name_en,' - ',pos_store_units.unit_name_ar)  AS unit_name")
        )
            ->where('account_opening_balances.account_id', '211')
            ->where('account_opening_balances.ob', '0')
            ->where('account_opening_balances.location_id', $store)
            ->when($keyword != 'null', function ($query) use ($keyword) {
                $query->whereRaw("item_name LIKE '%" . $keyword . "%'")
                    ->orWhereRaw("barcode LIKE '%" . $keyword . "%'");
            })
            ->join('items', 'account_opening_balances.account_sub_id', 'items.item_id')
            ->join('store_units', 'items.unit_type', 'store_units.unit_id')
            ->paginate($per_page, ['*'], 'page', $page);
        return $items;
    }

    public function generate_barcode(Request $request)
    {
        $item_id = decrypt($request->input('item'));
        $type = $request->input('type');
        $barcode = $request->input('barcode');
        try {
            $item = Item::find($item_id);
            if ($type == "manual") {
                $item->barcode = $barcode;
            } else {
                $gen_barcode =  env('GENERATED_BARCODE_SEQ') . '' . $item_id;
                $item->barcode = $gen_barcode;
            }
            if ($item->save()) {
                return response()->json([
                    'status' => true,
                    'data' => Item::find($item_id),
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                ], 200);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }

    public function get_inventory_details($item_id, $page)
    {
        $item_id = decrypt($item_id);
        $inventory = Inventory::select('inventories.created_at', 'trans_comment', 'quantity', 'location_name_en', 'location_name_ar')->where('item_id', $item_id)
            ->join('stock_locations', 'stock_locations.location_id', 'inventories.location_id')
            ->paginate('15', ['*'], 'page', $page);
        return response()->json([
            'status' => true,
            'data' => $inventory,
        ], 200);
    }
}
