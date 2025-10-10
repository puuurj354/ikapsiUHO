<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\WelcomeNotification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Kirim welcome notification ke semua user
        $users = User::all();

        foreach ($users as $user) {
            $user->notify(new WelcomeNotification());
        }

        $this->command->info('Welcome notifications sent to all users!');
    }
}
