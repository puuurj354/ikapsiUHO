<?php

namespace App\Http\Controllers;

use App\Services\ArticleService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicArticleController extends Controller
{
    protected ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Display list of published articles
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');

        $articles = $this->articleService->getPublishedArticles($search, $category);
        $categories = $this->articleService->getCategories();

        return Inertia::render('articles/index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    /**
     * Display single article
     */
    public function show(string $slug): Response
    {
        $article = $this->articleService->getPublishedArticle($slug);

        // Get related articles from the same category, excluding current article
        $relatedArticles = $this->articleService->getRelatedArticles($article->id, $article->article_category_id);

        return Inertia::render('articles/show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
