import { ContentPlaceholder } from '@/components/course/content-placeholder';
import { DynamicTopicContent } from '@/components/course/dynamic-topic-content';
import { LessonToc } from '@/components/course/lesson-toc';
import { TopicHeader } from '@/components/course/topic-header';
import { TopicNavigation } from '@/components/course/topic-navigation';
import { sqlContentMap } from '@/content/sql';
import { findSqlLesson, sqlLessons, sqlTrack } from '@/lib/sql-course-data';
import { lessonOutline } from '@/lib/lesson-outline';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const found = findSqlLesson(id);

    if (!found) return {};

    const { module: section, lesson } = found;
    const title = lesson.title;
    const description = lesson.summary
        ? `${lesson.summary}, ${section.title} · ${sqlTrack.title}.`
        : `${lesson.title}, ${section.title} · ${sqlTrack.title}.`;
    const url = `/sql/topic/${id}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: `${title} | ${sqlTrack.title}`,
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
            title: `${title} | ${sqlTrack.title}`,
            description,
            images: ['/og-default.png'],
        },
    };
}

export default async function SqlLessonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const found = findSqlLesson(id);

    if (!found) {
        notFound();
    }

    const { module: section, lesson } = found;

    // Previous/next walk the whole track, across module boundaries.
    const currentIdx = sqlLessons.findIndex(l => l.id === id);
    const prev =
        currentIdx > 0
            ? {
                  id: sqlLessons[currentIdx - 1].id,
                  title: sqlLessons[currentIdx - 1].title,
              }
            : null;
    const next =
        currentIdx < sqlLessons.length - 1
            ? {
                  id: sqlLessons[currentIdx + 1].id,
                  title: sqlLessons[currentIdx + 1].title,
              }
            : null;

    const contentData = sqlContentMap[id];

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
                <>
                    <LessonToc items={lessonOutline(contentData)} />
                    <DynamicTopicContent data={contentData} />
                </>
            ) : (
                <ContentPlaceholder
                    title={lesson.title}
                    details={lesson.details ?? lesson.summary}
                    tools={lesson.tools}
                    homeHref='/sql'
                    homeLabel='Back to Track'
                />
            )}

            <TopicNavigation
                prev={prev}
                next={next}
                basePath='/sql/topic'
                label='Lesson'
            />
        </div>
    );
}

export async function generateStaticParams() {
    return sqlLessons.map(lesson => ({ id: lesson.id }));
}
