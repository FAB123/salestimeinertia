<?php

namespace Database\Seeders;

use App\Models\Configurations\InvoiceTemplate;
use Illuminate\Database\Seeder;

class InvoiceTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $gazt = json_encode([
            ['item' => 'item_start', 'value' => '93', 'default' => '93', 'type' => 'text'],
            ['item' => 'item_end', 'value' => '50', 'default' => '50', 'type' => 'text'],
            ['item' => 'item_font_size', 'value' => '8', 'default' => '8', 'type' => 'text'],
            ['item' => 'watermark_x', 'value' => '50', 'default' => '50', 'type' => 'text'],
            ['item' => 'watermark_y', 'value' => '200', 'default' => '200', 'type' => 'text'],
            ['item' => 'watermark_size', 'value' => '35', 'default' => '35', 'type' => 'text'],
            ['item' => 'watermark_angle', 'value' => '40', 'default' => '40', 'type' => 'text'],
            ['item' => 'watermark', 'value' => '1', 'type' => 'option'],
            ['item' => 'head_color', 'value' => '#ff0000', 'default' => '#ff0000', 'type' => 'color'],
            ['item' => 'address_color', 'value' => '#0000ff', 'default' => '#0000ff', 'type' => 'color'],
            //return policy position
            ['item' => 'rpposition_en', 'value' => '270', 'default' => '270', 'type' => 'text'],
            ['item' => 'rpposition_ar', 'value' => '270', 'default' => '270', 'type' => 'text'],
            ['item' => 'rp_font_size', 'value' => '9', 'default' => '9', 'type' => 'text'],

            ['item' => 'tamount_color', 'value' => '#ff0000', 'default' => '#ff0000', 'type' => 'color'],
            ['item' => 'tamount_desc_color', 'value' => '#e6005c', 'default' => '#e6005c', 'type' => 'color'],

            //company logo position
            ['item' => 'clogo_x', 'value' => '97', 'default' => '97', 'type' => 'text'],
            ['item' => 'clogo_y', 'value' => '31', 'default' => '31', 'type' => 'text'],
            ['item' => 'clogo_size', 'value' => '30', 'default' => '30', 'type' => 'text'],
            ['item' => 'clogo', 'value' => '0', 'type' => 'option'],
        ]);

        $standard = json_encode([
            ['item' => 'item_start', 'value' => '63', 'default' => '93', 'type' => 'text'],
            ['item' => 'item_end', 'value' => '50', 'default' => '50', 'type' => 'text'],
            ['item' => 'item_font_size', 'value' => '8', 'default' => '8', 'type' => 'text'],
            ['item' => 'watermark_x', 'value' => '50', 'default' => '50', 'type' => 'text'],
            ['item' => 'watermark_y', 'value' => '200', 'default' => '200', 'type' => 'text'],
            ['item' => 'watermark_size', 'value' => '35', 'default' => '35', 'type' => 'text'],
            ['item' => 'watermark_angle', 'value' => '40', 'default' => '40', 'type' => 'text'],
            ['item' => 'watermark', 'value' => '1', 'type' => 'option'],
            ['item' => 'head_color', 'value' => '#ff0000', 'default' => '#ff0000', 'type' => 'color'],
            ['item' => 'address_color', 'value' => '#0000ff', 'default' => '#0000ff', 'type' => 'color'],
            //return policy position
            ['item' => 'rpposition_en', 'value' => '270', 'default' => '270', 'type' => 'text'],
            ['item' => 'rpposition_ar', 'value' => '270', 'default' => '270', 'type' => 'text'],
            ['item' => 'rp_font_size', 'value' => '9', 'default' => '9', 'type' => 'text'],

            ['item' => 'tamount_color', 'value' => '#ff0000', 'default' => '#ff0000', 'type' => 'color'],
            ['item' => 'tamount_desc_color', 'value' => '#e6005c', 'default' => '#e6005c', 'type' => 'color'],

            //company logo position
            ['item' => 'clogo_x', 'value' => '97', 'default' => '97', 'type' => 'text'],
            ['item' => 'clogo_y', 'value' => '31', 'default' => '31', 'type' => 'text'],
            ['item' => 'clogo_size', 'value' => '30', 'default' => '30', 'type' => 'text'],
            ['item' => 'clogo', 'value' => '0', 'type' => 'option'],
        ]);

        $thermal = json_encode([
            ['item' => 'item_font_size', 'value' => '11', 'default' => '11', 'type' => 'text'],
            ['item' => 'head_font_size', 'value' => '16', 'default' => '16', 'type' => 'text'],
            ['item' => 'address_font_size', 'value' => '10', 'default' => '10', 'type' => 'text'],
            //company logo position
            ['item' => 'clogo_size', 'value' => '100', 'default' => '100', 'type' => 'text'],
            ['item' => 'clogo', 'value' => '0', 'type' => 'option'],
        ]);
        InvoiceTemplate::insert([
            [
                'template_name' => 'STANDARD',
                'options' => $standard,
            ],
            [
                'template_name' => 'GAZT',
                'options' => $gazt,
            ],
            [
                'template_name' => 'THERMAL',
                'options' => $thermal,
            ],
        ]);
    }

}
