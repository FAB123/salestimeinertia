<?php

use App\Jobs\SendSmsApi;
use App\Jobs\SendWhatsappWebApi;
use App\Models\Configurations\Configuration;
use App\Models\MessagesTemplate;
use App\Models\Workorders\Workorder;
use Carbon\Carbon;

/**
 * Write code on Method
 *
 * @return response()
 */
if (!function_exists('convertYmdToMdy')) {
    function convertYmdToMdy($date)
    {
        return Carbon::createFromFormat('Y-m-d', $date)->format('m-d-Y');
    }
}

/**
 * Write code on Method
 *
 * @return response()
 */
if (!function_exists('convertMdyToYmd')) {
    function convertMdyToYmd($date)
    {
        return Carbon::createFromFormat('m-d-Y', $date)->format('Y-m-d');
    }
}

/**
 * Write code on Method
 *
 * @return response()
 */
if (!function_exists('formatMessage')) {
    function formatMessage(array $replace, $message)
    {
        return str_replace(array_keys($replace), array_values($replace), $message);
    }
}

/**
 * Write code on Method
 *
 * @return response()
 */
if (!function_exists('sendMessage')) {
    function sendMessage($service_id, $type, $otp = null)
    {
        info($type);
        $messaging_method = Configuration::where('key', 'messaging_method')->value('value');
        if ($messaging_method != 'NONE') {
            $company_name = Configuration::where('key', 'company_name')->value('value');
            $status_base_url = Configuration::where('key', 'message_status_url')->value('value');
            $review_url = Configuration::where('key', 'google_review_url')->value('value');

            $item = Workorder::join('customers', 'customers.customer_id', 'workorders.customer_id')
                ->find($service_id);
            $customer_name = $item->name;
            $customer_mobile = $item->mobile;


            if ($messaging_method == "SMSAPI" || $messaging_method == "DEVICESMS") {
                $message_template = MessagesTemplate::find($type)->sms_template_ar;
                $replace = array(
                    '{CU}' => $customer_name,
                    '{CO}' => $company_name,
                    '{URL}' => $status_base_url,
                    '{REVIEWURL}' => $review_url,
                    '{ID}' => $service_id,
                    '{OTP}' => $otp
                );

                $formated_message = formatMessage($replace, $message_template);

                if ($messaging_method == "SMSAPI") {
                    SendSmsApi::dispatch($formated_message, $customer_mobile, auth()->user()->user_id);
                } else if ($messaging_method == "DEVICESMS") {
                }
            } else if ("WHATSAPP") {

                $message_template = MessagesTemplate::find($type)->whatsapp_template_ar;

                $replace = array(
                    '{CU}' => $customer_name,
                    '{CO}' => $company_name,
                    '{URL}' => $status_base_url,
                    '{ID}' => $service_id,
                    '{REVIEWURL}' => $review_url,
                    '{OTP}' => $otp
                );

                $formated_message = formatMessage($replace, $message_template);
                SendWhatsappWebApi::dispatch($formated_message, $customer_mobile, auth()->user()->user_id);
            }
            return true;
        } else {
            return true;
        }
    }
}
