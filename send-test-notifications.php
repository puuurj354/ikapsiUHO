<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Event;
use App\Notifications\WelcomeNotification;
use App\Notifications\EventRegistrationConfirmedNotification;
use App\Notifications\NewEventPublishedNotification;
use App\Notifications\EventReminderNotification;
use App\Notifications\EventRegistrationStatusChangedNotification;

echo "🧪 Testing Notifications\n";
echo "========================\n\n";

$user = User::where('role', 'alumni')->first();
if (!$user) {
    echo "❌ No alumni user found\n";
    exit(1);
}
echo "✓ Test user: {$user->name} ({$user->email})\n\n";

// Clear old notifications
$user->notifications()->delete();
echo "🗑️  Cleared old notifications\n\n";

// Send notifications
echo "1️⃣  Sending Welcome Notification...\n";
$user->notify(new WelcomeNotification());
echo "   ✓ Sent\n\n";

$event = Event::where('is_published', true)->first();
if ($event) {
    echo "2️⃣  Sending Event Registration Notification...\n";
    $user->notify(new EventRegistrationConfirmedNotification($event));
    echo "   ✓ Sent for event: {$event->title}\n\n";

    echo "3️⃣  Sending New Event Published Notification...\n";
    $user->notify(new NewEventPublishedNotification($event));
    echo "   ✓ Sent\n\n";

    echo "4️⃣  Sending Event Reminder Notification...\n";
    $user->notify(new EventReminderNotification($event));
    echo "   ✓ Sent\n\n";

    echo "5️⃣  Sending Status Change (Attended) Notification...\n";
    $user->notify(new EventRegistrationStatusChangedNotification($event, 'attended'));
    echo "   ✓ Sent\n\n";

    echo "6️⃣  Sending Status Change (Cancelled) Notification...\n";
    $user->notify(new EventRegistrationStatusChangedNotification($event, 'cancelled'));
    echo "   ✓ Sent\n\n";
} else {
    echo "⚠️  No published event found\n\n";
}

$count = $user->unreadNotifications()->count();
echo "📊 Total unread notifications: $count\n\n";

// Show notifications
echo "📋 Notification List:\n";
foreach ($user->unreadNotifications as $notification) {
    $data = $notification->data;
    echo "   • [{$data['type']}] {$data['title']}\n";
}

echo "\n✅ Done! Now test in browser:\n";
echo "   1. Go to: http://127.0.0.1:8000\n";
echo "   2. Login with:\n";
echo "      Email: {$user->email}\n";
echo "      Password: password\n";
echo "   3. Check notification bell icon (top right)\n";
echo "   4. Test: Click notification, Mark as read, Delete, Load more\n";
