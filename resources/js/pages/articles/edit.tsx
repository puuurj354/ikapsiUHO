import { TiptapEditor } from '@/components/tiptap-editor';
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
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ArticleCategory {
    id: number;
    name: string;
    color: string;
}

interface Article {
    id: number;
    title: string;
    content: string;
    excerpt: string | null;
    article_category_id: number | null;
    featured_image: string | null;
    featured_image_url: string;
    is_published: boolean;
    category: ArticleCategory | null;
}

interface Props {
    article: Article;
    categories: ArticleCategory[];
}

export default function EditArticle({ article, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel Saya', href: '/articles/my-articles' },
        { title: 'Edit Artikel', href: `/articles/${article.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        article_category_id: article.article_category_id?.toString() || '',
        featured_image: null as File | null,
        is_published: article.is_published,
        _method: 'PATCH',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/articles/${article.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${article.title}`} />

            <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Artikel
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui artikel Anda
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/articles/my-articles')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Artikel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Judul Artikel
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Masukkan judul artikel"
                                    className={
                                        errors.title ? 'border-destructive' : ''
                                    }
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <Label htmlFor="excerpt">
                                    Ringkasan (Opsional)
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData('excerpt', e.target.value)
                                    }
                                    placeholder="Ringkasan singkat artikel (maks. 500 karakter)"
                                    rows={3}
                                    maxLength={500}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {data.excerpt.length}/500 karakter
                                </p>
                                {errors.excerpt && (
                                    <p className="text-sm text-destructive">
                                        {errors.excerpt}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select
                                    value={data.article_category_id}
                                    onValueChange={(value) =>
                                        setData('article_category_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
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
                                                    {category.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.article_category_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.article_category_id}
                                    </p>
                                )}
                            </div>

                            {/* Featured Image */}
                            <div className="space-y-2">
                                <Label htmlFor="featured_image">
                                    Gambar Unggulan
                                </Label>
                                {article.featured_image && (
                                    <div className="mb-2">
                                        <img
                                            src={article.featured_image_url}
                                            alt={article.title}
                                            className="h-32 w-auto rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="featured_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            'featured_image',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: JPG, PNG, WebP. Maksimal 2MB.
                                    Biarkan kosong jika tidak ingin mengubah
                                    gambar.
                                </p>
                                {errors.featured_image && (
                                    <p className="text-sm text-destructive">
                                        {errors.featured_image}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Konten Artikel
                                <span className="text-destructive">*</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TiptapEditor
                                content={data.content}
                                onChange={(value) => setData('content', value)}
                                placeholder="Tulis artikel Anda di sini..."
                                className={
                                    errors.content ? 'border-destructive' : ''
                                }
                            />
                            {errors.content && (
                                <p className="mt-2 text-sm text-destructive">
                                    {errors.content}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={processing}
                            onClick={() => setData('is_published', false)}
                        >
                            Simpan Sebagai Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            onClick={() => setData('is_published', true)}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing
                                ? 'Menyimpan...'
                                : article.is_published
                                  ? 'Perbarui'
                                  : 'Publikasikan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
