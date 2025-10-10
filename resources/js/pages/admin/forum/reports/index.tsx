import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Eye,
    Flag,
    MoreVertical,
    Trash2,
    XCircle,
} from 'lucide-react';
import React from 'react';

interface User {
    id: number;
    name: string;
    profile_picture_url: string;
}

interface Reportable {
    id: number;
    title?: string;
    content: string;
    user?: User;
}

interface Report {
    id: number;
    reason: string;
    description: string | null;
    status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
    created_at: string;
    reviewed_at: string | null;
    admin_notes: string | null;
    reporter: User;
    reviewer: User | null;
    reportable_type: string;
    reportable_id: number;
    reportable: Reportable;
}

interface PaginatedReports {
    data: Report[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    reports: PaginatedReports;
    activeTab: 'pending' | 'reviewed' | 'resolved' | 'rejected' | 'all';
}

export default function AdminReportsIndex({ reports, activeTab }: Props) {
    const [selectedReport, setSelectedReport] = React.useState<Report | null>(
        null,
    );
    const [adminNotes, setAdminNotes] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Laporan Forum', href: '/admin/forum/reports' },
    ];

    const getReasonLabel = (reason: string) => {
        const labels: Record<string, string> = {
            spam: 'Spam',
            inappropriate: 'Tidak Pantas',
            offensive: 'Menyinggung',
            harassment: 'Pelecehan',
            other: 'Lainnya',
        };
        return labels[reason] || reason;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<
            string,
            {
                variant: 'default' | 'secondary' | 'destructive' | 'outline';
                icon: React.ReactNode;
            }
        > = {
            pending: {
                variant: 'default',
                icon: <Clock className="mr-1 h-3 w-3" />,
            },
            reviewed: {
                variant: 'secondary',
                icon: <Eye className="mr-1 h-3 w-3" />,
            },
            resolved: {
                variant: 'outline',
                icon: <CheckCircle className="mr-1 h-3 w-3" />,
            },
            rejected: {
                variant: 'destructive',
                icon: <XCircle className="mr-1 h-3 w-3" />,
            },
        };
        const config = variants[status] || variants.pending;
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            reviewed: 'Ditinjau',
            resolved: 'Selesai',
            rejected: 'Ditolak',
        };

        return (
            <Badge variant={config.variant}>
                {config.icon}
                {labels[status] || status}
            </Badge>
        );
    };

    const getReportableTypeLabel = (type: string) => {
        if (type.includes('ForumDiscussion')) return 'Diskusi';
        if (type.includes('ForumReply')) return 'Balasan';
        return 'Konten';
    };

    const handleUpdateStatus = (
        reportId: number,
        newStatus: 'reviewed' | 'resolved' | 'rejected',
    ) => {
        setIsProcessing(true);
        router.patch(
            `/admin/forum/reports/${reportId}`,
            {
                status: newStatus,
                admin_notes: adminNotes || null,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                    setSelectedReport(null);
                    setAdminNotes('');
                },
            },
        );
    };

    const handleDeleteContent = (reportId: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus konten yang dilaporkan? Tindakan ini tidak dapat dibatalkan.',
            )
        ) {
            setIsProcessing(true);
            router.delete(`/admin/forum/reports/${reportId}`, {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                    setSelectedReport(null);
                },
            });
        }
    };

    const changeTab = (tab: string) => {
        const url =
            tab === 'all'
                ? '/admin/forum/reports'
                : `/admin/forum/reports?status=${tab}`;
        router.get(url, {}, { preserveScroll: false });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Forum - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Laporan Forum
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Kelola laporan konten dari pengguna
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
                        <Flag className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Laporan
                            </p>
                            <p className="text-2xl font-bold">
                                {reports.total}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={changeTab}>
                    <TabsList>
                        <TabsTrigger value="all">Semua</TabsTrigger>
                        <TabsTrigger value="pending">Menunggu</TabsTrigger>
                        <TabsTrigger value="reviewed">Ditinjau</TabsTrigger>
                        <TabsTrigger value="resolved">Selesai</TabsTrigger>
                        <TabsTrigger value="rejected">Ditolak</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                        {reports.data.length > 0 ? (
                            <div className="space-y-4">
                                {reports.data.map((report) => (
                                    <Card key={report.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(
                                                            report.status,
                                                        )}
                                                        <Badge variant="outline">
                                                            {getReportableTypeLabel(
                                                                report.reportable_type,
                                                            )}
                                                        </Badge>
                                                        <Badge variant="secondary">
                                                            {getReasonLabel(
                                                                report.reason,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            {report.reportable
                                                                .title ||
                                                                'Balasan Forum'}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Dilaporkan oleh{' '}
                                                            {
                                                                report.reporter
                                                                    .name
                                                            }{' '}
                                                            •{' '}
                                                            {formatDate(
                                                                report.created_at,
                                                            )}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {report.status ===
                                                            'pending' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedReport(
                                                                            report,
                                                                        );
                                                                        handleUpdateStatus(
                                                                            report.id,
                                                                            'reviewed',
                                                                        );
                                                                    }}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Tandai
                                                                    Ditinjau
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}
                                                        {(report.status ===
                                                            'pending' ||
                                                            report.status ===
                                                                'reviewed') && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedReport(
                                                                            report,
                                                                        );
                                                                        handleUpdateStatus(
                                                                            report.id,
                                                                            'resolved',
                                                                        );
                                                                    }}
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Tandai
                                                                    Selesai
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedReport(
                                                                            report,
                                                                        );
                                                                        handleUpdateStatus(
                                                                            report.id,
                                                                            'rejected',
                                                                        );
                                                                    }}
                                                                    className="text-amber-600"
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Tolak
                                                                    Laporan
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDeleteContent(
                                                                            report.id,
                                                                        )
                                                                    }
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus Konten
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Reported Content */}
                                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                                                <p className="mb-2 text-sm font-semibold text-red-900 dark:text-red-100">
                                                    Konten yang Dilaporkan:
                                                </p>
                                                <p className="text-sm text-red-800 dark:text-red-200">
                                                    {report.reportable.content}
                                                </p>
                                                {report.reportable.user && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={
                                                                    report
                                                                        .reportable
                                                                        .user
                                                                        .profile_picture_url
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {getInitials(
                                                                    report
                                                                        .reportable
                                                                        .user
                                                                        .name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm text-red-700 dark:text-red-300">
                                                            Dibuat oleh:{' '}
                                                            {
                                                                report
                                                                    .reportable
                                                                    .user.name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Report Details */}
                                            {report.description && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Detail Laporan:
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {report.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Admin Review */}
                                            {report.reviewer && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Ditinjau oleh:
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={
                                                                    report
                                                                        .reviewer
                                                                        .profile_picture_url
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {getInitials(
                                                                    report
                                                                        .reviewer
                                                                        .name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm text-gray-700">
                                                            {
                                                                report.reviewer
                                                                    .name
                                                            }
                                                        </span>
                                                        {report.reviewed_at && (
                                                            <>
                                                                <span className="text-sm text-gray-400">
                                                                    •
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    {formatDate(
                                                                        report.reviewed_at,
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {report.admin_notes && (
                                                        <div className="mt-2 rounded-lg border bg-gray-50 p-3">
                                                            <p className="text-sm text-gray-700">
                                                                {
                                                                    report.admin_notes
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Pagination */}
                                {reports.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t pt-4">
                                        <p className="text-sm text-gray-600">
                                            Halaman {reports.current_page} dari{' '}
                                            {reports.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {reports.current_page > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const url = new URL(
                                                            window.location.href,
                                                        );
                                                        url.searchParams.set(
                                                            'page',
                                                            (
                                                                reports.current_page -
                                                                1
                                                            ).toString(),
                                                        );
                                                        router.get(
                                                            url.toString(),
                                                        );
                                                    }}
                                                >
                                                    Sebelumnya
                                                </Button>
                                            )}
                                            {reports.current_page <
                                                reports.last_page && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const url = new URL(
                                                            window.location.href,
                                                        );
                                                        url.searchParams.set(
                                                            'page',
                                                            (
                                                                reports.current_page +
                                                                1
                                                            ).toString(),
                                                        );
                                                        router.get(
                                                            url.toString(),
                                                        );
                                                    }}
                                                >
                                                    Selanjutnya
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12">
                                    <div className="text-center">
                                        <Flag className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                                            Tidak Ada Laporan
                                        </h3>
                                        <p className="mt-1 text-gray-500">
                                            {activeTab === 'all'
                                                ? 'Belum ada laporan yang masuk.'
                                                : `Tidak ada laporan dengan status "${activeTab}".`}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
