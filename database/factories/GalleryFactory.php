<?php

namespace Database\Factories;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GalleryFactory extends Factory
{
    protected $model = Gallery::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'image_path' => 'galleries/test-image.jpg',
            'batch' => fake()->numberBetween(2015, 2024),
            'type' => 'public',
            'status' => 'pending',
            'views_count' => fake()->numberBetween(0, 1000),
        ];
    }

    public function personal(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'personal',
            'status' => 'approved',
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => User::factory(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
