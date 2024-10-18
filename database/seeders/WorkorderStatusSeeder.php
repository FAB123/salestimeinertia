<?php

namespace Database\Seeders;

use App\Models\Workorders\WorkorderStatus;
use Illuminate\Database\Seeder;

class WorkorderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WorkorderStatus::insert([
            [
                'status_name_en' => 'Registerd',
                'status_name_ar' => 'مسجل',
                'editable' => 1,
                "whatsapp_message" => ''
            ],
            [
                'status_name_en' => 'Processing',
                'status_name_ar' => 'يعالج',
                'editable' => 1,
                "whatsapp_message" => ''
            ],
            [
                'status_name_en' => 'Completed',
                'status_name_ar' => 'مكتمل',
                'editable' => 1,
                "whatsapp_message" => ''
            ],
            [
                'status_name_en' => 'Delivered',
                'status_name_ar' => 'تم التوصيل',
                'editable' => 1,
                "whatsapp_message" => ''
            ],
        ]);
    }
}
