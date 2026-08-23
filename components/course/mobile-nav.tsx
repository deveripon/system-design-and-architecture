'use client';

import { courseData } from '@/lib/course-data';
import { MobileNavShell } from './nav-shell';

export function MobileNav() {
    return (
        <MobileNavShell
            sections={courseData}
            basePath='/topic'
            homeHref='/'
            eyebrow='System Design'
            title='Mastery Course'
            collapsible
        />
    );
}
