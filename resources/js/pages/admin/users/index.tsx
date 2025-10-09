import { Icon } from '@/components/icon';
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
import { Button } from '@/components/ui/button';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CirclePlusIcon,
    EllipsisIcon,
    PencilIcon,
    TrashIcon,
} from 'lucide-react';
import React, { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'ALUMNI';
    angkatan?: number;
    profesi?: string;
    profile_picture_url: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    filters: {
        search?: string;
        role?: string;
        angkatan?: string;
    };
}

export default function UserManagement({ users, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard Admin', href: '/admin/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/users' },
    ];

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [angkatanFilter, setAngkatanFilter] = useState(
        filters.angkatan || 'all',
    );

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'ALUMNI' as 'ADMIN' | 'ALUMNI',
        angkatan: '',
        profesi: '',
        profile_picture: null as File | null,
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: 'ALUMNI' as 'ADMIN' | 'ALUMNI',
        angkatan: '',
        profesi: '',
        password: '',
        password_confirmation: '',
        profile_picture: null as File | null,
    });

    // Handle search with debounce
    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.get(
            '/admin/users',
            {
                search: value,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                angkatan: angkatanFilter !== 'all' ? angkatanFilter : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    // Handle filter change
    const handleFilterChange = (type: 'role' | 'angkatan', value: string) => {
        if (type === 'role') {
            setRoleFilter(value);
            router.get(
                '/admin/users',
                {
                    search: searchValue,
                    role: value !== 'all' ? value : undefined,
                    angkatan:
                        angkatanFilter !== 'all' ? angkatanFilter : undefined,
                },
                { preserveState: true, replace: true },
            );
        } else {
            setAngkatanFilter(value);
            router.get(
                '/admin/users',
                {
                    search: searchValue,
                    role: roleFilter !== 'all' ? roleFilter : undefined,
                    angkatan: value !== 'all' ? value : undefined,
                },
                { preserveState: true, replace: true },
            );
        }
    };

    // Handle create user
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setIsCreateDialogOpen(false);
            },
        });
    };

    // Handle edit user
    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.post(`/admin/users/${editingUser.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                editForm.reset();
                setEditingUser(null);
            },
        });
    };

    // Handle delete user
    const handleDelete = () => {
        if (!deletingUser) return;

        router.delete(`/admin/users/${deletingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingUser(null);
            },
        });
    };

    // Open edit dialog
    const openEditDialog = (user: User) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            angkatan: user.angkatan?.toString() || '',
            profesi: user.profesi || '',
            password: '',
            password_confirmation: '',
            profile_picture: null,
        });
    };

    // Generate angkatan options (2000-2025)
    const angkatanOptions = Array.from({ length: 26 }, (_, i) => 2025 - i);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manajemen Pengguna
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data pengguna dan hak akses sistem
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Icon
                            iconNode={CirclePlusIcon}
                            className="mr-2 h-4 w-4"
                        />
                        Tambah Pengguna
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Cari nama atau email..."
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onValueChange={(value) =>
                            handleFilterChange('role', value)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Role</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="ALUMNI">Alumni</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={angkatanFilter}
                        onValueChange={(value) =>
                            handleFilterChange('angkatan', value)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Angkatan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Angkatan</SelectItem>
                            {angkatanOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    Angkatan {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Foto</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Angkatan</TableHead>
                                <TableHead>Profesi</TableHead>
                                <TableHead className="w-[80px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data pengguna
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <img
                                                src={user.profile_picture_url}
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    user.role === 'ADMIN'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.angkatan || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {user.profesi || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Icon
                                                            iconNode={
                                                                EllipsisIcon
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openEditDialog(user)
                                                        }
                                                    >
                                                        <Icon
                                                            iconNode={
                                                                PencilIcon
                                                            }
                                                            className="mr-2 h-4 w-4"
                                                        />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setDeletingUser(
                                                                user,
                                                            )
                                                        }
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {users.data.length} dari {users.total}{' '}
                            pengguna
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={users.current_page === 1}
                                onClick={() =>
                                    router.get(
                                        '/admin/users',
                                        {
                                            page: users.current_page - 1,
                                            search: searchValue,
                                            role:
                                                roleFilter !== 'all'
                                                    ? roleFilter
                                                    : undefined,
                                            angkatan:
                                                angkatanFilter !== 'all'
                                                    ? angkatanFilter
                                                    : undefined,
                                        },
                                        { preserveState: true },
                                    )
                                }
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    users.current_page === users.last_page
                                }
                                onClick={() =>
                                    router.get(
                                        '/admin/users',
                                        {
                                            page: users.current_page + 1,
                                            search: searchValue,
                                            role:
                                                roleFilter !== 'all'
                                                    ? roleFilter
                                                    : undefined,
                                            angkatan:
                                                angkatanFilter !== 'all'
                                                    ? angkatanFilter
                                                    : undefined,
                                        },
                                        { preserveState: true },
                                    )
                                }
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create User Dialog */}
            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                        <DialogDescription>
                            Isi form di bawah untuk menambahkan pengguna baru
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nama Lengkap</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                required
                            />
                            {createForm.errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) =>
                                    createForm.setData('email', e.target.value)
                                }
                                required
                            />
                            {createForm.errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-password">
                                    Password
                                </Label>
                                <Input
                                    id="create-password"
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.password && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {createForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-password-confirmation">
                                    Konfirmasi Password
                                </Label>
                                <Input
                                    id="create-password-confirmation"
                                    type="password"
                                    value={
                                        createForm.data.password_confirmation
                                    }
                                    onChange={(e) =>
                                        createForm.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-role">Role</Label>
                            <Select
                                value={createForm.data.role}
                                onValueChange={(value: 'ADMIN' | 'ALUMNI') =>
                                    createForm.setData('role', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="ALUMNI">
                                        Alumni
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {createForm.errors.role && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.role}
                                </p>
                            )}
                        </div>

                        {createForm.data.role === 'ALUMNI' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-angkatan">
                                            Angkatan
                                        </Label>
                                        <Select
                                            value={createForm.data.angkatan}
                                            onValueChange={(value) =>
                                                createForm.setData(
                                                    'angkatan',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih angkatan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {angkatanOptions.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.angkatan && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {createForm.errors.angkatan}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="create-profesi">
                                            Profesi
                                        </Label>
                                        <Input
                                            id="create-profesi"
                                            value={createForm.data.profesi}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    'profesi',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {createForm.errors.profesi && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {createForm.errors.profesi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="create-profile-picture">
                                Foto Profil
                            </Label>
                            <Input
                                id="create-profile-picture"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        createForm.setData(
                                            'profile_picture',
                                            file,
                                        );
                                    }
                                }}
                            />
                            {createForm.errors.profile_picture && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createForm.errors.profile_picture}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                disabled={createForm.processing}
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

            {/* Edit User Dialog */}
            <Dialog
                open={!!editingUser}
                onOpenChange={() => setEditingUser(null)}
            >
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi pengguna
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nama Lengkap</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                required
                            />
                            {editForm.errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                                required
                            />
                            {editForm.errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(value: 'ADMIN' | 'ALUMNI') =>
                                    editForm.setData('role', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="ALUMNI">
                                        Alumni
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {editForm.errors.role && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.role}
                                </p>
                            )}
                        </div>

                        {editForm.data.role === 'ALUMNI' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-angkatan">
                                            Angkatan
                                        </Label>
                                        <Select
                                            value={editForm.data.angkatan}
                                            onValueChange={(value) =>
                                                editForm.setData(
                                                    'angkatan',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih angkatan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {angkatanOptions.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {editForm.errors.angkatan && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {editForm.errors.angkatan}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-profesi">
                                            Profesi
                                        </Label>
                                        <Input
                                            id="edit-profesi"
                                            value={editForm.data.profesi}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    'profesi',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {editForm.errors.profesi && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {editForm.errors.profesi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-password">
                                    Password Baru (opsional)
                                </Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.password && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {editForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-password-confirmation">
                                    Konfirmasi Password
                                </Label>
                                <Input
                                    id="edit-password-confirmation"
                                    type="password"
                                    value={editForm.data.password_confirmation}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-profile-picture">
                                Foto Profil Baru (opsional)
                            </Label>
                            <Input
                                id="edit-profile-picture"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        editForm.setData(
                                            'profile_picture',
                                            file,
                                        );
                                    }
                                }}
                            />
                            {editForm.errors.profile_picture && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {editForm.errors.profile_picture}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                                disabled={editForm.processing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingUser}
                onOpenChange={() => setDeletingUser(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengguna{' '}
                            <strong>{deletingUser?.name}</strong>? Tindakan ini
                            tidak dapat dibatalkan.
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
