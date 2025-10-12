<?php

use App\Models\Event;
use App\Models\User;
use App\Notifications\EventRegistrationConfirmedNotification;
use App\Notifications\EventReminderNotification;
use App\Notifications\EventRegistrationStatusChangedNotification;
use App\Notifications\NewEventPublishedNotification;
use App\Notifications\WelcomeNotification;
use Illuminate\Support\Facades\DB;

echo "🧪 Quick Notification Test\n";
echo "==========================\n\n";

// Get test user
$user = User::where('is_admin', false)->first();
if (!$user) {
    echo "❌ No non-admin user found\n";
    exit(1);
}
echo "✓ Test user: {$user->name}\n";
echo "  Email: {$user->email}\n\n";

// Get test event
$event = Event::where('is_published', true)->first();
if (!$event) {
    echo "❌ No published event found\n";
    exit(1);
}
echo "✓ Test event: {$event->title}\n\n";

// Clear old notifications for this user
DB::table('notifications')->where('notifiable_id', $user->id)->delete();
echo "🗑️  Cleared old notifications\n\n";

// Test 1: Welcome Notification
echo "1️⃣  Testing Welcome Notification...\n";
$user->notify(new WelcomeNotification());
echo "   ✓ Sent\n\n";

// Test 2: Event Registration Confirmed
echo "2️⃣  Testing Event Registration Confirmed...\n";
$user->notify(new EventRegistrationConfirmedNotification($event));
echo "   ✓ Sent\n\n";

// Test 3: Event Status Changed
echo "3️⃣  Testing Event Status Changed (Attended)...\n";
$user->notify(new EventRegistrationStatusChangedNotification($event, 'attended'));
echo "   ✓ Sent\n\n";

// Test 4: Event Status Changed (Cancelled)
echo "4️⃣  Testing Event Status Changed (Cancelled)...\n";
$user->notify(new EventRegistrationStatusChangedNotification($event, 'cancelled'));
echo "   ✓ Sent\n\n";

// Test 5: New Event Published
echo "5️⃣  Testing New Event Published...\n";
$user->notify(new NewEventPublishedNotification($event));
echo "   ✓ Sent\n\n";

// Test 6: Event Reminder
echo "6️⃣  Testing Event Reminder...\n";
$user->notify(new EventReminderNotification($event));
echo "   ✓ Sent\n\n";

// Check database
echo "📊 Database Check\n";
echo "==================\n";
$count = DB::table('notifications')->where('notifiable_id', $user->id)->count();
echo "Total notifications: {$count}\n";
$unread = DB::table('notifications')->where('notifiable_id', $user->id)->whereNull('read_at')->count();
echo "Unread notifications: {$unread}\n\n";

// Show notification types
$notifications = DB::table('notifications')
    ->where('notifiable_id', $user->id)
    ->get();

echo "📋 Notification Details:\n";
foreach ($notifications as $notification) {
    $data = json_decode($notification->data);
    echo "   • {$data->type}: {$data->title}\n";
}

echo "\n✅ Test Complete!\n";
echo "\n";
echo "Next steps:\n";
echo "1. Login as: {$user->email}\n";
echo "2. Password: password\n";
echo "3. Check notification bell in header\n";
echo "4. Test mark as read\n";
echo "5. Test delete\n";
echo "6. Test load more (if > 10 notifications)\n";
