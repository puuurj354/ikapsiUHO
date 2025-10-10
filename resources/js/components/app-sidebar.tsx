import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as notificationsIndex } from '@/routes/notifications';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Calendar,
    FileText,
    Folder,
    LayoutGrid,
    MessageSquare,
    Tag,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';

    const mainNavItems: NavItem[] = isAdmin
        ? [
              {
                  title: 'Dashboard',
                  href: '/admin/dashboard',
                  icon: LayoutGrid,
              },
              {
                  title: 'Manajemen Pengguna',
                  href: '/admin/users',
                  icon: Users,
              },
              {
                  title: 'Manajemen Event',
                  href: '/admin/events',
                  icon: Calendar,
              },
              {
                  title: 'Kategori Artikel',
                  href: '/admin/articles/categories',
                  icon: Tag,
              },
              {
                  title: 'Forum Diskusi',
                  href: '/forum',
                  icon: MessageSquare,
              },
              {
                  title: 'Notifikasi',
                  href: notificationsIndex(),
                  icon: Bell,
              },
          ]
        : [
              {
                  title: 'Dashboard',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Direktori Alumni',
                  href: '/alumni/directory',
                  icon: Users,
              },
              {
                  title: 'Event',
                  href: '/events',
                  icon: Calendar,
              },
              {
                  title: 'Artikel Saya',
                  href: '/articles/my-articles',
                  icon: FileText,
              },
              {
                  title: 'Forum Diskusi',
                  href: '/forum',
                  icon: MessageSquare,
              },
              {
                  title: 'Notifikasi',
                  href: notificationsIndex(),
                  icon: Bell,
              },
          ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
