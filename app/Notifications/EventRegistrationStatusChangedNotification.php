<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class EventRegistrationStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Event $event,
        public string $newStatus
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
        $statusMessages = [
            'cancelled' => "Pendaftaran Anda untuk event \"{$this->event->title}\" telah dibatalkan",
            'attended' => "Terima kasih telah menghadiri event \"{$this->event->title}\"",
            'registered' => "Pendaftaran Anda untuk event \"{$this->event->title}\" telah dikonfirmasi",
        ];

        $statusIcons = [
            'cancelled' => 'calendar-x',
            'attended' => 'calendar-check-2',
            'registered' => 'calendar-check',
        ];

        return [
            'type' => 'event_status_changed',
            'title' => 'Status Pendaftaran Event Diperbarui',
            'message' => $statusMessages[$this->newStatus] ?? "Status pendaftaran event diperbarui",
            'action_url' => "/events/{$this->event->id}",
            'icon' => $statusIcons[$this->newStatus] ?? 'calendar',
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'status' => $this->newStatus,
        ];
    }
}
