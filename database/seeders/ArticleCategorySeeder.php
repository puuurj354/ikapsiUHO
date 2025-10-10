<?php

namespace Database\Seeders;

use App\Models\ArticleCategory;
use Illuminate\Database\Seeder;

class ArticleCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Psikologi Klinis',
                'description' => 'Artikel tentang psikologi klinis, terapi, dan kesehatan mental',
                'color' => '#ef4444',
                'order' => 1,
            ],
            [
                'name' => 'Psikologi Pendidikan',
                'description' => 'Artikel tentang psikologi dalam konteks pendidikan dan pembelajaran',
                'color' => '#3b82f6',
                'order' => 2,
            ],
            [
                'name' => 'Psikologi Industri & Organisasi',
                'description' => 'Artikel tentang psikologi di tempat kerja dan organisasi',
                'color' => '#10b981',
                'order' => 3,
            ],
            [
                'name' => 'Psikologi Sosial',
                'description' => 'Artikel tentang interaksi sosial dan perilaku kelompok',
                'color' => '#8b5cf6',
                'order' => 4,
            ],
            [
                'name' => 'Kesehatan Mental',
                'description' => 'Artikel tentang kesehatan mental dan well-being',
                'color' => '#06b6d4',
                'order' => 5,
            ],
            [
                'name' => 'Karir & Profesi',
                'description' => 'Tips karir dan pengembangan profesional di bidang psikologi',
                'color' => '#f59e0b',
                'order' => 6,
            ],
            [
                'name' => 'Penelitian & Jurnal',
                'description' => 'Hasil penelitian dan publikasi ilmiah',
                'color' => '#6366f1',
                'order' => 7,
            ],
            [
                'name' => 'Tips & Praktis',
                'description' => 'Tips praktis dan panduan sehari-hari',
                'color' => '#ec4899',
                'order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            ArticleCategory::create($category);
        }

        $this->command->info('✅ ' . count($categories) . ' article categories created successfully!');
    }
}
