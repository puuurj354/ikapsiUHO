<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ForumCategoryController extends Controller
{
    /**
     * Display forum categories management page
     */
    public function index(): Response
    {
        $categories = ForumCategory::withCount('discussions')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/forum/categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store new category
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:forum_categories,name'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        ForumCategory::create($validated);

        return back()->with('success', 'Kategori forum berhasil ditambahkan!');
    }

    /**
     * Update category
     */
    public function update(Request $request, ForumCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('forum_categories')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori forum berhasil diperbarui!');
    }

    /**
     * Delete category
     */
    public function destroy(ForumCategory $category): RedirectResponse
    {
        // Check if category has discussions
        if ($category->discussions()->count() > 0) {
            return back()->with('error', 'Tidak dapat menghapus kategori yang memiliki diskusi!');
        }

        $category->delete();

        return back()->with('success', 'Kategori forum berhasil dihapus!');
    }
}
