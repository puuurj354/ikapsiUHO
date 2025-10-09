<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'image',
        'event_date',
        'registration_deadline',
        'max_participants',
        'is_published',
        'created_by',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'registration_deadline' => 'datetime',
        'is_published' => 'boolean',
    ];

    /**
     * Get the user who created the event
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get registered users for this event
     */
    public function registrations(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_registrations')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Check if user is registered for this event
     */
    public function isUserRegistered(int $userId): bool
    {
        return $this->registrations()->where('user_id', $userId)->exists();
    }

    /**
     * Get registration count
     */
    public function getRegistrationCountAttribute(): int
    {
        return $this->registrations()->count();
    }

    /**
     * Check if registration is full
     */
    public function isFull(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->registration_count >= $this->max_participants;
    }

    /**
     * Check if registration is open
     */
    public function isRegistrationOpen(): bool
    {
        if (!$this->is_published) {
            return false;
        }

        if ($this->isFull()) {
            return false;
        }

        if ($this->registration_deadline && now()->isAfter($this->registration_deadline)) {
            return false;
        }

        return true;
    }
}
