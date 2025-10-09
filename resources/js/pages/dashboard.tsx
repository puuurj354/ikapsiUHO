import { Icon } from '@/components/icon';
import { ProfileUpdateModal } from '@/components/profile-update-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle,
    GraduationCap,
    MessageSquare,
    Settings,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface UserProfile {
    name: string;
    email: string;
    angkatan: string | null;
    profesi: string | null;
    bio: string | null;
    email_verified: boolean;
    two_factor_enabled: boolean;
}

interface Statistics {
    total_alumni: number;
    alumni_in_same_year: number;
    recent_registrations: number;
}

interface RecentAlumni {
    id: number;
    name: string;
    angkatan: string | null;
    profesi: string | null;
    created_at: string;
}

interface AlumniByYear {
    angkatan: string;
    total: number;
}

interface DashboardData {
    user_profile: UserProfile;
    statistics: Statistics;
    recent_alumni: RecentAlumni[];
    alumni_by_year: AlumniByYear[];
}

interface DashboardProps {
    dashboardData: DashboardData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ dashboardData }: DashboardProps) {
    const { user_profile, statistics, recent_alumni, alumni_by_year } =
        dashboardData;

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const statCards = [
        {
            title: 'Total Alumni',
            value: statistics.total_alumni.toLocaleString('id-ID'),
            description: 'Alumni terdaftar',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-950',
        },
        {
            title: 'Teman Angkatan',
            value: statistics.alumni_in_same_year.toLocaleString('id-ID'),
            description: `Angkatan ${user_profile.angkatan || 'N/A'}`,
            icon: GraduationCap,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-950',
        },
        {
            title: 'Registrasi Baru',
            value: statistics.recent_registrations.toLocaleString('id-ID'),
            description: '30 hari terakhir',
            icon: Calendar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-950',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Alumni" />

            <div className="container mx-auto space-y-8 py-8">
                {/* Welcome Header */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Selamat Datang, {user_profile.name}!
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Dashboard IKAPSI UHO - Ikatan Alumni Psikologi
                            Universitas Halu Oleo
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {user_profile.email_verified ? (
                            <Badge
                                variant="secondary"
                                className="text-green-600"
                            >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Email Terverifikasi
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Email Belum Terverifikasi
                            </Badge>
                        )}
                        {user_profile.two_factor_enabled && (
                            <Badge variant="outline">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                2FA Aktif
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Profile Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Profil Alumni
                        </CardTitle>
                        <CardDescription>
                            Informasi profil Anda sebagai alumni IKAPSI UHO
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama Lengkap
                                </p>
                                <p className="text-sm">{user_profile.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Email
                                </p>
                                <p className="text-sm">{user_profile.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Angkatan
                                </p>
                                <p className="text-sm">
                                    {user_profile.angkatan || 'Belum diisi'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Profesi
                                </p>
                                <p className="text-sm">
                                    {user_profile.profesi || 'Belum diisi'}
                                </p>
                            </div>
                        </div>
                        {user_profile.bio && (
                            <div className="mt-4 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Bio
                                </p>
                                <p className="text-sm">{user_profile.bio}</p>
                            </div>
                        )}
                        <div className="mt-4 flex space-x-2">
                            <Link href="/settings/profile">
                                <Button variant="outline" size="sm">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Update Profil
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsProfileModalOpen(true)}
                            >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Lengkapi Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {statCards.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`rounded-lg p-2 ${stat.bgColor}`}
                                    >
                                        <Icon
                                            iconNode={stat.icon}
                                            className={`h-5 w-5 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stat.value}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Alumni & Alumni by Year */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Alumni */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Alumni Terbaru
                            </CardTitle>
                            <CardDescription>
                                Alumni yang baru bergabung
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_alumni.length > 0 ? (
                                    recent_alumni.map((alumni) => (
                                        <div
                                            key={alumni.id}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                                <Icon
                                                    iconNode={User}
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold">
                                                    {alumni.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {alumni.angkatan &&
                                                        `Angkatan ${alumni.angkatan}`}
                                                    {alumni.profesi &&
                                                        ` • ${alumni.profesi}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Icon
                                            iconNode={Users}
                                            className="mx-auto mb-3 h-12 w-12 opacity-50"
                                        />
                                        <p>Belum ada alumni terbaru</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alumni by Year */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <GraduationCap className="mr-2 h-5 w-5" />
                                Alumni per Angkatan
                            </CardTitle>
                            <CardDescription>
                                Distribusi alumni berdasarkan angkatan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {alumni_by_year.length > 0 ? (
                                    alumni_by_year.map((item) => (
                                        <div
                                            key={item.angkatan}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                                    <Icon
                                                        iconNode={GraduationCap}
                                                        className="h-5 w-5"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        Angkatan {item.angkatan}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.total} alumni
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">
                                                    {item.total}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Icon
                                            iconNode={GraduationCap}
                                            className="mx-auto mb-3 h-12 w-12 opacity-50"
                                        />
                                        <p>
                                            Belum ada data alumni berdasarkan
                                            angkatan
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                        <CardDescription>Menu navigasi alumni</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <Link
                                href="/alumni/directory"
                                className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                            >
                                <Icon
                                    iconNode={Users}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">
                                    Direktori Alumni
                                </span>
                            </Link>
                            <div className="flex items-center space-x-3 rounded-lg border p-4">
                                <Icon
                                    iconNode={MessageSquare}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">
                                    Forum Diskusi
                                </span>
                            </div>
                            <Link
                                href="/events"
                                className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                            >
                                <Icon
                                    iconNode={Calendar}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">
                                    Event & Kegiatan
                                </span>
                            </Link>
                            <div className="flex items-center space-x-3 rounded-lg border p-4">
                                <Icon
                                    iconNode={BookOpen}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">
                                    Berita & Artikel
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ProfileUpdateModal
                    open={isProfileModalOpen}
                    onOpenChange={setIsProfileModalOpen}
                    currentData={{
                        angkatan: user_profile.angkatan,
                        profesi: user_profile.profesi,
                        bio: user_profile.bio,
                    }}
                />
            </div>
        </AppLayout>
    );
}
