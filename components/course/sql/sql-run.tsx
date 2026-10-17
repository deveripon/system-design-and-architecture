'use client';

import {
    PLAYGROUND_MAX_ROWS,
    PLAYGROUND_QUERY_TIMEOUT_MS,
} from '@/lib/sql/playground-config';
import { splitStatements } from '@/lib/sql/split-statements';
import { cn, toBn } from '@/lib/utils';
import type { Results } from '@electric-sql/pglite';
import type { EngineError, SqlEngine } from './sql-engine';

/**
 * What the query box and the exercise box share: running a script the way
 * psql does, and drawing its results and errors the way psql prints them.
 */

export interface QueryError {
    message: string;
    detail?: string;
    hint?: string;
    line?: string;
    caret?: number;
}

/** What one Run produced: every statement that finished, then the error that stopped it, if any. */
export interface Outcome {
    results: Results<unknown[]>[];
    error?: QueryError;
    ms: number;
}

export function formatCell(value: unknown): string {
    if (value === null || value === undefined) return 'NULL';
    if (Array.isArray(value)) {
        return `{${value.map(item => (item === null ? 'NULL' : formatCell(item))).join(',')}}`;
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

/** psql style error: the message, then the offending line of that statement with a caret under it. */
export function describeError(error: unknown, sql: string): QueryError {
    const e = error as EngineError;
    if (e.timedOut) {
        return {
            message: e.message,
            hint: `এই Statement ${toBn(PLAYGROUND_QUERY_TIMEOUT_MS / 1000)} সেকেন্ডের বেশি চলছিল, তাই Page আটকে যাওয়ার আগেই থামিয়ে দেওয়া হয়েছে। থামাতে গিয়ে Database নতুন করে শুরু হয়েছে, তাই এই Page এ আগে করা বদলগুলো আর নেই। শেষ না হওয়া Recursive Query বা বিশাল Cross Join এর ক্ষেত্রে এমন হয়।`,
        };
    }
    const outcome: QueryError = {
        message: e.message ?? String(error),
        detail: e.detail,
        hint: e.hint,
    };
    const position = Number(e.position);
    if (Number.isFinite(position) && position > 0) {
        const before = sql.slice(0, position - 1);
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineEnd = sql.indexOf('\n', lineStart);
        outcome.line = sql.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
        outcome.caret = position - 1 - lineStart;
    }
    return outcome;
}

/** What psql prints for a statement with no rows: the command, plus a count when it has one. */
export function commandTag(result: Results<unknown[]>) {
    const command = result.command ?? 'OK';
    return result.rowCount === undefined ? command : `${command} ${result.rowCount}`;
}

export function ResultTable({ result }: { result: Results<unknown[]> }) {
    const rows = result.rows.slice(0, PLAYGROUND_MAX_ROWS);
    return (
        <div className='overflow-x-auto border border-border'>
            <table className='w-full border-collapse font-mono text-[0.75rem]'>
                <thead>
                    <tr className='bg-muted/40'>
                        {result.fields.map((field, i) => (
                            <th
                                key={`${field.name}-${i}`}
                                className='border-b border-border px-3 py-2 text-left font-bold text-foreground whitespace-nowrap'>
                                {field.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, r) => (
                        <tr key={r} className='border-b border-border/60 last:border-b-0'>
                            {row.map((cell, c) => (
                                <td
                                    key={c}
                                    className={cn(
                                        'px-3 py-1.5 align-top whitespace-pre',
                                        cell === null ? 'text-muted-foreground/60 italic' : 'text-foreground/90'
                                    )}>
                                    {formatCell(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                ({result.rows.length} {result.rows.length === 1 ? 'row' : 'rows'})
                {result.rows.length > rows.length && `, showing the first ${rows.length}`}
            </p>
        </div>
    );
}

export function ErrorBox({ error }: { error: QueryError }) {
    return (
        <div className='border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
            <p className='text-destructive font-bold'>ERROR: {error.message}</p>
            {error.line !== undefined && error.caret !== undefined && (
                <pre className='mt-2 overflow-x-auto text-foreground/80'>
                    {error.line}
                    {'\n'}
                    {' '.repeat(Math.max(0, error.caret))}^
                </pre>
            )}
            {error.detail && <p className='mt-2 text-muted-foreground'>DETAIL: {error.detail}</p>}
            {error.hint && <p className='mt-1 text-muted-foreground'>HINT: {error.hint}</p>}
        </div>
    );
}

/**
 * One statement at a time, like psql: each commits on its own, and the first
 * error stops the run while everything before it stays done.
 */
export async function runScript(db: SqlEngine, sql: string): Promise<Outcome> {
    const started = performance.now();
    const results: Results<unknown[]>[] = [];
    let failure: QueryError | undefined;
    for (const statement of splitStatements(sql)) {
        try {
            results.push(await db.query(statement));
        } catch (error) {
            failure = describeError(error, statement);
            break;
        }
    }
    return { results, error: failure, ms: performance.now() - started };
}
