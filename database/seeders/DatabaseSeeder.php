<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed admin user
        $this->call(AdminUserSeeder::class);

        // Seed test alumni data
        $this->call(AlumniTestSeeder::class);

        // Seed events
        $this->call(EventSeeder::class);

        // Seed forum categories
        $this->call(ForumCategorySeeder::class);

        // Seed forum discussions
        $this->call(ForumDiscussionSeeder::class);

        // Seed forum reports
        $this->call(ForumReportSeeder::class);

        // Create additional test user if needed
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
