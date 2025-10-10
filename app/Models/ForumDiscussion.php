<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ForumDiscussion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'forum_category_id',
        'title',
        'slug',
        'content',
        'is_pinned',
        'is_locked',
        'views_count',
        'replies_count',
        'likes_count',
        'last_activity_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    protected $appends = ['is_liked_by_current_user'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($discussion) {
            if (empty($discussion->slug)) {
                $discussion->slug = Str::slug($discussion->title);

                // Ensure unique slug
                $count = 1;
                while (static::where('slug', $discussion->slug)->exists()) {
                    $discussion->slug = Str::slug($discussion->title) . '-' . $count;
                    $count++;
                }
            }

            $discussion->last_activity_at = now();
        });
    }

    /**
     * Get the user that created the discussion.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of the discussion.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }

    /**
     * Get the replies for the discussion.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(ForumReply::class);
    }

    /**
     * Get the likes for the discussion.
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(ForumLike::class, 'likeable');
    }

    /**
     * Get the reports for the discussion.
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(ForumReport::class, 'reportable');
    }

    /**
     * Check if the discussion is liked by the current user.
     */
    public function getIsLikedByCurrentUserAttribute(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $this->likes()->where('user_id', Auth::id())->exists();
    }

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Update replies count.
     */
    public function updateRepliesCount(): void
    {
        $this->replies_count = $this->replies()->count();
        $this->last_activity_at = now();
        $this->save();
    }

    /**
     * Update likes count.
     */
    public function updateLikesCount(): void
    {
        $this->likes_count = $this->likes()->count();
        $this->save();
    }

    /**
     * Scope for pinned discussions.
     */
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    /**
     * Scope for recent discussions.
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('last_activity_at', 'desc');
    }

    /**
     * Scope for popular discussions.
     */
    public function scopePopular($query)
    {
        return $query->orderBy('likes_count', 'desc');
    }
}
