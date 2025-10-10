<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleCategoryRequest;
use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleCategoryController extends Controller
{
    /**
     * Display article categories
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = ArticleCategory::withCount('articles');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->ordered()->get();

        return Inertia::render('admin/articles/categories', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store new category
     */
    public function store(ArticleCategoryRequest $request): RedirectResponse
    {
        ArticleCategory::create($request->validated());

        return back()->with('success', 'Kategori artikel berhasil ditambahkan!');
    }

    /**
     * Update category
     */
    public function update(ArticleCategoryRequest $request, ArticleCategory $category): RedirectResponse
    {
        $category->update($request->validated());

        return back()->with('success', 'Kategori artikel berhasil diperbarui!');
    }

    /**
     * Delete category
     */
    public function destroy(ArticleCategory $category): RedirectResponse
    {
        if ($category->articles()->count() > 0) {
            return back()->withErrors([
                'category' => 'Kategori tidak dapat dihapus karena masih memiliki artikel.'
            ]);
        }

        $category->delete();

        return back()->with('success', 'Kategori artikel berhasil dihapus!');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(ArticleCategory $category): RedirectResponse
    {
        $category->update(['is_active' => !$category->is_active]);

        return back()->with('success', 'Status kategori berhasil diubah!');
    }
}
