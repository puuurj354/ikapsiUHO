<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventManagementController extends Controller
{
    /**
     * Display events list
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Event::with('creator:id,name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where('is_published', false);
        }

        $events = $query->orderBy('event_date', 'desc')->paginate(12);

        return Inertia::render('admin/events/index', [
            'events' => $events,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Store new event
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'registration_deadline' => 'nullable|date|before:event_date',
            'max_participants' => 'nullable|integer|min:1',
            'is_published' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $validated['created_by'] = Auth::id();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('event-images', 'public');
        }

        Event::create($validated);

        return back()->with('success', 'Event berhasil dibuat.');
    }

    /**
     * Update event
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'registration_deadline' => 'nullable|date|before:event_date',
            'max_participants' => 'nullable|integer|min:1',
            'is_published' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }
            $validated['image'] = $request->file('image')->store('event-images', 'public');
        }

        $event->update($validated);

        return back()->with('success', 'Event berhasil diperbarui.');
    }

    /**
     * Delete event
     */
    public function destroy(Event $event)
    {
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return back()->with('success', 'Event berhasil dihapus.');
    }

    /**
     * Get event registrations
     */
    public function registrations(Event $event): Response
    {
        $registrations = $event->registrations()
            ->withPivot('status', 'created_at')
            ->orderBy('event_registrations.created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->pivot->id ?? $user->id,
                    'user_id' => $user->id,
                    'status' => $user->pivot->status,
                    'registered_at' => $user->pivot->created_at,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'angkatan' => $user->angkatan,
                        'profesi' => $user->profesi,
                        'profile_picture_url' => $user->profile_picture_url,
                    ],
                ];
            });

        return Inertia::render('admin/events/registrations', [
            'event' => $event->load('creator:id,name'),
            'registrations' => $registrations,
        ]);
    }

    /**
     * Update registration status
     */
    public function updateRegistrationStatus(Request $request, Event $event, $userId)
    {
        $validated = $request->validate([
            'status' => 'required|in:registered,attended,cancelled',
        ]);

        $event->registrations()->updateExistingPivot($userId, [
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Status pendaftaran berhasil diperbarui.');
    }
}
