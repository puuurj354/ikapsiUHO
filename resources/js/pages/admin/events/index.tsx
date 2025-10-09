import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CalendarIcon,
    CirclePlusIcon,
    EllipsisIcon,
    EyeIcon,
    MapPinIcon,
    PencilIcon,
    TrashIcon,
    UsersIcon,
} from 'lucide-react';
import React, { useState } from 'react';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    image?: string;
    event_date: string;
    registration_deadline: string;
    max_participants?: number;
    is_published: boolean;
    registrations_count: number;
    created_by: number;
    created_at: string;
}

interface PaginatedEvents {
    data: Event[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    events: PaginatedEvents;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function EventManagement({ events, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard Admin', href: '/admin/dashboard' },
        { title: 'Manajemen Event', href: '/admin/events' },
    ];

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

    const createForm = useForm({
        title: '',
        description: '',
        location: '',
        event_date: '',
        registration_deadline: '',
        max_participants: '',
        is_published: false,
        image: null as File | null,
    });

    const editForm = useForm({
        title: '',
        description: '',
        location: '',
        event_date: '',
        registration_deadline: '',
        max_participants: '',
        is_published: false,
        image: null as File | null,
    });

    // Handle search
    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.get(
            '/admin/events',
            {
                search: value,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/admin/events',
            {
                search: searchValue,
                status: value !== 'all' ? value : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    // Handle create event
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/events', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setIsCreateDialogOpen(false);
                setImagePreview(null);
            },
        });
    };

    // Handle edit event
    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        editForm.post(`/admin/events/${editingEvent.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                editForm.reset();
                setEditingEvent(null);
                setEditImagePreview(null);
            },
        });
    };

    // Handle delete event
    const handleDelete = () => {
        if (!deletingEvent) return;

        router.delete(`/admin/events/${deletingEvent.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingEvent(null);
            },
        });
    };

    // Open edit dialog
    const openEditDialog = (event: Event) => {
        setEditingEvent(event);
        setEditImagePreview(event.image || null);
        editForm.setData({
            title: event.title,
            description: event.description,
            location: event.location,
            event_date: new Date(event.event_date).toISOString().slice(0, 16),
            registration_deadline: new Date(event.registration_deadline)
                .toISOString()
                .slice(0, 16),
            max_participants: event.max_participants?.toString() || '',
            is_published: event.is_published,
            image: null,
        });
    };

    // Handle image change for create form
    const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            createForm.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image change for edit form
    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            editForm.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Event" />

            <div className="container mx-auto space-y-8 py-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Manajemen Event
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Kelola event dan kegiatan alumni
                    </p>
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Cari judul atau lokasi event..."
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Icon iconNode={CirclePlusIcon} className="mr-2 h-4 w-4" />
                        Buat Event
                    </Button>
                </div>

                {/* Events Grid */}
                {events.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada event</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Mulai dengan membuat event pertama Anda
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.data.map((event) => (
                            <Card key={event.id} className="overflow-hidden">
                                {event.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-xl">
                                            {event.title}
                                        </CardTitle>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Icon
                                                        iconNode={EllipsisIcon}
                                                        className="h-4 w-4"
                                                    />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/admin/events/${event.id}/registrations`}
                                                    >
                                                        <Icon
                                                            iconNode={EyeIcon}
                                                            className="mr-2 h-4 w-4"
                                                        />
                                                        Lihat Pendaftar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => openEditDialog(event)}
                                                >
                                                    <Icon
                                                        iconNode={PencilIcon}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingEvent(event)}
                                                    className="text-red-600 dark:text-red-400"
                                                >
                                                    <Icon
                                                        iconNode={TrashIcon}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                event.is_published ? 'default' : 'secondary'
                                            }
                                        >
                                            {event.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                        {event.max_participants && (
                                            <Badge variant="outline">
                                                <Icon
                                                    iconNode={UsersIcon}
                                                    className="mr-1 h-3 w-3"
                                                />
                                                {event.registrations_count}/
                                                {event.max_participants}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CardDescription className="line-clamp-2">
                                        {event.description}
                                    </CardDescription>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Icon
                                                iconNode={CalendarIcon}
                                                className="h-4 w-4"
                                            />
                                            <span>{formatDate(event.event_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Icon
                                                iconNode={MapPinIcon}
                                                className="h-4 w-4"
                                            />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {events.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {events.data.length} dari {events.total} event
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={events.current_page === 1}
                                onClick={() =>
                                    router.get(
                                        '/admin/events',
                                        {
                                            page: events.current_page - 1,
                                            search: searchValue,
                                            status:
                                                statusFilter !== 'all'
                                                    ? statusFilter
                                                    : undefined,
                                        },
                                        { preserveState: true }
                                    )
                                }
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={events.current_page === events.last_page}
                                onClick={() =>
                                    router.get(
                                        '/admin/events',
                                        {
                                            page: events.current_page + 1,
                                            search: searchValue,
                                            status:
                                                statusFilter !== 'all'
                                                    ? statusFilter
                                                    : undefined,
                                        },
                                        { preserveState: true }
                                    )
                                }
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Event Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Buat Event Baru</DialogTitle>
                        <DialogDescription>
                            Isi form di bawah untuk membuat event baru
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-title">
                                Judul Event <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="create-title"
                                value={createForm.data.title}
                                onChange={(e) => createForm.setData('title', e.target.value)}
                                required
                            />
                            {createForm.errors.title && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-description">
                                Deskripsi <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="create-description"
                                value={createForm.data.description}
                                onChange={(e) =>
                                    createForm.setData('description', e.target.value)
                                }
                                rows={4}
                                required
                            />
                            {createForm.errors.description && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-location">
                                Lokasi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="create-location"
                                value={createForm.data.location}
                                onChange={(e) => createForm.setData('location', e.target.value)}
                                required
                            />
                            {createForm.errors.location && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.location}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-event-date">
                                    Tanggal Event <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-event-date"
                                    type="datetime-local"
                                    value={createForm.data.event_date}
                                    onChange={(e) =>
                                        createForm.setData('event_date', e.target.value)
                                    }
                                    required
                                />
                                {createForm.errors.event_date && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {createForm.errors.event_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-deadline">
                                    Batas Pendaftaran <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-deadline"
                                    type="datetime-local"
                                    value={createForm.data.registration_deadline}
                                    onChange={(e) =>
                                        createForm.setData('registration_deadline', e.target.value)
                                    }
                                    required
                                />
                                {createForm.errors.registration_deadline && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {createForm.errors.registration_deadline}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-max-participants">
                                Maksimal Peserta (opsional)
                            </Label>
                            <Input
                                id="create-max-participants"
                                type="number"
                                min="1"
                                value={createForm.data.max_participants}
                                onChange={(e) =>
                                    createForm.setData('max_participants', e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Kosongkan untuk unlimited peserta
                            </p>
                            {createForm.errors.max_participants && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.max_participants}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-image">Gambar Event (opsional)</Label>
                            <Input
                                id="create-image"
                                type="file"
                                accept="image/*"
                                onChange={handleCreateImageChange}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-48 w-full rounded-md object-cover"
                                    />
                                </div>
                            )}
                            {createForm.errors.image && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.image}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="create-is-published"
                                checked={createForm.data.is_published}
                                onChange={(e) =>
                                    createForm.setData('is_published', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="create-is-published" className="cursor-pointer">
                                Publish event sekarang
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    setImagePreview(null);
                                }}
                                disabled={createForm.processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Menyimpan...' : 'Buat Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>Perbarui informasi event</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">
                                Judul Event <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-title"
                                value={editForm.data.title}
                                onChange={(e) => editForm.setData('title', e.target.value)}
                                required
                            />
                            {editForm.errors.title && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">
                                Deskripsi <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                rows={4}
                                required
                            />
                            {editForm.errors.description && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-location">
                                Lokasi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-location"
                                value={editForm.data.location}
                                onChange={(e) => editForm.setData('location', e.target.value)}
                                required
                            />
                            {editForm.errors.location && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.location}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-event-date">
                                    Tanggal Event <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-event-date"
                                    type="datetime-local"
                                    value={editForm.data.event_date}
                                    onChange={(e) =>
                                        editForm.setData('event_date', e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.event_date && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {editForm.errors.event_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-deadline">
                                    Batas Pendaftaran <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-deadline"
                                    type="datetime-local"
                                    value={editForm.data.registration_deadline}
                                    onChange={(e) =>
                                        editForm.setData('registration_deadline', e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.registration_deadline && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {editForm.errors.registration_deadline}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-max-participants">
                                Maksimal Peserta (opsional)
                            </Label>
                            <Input
                                id="edit-max-participants"
                                type="number"
                                min="1"
                                value={editForm.data.max_participants}
                                onChange={(e) =>
                                    editForm.setData('max_participants', e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Kosongkan untuk unlimited peserta
                            </p>
                            {editForm.errors.max_participants && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.max_participants}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Gambar Event Baru (opsional)</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageChange}
                            />
                            {editImagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={editImagePreview}
                                        alt="Preview"
                                        className="h-48 w-full rounded-md object-cover"
                                    />
                                </div>
                            )}
                            {editForm.errors.image && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.image}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-is-published"
                                checked={editForm.data.is_published}
                                onChange={(e) =>
                                    editForm.setData('is_published', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="edit-is-published" className="cursor-pointer">
                                Event dipublish
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditingEvent(null);
                                    setEditImagePreview(null);
                                }}
                                disabled={editForm.processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus event{' '}
                            <strong>{deletingEvent?.title}</strong>? Semua data pendaftaran juga
                            akan terhapus. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
