<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'welcome',
            'title' => 'Selamat Datang di IKAPSI UHO! 🎉',
            'message' => 'Terima kasih telah bergabung dengan komunitas alumni Psikologi UHO. Jelajahi forum dan event yang tersedia!',
            'action_url' => '/dashboard',
            'icon' => 'Sparkles',
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'welcome',
            'title' => 'Selamat Datang di IKAPSI UHO! 🎉',
            'message' => 'Terima kasih telah bergabung dengan komunitas alumni Psikologi UHO.',
            'action_url' => '/dashboard',
            'icon' => 'Sparkles',
        ]);
    }
}
