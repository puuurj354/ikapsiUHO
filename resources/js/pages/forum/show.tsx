import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Edit2,
    Eye,
    Heart,
    Loader2,
    Lock,
    MessageSquare,
    MoreVertical,
    Pin,
    Send,
    Trash2,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    profile_picture_url: string;
    role?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Reply {
    id: number;
    content: string;
    created_at: string;
    likes_count: number;
    user_liked: boolean;
    user: User;
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
    user_liked: boolean;
    created_at: string;
    updated_at: string;
    user: User;
    category: Category;
}

interface Props {
    discussion: Discussion;
    replies: Reply[];
    canEdit: boolean;
    canDelete: boolean;
    isAdmin: boolean;
}

export default function ShowDiscussion({
    discussion,
    replies,
    canEdit,
    canDelete,
    isAdmin,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        parent_id: null as number | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Forum Diskusi', href: '/forum' },
        { title: discussion.title, href: `/forum/${discussion.slug}` },
    ];

    const handleLikeDiscussion = () => {
        router.post(
            `/forum/${discussion.slug}/like`,
            {},
            { preserveScroll: true },
        );
    };

    const handleLikeReply = (replyId: number) => {
        router.post(
            `/forum/reply/${replyId}/like`,
            {},
            { preserveScroll: true },
        );
    };

    const handleTogglePin = () => {
        router.post(
            `/forum/${discussion.slug}/pin`,
            {},
            { preserveScroll: true },
        );
    };

    const handleToggleLock = () => {
        router.post(
            `/forum/${discussion.slug}/lock`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = () => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus diskusi ini? Tindakan ini tidak dapat dibatalkan.',
            )
        ) {
            router.delete(`/forum/${discussion.slug}`);
        }
    };

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/forum/${discussion.slug}/reply`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setReplyingTo(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${discussion.title} - Forum`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Button */}
                <Link href="/forum">
                    <Button variant="ghost" size="sm">
                        <Icon iconNode={Eye} className="mr-2 h-4 w-4" />
                        Kembali ke Forum
                    </Button>
                </Link>

                {/* Discussion Card */}
                <Card>
                    <CardHeader className="space-y-4">
                        {/* Category & Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="secondary"
                                style={{
                                    backgroundColor: `${discussion.category.color}20`,
                                    color: discussion.category.color,
                                }}
                            >
                                {discussion.category.name}
                            </Badge>
                            {discussion.is_pinned && (
                                <Badge
                                    variant="default"
                                    className="bg-blue-600"
                                >
                                    <Pin className="mr-1 h-3 w-3" />
                                    Disematkan
                                </Badge>
                            )}
                            {discussion.is_locked && (
                                <Badge variant="destructive">
                                    <Lock className="mr-1 h-3 w-3" />
                                    Dikunci
                                </Badge>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900">
                            {discussion.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={
                                            discussion.user.profile_picture_url
                                        }
                                    />
                                    <AvatarFallback>
                                        {getInitials(discussion.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900">
                                            {discussion.user.name}
                                        </p>
                                        {discussion.user.role === 'admin' && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-purple-100 text-purple-700"
                                            >
                                                Admin
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(discussion.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Action Menu */}
                            {(canEdit || canDelete || isAdmin) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {canEdit && (
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/forum/${discussion.slug}/edit`}
                                                >
                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                    Edit Diskusi
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {isAdmin && (
                                            <>
                                                {canEdit && (
                                                    <DropdownMenuSeparator />
                                                )}
                                                <DropdownMenuItem
                                                    onClick={handleTogglePin}
                                                >
                                                    <Pin className="mr-2 h-4 w-4" />
                                                    {discussion.is_pinned
                                                        ? 'Lepas Pin'
                                                        : 'Pin'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={handleToggleLock}
                                                >
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    {discussion.is_locked
                                                        ? 'Buka Kunci'
                                                        : 'Kunci'}
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {canDelete && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={handleDelete}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus Diskusi
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Content */}
                        <div className="prose max-w-none text-gray-700">
                            {discussion.content
                                .split('\n')
                                .map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{discussion.views_count} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>
                                        {discussion.replies_count} balasan
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{discussion.likes_count} likes</span>
                                </div>
                            </div>

                            <Button
                                variant={
                                    discussion.user_liked
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={handleLikeDiscussion}
                                className={
                                    discussion.user_liked
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : ''
                                }
                            >
                                <Heart
                                    className={`mr-2 h-4 w-4 ${discussion.user_liked ? 'fill-current' : ''}`}
                                />
                                {discussion.user_liked ? 'Liked' : 'Like'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Replies Section */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {discussion.replies_count} Balasan
                        </h2>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Reply Form */}
                        {!discussion.is_locked ? (
                            <form
                                onSubmit={handleSubmitReply}
                                className="space-y-4"
                            >
                                <Textarea
                                    placeholder="Tulis balasan Anda..."
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                    className={
                                        errors.content
                                            ? 'min-h-[120px] border-red-500'
                                            : 'min-h-[120px]'
                                    }
                                />
                                {errors.content && (
                                    <div className="flex items-center gap-1 text-sm text-red-500">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.content}</span>
                                    </div>
                                )}
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Icon
                                                    iconNode={Loader2}
                                                    className="mr-2 h-4 w-4 animate-spin"
                                                />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Kirim Balasan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                                <Lock className="h-5 w-5" />
                                <p className="font-medium">
                                    Diskusi ini telah dikunci. Tidak dapat
                                    menambahkan balasan baru.
                                </p>
                            </div>
                        )}

                        {/* Replies List */}
                        {replies.length > 0 ? (
                            <div className="space-y-4">
                                {replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="rounded-lg border bg-gray-50 p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={
                                                        reply.user
                                                            .profile_picture_url
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {getInitials(
                                                        reply.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">
                                                            {reply.user.name}
                                                        </p>
                                                        {reply.user.role ===
                                                            'admin' && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-purple-100 text-purple-700"
                                                            >
                                                                Admin
                                                            </Badge>
                                                        )}
                                                        <span className="text-sm text-gray-500">
                                                            •
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(
                                                                reply.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">
                                                    {reply.content}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleLikeReply(
                                                                reply.id,
                                                            )
                                                        }
                                                        className={
                                                            reply.user_liked
                                                                ? 'text-red-500'
                                                                : ''
                                                        }
                                                    >
                                                        <Heart
                                                            className={`mr-1 h-4 w-4 ${reply.user_liked ? 'fill-current' : ''}`}
                                                        />
                                                        {reply.likes_count}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-gray-500">
                                    Belum ada balasan. Jadilah yang pertama!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
function setReplyingTo(arg0: null) {
    throw new Error('Function not implemented.');
}
