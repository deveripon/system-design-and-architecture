const BENGALI_ZERO = 0x09e6;

/**
 * Folds text to the form both the index and the query are compared in:
 * lowercase, Bengali digits as Latin digits, punctuation as spaces.
 */
export function normalize(value: string): string {
    return (
        value
            .normalize('NFKC')
            // Zero width joiners sit inside Bengali words; dropping them keeps
            // the word whole instead of splitting it at the next step.
            .replace(/[‌‍]/g, '')
            .replace(/[০-৯]/g, d => String(d.charCodeAt(0) - BENGALI_ZERO))
            .toLowerCase()
            .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
            .trim()
    );
}

/**
 * Reads the text out of a React node without rendering it. Components that
 * take no children (diagrams, labs) contribute nothing.
 */
export function nodeToText(node: unknown, separator = ''): string {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) {
        return node
            .map(child => nodeToText(child, separator))
            .filter(Boolean)
            .join(separator);
    }
    if (node && typeof node === 'object' && 'props' in node) {
        const props = (node as { props?: { children?: unknown } }).props;
        return nodeToText(props?.children, separator);
    }
    return '';
}

/** Collapses runs of whitespace, for text that is shown to the reader. */
export function tidy(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

const STOP_WORDS = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'not',
    'you', 'your', 'has', 'have', 'but', 'can', 'will', 'its', 'into', 'than',
    'then', 'them', 'they', 'there', 'here', 'what', 'when', 'why', 'how',
    'who', 'all', 'any', 'one', 'two', 'our', 'out', 'use', 'via', 'per',
    'const', 'let', 'var', 'return', 'function', 'import', 'export', 'true',
    'false', 'null', 'undefined', 'new', 'else', 'await', 'async',
]);

/**
 * The lessons are written in Bengali with every technical term kept in
 * English, so the Latin words of a passage are its technical vocabulary.
 * Returns them unique, in first seen order.
 */
export function extractKeywords(value: string): string[] {
    const seen = new Set<string>();
    for (const word of normalize(value).split(' ')) {
        if (word.length < 2) continue;
        if (!/^[a-z0-9]+$/.test(word) || !/[a-z]/.test(word)) continue;
        if (STOP_WORDS.has(word)) continue;
        seen.add(word);
    }
    return [...seen];
}
