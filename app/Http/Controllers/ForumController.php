<?php

namespace App\Http\Controllers;

use App\Services\ForumService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ForumController extends Controller
{
    protected ForumService $forumService;

    public function __construct(ForumService $forumService)
    {
        $this->forumService = $forumService;
    }
    /**
     * Display a listing of forum discussions.
     */
    public function index(Request $request): Response
    {
        $data = $this->forumService->getIndexData($request);

        return Inertia::render('forum/index', $data);
    }

    /**
     * Show the form for creating a new discussion.
     */
    public function create(): Response
    {
        $categories = $this->forumService->getCategories();

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

        $discussion = $this->forumService->createDiscussion($validated, $request->user());

        return redirect()->route('forum.show', $discussion->slug)
            ->with('success', 'Diskusi berhasil dibuat!');
    }

    /**
     * Display the specified discussion.
     */
    public function show(string $slug): Response
    {
        $data = $this->forumService->getDiscussionData($slug);

        return Inertia::render('forum/show', $data);
    }

    /**
     * Show the form for editing the specified discussion.
     */
    public function edit(string $slug): Response
    {
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        if (!$this->forumService->canEditDiscussion($discussion)) {
            abort(403);
        }

        $categories = $this->forumService->getCategories();

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
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        if (!$this->forumService->canEditDiscussion($discussion)) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'forum_category_id' => 'required|exists:forum_categories,id',
        ]);

        $this->forumService->updateDiscussion($discussion, $validated);

        return redirect()->route('forum.show', $discussion->slug)
            ->with('success', 'Diskusi berhasil diperbarui!');
    }

    /**
     * Remove the specified discussion.
     */
    public function destroy(string $slug): RedirectResponse
    {
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        if (!$this->forumService->canDeleteDiscussion($discussion)) {
            abort(403);
        }

        $this->forumService->deleteDiscussion($discussion);

        return redirect()->route('forum.index')
            ->with('success', 'Diskusi berhasil dihapus!');
    }

    /**
     * Store a reply to a discussion.
     */
    public function storeReply(Request $request, string $slug): RedirectResponse
    {
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        if ($this->forumService->isDiscussionLocked($discussion)) {
            return back()->withErrors(['error' => 'Diskusi ini telah dikunci.']);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:forum_replies,id',
        ]);

        $this->forumService->createReply($discussion, $validated);

        return back()->with('success', 'Balasan berhasil ditambahkan!');
    }

    /**
     * Toggle like on a discussion.
     */
    public function toggleLike(string $slug): RedirectResponse
    {
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        $this->forumService->toggleDiscussionLike($discussion);

        return back();
    }

    /**
     * Toggle like on a reply.
     */
    public function toggleReplyLike(\App\Models\ForumReply $reply): RedirectResponse
    {
        $this->forumService->toggleReplyLike($reply);

        return back();
    }

    /**
     * Toggle pin status (admin only).
     */
    public function togglePin(string $slug): RedirectResponse
    {
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        $this->forumService->togglePin($discussion);

        return back()->with('success', $discussion->is_pinned ? 'Diskusi berhasil di-pin!' : 'Diskusi berhasil di-unpin!');
    }

    /**
     * Toggle lock status (admin only).
     */
    public function toggleLock(string $slug): RedirectResponse
    {
        $discussion = \App\Models\ForumDiscussion::where('slug', $slug)->firstOrFail();

        $this->forumService->toggleLock($discussion);

        return back()->with('success', $discussion->is_locked ? 'Diskusi berhasil dikunci!' : 'Diskusi berhasil dibuka!');
    }
}
