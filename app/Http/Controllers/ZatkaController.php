<?php

namespace App\Http\Controllers;

use App\GAZT\EInvoice\EGenerator;
use App\GAZT\EInvoice\EInvoice;
use App\GAZT\Xml\InvoiceTypeCode;
use App\Jobs\ZatkaEinvoice;
use App\Models\Configurations\Configuration;
use App\Models\GaztData;
use App\Models\GaztJob;
use DOMDocument;
use Error;
use Illuminate\Http\Request as Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ZatkaController extends Controller
{
    public function test(Request $request)
    {
        try {
            $egs_data = $this->get_egs_info();
            $invoice_data = $this->get_invoice_data();

            $EInvoice = new EInvoice($egs_data['egs_info']);
            $signed_invoice = $EInvoice->GenrateInvoice($invoice_data, $egs_data['certificate']);

            $egs = new EGenerator($egs_data['egs_info']);

            $dom = new DOMDocument();

            $dom->loadXML($signed_invoice['invoice']);

            //get qr from zatka invoice
            $xpath = new \DOMXPath ($dom);
            $query = "*[local-name()='AdditionalDocumentReference'][cbc:ID[normalize-space(text()) = 'QR']]";
            $entries = $xpath->query($query);
            print_r($entries[0]->getElementsByTagName('EmbeddedDocumentBinaryObject')[0]->nodeValue);

            $dom->save('aa.xml');

            Storage::put('public/aa.xml', $signed_invoice['invoice']);

            return $egs->report_invoice($signed_invoice['invoice'], $signed_invoice['invoice_hash'], $invoice_data['uuid']);
            // return $egs->clearance_invoice($signed_invoice['invoice'], $signed_invoice['invoice_hash'], $uuid);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => true,
                "message" => $th->getMessage(),
            ], 200);
        }
    }

    protected function isElement($node)
    {
        return $node->nodeType === XML_ELEMENT_NODE;
    }

    private function get_egs_info()
    {
        $egs_data = GaztData::latest()->first();
        $company_data = Configuration::find(['egs_city',
            'egs_city_subdivision',
            'egs_postal_zone',
            'egs_building_number',
            'egs_street',
            'egs_plot_identification',
            'vat_number',
            'company_name',
            'egs_crn_number'])->pluck('value', 'key');
        if (empty($egs_data['production_certificate']) ||
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

    public function get_invoice_data()
    {
        $uuid = Str::uuid();
        $invoice_data = [
            "uuid" => $uuid,
            'bill_type' => InvoiceTypeCode::INVOICE,
            'invoice_type' => InvoiceTypeCode::TAX_INVOICE,
            // "file_name" => "vat + time + invoicenumber",
            "file_name" => "test",
            "invoice_counter" => 1,
            'invoice_number' => 'SME00062',
            "previous_invoice_hash" => "NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==",
            "trans_time" => new \DateTime (),
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
                'total_without_discount' => 1932,
                'total_after_discount' => 1932,
                'total_with_vat' => 2221.8,
                'prepaid_amount' => 0,
                'payable_amount' => 2221.8,
                'discount' => 0,
                'tax_amount' => 289.8,
            ],
            'items' => [
                [
                    'item_name' => 'ALFA',
                    'price' => 22,
                    'qty' => 44,
                    'discount' => 2,
                    'unit_code' => "PCE",
                    'tax' => 144.90,
                    'rounding_amount' => 1110.90, //amount after discount include tax
                    'total_include_discount' => 966, //amount after discount without tax
                ],
                [
                    'item_name' => 'ALFA',
                    'price' => 22,
                    'qty' => 44,
                    'discount' => 2,
                    'unit_code' => "PCE",
                    'tax' => 144.90,
                    'rounding_amount' => 1110.90, //amount after discount include tax
                    'total_include_discount' => 966, //amount after discount without tax
                ],

            ],
        ];
        $inv = ["uuid" => "1c654152-22f0-4ace-83f2-9c2120b7c1b8",
            "invoice_type" => "0200000",
            "bill_type" => 388,
            "filename" => "_20221116025535_172",
            "invoice_number" => 172,
            "invoice_counter" => 1,
            "previous_invoice_hash" => "NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==",
            "trans_time" => new \DateTime (),
            "invoice_reference_commands" => null,
            "invoice_reference" => null,
            "client_data" => [
                "name" => "Semi",
                "street_name" => "Al Ajwad Street",
                "additional_street_name" => "Al Samir",
                "building_number" => "3456",
                "plot_identification" => "8837",
                "city" => "MECCA",
                'country_subentity' => 'SA',
                "city_sub_division_name" => "Jeddha",
                "postal_zone" => "93485",
                "party_identification_type" => "TIN",
                "party_identification_id" => "300012345600003",
            ],
            "cart_total" => [
                "total_without_discount" => 65,
                "total_after_discount" => 65,
                "total_with_vat" => 74.75,
                "prepaid_amount" => 0,
                "payable_amount" => 74.75,
                "discount" => 0,
                "tax_amount" => 9.75,
            ],
            "items" => [
                [
                    "item_name" => "ALFA LUXERY 7DBI",
                    "unit_code" => "PCS",
                    "qty" => 1,
                    "tax" => 9.75,
                    "price" => 65,
                    "rounding_amount" => 74.75,
                    "discount" => 0,
                    "total_include_discount" => 65,
                    "tax_percent" => 15,
                ],
            ],
        ];
        return $inv;
    }

    public function gazt_job_requests($page, $size = 10, $sortitem, $sortdir, $type, $status)
    {
        $result = GaztJob::select('gazt_jobs.*', 'sales.sub_total', 'sales.tax', 'sales.total', 'customers.name')
            ->join('sales', 'gazt_jobs.document_id', 'sales.sale_id')
            ->leftJoin('customers', 'sales.customer_id', 'customers.customer_id')
            ->when($sortitem != 'null', function ($query) use ($sortitem, $sortdir) {
                $query->orderBy($sortitem, $sortdir);
            })
            ->where('gazt_jobs.bill_type', $type)
            ->when($status === '3', function ($query) {
                $query->whereIn('gazt_jobs.status', [0, 2]);
            }, function ($query) use ($status) {
                $query->where('gazt_jobs.status', $status);
            })
            ->paginate($size, ['*'], 'page', $page);

        return response()->json([
            'data' => $result,
        ], 200);
    }

    public function gazt_api_request($job_id)
    {
        ZatkaEinvoice::dispatch($job_id);
        return response()->json([
            'message' => "sales.gazt_job_posted",
        ], 200);
    }
}
