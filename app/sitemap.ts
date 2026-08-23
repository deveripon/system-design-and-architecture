import { courseData } from '@/lib/course-data';
import { devopsLessons } from '@/lib/devops-course-data';
import type { MetadataRoute } from 'next';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://learnsystemdesign-bn.vercel.app/';

export default function sitemap(): MetadataRoute.Sitemap {
    const topicEntries: MetadataRoute.Sitemap = courseData.flatMap(phase =>
        phase.topics.map(topic => ({
            url: `${siteUrl}/topic/${topic.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))
    );

    const devopsEntries: MetadataRoute.Sitemap = devopsLessons.map(lesson => ({
        url: `${siteUrl}/devops/topic/${lesson.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${siteUrl}/devops`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...topicEntries,
        ...devopsEntries,
    ];
}

