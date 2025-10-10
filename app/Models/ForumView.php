<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumView extends Model
{
    protected $fillable = [
        'user_id',
        'discussion_id',
        'viewed_at',
    ];

    public $timestamps = false;

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function discussion(): BelongsTo
    {
        return $this->belongsTo(ForumDiscussion::class, 'discussion_id');
    }
}
