<?php

namespace App\Http\Controllers;

use App\Services\AdminDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    protected AdminDashboardService $adminService;

    public function __construct(AdminDashboardService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Display admin dashboard with statistics
     */
    public function index(): Response
    {
        $statistics = $this->adminService->getStatistics();

        return Inertia::render('admin/dashboard', [
            'statistics' => $statistics,
        ]);
    }
}
