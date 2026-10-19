'use client';

import { courseData } from '@/lib/course-data';
import { TRACK_HOME } from '@/lib/tracks';
import { SidebarShell } from './nav-shell';

export function Sidebar() {
    return (
        <SidebarShell
            sections={courseData}
            basePath='/topic'
            homeHref={TRACK_HOME['system-design']}
            eyebrow='System Design'
            title='Mastery Course'
            collapsible
        />
    );
}
