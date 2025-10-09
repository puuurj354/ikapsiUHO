<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin user
        User::firstOrCreate(
            ['email' => 'admin@ikapsiuho.id'],
            [
                'name' => 'Admin IKAPSI UHO',
                'password' => Hash::make('password'),
                'role' => Role::ADMIN,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Admin user created successfully!');
        $this->command->info('📧 Email: admin@ikapsiuho.id');
        $this->command->info('🔑 Password: password');
        $this->command->warn('⚠️  Please change the password after first login!');
    }
}
