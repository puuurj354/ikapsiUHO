# AI Coding Agent Instructions

## Architecture Overview

This is a **Laravel 12 + Inertia.js + React/TypeScript** full-stack application with modern tooling:

- **Backend**: Laravel 12 with Fortify authentication, Pest testing
- **Frontend**: React 19 + TypeScript + Inertia.js for SPA-like experience
- **Styling**: Tailwind CSS v4 + shadcn/ui component library
- **Build**: Vite with SSR support
- **Database**: SQLite (development)
- **Routing**: Wayfinder for type-safe, auto-generated route definitions

## Key Patterns & Conventions

### Component Library (shadcn/ui)

- Use Radix UI primitives via `@/components/ui/*` components
- Follow "new-york" style variant from `components.json`
- Icon library: Lucide React (`@/components/icon.tsx`)
- Utility: `cn()` function from `@/lib/utils.ts` for class merging

### Layout System

- **App Layouts**: `resources/js/layouts/app/` - sidebar and header variants
- **Auth Layouts**: `resources/js/layouts/auth/` - centered auth forms
- **Settings Layouts**: `resources/js/layouts/settings/` - tabbed settings pages
- Layout components: `AppShell`, `AppSidebar`, `AppContent`, `AppSidebarHeader`

### Routing (Wayfinder)

- Routes auto-generated from Laravel routes to `resources/js/routes/`
- Type-safe route helpers: `dashboard()`, `login()`, etc.
- Import from `@/routes` (e.g., `import { dashboard } from '@/routes'`)
- Route definitions include URL generation and HTTP methods

### Page Structure

- Pages in `resources/js/pages/` match Laravel route names
- Use `AppLayout` wrapper with breadcrumbs
- Head management via `@inertiajs/react` `Head` component
- Props typed via `SharedData` interface from `@/types`

### State Management

- Inertia.js handles server state and form submissions
- Custom hooks in `resources/js/hooks/` for UI state
- Theme management via `use-appearance` hook
- Authentication state via Inertia shared props

## Development Workflow

### Local Development

```bash
composer run dev          # Start all services (Laravel, Vite, Queue, Logs)
composer run dev:ssr      # Development with SSR enabled
bun run dev              # Vite dev server only
php artisan serve        # Laravel server only
```

### Building

````bash
```bash
bun run build            # Production build
bun run build:ssr        # Build with SSR
composer run test        # Run Pest tests
````

### Code Quality

```bash
bun run lint             # ESLint with auto-fix
bun run format           # Prettier formatting
bun run types            # TypeScript type checking
```

## File Organization

### Frontend Structure

```
resources/js/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   └── *-layout.tsx     # Layout components
├── layouts/             # Page layout wrappers
├── pages/               # Inertia page components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (cn, etc.)
├── routes/              # Auto-generated route helpers
└── types/               # TypeScript definitions
```

### Key Files

- `resources/js/app.tsx` - Inertia app bootstrap
- `resources/js/ssr.tsx` - Server-side rendering entry
- `vite.config.ts` - Build configuration with Wayfinder
- `components.json` - shadcn/ui configuration
- `eslint.config.js` - Modern ESLint flat config

## Component Patterns

### Form Components

- Use Wayfinder's form variants (`wayfinder({ formVariants: true })`)
- Components extend HTML elements with `React.ComponentProps`
- Error handling via `InputError` component

### Icon Usage

```tsx
import { Icon } from '@/components/icon';
<Icon name="user" className="h-4 w-4" />;
```

### Breadcrumb Navigation

```tsx
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url }
];
<AppLayout breadcrumbs={breadcrumbs}>
```

## Testing

- **Framework**: Pest (PHP) for backend, no frontend testing setup
- **Test Location**: `tests/Feature/` for feature tests
- **Pattern**: Functional tests with `RefreshDatabase` trait
- **Assertions**: Standard Laravel test assertions

## Authentication

- **Provider**: Laravel Fortify
- **Features**: Two-factor authentication, email verification
- **Routes**: Auto-generated in `routes/auth.php`
- **Frontend**: Auth pages in `resources/js/pages/auth/`

## Deployment Considerations

- SSR enabled by default (`config/inertia.php`)
- SQLite for development, configure external DB for production
- Vite handles asset compilation and optimization
- Queue system available (configure for production)

## Common Gotchas

1. **Route Imports**: Always import from `@/routes`, never construct URLs manually
2. **Component Props**: Extend HTML element props using `React.ComponentProps<'div'>`
3. **SSR**: Test SSR builds with `composer run dev:ssr`
4. **Database**: Use migrations for schema changes, factories for test data
5. **Styling**: Use Tailwind utilities, avoid custom CSS unless necessary</content>
   <parameter name="filePath">/home/purnama/Documents/ikapsiUHO/.github/copilot-instructions.md

### ikapsiUHO

- The content should be indonesian language
- The content should be about ikapsiUHO (alumni Psikologi Universitas Halu Oleo)
- The content should be placed in the welcome.tsx file in the resources/js/pages directory
- This web is about ikapsiUHO (alumni Psikologi Universitas Halu Oleo)

### Backend Architecture

- Services layer handles business logic
- Controllers handle HTTP requests and responses
