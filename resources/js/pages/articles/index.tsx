import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Eye, Search, User } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Author {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string;
    published_at: string;
    views_count: number;
    reading_time: string;
    category: ArticleCategory | null;
    author: Author;
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
    categories: ArticleCategory[];
    filters: {
        search?: string;
        category?: string;
    };
}

export default function ArticlesIndex({
    articles,
    categories,
    filters,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category || 'all',
    );

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/articles',
            {
                search: searchQuery,
                category: categoryFilter !== 'all' ? categoryFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleCategoryFilter = (value: string) => {
        setCategoryFilter(value);
        router.get(
            '/articles',
            {
                search: searchQuery,
                category: value !== 'all' ? value : undefined,
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
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Artikel Alumni" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-12">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight">
                                Artikel Alumni
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Baca artikel, wawasan, dan pengalaman dari para
                                alumni Psikologi Universitas Halu Oleo
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Search & Filter */}
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-4 sm:flex-row"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari artikel..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Select
                                    value={categoryFilter}
                                    onValueChange={handleCategoryFilter}
                                >
                                    <SelectTrigger className="w-full sm:w-[220px]">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Kategori
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.slug}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    />
                                                    {category.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit">Cari</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Articles Grid */}
                    {articles.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-muted p-6">
                                <Search className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Tidak Ada Artikel
                            </h3>
                            <p className="text-muted-foreground">
                                Tidak ada artikel yang cocok dengan pencarian
                                Anda
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {articles.from} - {articles.to}{' '}
                                    dari {articles.total} artikel
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {articles.data.map((article) => (
                                    <Card
                                        key={article.id}
                                        className="group flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg"
                                        onClick={() =>
                                            router.visit(
                                                `/articles/${article.slug}`,
                                            )
                                        }
                                    >
                                        {/* Featured Image */}
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            {article.featured_image_url ? (
                                                <img
                                                    src={
                                                        article.featured_image_url
                                                    }
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <Search className="h-12 w-12" />
                                                </div>
                                            )}
                                            {article.category && (
                                                <div className="absolute top-3 right-3">
                                                    <Badge
                                                        style={{
                                                            backgroundColor:
                                                                article.category
                                                                    .color,
                                                        }}
                                                    >
                                                        {article.category.name}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="flex flex-1 flex-col p-6">
                                            {/* Title */}
                                            <h3 className="mb-2 line-clamp-2 text-lg font-semibold group-hover:text-primary">
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            {article.excerpt && (
                                                <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                                                    {article.excerpt}
                                                </p>
                                            )}

                                            {/* Meta Info */}
                                            <div className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>
                                                        {article.author.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>
                                                            {formatDate(
                                                                article.published_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>
                                                                {
                                                                    article.reading_time
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>
                                                                {
                                                                    article.views_count
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {articles.last_page > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
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
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
