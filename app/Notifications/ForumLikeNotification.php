<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ForumLikeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $liker,
        public string $likableType,
        public int $likableId,
        public string $title,
        public string $url
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'forum_like',
            'title' => 'Menyukai Postingan Anda',
            'message' => "{$this->liker->name} menyukai {$this->title}",
            'action_url' => $this->url,
            'icon' => 'Heart',
            'liker' => [
                'id' => $this->liker->id,
                'name' => $this->liker->name,
                'profile_picture_url' => $this->liker->profile_picture_url,
            ],
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'forum_like',
            'title' => 'Menyukai Postingan Anda',
            'message' => "{$this->liker->name} menyukai {$this->title}",
            'action_url' => $this->url,
            'icon' => 'Heart',
            'liker' => [
                'id' => $this->liker->id,
                'name' => $this->liker->name,
                'profile_picture_url' => $this->liker->profile_picture_url,
            ],
        ]);
    }
}
