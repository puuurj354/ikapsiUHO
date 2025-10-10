import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Loader2,
    Save,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
}

interface Discussion {
    id: number;
    title: string;
    slug: string;
    content: string;
    forum_category_id: number;
}

interface Props {
    discussion: Discussion;
    categories: Category[];
}

interface FormData {
    title: string;
    content: string;
    forum_category_id: number;
}

export default function EditDiscussion({ discussion, categories }: Props) {
    const { data, setData, processing, errors } = useForm<FormData>({
        title: discussion.title,
        content: discussion.content,
        forum_category_id: discussion.forum_category_id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Forum Diskusi', href: '/forum' },
        { title: discussion.title, href: `/forum/${discussion.slug}` },
        { title: 'Edit', href: `/forum/${discussion.slug}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(`/forum/${discussion.slug}`, data, {
            onSuccess: () => {
                // Redirect akan ditangani oleh controller
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${discussion.title} - Forum`} />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Diskusi
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Perbarui informasi diskusi Anda
                        </p>
                    </div>
                    <Link href={`/forum/${discussion.slug}`}>
                        <Button variant="outline" size="sm">
                            <Icon
                                iconNode={ArrowLeft}
                                className="mr-2 h-4 w-4"
                            />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Diskusi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Kategori */}
                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Kategori{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.forum_category_id.toString()}
                                    onValueChange={(value) =>
                                        setData(
                                            'forum_category_id',
                                            parseInt(value),
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="category"
                                        className={
                                            errors.forum_category_id
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    >
                                        <SelectValue placeholder="Pilih kategori diskusi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    />
                                                    <span>{category.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.forum_category_id && (
                                    <div className="flex items-center gap-1 text-sm text-red-500">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.forum_category_id}</span>
                                    </div>
                                )}
                            </div>

                            {/* Judul */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Judul Diskusi{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Tulis judul yang jelas dan deskriptif"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className={
                                        errors.title ? 'border-red-500' : ''
                                    }
                                    maxLength={255}
                                />
                                <div className="flex items-center justify-between">
                                    {errors.title && (
                                        <div className="flex items-center gap-1 text-sm text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{errors.title}</span>
                                        </div>
                                    )}
                                    <span className="ml-auto text-xs text-gray-500">
                                        {data.title.length}/255
                                    </span>
                                </div>
                            </div>

                            {/* Konten */}
                            <div className="space-y-2">
                                <Label htmlFor="content">
                                    Isi Diskusi{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    placeholder="Jelaskan topik diskusi Anda dengan detail..."
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                    className={
                                        errors.content
                                            ? 'min-h-[300px] border-red-500'
                                            : 'min-h-[300px]'
                                    }
                                />
                                {errors.content && (
                                    <div className="flex items-center gap-1 text-sm text-red-500">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.content}</span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500">
                                    Gunakan bahasa yang sopan dan jelas. Hindari
                                    SPAM dan konten yang tidak pantas.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t pt-6">
                                <Link href={`/forum/${discussion.slug}`}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={processing}
                                    >
                                        Batal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[150px]"
                                >
                                    {processing ? (
                                        <>
                                            <Icon
                                                iconNode={Loader2}
                                                className="mr-2 h-4 w-4 animate-spin"
                                            />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Icon
                                                iconNode={Save}
                                                className="mr-2 h-4 w-4"
                                            />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Warning Card */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <Icon
                                iconNode={AlertTriangle}
                                className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600"
                            />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-yellow-900">
                                    Perhatian
                                </h3>
                                <p className="text-sm text-yellow-800">
                                    Pastikan perubahan yang Anda lakukan sesuai
                                    dengan topik diskusi awal. Perubahan besar
                                    yang mengubah konteks diskusi dapat
                                    membingungkan peserta lain.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
