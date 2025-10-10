<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'is_published',
        'published_at',
        'article_category_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'views_count' => 'integer',
    ];

    protected $appends = [
        'featured_image_url',
        'reading_time',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
            if (empty($article->excerpt) && $article->content) {
                $article->excerpt = Str::limit(strip_tags($article->content), 160);
            }
        });

        static::updating(function ($article) {
            if ($article->isDirty('title') && empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
            if ($article->isDirty('content') && empty($article->excerpt)) {
                $article->excerpt = Str::limit(strip_tags($article->content), 160);
            }
        });
    }

    /**
     * Get the author of the article
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the category of the article
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class, 'article_category_id');
    }

    /**
     * Scope published articles
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope draft articles
     */
    public function scopeDraft($query)
    {
        return $query->where('is_published', false);
    }

    /**
     * Scope recent articles
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    /**
     * Scope popular articles
     */
    public function scopePopular($query)
    {
        return $query->orderBy('views_count', 'desc');
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        if ($categoryId) {
            return $query->where('article_category_id', $categoryId);
        }
        return $query;
    }

    /**
     * Scope search
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    /**
     * Get featured image URL
     */
    public function getFeaturedImageUrlAttribute(): string
    {
        if ($this->featured_image) {
            return asset('storage/' . $this->featured_image);
        }

        // Return default article image
        return asset('images/default-article.jpg');
    }

    /**
     * Get reading time in minutes
     */
    public function getReadingTimeAttribute(): int
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $minutes = ceil($wordCount / 200); // Average reading speed: 200 words/minute
        return max(1, $minutes);
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Check if article is owned by user
     */
    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    /**
     * Publish the article
     */
    public function publish(): void
    {
        $this->update([
            'is_published' => true,
            'published_at' => $this->published_at ?? now(),
        ]);
    }

    /**
     * Unpublish the article
     */
    public function unpublish(): void
    {
        $this->update([
            'is_published' => false,
        ]);
    }
}
