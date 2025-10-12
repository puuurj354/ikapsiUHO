<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class EventReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Event $event
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'event_reminder',
            'title' => 'Pengingat Event',
            'message' => "Event \"{$this->event->title}\" akan dimulai besok! Jangan lupa untuk hadir.",
            'action_url' => "/events/{$this->event->id}",
            'icon' => 'bell-ring',
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'event_date' => $this->event->event_date,
            'location' => $this->event->location,
        ];
    }
}
