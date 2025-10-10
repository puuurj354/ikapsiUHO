<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRegistrationRequest;
use App\Models\Event;
use App\Models\User;
use App\Services\EventService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * @var EventService
     */
    protected EventService $eventService;

    /**
     * Create a new controller instance.
     */
    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Display published events
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $filters = [
            'search' => $request->query('search'),
            'time' => $request->query('time'),
        ];

        $events = $this->eventService->getPublishedEvents($filters, $user);

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => $filters,
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

        $eventData = $this->eventService->getEventDataForUser($event, $user);

        return Inertia::render('events/show', [
            'event' => $eventData,
        ]);
    }

    /**
     * Register for event
     */
    public function register(EventRegistrationRequest $request, Event $event): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $result = $this->eventService->registerUserForEvent($event, $user);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    /**
     * Cancel event registration
     */
    public function cancelRegistration(EventRegistrationRequest $request, Event $event): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $result = $this->eventService->cancelUserRegistration($event, $user);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
