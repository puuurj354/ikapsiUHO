<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewEventPublishedNotification extends Notification implements ShouldQueue
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
            'type' => 'new_event',
            'title' => 'Event Baru Tersedia',
            'message' => "Event baru \"{$this->event->title}\" telah dibuka! Daftar sekarang sebelum kuota penuh.",
            'action_url' => "/events/{$this->event->id}",
            'icon' => 'calendar-plus',
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'event_date' => $this->event->event_date,
            'registration_deadline' => $this->event->registration_deadline,
        ];
    }
}
