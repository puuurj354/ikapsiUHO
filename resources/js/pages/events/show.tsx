import { Icon } from '@/components/icon';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    MapPinIcon,
    UsersIcon,
    XCircleIcon,
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

interface Props {
    event: Event;
}

export default function EventShow({ event }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Event & Kegiatan', href: '/events' },
        { title: event.title, href: `/events/${event.id}` },
    ];

    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
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

    // Check if event is upcoming
    const isUpcoming = new Date(event.event_date) > new Date();

    // Handle registration
    const handleRegister = () => {
        setIsProcessing(true);
        router.post(
            `/events/${event.id}/register`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                    setIsRegisterDialogOpen(false);
                },
            },
        );
    };

    // Handle cancel registration
    const handleCancelRegistration = () => {
        setIsProcessing(true);
        router.post(
            `/events/${event.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                    setIsCancelDialogOpen(false);
                },
            },
        );
    };

    // Determine button state
    const canRegister =
        isUpcoming &&
        !event.is_registered &&
        !event.is_full &&
        event.is_registration_open;
    const canCancel = isUpcoming && event.is_registered;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event.title} />

            <div className="container mx-auto space-y-8 py-8">
                {/* Back Button */}
                <Button variant="ghost" asChild>
                    <a href="/events">
                        <Icon
                            iconNode={ArrowLeftIcon}
                            className="mr-2 h-4 w-4"
                        />
                        Kembali ke Daftar Event
                    </a>
                </Button>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Event Image */}
                        {event.image && (
                            <div className="overflow-hidden rounded-lg">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Event Info */}
                        <div>
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                {event.is_registered && (
                                    <Badge className="gap-1">
                                        <Icon
                                            iconNode={CheckCircleIcon}
                                            className="h-3 w-3"
                                        />
                                        Anda Terdaftar
                                    </Badge>
                                )}
                                {event.is_full && (
                                    <Badge variant="destructive">
                                        Kuota Penuh
                                    </Badge>
                                )}
                                {!event.is_registration_open && isUpcoming && (
                                    <Badge variant="secondary">
                                        Pendaftaran Ditutup
                                    </Badge>
                                )}
                                {!isUpcoming && (
                                    <Badge variant="outline">
                                        Event Selesai
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight">
                                {event.title}
                            </h1>

                            <div className="mt-6 space-y-2 text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <Icon
                                        iconNode={CalendarIcon}
                                        className="h-5 w-5"
                                    />
                                    <span className="text-base">
                                        {formatDate(event.event_date)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon
                                        iconNode={ClockIcon}
                                        className="h-5 w-5"
                                    />
                                    <span className="text-base">
                                        {formatTime(event.event_date)} WIT
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon
                                        iconNode={MapPinIcon}
                                        className="h-5 w-5"
                                    />
                                    <span className="text-base">
                                        {event.location}
                                    </span>
                                </div>
                                {event.max_participants && (
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            iconNode={UsersIcon}
                                            className="h-5 w-5"
                                        />
                                        <span className="text-base">
                                            {event.registrations_count} /{' '}
                                            {event.max_participants} peserta
                                            terdaftar
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tentang Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line text-muted-foreground">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pendaftaran</CardTitle>
                                <CardDescription>
                                    {event.is_registered
                                        ? 'Anda telah terdaftar untuk event ini'
                                        : 'Daftar untuk mengikuti event'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Registration Deadline */}
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-sm font-medium">
                                        Batas Pendaftaran
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatDate(
                                            event.registration_deadline,
                                        )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatTime(
                                            event.registration_deadline,
                                        )}{' '}
                                        WIT
                                    </p>
                                </div>

                                {/* Capacity Info */}
                                {event.max_participants && (
                                    <div className="rounded-lg border bg-muted/50 p-4">
                                        <p className="text-sm font-medium">
                                            Kapasitas
                                        </p>
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Terdaftar
                                                </span>
                                                <span className="font-semibold">
                                                    {event.registrations_count}{' '}
                                                    / {event.max_participants}
                                                </span>
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{
                                                        width: `${Math.min((event.registrations_count / event.max_participants) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    {canRegister && (
                                        <Button
                                            className="w-full"
                                            onClick={() =>
                                                setIsRegisterDialogOpen(true)
                                            }
                                        >
                                            Daftar Event Ini
                                        </Button>
                                    )}

                                    {canCancel && (
                                        <Button
                                            className="w-full"
                                            variant="destructive"
                                            onClick={() =>
                                                setIsCancelDialogOpen(true)
                                            }
                                        >
                                            <Icon
                                                iconNode={XCircleIcon}
                                                className="mr-2 h-4 w-4"
                                            />
                                            Batalkan Pendaftaran
                                        </Button>
                                    )}

                                    {!isUpcoming && (
                                        <Button className="w-full" disabled>
                                            Event Telah Selesai
                                        </Button>
                                    )}

                                    {isUpcoming &&
                                        !event.is_registered &&
                                        event.is_full && (
                                            <Button className="w-full" disabled>
                                                Kuota Penuh
                                            </Button>
                                        )}

                                    {isUpcoming &&
                                        !event.is_registered &&
                                        !event.is_full &&
                                        !event.is_registration_open && (
                                            <Button className="w-full" disabled>
                                                Pendaftaran Ditutup
                                            </Button>
                                        )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Tambahan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">
                                        Syarat & Ketentuan:
                                    </p>
                                    <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                                        <li>Alumni Psikologi UHO</li>
                                        <li>Harap datang tepat waktu</li>
                                        <li>Mengikuti protokol kesehatan</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-medium">Kontak:</p>
                                    <p className="mt-1 text-muted-foreground">
                                        Hubungi panitia jika ada pertanyaan
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Register Confirmation Dialog */}
            <AlertDialog
                open={isRegisterDialogOpen}
                onOpenChange={setIsRegisterDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Konfirmasi Pendaftaran
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mendaftar untuk event{' '}
                            <strong>{event.title}</strong>?
                            <br />
                            <br />
                            Anda akan menerima konfirmasi melalui email setelah
                            mendaftar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRegister}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Memproses...' : 'Ya, Daftar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Registration Dialog */}
            <AlertDialog
                open={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Batalkan Pendaftaran
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin membatalkan pendaftaran
                            untuk event <strong>{event.title}</strong>?
                            <br />
                            <br />
                            Anda dapat mendaftar kembali jika kuota masih
                            tersedia.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>
                            Tidak
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelRegistration}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isProcessing ? 'Memproses...' : 'Ya, Batalkan'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
