<?php

namespace App\Observers;

use App\Models\ForumCategory;
use Illuminate\Support\Str;

class ForumCategoryObserver
{
    /**
     * Handle the ForumCategory "creating" event.
     */
    public function creating(ForumCategory $category): void
    {
        if (empty($category->slug)) {
            $category->slug = Str::slug($category->name);

            // Ensure slug is unique by appending number if needed
            $originalSlug = $category->slug;
            $counter = 1;

            while (ForumCategory::where('slug', $category->slug)->exists()) {
                $category->slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        }
    }

    /**
     * Handle the ForumCategory "updating" event.
     */
    public function updating(ForumCategory $category): void
    {
        if ($category->isDirty('name') && empty($category->slug)) {
            $category->slug = Str::slug($category->name);

            // Ensure slug is unique by appending number if needed
            $originalSlug = $category->slug;
            $counter = 1;

            while (ForumCategory::where('slug', $category->slug)
                ->where('id', '!=', $category->id)
                ->exists()) {
                $category->slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        }
    }
}
