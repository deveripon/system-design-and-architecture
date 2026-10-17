'use client';

import { sqlCourseData } from '@/lib/sql-course-data';
import { RoadmapView } from './roadmap-view';

export function SqlRoadmap() {
    return (
        <RoadmapView
            sections={sqlCourseData}
            basePath='/sql/topic'
            sectionLabel='Module'
            defaultExpanded={['data-and-databases']}
        />
    );
}
