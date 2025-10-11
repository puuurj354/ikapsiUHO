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
import { Icon } from '@/components/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import {
    Briefcase,
    Calendar,
    GraduationCap,
    HelpCircle,
    MessageSquare,
    MoreVertical,
    Pencil,
    Plus,
    Tag,
    Trash2,
    TrendingUp,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ForumCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string;
    color: string;
    discussions_count: number;
}

interface Props {
    categories: ForumCategory[];
}

// Available icons for categories
const availableIcons = [
    { value: 'MessageSquare', label: 'Message Square', icon: MessageSquare },
    { value: 'Users', label: 'Users', icon: Users },
    { value: 'Calendar', label: 'Calendar', icon: Calendar },
    { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
    { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
    { value: 'GraduationCap', label: 'Graduation Cap', icon: GraduationCap },
    { value: 'HelpCircle', label: 'Help Circle', icon: HelpCircle },
];

export default function ForumCategoriesIndex({ categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '#' },
        { title: 'Kategori Forum', href: '/admin/forum/categories' },
    ];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<ForumCategory | null>(null);

    const createForm = useForm({
        name: '',
        description: '',
        icon: 'MessageSquare',
        color: '#3b82f6',
    });

    const editForm = useForm({
        name: '',
        description: '',
        icon: 'MessageSquare',
        color: '#3b82f6',
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/admin/forum/categories', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCategory) {
            editForm.put(`/admin/forum/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setEditingCategory(null);
                    editForm.reset();
                },
            });
        }
    };

    const openEditDialog = (category: ForumCategory) => {
        setEditingCategory(category);
        editForm.setData({
            name: category.name,
            description: category.description || '',
            icon: category.icon,
            color: category.color,
        });
        setIsEditOpen(true);
    };

    const handleDelete = (categoryId: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus kategori ini? Kategori yang memiliki diskusi tidak dapat dihapus.',
            )
        ) {
            router.delete(`/admin/forum/categories/${categoryId}`, {
                preserveScroll: true,
            });
        }
    };

    const getIconComponent = (iconName: string) => {
        const icon = availableIcons.find((i) => i.value === iconName);
        return icon ? icon.icon : MessageSquare;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kategori Forum" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Manajemen Kategori Forum
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori untuk forum diskusi
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
                                    diskusi
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
                                            <TableHead>Ikon</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead>Warna</TableHead>
                                            <TableHead className="text-center">
                                                Diskusi
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
                                                    <div
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                                                        style={{
                                                            backgroundColor: `${category.color}20`,
                                                        }}
                                                    >
                                                        <Icon
                                                            iconNode={getIconComponent(
                                                                category.icon,
                                                            )}
                                                            className="h-5 w-5"
                                                            style={{
                                                                color: category.color,
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {category.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {category.description ||
                                                            '-'}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-4 w-4 rounded"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color,
                                                            }}
                                                        />
                                                        <code className="text-xs">
                                                            {category.color}
                                                        </code>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {category.discussions_count}
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
                                                                disabled={
                                                                    category.discussions_count >
                                                                    0
                                                                }
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
                            Buat kategori baru untuk forum diskusi
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
                                placeholder="Contoh: Diskusi Umum"
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

                        <div className="space-y-2">
                            <Label htmlFor="create-icon">Ikon</Label>
                            <Select
                                value={createForm.data.icon}
                                onValueChange={(value) =>
                                    createForm.setData('icon', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih ikon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableIcons.map((icon) => (
                                        <SelectItem
                                            key={icon.value}
                                            value={icon.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    iconNode={icon.icon}
                                                    className="h-4 w-4"
                                                />
                                                {icon.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
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
                            Perbarui informasi kategori forum
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
                                placeholder="Contoh: Diskusi Umum"
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

                        <div className="space-y-2">
                            <Label htmlFor="edit-icon">Ikon</Label>
                            <Select
                                value={editForm.data.icon}
                                onValueChange={(value) =>
                                    editForm.setData('icon', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih ikon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableIcons.map((icon) => (
                                        <SelectItem
                                            key={icon.value}
                                            value={icon.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    iconNode={icon.icon}
                                                    className="h-4 w-4"
                                                />
                                                {icon.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
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
