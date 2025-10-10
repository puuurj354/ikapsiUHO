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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    Eye,
    FileText,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ArticleCategory {
    id: number;
    name: string;
    color: string;
}

interface Article {
    id: number;
    title: string;
    excerpt: string | null;
    is_published: boolean;
    published_at: string | null;
    views_count: number;
    category: ArticleCategory | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedArticles {
    current_page: number;
    data: Article[];
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
    articles: PaginatedArticles;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function MyArticles({ articles, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel Saya', href: '/articles/my-articles' },
    ];

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/articles/my-articles',
            {
                search: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/articles/my-articles',
            {
                search: searchQuery,
                status: value !== 'all' ? value : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (articleId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            router.delete(`/articles/${articleId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleTogglePublish = (articleId: number) => {
        router.post(
            `/articles/${articleId}/toggle-publish`,
            {},
            {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Artikel Saya" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Artikel Saya
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola artikel yang telah Anda buat
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/articles/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Artikel Baru
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Artikel</CardTitle>
                        <CardDescription>
                            Cari dan filter artikel Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-4 sm:flex-row"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari judul artikel..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={handleStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="published">
                                        Dipublikasikan
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">Cari</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Articles Table */}
                <Card>
                    <CardContent className="p-0">
                        {articles.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">
                                    Belum Ada Artikel
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Mulai berbagi pengetahuan Anda dengan
                                    membuat artikel pertama
                                </p>
                                <Button
                                    onClick={() =>
                                        router.visit('/articles/create')
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Artikel
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Judul</TableHead>
                                                <TableHead>Kategori</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead className="text-center">
                                                    Views
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {articles.data.map((article) => (
                                                <TableRow key={article.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">
                                                                {article.title}
                                                            </p>
                                                            {article.excerpt && (
                                                                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                                                    {
                                                                        article.excerpt
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {article.category && (
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="h-3 w-3 rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            article
                                                                                .category
                                                                                .color,
                                                                    }}
                                                                />
                                                                <span className="text-sm">
                                                                    {
                                                                        article
                                                                            .category
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                article.is_published
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {article.is_published
                                                                ? 'Dipublikasikan'
                                                                : 'Draft'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(
                                                                article.published_at ||
                                                                    article.created_at,
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1 text-sm">
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                            {
                                                                article.views_count
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            `/articles/${article.id}/edit`,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleTogglePublish(
                                                                            article.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    {article.is_published
                                                                        ? 'Jadikan Draft'
                                                                        : 'Publikasikan'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            article.id,
                                                                        )
                                                                    }
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {articles.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t px-6 py-4">
                                        <p className="text-sm text-muted-foreground">
                                            Menampilkan {articles.from} hingga{' '}
                                            {articles.to} dari {articles.total}{' '}
                                            artikel
                                        </p>
                                        <div className="flex gap-2">
                                            {articles.links.map((link, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={
                                                        link.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() =>
                                                        link.url &&
                                                        router.visit(link.url)
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
