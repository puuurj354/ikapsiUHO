import { Footer } from '@/components/footer';
import { Icon } from '@/components/icon';
import { StatisticsSection } from '@/components/statistics-section';
import { ThemeToggle } from '@/components/theme-toggle';
import { activities, features, organizationInfo } from '@/data/ikapsi-data';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Clock,
    Eye,
    Info,
    LayoutDashboard,
    User,
    UserPlus,
    Users,
} from 'lucide-react';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string;
    published_at: string;
    views_count: number;
    reading_time: string;
    author: {
        id: number;
        name: string;
    };
}

interface WelcomeProps {
    featuredArticles: Article[];
}

export default function Welcome({ featuredArticles }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

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
                                src={organizationInfo.logo}
                                alt={`Logo ${organizationInfo.fullName}`}
                                className="h-10 w-auto"
                            />
                            <div className="hidden md:block">
                                <h2 className="text-lg leading-tight font-semibold">
                                    {organizationInfo.shortName}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {organizationInfo.tagline}
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex items-center gap-2 lg:gap-4">
                            {/* Public Gallery Link */}
                            <Link
                                href="/galleries"
                                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                            >
                                Galeri
                            </Link>

                            {/* Articles Link */}
                            <Link
                                href="/articles"
                                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                            >
                                Artikel
                            </Link>

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

                            {/* Theme Toggle Button */}
                            <ThemeToggle />
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
                <StatisticsSection />

                {/* Featured Articles Section */}
                {featuredArticles && featuredArticles.length > 0 && (
                    <section className="py-20 lg:py-32">
                        <div className="container mx-auto px-4 lg:px-8">
                            <div className="mb-12 flex items-end justify-between">
                                <div>
                                    <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                                        Artikel Terbaru
                                    </h2>
                                    <p className="max-w-2xl text-lg text-muted-foreground">
                                        Baca wawasan dan pengalaman dari para
                                        alumni
                                    </p>
                                </div>
                                <Link
                                    href="/articles"
                                    className="hidden items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex"
                                >
                                    Lihat Semua
                                    <Icon
                                        iconNode={ArrowRight}
                                        className="h-4 w-4"
                                    />
                                </Link>
                            </div>

                            {/* Featured Articles Grid */}
                            <div className="grid gap-8 md:grid-cols-2">
                                {featuredArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/articles/${article.slug}`}
                                        className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl"
                                    >
                                        {/* Featured Image */}
                                        {article.featured_image_url ? (
                                            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                                <img
                                                    src={
                                                        article.featured_image_url
                                                    }
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5">
                                                <div className="flex h-full items-center justify-center">
                                                    <Icon
                                                        iconNode={Users}
                                                        className="h-16 w-16 text-primary/40"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-primary">
                                                {article.title}
                                            </h3>
                                            {article.excerpt && (
                                                <p className="mb-4 line-clamp-3 text-muted-foreground">
                                                    {article.excerpt}
                                                </p>
                                            )}

                                            {/* Meta Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        iconNode={User}
                                                        className="h-4 w-4"
                                                    />
                                                    <span>
                                                        {article.author.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        iconNode={Calendar}
                                                        className="h-4 w-4"
                                                    />
                                                    <span>
                                                        {formatDate(
                                                            article.published_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        iconNode={Clock}
                                                        className="h-4 w-4"
                                                    />
                                                    <span>
                                                        {article.reading_time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        iconNode={Eye}
                                                        className="h-4 w-4"
                                                    />
                                                    <span>
                                                        {article.views_count}{' '}
                                                        views
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* View All Button - Mobile */}
                            <div className="mt-8 text-center sm:hidden">
                                <Link
                                    href="/articles"
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Lihat Semua Artikel
                                    <Icon
                                        iconNode={ArrowRight}
                                        className="h-5 w-5"
                                    />
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

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
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                                >
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon
                                            iconNode={feature.icon}
                                            className="h-6 w-6"
                                        />
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
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
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                                >
                                    <div className="bg-primary/10 p-6">
                                        <Icon
                                            iconNode={activity.icon}
                                            className="h-8 w-8 text-primary"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-semibold">
                                            {activity.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
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
                <Footer />
            </div>
        </>
    );
}
