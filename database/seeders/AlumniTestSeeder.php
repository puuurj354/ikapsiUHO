<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AlumniTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Profesi options
        $profesi = [
            'Psikolog Klinis',
            'Psikolog Pendidikan',
            'Psikolog Industri dan Organisasi',
            'Konselor',
            'HR Manager',
            'Dosen',
            'Peneliti',
            'Guru BK',
            'Trainer',
            'Terapis',
        ];

        // Create alumni for different years
        $years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

        foreach ($years as $year) {
            $alumniCount = rand(3, 8); // Random number of alumni per year

            for ($i = 1; $i <= $alumniCount; $i++) {
                User::create([
                    'name' => fake()->name(),
                    'email' => fake()->unique()->safeEmail(),
                    'password' => Hash::make('password'),
                    'role' => Role::ALUMNI,
                    'angkatan' => $year,
                    'profesi' => $profesi[array_rand($profesi)],
                    'bio' => fake()->paragraph(2),
                    'email_verified_at' => now(),
                ]);
            }
        }

        // Create one specific test alumni user
        User::create([
            'name' => 'Alumni Test',
            'email' => 'alumni@ikapsiuho.id',
            'password' => Hash::make('password'),
            'role' => Role::ALUMNI,
            'angkatan' => '2020',
            'profesi' => 'Psikolog Klinis',
            'bio' => 'Alumni aktif IKAPSI UHO yang berprofesi sebagai Psikolog Klinis di Kota Kendari.',
            'email_verified_at' => now(),
        ]);

        $totalAlumni = User::alumni()->count();

        $this->command->info("✅ {$totalAlumni} Alumni users created successfully!");
        $this->command->info('📧 Test Alumni Email: alumni@ikapsiuho.id');
        $this->command->info('🔑 Password: password');
    }
}
