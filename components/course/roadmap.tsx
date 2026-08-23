'use client';

import { courseData } from '@/lib/course-data';
import { RoadmapView } from './roadmap-view';

export function Roadmap() {
    return (
        <RoadmapView
            sections={courseData}
            basePath='/topic'
            sectionLabel='Phase'
            defaultExpanded={['phase-1', 'phase-2']}
        />
    );
}
