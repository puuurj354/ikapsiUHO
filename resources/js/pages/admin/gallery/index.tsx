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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Eye,
    Image as ImageIcon,
    MoreVertical,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface User {
    id: number;
    name: string;
    angkatan: string | null;
    email: string;
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
    user: User;
    approved_by?: {
        id: number;
        name: string;
    } | null;
    deleted_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedGalleries {
    current_page: number;
    data: Gallery[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Statistics {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    public: number;
    personal: number;
}

interface Props {
    galleries: PaginatedGalleries;
    statistics: Statistics;
    batches: string[];
    filters: {
        status?: string;
        type?: string;
        batch?: string;
        search?: string;
    };
}

export default function AdminGalleryIndex({
    galleries,
    statistics,
    batches,
    filters,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '#' },
        { title: 'Manajemen Galeri', href: '/admin/gallery' },
    ];

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [batchFilter, setBatchFilter] = useState(filters.batch || 'all');

    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(
        null,
    );
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const rejectForm = useForm({
        reason: '',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(
            '/admin/gallery',
            {
                search: searchQuery || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                type: typeFilter !== 'all' ? typeFilter : undefined,
                batch: batchFilter !== 'all' ? batchFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleApprove = (galleryId: number) => {
        if (confirm('Apakah Anda yakin ingin menyetujui galeri ini?')) {
            router.post(
                `/admin/gallery/${galleryId}/approve`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleReject = (gallery: Gallery) => {
        setSelectedGallery(gallery);
        setIsRejectDialogOpen(true);
    };

    const submitReject = () => {
        if (selectedGallery) {
            rejectForm.post(`/admin/gallery/${selectedGallery.id}/reject`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRejectDialogOpen(false);
                    rejectForm.reset();
                    setSelectedGallery(null);
                },
            });
        }
    };

    const handleDelete = (galleryId: number, title: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus galeri "${title}"? Aksi ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(`/admin/gallery/${galleryId}`, {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status: Gallery['status']) => {
        const statusConfig = {
            pending: {
                label: 'Menunggu',
                variant: 'secondary' as const,
                icon: Clock,
            },
            approved: {
                label: 'Disetujui',
                variant: 'default' as const,
                icon: CheckCircle2,
            },
            rejected: {
                label: 'Ditolak',
                variant: 'destructive' as const,
                icon: XCircle,
            },
        };

        const config = statusConfig[status];
        const StatusIcon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <StatusIcon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const getTypeBadge = (type: Gallery['type']) => {
        const typeConfig = {
            personal: {
                label: 'Pribadi',
                className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
            },
            public: {
                label: 'Publik',
                className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
            },
        };

        const config = typeConfig[type];

        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Galeri" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Manajemen Galeri
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola dan setujui galeri yang diunggah alumni
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total
                                </p>
                                <p className="text-2xl font-bold">
                                    {statistics.total}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Menunggu
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {statistics.pending}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Disetujui
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {statistics.approved}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Ditolak
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {statistics.rejected}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Publik
                                </p>
                                <p className="text-2xl font-bold">
                                    {statistics.public}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pribadi
                                </p>
                                <p className="text-2xl font-bold">
                                    {statistics.personal}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Galeri</CardTitle>
                        <CardDescription>
                            Cari dan filter galeri
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari judul, alumni..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>

                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                        setStatusFilter(value);
                                        setTimeout(applyFilters, 0);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Menunggu
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            Disetujui
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Ditolak
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={typeFilter}
                                    onValueChange={(value) => {
                                        setTypeFilter(value);
                                        setTimeout(applyFilters, 0);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Tipe
                                        </SelectItem>
                                        <SelectItem value="personal">
                                            Pribadi
                                        </SelectItem>
                                        <SelectItem value="public">
                                            Publik
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={batchFilter}
                                    onValueChange={(value) => {
                                        setBatchFilter(value);
                                        setTimeout(applyFilters, 0);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Angkatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Angkatan
                                        </SelectItem>
                                        {batches.map((batch) => (
                                            <SelectItem
                                                key={batch}
                                                value={batch}
                                            >
                                                {batch}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setTypeFilter('all');
                                        setBatchFilter('all');
                                        router.get(
                                            '/admin/gallery',
                                            {},
                                            { preserveState: true },
                                        );
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Gallery Grid */}
                {galleries.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Belum Ada Galeri
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Galeri yang diunggah alumni akan muncul di sini
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {galleries.data.map((gallery) => (
                                <Card
                                    key={gallery.id}
                                    className="overflow-hidden"
                                >
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={gallery.image_url}
                                            alt={gallery.title}
                                            className="h-full w-full object-cover"
                                        />
                                        {gallery.deleted_at && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                <Badge variant="destructive">
                                                    Dihapus
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h3 className="mb-1 line-clamp-1 font-semibold">
                                                    {gallery.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Oleh: {gallery.user.name}
                                                    {gallery.user.angkatan &&
                                                        ` (${gallery.user.angkatan})`}
                                                </p>
                                            </div>

                                            {!gallery.deleted_at && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/admin/gallery/${gallery.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        {gallery.type ===
                                                            'public' &&
                                                            gallery.status ===
                                                                'pending' && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleApprove(
                                                                                gallery.id,
                                                                            )
                                                                        }
                                                                        className="text-green-600 focus:text-green-600"
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Setujui
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleReject(
                                                                                gallery,
                                                                            )
                                                                        }
                                                                        className="text-yellow-600 focus:text-yellow-600"
                                                                    >
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Tolak
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    gallery.id,
                                                                    gallery.title,
                                                                )
                                                            }
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {getTypeBadge(gallery.type)}
                                                {getStatusBadge(gallery.status)}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    <span>
                                                        {gallery.views_count}{' '}
                                                        views
                                                    </span>
                                                </div>
                                                <span>
                                                    {formatDate(
                                                        gallery.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            {gallery.batch && (
                                                <div className="text-xs text-muted-foreground">
                                                    Angkatan: {gallery.batch}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {galleries.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {galleries.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) {
                                                router.visit(link.url);
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
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
                            {selectedGallery?.title}"
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Alasan Penolakan</Label>
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
        </AppLayout>
    );
}
