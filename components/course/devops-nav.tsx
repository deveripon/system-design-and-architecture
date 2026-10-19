'use client';

import { devopsCourseData } from '@/lib/devops-course-data';
import { TRACK_HOME } from '@/lib/tracks';
import { MobileNavShell, SidebarShell } from './nav-shell';

const NAV = {
    sections: devopsCourseData,
    basePath: '/devops/topic',
    homeHref: TRACK_HOME.devops,
    eyebrow: 'DevOps & Internet',
    title: 'From Scratch',
    // 174 lessons across 20 modules, so the list only stays usable collapsed.
    collapsible: true,
} as const;

export function DevopsSidebar() {
    return <SidebarShell {...NAV} />;
}

export function DevopsMobileNav() {
    return <MobileNavShell {...NAV} />;
}
