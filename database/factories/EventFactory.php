<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->address(),
            'image' => null,
            'event_date' => now()->addDays(rand(7, 30)),
            'registration_deadline' => now()->addDays(rand(1, 6)),
            'max_participants' => rand(20, 100),
            'is_published' => true,
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the event is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }

    /**
     * Indicate that the event is in the past.
     */
    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_date' => now()->subDays(rand(1, 30)),
            'registration_deadline' => now()->subDays(rand(31, 60)),
        ]);
    }

    /**
     * Indicate that the event is upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_date' => now()->addDays(rand(7, 30)),
            'registration_deadline' => now()->addDays(rand(1, 6)),
        ]);
    }

    /**
     * Indicate that the event has limited participants.
     */
    public function limited(int $max = 10): static
    {
        return $this->state(fn (array $attributes) => [
            'max_participants' => $max,
        ]);
    }
}
