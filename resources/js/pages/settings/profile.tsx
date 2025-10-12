import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Profil',
        href: edit().url,
    },
];

// Generate year options (2000 - current year + 1)
const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: currentYear - 1999 + 1 }, (_, i) =>
    (2000 + i).toString(),
);

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            email: auth.user.email,
            angkatan: auth.user.angkatan || '',
            profesi: auth.user.profesi || '',
            bio: auth.user.bio || '',
            profile_picture: null as File | null,
            _method: 'PATCH',
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_picture', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearProfilePicture = () => {
        setPreviewUrl(null);
        setData('profile_picture', null);
        const fileInput = document.getElementById(
            'profile_picture',
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const currentProfilePicture =
        previewUrl || auth.user.profile_picture_url || null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(ProfileController.update.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Informasi Profil"
                        description="Perbarui nama, email, dan foto profil Anda"
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="profile_picture">Foto Profil</Label>

                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={currentProfilePicture || ''}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback>
                                        {auth.user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        'profile_picture',
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            <Upload className="h-4 w-4" />
                                            Pilih Foto
                                        </Button>

                                        {(previewUrl ||
                                            auth.user.profile_picture_url) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={clearProfilePicture}
                                            >
                                                <X className="h-4 w-4" />
                                                Hapus
                                            </Button>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG atau GIF (maksimal 2MB)
                                    </p>
                                </div>
                            </div>

                            <Input
                                id="profile_picture"
                                type="file"
                                name="profile_picture"
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.profile_picture}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                autoComplete="name"
                                placeholder="Nama lengkap"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Alamat Email</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                autoComplete="username"
                                placeholder="Alamat email"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="angkatan">
                                Tahun Lulus (Angkatan)
                            </Label>

                            <Select
                                name="angkatan"
                                value={
                                    typeof data.angkatan === 'string'
                                        ? data.angkatan
                                        : ''
                                }
                                onValueChange={(value) =>
                                    setData('angkatan', value)
                                }
                            >
                                <SelectTrigger id="angkatan">
                                    <SelectValue placeholder="Pilih tahun lulus" />
                                </SelectTrigger>
                                <SelectContent>
                                    {graduationYears.reverse().map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <InputError
                                className="mt-2"
                                message={errors.angkatan}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="profesi">Profesi</Label>

                            <Input
                                id="profesi"
                                className="mt-1 block w-full"
                                value={
                                    typeof data.profesi === 'string'
                                        ? data.profesi
                                        : ''
                                }
                                onChange={(e) =>
                                    setData('profesi', e.target.value)
                                }
                                autoComplete="organization-title"
                                placeholder="Psikolog, Konselor, dll"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.profesi}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>

                            <Textarea
                                id="bio"
                                className="mt-1 block w-full"
                                value={
                                    typeof data.bio === 'string' ? data.bio : ''
                                }
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Ceritakan sedikit tentang Anda..."
                                rows={4}
                            />

                            <InputError className="mt-2" message={errors.bio} />
                        </div>

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Alamat email Anda belum terverifikasi.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Klik di sini untuk mengirim ulang
                                            email verifikasi.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            Link verifikasi baru telah dikirim
                                            ke alamat email Anda.
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                data-test="update-profile-button"
                            >
                                Simpan
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Tersimpan
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
