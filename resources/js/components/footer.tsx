import { Icon } from '@/components/icon';
import { organizationInfo, quickLinks } from '@/data/ikapsi-data';
import { login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';

interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`border-t border-border bg-muted/30 ${className}`}>
            <div className="container mx-auto px-4 py-12 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* About Section */}
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <img
                                src={organizationInfo.logo}
                                alt={`Logo ${organizationInfo.name}`}
                                className="h-10 w-auto"
                            />
                            <div>
                                <h3 className="font-semibold">
                                    {organizationInfo.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {organizationInfo.tagline}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {organizationInfo.description}
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="mb-4 font-semibold">Tautan Cepat</h3>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map((link, index) => {
                                // Cek apakah href adalah internal route atau anchor link
                                const isInternalRoute =
                                    link.href === '/register' ||
                                    link.href === '/login';

                                if (isInternalRoute) {
                                    const route =
                                        link.href === '/register'
                                            ? register()
                                            : login();
                                    return (
                                        <li key={index}>
                                            <Link
                                                href={route}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                {link.title}
                                            </Link>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            {link.title}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Contact Section */}
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
                                    Kampus UHO, Kendari, Sulawesi Tenggara
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h3 className="mb-4 font-semibold">Media Sosial</h3>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                                aria-label="Facebook"
                            >
                                <span className="text-sm font-semibold">f</span>
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
                                <span className="text-sm font-semibold">X</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} {organizationInfo.name}. Seluruh
                        hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
