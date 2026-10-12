import type { TopicData } from '../types/content.ts';
import { LESSON_EXTRA_ANCHORS } from './search/constants.ts';
import { nodeToText, tidy } from './search/text.ts';

export interface OutlineItem {
    /** The id of the section element on the page, the link target. */
    id: string;
    /** The running number shown beside the section, for example "003". */
    index: string;
    /** Short English name, for example "Connection Lifecycle". */
    label: string;
    /** The section headline as written. Empty for the fixed closing sections. */
    title: string;
}

/**
 * The headlines of a lesson in page order: its own sections, then the summary,
 * quiz, assignment and lab when it has them. Mirrors the order and numbering
 * `DynamicTopicContent` renders.
 */
export function lessonOutline(data: TopicData): OutlineItem[] {
    const items: OutlineItem[] = [];
    const seen = new Set<string>();

    for (const section of data.sections) {
        // A repeated id can only ever scroll to its first section.
        if (seen.has(section.id)) continue;
        seen.add(section.id);
        items.push({
            id: section.id,
            index: section.subHeader.index,
            label: section.subHeader.title,
            title: tidy(nodeToText(section.title)),
        });
    }

    let next = data.sections.length;
    const extras: [keyof typeof LESSON_EXTRA_ANCHORS, unknown][] = [
        ['summary', data.summary],
        ['quiz', data.knowledgeCheck],
        ['assignment', data.assignment],
        ['lab', data.practicalLab],
    ];
    for (const [key, present] of extras) {
        if (!present) continue;
        next += 1;
        // The number still advances, so it matches the one shown on the page.
        if (seen.has(LESSON_EXTRA_ANCHORS[key].anchor)) continue;
        items.push({
            id: LESSON_EXTRA_ANCHORS[key].anchor,
            index: String(next).padStart(3, '0'),
            label: LESSON_EXTRA_ANCHORS[key].label,
            title: '',
        });
    }

    return items;
}
