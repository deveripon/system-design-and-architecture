'use client';

import { courseData } from '@/lib/course-data';
import { TRACK_HOME } from '@/lib/tracks';
import { MobileNavShell } from './nav-shell';

export function MobileNav() {
    return (
        <MobileNavShell
            sections={courseData}
            basePath='/topic'
            homeHref={TRACK_HOME['system-design']}
            eyebrow='System Design'
            title='Mastery Course'
            collapsible
        />
    );
}
