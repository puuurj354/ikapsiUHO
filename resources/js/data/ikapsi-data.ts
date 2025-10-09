import {
    BookOpen,
    Briefcase,
    Calendar,
    Heart,
    HeartHandshake,
    Newspaper,
    Presentation,
    Trophy,
    Users,
    type LucideIcon,
} from 'lucide-react';

/**
 * Interface untuk data statistik IKAPSI UHO
 */
export interface StatisticData {
    value: string;
    label: string;
}

/**
 * Interface untuk data fitur/manfaat IKAPSI UHO
 */
export interface FeatureData {
    icon: LucideIcon;
    title: string;
    description: string;
}

/**
 * Interface untuk data kegiatan IKAPSI UHO
 */
export interface ActivityData {
    icon: LucideIcon;
    title: string;
    description: string;
}

/**
 * Interface untuk data kontak
 */
export interface ContactData {
    type: 'email' | 'address' | 'phone';
    icon: LucideIcon;
    value: string;
}

/**
 * Data statistik IKAPSI UHO
 */
export const statistics: StatisticData[] = [
    {
        value: '500+',
        label: 'Alumni Terdaftar',
    },
    {
        value: '50+',
        label: 'Kegiatan per Tahun',
    },
    {
        value: '20+',
        label: 'Mitra Kerja',
    },
    {
        value: '15+',
        label: 'Tahun Berkarya',
    },
];

/**
 * Data fitur/manfaat bergabung dengan IKAPSI UHO
 */
export const features: FeatureData[] = [
    {
        icon: Users,
        title: 'Jaringan Alumni',
        description:
            'Terhubung dengan ribuan alumni Psikologi UHO dari berbagai angkatan dan profesi',
    },
    {
        icon: Briefcase,
        title: 'Peluang Karir',
        description:
            'Akses informasi lowongan pekerjaan dan peluang kolaborasi profesional',
    },
    {
        icon: Calendar,
        title: 'Kegiatan & Acara',
        description:
            'Ikuti berbagai seminar, workshop, dan reuni alumni yang menginspirasi',
    },
    {
        icon: BookOpen,
        title: 'Pengembangan Diri',
        description:
            'Program pelatihan dan pengembangan kompetensi berkelanjutan',
    },
    {
        icon: HeartHandshake,
        title: 'Kolaborasi & Mentoring',
        description:
            'Bimbingan dari senior dan kesempatan berkolaborasi dalam berbagai proyek',
    },
    {
        icon: Newspaper,
        title: 'Informasi Terkini',
        description:
            'Update berita dan perkembangan di dunia psikologi serta alumni',
    },
];

/**
 * Data kegiatan yang diselenggarakan IKAPSI UHO
 */
export const activities: ActivityData[] = [
    {
        icon: Presentation,
        title: 'Seminar & Workshop',
        description:
            'Seminar rutin tentang perkembangan ilmu psikologi dan praktik profesional',
    },
    {
        icon: Trophy,
        title: 'Reuni Alumni',
        description:
            'Acara reuni tahunan untuk mempererat tali persaudaraan antar angkatan',
    },
    {
        icon: Heart,
        title: 'Bakti Sosial',
        description:
            'Program pengabdian masyarakat dan kegiatan sosial bersama',
    },
];

/**
 * Informasi kontak IKAPSI UHO
 */
export const contactInfo = {
    email: 'ikapsiuho@gmail.com',
    address: 'Kampus UHO, Kendari, Sulawesi Tenggara',
    phone: '+62 XXX XXXX XXXX', // Ganti dengan nomor telepon yang sebenarnya
};

/**
 * Link tautan cepat untuk navigasi
 */
export const quickLinks = [
    {
        title: 'Tentang Kami',
        href: '#tentang',
    },
    {
        title: 'Pendaftaran',
        href: '/register',
    },
    {
        title: 'Login',
        href: '/login',
    },
];

/**
 * Informasi organisasi
 */
export const organizationInfo = {
    name: 'IKAPSI UHO',
    fullName: 'Ikatan Alumni Psikologi Universitas Halu Oleo',
    shortName: 'IKAPSI UHO',
    tagline: 'Ikatan Alumni Psikologi',
    description:
        'Wadah silaturahmi dan pengembangan profesional alumni Psikologi Universitas Halu Oleo',
    logo: '/150px-Logo-baru_UHO.png',
};
