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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Eye,
    Image as ImageIcon,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface User {
    id: number;
    name: string;
    angkatan: string | null;
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

interface Props {
    galleries: PaginatedGalleries;
    filters: {
        type?: string;
        status?: string;
        search?: string;
    };
}

export default function AlumniGalleryIndex({ galleries, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Galeri Saya', href: '/gallery' },
    ];

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(
            '/gallery',
            {
                search: searchQuery || undefined,
                type: typeFilter !== 'all' ? typeFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (galleryId: number, title: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus galeri "${title}"? Aksi ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(`/gallery/${galleryId}`, {
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
            <Head title="Galeri Saya" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Galeri Saya
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola foto dan dokumentasi Anda
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/gallery/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Unggah Foto Baru
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Galeri</CardTitle>
                        <CardDescription>
                            Cari dan filter galeri Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari judul atau deskripsi..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>

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
                                        setTypeFilter('all');
                                        setStatusFilter('all');
                                        router.get(
                                            '/gallery',
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
                            <p className="mb-4 text-sm text-muted-foreground">
                                Mulai unggah foto untuk membangun galeri Anda
                            </p>
                            <Button
                                onClick={() => router.visit('/gallery/create')}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Unggah Foto Pertama
                            </Button>
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
                                            className="h-full w-full object-cover transition-transform hover:scale-105"
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
                                                {gallery.description && (
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {gallery.description}
                                                    </p>
                                                )}
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
                                                                    `/gallery/${gallery.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/gallery/${gallery.id}/edit`,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
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
                                                {gallery.type === 'public' &&
                                                    getStatusBadge(
                                                        gallery.status,
                                                    )}
                                            </div>

                                            {gallery.status === 'rejected' &&
                                                gallery.rejection_reason && (
                                                    <div className="rounded-md bg-destructive/10 p-2">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                                            <div className="flex-1">
                                                                <p className="text-xs font-medium text-destructive">
                                                                    Alasan
                                                                    Penolakan:
                                                                </p>
                                                                <p className="text-xs text-destructive/80">
                                                                    {
                                                                        gallery.rejection_reason
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

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
        </AppLayout>
    );
}
