<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function getUnread(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $query = $request->user()->unreadNotifications()->latest();

        $total = $query->count();
        $notifications = $query
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $hasMore = ($page * $perPage) < $total;

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $total,
            'has_more' => $hasMore,
            'current_page' => $page,
            'per_page' => $perPage,
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi telah ditandai sebagai dibaca',
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi berhasil dihapus',
        ]);
    }

    public function destroyAll(Request $request)
    {
        $request->user()->notifications()->delete();

        return back()->with('success', 'Semua notifikasi berhasil dihapus');
    }
}
