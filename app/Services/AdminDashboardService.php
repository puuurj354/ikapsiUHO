<?php

namespace App\Services;

use App\Models\User;

class AdminDashboardService
{
    /**
     * Get admin dashboard statistics
     */
    public function getStatistics(): array
    {
        return [
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
    }

    /**
     * Get recent alumni registrations
     */
    public function getRecentAlumni(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return User::alumni()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get alumni statistics by profession
     */
    public function getAlumniByProfession(): \Illuminate\Support\Collection
    {
        return User::alumni()
            ->whereNotNull('profesi')
            ->selectRaw('profesi, COUNT(*) as total')
            ->groupBy('profesi')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();
    }
}