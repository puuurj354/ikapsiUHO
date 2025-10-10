<?php

namespace Database\Seeders;

use App\Models\ForumCategory;
use Illuminate\Database\Seeder;

class ForumCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Umum',
                'slug' => 'umum',
                'description' => 'Diskusi umum seputar ikapsi UHO dan alumni',
                'icon' => 'MessageSquare',
                'color' => '#3b82f6',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Karir & Pekerjaan',
                'slug' => 'karir-pekerjaan',
                'description' => 'Berbagi informasi lowongan kerja, tips karir, dan pengalaman kerja',
                'icon' => 'Briefcase',
                'color' => '#10b981',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Akademik',
                'slug' => 'akademik',
                'description' => 'Diskusi seputar pendidikan, penelitian, dan pengembangan akademik',
                'icon' => 'GraduationCap',
                'color' => '#8b5cf6',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Event & Kegiatan',
                'slug' => 'event-kegiatan',
                'description' => 'Informasi dan diskusi seputar event alumni dan kegiatan ikapsi',
                'icon' => 'Calendar',
                'color' => '#f59e0b',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Wirausaha',
                'slug' => 'wirausaha',
                'description' => 'Berbagi pengalaman bisnis, tips, dan peluang wirausaha',
                'icon' => 'TrendingUp',
                'color' => '#ec4899',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Sosial & Komunitas',
                'slug' => 'sosial-komunitas',
                'description' => 'Kegiatan sosial, bakti sosial, dan pengabdian masyarakat',
                'icon' => 'Users',
                'color' => '#06b6d4',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Tanya Jawab',
                'slug' => 'tanya-jawab',
                'description' => 'Tanyakan apa saja kepada sesama alumni',
                'icon' => 'HelpCircle',
                'color' => '#f97316',
                'order' => 7,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            ForumCategory::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        $this->command->info('✅ 7 forum categories created successfully!');
    }
}
