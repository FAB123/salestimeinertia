<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Events\SendNotification;
use App\Models\Configurations\Configuration;
use Illuminate\Support\Facades\Http;


class SendWhatsappWebApi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $message, $phone, $user_id;

    /**
     * Create a new job instance.
     */
    public function __construct($message, $phone, $user_id)
    {
        $this->message = $message;
        $this->phone = $phone;
        $this->user_id = $user_id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $whatsapp_web_endpoint = Configuration::find('whatsapp_web_endpoint')->value;

        $response = Http::asForm()->post($whatsapp_web_endpoint . 'message', [
            'number' => $this->phone,
            'message' => $this->message,
        ]);

        if ($response['status']) {
            event(new SendNotification(
                ['text' => 'WhatsApp Message deliverd', 'type' => 'S'],
                "message-" . $this->user_id
            ));
        } else {
            event(new SendNotification(
                ['text' => 'WhatsApp Message send failed', 'type' => 'E'],
                "message-" . $this->user_id
            ));
        }
    }
}
