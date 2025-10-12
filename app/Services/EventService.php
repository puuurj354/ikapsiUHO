<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use App\Notifications\EventRegistrationConfirmedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventService
{
    /**
     * Register a user for an event
     *
     * @param Event $event
     * @param User $user
     * @return array{success: bool, message: string}
     */
    public function registerUserForEvent(Event $event, User $user): array
    {
        // Validate event is published
        if (!$event->is_published) {
            return [
                'success' => false,
                'message' => 'Event tidak tersedia.',
            ];
        }

        // Validate registration is open
        if (!$event->isRegistrationOpen()) {
            return [
                'success' => false,
                'message' => 'Pendaftaran sudah ditutup.',
            ];
        }

        // Validate event is not full
        if ($event->isFull()) {
            return [
                'success' => false,
                'message' => 'Kuota event sudah penuh.',
            ];
        }

        // Check if user is already registered
        if ($event->isUserRegistered($user->id)) {
            return [
                'success' => false,
                'message' => 'Anda sudah terdaftar untuk event ini.',
            ];
        }

        try {
            DB::beginTransaction();

            // Register the user
            $event->registrations()->attach($user->id, [
                'status' => 'registered',
            ]);

            // Send confirmation notification
            $user->notify(new EventRegistrationConfirmedNotification($event));

            // Log the registration
            Log::info('User registered for event', [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'event_title' => $event->title,
            ]);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Berhasil mendaftar event! Anda akan menerima konfirmasi melalui email.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to register user for event', [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
            ];
        }
    }

    /**
     * Cancel user registration for an event
     *
     * @param Event $event
     * @param User $user
     * @return array{success: bool, message: string}
     */
    public function cancelUserRegistration(Event $event, User $user): array
    {
        // Check if user is registered
        if (!$event->isUserRegistered($user->id)) {
            return [
                'success' => false,
                'message' => 'Anda belum terdaftar untuk event ini.',
            ];
        }

        // Check if event has already passed
        if ($event->event_date && now()->isAfter($event->event_date)) {
            return [
                'success' => false,
                'message' => 'Tidak dapat membatalkan pendaftaran untuk event yang sudah berlangsung.',
            ];
        }

        try {
            DB::beginTransaction();

            // Update registration status to cancelled
            $event->registrations()->updateExistingPivot($user->id, [
                'status' => 'cancelled',
            ]);

            // Log the cancellation
            Log::info('User cancelled event registration', [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'event_title' => $event->title,
            ]);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Pendaftaran event berhasil dibatalkan.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to cancel event registration', [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat membatalkan pendaftaran. Silakan coba lagi.',
            ];
        }
    }

    /**
     * Get event data for display
     *
     * @param Event $event
     * @param User $user
     * @return array
     */
    public function getEventDataForUser(Event $event, User $user): array
    {
        $event->load('creator:id,name');
        $event->loadCount('registrations');

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
    }

    /**
     * Get paginated published events with filters
     *
     * @param array $filters
     * @param User $user
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPublishedEvents(array $filters, User $user, int $perPage = 12)
    {
        $query = Event::where('is_published', true)
            ->with('creator:id,name')
            ->withCount('registrations');

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Apply time filter
        if (!empty($filters['time'])) {
            $now = now();

            if ($filters['time'] === 'upcoming') {
                $query->where('event_date', '>=', $now);
            } elseif ($filters['time'] === 'past') {
                $query->where('event_date', '<', $now);
            }
        }

        return $query->orderBy('event_date', 'desc')
            ->paginate($perPage)
            ->through(function ($event) use ($user) {
                return $this->getEventDataForUser($event, $user);
            });
    }

    /**
     * Check if user can register for event
     *
     * @param Event $event
     * @param User $user
     * @return array{can_register: bool, reason: string|null}
     */
    public function canUserRegister(Event $event, User $user): array
    {
        if (!$event->is_published) {
            return [
                'can_register' => false,
                'reason' => 'Event tidak tersedia',
            ];
        }

        if ($event->isUserRegistered($user->id)) {
            return [
                'can_register' => false,
                'reason' => 'Anda sudah terdaftar',
            ];
        }

        if ($event->isFull()) {
            return [
                'can_register' => false,
                'reason' => 'Kuota penuh',
            ];
        }

        if (!$event->isRegistrationOpen()) {
            return [
                'can_register' => false,
                'reason' => 'Pendaftaran ditutup',
            ];
        }

        if ($event->event_date && now()->isAfter($event->event_date)) {
            return [
                'can_register' => false,
                'reason' => 'Event sudah berlangsung',
            ];
        }

        return [
            'can_register' => true,
            'reason' => null,
        ];
    }
}
