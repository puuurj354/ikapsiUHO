<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ForumCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the discussions for the category.
     */
    public function discussions(): HasMany
    {
        return $this->hasMany(ForumDiscussion::class);
    }

    /**
     * Get active discussions count.
     */
    public function getActiveDiscussionsCountAttribute(): int
    {
        return $this->discussions()->count();
    }
}
