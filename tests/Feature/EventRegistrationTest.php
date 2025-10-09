<?php

use App\Models\Event;
use App\Models\User;
use App\Services\EventService;

beforeEach(function () {
    $this->eventService = new EventService();
});

test('user can view published events', function () {
    $user = User::factory()->create();
    Event::factory()->count(3)->create(['is_published' => true]);

    $response = $this->actingAs($user)->get('/events');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('events/index'));
});

test('user can register for event', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'max_participants' => 50,
        'registration_deadline' => now()->addDays(7),
        'event_date' => now()->addDays(14),
    ]);

    $result = $this->eventService->registerUserForEvent($event, $user);

    expect($result['success'])->toBeTrue();
    $this->assertDatabaseHas('event_registrations', [
        'event_id' => $event->id,
        'user_id' => $user->id,
        'status' => 'registered',
    ]);
});

test('user cannot register for unpublished event', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create(['is_published' => false]);

    $result = $this->eventService->registerUserForEvent($event, $user);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toContain('tidak tersedia');
});

test('user cannot register twice for same event', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'max_participants' => 50,
        'registration_deadline' => now()->addDays(7),
        'event_date' => now()->addDays(14),
    ]);

    // First registration
    $this->eventService->registerUserForEvent($event, $user);

    // Second registration attempt
    $result = $this->eventService->registerUserForEvent($event, $user);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toContain('sudah terdaftar');
});

test('user cannot register for full event', function () {
    $event = Event::factory()->create([
        'is_published' => true,
        'max_participants' => 1,
        'registration_deadline' => now()->addDays(7),
        'event_date' => now()->addDays(14),
    ]);

    // Fill the event
    $otherUser = User::factory()->create();
    $event->registrations()->attach($otherUser->id, ['status' => 'registered']);

    // Try to register new user
    $user = User::factory()->create();
    $result = $this->eventService->registerUserForEvent($event, $user);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toContain('penuh');
});

test('user can cancel registration', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'event_date' => now()->addDays(14),
    ]);

    // Register first
    $event->registrations()->attach($user->id, ['status' => 'registered']);

    // Cancel registration
    $result = $this->eventService->cancelUserRegistration($event, $user);

    expect($result['success'])->toBeTrue();
    $this->assertDatabaseHas('event_registrations', [
        'event_id' => $event->id,
        'user_id' => $user->id,
        'status' => 'cancelled',
    ]);
});

test('user cannot cancel if not registered', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'event_date' => now()->addDays(14),
    ]);

    $result = $this->eventService->cancelUserRegistration($event, $user);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toContain('belum terdaftar');
});

test('user cannot cancel registration for past event', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'event_date' => now()->subDays(1),
    ]);

    // Register first
    $event->registrations()->attach($user->id, ['status' => 'registered']);

    // Try to cancel
    $result = $this->eventService->cancelUserRegistration($event, $user);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toContain('sudah berlangsung');
});

test('event listing can be filtered by search', function () {
    $user = User::factory()->create();

    Event::factory()->create([
        'title' => 'Workshop Psikologi',
        'is_published' => true,
    ]);

    Event::factory()->create([
        'title' => 'Seminar Nasional',
        'is_published' => true,
    ]);

    $response = $this->actingAs($user)->get('/events?search=Workshop');

    $response->assertStatus(200);
});

test('event listing can be filtered by time', function () {
    $user = User::factory()->create();

    Event::factory()->create([
        'title' => 'Past Event',
        'is_published' => true,
        'event_date' => now()->subDays(7),
    ]);

    Event::factory()->create([
        'title' => 'Upcoming Event',
        'is_published' => true,
        'event_date' => now()->addDays(7),
    ]);

    $response = $this->actingAs($user)->get('/events?time=upcoming');

    $response->assertStatus(200);
});

test('user can view event details', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create(['is_published' => true]);

    $response = $this->actingAs($user)->get("/events/{$event->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('events/show')
        ->has('event')
    );
});

test('registration via http request works', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'max_participants' => 50,
        'registration_deadline' => now()->addDays(7),
        'event_date' => now()->addDays(14),
    ]);

    $response = $this->actingAs($user)->post("/events/{$event->id}/register");

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('event_registrations', [
        'event_id' => $event->id,
        'user_id' => $user->id,
        'status' => 'registered',
    ]);
});

test('cancel registration via http request works', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create([
        'is_published' => true,
        'event_date' => now()->addDays(14),
    ]);

    // Register first
    $event->registrations()->attach($user->id, ['status' => 'registered']);

    $response = $this->actingAs($user)->post("/events/{$event->id}/cancel");

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('event_registrations', [
        'event_id' => $event->id,
        'user_id' => $user->id,
        'status' => 'cancelled',
    ]);
});
