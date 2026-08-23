'use client';

import { devopsCourseData } from '@/lib/devops-course-data';
import { RoadmapView } from './roadmap-view';

export function DevopsRoadmap() {
    return (
        <RoadmapView
            sections={devopsCourseData}
            basePath='/devops/topic'
            sectionLabel='Module'
            defaultExpanded={['computer-fundamentals']}
        />
    );
}
