<?php

namespace App\Notifications;

use App\Models\ForumDiscussion;
use App\Models\ForumReply;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ForumReplyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ForumReply $reply,
        public ForumDiscussion $discussion,
        public User $replier
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'forum_reply',
            'title' => 'Balasan Baru di Diskusi',
            'message' => "{$this->replier->name} membalas diskusi \"{$this->discussion->title}\"",
            'action_url' => "/forum/{$this->discussion->slug}",
            'icon' => 'MessageSquare',
            'replier' => [
                'id' => $this->replier->id,
                'name' => $this->replier->name,
                'profile_picture_url' => $this->replier->profile_picture_url,
            ],
            'discussion' => [
                'id' => $this->discussion->id,
                'title' => $this->discussion->title,
                'slug' => $this->discussion->slug,
            ],
            'reply_id' => $this->reply->id,
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'forum_reply',
            'title' => 'Balasan Baru di Diskusi',
            'message' => "{$this->replier->name} membalas diskusi \"{$this->discussion->title}\"",
            'action_url' => "/forum/{$this->discussion->slug}",
            'icon' => 'MessageSquare',
            'replier' => [
                'id' => $this->replier->id,
                'name' => $this->replier->name,
                'profile_picture_url' => $this->replier->profile_picture_url,
            ],
        ]);
    }
}
