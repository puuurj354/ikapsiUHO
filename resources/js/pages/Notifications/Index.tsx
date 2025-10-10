import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Bell,
    Check,
    Heart,
    MessageSquare,
    Sparkles,
    Trash2,
    type LucideIcon,
} from 'lucide-react';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface NotificationsPagination {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    notifications: NotificationsPagination;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifikasi', href: '/notifications' },
];

const iconMap: Record<string, LucideIcon> = {
    MessageSquare,
    Heart,
    Sparkles,
};

export default function NotificationsIndex({ notifications }: Props) {
    const getIcon = (iconName: string) => {
        return iconMap[iconName] || Bell;
    };

    const formatTime = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    };

    const markAsRead = async (notificationId: string) => {
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

        router.reload({ only: ['notifications'] });
    };

    const markAllAsRead = async () => {
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

        router.reload({ only: ['notifications'] });
    };

    const deleteNotification = async (notificationId: string) => {
        if (confirm('Hapus notifikasi ini?')) {
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

            router.reload({ only: ['notifications'] });
        }
    };

    const deleteAll = async () => {
        if (confirm('Hapus semua notifikasi?')) {
            await fetch('/notifications', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            router.reload({ only: ['notifications'] });
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }
        router.visit(notification.data.action_url);
    };

    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi" />

            <div className="container mx-auto space-y-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Notifikasi
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {unreadCount > 0
                                ? `${unreadCount} notifikasi belum dibaca`
                                : 'Semua notifikasi sudah dibaca'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="flex-1 sm:flex-initial"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Tandai Semua Dibaca
                            </Button>
                        )}
                        {notifications.data.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={deleteAll}
                                className="flex-1 sm:flex-initial text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Semua
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {notifications.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                            <Bell className="mb-4 h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
                            <h3 className="text-lg sm:text-xl font-semibold">
                                Tidak ada notifikasi
                            </h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Notifikasi Anda akan muncul di sini
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {notifications.data.map((notification) => {
                            const IconComponent = getIcon(notification.data.icon);

                            return (
                                <Card
                                    key={notification.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        !notification.read_at
                                            ? 'border-l-4 border-l-blue-500 bg-blue-50/50'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                >
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div
                                                className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full ${
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
                                                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
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
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-sm sm:text-base font-semibold">
                                                        {notification.data.title}
                                                    </h3>
                                                    {!notification.read_at && (
                                                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500 mt-1"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-700">
                                                    {notification.data.message}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(notification.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2 flex-shrink-0">
                                                {!notification.read_at && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification.id);
                                                        }}
                                                    >
                                                        <Check className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(
                                                            notification.id
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        {notifications.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className="h-8 min-w-[2rem] px-2 text-xs sm:h-9 sm:min-w-[2.25rem] sm:px-3 sm:text-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
