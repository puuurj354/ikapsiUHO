<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule event reminders to run daily at 9 AM
Schedule::command('events:send-reminders')
    ->dailyAt('09:00')
    ->name('send-event-reminders')
    ->withoutOverlapping();
