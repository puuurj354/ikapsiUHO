import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Eye, Share2, User, ZoomIn } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    angkatan: string | null;
    profile_picture?: string | null;
    profile_picture_url?: string | null;
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

interface Props {
    gallery: Gallery;
}

export default function PublicGalleryShow({ gallery }: Props) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: gallery.title,
                    text: gallery.description || '',
                    url: window.location.href,
                });
            } catch {
                // User cancelled share or share failed
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin ke clipboard!');
        }
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
            <Head title={gallery.title} />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/galleries')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Galeri
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Bagikan
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Image */}
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div
                                        className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
                                        onClick={() =>
                                            setIsImageModalOpen(true)
                                        }
                                    >
                                        <img
                                            src={gallery.image_url}
                                            alt={gallery.title}
                                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                                            <div className="flex flex-col items-center gap-2 text-white">
                                                <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                                                    <ZoomIn className="h-8 w-8" />
                                                </div>
                                                <p className="text-sm font-medium">
                                                    Klik untuk memperbesar
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats Overlay */}
                                        <div className="absolute right-4 bottom-4">
                                            <Badge className="gap-1.5 bg-black/60 text-white backdrop-blur-sm">
                                                <Eye className="h-3.5 w-3.5" />
                                                {gallery.views_count} views
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Title and Description */}
                            <Card className="mt-6">
                                <CardContent className="p-6">
                                    <h1 className="mb-4 text-3xl font-bold tracking-tight">
                                        {gallery.title}
                                    </h1>

                                    {gallery.description && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                                Deskripsi
                                            </h3>
                                            <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                                {gallery.description}
                                            </p>
                                        </div>
                                    )}

                                    {!gallery.description && (
                                        <p className="text-muted-foreground italic">
                                            Tidak ada deskripsi untuk galeri
                                            ini.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Author Card */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                        Diunggah Oleh
                                    </h3>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                                            {gallery.user?.profile_picture ||
                                            gallery.user
                                                ?.profile_picture_url ? (
                                                <img
                                                    src={
                                                        gallery.user
                                                            ?.profile_picture_url ||
                                                        gallery.user
                                                            ?.profile_picture ||
                                                        ''
                                                    }
                                                    alt={
                                                        gallery.user?.name ||
                                                        'Alumni'
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-7 w-7 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {gallery.user?.name || 'Alumni'}
                                            </p>
                                            {gallery.user?.angkatan && (
                                                <p className="text-sm text-muted-foreground">
                                                    Alumni Angkatan{' '}
                                                    {gallery.user.angkatan}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Gallery Info */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                        Informasi Galeri
                                    </h3>
                                    <div className="space-y-4">
                                        {gallery.batch && (
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    Angkatan
                                                </span>
                                                <Badge variant="outline">
                                                    {gallery.batch}
                                                </Badge>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Tanggal Unggah
                                            </span>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {formatDate(
                                                        gallery.created_at,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Dilihat
                                            </span>
                                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {gallery.views_count} kali
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Share Card */}
                            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/0">
                                <CardContent className="p-6">
                                    <h3 className="mb-2 font-semibold">
                                        Suka dengan galeri ini?
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Bagikan kepada teman dan keluarga Anda!
                                    </p>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Bagikan Galeri
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* CTA Card */}
                            <Card className="border-primary/20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                <CardContent className="p-6">
                                    <h3 className="mb-2 font-semibold">
                                        Punya Foto Alumni?
                                    </h3>
                                    <p className="mb-4 text-sm opacity-90">
                                        Login untuk berbagi momen berharga Anda
                                        dengan alumni lainnya!
                                    </p>
                                    <Button
                                        className="w-full bg-white text-primary hover:bg-white/90"
                                        onClick={() => router.visit('/login')}
                                    >
                                        Login Sekarang
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Full Screen Image Modal */}
                    <Dialog
                        open={isImageModalOpen}
                        onOpenChange={setIsImageModalOpen}
                    >
                        <DialogContent className="max-w-7xl p-0">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle className="text-2xl">
                                    {gallery.title}
                                </DialogTitle>
                                {gallery.description && (
                                    <DialogDescription className="text-base">
                                        {gallery.description}
                                    </DialogDescription>
                                )}
                            </DialogHeader>
                            <div className="relative aspect-auto max-h-[85vh] w-full overflow-hidden rounded-b-lg bg-gradient-to-br from-gray-900 to-gray-800">
                                <img
                                    src={gallery.image_url}
                                    alt={gallery.title}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex items-center justify-between border-t p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        {gallery.user?.profile_picture ||
                                        gallery.user?.profile_picture_url ? (
                                            <img
                                                src={
                                                    gallery.user
                                                        ?.profile_picture_url ||
                                                    gallery.user
                                                        ?.profile_picture ||
                                                    ''
                                                }
                                                alt={
                                                    gallery.user?.name ||
                                                    'Alumni'
                                                }
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {gallery.user?.name || 'Alumni'}
                                        </p>
                                        {gallery.user?.angkatan && (
                                            <p className="text-sm text-muted-foreground">
                                                Angkatan {gallery.user.angkatan}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                        <span>{gallery.views_count} views</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Bagikan
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}
