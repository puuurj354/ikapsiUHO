import { AlumniCard } from '@/components/alumni-card';
import { FilterSelect } from '@/components/filter-select';
import { Icon } from '@/components/icon';
import { SearchBar } from '@/components/search-bar';
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
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Filter, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlumniData {
    id: number;
    name: string;
    email: string;
    angkatan: string | null;
    profesi: string | null;
    bio: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface AlumniPagination {
    current_page: number;
    data: AlumniData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Filters {
    search: string | null;
    angkatan: string | null;
    profesi: string | null;
}

interface AlumniDirectoryProps {
    alumni: AlumniPagination;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Direktori Alumni', href: '/alumni/directory' },
];

// Generate year options (2010 - current year)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 2009 }, (_, i) => {
    const year = (2010 + i).toString();
    return { label: `Angkatan ${year}`, value: year };
});

// Common professions
const professionOptions = [
    { label: 'Psikolog Klinis', value: 'Psikolog Klinis' },
    { label: 'Psikolog Pendidikan', value: 'Psikolog Pendidikan' },
    {
        label: 'Psikolog Industri dan Organisasi',
        value: 'Psikolog Industri dan Organisasi',
    },
    { label: 'Konselor', value: 'Konselor' },
    { label: 'HR Manager', value: 'HR Manager' },
    { label: 'Dosen', value: 'Dosen' },
    { label: 'Peneliti', value: 'Peneliti' },
    { label: 'Guru BK', value: 'Guru BK' },
    { label: 'Trainer', value: 'Trainer' },
    { label: 'Terapis', value: 'Terapis' },
];

export default function AlumniDirectory({
    alumni,
    filters,
}: AlumniDirectoryProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [angkatan, setAngkatan] = useState(filters.angkatan || 'all');
    const [profesi, setProfesi] = useState(filters.profesi || 'all');

    const applyFilters = () => {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (angkatan !== 'all') params.angkatan = angkatan;
        if (profesi !== 'all') params.profesi = profesi;

        router.get('/alumni/directory', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, angkatan, profesi]);

    const resetFilters = () => {
        setSearch('');
        setAngkatan('all');
        setProfesi('all');
        router.get(
            '/alumni/directory',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const goToPage = (url: string | null) => {
        if (url) {
            router.get(
                url,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const hasActiveFilters = search || angkatan !== 'all' || profesi !== 'all';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Direktori Alumni" />

            <div className="container mx-auto space-y-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center text-3xl font-bold tracking-tight">
                            <Icon
                                iconNode={Users}
                                className="mr-3 h-8 w-8 text-primary"
                            />
                            Direktori Alumni
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {alumni.total} alumni terdaftar di IKAPSI UHO
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center">
                                    <Icon
                                        iconNode={Filter}
                                        className="mr-2 h-5 w-5"
                                    />
                                    Filter & Pencarian
                                </CardTitle>
                                <CardDescription>
                                    Cari alumni berdasarkan nama, angkatan, atau
                                    profesi
                                </CardDescription>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={resetFilters}
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <SearchBar
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Cari nama atau profesi..."
                                />
                            </div>
                            <div>
                                <FilterSelect
                                    value={angkatan}
                                    onChange={setAngkatan}
                                    options={yearOptions}
                                    placeholder="Pilih Angkatan"
                                />
                            </div>
                            <div>
                                <FilterSelect
                                    value={profesi}
                                    onChange={setProfesi}
                                    options={professionOptions}
                                    placeholder="Pilih Profesi"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Info */}
                {alumni.total > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>
                            Menampilkan {alumni.from}-{alumni.to} dari{' '}
                            {alumni.total} alumni
                        </p>
                        {hasActiveFilters && (
                            <p className="text-primary">Filter aktif</p>
                        )}
                    </div>
                )}

                {/* Alumni Grid */}
                {alumni.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {alumni.data.map((alumniData) => (
                            <AlumniCard key={alumniData.id} {...alumniData} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <Icon
                                    iconNode={Users}
                                    className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50"
                                />
                                <h3 className="mb-2 text-lg font-semibold">
                                    Tidak ada alumni ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Coba ubah filter pencarian Anda
                                </p>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                    >
                                        Reset Filter
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {alumni.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(alumni.prev_page_url)}
                            disabled={!alumni.prev_page_url}
                        >
                            <Icon
                                iconNode={ChevronLeft}
                                className="mr-1 h-4 w-4"
                            />
                            Previous
                        </Button>

                        <div className="flex items-center space-x-1">
                            {alumni.links
                                .filter(
                                    (link) =>
                                        link.label !== '&laquo; Previous' &&
                                        link.label !== 'Next &raquo;',
                                )
                                .map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => goToPage(link.url)}
                                        disabled={!link.url}
                                        className="min-w-[40px]"
                                    >
                                        {link.label}
                                    </Button>
                                ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(alumni.next_page_url)}
                            disabled={!alumni.next_page_url}
                        >
                            Next
                            <Icon
                                iconNode={ChevronRight}
                                className="ml-1 h-4 w-4"
                            />
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
