<?php

namespace App\Services;

use App\Models\ForumCategory;
use App\Models\ForumDiscussion;
use App\Models\ForumLike;
use App\Models\ForumReply;
use App\Notifications\ForumLikeNotification;
use App\Notifications\ForumReplyNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumService
{
    /**
     * Get forum data for index page.
     */
    public function getIndexData(Request $request): array
    {
        $search = $request->input('search');
        $categoryId = $request->input('category');
        $sort = $request->input('sort', 'recent'); // recent, popular, oldest

        $query = ForumDiscussion::with(['user' => function ($query) {
            $query->select('id', 'name', 'email', 'profile_picture', 'role');
        }, 'category'])
            ->withCount('replies');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('forum_category_id', $categoryId);
        }

        // Apply sorting
        switch ($sort) {
            case 'popular':
                $query->popular();
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'recent':
            default:
                $query->recent();
                break;
        }

        // Pinned discussions always on top
        $pinnedDiscussions = ForumDiscussion::with(['user' => function ($query) {
            $query->select('id', 'name', 'email', 'profile_picture', 'role');
        }, 'category'])
            ->withCount('replies')
            ->pinned()
            ->get();

        $discussions = $query->where('is_pinned', false)
            ->paginate(20)
            ->withQueryString();

        $categories = ForumCategory::where('is_active', true)
            ->orderBy('order')
            ->get();

        return [
            'pinnedDiscussions' => $pinnedDiscussions,
            'discussions' => $discussions,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'sort' => $sort,
            ],
        ];
    }

    /**
     * Get categories for create/edit forms.
     */
    public function getCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return ForumCategory::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    /**
     * Create a new discussion.
     */
    public function createDiscussion(array $validated, $user): ForumDiscussion
    {
        return $user->forumDiscussions()->create($validated);
    }

    /**
     * Get discussion data for show page.
     */
    public function getDiscussionData(string $slug): array
    {
        $discussion = ForumDiscussion::with(['user' => function ($query) {
            $query->select('id', 'name', 'email', 'profile_picture', 'role');
        }, 'category'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Track unique view per user
        $this->trackView($discussion);

        // Get all replies (including nested ones) with user relationship
        $replies = ForumReply::with(['user' => function ($query) {
            $query->select('id', 'name', 'email', 'profile_picture', 'role');
        }])
            ->where('forum_discussion_id', $discussion->id)
            ->orderBy('parent_id', 'asc') // Parent replies first
            ->orderBy('created_at', 'asc')
            ->get();

        // Add user_liked flag to discussion
        $discussion->user_liked = ForumLike::where('user_id', Auth::id())
            ->where('likeable_type', ForumDiscussion::class)
            ->where('likeable_id', $discussion->id)
            ->exists();

        // Add user_liked flag to each reply
        $replies->each(function ($reply) {
            $reply->user_liked = ForumLike::where('user_id', Auth::id())
                ->where('likeable_type', ForumReply::class)
                ->where('likeable_id', $reply->id)
                ->exists();
        });

        $user = Auth::user();

        return [
            'discussion' => $discussion,
            'replies' => $replies,
            'canEdit' => $discussion->user_id === $user->id || $user->isAdmin(),
            'canDelete' => $discussion->user_id === $user->id || $user->isAdmin(),
            'isAdmin' => $user->isAdmin(),
        ];
    }

    /**
     * Track view for a discussion (one view per user).
     */
    private function trackView(ForumDiscussion $discussion): void
    {
        $userId = Auth::id();

        if (!$userId) {
            return;
        }

        // Use firstOrCreate to ensure only one view per user per discussion
        \App\Models\ForumView::firstOrCreate([
            'user_id' => $userId,
            'discussion_id' => $discussion->id,
        ]);

        // Update views_count on discussion
        $discussion->update([
            'views_count' => \App\Models\ForumView::where('discussion_id', $discussion->id)->count()
        ]);
    }

    /**
     * Check if user can edit discussion.
     */
    public function canEditDiscussion(ForumDiscussion $discussion): bool
    {
        $user = Auth::user();
        return $discussion->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Update a discussion.
     */
    public function updateDiscussion(ForumDiscussion $discussion, array $validated): void
    {
        $discussion->update($validated);
    }

    /**
     * Check if user can delete discussion.
     */
    public function canDeleteDiscussion(ForumDiscussion $discussion): bool
    {
        $user = Auth::user();
        return $discussion->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Delete a discussion.
     */
    public function deleteDiscussion(ForumDiscussion $discussion): void
    {
        $discussion->delete();
    }

    /**
     * Check if discussion is locked for replies.
     */
    public function isDiscussionLocked(ForumDiscussion $discussion): bool
    {
        $user = Auth::user();
        return $discussion->is_locked && !$user->isAdmin();
    }

    /**
     * Create a reply to a discussion.
     */
    public function createReply(ForumDiscussion $discussion, array $validated): ForumReply
    {
        $reply = $discussion->replies()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Update discussion
        $discussion->updateRepliesCount();

        // Kirim notifikasi ke user yang berbeda
        $notifiedUsers = collect([Auth::id()]); // Jangan notif diri sendiri

        // 1. Jika ini adalah nested reply (membalas komentar lain)
        if ($validated['parent_id']) {
            $parentReply = ForumReply::find($validated['parent_id']);

            if ($parentReply && !$notifiedUsers->contains($parentReply->user_id)) {
                $parentReply->user->notify(
                    new ForumReplyNotification($reply, $discussion, Auth::user())
                );
                $notifiedUsers->push($parentReply->user_id);
            }
        }

        // 2. Notifikasi ke pemilik diskusi (jika belum dinotif)
        if (!$notifiedUsers->contains($discussion->user_id)) {
            $discussion->user->notify(
                new ForumReplyNotification($reply, $discussion, Auth::user())
            );
        }

        return $reply;
    }

    /**
     * Toggle like on a discussion.
     */
    public function toggleDiscussionLike(ForumDiscussion $discussion): void
    {
        $currentUser = Auth::user();
        $existingLike = ForumLike::where('user_id', $currentUser->id)
            ->where('likeable_type', ForumDiscussion::class)
            ->where('likeable_id', $discussion->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            ForumLike::create([
                'user_id' => $currentUser->id,
                'likeable_type' => ForumDiscussion::class,
                'likeable_id' => $discussion->id,
            ]);

            // Send notification to discussion owner (if not liking own discussion)
            if ($discussion->user_id !== $currentUser->id) {
                $discussion->user->notify(
                    new ForumLikeNotification(
                        $currentUser,
                        ForumDiscussion::class,
                        $discussion->id,
                        "diskusi Anda \"{$discussion->title}\"",
                        "/forum/{$discussion->slug}"
                    )
                );
            }
        }

        $discussion->updateLikesCount();
    }

    /**
     * Toggle like on a reply.
     */
    public function toggleReplyLike(ForumReply $reply): void
    {
        $currentUser = Auth::user();
        $existingLike = ForumLike::where('user_id', $currentUser->id)
            ->where('likeable_type', ForumReply::class)
            ->where('likeable_id', $reply->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            ForumLike::create([
                'user_id' => $currentUser->id,
                'likeable_type' => ForumReply::class,
                'likeable_id' => $reply->id,
            ]);

            // Send notification to reply owner (if not liking own reply)
            if ($reply->user_id !== $currentUser->id) {
                $reply->user->notify(
                    new ForumLikeNotification(
                        $currentUser,
                        ForumReply::class,
                        $reply->id,
                        "balasan Anda",
                        "/forum/{$reply->discussion->slug}"
                    )
                );
            }
        }

        $reply->updateLikesCount();
    }

    /**
     * Check if user is admin.
     */
    public function isUserAdmin(): bool
    {
        $user = Auth::user();
        return $user->isAdmin();
    }

    /**
     * Toggle pin status (admin only).
     */
    public function togglePin(ForumDiscussion $discussion): void
    {
        $discussion->is_pinned = !$discussion->is_pinned;
        $discussion->save();
    }

    /**
     * Toggle lock status (admin only).
     */
    public function toggleLock(ForumDiscussion $discussion): void
    {
        $discussion->is_locked = !$discussion->is_locked;
        $discussion->save();
    }
}
