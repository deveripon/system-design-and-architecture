import { normalize } from './text.ts';
import type { SearchEntry, SearchKind } from './types.ts';

export interface PreparedEntry {
    entry: SearchEntry;
    /** Position in the index, the tie breaker that keeps curriculum order. */
    order: number;
    title: string;
    titleWords: string[];
    secondary: string;
    secondaryWords: string[];
    /** Padded with spaces so a whole word is found with `includes`. */
    keywords: string;
}

export interface SearchHit {
    entry: SearchEntry;
    score: number;
}

export interface SearchGroup {
    kind: SearchKind;
    hits: SearchHit[];
    /** Matches of this kind before the group limit was applied. */
    total: number;
}

/** A lesson is what people usually look for, a section is the long tail. */
const KIND_WEIGHT: Record<SearchKind, number> = {
    page: 1.1,
    lesson: 1.15,
    module: 1,
    section: 0.85,
};

const COMING_SOON_WEIGHT = 0.8;

const GROUP_ORDER: SearchKind[] = ['page', 'lesson', 'module', 'section'];

export function prepareEntries(entries: SearchEntry[]): PreparedEntry[] {
    return entries.map((entry, order) => {
        const title = normalize(`${entry.title} ${entry.label ?? ''}`);
        const secondary = normalize(
            `${entry.context ?? ''} ${entry.description ?? ''}`
        );
        return {
            entry,
            order,
            title,
            titleWords: title.split(' ').filter(Boolean),
            secondary,
            secondaryWords: secondary.split(' ').filter(Boolean),
            keywords: ` ${normalize(entry.keywords ?? '')} `,
        };
    });
}

/** True when the two words are at most one insert, delete or replaced letter apart. */
export function withinOneEdit(a: string, b: string): boolean {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    const [short, long] = a.length <= b.length ? [a, b] : [b, a];
    let i = 0;
    while (i < short.length && short[i] === long[i]) i++;
    if (short.length === long.length) {
        return short.slice(i + 1) === long.slice(i + 1);
    }
    return short.slice(i) === long.slice(i + 1);
}

function scoreToken(item: PreparedEntry, token: string): number {
    // One letter matches nearly everything as a substring, so it only counts
    // at the start of a word.
    const allowInside = token.length > 1;
    let best = 0;

    for (const word of item.titleWords) {
        if (word === token) best = Math.max(best, 12);
        else if (word.startsWith(token)) best = Math.max(best, 9);
    }
    if (best === 0 && allowInside && item.title.includes(token)) best = 6;

    if (best === 0) {
        for (const word of item.secondaryWords) {
            if (word.startsWith(token)) best = Math.max(best, 4);
        }
        if (best === 0 && allowInside && item.secondary.includes(token)) {
            best = 2;
        }
    }

    if (best === 0) {
        if (item.keywords.includes(` ${token} `)) best = 2;
        else if (allowInside && item.keywords.includes(` ${token}`)) best = 1;
    }

    // Typos are only forgiven on Latin words long enough to be unambiguous.
    if (best === 0 && token.length >= 4 && /^[a-z0-9]+$/.test(token)) {
        if (item.titleWords.some(word => withinOneEdit(word, token))) best = 3;
    }

    return best;
}

/** Every word of the query has to match somewhere, best matches first. */
export function searchEntries(
    prepared: PreparedEntry[],
    query: string
): SearchHit[] {
    const normalized = normalize(query);
    if (!normalized) return [];
    const tokens = normalized.split(' ');

    const hits: (SearchHit & { order: number })[] = [];
    for (const item of prepared) {
        let score = 0;
        let matched = true;
        for (const token of tokens) {
            const tokenScore = scoreToken(item, token);
            if (tokenScore === 0) {
                matched = false;
                break;
            }
            score += tokenScore;
        }
        if (!matched) continue;

        if (item.title === normalized) score += 20;
        else if (item.title.startsWith(normalized)) score += 8;

        score *= KIND_WEIGHT[item.entry.kind];
        if (item.entry.comingSoon) score *= COMING_SOON_WEIGHT;
        hits.push({ entry: item.entry, score, order: item.order });
    }

    hits.sort((a, b) => b.score - a.score || a.order - b.order);
    return hits.map(({ entry, score }) => ({ entry, score }));
}

/** Splits ranked hits into the groups the palette shows, in a fixed order. */
export function groupHits(
    hits: SearchHit[],
    limits: Record<SearchKind, number>
): SearchGroup[] {
    return GROUP_ORDER.map(kind => {
        const ofKind = hits.filter(hit => hit.entry.kind === kind);
        return {
            kind,
            hits: ofKind.slice(0, limits[kind]),
            total: ofKind.length,
        };
    }).filter(group => group.hits.length > 0);
}
