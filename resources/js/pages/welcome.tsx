import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8 dark:bg-background">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    {/* logo ipsi uho */}
                    <div className="flex items-start justify-start">
                        <img
                            src="/path/to/logo.png"
                            alt="Logo Ikatan Alumni Psikologi Universitas Halu Oleo"
                            className="h-12"
                        />
                    </div>
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-border px-5 py-1.5 text-sm leading-normal text-foreground hover:border-border dark:border-border dark:text-foreground dark:hover:border-border"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-foreground hover:border-border dark:text-foreground dark:hover:border-border"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-border px-5 py-1.5 text-sm leading-normal text-foreground hover:border-primary dark:border-border dark:text-foreground dark:hover:border-primary"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                {/* ikapsiUHO konten */}
                <div>
                    <h1 className="font-instrument-sans mb-6 text-center text-4xl leading-tight font-semibold lg:text-5xl">
                        Selamat Datang di Situs Resmi Ikatan Alumni Psikologi
                        Universitas Halu Oleo (ikapsiUHO)
                    </h1>
                    <p className="mb-6 text-center text-base leading-relaxed lg:text-lg">
                        Kami adalah komunitas yang menghubungkan para alumni
                        Psikologi Universitas Halu Oleo, menyediakan platform
                        untuk berbagi pengalaman, pengetahuan, dan peluang
                        karir. Bergabunglah dengan kami untuk memperluas
                        jaringan profesional Anda dan tetap terhubung dengan
                        sesama alumni.
                    </p>
                </div>
                {/* ikapsiUHO konten */}
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
