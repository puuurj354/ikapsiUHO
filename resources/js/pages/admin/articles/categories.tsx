import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { MoreVertical, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    order: number;
    is_active: boolean;
    articles_count: number;
}

interface Props {
    categories: ArticleCategory[];
}

export default function ArticleCategoriesIndex({ categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '#' },
        { title: 'Kategori Artikel', href: '/admin/articles/categories' },
    ];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<ArticleCategory | null>(null);

    const createForm = useForm({
        name: '',
        description: '',
        color: '#3b82f6',
        order: categories.length + 1,
    });

    const editForm = useForm({
        name: '',
        description: '',
        color: '#3b82f6',
        order: 0,
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/admin/articles/categories', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCategory) {
            editForm.put(`/admin/articles/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setEditingCategory(null);
                    editForm.reset();
                },
            });
        }
    };

    const openEditDialog = (category: ArticleCategory) => {
        setEditingCategory(category);
        editForm.setData({
            name: category.name,
            description: category.description || '',
            color: category.color,
            order: category.order,
        });
        setIsEditOpen(true);
    };

    const handleDelete = (categoryId: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus kategori ini? Artikel dengan kategori ini akan kehilangan kategorinya.',
            )
        ) {
            router.delete(`/admin/articles/categories/${categoryId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleToggleActive = (categoryId: number) => {
        router.post(
            `/admin/articles/categories/${categoryId}/toggle-active`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kategori Artikel" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Manajemen Kategori Artikel
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori untuk artikel alumni
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Categories Table */}
                <Card>
                    <CardContent className="p-0">
                        {categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">
                                    Belum Ada Kategori
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Buat kategori pertama untuk mengorganisir
                                    artikel
                                </p>
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kategori
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Urutan</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead>Warna</TableHead>
                                            <TableHead className="text-center">
                                                Artikel
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    {category.order}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-4 w-4 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color,
                                                            }}
                                                        />
                                                        <span className="font-medium">
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {category.description ||
                                                            '-'}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="rounded bg-muted px-2 py-1 text-xs">
                                                        {category.color}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {category.articles_count}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant={
                                                            category.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                category.id,
                                                            )
                                                        }
                                                    >
                                                        {category.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </Button>
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
                                                                    openEditDialog(
                                                                        category,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id,
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
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori Baru</DialogTitle>
                        <DialogDescription>
                            Buat kategori baru untuk artikel alumni
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">
                                Nama Kategori
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                placeholder="Contoh: Psikologi Klinis"
                            />
                            {createForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {createForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-description">
                                Deskripsi (Opsional)
                            </Label>
                            <Textarea
                                id="create-description"
                                value={createForm.data.description}
                                onChange={(e) =>
                                    createForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Deskripsi singkat kategori"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="create-color">Warna</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="create-color"
                                        type="color"
                                        value={createForm.data.color}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'color',
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 w-20"
                                    />
                                    <Input
                                        type="text"
                                        value={createForm.data.color}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'color',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="#3b82f6"
                                    />
                                </div>
                            </div>

                            <div className="w-24 space-y-2">
                                <Label htmlFor="create-order">Urutan</Label>
                                <Input
                                    id="create-order"
                                    type="number"
                                    min="1"
                                    value={createForm.data.order}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'order',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kategori</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi kategori artikel
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">
                                Nama Kategori
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                placeholder="Contoh: Psikologi Klinis"
                            />
                            {editForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {editForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">
                                Deskripsi (Opsional)
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Deskripsi singkat kategori"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="edit-color">Warna</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="edit-color"
                                        type="color"
                                        value={editForm.data.color}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'color',
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 w-20"
                                    />
                                    <Input
                                        type="text"
                                        value={editForm.data.color}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'color',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="#3b82f6"
                                    />
                                </div>
                            </div>

                            <div className="w-24 space-y-2">
                                <Label htmlFor="edit-order">Urutan</Label>
                                <Input
                                    id="edit-order"
                                    type="number"
                                    min="1"
                                    value={editForm.data.order}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'order',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? 'Menyimpan...'
                                    : 'Perbarui'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
