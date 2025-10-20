<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGalleryRequest;
use App\Http\Requests\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Services\GalleryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __construct(
        private GalleryService $galleryService
    ) {}

    /**
     * Display a listing of the user's galleries.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'search' => $request->input('search'),
        ];

        $galleries = $this->galleryService->getAlumniGalleries(12, $filters);

        return Inertia::render('alumni/gallery/index', [
            'galleries' => $galleries,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new gallery.
     */
    public function create(): Response
    {
        return Inertia::render('alumni/gallery/create');
    }

    /**
     * Store a newly created gallery in storage.
     */
    public function store(StoreGalleryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $image = $request->file('image');

        $gallery = $this->galleryService->createGallery($validated, $image);

        $message = $gallery->isPublic()
            ? 'Galeri berhasil diunggah dan menunggu persetujuan admin'
            : 'Galeri pribadi berhasil diunggah';

        return redirect()
            ->route('gallery.index')
            ->with('success', $message);
    }

    /**
     * Display the specified gallery.
     */
    public function show(Gallery $gallery): Response
    {
        // Ensure user can only view their own gallery
        if ($gallery->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke galeri ini');
        }

        $gallery->load(['user:id,name,angkatan,profile_picture', 'approvedBy:id,name']);

        return Inertia::render('alumni/gallery/show', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Show the form for editing the specified gallery.
     */
    public function edit(Gallery $gallery): Response
    {
        // Ensure user can only edit their own gallery
        if ($gallery->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke galeri ini');
        }

        return Inertia::render('alumni/gallery/edit', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Update the specified gallery in storage.
     */
    public function update(UpdateGalleryRequest $request, Gallery $gallery): RedirectResponse
    {
        // Ensure user can only update their own gallery
        if ($gallery->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke galeri ini');
        }

        $validated = $request->validated();
        $image = $request->file('image');

        $this->galleryService->updateGallery($gallery, $validated, $image);

        return redirect()
            ->route('gallery.index')
            ->with('success', 'Galeri berhasil diperbarui');
    }

    /**
     * Remove the specified gallery from storage.
     */
    public function destroy(Gallery $gallery): RedirectResponse
    {
        // Ensure user can only delete their own gallery
        if ($gallery->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke galeri ini');
        }

        $this->galleryService->deleteGallery($gallery);

        return redirect()
            ->route('gallery.index')
            ->with('success', 'Galeri berhasil dihapus');
    }
}
