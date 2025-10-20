<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\Gallery;
use App\Models\User;
use App\Notifications\GalleryStatusChangedNotification;
use App\Notifications\GallerySubmittedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        Notification::fake();
    }

    public function test_admin_receives_notification_when_alumni_submits_public_gallery(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => Role::ADMIN]);
        $alumni = User::factory()->create(['role' => Role::ALUMNI]);

        // Act
        $this->actingAs($alumni);
        $response = $this->post('/alumni/gallery', [
            'title' => 'Test Public Gallery',
            'description' => 'Test Description',
            'type' => 'public',
            'batch' => '2020',
            'image' => UploadedFile::fake()->image('test.jpg'),
        ]);

        // Assert
        $response->assertRedirect('/alumni/gallery');

        Notification::assertSentTo(
            $admin,
            GallerySubmittedNotification::class,
            function ($notification, $channels) use ($alumni) {
                return $notification->uploader->id === $alumni->id
                    && $notification->gallery->title === 'Test Public Gallery';
            }
        );
    }

    public function test_admin_does_not_receive_notification_for_personal_gallery(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => Role::ADMIN]);
        $alumni = User::factory()->create(['role' => Role::ALUMNI]);

        // Act
        $this->actingAs($alumni);
        $response = $this->post('/alumni/gallery', [
            'title' => 'Test Personal Gallery',
            'description' => 'Test Description',
            'type' => 'personal',
            'image' => UploadedFile::fake()->image('test.jpg'),
        ]);

        // Assert
        $response->assertRedirect('/alumni/gallery');

        Notification::assertNotSentTo($admin, GallerySubmittedNotification::class);
    }

    public function test_alumni_receives_notification_when_gallery_is_approved(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => Role::ADMIN]);
        $alumni = User::factory()->create(['role' => Role::ALUMNI]);

        $gallery = Gallery::factory()->create([
            'user_id' => $alumni->id,
            'type' => 'public',
            'status' => 'pending',
        ]);

        // Act
        $this->actingAs($admin);
        $response = $this->post("/admin/galleries/{$gallery->id}/approve");

        // Assert
        $response->assertRedirect();

        Notification::assertSentTo(
            $alumni,
            GalleryStatusChangedNotification::class,
            function ($notification, $channels) use ($admin) {
                return $notification->status === 'approved'
                    && $notification->admin->id === $admin->id;
            }
        );
    }

    public function test_alumni_receives_notification_when_gallery_is_rejected(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => Role::ADMIN]);
        $alumni = User::factory()->create(['role' => Role::ALUMNI]);

        $gallery = Gallery::factory()->create([
            'user_id' => $alumni->id,
            'type' => 'public',
            'status' => 'pending',
        ]);

        // Act
        $this->actingAs($admin);
        $response = $this->post("/admin/galleries/{$gallery->id}/reject", [
            'rejection_reason' => 'Image quality is too low',
        ]);

        // Assert
        $response->assertRedirect();

        Notification::assertSentTo(
            $alumni,
            GalleryStatusChangedNotification::class,
            function ($notification, $channels) use ($admin) {
                return $notification->status === 'rejected'
                    && $notification->admin->id === $admin->id
                    && $notification->rejectionReason === 'Image quality is too low';
            }
        );
    }

    public function test_multiple_admins_receive_notification_for_public_gallery(): void
    {
        // Arrange
        $admin1 = User::factory()->create(['role' => Role::ADMIN]);
        $admin2 = User::factory()->create(['role' => Role::ADMIN]);
        $alumni = User::factory()->create(['role' => Role::ALUMNI]);

        // Act
        $this->actingAs($alumni);
        $response = $this->post('/alumni/gallery', [
            'title' => 'Test Public Gallery',
            'description' => 'Test Description',
            'type' => 'public',
            'batch' => '2020',
            'image' => UploadedFile::fake()->image('test.jpg'),
        ]);

        // Assert
        $response->assertRedirect('/alumni/gallery');

        Notification::assertSentTo($admin1, GallerySubmittedNotification::class);
        Notification::assertSentTo($admin2, GallerySubmittedNotification::class);
    }
}
