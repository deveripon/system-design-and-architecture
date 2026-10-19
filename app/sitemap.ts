import { courseData } from '@/lib/course-data';
import { devopsLessons } from '@/lib/devops-course-data';
import { sqlLessons } from '@/lib/sql-course-data';
import { absoluteUrl } from '@/lib/site-url';
import { TRACK_HOME } from '@/lib/tracks';
import type { MetadataRoute } from 'next';


export default function sitemap(): MetadataRoute.Sitemap {
    const topicEntries: MetadataRoute.Sitemap = courseData.flatMap(phase =>
        phase.topics.map(topic => ({
            url: absoluteUrl(`/topic/${topic.id}`),
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))
    );

    const devopsEntries: MetadataRoute.Sitemap = devopsLessons.map(lesson => ({
        url: absoluteUrl(`/devops/topic/${lesson.id}`),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const sqlEntries: MetadataRoute.Sitemap = sqlLessons.map(lesson => ({
        url: absoluteUrl(`/sql/topic/${lesson.id}`),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        // The home page is the DevOps landing page.
        {
            url: absoluteUrl(TRACK_HOME.devops),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: absoluteUrl('/devops/reference/ascii-table'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: absoluteUrl('/devops/project'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: absoluteUrl(TRACK_HOME.sql),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: absoluteUrl('/sql/database'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: absoluteUrl(TRACK_HOME['system-design']),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...devopsEntries,
        ...sqlEntries,
        ...topicEntries,
    ];
}

