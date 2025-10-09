<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display admin dashboard with statistics
     */
    public function index(): Response
    {
        // Get statistics for admin dashboard
        $statistics = [
            'total_users' => User::count(),
            'total_alumni' => User::alumni()->count(),
            'total_admins' => User::admins()->count(),
            'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'alumni_by_year' => User::alumni()
                ->whereNotNull('angkatan')
                ->selectRaw('angkatan, COUNT(*) as total')
                ->groupBy('angkatan')
                ->orderBy('angkatan', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($item) => [
                    'year' => $item->angkatan,
                    'total' => $item->total,
                ]),
        ];

        return Inertia::render('admin/dashboard', [
            'statistics' => $statistics,
        ]);
    }
}
