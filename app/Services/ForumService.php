<?php

namespace App\Services;

use App\Models\ForumCategory;
use App\Models\ForumDiscussion;
use App\Models\ForumLike;
use App\Models\ForumReply;
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

        $query = ForumDiscussion::with(['user', 'category'])
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
        $pinnedDiscussions = ForumDiscussion::with(['user', 'category'])
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
        $discussion = ForumDiscussion::with(['user', 'category'])
            ->withCount('replies', 'likes')
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment views
        $discussion->incrementViews();

        $replies = ForumReply::with(['user'])
            ->where('forum_discussion_id', $discussion->id)
            ->whereNull('parent_id')
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return [
            'discussion' => $discussion,
            'replies' => $replies,
        ];
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

        return $reply;
    }

    /**
     * Toggle like on a discussion.
     */
    public function toggleDiscussionLike(ForumDiscussion $discussion): void
    {
        $existingLike = ForumLike::where('user_id', Auth::id())
            ->where('likeable_type', ForumDiscussion::class)
            ->where('likeable_id', $discussion->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            ForumLike::create([
                'user_id' => Auth::id(),
                'likeable_type' => ForumDiscussion::class,
                'likeable_id' => $discussion->id,
            ]);
        }

        $discussion->updateLikesCount();
    }

    /**
     * Toggle like on a reply.
     */
    public function toggleReplyLike(ForumReply $reply): void
    {
        $existingLike = ForumLike::where('user_id', Auth::id())
            ->where('likeable_type', ForumReply::class)
            ->where('likeable_id', $reply->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            ForumLike::create([
                'user_id' => Auth::id(),
                'likeable_type' => ForumReply::class,
                'likeable_id' => $reply->id,
            ]);
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
