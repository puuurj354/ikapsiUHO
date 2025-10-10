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
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Lightbulb, Loader2, Send } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
}

interface Props {
    categories: Category[];
}

interface FormData {
    title: string;
    content: string;
    forum_category_id: number | string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Forum Diskusi', href: '/forum' },
    { title: 'Buat Diskusi Baru', href: '/forum/create' },
];

export default function CreateDiscussion({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        content: '',
        forum_category_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forum', {
            onSuccess: () => {
                // Redirect akan ditangani oleh controller
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Diskusi Baru - Forum" />

            <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Buat Diskusi Baru
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Mulai diskusi baru dengan alumni lainnya
                        </p>
                    </div>
                    <Link href="/forum">
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
                                <Link href="/forum">
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
                                            Membuat...
                                        </>
                                    ) : (
                                        <>
                                            <Icon
                                                iconNode={Send}
                                                className="mr-2 h-4 w-4"
                                            />
                                            Buat Diskusi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tips Card */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <Icon
                                iconNode={Lightbulb}
                                className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                            />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-900">
                                    Tips Membuat Diskusi yang Baik
                                </h3>
                                <ul className="space-y-1 text-sm text-blue-800">
                                    <li>
                                        • Gunakan judul yang jelas dan spesifik
                                    </li>
                                    <li>
                                        • Pilih kategori yang sesuai dengan
                                        topik
                                    </li>
                                    <li>
                                        • Jelaskan permasalahan atau topik
                                        dengan detail
                                    </li>
                                    <li>
                                        • Gunakan bahasa yang sopan dan mudah
                                        dipahami
                                    </li>
                                    <li>
                                        • Sertakan konteks yang cukup agar
                                        diskusi produktif
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
