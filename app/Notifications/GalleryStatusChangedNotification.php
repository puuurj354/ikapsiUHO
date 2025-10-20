<?php

namespace App\Notifications;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class GalleryStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Gallery $gallery,
        public User $admin,
        public string $status, // 'approved' or 'rejected'
        public ?string $rejectionReason = null
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        $isApproved = $this->status === 'approved';

        $title = $isApproved
            ? 'Galeri Anda Disetujui!'
            : 'Galeri Anda Ditolak';

        $message = $isApproved
            ? "Galeri \"{$this->gallery->title}\" telah disetujui oleh {$this->admin->name} dan sekarang dipublikasikan"
            : "Galeri \"{$this->gallery->title}\" ditolak oleh {$this->admin->name}";

        if (!$isApproved && $this->rejectionReason) {
            $message .= ". Alasan: {$this->rejectionReason}";
        }

        return [
            'type' => 'gallery_status_changed',
            'title' => $title,
            'message' => $message,
            'action_url' => $isApproved ? "/gallery/{$this->gallery->id}" : "/gallery",
            'icon' => $isApproved ? 'sparkles' : 'calendar-x',
            'status' => $this->status,
            'admin' => [
                'id' => $this->admin->id,
                'name' => $this->admin->name,
            ],
            'gallery' => [
                'id' => $this->gallery->id,
                'title' => $this->gallery->title,
                'batch' => $this->gallery->batch,
                'image_url' => $this->gallery->image_url,
            ],
            'rejection_reason' => $this->rejectionReason,
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        $isApproved = $this->status === 'approved';

        $title = $isApproved
            ? 'Galeri Anda Disetujui!'
            : 'Galeri Anda Ditolak';

        $message = $isApproved
            ? "Galeri \"{$this->gallery->title}\" telah disetujui oleh {$this->admin->name} dan sekarang dipublikasikan"
            : "Galeri \"{$this->gallery->title}\" ditolak oleh {$this->admin->name}";

        if (!$isApproved && $this->rejectionReason) {
            $message .= ". Alasan: {$this->rejectionReason}";
        }

        return new BroadcastMessage([
            'type' => 'gallery_status_changed',
            'title' => $title,
            'message' => $message,
            'action_url' => $isApproved ? "/galleries/{$this->gallery->id}" : "/gallery",
            'icon' => $isApproved ? 'CheckCircle' : 'XCircle',
            'status' => $this->status,
            'admin' => [
                'id' => $this->admin->id,
                'name' => $this->admin->name,
            ],
            'gallery' => [
                'id' => $this->gallery->id,
                'title' => $this->gallery->title,
                'batch' => $this->gallery->batch,
                'image_url' => $this->gallery->image_url,
            ],
            'rejection_reason' => $this->rejectionReason,
        ]);
    }
}
