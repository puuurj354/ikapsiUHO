<?php

namespace App\Http\Controllers;

use App\Services\AlumniDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlumniDashboardController extends Controller
{
    protected AlumniDashboardService $alumniService;

    public function __construct(AlumniDashboardService $alumniService)
    {
        $this->alumniService = $alumniService;
    }

    /**
     * Display alumni dashboard
     */
    public function index(): Response
    {
        $dashboardData = $this->alumniService->getDashboardData();

        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData,
        ]);
    }

    /**
     * Get alumni directory
     */
    public function directory(Request $request): Response
    {
        $search = $request->query('search');
        $angkatan = $request->query('angkatan');
        $profesi = $request->query('profesi');

        $alumni = $this->alumniService->getAlumniDirectory($search, $angkatan, $profesi);

        return Inertia::render('alumni/directory', [
            'alumni' => $alumni,
            'filters' => [
                'search' => $search,
                'angkatan' => $angkatan,
                'profesi' => $profesi,
            ],
        ]);
    }

    /**
     * Update alumni profile
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'angkatan' => 'nullable|string|max:4',
            'profesi' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
        ]);

        $updated = $this->alumniService->updateProfile($validated);

        if ($updated) {
            return back()->with('success', 'Profil berhasil diperbarui.');
        }

        return back()->with('error', 'Gagal memperbarui profil.');
    }
}
