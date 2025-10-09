<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AlumniDashboardController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Alumni routes
    Route::prefix('alumni')->name('alumni.')->group(function () {
        Route::get('directory', [AlumniDashboardController::class, 'directory'])->name('directory');
        Route::patch('profile', [AlumniDashboardController::class, 'updateProfile'])->name('profile.update');
    });
});

// Admin routes - protected by admin middleware
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
