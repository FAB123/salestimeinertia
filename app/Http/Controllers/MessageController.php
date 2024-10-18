<?php

namespace App\Http\Controllers;

use App\Jobs\SendPlainEmail;
use App\Jobs\SendWhatsappWebApi;
use App\Models\Configurations\Configuration;
use App\Models\MessagesTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        return Inertia::render('Screens/messages/SendMsg');
    }


    public function getmessagingtemplate($template)
    {
        try {
            $templates = MessagesTemplate::where('template_name', $template)->first();

            return response()->json([
                'status' => true,
                'templates' => $templates,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'message.unknown_error',
            ], 200);
        }
    }

    public function savemessagingtemplate(Request $request)
    {
        try {
            MessagesTemplate::updateOrCreate(
                [
                    'template_id' => $request->input('template_id'),
                ],
                [
                    // 'sms_template_en' => $request->input('sms_template_en'),
                    // 'sms_template_ar' => $request->input('sms_template_ar'),
                    // 'email_template_en' => $request->input('email_template_en'),
                    // 'email_template_ar' => $request->input('email_template_ar'),
                    'whatsapp_template_en' => $request->input('whatsapp_template_en'),
                    'whatsapp_template_ar' => $request->input('whatsapp_template_ar'),
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'configuration.configuration_saved',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 200);
        }
    }

    public function send_text_email(Request $request)
    {
        $message = [
            'to' => $request->input('email'),
            'subject' => $request->input('subject'),
            'message' => $request->input('message'),
            'company' => Configuration::where('key', 'company_name')->value('value'),
        ];

        if (SendPlainEmail::dispatch($message)) {
            return response()->json([
                'status' => true,
                'message' => 'message.email_submitted',
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'message.email_failed',

            ], 200);
        }
    }

    public function send_text_message(Request $request)
    {
        $message = $request->input('message');
        $phone =  $request->input('phone');
        $user_id = decrypt(auth()->user()->encrypted_employee);

        if (SendWhatsappWebApi::dispatch($message, $phone, $user_id)) {
            return response()->json([
                'status' => true,
            ], 200);
        } else {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }
}
