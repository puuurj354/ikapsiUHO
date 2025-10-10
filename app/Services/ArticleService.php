<?php

namespace App\Services;

use App\Models\Article;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class ArticleService
{
    /**
     * Get published articles for public view
     */
    public function getPublishedArticles(?string $search = null, ?string $categorySlug = null, int $perPage = 12): LengthAwarePaginator
    {
        $query = Article::with(['author' => function ($query) {
            $query->select('id', 'name', 'profile_picture', 'profesi');
        }, 'category'])
            ->published()
            ->search($search);

        // Filter by category slug if provided
        if ($categorySlug) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        return $query->recent()->paginate($perPage);
    }

    /**
     * Get single published article by slug
     */
    public function getPublishedArticle(string $slug): Article
    {
        $article = Article::with(['author' => function ($query) {
            $query->select('id', 'name', 'profile_picture', 'profesi', 'bio');
        }, 'category'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment views
        $article->incrementViews();

        return $article;
    }

    /**
     * Get articles by author (user's own articles)
     */
    public function getUserArticles(User $user, ?string $status = null, ?string $search = null): LengthAwarePaginator
    {
        $query = Article::with('category')->where('user_id', $user->id);

        if ($search) {
            $query->search($search);
        }

        if ($status === 'published') {
            $query->published();
        } elseif ($status === 'draft') {
            $query->draft();
        }

        return $query->orderBy('created_at', 'desc')->paginate(12);
    }

    /**
     * Create new article
     */
    public function createArticle(array $data, User $user): Article
    {
        $data['user_id'] = $user->id;

        if (isset($data['featured_image'])) {
            $data['featured_image'] = $data['featured_image']->store('article-images', 'public');
        }

        if (isset($data['is_published']) && $data['is_published']) {
            $data['published_at'] = $data['published_at'] ?? now();
        }

        return Article::create($data);
    }

    /**
     * Update article
     */
    public function updateArticle(Article $article, array $data): Article
    {
        if (isset($data['featured_image'])) {
            // Delete old image if exists
            if ($article->featured_image) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $data['featured_image'] = $data['featured_image']->store('article-images', 'public');
        }

        // Handle publishing
        if (isset($data['is_published'])) {
            if ($data['is_published'] && !$article->is_published) {
                $data['published_at'] = now();
            } elseif (!$data['is_published']) {
                $data['published_at'] = null;
            }
        }

        $article->update($data);

        return $article->fresh();
    }

    /**
     * Delete article
     */
    public function deleteArticle(Article $article): void
    {
        // Delete featured image if exists
        if ($article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
        }

        $article->delete();
    }

    /**
     * Toggle publish status
     */
    public function togglePublish(Article $article): Article
    {
        if ($article->is_published) {
            $article->unpublish();
        } else {
            $article->publish();
        }

        return $article->fresh();
    }

    /**
     * Get available categories
     */
    public function getCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return \App\Models\ArticleCategory::active()->ordered()->get();
    }

    /**
     * Get recent articles for sidebar/widgets
     */
    public function getRecentArticles(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return Article::with(['author' => function ($query) {
            $query->select('id', 'name');
        }])
            ->published()
            ->recent()
            ->limit($limit)
            ->get();
    }

    /**
     * Get popular articles
     */
    public function getPopularArticles(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return Article::with(['author' => function ($query) {
            $query->select('id', 'name');
        }])
            ->published()
            ->popular()
            ->limit($limit)
            ->get();
    }

    /**
     * Get related articles based on category
     */
    public function getRelatedArticles(int $articleId, ?int $categoryId = null, int $limit = 4): \Illuminate\Database\Eloquent\Collection
    {
        $query = Article::with(['author' => function ($query) {
            $query->select('id', 'name');
        }])
            ->published()
            ->where('id', '!=', $articleId);

        if ($categoryId) {
            $query->byCategory($categoryId);
        }

        return $query->recent()
            ->limit($limit)
            ->get();
    }
}
