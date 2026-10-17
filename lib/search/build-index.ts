import { contentMap } from '@/content';
import { devopsContentMap } from '@/content/devops';
import { sqlContentMap } from '@/content/sql';
import { courseData } from '@/lib/course-data';
import { devopsCourseData, devopsTrack } from '@/lib/devops-course-data';
import { sqlCourseData, sqlTrack } from '@/lib/sql-course-data';
import type { ContentBlock, TopicData } from '@/types/content';
import { CONTENT_TYPES } from '@/types/content';
import { LESSON_EXTRA_ANCHORS } from './constants.ts';
import { extractKeywords, nodeToText, tidy } from './text.ts';
import type { SearchEntry, SearchIndex } from './types.ts';

/** The shape both tracks share, so one walker indexes them both. */
interface TrackSource {
    name: string;
    /** "Phase" for System Design, "Module" for DevOps. */
    unit: string;
    basePath: string;
    groups: {
        title: string;
        subtitle?: string;
        duration?: string;
        topics: {
            id: string;
            title: string;
            tag?: string;
            level?: string;
            type?: string;
            summary?: string;
            details?: string;
            useCases?: string[];
            practice?: string[];
            tools?: string[];
        }[];
    }[];
    content: Record<string, TopicData>;
}

const TRACKS: TrackSource[] = [
    {
        name: 'System Design',
        unit: 'Phase',
        basePath: '/topic',
        groups: courseData,
        content: contentMap,
    },
    {
        name: 'DevOps',
        unit: 'Module',
        basePath: '/devops/topic',
        groups: devopsCourseData,
        content: devopsContentMap,
    },
    {
        name: 'SQL',
        unit: 'Module',
        basePath: '/sql/topic',
        groups: sqlCourseData,
        content: sqlContentMap,
    },
];

const PAGES: SearchEntry[] = [
    {
        kind: 'page',
        title: 'System Design Mastery',
        context: 'Home',
        description: 'System Design track roadmap, every phase and topic',
        href: '/',
        keywords: 'home roadmap curriculum tracks interview framework',
    },
    {
        kind: 'page',
        title: devopsTrack.title,
        context: 'Track',
        description: devopsTrack.subtitle,
        href: `/${devopsTrack.slug}`,
        keywords: 'devops roadmap curriculum modules lessons',
    },
    {
        kind: 'page',
        title: 'The Project: Island Tours',
        context: 'DevOps',
        description: 'The running project every DevOps lesson comes back to',
        href: '/devops/project',
        keywords: 'island tours project architecture my-tours',
    },
    {
        kind: 'page',
        title: 'Full ASCII Table',
        context: 'Reference',
        description: 'Every ASCII code in one table',
        href: '/devops/reference/ascii-table',
        keywords: 'ascii table reference character code hex binary',
    },
    {
        kind: 'page',
        title: sqlTrack.title,
        context: 'Track',
        description: sqlTrack.subtitle,
        href: `/${sqlTrack.slug}`,
        keywords: 'sql database postgresql mysql roadmap curriculum modules lessons',
    },
    {
        kind: 'page',
        title: 'The Island Tours Database',
        context: 'SQL',
        description: 'The sample database every SQL lesson runs on',
        href: '/sql/database',
        keywords: 'sample database schema tables er diagram island tours download',
    },
];

function keywordString(...parts: (string | undefined)[]): string | undefined {
    const words = extractKeywords(parts.filter(Boolean).join(' '));
    return words.length > 0 ? words.join(' ') : undefined;
}

/** All the readable text of one content block, code included. */
function blockText(block: ContentBlock): string {
    switch (block.type) {
        case CONTENT_TYPES.HTML:
            return nodeToText(block.content, ' ');
        case CONTENT_TYPES.INFO_BOX:
            return `${block.title} ${nodeToText(block.content, ' ')}`;
        case CONTENT_TYPES.COMPARE_TABLE:
            return nodeToText([block.headers, block.rows], ' ');
        case CONTENT_TYPES.CODE_BLOCK:
            return `${block.filename ?? ''} ${block.code}`;
        case CONTENT_TYPES.STEP_FLOW:
            return nodeToText(
                block.steps.map(step => [step.title, step.description]),
                ' '
            );
        default:
            return '';
    }
}

function sectionEntries(
    data: TopicData,
    lessonTitle: string,
    href: string
): SearchEntry[] {
    const entries: SearchEntry[] = [];
    const seen = new Set<string>();

    for (const section of data.sections) {
        // Two sections sharing an id would both land on the first one.
        if (seen.has(section.id)) continue;
        seen.add(section.id);
        const title = tidy(nodeToText(section.title));
        entries.push({
            kind: 'section',
            title: title || section.subHeader.title,
            label: title ? section.subHeader.title : undefined,
            context: lessonTitle,
            href: `${href}#${section.id}`,
            keywords: keywordString(...section.blocks.map(blockText)),
        });
    }

    const extra = (
        key: keyof typeof LESSON_EXTRA_ANCHORS,
        text: string
    ): SearchEntry => ({
        kind: 'section',
        title: LESSON_EXTRA_ANCHORS[key].label,
        context: lessonTitle,
        href: `${href}#${LESSON_EXTRA_ANCHORS[key].anchor}`,
        keywords: keywordString(text),
    });

    const add = (key: keyof typeof LESSON_EXTRA_ANCHORS, text: string) => {
        // A lesson section already using the anchor wins, as it does on the page.
        if (seen.has(LESSON_EXTRA_ANCHORS[key].anchor)) return;
        entries.push(extra(key, text));
    };

    if (data.summary) {
        add(
            'summary',
            nodeToText([data.summary.headers, data.summary.rows], ' ')
        );
    }
    if (data.knowledgeCheck) {
        add(
            'quiz',
            data.knowledgeCheck.questions
                .map(q => `${q.text} ${q.options.map(o => o.text).join(' ')}`)
                .join(' ')
        );
    }
    if (data.assignment) {
        add(
            'assignment',
            `${data.assignment.title} ${nodeToText(
                [data.assignment.tasks, data.assignment.deliverables],
                ' '
            )}`
        );
    }
    if (data.practicalLab) {
        const lab = data.practicalLab;
        const code = [lab.codeBlock, ...(lab.codeBlocks ?? [])]
            .map(block => (block ? `${block.filename} ${block.code}` : ''))
            .join(' ');
        add(
            'lab',
            `${lab.title} ${lab.subtitle} ${nodeToText(
                lab.steps.map(step => [step.title, step.description]),
                ' '
            )} ${code}`
        );
    }

    return entries;
}

/**
 * Everything the command palette can jump to: the standalone pages, every
 * module and lesson of both tracks, and every section of the written lessons.
 * Runs on the server at build time; the result is served as static JSON.
 */
export function buildSearchIndex(): SearchIndex {
    const modules: SearchEntry[] = [];
    const lessons: SearchEntry[] = [];
    const sections: SearchEntry[] = [];

    for (const track of TRACKS) {
        track.groups.forEach((group, groupIdx) => {
            const unit = `${track.unit} ${String(groupIdx + 1).padStart(2, '0')}`;
            const first = group.topics[0];
            if (first) {
                modules.push({
                    kind: 'module',
                    title: group.title,
                    context: `${track.name} · ${unit}`,
                    description: [group.subtitle, group.duration]
                        .filter(Boolean)
                        .join(' · '),
                    href: `${track.basePath}/${first.id}`,
                });
            }

            for (const topic of group.topics) {
                const href = `${track.basePath}/${topic.id}`;
                const data = track.content[topic.id];
                lessons.push({
                    kind: 'lesson',
                    title: topic.title,
                    context: `${track.name} · ${unit} · ${group.title}`,
                    description: topic.summary,
                    href,
                    keywords: keywordString(
                        topic.tag,
                        topic.type,
                        topic.level,
                        topic.details,
                        topic.tools?.join(' '),
                        topic.useCases?.join(' '),
                        topic.practice?.join(' ')
                    ),
                    comingSoon: data ? undefined : true,
                });
                if (data) {
                    sections.push(...sectionEntries(data, topic.title, href));
                }
            }
        });
    }

    return { entries: [...PAGES, ...modules, ...lessons, ...sections] };
}
