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
import { Head, router } from '@inertiajs/react';
import { Eye, Image as ImageIcon, Search, User } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface User {
    id: number;
    name: string;
    angkatan: string | null;
    profile_picture_url?: string;
}

interface Gallery {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
    batch: string | null;
    views_count: number;
    created_at: string;
    user: User | null;
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
    batches: string[];
    filters: {
        batch?: string;
        search?: string;
    };
}

export default function PublicGalleryIndex({
    galleries,
    batches,
    filters,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [batchFilter, setBatchFilter] = useState(filters.batch || 'all');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(
            '/galleries',
            {
                search: searchQuery || undefined,
                batch: batchFilter !== 'all' ? batchFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Galeri Alumni" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-12">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight">
                                Galeri Alumni
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Dokumentasi momen berharga alumni Psikologi
                                Universitas Halu Oleo
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Filters */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Cari Galeri</CardTitle>
                            <CardDescription>
                                Temukan foto berdasarkan angkatan atau kata
                                kunci
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-4"
                            >
                                <div className="grid gap-4 md:grid-cols-2">
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
                                                    Angkatan {batch}
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
                                            setBatchFilter('all');
                                            router.get(
                                                '/galleries',
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
                                    Galeri alumni akan ditampilkan di sini
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {galleries.data.map((gallery) => (
                                    <Card
                                        key={gallery.id}
                                        className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                                        onClick={() =>
                                            router.visit(
                                                `/galleries/${gallery.id}`,
                                            )
                                        }
                                    >
                                        <div className="relative aspect-square w-full overflow-hidden bg-muted">
                                            <img
                                                src={gallery.image_url}
                                                alt={gallery.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

                                            {/* Views badge */}
                                            <div className="absolute top-3 right-3">
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1 bg-black/50 text-white backdrop-blur-sm"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    {gallery.views_count}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-primary">
                                                {gallery.title}
                                            </h3>

                                            {gallery.description && (
                                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                    {gallery.description}
                                                </p>
                                            )}

                                            <div className="space-y-2 border-t pt-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    <span className="truncate">
                                                        {gallery.user?.name ||
                                                            'Alumni'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    {gallery.batch && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            Angkatan{' '}
                                                            {gallery.batch}
                                                        </Badge>
                                                    )}
                                                    <span className="ml-auto">
                                                        {formatDate(
                                                            gallery.created_at,
                                                        )}
                                                    </span>
                                                </div>
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
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
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
            </div>
        </>
    );
}
