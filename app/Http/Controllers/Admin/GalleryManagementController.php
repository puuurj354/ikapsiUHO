<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\GalleryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryManagementController extends Controller
{
    public function __construct(
        private GalleryService $galleryService
    ) {}

    /**
     * Display a listing of the galleries.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'status' => $request->input('status'),
            'type' => $request->input('type'),
            'batch' => $request->input('batch'),
            'search' => $request->input('search'),
        ];

        $galleries = $this->galleryService->getAdminGalleries(12, $filters);
        $statistics = $this->galleryService->getStatistics();
        $batches = $this->galleryService->getAvailableBatches();

        return Inertia::render('admin/gallery/index', [
            'galleries' => $galleries,
            'statistics' => $statistics,
            'batches' => $batches,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified gallery.
     */
    public function show(Gallery $gallery): Response
    {
        $gallery->load(['user:id,name,angkatan,email,profile_picture', 'approvedBy:id,name']);

        return Inertia::render('admin/gallery/show', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Approve the specified gallery.
     */
    public function approve(Gallery $gallery): RedirectResponse
    {
        $this->galleryService->approveGallery($gallery);

        return redirect()
            ->back()
            ->with('success', 'Galeri berhasil disetujui');
    }

    /**
     * Reject the specified gallery.
     */
    public function reject(Request $request, Gallery $gallery): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $this->galleryService->rejectGallery($gallery, $request->input('reason'));

        return redirect()
            ->back()
            ->with('success', 'Galeri ditolak');
    }

    /**
     * Remove the specified gallery from storage.
     */
    public function destroy(Gallery $gallery): RedirectResponse
    {
        $this->galleryService->deleteGallery($gallery);

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Galeri berhasil dihapus');
    }

    /**
     * Restore the specified gallery from trash.
     */
    public function restore(int $id): RedirectResponse
    {
        $gallery = Gallery::withTrashed()->findOrFail($id);
        $gallery->restore();

        return redirect()
            ->back()
            ->with('success', 'Galeri berhasil dipulihkan');
    }
}
