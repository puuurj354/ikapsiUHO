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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    Pencil,
    Trash2,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    angkatan: string | null;
    profile_picture?: string | null;
}

interface Gallery {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
    batch: string | null;
    type: 'personal' | 'public';
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    views_count: number;
    created_at: string;
    approved_at: string | null;
    user: User;
    approved_by?: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    gallery: Gallery;
}

export default function AlumniGalleryShow({ gallery }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Galeri Saya', href: '/gallery' },
        { title: 'Detail Galeri', href: `/gallery/${gallery.id}` },
    ];

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleDelete = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus galeri "${gallery.title}"? Aksi ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(`/gallery/${gallery.id}`, {
                onSuccess: () => {
                    router.visit('/gallery');
                },
            });
        }
    };

    const getStatusBadge = (status: Gallery['status']) => {
        const statusConfig = {
            pending: {
                label: 'Menunggu Persetujuan',
                variant: 'secondary' as const,
                icon: Clock,
                className: 'bg-yellow-100 text-yellow-800',
            },
            approved: {
                label: 'Disetujui',
                variant: 'default' as const,
                icon: CheckCircle2,
                className: 'bg-green-100 text-green-800',
            },
            rejected: {
                label: 'Ditolak',
                variant: 'destructive' as const,
                icon: XCircle,
                className: 'bg-red-100 text-red-800',
            },
        };

        const config = statusConfig[status];
        const StatusIcon = config.icon;

        return (
            <Badge className={config.className}>
                <StatusIcon className="mr-1 h-4 w-4" />
                {config.label}
            </Badge>
        );
    };

    const getTypeBadge = (type: Gallery['type']) => {
        const typeConfig = {
            personal: {
                label: 'Galeri Pribadi',
                className: 'bg-blue-100 text-blue-800',
            },
            public: {
                label: 'Galeri Publik',
                className: 'bg-purple-100 text-purple-800',
            },
        };

        const config = typeConfig[type];
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail - ${gallery.title}`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/gallery')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Galeri
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Informasi lengkap tentang galeri Anda
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.visit(`/gallery/${gallery.id}/edit`)
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Status Alert */}
                {gallery.type === 'public' && gallery.status === 'pending' && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <div className="flex gap-3">
                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-900">
                                    Menunggu Persetujuan
                                </h3>
                                <p className="text-sm text-yellow-800">
                                    Galeri Anda sedang ditinjau oleh admin. Anda
                                    akan menerima notifikasi ketika galeri
                                    disetujui atau ditolak.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {gallery.status === 'rejected' && gallery.rejection_reason && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-900">
                                    Galeri Ditolak
                                </h3>
                                <p className="mt-1 text-sm text-red-800">
                                    <span className="font-medium">
                                        Alasan Penolakan:
                                    </span>{' '}
                                    {gallery.rejection_reason}
                                </p>
                                <p className="mt-2 text-sm text-red-800">
                                    Anda dapat mengedit dan mengunggah ulang
                                    galeri ini.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Image Preview */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <div
                                    className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-muted"
                                    onClick={() => setIsImageModalOpen(true)}
                                >
                                    <img
                                        src={gallery.image_url}
                                        alt={gallery.title}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                                        <div className="rounded-full bg-white/90 p-4">
                                            <Eye className="h-6 w-6 text-gray-900" />
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-center text-sm text-muted-foreground">
                                    Klik gambar untuk melihat ukuran penuh
                                </p>
                            </CardContent>
                        </Card>

                        {/* Gallery Information */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Informasi Galeri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        {gallery.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {getTypeBadge(gallery.type)}
                                        {gallery.type === 'public' &&
                                            getStatusBadge(gallery.status)}
                                    </div>
                                </div>

                                {gallery.description && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Deskripsi
                                        </p>
                                        <p className="mt-1 text-sm whitespace-pre-wrap">
                                            {gallery.description}
                                        </p>
                                    </div>
                                )}

                                {gallery.batch && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Angkatan
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {gallery.batch}
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Jumlah Dilihat
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {gallery.views_count} kali
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Tanggal Unggah
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {formatDate(gallery.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {gallery.approved_at && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Tanggal Disetujui
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">
                                                {formatDate(
                                                    gallery.approved_at,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aksi Cepat</CardTitle>
                                <CardDescription>
                                    Kelola galeri Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(
                                            `/gallery/${gallery.id}/edit`,
                                        )
                                    }
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Galeri
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Galeri
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Owner Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pembuat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        {gallery.user.profile_picture ? (
                                            <img
                                                src={
                                                    gallery.user.profile_picture
                                                }
                                                alt={gallery.user.name}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {gallery.user.name}
                                        </p>
                                        {gallery.user.angkatan && (
                                            <p className="text-sm text-muted-foreground">
                                                Angkatan {gallery.user.angkatan}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Approval Information */}
                        {gallery.approved_by && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Disetujui Oleh</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="font-medium">
                                            {gallery.approved_by.name}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Help Card */}
                        {gallery.type === 'public' &&
                            gallery.status === 'pending' && (
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                            <div>
                                                <h3 className="mb-1 font-semibold text-blue-900">
                                                    Proses Review
                                                </h3>
                                                <p className="text-sm text-blue-800">
                                                    Galeri publik Anda sedang
                                                    ditinjau oleh admin. Proses
                                                    ini biasanya memakan waktu
                                                    1-2 hari kerja.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>{gallery.title}</DialogTitle>
                        {gallery.description && (
                            <DialogDescription>
                                {gallery.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="relative aspect-auto max-h-[80vh] w-full overflow-hidden rounded-lg bg-muted">
                        <img
                            src={gallery.image_url}
                            alt={gallery.title}
                            className="h-full w-full object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
