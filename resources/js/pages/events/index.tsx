import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    SearchIcon,
    UsersIcon,
} from 'lucide-react';
import { useState } from 'react';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    image?: string;
    event_date: string;
    registration_deadline: string;
    max_participants?: number;
    registrations_count: number;
    is_registered: boolean;
    is_full: boolean;
    is_registration_open: boolean;
}

interface PaginatedEvents {
    data: Event[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    events: PaginatedEvents;
    filters: {
        search?: string;
        time?: string;
    };
}

export default function EventsIndex({ events, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Event & Kegiatan', href: '/events' },
    ];

    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [timeFilter, setTimeFilter] = useState(filters.time || 'all');

    // Handle search
    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.get(
            '/events',
            {
                search: value,
                time: timeFilter !== 'all' ? timeFilter : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setTimeFilter(value);
        router.get(
            '/events',
            {
                search: searchValue,
                time: value !== 'all' ? value : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Format time for display
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Check if event is upcoming or past
    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Event & Kegiatan" />

            <div className="container mx-auto space-y-8 py-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Event & Kegiatan
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Ikuti berbagai event dan kegiatan alumni IKAPSI UHO
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari event..."
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Select
                        value={timeFilter}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Semua Event" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Event</SelectItem>
                            <SelectItem value="upcoming">
                                Event Mendatang
                            </SelectItem>
                            <SelectItem value="past">Event Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Events Grid */}
                {events.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <CalendarIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-xl font-semibold">
                                    Belum ada event
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    Event akan segera hadir. Pantau terus
                                    halaman ini!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.data.map((event) => (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg">
                                    {/* Event Image */}
                                    {event.image && (
                                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            {!isUpcoming(event.event_date) && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-sm"
                                                    >
                                                        Event Selesai
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <CardHeader className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="line-clamp-2 text-xl">
                                                {event.title}
                                            </CardTitle>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            {event.is_registered && (
                                                <Badge
                                                    variant="default"
                                                    className="text-xs"
                                                >
                                                    ✓ Terdaftar
                                                </Badge>
                                            )}
                                            {event.is_full && (
                                                <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                >
                                                    Penuh
                                                </Badge>
                                            )}
                                            {!event.is_registration_open &&
                                                isUpcoming(
                                                    event.event_date,
                                                ) && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        Pendaftaran Ditutup
                                                    </Badge>
                                                )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <CardDescription className="line-clamp-2">
                                            {event.description}
                                        </CardDescription>

                                        {/* Event Details */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Icon
                                                    iconNode={CalendarIcon}
                                                    className="h-4 w-4 shrink-0"
                                                />
                                                <span>
                                                    {formatDate(
                                                        event.event_date,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Icon
                                                    iconNode={ClockIcon}
                                                    className="h-4 w-4 shrink-0"
                                                />
                                                <span>
                                                    {formatTime(
                                                        event.event_date,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Icon
                                                    iconNode={MapPinIcon}
                                                    className="h-4 w-4 shrink-0"
                                                />
                                                <span className="line-clamp-1">
                                                    {event.location}
                                                </span>
                                            </div>
                                            {event.max_participants && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Icon
                                                        iconNode={UsersIcon}
                                                        className="h-4 w-4 shrink-0"
                                                    />
                                                    <span>
                                                        {
                                                            event.registrations_count
                                                        }{' '}
                                                        /{' '}
                                                        {event.max_participants}{' '}
                                                        peserta
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            className="w-full"
                                            variant={
                                                event.is_registered
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            disabled={
                                                !isUpcoming(event.event_date) ||
                                                (event.is_full &&
                                                    !event.is_registered) ||
                                                (!event.is_registration_open &&
                                                    !event.is_registered)
                                            }
                                        >
                                            {!isUpcoming(event.event_date)
                                                ? 'Event Selesai'
                                                : event.is_registered
                                                  ? 'Lihat Detail'
                                                  : event.is_full
                                                    ? 'Kuota Penuh'
                                                    : !event.is_registration_open
                                                      ? 'Pendaftaran Ditutup'
                                                      : 'Daftar Sekarang'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {events.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {events.data.length} dari {events.total}{' '}
                            event
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={events.current_page === 1}
                                onClick={() =>
                                    router.get(
                                        '/events',
                                        {
                                            page: events.current_page - 1,
                                            search: searchValue,
                                            time:
                                                timeFilter !== 'all'
                                                    ? timeFilter
                                                    : undefined,
                                        },
                                        { preserveState: true },
                                    )
                                }
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    events.current_page === events.last_page
                                }
                                onClick={() =>
                                    router.get(
                                        '/events',
                                        {
                                            page: events.current_page + 1,
                                            search: searchValue,
                                            time:
                                                timeFilter !== 'all'
                                                    ? timeFilter
                                                    : undefined,
                                        },
                                        { preserveState: true },
                                    )
                                }
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
