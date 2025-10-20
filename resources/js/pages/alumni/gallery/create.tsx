import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function CreateGallery() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Galeri Saya', href: '/gallery' },
        { title: 'Unggah Foto Baru', href: '/gallery/create' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        image: null as File | null,
        batch: '',
        type: 'personal' as 'personal' | 'public',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/gallery', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Unggah Foto Baru" />

            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Unggah Foto Baru
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Tambahkan foto baru ke galeri Anda
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Foto</CardTitle>
                            <CardDescription>
                                Pilih foto yang ingin Anda unggah (Max 5MB)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <label
                                        htmlFor="image-upload"
                                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted"
                                    >
                                        {previewUrl ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="h-full w-full rounded-lg object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">
                                                        Klik untuk unggah
                                                    </span>{' '}
                                                    atau drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF (MAX. 5MB)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                {errors.image && (
                                    <p className="text-sm text-destructive">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gallery Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Foto</CardTitle>
                            <CardDescription>
                                Berikan detail tentang foto yang diunggah
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Judul{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Wisuda Angkatan 2023"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
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

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Deskripsi (Opsional)
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ceritakan lebih lanjut tentang foto ini..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className={
                                        errors.description
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="batch">
                                    Angkatan (Opsional)
                                </Label>
                                <Input
                                    id="batch"
                                    placeholder="Contoh: 2023"
                                    value={data.batch}
                                    onChange={(e) =>
                                        setData('batch', e.target.value)
                                    }
                                    className={
                                        errors.batch ? 'border-destructive' : ''
                                    }
                                />
                                {errors.batch && (
                                    <p className="text-sm text-destructive">
                                        {errors.batch}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Tipe Galeri{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(
                                        value: 'personal' | 'public',
                                    ) => setData('type', value)}
                                >
                                    <SelectTrigger
                                        className={
                                            errors.type
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="personal">
                                            Pribadi - Hanya bisa dilihat oleh
                                            saya
                                        </SelectItem>
                                        <SelectItem value="public">
                                            Publik - Akan ditampilkan di galeri
                                            publik (perlu persetujuan admin)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-destructive">
                                        {errors.type}
                                    </p>
                                )}

                                {data.type === 'public' && (
                                    <div className="flex gap-2 rounded-md border border-blue-200 bg-blue-50 p-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-blue-900">
                                                Catatan untuk Galeri Publik
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                Foto akan ditinjau oleh admin
                                                sebelum ditampilkan di galeri
                                                publik. Anda akan menerima
                                                notifikasi ketika foto disetujui
                                                atau ditolak.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/gallery')}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.image}
                        >
                            {processing ? (
                                <>
                                    <ImageIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Mengunggah...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Unggah Foto
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
