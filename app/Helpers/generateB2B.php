<?php
namespace App\helpers;

use App\Models\Configurations\Configuration;

class generateB2B
{
    private $items;
    public function __construct()
    {
        $items = '';
        for ($x = 0; $x <= 30; $x++) {
            $items .= '<tr>
                            <td align="left">ALFA LUXERY 7DBI <br/> dbiألفا رفاه 7</td>
                            <td align="center">3</td>
                            <td align="center">PCS قطعة </td>
                            <td align="center">65</td>
                            <td align="center">56.52</td>
                            <td align="center">0</td>
                            <td align="center">8.48[15%]</td>
                            <td align="center">65</td>
                            <td align="center">65</td>
                        </tr>';
        }

        $this->items = $items;
    }

    public function generate()
    {
        $company_details = Configuration::all()->pluck('value', 'key');
        $html = $this->generate_html($company_details);

        $mpdf = new \Mpdf\Mpdf([
            'margin_left' => 5,
            'margin_right' => 5,
            'margin_header' => 5,
            'margin_footer' => 5,
            'margin_top' => 77,
            'margin_bottom' => 80,
        ]);

        $mpdf->SetAssociatedFiles([[
            'name' => 'signed_xml.xml',
            'mime' => 'text/xml',
            'description' => 'some description',
            'AFRelationship' => 'Alternative',
            'path' => __DIR__ . '/../../storage/app/Einvoices/300056456700003_20221118183034_3.xml',
        ]]);

        $rdf = '<rdf:Description rdf:about="" xmlns:zf="urn:ferd:pdfa:CrossIndustryDocument:invoice:1p0#">' . "\n";
        $rdf .= '  <zf:DocumentType>INVOICE</zf:DocumentType>' . "\n";
        $rdf .= '  <zf:DocumentFileName>ZUGFeRD-invoice.xml</zf:DocumentFileName>' . "\n";
        $rdf .= '  <zf:Version>1.0</zf:Version>' . "\n";
        $rdf .= '  <zf:ConformanceLevel>BASIC</zf:ConformanceLevel>' . "\n";
        $rdf .= '</rdf:Description>' . "\n";

        $mpdf->SetAdditionalXmpRdf($rdf);

        $mpdf->autoScriptToLang = true;
        $mpdf->autoLangToFont = true;

        // $mpdf->SetProtection(array('print'));

        $mpdf->SetTitle($company_details['company_name']);
        $mpdf->SetAuthor($company_details['company_name']);
        $mpdf->SetWatermarkText($company_details['company_name']);
        $mpdf->showWatermarkText = true;
        $mpdf->watermark_font = 'DejaVuSansCondensed';
        $mpdf->watermarkTextAlpha = 0.1;

        $mpdf->SetDisplayMode('fullpage');

        $mpdf->WriteHTML($html);

        $mpdf->Output();
        // return $mpdf->Output('filename.pdf', 'S');

    }

    private function generate_html($company_details)
    {
        $html_head = $this->generate_html_head();
        $generate_html_page_header = $this->generate_html_page_header();
        $generate_html_page_footer = $this->generate_html_page_footer($company_details);
        $generate_html_cart_items = $this->generate_html_cart_items($company_details);
        return '<html>
                    ' . $html_head . '
                    <body>
                        <htmlpageheader name="myheader">
                        ' . $generate_html_page_header . '
                        </htmlpageheader>
                        <htmlpagefooter name="myfooter">
                        ' . $generate_html_page_footer . '
                        </htmlpagefooter>
                        <sethtmlpageheader name="myheader" value="on" show-this-page="1" />
                        <sethtmlpagefooter name="myfooter" value="on" />
                        ' . $generate_html_cart_items . '
                    </body>
                </html>';
    }

    private function generate_html_head()
    {
        return '<head>
                    <style>
                        body {font-family: sans-serif;
                            font-size: 10pt;
                        }
                        p {	margin: 0pt; }

                        td { vertical-align: top; }

                        .invoice_common_container {
                            width:96%;
                            margin-left:2%;
                            margin-right:2%;
                            font-family: serif;
                        }

                        .invoice_container {
                            width:100%;
                            margin-left:2%;
                            margin-right:2%;
                            font-family: serif;
                            border: 0.1mm solid #000;
                            border-collapse: collapse;
                        }

                        .invoice_container td {
                            border-bottom: 0.1mm solid #000000;
                            border-left: 0.1mm solid #000000;
                        }

                        .item_content {
                            border: 0.5mm solid #000000;
                            height:100%;
                            width:96%;
                            margin-left:2%;
                            margin-right:2%;

                        }

                        .side_text {
                            font-style: italic;
                            position: fixed;
                            rotate: -90;
                            text-align: center;
                            width: 100%;
                            bottom: 0;
                            font-size: 6pt;
                            color:  #4D4DFF;
                        }

                        .total_items {
                            border: 0.1mm solid #000000;
                        }

                        .items td {
                            border-left: 0.1mm solid #000000;
                            border-bottom: 0.1mm solid #000000;
                            font-size: 8pt;
                            padding: 1mm;
                        }

                        table thead td {
                            background-color: #2980B9;
                            color: #FFF;
                            text-align: center;
                            font-family: "monospace", "Lucida Console", "Courier New";
                            font-weight: bold;
                            font-size: 8pt;
                            padding: 1mm;
                        }

                        .total_items td.totals {
                            text-align: left;
                            color: #E6005C;
                            font-weight: bold;
                            border: 0.1mm solid #000000;
                        }

                        .total_items td.totals_ar {
                            text-align: right;
                        }

                        .party_container{
                            border: 0.1mm solid #000000;
                            margin-top:1mm;
                            width:96%;
                            margin-left:2%;
                        }

                        .party_details {
                            margin: 1mm;
                            width: 100%;
                            font-family: serif;
                            border: 0.1mm solid #000;
                            margin-top:0.5mm;
                            border-collapse: collapse;
                            font-size: 8pt;
                        }

                        .party_details td {
                            border-right: 1pt solid black;
                            border-bottom: 1pt solid black;
                        }

                        .return_policy {
                            font-size: 8pt;
                            padding: 1mm;
                            border-radius: 5px;
                            font-style: italic;
                            line-height: 1;
                            margin-top: 1mm;
                            border: 1px solid #000000;
                        }

                    </style>
                </head>';
    }

    private function generate_html_page_header()
    {
        return '<div class="invoice_common_container" style="text-align: center; ">
                    <h4 style="border: 0.1mm solid #000; padding: 0.3mm;">TAX INVOICE  &nbsp;  فاتورة ضريبية </h4>
                </div>
                <div>
                    <table class="invoice_container" >
                        <tr>
                            <td width="30%">INVOICE NUMBER:</td>
                            <td width="40%" style="text-align: center; "><span style="font-weight: bold; font-size: 9pt;">COMP-INV-0012345</span></td>
                            <td width="30%" dir="rtl">رقم الفاتورة:</td>
                        </tr>
                        <tr>
                            <td width="30%">INVOICE ISSUE DATE:</td>
                            <td width="40%" style="text-align: center; "><span style="font-weight: bold; font-size: 9pt;">19/11/2022</span></td>
                            <td width="30%" dir="rtl">تاريخ اصدار الفاتورة:</td>
                        </tr>
                        <tr>
                            <td width="30%">DATE OF SUPPLUY:</td>
                            <td width="40%" style="text-align: center; "><span style="font-weight: bold; font-size: 9pt;">19/11/2022</span></td>
                            <td width="30%" dir="rtl">تاريخ التوريد:</td>
                        </tr>
                    </table>
                </div>

                <div class="party_container">
                    <div style="float: left; width: 50%">
                        <div style="width: 100%; ">
                            <div style="width:50%; float: left;"><span style="font-size: 7pt; color: #555555; font-family: sans;">SELLER:</span></div>
                            <div style="width:50%; float: right;" dir="rtl"><span style="font-size: 7pt; color: #555555; font-family: sans;">المورد:</span></div>
                        </div>
                        <div>
                            <table class="party_details">
                                <tr>
                                    <td width="33%">NAME:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">اسم:</td>
                                </tr>
                                <tr>
                                    <td width="33%">BUILDING NUMBER:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">رقم المبنى:</td>
                                </tr>
                                <tr>
                                    <td width="33%">STREET NAME:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">اسم الشارع:</td>
                                </tr>
                                <tr>
                                    <td width="33%">DISTRICT:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">حي:</td>
                                </tr>
                                <tr>
                                    <td width="33%">CITY:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">مدينة:</td>
                                </tr>
                                <tr>
                                    <td width="33%">COUNTRY:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">بلد:</td>
                                </tr>
                                <tr>
                                    <td width="33%">POSTAL CODE:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">رمز بريدي:</td>
                                </tr>
                                <tr>
                                    <td width="33%">VAT NUMBER:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">الرقم الضريبي:</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div style="float: left; width: 50%">
                        <div style="width: 100%; margin-left: 5mm; margin-right: 5mm;">
                            <div style="width:50%; float: left; "><span style="font-size: 7pt; color: #555555; font-family: sans;">BUYER:</span></div>
                            <div style="width:50%; float: right;" dir="rtl"><span style="font-size: 7pt; color: #555555; font-family: sans;">مشتر:</span></div>
                        </div>
                        <div>
                            <table class="party_details">
                                <tr>
                                    <td width="33%">NAME:</td>
                                    <td width="50%">NESMATH INTERNATIONAL TRADING Est.</td>
                                    <td width="20%"  dir="rtl">اسم:</td>
                                </tr>
                                <tr>
                                    <td width="33%">BUILDING NUMBER:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">رقم المبنى:</td>
                                </tr>
                                <tr>
                                    <td width="33%">STREET NAME:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">اسم الشارع:</td>
                                </tr>
                                <tr>
                                    <td width="33%">DISTRICT:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">حي:</td>
                                </tr>
                                <tr>
                                    <td width="33%">CITY:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">مدينة:</td>
                                </tr>
                                <tr>
                                    <td width="33%">COUNTRY:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">بلد:</td>
                                </tr>
                                <tr>
                                    <td width="33%">POSTAL CODE:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">رمز بريدي:</td>
                                </tr>
                                <tr>
                                    <td width="33%">VAT NUMBER:</td>
                                    <td width="50%">1</td>
                                    <td width="20%"  dir="rtl">الرقم الضريبي:</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>';
    }

    private function generate_html_page_footer($company_details)
    {
        return '<div class="invoice_common_container">
                    <table class="total_items" width="100%" style="font-size: 9pt; border-collapse: collapse; " cellpadding="8">
                        <tr>
                            <td class="blanktotal"  width="60%" rowspan="5"></td>
                            <td class="totals" width="15%">SUBTOTAL</td>
                            <td class="totals totals_ar" dir="rtl" width="15%">المجموع الفرعي</td>
                            <td class="totals totals_ar" width="20%">1825.60 SAR</td>
                        </tr>
                        <tr>
                            <td class="totals">VAT</td>
                            <td class="totals totals_ar" dir="rtl">ضريبة</td>
                            <td class="totals totals_ar">18.25 SAR</td>
                        </tr>
                        <tr>
                            <td class="totals"><b>TOTAL</b></td>
                            <td class="totals totals_ar" dir="rtl"><b>المجموع</b></td>
                            <td class="totals totals_ar"><b> 42.56 SAR</b></td>
                        </tr>
                        <tr>
                            <td class="totals">DISCOUNT</td>
                            <td class="totals totals_ar" dir="rtl">حسم</td>
                            <td class="totals totals_ar">1882.56 SAR</td>
                        </tr>

                        <tr>
                            <td class="totals"><b>NET AMOUNT</b></td>
                            <td class="totals totals_ar" dir="rtl"><b>المبلغ الإجمالي</b></td>
                            <td class="totals totals_ar"><b> 42.56 SAR</b></td>
                        </tr>
                    </table>
                </div>

                <div class="invoice_common_container">
                    <table width="100%" class="return_policy">
                        <tr>
                            <td width="40%"><span>' . $company_details['return_policy'] . '</span></td>
                            <td width="40%" dir="rtl"><span>' . $company_details['return_policy_ar'] . '</span></td>
                            <td width="20%"  style="text-align: right;">
                                <barcode code="AQxDb21wYW55IE5hbWUCDzMwMDA1NjQ1NjcwMDAwMwMUMjAyMi0xMS0xOFQxODozMDozNFoEAjY1BQQ4LjQ4BixOZWc2R3NjR2FOWEpCT0l0NVhMSldEekw5NmpIcG5HSzdseXkvNng4dTFVPQdgTUVRQ0lGc0J6SzVqWWFDK1Fld09rSDNicUo3M05IWVhSVFgwNHoxZmJVY0ZqaVp0QWlCcnFtQ000MGIrWVRqKzVYb3R2cWR1bFFGMjB3UjdaUjRBSThSQnNzVjlXQT09CFgwVjAQBgcqhkjOPQIBBgUrgQQACgNCAAQP/BvaWEG8EgLwKedm+i6jo7NHKbKZT01ZGEjJoyEZEQEIRkHgQBWsG5XbFeLFjioFh/1116vORb0PB2jciUeCCUgwRgIhAMjYcnEN2zZSxXTj5amE+kVUE1oJytRodDR3XEmOD3wtAiEAkgLYV77+7XrVC+vVo6fAcZyyzMHq8WYQZ3sKP4BdxCQ=" type="QR" class="barcode" error="Q" disableborder="1" />
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="font-size: 9pt; text-align: center;">
                    Page {PAGENO} of {nb}
                </div>';
    }

    private function generate_html_cart_items($company_details)
    {
        return '<div class="side_text" style="left:0;"><span>' . $company_details['company_name'] . '</span></div>
                <div class="side_text" style="right:0;"><span>' . $company_details['company_name'] . '</span></div>

                <div class="item_content">
                    <table class="items" width="100%" style="font-size: 9pt; border-collapse: collapse; " cellpadding="8">
                        <thead>
                            <tr>
                                <td width="50%">Nature Of Goods or Services: <br/><span>تفاصيل السلع أو الخدمات</span></td>
                                <td width="10%">Price <br/><span>سعر الوحدة</span></td>
                                <td width="10%">Qty.<br/><span>الكمية</span></td>
                                <td width="10%">UOM </td>
                                <td width="15%">Taxable Amount<br/><span> المبلغ الخاضع للضريبة</span></td>
                                <td width="8%">DISC <br/><span>خصم</span></td>
                                <td width="10%">Tax<br/><span>  الضريبة</span></td>
                                <td width="10%">VAT <br/><span>ضريبة</span></td>
                                <td width="10%">TOTAL <br/><span>المجموع</span></td>
                            </tr>
                        </thead>
                        <tbody>' . $this->items . '</tbody>
                    </table>
                </div>';
    }
}
