<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case ALUMNI = 'alumni';

    /**
     * Get all available role values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get role label for display
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::ALUMNI => 'Alumni',
        };
    }

    /**
     * Check if role is admin
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role is alumni
     */
    public function isAlumni(): bool
    {
        return $this === self::ALUMNI;
    }
}
