<?php

use App\Http\Controllers\Admin\ArticleCategoryController;
use App\Http\Controllers\Admin\EventManagementController as AdminEventController;
use App\Http\Controllers\Admin\ForumCategoryController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AlumniDashboardController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\ForumReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PublicArticleController;
use App\Services\ArticleService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (ArticleService $articleService) {
    $featuredArticles = $articleService->getRecentArticles(2);

    return Inertia::render('welcome', [
        'featuredArticles' => $featuredArticles,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Alumni routes
    Route::prefix('alumni')->name('alumni.')->group(function () {
        Route::get('directory', [AlumniDashboardController::class, 'directory'])->name('directory');
        Route::patch('profile', [AlumniDashboardController::class, 'updateProfile'])->name('profile.update');
    });

    // Events routes (for all authenticated users)
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('{event}', [EventController::class, 'show'])->name('show');
        Route::post('{event}/register', [EventController::class, 'register'])->name('register');
        Route::post('{event}/cancel', [EventController::class, 'cancelRegistration'])->name('cancel');
    });

    // Forum routes (for all authenticated users)
    Route::prefix('forum')->name('forum.')->group(function () {
        Route::get('/', [ForumController::class, 'index'])->name('index');
        Route::get('create', [ForumController::class, 'create'])->name('create');
        Route::post('/', [ForumController::class, 'store'])->name('store');
        Route::get('{slug}', [ForumController::class, 'show'])->name('show');
        Route::get('{slug}/edit', [ForumController::class, 'edit'])->name('edit');
        Route::patch('{slug}', [ForumController::class, 'update'])->name('update');
        Route::delete('{slug}', [ForumController::class, 'destroy'])->name('destroy');

        // Discussion actions
        Route::post('{slug}/like', [ForumController::class, 'toggleLike'])->name('like');
        Route::post('{slug}/pin', [ForumController::class, 'togglePin'])->name('pin');
        Route::post('{slug}/lock', [ForumController::class, 'toggleLock'])->name('lock');
        Route::post('{slug}/reply', [ForumController::class, 'storeReply'])->name('reply');

        // Reply actions
        Route::post('reply/{reply}/like', [ForumController::class, 'toggleReplyLike'])->name('reply.like');
    });

    // Report routes - authenticated users can report content
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::post('/', [ForumReportController::class, 'store'])->name('store');
    });

    // Article routes - authenticated users can manage their articles
    Route::prefix('articles')->name('articles.')->group(function () {
        Route::get('my-articles', [ArticleController::class, 'index'])->name('my-articles');
        Route::get('create', [ArticleController::class, 'create'])->name('create');
        Route::post('/', [ArticleController::class, 'store'])->name('store');
        Route::get('{article}/edit', [ArticleController::class, 'edit'])->name('edit');
        Route::patch('{article}', [ArticleController::class, 'update'])->name('update');
        Route::delete('{article}', [ArticleController::class, 'destroy'])->name('destroy');
        Route::post('{article}/toggle-publish', [ArticleController::class, 'togglePublish'])->name('toggle-publish');
    });

    // Notification routes
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/unread', [NotificationController::class, 'getUnread'])->name('unread');
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
        Route::delete('/', [NotificationController::class, 'destroyAll'])->name('destroy-all');
    });
});

// Public article routes (must be after authenticated routes to avoid conflicts)
Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/', [PublicArticleController::class, 'index'])->name('public.index');
    Route::get('{slug}', [PublicArticleController::class, 'show'])->name('public.show');
});

// Admin routes - protected by admin middleware
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // User Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('index');
        Route::post('/', [UserManagementController::class, 'store'])->name('store');
        Route::patch('{user}', [UserManagementController::class, 'update'])->name('update');
        Route::delete('{user}', [UserManagementController::class, 'destroy'])->name('destroy');
    });

    // Event Management
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/', [AdminEventController::class, 'index'])->name('index');
        Route::post('/', [AdminEventController::class, 'store'])->name('store');
        Route::patch('{event}', [AdminEventController::class, 'update'])->name('update');
        Route::delete('{event}', [AdminEventController::class, 'destroy'])->name('destroy');
        Route::get('{event}/registrations', [AdminEventController::class, 'registrations'])->name('registrations');
        Route::patch('{event}/registrations/{user}', [AdminEventController::class, 'updateRegistrationStatus'])->name('registrations.update');
    });

    // Forum Report Management
    Route::prefix('forum/reports')->name('forum.reports.')->group(function () {
        Route::get('/', [ForumReportController::class, 'index'])->name('index');
        Route::patch('{report}', [ForumReportController::class, 'update'])->name('update');
        Route::delete('{report}', [ForumReportController::class, 'deleteReported'])->name('delete-content');
    });

    // Forum Category Management
    Route::prefix('forum/categories')->name('forum.categories.')->group(function () {
        Route::get('/', [ForumCategoryController::class, 'index'])->name('index');
        Route::post('/', [ForumCategoryController::class, 'store'])->name('store');
        Route::put('{category}', [ForumCategoryController::class, 'update'])->name('update');
        Route::delete('{category}', [ForumCategoryController::class, 'destroy'])->name('destroy');
    });

    // Article Category Management
    Route::prefix('articles/categories')->name('articles.categories.')->group(function () {
        Route::get('/', [ArticleCategoryController::class, 'index'])->name('index');
        Route::post('/', [ArticleCategoryController::class, 'store'])->name('store');
        Route::patch('{category}', [ArticleCategoryController::class, 'update'])->name('update');
        Route::delete('{category}', [ArticleCategoryController::class, 'destroy'])->name('destroy');
        Route::post('{category}/toggle-active', [ArticleCategoryController::class, 'toggleActive'])->name('toggle-active');
    });

    // Admin can delete any article
    Route::delete('articles/{article}/force-delete', [ArticleController::class, 'destroy'])->name('articles.force-delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
