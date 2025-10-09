<?php

use App\Http\Controllers\Admin\EventManagementController as AdminEventController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AlumniDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
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

    // Events routes (for all authenticated users)
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('{event}', [EventController::class, 'show'])->name('show');
        Route::post('{event}/register', [EventController::class, 'register'])->name('register');
        Route::post('{event}/cancel', [EventController::class, 'cancelRegistration'])->name('cancel');
    });
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
