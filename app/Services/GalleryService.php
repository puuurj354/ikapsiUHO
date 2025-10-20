<?php

namespace App\Services;

use App\Enums\Role;
use App\Models\Gallery;
use App\Models\User;
use App\Notifications\GalleryStatusChangedNotification;
use App\Notifications\GallerySubmittedNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryService
{
    /**
     * Get paginated galleries for alumni dashboard
     */
    public function getAlumniGalleries(int $perPage = 12, array $filters = [])
    {
        $query = Gallery::where('user_id', Auth::id())
            ->whereHas('user') // Ensure the user exists
            ->with(['user:id,name,angkatan,profile_picture'])
            ->withTrashed();

        // Apply filters
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get paginated galleries for admin dashboard
     */
    public function getAdminGalleries(int $perPage = 12, array $filters = [])
    {
        $query = Gallery::whereHas('user') // Ensure the user exists
            ->with(['user:id,name,angkatan,email,profile_picture', 'approvedBy:id,name'])
            ->withTrashed();

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['batch'])) {
            $query->where('batch', $filters['batch']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                    ->orWhereHas('user', function ($userQuery) use ($filters) {
                        $userQuery->where('name', 'like', '%' . $filters['search'] . '%');
                    });
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get public approved galleries
     */
    public function getPublicGalleries(int $perPage = 12, array $filters = [])
    {
        $query = Gallery::publicType()
            ->approved()
            ->whereHas('user') // Ensure the user exists
            ->with(['user:id,name,angkatan,profile_picture']);

        // Apply filters
        if (!empty($filters['batch'])) {
            $query->where('batch', $filters['batch']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get available batches for filtering
     */
    public function getAvailableBatches(): array
    {
        return Gallery::whereNotNull('batch')
            ->distinct()
            ->orderBy('batch', 'desc')
            ->pluck('batch')
            ->toArray();
    }

    /**
     * Create a new gallery
     */
    public function createGallery(array $data, UploadedFile $image): Gallery
    {
        // Store the image
        $imagePath = $this->storeImage($image);

        // Create gallery
        $gallery = Gallery::create([
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'batch' => $data['batch'] ?? null,
            'type' => $data['type'] ?? 'personal',
            'status' => $data['type'] === 'public' ? 'pending' : 'approved',
            'image_path' => $imagePath,
        ]);

        // If personal type, auto-approve
        if ($gallery->isPersonal()) {
            $gallery->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);
        } else {
            // If public type, notify all admins
            $admins = User::where('role', Role::ADMIN)->get();
            $uploader = Auth::user();

            foreach ($admins as $admin) {
                $admin->notify(new GallerySubmittedNotification($gallery, $uploader));
            }
        }

        return $gallery;
    }

    /**
     * Update an existing gallery
     */
    public function updateGallery(Gallery $gallery, array $data, ?UploadedFile $image = null): Gallery
    {
        // If image is updated
        if ($image) {
            // Delete old image
            $this->deleteImage($gallery->image_path);

            // Store new image
            $data['image_path'] = $this->storeImage($image);
        }

        // If changing from personal to public, reset status to pending
        if (
            $gallery->type === 'personal' &&
            isset($data['type']) &&
            $data['type'] === 'public'
        ) {
            $data['status'] = 'pending';
            $data['approved_at'] = null;
            $data['approved_by'] = null;
        }

        $gallery->update($data);

        return $gallery->fresh();
    }

    /**
     * Delete a gallery
     */
    public function deleteGallery(Gallery $gallery): bool
    {
        // Delete the image file
        $this->deleteImage($gallery->image_path);

        // Delete the gallery
        return $gallery->delete();
    }

    /**
     * Approve a gallery
     */
    public function approveGallery(Gallery $gallery): Gallery
    {
        $gallery->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
            'rejection_reason' => null,
        ]);

        // Notify the gallery owner
        $admin = Auth::user();
        $gallery->user->notify(
            new GalleryStatusChangedNotification($gallery, $admin, 'approved')
        );

        return $gallery->fresh();
    }

    /**
     * Reject a gallery
     */
    public function rejectGallery(Gallery $gallery, string $reason): Gallery
    {
        $gallery->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        // Notify the gallery owner
        $admin = Auth::user();
        $gallery->user->notify(
            new GalleryStatusChangedNotification($gallery, $admin, 'rejected', $reason)
        );

        return $gallery->fresh();
    }

    /**
     * Get gallery statistics for admin
     */
    public function getStatistics(): array
    {
        return [
            'total' => Gallery::count(),
            'pending' => Gallery::pending()->count(),
            'approved' => Gallery::approved()->count(),
            'rejected' => Gallery::rejected()->count(),
            'public' => Gallery::publicType()->count(),
            'personal' => Gallery::personalType()->count(),
            'by_batch' => Gallery::publicType()
                ->approved()
                ->whereNotNull('batch')
                ->selectRaw('batch, COUNT(*) as total')
                ->groupBy('batch')
                ->orderBy('batch', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($item) => [
                    'batch' => $item->batch,
                    'total' => $item->total,
                ]),
        ];
    }

    /**
     * Store uploaded image
     */
    private function storeImage(UploadedFile $image): string
    {
        $filename = Str::random(40) . '.' . $image->getClientOriginalExtension();
        return $image->storeAs('galleries', $filename, 'public');
    }

    /**
     * Delete image from storage
     */
    private function deleteImage(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Increment gallery views
     */
    public function incrementViews(Gallery $gallery): void
    {
        $gallery->incrementViews();
    }
}
