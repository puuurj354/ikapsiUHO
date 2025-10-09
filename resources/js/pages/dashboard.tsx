import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    GraduationCap,
    User,
    Calendar,
    CheckCircle,
    AlertCircle,
    BookOpen,
    MessageSquare,
    Settings
} from 'lucide-react';
import { dashboard } from '@/routes';

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
    const { user_profile, statistics, recent_alumni, alumni_by_year } = dashboardData;

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

            <div className="container mx-auto py-8 space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Selamat Datang, {user_profile.name}!
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Dashboard IKAPSI UHO - Ikatan Alumni Psikologi Universitas Halu Oleo
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {user_profile.email_verified ? (
                            <Badge variant="secondary" className="text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Email Terverifikasi
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Email Belum Terverifikasi
                            </Badge>
                        )}
                        {user_profile.two_factor_enabled && (
                            <Badge variant="outline">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                2FA Aktif
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Profile Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Profil Alumni
                        </CardTitle>
                        <CardDescription>
                            Informasi profil Anda sebagai alumni IKAPSI UHO
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                                <p className="text-sm">{user_profile.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-sm">{user_profile.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Angkatan</p>
                                <p className="text-sm">{user_profile.angkatan || 'Belum diisi'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Profesi</p>
                                <p className="text-sm">{user_profile.profesi || 'Belum diisi'}</p>
                            </div>
                        </div>
                        {user_profile.bio && (
                            <div className="mt-4 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                                <p className="text-sm">{user_profile.bio}</p>
                            </div>
                        )}
                        <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Update Profil
                            </Button>
                            <Button variant="outline" size="sm">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Lengkapi Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <Icon iconNode={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Alumni & Alumni by Year */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Alumni */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
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
                                        <div key={alumni.id} className="flex items-center space-x-4">
                                            <div className="bg-primary/10 text-primary rounded-lg p-3">
                                                <Icon iconNode={User} className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{alumni.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {alumni.angkatan && `Angkatan ${alumni.angkatan}`}
                                                    {alumni.profesi && ` • ${alumni.profesi}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Icon iconNode={Users} className="h-12 w-12 mx-auto mb-3 opacity-50" />
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
                                <GraduationCap className="w-5 h-5 mr-2" />
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
                                        <div key={item.angkatan} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-primary/10 text-primary rounded-lg p-3">
                                                    <Icon iconNode={GraduationCap} className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Angkatan {item.angkatan}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.total} alumni
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{item.total}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Icon iconNode={GraduationCap} className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>Belum ada data alumni berdasarkan angkatan</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                <Icon iconNode={Users} className="h-6 w-6" />
                                <span className="text-sm font-medium">Direktori Alumni</span>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                <Icon iconNode={MessageSquare} className="h-6 w-6" />
                                <span className="text-sm font-medium">Forum Diskusi</span>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                <Icon iconNode={Calendar} className="h-6 w-6" />
                                <span className="text-sm font-medium">Event & Kegiatan</span>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                <Icon iconNode={BookOpen} className="h-6 w-6" />
                                <span className="text-sm font-medium">Berita & Artikel</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
