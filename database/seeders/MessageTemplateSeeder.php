<?php

namespace Database\Seeders;

use App\Models\MessagesTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MessagesTemplate::insert([
            [
                'template_id' => 1,
                'template_name' => 'booking',
                'whatsapp_template_en' => 'Hello {CU}, Your Work Order booked with RECV-{ID} successfully. please use {URL} to track current status. We will keep you updated on the status.',
                'whatsapp_template_ar' => 'مرحبًا {CU}، تم حجز أمر العمل الخاص بك باستخدام RECV-{ID} بنجاح. الرجاء استخدام {URL} لتتبع الحالة الحالية. سنبقيك على اطلاع دائم بالحالة.',
            ],
            [
                'template_id' => 2,
                'template_name' => 'completed',
                'whatsapp_template_en' => 'Hello {CU}, Your work is Completed Successfully with {ID}. thank you for choose {CO}. please collect your item ASAP. thank you for choose {CO}',
                'whatsapp_template_ar' => 'مرحبًا {CU}، تم الانتهاء من عملك بنجاح باستخدام {ID}. شكرًا لك على اختيار {CO}. يرجى جمع البند الخاص بك في اسرع وقت ممكن. شكرا لاختيارك {CO}',
            ],
            [
                'template_id' => 3,
                'template_name' => 'delvery',
                'whatsapp_template_en' => 'Hello {CU}, Your work successfully delivered with {ID}. thank you for choose {CO}',
                'whatsapp_template_ar' => 'مرحبًا {CU}، تم تسليم عملك بنجاح باستخدام {ID}. شكرا لاختيارك {CO}',
            ],
            [
                'template_id' => 4,
                'template_name' => 'review',
                'whatsapp_template_en' => 'Hello {CU}, Please make your valuable feedback with {REVIEWURL} . thank you for choose {CO}',
                'whatsapp_template_ar' => 'مرحبًا {CU}، يرجى تقديم تعليقاتك القيمة باستخدام {REVIEWURL}. شكرا لاختيارك {CO}',
            ],
        ]);
    }
}
