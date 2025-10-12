<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Notifications\EventReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder notifications for upcoming events';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get events happening tomorrow
        $tomorrow = Carbon::tomorrow();

        $events = Event::where('is_published', true)
            ->whereDate('event_date', $tomorrow)
            ->with('registrations')
            ->get();

        $totalReminders = 0;

        foreach ($events as $event) {
            // Get registered users (not cancelled)
            $registeredUsers = $event->registrations()
                ->wherePivot('status', 'registered')
                ->get();

            foreach ($registeredUsers as $user) {
                $user->notify(new EventReminderNotification($event));
                $totalReminders++;
            }

            $this->info("Sent {$registeredUsers->count()} reminders for event: {$event->title}");
        }

        if ($events->isEmpty()) {
            $this->info('No events scheduled for tomorrow.');
        } else {
            $this->info("Total reminders sent: {$totalReminders}");
        }

        return Command::SUCCESS;
    }
}
