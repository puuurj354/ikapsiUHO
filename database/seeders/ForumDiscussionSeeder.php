<?php

namespace Database\Seeders;

use App\Models\ForumCategory;
use App\Models\ForumDiscussion;
use App\Models\User;
use Illuminate\Database\Seeder;

class ForumDiscussionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users and categories
        $users = User::where('role', 'alumni')->take(10)->get();
        $admin = User::where('role', 'admin')->first();
        $categories = ForumCategory::all();

        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('⚠️  No users or categories found. Please seed users and categories first.');

            return;
        }

        $discussions = [
            [
                'title' => 'Lowongan Psikolog di RS Bahteramas Kendari',
                'content' => "Halo teman-teman alumni! \n\nAda info lowongan untuk posisi Psikolog Klinis di RS Bahteramas Kendari. Persyaratan:\n- S1 Psikologi\n- Memiliki SIPP\n- Pengalaman min 1 tahun (diutamakan)\n\nYang berminat bisa hubungi HRD di nomor 0812-xxxx-xxxx atau kirim CV ke email: hrd@rsbahteramas.com\n\nSemoga bermanfaat!",
                'category_slug' => 'karir-pekerjaan',
                'is_pinned' => true,
            ],
            [
                'title' => 'Sharing Pengalaman Lulus SIPP',
                'content' => "Hai alumni! Saya baru saja lulus ujian SIPP dan ingin share pengalaman saya.\n\nBeberapa tips yang mungkin berguna:\n1. Ikuti bimbingan SIPP dari HIMPSI setempat\n2. Perbanyak latihan soal kasus\n3. Pahami kode etik psikologi dengan baik\n4. Practice membuat assessment report\n\nAda yang mau share pengalaman juga? Atau mungkin ada yang mau tanya-tanya?",
                'category_slug' => 'akademik',
                'is_pinned' => false,
            ],
            [
                'title' => 'Reuni Akbar Alumni Psikologi UHO 2025',
                'content' => "Pengumuman penting!\n\nKami akan mengadakan Reuni Akbar Alumni Psikologi UHO tahun 2025. \n\nTanggal: 15 Desember 2025\nTempat: Gedung Auditorium UHO\nAcara:\n- Gathering & Networking\n- Seminar Psikologi Terkini\n- Gala Dinner\n- Alumni Awards\n\nYuk daftar sekarang! Link pendaftaran akan segera dibagikan.\n\nKetua Panitia,\nIKAPSI UHO",
                'category_slug' => 'event-kegiatan',
                'is_pinned' => true,
                'is_admin' => true,
            ],
            [
                'title' => 'Tips Memulai Praktik Konseling Pribadi',
                'content' => "Halo teman-teman,\n\nSaya ingin bertanya kepada senior yang sudah berpraktik mandiri. Bagaimana cara memulai praktik konseling pribadi?\n\nBeberapa hal yang ingin saya tanyakan:\n- Perizinan apa saja yang diperlukan?\n- Modal awal yang dibutuhkan?\n- Strategi marketing untuk klien pertama?\n- Tips membangun kepercayaan klien?\n\nTerima kasih sebelumnya untuk yang sudah berkenan sharing!",
                'category_slug' => 'wirausaha',
                'is_pinned' => false,
            ],
            [
                'title' => 'Diskusi: Kesehatan Mental di Era Digital',
                'content' => "Teman-teman alumni, yuk kita diskusi tentang fenomena kesehatan mental di era digital ini.\n\nMenurut kalian:\n1. Bagaimana dampak media sosial terhadap kesehatan mental generasi muda?\n2. Apakah online counseling bisa seefektif face-to-face?\n3. Bagaimana peran psikolog dalam edukasi digital wellbeing?\n\nYuk share pendapat dan pengalaman kalian!",
                'category_slug' => 'umum',
                'is_pinned' => false,
            ],
            [
                'title' => 'Rekomendasi Buku Psikologi Terbaru',
                'content' => "Hai everyone!\n\nAda yang baru baca buku psikologi bagus? Yuk share di sini!\n\nSaya lagi baca 'Atomic Habits' by James Clear dan sangat recommended untuk yang tertarik dengan behavior change.\n\nAda rekomendasi lain? Boleh buku akademik atau populer science, semua boleh!\n\nDitunggu sharing-nya 📚",
                'category_slug' => 'akademik',
                'is_pinned' => false,
            ],
            [
                'title' => 'Bakti Sosial: Penyuluhan Kesehatan Mental di Sekolah',
                'content' => "Dear alumni,\n\nKami dari IKAPSI UHO akan mengadakan bakti sosial berupa penyuluhan kesehatan mental di beberapa sekolah di Kendari.\n\nWaktu: 20-21 Oktober 2025\nLokasi: SMA/SMK di Kendari\n\nKami butuh volunteer psikolog untuk jadi narasumber. Ada yang berminat?\n\nYang mau join silakan PM ya! Free sertifikat volunteer 😊",
                'category_slug' => 'sosial-komunitas',
                'is_pinned' => false,
            ],
            [
                'title' => 'Bagaimana Cara Menjaga Work-Life Balance sebagai Psikolog?',
                'content' => "Halo teman-teman,\n\nSebagai psikolog yang sering mendengarkan masalah orang lain, kadang kita sendiri struggle dengan work-life balance.\n\nBagaimana cara kalian:\n- Menghindari burnout?\n- Set boundaries dengan klien?\n- Menjaga kesehatan mental sendiri?\n- Balance antara pekerjaan dan kehidupan pribadi?\n\nShare tips and tricks kalian dong!",
                'category_slug' => 'tanya-jawab',
                'is_pinned' => false,
            ],
        ];

        foreach ($discussions as $index => $discussionData) {
            $category = ForumCategory::where('slug', $discussionData['category_slug'])->first();

            if (! $category) {
                continue;
            }

            // Use admin for pinned posts, random user for others
            $user = isset($discussionData['is_admin']) && $discussionData['is_admin']
                ? $admin
                : $users->random();

            ForumDiscussion::create([
                'user_id' => $user->id,
                'forum_category_id' => $category->id,
                'title' => $discussionData['title'],
                'content' => $discussionData['content'],
                'is_pinned' => $discussionData['is_pinned'] ?? false,
                'is_locked' => false,
            ]);
        }

        $this->command->info('✅ 8 sample forum discussions created successfully!');
    }
}
