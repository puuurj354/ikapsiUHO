#!/bin/bash

echo "🧪 Testing Notification System"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Test Notification Tables
echo -e "${YELLOW}1. Checking notifications table...${NC}"
php artisan tinker --execute="
    \$count = DB::table('notifications')->count();
    echo \"Total notifications: \$count\n\";
    \$unread = DB::table('notifications')->whereNull('read_at')->count();
    echo \"Unread notifications: \$unread\n\";
"

# 2. Test Welcome Notification
echo ""
echo -e "${YELLOW}2. Testing Welcome Notification...${NC}"
php artisan tinker --execute="
    \$user = App\Models\User::where('is_admin', false)->first();
    if (\$user) {
        \$user->notify(new App\Notifications\WelcomeNotification());
        echo \"✓ Welcome notification sent to: {\$user->name}\n\";
    }
"

# 3. Test Event Registration Notification
echo ""
echo -e "${YELLOW}3. Testing Event Registration Notification...${NC}"
php artisan tinker --execute="
    \$event = App\Models\Event::where('is_published', true)->first();
    \$user = App\Models\User::where('is_admin', false)->first();
    if (\$event && \$user) {
        \$user->notify(new App\Notifications\EventRegistrationConfirmedNotification(\$event));
        echo \"✓ Event registration notification sent\n\";
        echo \"  Event: {\$event->title}\n\";
        echo \"  User: {\$user->name}\n\";
    }
"

# 4. Test Event Status Change Notification
echo ""
echo -e "${YELLOW}4. Testing Event Status Change Notification...${NC}"
php artisan tinker --execute="
    \$event = App\Models\Event::where('is_published', true)->first();
    \$user = App\Models\User::where('is_admin', false)->first();
    if (\$event && \$user) {
        \$user->notify(new App\Notifications\EventRegistrationStatusChangedNotification(\$event, 'attended'));
        echo \"✓ Status change notification sent (attended)\n\";
        echo \"  Event: {\$event->title}\n\";
        echo \"  User: {\$user->name}\n\";
    }
"

# 5. Test New Event Published Notification
echo ""
echo -e "${YELLOW}5. Testing New Event Published Notification...${NC}"
php artisan tinker --execute="
    \$event = App\Models\Event::where('is_published', true)->first();
    \$user = App\Models\User::where('is_admin', false)->first();
    if (\$event && \$user) {
        \$user->notify(new App\Notifications\NewEventPublishedNotification(\$event));
        echo \"✓ New event notification sent\n\";
        echo \"  Event: {\$event->title}\n\";
        echo \"  User: {\$user->name}\n\";
    }
"

# 6. Test Event Reminder Notification
echo ""
echo -e "${YELLOW}6. Testing Event Reminder Notification...${NC}"
php artisan tinker --execute="
    \$event = App\Models\Event::where('is_published', true)->first();
    \$user = App\Models\User::where('is_admin', false)->first();
    if (\$event && \$user) {
        \$user->notify(new App\Notifications\EventReminderNotification(\$event));
        echo \"✓ Event reminder notification sent\n\";
        echo \"  Event: {\$event->title}\n\";
        echo \"  User: {\$user->name}\n\";
    }
"

# 7. Check Queue Jobs
echo ""
echo -e "${YELLOW}7. Checking queue jobs...${NC}"
php artisan tinker --execute="
    \$pending = DB::table('jobs')->count();
    echo \"Pending jobs: \$pending\n\";
"

# 8. Test Forum Notifications (already existing)
echo ""
echo -e "${YELLOW}8. Testing Forum Reply Notification...${NC}"
php artisan tinker --execute="
    \$discussion = App\Models\ForumDiscussion::first();
    \$user = App\Models\User::where('is_admin', false)->first();
    if (\$discussion && \$user) {
        \$reply = new App\Models\ForumReply([
            'content' => 'Test reply for notification',
            'user_id' => \$user->id,
        ]);
        \$discussion->user->notify(
            new App\Notifications\ForumReplyNotification(\$reply, \$discussion, \$user)
        );
        echo \"✓ Forum reply notification sent\n\";
        echo \"  Discussion: {\$discussion->title}\n\";
    }
"

# 9. Final Count
echo ""
echo -e "${YELLOW}9. Final notification count...${NC}"
php artisan tinker --execute="
    \$count = DB::table('notifications')->count();
    echo \"Total notifications in DB: \$count\n\";
    \$unread = DB::table('notifications')->whereNull('read_at')->count();
    echo \"Unread notifications: \$unread\n\";
"

echo ""
echo -e "${GREEN}✅ Testing Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Process queue: php artisan queue:work"
echo "2. Open browser and check notification bell"
echo "3. Test mark as read functionality"
echo "4. Test delete notification"
echo "5. Test pagination (load more)"
