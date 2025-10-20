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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    Mail,
    Trash2,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    angkatan: string | null;
    email: string;
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

export default function AdminGalleryShow({ gallery }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '#' },
        { title: 'Manajemen Galeri', href: '/admin/gallery' },
        { title: 'Detail Galeri', href: `/admin/gallery/${gallery.id}` },
    ];

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const rejectForm = useForm({
        reason: '',
    });

    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui galeri ini?')) {
            router.post(
                `/admin/gallery/${gallery.id}/approve`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.visit(`/admin/gallery/${gallery.id}`);
                    },
                },
            );
        }
    };

    const submitReject = () => {
        rejectForm.post(`/admin/gallery/${gallery.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRejectDialogOpen(false);
                rejectForm.reset();
                router.visit(`/admin/gallery/${gallery.id}`);
            },
        });
    };

    const handleDelete = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus galeri "${gallery.title}"? Aksi ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(`/admin/gallery/${gallery.id}`, {
                onSuccess: () => {
                    router.visit('/admin/gallery');
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
            <Head title={`Detail Galeri - ${gallery.title}`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/admin/gallery')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Galeri
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Informasi lengkap tentang galeri
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {gallery.type === 'public' &&
                        gallery.status === 'pending' && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => setIsRejectDialogOpen(true)}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleApprove}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Setujui
                                </Button>
                            </div>
                        )}
                </div>

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
                                        {getStatusBadge(gallery.status)}
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

                                {gallery.status === 'rejected' &&
                                    gallery.rejection_reason && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                            <p className="mb-2 text-sm font-medium text-red-900">
                                                Alasan Penolakan:
                                            </p>
                                            <p className="text-sm text-red-800">
                                                {gallery.rejection_reason}
                                            </p>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pembuat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span className="truncate">
                                                {gallery.user.email}
                                            </span>
                                        </div>
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

                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>
                                    Aksi berbahaya yang tidak dapat dibatalkan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Galeri
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Galeri</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk galeri "
                            {gallery.title}"
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Alasan Penolakan{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="Contoh: Foto tidak relevan dengan tema galeri alumni..."
                                value={rejectForm.data.reason}
                                onChange={(e) =>
                                    rejectForm.setData('reason', e.target.value)
                                }
                                rows={4}
                                className={
                                    rejectForm.errors.reason
                                        ? 'border-destructive'
                                        : ''
                                }
                            />
                            {rejectForm.errors.reason && (
                                <p className="text-sm text-destructive">
                                    {rejectForm.errors.reason}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false);
                                rejectForm.reset();
                            }}
                            disabled={rejectForm.processing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={submitReject}
                            disabled={
                                rejectForm.processing || !rejectForm.data.reason
                            }
                        >
                            {rejectForm.processing
                                ? 'Memproses...'
                                : 'Tolak Galeri'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
