<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AlumniDashboardService
{
    /**
     * Get alumni dashboard data for current user
     */
    public function getDashboardData(): array
    {
        $user = Auth::user();

        return [
            'user_profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'profile_picture_url' => $user->profile_picture_url,
                'angkatan' => $user->angkatan,
                'profesi' => $user->profesi,
                'bio' => $user->bio,
                'email_verified' => $user->email_verified_at !== null,
                'two_factor_enabled' => $user->two_factor_secret !== null,
            ],
            'statistics' => [
                'total_alumni' => User::alumni()->count(),
                'alumni_in_same_year' => User::alumni()
                    ->where('angkatan', $user->angkatan)
                    ->where('id', '!=', $user->id)
                    ->count(),
                'recent_registrations' => User::alumni()
                    ->where('created_at', '>=', now()->subDays(30))
                    ->count(),
            ],
            'recent_alumni' => User::alumni()
                ->where('id', '!=', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'angkatan', 'profesi', 'created_at']),
            'alumni_by_year' => User::alumni()
                ->whereNotNull('angkatan')
                ->selectRaw('angkatan, COUNT(*) as total')
                ->groupBy('angkatan')
                ->orderBy('angkatan', 'desc')
                ->limit(5)
                ->get(),
        ];
    }

    /**
     * Get alumni directory with filters
     */
    public function getAlumniDirectory(?string $search = null, ?string $angkatan = null, ?string $profesi = null, int $limit = 20): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = User::alumni()
            ->select(['id', 'name', 'email', 'profile_picture', 'angkatan', 'profesi', 'bio', 'created_at']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('profesi', 'like', "%{$search}%");
            });
        }

        if ($angkatan) {
            $query->where('angkatan', $angkatan);
        }

        if ($profesi) {
            $query->where('profesi', 'like', "%{$profesi}%");
        }

        return $query->orderBy('name')
                    ->paginate($limit)
                    ->through(fn ($user) => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'angkatan' => $user->angkatan,
                        'profesi' => $user->profesi,
                        'bio' => $user->bio,
                        'profile_picture_url' => $user->profile_picture_url,
                        'created_at' => $user->created_at,
                    ]);
    }

    /**
     * Update alumni profile
     */
    public function updateProfile(array $data): bool
    {
        /** @var User $user */
        $user = Auth::user();

        return $user->update([
            'angkatan' => $data['angkatan'] ?? $user->angkatan,
            'profesi' => $data['profesi'] ?? $user->profesi,
            'bio' => $data['bio'] ?? $user->bio,
        ]);
    }
}
