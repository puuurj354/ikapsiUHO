import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function NotificationBellSimple() {
    console.log('🔔 NotificationBellSimple is rendering!');

    return (
        <Button
            variant="ghost"
            size="icon"
            className="group relative h-9 w-9 bg-green-500"
            onClick={() => {
                console.log('Bell clicked!');
                alert('Bell icon clicked! This proves component is working.');
            }}
        >
            <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
            </span>
        </Button>
    );
}
