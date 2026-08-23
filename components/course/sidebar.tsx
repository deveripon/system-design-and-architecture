'use client';

import { courseData } from '@/lib/course-data';
import { SidebarShell } from './nav-shell';

export function Sidebar() {
    return (
        <SidebarShell
            sections={courseData}
            basePath='/topic'
            homeHref='/'
            eyebrow='System Design'
            title='Mastery Course'
            collapsible
        />
    );
}
