<?php

namespace App\Notifications;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class GallerySubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Gallery $gallery,
        public User $uploader
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'gallery_submitted',
            'title' => 'Galeri Baru Menunggu Persetujuan',
            'message' => "{$this->uploader->name} mengajukan galeri \"{$this->gallery->title}\" untuk dipublikasikan",
            'action_url' => "/admin/gallery/{$this->gallery->id}",
            'icon' => 'bell-ring',
            'uploader' => [
                'id' => $this->uploader->id,
                'name' => $this->uploader->name,
                'profile_picture_url' => $this->uploader->profile_picture_url,
                'angkatan' => $this->uploader->angkatan,
            ],
            'gallery' => [
                'id' => $this->gallery->id,
                'title' => $this->gallery->title,
                'batch' => $this->gallery->batch,
                'image_url' => $this->gallery->image_url,
            ],
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'gallery_submitted',
            'title' => 'Galeri Baru Menunggu Persetujuan',
            'message' => "{$this->uploader->name} mengajukan galeri \"{$this->gallery->title}\" untuk dipublikasikan",
            'action_url' => "/admin/gallery/{$this->gallery->id}",
            'icon' => 'bell-ring',
            'uploader' => [
                'id' => $this->uploader->id,
                'name' => $this->uploader->name,
                'profile_picture_url' => $this->uploader->profile_picture_url,
                'angkatan' => $this->uploader->angkatan,
            ],
            'gallery' => [
                'id' => $this->gallery->id,
                'title' => $this->gallery->title,
                'batch' => $this->gallery->batch,
                'image_url' => $this->gallery->image_url,
            ],
        ]);
    }
}
