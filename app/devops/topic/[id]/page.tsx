import { ContentPlaceholder } from '@/components/course/content-placeholder';
import { DynamicTopicContent } from '@/components/course/dynamic-topic-content';
import { TopicHeader } from '@/components/course/topic-header';
import { TopicNavigation } from '@/components/course/topic-navigation';
import { devopsContentMap } from '@/content/devops';
import {
    devopsLessons,
    devopsTrack,
    findDevopsLesson,
} from '@/lib/devops-course-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const found = findDevopsLesson(id);

    if (!found) return {};

    const { module: section, lesson } = found;
    const title = lesson.title;
    const description = lesson.summary
        ? `${lesson.summary}, ${section.title} · ${devopsTrack.title}.`
        : `${lesson.title}, ${section.title} · ${devopsTrack.title}.`;
    const url = `/devops/topic/${id}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: `${title} | ${devopsTrack.title}`,
            description,
            url,
            type: 'article',
            section: section.title,
            images: [
                {
                    url: '/og-default.png',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            tags: [lesson.tag, lesson.level, lesson.type].filter(
                Boolean
            ) as string[],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${devopsTrack.title}`,
            description,
            images: ['/og-default.png'],
        },
    };
}

export default async function DevopsLessonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const found = findDevopsLesson(id);

    if (!found) {
        notFound();
    }

    const { module: section, lesson } = found;

    // Previous/next walk the whole track, across module boundaries.
    const currentIdx = devopsLessons.findIndex(l => l.id === id);
    const prev =
        currentIdx > 0
            ? {
                  id: devopsLessons[currentIdx - 1].id,
                  title: devopsLessons[currentIdx - 1].title,
              }
            : null;
    const next =
        currentIdx < devopsLessons.length - 1
            ? {
                  id: devopsLessons[currentIdx + 1].id,
                  title: devopsLessons[currentIdx + 1].title,
              }
            : null;

    const contentData = devopsContentMap[id];

    return (
        <div className='space-y-12 animate-in fade-in duration-500'>
            <TopicHeader
                phase={section.title}
                topicNum={String(currentIdx + 1).padStart(3, '0')}
                title={lesson.title}
                time={lesson.time || '২০-৩০ মিনিট'}
                level={lesson.level || 'Beginner'}
                type={lesson.type || 'Theory'}
            />

            {contentData ? (
                <DynamicTopicContent data={contentData} />
            ) : (
                <ContentPlaceholder
                    title={lesson.title}
                    details={lesson.details ?? lesson.summary}
                    tools={lesson.tools}
                    homeHref='/devops'
                    homeLabel='Back to Track'
                />
            )}

            <TopicNavigation
                prev={prev}
                next={next}
                basePath='/devops/topic'
                label='Lesson'
            />
        </div>
    );
}

export async function generateStaticParams() {
    return devopsLessons.map(lesson => ({ id: lesson.id }));
}
