'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    items?: { label: string; href: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const pathname = usePathname();

    // If items are not provided, generate them from the pathname
    const breadcrumbs = items || generateBreadcrumbs(pathname);

    return (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-slate-400">
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Home size={14} />
                <span>Dashboard</span>
            </Link>

            {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.href}>
                    <ChevronRight size={14} className="text-slate-600" />
                    <Link
                        href={item.href}
                        className={`hover:text-cyan-400 transition-colors ${index === breadcrumbs.length - 1 ? 'text-white font-medium' : ''
                            }`}
                    >
                        {item.label}
                    </Link>
                </React.Fragment>
            ))}
        </nav>
    );
}

function generateBreadcrumbs(pathname: string) {
    const paths = pathname.split('/').filter(p => p && p !== 'dashboard');
    return paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        // Capitalize and replace dashes
        const label = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return { label, href };
    });
}
