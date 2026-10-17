'use client';

import { sqlCourseData } from '@/lib/sql-course-data';
import { MobileNavShell, SidebarShell } from './nav-shell';

const NAV = {
    sections: sqlCourseData,
    basePath: '/sql/topic',
    homeHref: '/sql',
    eyebrow: 'SQL & Databases',
    title: 'Database Mastery',
    // 191 pages across 22 modules, so the list only stays usable collapsed.
    collapsible: true,
} as const;

export function SqlSidebar() {
    return <SidebarShell {...NAV} />;
}

export function SqlMobileNav() {
    return <MobileNavShell {...NAV} />;
}
