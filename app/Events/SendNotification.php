<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendNotification
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $chanel;
    /**
     * Create a new event instance.
     */
    public function __construct($message, $chanel)
    {
        $this->chanel = $chanel;
        $this->message = $message;
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    
    public function broadcastOn()
    {
        return [
            new Channel('AppNotification'),
        ];
    }

    public function broadcastAs()
    {
        return $this->chanel;
    }
}
