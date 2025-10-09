<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@ikapsiuho.id')->first();

        if (!$admin) {
            $this->command->error('Admin user not found. Please run AdminUserSeeder first.');
            return;
        }

        $events = [
            [
                'title' => 'Workshop Kesehatan Mental di Era Digital',
                'description' => 'Workshop ini akan membahas tentang pentingnya kesehatan mental di era digital dan bagaimana mengelola stress dari penggunaan teknologi. Peserta akan belajar teknik-teknik praktis untuk menjaga kesehatan mental.',
                'location' => 'Auditorium Gedung Rektorat UHO',
                'event_date' => now()->addDays(15)->setTime(9, 0),
                'registration_deadline' => now()->addDays(10),
                'max_participants' => 100,
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Seminar Nasional Psikologi Pendidikan',
                'description' => 'Seminar nasional yang menghadirkan pembicara ahli di bidang psikologi pendidikan. Topik meliputi strategi pembelajaran modern, asesmen psikologi, dan intervensi pendidikan.',
                'location' => 'Hotel Swissbel Kendari',
                'event_date' => now()->addDays(30)->setTime(8, 0),
                'registration_deadline' => now()->addDays(25),
                'max_participants' => 200,
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Pelatihan Asesmen Psikologi untuk Praktisi',
                'description' => 'Pelatihan praktis tentang berbagai alat asesmen psikologi yang digunakan dalam praktik klinis, pendidikan, dan industri. Peserta akan mendapat sertifikat setelah menyelesaikan pelatihan.',
                'location' => 'Ruang Training IKAPSI UHO',
                'event_date' => now()->addDays(45)->setTime(13, 0),
                'registration_deadline' => now()->addDays(40),
                'max_participants' => 50,
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Reuni Alumni Psikologi UHO 2025',
                'description' => 'Acara reuni tahunan alumni Psikologi UHO. Mari berkumpul bersama, berbagi cerita, dan mempererat tali silaturahmi antar alumni dari berbagai angkatan.',
                'location' => 'Kampus Psikologi UHO',
                'event_date' => now()->addDays(60)->setTime(10, 0),
                'registration_deadline' => now()->addDays(55),
                'max_participants' => 300,
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Konseling Karir untuk Fresh Graduate',
                'description' => 'Program konseling karir khusus untuk alumni fresh graduate. Membantu menemukan arah karir yang tepat dan strategi mencari pekerjaan di bidang psikologi.',
                'location' => 'Online via Zoom',
                'event_date' => now()->addDays(20)->setTime(14, 0),
                'registration_deadline' => now()->addDays(18),
                'max_participants' => 75,
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Diskusi Panel: Masa Depan Profesi Psikologi',
                'description' => 'Panel diskusi dengan praktisi psikologi senior membahas tren dan masa depan profesi psikologi di Indonesia.',
                'location' => 'Gedung Serbaguna UHO',
                'event_date' => now()->addDays(90)->setTime(15, 0),
                'registration_deadline' => now()->addDays(85),
                'max_participants' => null, // unlimited
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => '[DRAFT] Pelatihan Mindfulness & Meditasi',
                'description' => 'Pelatihan praktis tentang mindfulness dan meditasi untuk mengurangi stress dan meningkatkan kesejahteraan psikologis.',
                'location' => 'TBA',
                'event_date' => now()->addDays(120)->setTime(9, 0),
                'registration_deadline' => null,
                'max_participants' => 40,
                'is_published' => false, // draft
                'created_by' => $admin->id,
            ],
        ];

        foreach ($events as $eventData) {
            Event::create($eventData);
        }

        $this->command->info('✅ ' . count($events) . ' events created successfully!');
        $this->command->info('📅 Published events: ' . collect($events)->where('is_published', true)->count());
        $this->command->info('📝 Draft events: ' . collect($events)->where('is_published', false)->count());
    }
}
