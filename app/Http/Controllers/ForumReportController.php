<?php

namespace App\Http\Controllers;

use App\Models\ForumDiscussion;
use App\Models\ForumReply;
use App\Models\ForumReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ForumReportController extends Controller
{
    /**
     * Display a listing of reports (admin only).
     */
    public function index(Request $request): Response
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $status = $request->input('status', 'all');

        $query = ForumReport::with(['reporter', 'reviewer', 'reportable'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/forum/reports/index', [
            'reports' => $reports,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    /**
     * Store a new report.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reportable_type' => 'required|in:discussion,reply',
            'reportable_id' => 'required|integer',
            'reason' => 'required|string|in:spam,inappropriate,offensive,harassment,other',
            'description' => 'nullable|string|max:500',
        ]);

        // Convert reportable_type to full class name
        $reportableClass = $validated['reportable_type'] === 'discussion'
            ? ForumDiscussion::class
            : ForumReply::class;

        // Check if reportable exists
        $reportable = $reportableClass::findOrFail($validated['reportable_id']);

        // Check if user already reported this item
        $existingReport = ForumReport::where('user_id', Auth::id())
            ->where('reportable_type', $reportableClass)
            ->where('reportable_id', $validated['reportable_id'])
            ->where('status', 'pending')
            ->first();

        if ($existingReport) {
            return back()->with('error', 'Anda sudah melaporkan konten ini sebelumnya.');
        }

        ForumReport::create([
            'user_id' => Auth::id(),
            'reportable_type' => $reportableClass,
            'reportable_id' => $validated['reportable_id'],
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Laporan berhasil dikirim. Tim moderator akan meninjau segera.');
    }

    /**
     * Update report status (admin only).
     */
    public function update(Request $request, ForumReport $report): RedirectResponse
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:reviewed,resolved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $report->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }

    /**
     * Delete the reported content (admin only).
     */
    public function deleteReported(ForumReport $report): RedirectResponse
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        // Delete the reported content
        $report->reportable->delete();

        // Update report status
        $report->update([
            'status' => 'resolved',
            'admin_notes' => 'Konten telah dihapus oleh moderator.',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Konten yang dilaporkan berhasil dihapus.');
    }
}
