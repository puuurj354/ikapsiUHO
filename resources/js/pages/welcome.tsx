import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Briefcase,
    Calendar,
    Heart,
    HeartHandshake,
    Info,
    LayoutDashboard,
    Mail,
    MapPin,
    Moon,
    Newspaper,
    Presentation,
    Sun,
    Trophy,
    UserPlus,
    Users,
} from 'lucide-react';
import { useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { appearance, updateAppearance } = useAppearance();

    // Set default to light mode on first load
    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance');
        if (!savedAppearance) {
            updateAppearance('light');
        }
    }, [updateAppearance]);

    return (
        <>
            <Head title="Selamat Datang - IKAPSI UHO">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-background text-foreground">
                {/* Header with fixed alignment */}
                <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/150px-Logo-baru_UHO.png"
                                alt="Logo Ikatan Alumni Psikologi Universitas Halu Oleo"
                                className="h-10 w-auto"
                            />
                            <div className="hidden md:block">
                                <h2 className="text-lg leading-tight font-semibold">
                                    IKAPSI UHO
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Ikatan Alumni Psikologi
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex items-center gap-2 lg:gap-4">
                            {/* Theme Toggle Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    updateAppearance(
                                        appearance === 'dark'
                                            ? 'light'
                                            : 'dark',
                                    )
                                }
                                className="h-9 w-9 rounded-md"
                                aria-label="Toggle theme"
                            >
                                {appearance === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>

                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Icon
                                        iconNode={LayoutDashboard}
                                        className="h-4 w-4"
                                    />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                    <div className="relative container mx-auto px-4 py-20 lg:px-8 lg:py-32">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                                <Icon
                                    iconNode={Users}
                                    className="mr-2 h-4 w-4"
                                />
                                Alumni Psikologi Universitas Halu Oleo
                            </div>
                            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight lg:text-6xl">
                                Selamat Datang di{' '}
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    IKAPSI UHO
                                </span>
                            </h1>
                            <p className="mb-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
                                Wadah bagi alumni Psikologi Universitas Halu
                                Oleo untuk saling terhubung, berbagi pengalaman,
                                dan mengembangkan jaringan profesional yang
                                kuat.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                    >
                                        <Icon
                                            iconNode={ArrowRight}
                                            className="h-5 w-5"
                                        />
                                        Lihat Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                        >
                                            <Icon
                                                iconNode={UserPlus}
                                                className="h-5 w-5"
                                            />
                                            Bergabung Sekarang
                                        </Link>
                                        <Link
                                            href="#tentang"
                                            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                                        >
                                            <Icon
                                                iconNode={Info}
                                                className="h-5 w-5"
                                            />
                                            Pelajari Lebih Lanjut
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="border-y border-border bg-muted/30 py-12">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
                                    500+
                                </div>
                                <div className="text-sm text-muted-foreground lg:text-base">
                                    Alumni Terdaftar
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
                                    50+
                                </div>
                                <div className="text-sm text-muted-foreground lg:text-base">
                                    Kegiatan per Tahun
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
                                    20+
                                </div>
                                <div className="text-sm text-muted-foreground lg:text-base">
                                    Mitra Kerja
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
                                    15+
                                </div>
                                <div className="text-sm text-muted-foreground lg:text-base">
                                    Tahun Berkarya
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="tentang" className="py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                                Mengapa Bergabung dengan IKAPSI UHO?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Dapatkan manfaat eksklusif dan kesempatan untuk
                                terus berkembang bersama komunitas alumni
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon
                                        iconNode={Users}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    Jaringan Alumni
                                </h3>
                                <p className="text-muted-foreground">
                                    Terhubung dengan ribuan alumni Psikologi UHO
                                    dari berbagai angkatan dan profesi
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon
                                        iconNode={Briefcase}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    Peluang Karir
                                </h3>
                                <p className="text-muted-foreground">
                                    Akses informasi lowongan pekerjaan dan
                                    peluang kolaborasi profesional
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon
                                        iconNode={Calendar}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    Kegiatan & Acara
                                </h3>
                                <p className="text-muted-foreground">
                                    Ikuti berbagai seminar, workshop, dan reuni
                                    alumni yang menginspirasi
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon
                                        iconNode={BookOpen}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    Pengembangan Diri
                                </h3>
                                <p className="text-muted-foreground">
                                    Program pelatihan dan pengembangan
                                    kompetensi berkelanjutan
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon
                                        iconNode={HeartHandshake}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    Kolaborasi & Mentoring
                                </h3>
                                <p className="text-muted-foreground">
                                    Bimbingan dari senior dan kesempatan
                                    berkolaborasi dalam berbagai proyek
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon
                                        iconNode={Newspaper}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    Informasi Terkini
                                </h3>
                                <p className="text-muted-foreground">
                                    Update berita dan perkembangan di dunia
                                    psikologi serta alumni
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Activities Section */}
                <section className="border-y border-border bg-muted/30 py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                                Kegiatan IKAPSI UHO
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Berbagai aktivitas yang kami selenggarakan untuk
                                mempererat tali silaturahmi alumni
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Activity 1 */}
                            <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
                                <div className="bg-primary/10 p-6">
                                    <Icon
                                        iconNode={Presentation}
                                        className="h-8 w-8 text-primary"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Seminar & Workshop
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Seminar rutin tentang perkembangan ilmu
                                        psikologi dan praktik profesional
                                    </p>
                                </div>
                            </div>

                            {/* Activity 2 */}
                            <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
                                <div className="bg-primary/10 p-6">
                                    <Icon
                                        iconNode={Trophy}
                                        className="h-8 w-8 text-primary"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Reuni Alumni
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Acara reuni tahunan untuk mempererat
                                        tali persaudaraan antar angkatan
                                    </p>
                                </div>
                            </div>

                            {/* Activity 3 */}
                            <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
                                <div className="bg-primary/10 p-6">
                                    <Icon
                                        iconNode={Heart}
                                        className="h-8 w-8 text-primary"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Bakti Sosial
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Program pengabdian masyarakat dan
                                        kegiatan sosial bersama
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="py-20 lg:py-32">
                        <div className="container mx-auto px-4 lg:px-8">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 text-center text-primary-foreground">
                                <div className="bg-grid-white/5 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]" />
                                <div className="relative">
                                    <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                                        Siap Bergabung dengan Keluarga Besar
                                        IKAPSI UHO?
                                    </h2>
                                    <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                                        Daftarkan diri Anda sekarang dan nikmati
                                        berbagai manfaat sebagai anggota IKAPSI
                                        UHO
                                    </p>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-2 rounded-md bg-background px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-background/90"
                                    >
                                        <Icon
                                            iconNode={UserPlus}
                                            className="h-5 w-5"
                                        />
                                        Daftar Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-border bg-muted/30">
                    <div className="container mx-auto px-4 py-12 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {/* About */}
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <img
                                        src="/150px-Logo-baru_UHO.png"
                                        alt="Logo IKAPSI UHO"
                                        className="h-10 w-auto"
                                    />
                                    <div>
                                        <h3 className="font-semibold">
                                            IKAPSI UHO
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Ikatan Alumni Psikologi
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Wadah silaturahmi dan pengembangan
                                    profesional alumni Psikologi Universitas
                                    Halu Oleo
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="mb-4 font-semibold">
                                    Tautan Cepat
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a
                                            href="#tentang"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Tentang Kami
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href={register()}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Pendaftaran
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={login()}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="mb-4 font-semibold">Kontak</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <Icon
                                            iconNode={Mail}
                                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                                        />
                                        <span>ikapsiuho@gmail.com</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Icon
                                            iconNode={MapPin}
                                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                                        />
                                        <span>
                                            Kampus UHO, Kendari, Sulawesi
                                            Tenggara
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="mb-4 font-semibold">
                                    Media Sosial
                                </h3>
                                <div className="flex gap-3">
                                    <a
                                        href="#"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                                        aria-label="Facebook"
                                    >
                                        <span className="text-sm font-semibold">
                                            f
                                        </span>
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                                        aria-label="Instagram"
                                    >
                                        <span className="text-sm font-semibold">
                                            IG
                                        </span>
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                                        aria-label="Twitter"
                                    >
                                        <span className="text-sm font-semibold">
                                            X
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                            <p>
                                &copy; {new Date().getFullYear()} IKAPSI UHO.
                                Seluruh hak cipta dilindungi.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
