<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AlumniDashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected AlumniDashboardService $alumniService;

    public function __construct(AlumniDashboardService $alumniService)
    {
        $this->alumniService = $alumniService;
    }

    /**
     * Display the appropriate dashboard based on user role
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        // Redirect admin to admin dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Show alumni dashboard for alumni users
        $dashboardData = $this->alumniService->getDashboardData();

        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData,
        ]);
    }
}
