<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleStoreRequest;
use App\Http\Requests\ArticleUpdateRequest;
use App\Models\Article;
use App\Services\ArticleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    protected ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Display user's articles
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');
        $articles = $this->articleService->getUserArticles($request->user(), $status, $search);

        return Inertia::render('articles/my-articles', [
            'articles' => $articles,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show create form
     */
    public function create(): Response
    {
        $categories = $this->articleService->getCategories();

        return Inertia::render('articles/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store new article
     */
    public function store(ArticleStoreRequest $request): RedirectResponse
    {
        $article = $this->articleService->createArticle(
            $request->validated(),
            $request->user()
        );

        return redirect()->route('articles.my-articles')
            ->with('success', 'Artikel berhasil dibuat!');
    }

    /**
     * Show edit form
     */
    public function edit(Article $article): Response
    {
        // Authorization check
        if (!$article->isOwnedBy(auth()->user())) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit artikel ini.');
        }

        $categories = $this->articleService->getCategories();

        return Inertia::render('articles/edit', [
            'article' => $article->load('category'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update article
     */
    public function update(ArticleUpdateRequest $request, Article $article): RedirectResponse
    {
        $this->articleService->updateArticle($article, $request->validated());

        return redirect()->route('articles.my-articles')
            ->with('success', 'Artikel berhasil diperbarui!');
    }

    /**
     * Delete article
     */
    public function destroy(Article $article): RedirectResponse
    {
        // Authorization check
        if (!$article->isOwnedBy(auth()->user())) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus artikel ini.');
        }

        $this->articleService->deleteArticle($article);

        return redirect()->route('articles.my-articles')
            ->with('success', 'Artikel berhasil dihapus!');
    }

    /**
     * Toggle publish status
     */
    public function togglePublish(Article $article): RedirectResponse
    {
        // Authorization check
        if (!$article->isOwnedBy(auth()->user())) {
            abort(403);
        }

        $this->articleService->togglePublish($article);

        return back()->with('success', 'Status publikasi artikel berhasil diubah!');
    }
}
