'use client';

import { devopsCourseData } from '@/lib/devops-course-data';
import { MobileNavShell, SidebarShell } from './nav-shell';

const NAV = {
    sections: devopsCourseData,
    basePath: '/devops/topic',
    homeHref: '/devops',
    eyebrow: 'DevOps & Internet',
    title: 'From Scratch',
    // 126 lessons across 14 modules — the list only stays usable collapsed.
    collapsible: true,
} as const;

export function DevopsSidebar() {
    return <SidebarShell {...NAV} />;
}

export function DevopsMobileNav() {
    return <MobileNavShell {...NAV} />;
}
