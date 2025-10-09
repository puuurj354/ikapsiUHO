import { Icon } from '@/components/icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    GraduationCap,
    TrendingUp,
    UserCog,
    Users,
} from 'lucide-react';

interface AlumniByYear {
    year: string;
    total: number;
}

interface AdminDashboardStatistics {
    total_users: number;
    total_alumni: number;
    total_admins: number;
    recent_registrations: number;
    alumni_by_year: AlumniByYear[];
}

interface AdminDashboardProps {
    statistics: AdminDashboardStatistics;
}

export default function AdminDashboard({ statistics }: AdminDashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '#' },
        { title: 'Dashboard', href: '#' },
    ];

    const statCards = [
        {
            title: 'Total Pengguna',
            value: statistics.total_users.toLocaleString('id-ID'),
            description: 'Semua pengguna terdaftar',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-950',
        },
        {
            title: 'Total Alumni',
            value: statistics.total_alumni.toLocaleString('id-ID'),
            description: 'Alumni terdaftar',
            icon: GraduationCap,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-950',
        },
        {
            title: 'Total Admin',
            value: statistics.total_admins.toLocaleString('id-ID'),
            description: 'Admin aktif',
            icon: UserCog,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-950',
        },
        {
            title: 'Registrasi Bulan Ini',
            value: statistics.recent_registrations.toLocaleString('id-ID'),
            description: '30 hari terakhir',
            icon: CalendarDays,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-950',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="container mx-auto space-y-8 py-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard Admin
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Selamat datang di panel administrasi IKAPSI UHO
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="overflow-hidden">
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

                {/* Alumni by Year */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Alumni per Angkatan</CardTitle>
                                <CardDescription>
                                    5 Angkatan terbaru
                                </CardDescription>
                            </div>
                            <Icon
                                iconNode={TrendingUp}
                                className="h-5 w-5 text-muted-foreground"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {statistics.alumni_by_year.length > 0 ? (
                                statistics.alumni_by_year.map((item, index) => (
                                    <div
                                        key={index}
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
                                                    Angkatan {item.year}
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

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                        <CardDescription>Menu manajemen admin</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <button className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                                <Icon
                                    iconNode={Users}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">
                                    Kelola Alumni
                                </span>
                            </button>
                            <button className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                                <Icon
                                    iconNode={CalendarDays}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">
                                    Kelola Event
                                </span>
                            </button>
                            <button className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                                <Icon
                                    iconNode={UserCog}
                                    className="h-5 w-5 text-primary"
                                />
                                <span className="font-medium">Pengaturan</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
