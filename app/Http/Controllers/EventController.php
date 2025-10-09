<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display published events
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Event::where('is_published', true)
            ->with('creator:id,name')
            ->withCount('registrations');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        /** @var User $user */
        $user = Auth::user();

        $events = $query->orderBy('event_date', 'desc')
            ->paginate(12)
            ->through(function ($event) use ($user) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'location' => $event->location,
                    'image' => $event->image ? asset('storage/' . $event->image) : null,
                    'event_date' => $event->event_date,
                    'registration_deadline' => $event->registration_deadline,
                    'max_participants' => $event->max_participants,
                    'registrations_count' => $event->registrations_count,
                    'creator' => $event->creator,
                    'is_registered' => $event->isUserRegistered($user->id),
                    'is_registration_open' => $event->isRegistrationOpen(),
                    'is_full' => $event->isFull(),
                ];
            });

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display single event
     */
    public function show(Event $event): Response
    {
        if (!$event->is_published) {
            abort(404);
        }

        /** @var User $user */
        $user = Auth::user();

        $event->load('creator:id,name');
        $event->loadCount('registrations');

        return Inertia::render('events/show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'location' => $event->location,
                'image' => $event->image ? asset('storage/' . $event->image) : null,
                'event_date' => $event->event_date,
                'registration_deadline' => $event->registration_deadline,
                'max_participants' => $event->max_participants,
                'registrations_count' => $event->registrations_count,
                'creator' => $event->creator,
                'is_registered' => $event->isUserRegistered($user->id),
                'is_registration_open' => $event->isRegistrationOpen(),
                'is_full' => $event->isFull(),
            ],
        ]);
    }

    /**
     * Register for event
     */
    public function register(Event $event)
    {
        if (!$event->is_published) {
            return back()->with('error', 'Event tidak tersedia.');
        }

        if (!$event->isRegistrationOpen()) {
            return back()->with('error', 'Pendaftaran sudah ditutup.');
        }

        /** @var User $user */
        $user = Auth::user();

        if ($event->isUserRegistered($user->id)) {
            return back()->with('error', 'Anda sudah terdaftar untuk event ini.');
        }

        $event->registrations()->attach($user->id, [
            'status' => 'registered',
        ]);

        return back()->with('success', 'Berhasil mendaftar event!');
    }

    /**
     * Cancel event registration
     */
    public function cancelRegistration(Event $event)
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$event->isUserRegistered($user->id)) {
            return back()->with('error', 'Anda belum terdaftar untuk event ini.');
        }

        $event->registrations()->updateExistingPivot($user->id, [
            'status' => 'cancelled',
        ]);

        return back()->with('success', 'Pendaftaran event dibatalkan.');
    }
}
