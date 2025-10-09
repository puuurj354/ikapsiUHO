import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { appearance, updateAppearance } = useAppearance();

    const handleToggleTheme = () => {
        const newTheme = appearance === 'dark' ? 'light' : 'dark';
        updateAppearance(newTheme);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleTheme}
            className={`h-9 w-9 rounded-md ${className}`}
            aria-label="Toggle theme"
        >
            {appearance === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </Button>
    );
}
