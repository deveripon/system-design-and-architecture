/**
 * Splits a script into statements the way psql does before sending them, so
 * the query box can run them one by one. Each statement then commits on its
 * own (autocommit), exactly like psql, instead of the whole box running as one
 * hidden transaction. Semicolons inside quotes, quoted names, dollar-quoted
 * bodies and comments do not split.
 */
export function splitStatements(script: string): string[] {
    const statements: string[] = [];
    let start = 0;
    let i = 0;
    const n = script.length;

    const push = (end: number) => {
        const text = script.slice(start, end).trim();
        if (text && !isOnlyComments(text)) statements.push(text);
    };

    while (i < n) {
        const c = script[i];
        const next = script[i + 1];
        if (c === '-' && next === '-') {
            const end = script.indexOf('\n', i);
            i = end === -1 ? n : end + 1;
        } else if (c === '/' && next === '*') {
            const end = script.indexOf('*/', i + 2);
            i = end === -1 ? n : end + 2;
        } else if (c === "'" || c === '"') {
            i = skipQuoted(script, i, c);
        } else if (c === '$') {
            const tag = script.slice(i).match(/^\$([A-Za-z_][A-Za-z0-9_]*)?\$/);
            if (tag) {
                const end = script.indexOf(tag[0], i + tag[0].length);
                i = end === -1 ? n : end + tag[0].length;
            } else {
                i++;
            }
        } else if (c === ';') {
            push(i);
            i++;
            start = i;
        } else {
            i++;
        }
    }
    push(n);
    return statements;
}

/** Past the closing quote; a doubled quote inside is an escaped quote, not the end. */
function skipQuoted(script: string, from: number, quote: string): number {
    let i = from + 1;
    while (i < script.length) {
        if (script[i] === quote) {
            if (script[i + 1] === quote) {
                i += 2;
                continue;
            }
            return i + 1;
        }
        i++;
    }
    return script.length;
}

function isOnlyComments(text: string): boolean {
    return (
        text
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/--[^\n]*/g, '')
            .trim() === ''
    );
}
