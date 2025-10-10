import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router } from '@inertiajs/react';
import {
    Bell,
    Check,
    Heart,
    MessageSquare,
    Sparkles,
    X,
    type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
    id: string;
    type: string;
    data: {
        type: string;
        title: string;
        message: string;
        action_url: string;
        icon: string;
    };
    read_at: string | null;
    created_at: string;
}

interface NotificationBellProps {
    className?: string;
}

const iconMap: Record<string, LucideIcon> = {
    MessageSquare,
    Heart,
    Sparkles,
};

export function NotificationBell({ className }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/notifications/unread');
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(`/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (
        notificationId: string,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        try {
            await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            if (!notifications.find((n) => n.id === notificationId)?.read_at) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }
        router.visit(notification.data.action_url);
        setIsOpen(false);
    };

    const getIcon = (iconName: string) => {
        return iconMap[iconName] || Bell;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
        }).format(date);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`relative ${className}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96">
                <div className="flex items-center justify-between p-3 pb-2">
                    <h3 className="font-semibold">Notifikasi</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-auto p-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                            <Check className="mr-1 h-3 w-3" />
                            Tandai Semua Dibaca
                        </Button>
                    )}
                </div>

                <DropdownMenuSeparator />

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="mb-3 h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-500">
                                Tidak ada notifikasi
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1 p-1">
                            {notifications.map((notification) => {
                                const IconComponent = getIcon(
                                    notification.data.icon
                                );

                                return (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={`cursor-pointer p-3 ${
                                            !notification.read_at
                                                ? 'bg-blue-50 hover:bg-blue-100'
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() =>
                                            handleNotificationClick(notification)
                                        }
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            <div
                                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                                    notification.data.type ===
                                                    'forum_reply'
                                                        ? 'bg-blue-100'
                                                        : notification.data.type ===
                                                            'forum_like'
                                                          ? 'bg-red-100'
                                                          : 'bg-purple-100'
                                                }`}
                                            >
                                                <IconComponent
                                                    className={`h-5 w-5 ${
                                                        notification.data.type ===
                                                        'forum_reply'
                                                            ? 'text-blue-600'
                                                            : notification.data.type ===
                                                                'forum_like'
                                                              ? 'text-red-600'
                                                              : 'text-purple-600'
                                                    }`}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <p className="text-sm font-medium leading-tight">
                                                    {notification.data.title}
                                                </p>
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {notification.data.message}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(notification.created_at)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 flex-shrink-0"
                                                onClick={(e) =>
                                                    deleteNotification(
                                                        notification.id,
                                                        e
                                                    )
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                <DropdownMenuSeparator />

                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={() => {
                            router.visit('/notifications');
                            setIsOpen(false);
                        }}
                    >
                        Lihat Semua Notifikasi
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
