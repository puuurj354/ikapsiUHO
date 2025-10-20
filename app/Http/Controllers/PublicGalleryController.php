<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicGalleryController extends Controller
{
    public function __construct(
        private GalleryService $galleryService
    ) {}

    /**
     * Display a listing of public galleries.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'batch' => $request->input('batch'),
            'search' => $request->input('search'),
        ];

        $galleries = $this->galleryService->getPublicGalleries(12, $filters);
        $batches = $this->galleryService->getAvailableBatches();

        return Inertia::render('gallery/index', [
            'galleries' => $galleries,
            'batches' => $batches,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified gallery.
     */
    public function show(Gallery $gallery): Response
    {
        // Only show public approved galleries
        if ($gallery->type !== 'public' || $gallery->status !== 'approved') {
            abort(404);
        }

        $gallery->load(['user:id,name,angkatan,profile_picture']);

        // Increment views
        $this->galleryService->incrementViews($gallery);

        return Inertia::render('gallery/show', [
            'gallery' => $gallery,
        ]);
    }
}
