<?php

namespace App\Jobs;

use App\GAZT\EInvoice\EGenerator;
use App\GAZT\EInvoice\EInvoice;
use App\GAZT\EInvoice\InvoiceData;
use App\GAZT\Xml\InvoiceTypeCode;
use App\Models\Configurations\Configuration;
use App\Models\GaztData;
use App\Models\GaztJob;
use App\Models\Sales\Sale;
use App\Models\Sales\SalesItem;
use Carbon\Carbon;
use Error;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ZatkaEinvoice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $invoice_data;
    public $invoice_id;
    public $invoice_type;
    public $job_id;
    /**
     * Create a new job instance.
     */
    public function __construct($job_id)
    {
        $this->job_id = $job_id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $document = GaztJob::find($this->job_id);
        if ($document->status !== 1) {
            $this->invoice_id = $document->document_id;
            $this->get_inv_type($document->inv_type);
            $invoice_data = $this->get_invoice_data();
            //get previusly downloaded/saved csid in settings page
            $egs_data = $this->get_egs_info();
            $invoice = new EInvoice($egs_data['egs_info']);
            
            $signed_invoice = $invoice->GenrateInvoice($invoice_data, $egs_data['certificate']);

            $egs = new EGenerator($egs_data['egs_info']);
            if ($document->bill_type == 'B2C') {
                $response = $egs->report_invoice($signed_invoice['invoice'], $signed_invoice['invoice_hash'], $invoice_data['uuid']);
                Storage::put("Einvoices/{$egs_data['egs_info']['VAT_number']}{$invoice_data['filename']}.xml", $signed_invoice['invoice']);
                $validation_results = $response['validationResults'];
                if ($response['reportingStatus'] == 'NOT_REPORTED') {
                    $document->status = 2;
                    $document->log = $this->get_status_message($validation_results['errorMessages']);
                } else {
                    $document->log = $this->get_status_message($validation_results['warningMessages']);
                    $document->status = 1;
                    $document->hash = $signed_invoice['invoice_hash'];
                }
                $document->save();
            } else {
                $response = $egs->clearance_invoice($signed_invoice['invoice'], $signed_invoice['invoice_hash'], $invoice_data['uuid']);
                info($response);
                $validation_results = $response['validationResults'];
                if ($response['clearanceStatus'] == 'CLEARED') {
                    $document->log = $this->get_status_message($validation_results['warningMessages']);
                    $document->status = 1;
                    $document->hash = $signed_invoice['invoice_hash'];
                    Storage::put("Einvoices/{$egs_data['egs_info']['VAT_number']}{$invoice_data['filename']}.xml", base64_decode($response['clearedInvoice']));
                } else {
                    $document->status = 2;
                    $document->log = $this->get_status_message($validation_results['errorMessages']);
                }
                $document->save();
            }
        } else {
            info('status error');
        }
    }

    private function get_egs_info()
    {
        $egs_data = GaztData::latest()->first();
        $company_data = Configuration::find([
            'egs_city',
            'egs_city_subdivision',
            'egs_postal_zone',
            'egs_building_number',
            'egs_street',
            'egs_plot_identification',
            'vat_number',
            'company_name',
            'egs_crn_number'
        ])->pluck('value', 'key');
        if (
            empty($egs_data['production_certificate']) ||
            empty($egs_data['production_key']) ||
            empty($egs_data['hash']) ||
            empty($egs_data['issuer']) ||
            empty($egs_data['serial_number']) ||
            empty($egs_data['public_key']) ||
            empty($egs_data['private_key']) ||
            empty($egs_data['signature']) ||
            empty($company_data['egs_crn_number']) ||
            empty($company_data['company_name']) ||
            empty($company_data['vat_number']) ||
            empty($company_data['egs_city']) ||
            empty($company_data['egs_city_subdivision']) ||
            empty($company_data['egs_street']) ||
            empty($company_data['egs_plot_identification']) ||
            empty($company_data['egs_building_number']) ||
            empty($company_data['egs_postal_zone'])
        ) {
            throw new Error("missing required information, please confirm all required data is saved.");
        }
        $egs_info = [
            "cert_info" => [
                'production_certificate' => $egs_data['production_certificate'], //autheticate api
                'production_key' => $egs_data['production_key'], //autheticate api
                'hash' => $egs_data['hash'], //certificate hash invoice xml parser
                'issuer' => $egs_data['issuer'], //invoice xml parser
                'serial_number' => $egs_data['serial_number'], //invoice xml parser
                'public_key' => $egs_data['public_key'],
                "private_key" => $egs_data['private_key'],
                'signature' => $egs_data['signature'], //qrcode
            ],
            "CRN_number" => $company_data['egs_crn_number'],
            "VAT_name" => $company_data['company_name'],
            "VAT_number" => $company_data['vat_number'],
            "location" => [
                "city" => $company_data['egs_city'],
                "city_subdivision" => $company_data['egs_city_subdivision'],
                "street" => $company_data['egs_street'],
                "plot_identification" => $company_data['egs_plot_identification'],
                "building" => $company_data['egs_building_number'],
                "postal_zone" => $company_data['egs_postal_zone'],
                "country_subentity" => "SA",
            ],
            "production" => env("PRODUCTION") == '0' ? false : true,
        ];
        return ['egs_info' => $egs_info, 'certificate' => $egs_data['production_certificate']];
    }

    private function get_invoice_data()
    {
        $invoice_type = $this->invoice_type;
        $invoice_id = $this->invoice_id;

        //fetch data invoice data
        if ($invoice_type == 381) {
        } else {
            $sales_data = $this->fetch_sale($invoice_id);
            $invoice_data = new InvoiceData();


            //Carbon::parse($sales_data->created_at, 'UTC')


            $invoice_data->set_invoice_number($sales_data->sale_id);
            $invoice_data->set_trans_time($sales_data->created_at);
            $invoice_data->set_invoice_type($sales_data->bill_type == 'B2C' ? InvoiceTypeCode::SIMPIFIED_TAX_INVOICE : InvoiceTypeCode::TAX_INVOICE);
            $invoice_data->set_bill_type($invoice_type);
            $invoice_data->set_items($sales_data->items);
            $invoice_data->set_cart_total($sales_data->cart_total);

            // $invoice_data->set_invoice_counter(1);
            // $invoice_data->set_previous_invoice_hash(1);

            // 'invoice_reference_commands' => 'Order Canceled',
            // 'invoice_reference' => 'SME00052',

            if ($sales_data->customer) {
                $customer_data = $sales_data->customer;
                $client_data = [
                    'name' => $customer_data['company_name'] ? $customer_data['company_name'] : $customer_data['name'],
                    'street_name' => $customer_data['street'],
                    'additional_street_name' => $customer_data['additional_street'],
                    'building_number' => $customer_data['building_number'],
                    'plot_identification' => $customer_data['plot_identification'],
                    'city' => $customer_data['city'],
                    'city_sub_division_name' => $customer_data['city_sub_division'],
                    'country_subentity' => 'SA',
                    'postal_zone' => $customer_data['zip'],
                    'party_identification_type' => $customer_data['identity_type'],
                    'party_identification_id' => $customer_data['party_id'],
                ];
                $invoice_data->set_client_data($client_data);
            }
        }
        return $invoice_data->generate();
    }

    private function fetch_sale($sale_id)
    {
        $sales_data = Sale::with([
            'customer' => function ($query) {
                $query->leftJoin('customer_details', 'customers.customer_id', 'customer_details.customer_id');
            },
        ])->find($sale_id);

        $sales_items = SalesItem::select('sales_items.sale_id as sale_id', 'sales_items.item_id as item_id', 'sales_items.*', 'items.item_name', 'store_units.unit_name_en')
            ->with([
                'tax_details' => function ($query) use ($sale_id) {
                    $query->where('sale_id', $sale_id)->select(['percent', 'amount', 'item_id']);
                },
            ])
            ->join('items', 'items.item_id', 'sales_items.item_id')
            ->join('store_units', 'items.unit_type', 'store_units.unit_id')
            ->where('sale_id', $sale_id)->get();

        $sales_data["items"] = $sales_items->map(function ($item, $key) {
            if ($item->discount_type == 'P') {
                $discount = ($item->discount / 100) * ($item->item_unit_price * $item->sold_quantity);
            } else {
                $discount = $item->discount;
            }
            return [
                'item_name' => $item->item_name,
                'unit_code' => $item->unit_name_en,
                'qty' => $item->sold_quantity,
                'tax' => $item->tax_details->sum('amount'),
                'price' => round(($item->item_sub_total + $item->discount) / $item->sold_quantity, 2),
                'rounding_amount' => round($item->item_sub_total + $item->tax_details->sum('amount'), 2),
                'discount' => $discount,
                'total_include_discount' => $item->item_sub_total,
                'tax_percent' => $item->tax_details->sum('percent'),
            ];
        });

        $sales_data["cart_total"] = [
            'total_without_discount' => $sales_data->sub_total,
            'total_after_discount' => $sales_data->sub_total,
            'total_with_vat' => $sales_data->total,
            'prepaid_amount' => 0,
            'payable_amount' => $sales_data->total,
            'discount' => 0,
            'tax_amount' => round($sales_data->tax, 2),
        ];
        return $sales_data;
    }

    private function get_inv_type($type)
    {
        if ($type == 'INV') {
            $this->invoice_type = 388;
        } elseif ($type == 'DEB') {
            $this->invoice_type = 383;
        } else {
            $this->invoice_type = 381;
        }
    }

    private function get_status_message($array)
    {
        // $messages = '';
        // foreach ($array as $item) {
        //     $messages .= $item['code'] . ', ';
        // }
        // return $messages;
        $messages = implode(', ', array_column($array, 'code'));
        return $messages;
    }
}
