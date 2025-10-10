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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    MapPinIcon,
    UsersIcon,
} from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    image?: string;
    event_date: string;
    registration_deadline: string;
    max_participants?: number;
    is_published: boolean;
}

interface Registration {
    id: number;
    user_id: number;
    status: 'registered' | 'attended' | 'cancelled';
    registered_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        angkatan?: number;
        profesi?: string;
        profile_picture_url: string;
    };
}

interface Props {
    event: Event;
    registrations: Registration[];
}

export default function EventRegistrations({ event, registrations }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard Admin', href: '/admin/dashboard' },
        { title: 'Manajemen Event', href: '/admin/events' },
        { title: event.title, href: `/admin/events/${event.id}/registrations` },
    ];

    // Count registrations by status
    const registeredCount = registrations.filter(
        (r) => r.status === 'registered',
    ).length;
    const attendedCount = registrations.filter(
        (r) => r.status === 'attended',
    ).length;
    const cancelledCount = registrations.filter(
        (r) => r.status === 'cancelled',
    ).length;

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handle status change
    const handleStatusChange = (
        registrationId: number,
        userId: number,
        newStatus: string,
    ) => {
        router.patch(
            `/admin/events/${event.id}/registrations/${userId}`,
            { status: newStatus },
            {
                preserveScroll: true,
            },
        );
    };

    // Get badge variant for status
    const getStatusBadgeVariant = (
        status: string,
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'registered':
                return 'default';
            case 'attended':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // Get status label
    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'registered':
                return 'Terdaftar';
            case 'attended':
                return 'Hadir';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pendaftar - ${event.title}`} />

            <div className="container mx-auto space-y-8 py-8">
                {/* Back Button */}
                <Button variant="ghost" asChild>
                    <a href="/admin/events">
                        <Icon
                            iconNode={ArrowLeftIcon}
                            className="mr-2 h-4 w-4"
                        />
                        Kembali ke Daftar Event
                    </a>
                </Button>

                {/* Event Info */}
                <Card>
                    {event.image && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl">
                                    {event.title}
                                </CardTitle>
                                <CardDescription>
                                    {event.description}
                                </CardDescription>
                            </div>
                            <Badge
                                variant={
                                    event.is_published ? 'default' : 'secondary'
                                }
                            >
                                {event.is_published ? 'Published' : 'Draft'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Icon
                                    iconNode={CalendarIcon}
                                    className="h-4 w-4 text-muted-foreground"
                                />
                                <span>{formatDate(event.event_date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Icon
                                    iconNode={MapPinIcon}
                                    className="h-4 w-4 text-muted-foreground"
                                />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Icon
                                    iconNode={UsersIcon}
                                    className="h-4 w-4 text-muted-foreground"
                                />
                                <span>
                                    {registrations.length} pendaftar
                                    {event.max_participants &&
                                        ` / ${event.max_participants} max`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Icon
                                    iconNode={CalendarIcon}
                                    className="h-4 w-4 text-muted-foreground"
                                />
                                <span>
                                    Batas:{' '}
                                    {formatDate(event.registration_deadline)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">
                                Terdaftar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {registeredCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">
                                Hadir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {attendedCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">
                                Dibatalkan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {cancelledCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Registrations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pendaftar</CardTitle>
                        <CardDescription>
                            Kelola status kehadiran peserta event
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {registrations.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">
                                        Belum ada pendaftar
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Event ini belum memiliki pendaftar
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">
                                                Foto
                                            </TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Angkatan</TableHead>
                                            <TableHead>Profesi</TableHead>
                                            <TableHead>Tgl Daftar</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {registrations.map((registration) => (
                                            <TableRow key={registration.id}>
                                                <TableCell>
                                                    <img
                                                        src={
                                                            registration.user
                                                                .profile_picture_url
                                                        }
                                                        alt={
                                                            registration.user
                                                                .name
                                                        }
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {registration.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {registration.user.email}
                                                </TableCell>
                                                <TableCell>
                                                    {registration.user
                                                        .angkatan || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {registration.user
                                                        .profesi || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        registration.registered_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={
                                                            registration.status
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleStatusChange(
                                                                registration.id,
                                                                registration.user_id,
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue>
                                                                <Badge
                                                                    variant={getStatusBadgeVariant(
                                                                        registration.status,
                                                                    )}
                                                                >
                                                                    {getStatusLabel(
                                                                        registration.status,
                                                                    )}
                                                                </Badge>
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="registered">
                                                                Terdaftar
                                                            </SelectItem>
                                                            <SelectItem value="attended">
                                                                Hadir
                                                            </SelectItem>
                                                            <SelectItem value="cancelled">
                                                                Dibatalkan
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
