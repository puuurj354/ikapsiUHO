<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\ForumDiscussion;
use App\Models\ForumReply;
use App\Models\ForumReport;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users
        $regularUsers = User::where('role', Role::ALUMNI)->limit(3)->get();
        $adminUser = User::where('role', Role::ADMIN)->first();

        if ($regularUsers->isEmpty() || !$adminUser) {
            $this->command->warn('Tidak ada user yang tersedia untuk membuat laporan.');
            return;
        }

        // Get some discussions and replies
        $discussions = ForumDiscussion::limit(5)->get();
        $replies = ForumReply::limit(5)->get();

        if ($discussions->isEmpty() && $replies->isEmpty()) {
            $this->command->warn('Tidak ada diskusi atau balasan untuk dilaporkan.');
            return;
        }

        $reasons = ['spam', 'inappropriate', 'offensive', 'harassment', 'other'];
        $statuses = ['pending', 'reviewed', 'resolved', 'rejected'];

        // Create reports for discussions
        foreach ($discussions->take(3) as $index => $discussion) {
            $reporter = $regularUsers->random();
            $reason = $reasons[array_rand($reasons)];
            $status = $statuses[array_rand($statuses)];

            $report = ForumReport::create([
                'user_id' => $reporter->id,
                'reportable_type' => ForumDiscussion::class,
                'reportable_id' => $discussion->id,
                'reason' => $reason,
                'description' => $this->getDescriptionForReason($reason),
                'status' => $status,
            ]);

            // If reviewed, resolved, or rejected, add admin info
            if (in_array($status, ['reviewed', 'resolved', 'rejected'])) {
                $report->update([
                    'reviewed_by' => $adminUser->id,
                    'reviewed_at' => now()->subDays(rand(0, 7)),
                    'admin_notes' => $this->getAdminNotesForStatus($status),
                ]);
            }
        }

        // Create reports for replies
        foreach ($replies->take(2) as $index => $reply) {
            $reporter = $regularUsers->random();
            $reason = $reasons[array_rand($reasons)];
            $status = $index === 0 ? 'pending' : 'reviewed'; // Keep some pending

            $report = ForumReport::create([
                'user_id' => $reporter->id,
                'reportable_type' => ForumReply::class,
                'reportable_id' => $reply->id,
                'reason' => $reason,
                'description' => $this->getDescriptionForReason($reason),
                'status' => $status,
            ]);

            if ($status !== 'pending') {
                $report->update([
                    'reviewed_by' => $adminUser->id,
                    'reviewed_at' => now()->subDays(rand(0, 3)),
                    'admin_notes' => $this->getAdminNotesForStatus($status),
                ]);
            }
        }

        $this->command->info('Forum reports seeded successfully!');
    }

    private function getDescriptionForReason(string $reason): string
    {
        $descriptions = [
            'spam' => 'Konten ini sepertinya spam atau promosi yang tidak relevan dengan topik diskusi.',
            'inappropriate' => 'Konten ini tidak pantas dan tidak sesuai dengan komunitas kita.',
            'offensive' => 'Bahasa yang digunakan sangat kasar dan menyinggung.',
            'harassment' => 'Pengguna ini melakukan pelecehan terhadap anggota lain.',
            'other' => 'Ada masalah dengan konten ini yang perlu ditinjau oleh admin.',
        ];

        return $descriptions[$reason] ?? 'Laporan memerlukan tinjauan admin.';
    }

    private function getAdminNotesForStatus(string $status): string
    {
        $notes = [
            'reviewed' => 'Laporan sedang dalam peninjauan lebih lanjut.',
            'resolved' => 'Laporan telah ditindaklanjuti. Konten telah dimoderasi sesuai kebijakan komunitas.',
            'rejected' => 'Setelah ditinjau, konten ini tidak melanggar kebijakan komunitas. Laporan ditolak.',
        ];

        return $notes[$status] ?? '';
    }
}
