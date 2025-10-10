<?php

namespace App\Http\Controllers;

use App\Models\ForumCategory;
use App\Models\ForumDiscussion;
use App\Models\ForumLike;
use App\Models\ForumReply;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ForumController extends Controller
{
    /**
     * Display a listing of forum discussions.
     */
    public function index(Request $request): Response
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

        return Inertia::render('forum/index', [
            'pinnedDiscussions' => $pinnedDiscussions,
            'discussions' => $discussions,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new discussion.
     */
    public function create(): Response
    {
        $categories = ForumCategory::where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('forum/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created discussion.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'forum_category_id' => 'required|exists:forum_categories,id',
        ]);

        $discussion = $request->user()->forumDiscussions()->create($validated);

        return redirect()->route('forum.show', $discussion->slug)
            ->with('success', 'Diskusi berhasil dibuat!');
    }

    /**
     * Display the specified discussion.
     */
    public function show(string $slug): Response
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

        return Inertia::render('forum/show', [
            'discussion' => $discussion,
            'replies' => $replies,
        ]);
    }

    /**
     * Show the form for editing the specified discussion.
     */
    public function edit(string $slug): Response
    {
        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();

        // Authorize
        if ($discussion->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $categories = ForumCategory::where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('forum/edit', [
            'discussion' => $discussion,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified discussion.
     */
    public function update(Request $request, string $slug): RedirectResponse
    {
        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();

        // Authorize
        if ($discussion->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'forum_category_id' => 'required|exists:forum_categories,id',
        ]);

        $discussion->update($validated);

        return redirect()->route('forum.show', $discussion->slug)
            ->with('success', 'Diskusi berhasil diperbarui!');
    }

    /**
     * Remove the specified discussion.
     */
    public function destroy(string $slug): RedirectResponse
    {
        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();

        // Authorize
        if ($discussion->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $discussion->delete();

        return redirect()->route('forum.index')
            ->with('success', 'Diskusi berhasil dihapus!');
    }

    /**
     * Store a reply to a discussion.
     */
    public function storeReply(Request $request, string $slug): RedirectResponse
    {
        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();

        if ($discussion->is_locked && !Auth::user()->isAdmin()) {
            return back()->withErrors(['error' => 'Diskusi ini telah dikunci.']);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:forum_replies,id',
        ]);

        $reply = $discussion->replies()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Update discussion
        $discussion->updateRepliesCount();

        return back()->with('success', 'Balasan berhasil ditambahkan!');
    }

    /**
     * Toggle like on a discussion.
     */
    public function toggleLike(string $slug): RedirectResponse
    {
        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();

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

        return back();
    }

    /**
     * Toggle like on a reply.
     */
    public function toggleReplyLike(ForumReply $reply): RedirectResponse
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

        return back();
    }

    /**
     * Toggle pin status (admin only).
     */
    public function togglePin(string $slug): RedirectResponse
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();
        $discussion->is_pinned = !$discussion->is_pinned;
        $discussion->save();

        return back()->with('success', $discussion->is_pinned ? 'Diskusi berhasil di-pin!' : 'Diskusi berhasil di-unpin!');
    }

    /**
     * Toggle lock status (admin only).
     */
    public function toggleLock(string $slug): RedirectResponse
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $discussion = ForumDiscussion::where('slug', $slug)->firstOrFail();
        $discussion->is_locked = !$discussion->is_locked;
        $discussion->save();

        return back()->with('success', $discussion->is_locked ? 'Diskusi berhasil dikunci!' : 'Diskusi berhasil dibuka!');
    }
}
