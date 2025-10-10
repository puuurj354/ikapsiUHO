import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Head, Link, router } from '@inertiajs/react';
import {
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    GraduationCap,
    Heart,
    HelpCircle,
    MessageSquare,
    Pin,
    Plus,
    Search,
    TrendingUp,
    Users,
    type LucideProps,
} from 'lucide-react';
import { useCallback, useEffect, useState, type ComponentType } from 'react';

interface User {
    id: number;
    name: string;
    profile_picture_url: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    active_discussions_count?: number;
}

interface Discussion {
    id: number;
    title: string;
    slug: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    views_count: number;
    replies_count: number;
    likes_count: number;
    last_activity_at: string;
    created_at: string;
    user: User;
    category: Category;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface DiscussionPagination {
    data: Discussion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Filters {
    search: string | null;
    category: number | null;
    sort: string;
}

interface Props {
    pinnedDiscussions: Discussion[];
    discussions: DiscussionPagination;
    categories: Category[];
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Forum Diskusi', href: '/forum' },
];

// Icon mapping
const iconMap: Record<string, ComponentType<LucideProps>> = {
    MessageSquare,
    Users,
    Calendar,
    TrendingUp,
    Briefcase,
    GraduationCap,
    HelpCircle,
};

export default function ForumIndex({
    pinnedDiscussions,
    discussions,
    categories,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState<string>(
        filters.category?.toString() || 'all',
    );
    const [sortBy, setSortBy] = useState(filters.sort || 'recent');

    // Handle filter changes
    const handleFilter = useCallback(() => {
        router.get(
            '/forum',
            {
                search: search || undefined,
                category:
                    selectedCategory !== 'all' ? selectedCategory : undefined,
                sort: sortBy,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, [search, selectedCategory, sortBy]);

    // Auto-filter when filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, selectedCategory, sortBy, handleFilter]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        if (diffDays < 7) return `${diffDays} hari yang lalu`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Get icon component
    const getIcon = (iconName: string) => {
        return iconMap[iconName] || MessageSquare;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Forum Diskusi" />

            <div className="container mx-auto space-y-8 py-8">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Forum Diskusi
                        </h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Berbagi dan berdiskusi dengan sesama alumni
                        </p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/forum/create">
                            <Icon iconNode={Plus} className="mr-2 h-4 w-4" />
                            Buat Diskusi
                        </Link>
                    </Button>
                </div>

                {/* Categories */}
                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                            onClick={() =>
                                setSelectedCategory(category.id.toString())
                            }
                        >
                            <CardHeader className="pb-2 sm:pb-3">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
                                        style={{
                                            backgroundColor: `${category.color}20`,
                                        }}
                                    >
                                        <Icon
                                            iconNode={getIcon(category.icon)}
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            style={{ color: category.color }}
                                        />
                                    </div>
                                    {category.active_discussions_count !==
                                        undefined && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {category.active_discussions_count}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-sm font-semibold sm:text-base">
                                    {category.name}
                                </h3>
                                <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                                    {category.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Icon
                                        iconNode={Search}
                                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        placeholder="Cari diskusi..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-full text-sm sm:w-[180px]">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Kategori
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                >
                                    <SelectTrigger className="w-full text-sm sm:w-[150px]">
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">
                                            Terbaru
                                        </SelectItem>
                                        <SelectItem value="popular">
                                            Populer
                                        </SelectItem>
                                        <SelectItem value="oldest">
                                            Terlama
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Pinned Discussions */}
                {pinnedDiscussions.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Icon iconNode={Pin} className="h-5 w-5" />
                            Diskusi yang Di-pin
                        </h2>
                        <div className="space-y-4">
                            {pinnedDiscussions.map((discussion) => (
                                <Link
                                    key={discussion.id}
                                    href={`/forum/${discussion.slug}`}
                                >
                                    <Card className="transition-all hover:border-primary hover:shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={
                                                        discussion.user
                                                            .profile_picture_url
                                                    }
                                                    alt={discussion.user.name}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            style={{
                                                                borderColor:
                                                                    discussion
                                                                        .category
                                                                        .color,
                                                                color: discussion
                                                                    .category
                                                                    .color,
                                                            }}
                                                        >
                                                            {
                                                                discussion
                                                                    .category
                                                                    .name
                                                            }
                                                        </Badge>
                                                        <Badge>
                                                            <Icon
                                                                iconNode={Pin}
                                                                className="mr-1 h-3 w-3"
                                                            />
                                                            Di-pin
                                                        </Badge>
                                                    </div>
                                                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold hover:text-primary sm:text-base">
                                                        {discussion.title}
                                                    </h3>
                                                    <p className="truncate text-xs text-muted-foreground sm:text-sm">
                                                        {discussion.user.name} •{' '}
                                                        {formatDate(
                                                            discussion.last_activity_at,
                                                        )}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                iconNode={Eye}
                                                                className="h-3 w-3 sm:h-4 sm:w-4"
                                                            />
                                                            {
                                                                discussion.views_count
                                                            }
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                iconNode={
                                                                    MessageSquare
                                                                }
                                                                className="h-3 w-3 sm:h-4 sm:w-4"
                                                            />
                                                            {
                                                                discussion.replies_count
                                                            }
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                iconNode={Heart}
                                                                className="h-3 w-3 sm:h-4 sm:w-4"
                                                            />
                                                            {
                                                                discussion.likes_count
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Discussions List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Semua Diskusi</h2>

                    {discussions.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Icon
                                    iconNode={MessageSquare}
                                    className="mx-auto h-12 w-12 text-muted-foreground"
                                />
                                <h3 className="mt-4 text-lg font-semibold">
                                    Belum ada diskusi
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Jadilah yang pertama memulai diskusi!
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href="/forum/create">
                                        Buat Diskusi
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {discussions.data.map((discussion) => (
                                    <Link
                                        key={discussion.id}
                                        href={`/forum/${discussion.slug}`}
                                    >
                                        <Card className="transition-all hover:border-primary hover:shadow-md">
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="flex items-start gap-2 sm:gap-4">
                                                    <img
                                                        src={
                                                            discussion.user
                                                                .profile_picture_url
                                                        }
                                                        alt={
                                                            discussion.user.name
                                                        }
                                                        className="h-8 w-8 flex-shrink-0 rounded-full sm:h-10 sm:w-10"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                            style={{
                                                                borderColor:
                                                                    discussion
                                                                        .category
                                                                        .color,
                                                                color: discussion
                                                                    .category
                                                                    .color,
                                                            }}
                                                        >
                                                            {
                                                                discussion
                                                                    .category
                                                                    .name
                                                            }
                                                        </Badge>
                                                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold hover:text-primary sm:text-base">
                                                            {discussion.title}
                                                        </h3>
                                                        <p className="truncate text-xs text-muted-foreground sm:text-sm">
                                                            {
                                                                discussion.user
                                                                    .name
                                                            }{' '}
                                                            •{' '}
                                                            {formatDate(
                                                                discussion.last_activity_at,
                                                            )}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                                                            <span className="flex items-center gap-1">
                                                                <Icon
                                                                    iconNode={
                                                                        Eye
                                                                    }
                                                                    className="h-3 w-3 sm:h-4 sm:w-4"
                                                                />
                                                                {
                                                                    discussion.views_count
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Icon
                                                                    iconNode={
                                                                        MessageSquare
                                                                    }
                                                                    className="h-3 w-3 sm:h-4 sm:w-4"
                                                                />
                                                                {
                                                                    discussion.replies_count
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Icon
                                                                    iconNode={
                                                                        Heart
                                                                    }
                                                                    className="h-3 w-3 sm:h-4 sm:w-4"
                                                                />
                                                                {
                                                                    discussion.likes_count
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {discussions.last_page > 1 && (
                                <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                                    {discussions.links.map((link, index) => {
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() =>
                                                        link.url &&
                                                        router.get(link.url)
                                                    }
                                                    className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                                                >
                                                    <Icon
                                                        iconNode={ChevronLeft}
                                                        className="h-3 w-3 sm:h-4 sm:w-4"
                                                    />
                                                </Button>
                                            );
                                        }

                                        if (link.label.includes('Next')) {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() =>
                                                        link.url &&
                                                        router.get(link.url)
                                                    }
                                                    className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                                                >
                                                    <Icon
                                                        iconNode={ChevronRight}
                                                        className="h-3 w-3 sm:h-4 sm:w-4"
                                                    />
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={index}
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    link.url &&
                                                    router.get(link.url)
                                                }
                                                className="h-8 min-w-[2rem] px-2 text-xs sm:h-9 sm:min-w-[2.25rem] sm:px-3 sm:text-sm"
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
