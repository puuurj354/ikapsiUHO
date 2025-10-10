<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class ForumReply extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'forum_discussion_id',
        'user_id',
        'parent_id',
        'content',
        'likes_count',
    ];

    protected $appends = ['is_liked_by_current_user'];

    /**
     * Get the discussion that owns the reply.
     */
    public function discussion(): BelongsTo
    {
        return $this->belongsTo(ForumDiscussion::class, 'forum_discussion_id');
    }

    /**
     * Get the user that created the reply.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent reply.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ForumReply::class, 'parent_id');
    }

    /**
     * Get the likes for the reply.
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(ForumLike::class, 'likeable');
    }

    /**
     * Check if the reply is liked by the current user.
     */
    public function getIsLikedByCurrentUserAttribute(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $this->likes()->where('user_id', Auth::id())->exists();
    }

    /**
     * Update likes count.
     */
    public function updateLikesCount(): void
    {
        $this->likes_count = $this->likes()->count();
        $this->save();
    }
}
