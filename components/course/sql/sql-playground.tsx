'use client';

import { PLAYGROUND_MAX_ROWS } from '@/lib/sql/playground-config';
import { splitStatements } from '@/lib/sql/split-statements';
import { cn, toBn } from '@/lib/utils';
import type { Results } from '@electric-sql/pglite';
import { LoaderCircle, Play, RotateCcw } from 'lucide-react';
import { useId, useState } from 'react';
import { getEngine, resetEngine } from './sql-engine';

interface QueryError {
    message: string;
    detail?: string;
    hint?: string;
    line?: string;
    caret?: number;
}

/** What one Run produced: every statement that finished, then the error that stopped it, if any. */
interface Outcome {
    results: Results<unknown[]>[];
    error?: QueryError;
    ms: number;
}

// PGlite turns numbers, dates and booleans into JavaScript values. Handing
// every common type back as text keeps the output exactly as psql prints it:
// 12500.00 instead of 12500, t instead of true, and the +06 offset kept.
const RAW_TEXT_TYPES = [16, 20, 21, 23, 26, 114, 700, 701, 1082, 1083, 1114, 1184, 1186, 1266, 1700, 3802];
const RAW_PARSERS = Object.fromEntries(
    RAW_TEXT_TYPES.map(id => [id, (value: string) => value])
);

function formatCell(value: unknown): string {
    if (value === null || value === undefined) return 'NULL';
    if (Array.isArray(value)) {
        return `{${value.map(item => (item === null ? 'NULL' : formatCell(item))).join(',')}}`;
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

/** psql style error: the message, then the offending line of that statement with a caret under it. */
function describeError(error: unknown, sql: string): QueryError {
    const e = error as { message?: string; detail?: string; hint?: string; position?: string | number };
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
function commandTag(result: Results<unknown[]>) {
    const command = result.command ?? 'OK';
    return result.rowCount === undefined ? command : `${command} ${result.rowCount}`;
}

function ResultTable({ result }: { result: Results<unknown[]> }) {
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

function ErrorBox({ error }: { error: QueryError }) {
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
 * A query box running real PostgreSQL in the browser, loaded with the Island
 * Tours sample database. Ctrl or Cmd + Enter runs it.
 */
export function SqlPlayground({
    query,
    title = 'Try it',
    caption,
}: {
    query: string;
    title?: string;
    caption?: React.ReactNode;
}) {
    const editorId = useId();
    const [sql, setSql] = useState(query.trim());
    const [busy, setBusy] = useState<'idle' | 'running' | 'resetting'>('idle');
    const [outcome, setOutcome] = useState<Outcome | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const run = async () => {
        if (busy !== 'idle' || !sql.trim()) return;
        setBusy('running');
        setLoadError(null);
        let db;
        try {
            db = await getEngine();
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : String(error));
            setBusy('idle');
            return;
        }
        // One statement at a time, like psql: each commits on its own, and
        // the first error stops the run while everything before it stays done.
        const started = performance.now();
        const results: Results<unknown[]>[] = [];
        let failure: QueryError | undefined;
        for (const statement of splitStatements(sql)) {
            try {
                results.push(
                    (await db.query(statement, [], {
                        rowMode: 'array',
                        parsers: RAW_PARSERS,
                    })) as Results<unknown[]>
                );
            } catch (error) {
                failure = describeError(error, statement);
                break;
            }
        }
        setOutcome({ results, error: failure, ms: performance.now() - started });
        setBusy('idle');
    };

    const reset = async () => {
        if (busy !== 'idle') return;
        setBusy('resetting');
        setOutcome(null);
        setSql(query.trim());
        try {
            await resetEngine();
            setLoadError(null);
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : String(error));
        } finally {
            setBusy('idle');
        }
    };

    return (
        <figure className='my-10 border border-border bg-card' data-sql-playground>
            <figcaption className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 border-b border-border bg-muted/30'>
                <span className='flex items-baseline gap-3'>
                    <span className='font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary'>
                        PostgreSQL
                    </span>
                    <label
                        htmlFor={editorId}
                        className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        {title}
                    </label>
                </span>
                <span className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={reset}
                        disabled={busy !== 'idle'}
                        className='flex h-8 items-center gap-1.5 border border-border px-2.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50'>
                        <RotateCcw className='h-3.5 w-3.5' />
                        Reset
                    </button>
                    <button
                        type='button'
                        onClick={run}
                        disabled={busy !== 'idle'}
                        className='flex h-8 items-center gap-1.5 border border-primary bg-primary px-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60'>
                        {busy === 'idle' ? (
                            <Play className='h-3.5 w-3.5' />
                        ) : (
                            <LoaderCircle className='h-3.5 w-3.5 animate-spin' />
                        )}
                        Run
                    </button>
                </span>
            </figcaption>

            <textarea
                id={editorId}
                value={sql}
                onChange={event => setSql(event.target.value)}
                onKeyDown={event => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault();
                        run();
                    }
                }}
                spellCheck={false}
                autoCapitalize='off'
                autoCorrect='off'
                rows={Math.min(14, Math.max(3, sql.split('\n').length + 1))}
                className='block w-full resize-y bg-background px-5 py-4 font-mono text-[0.8125rem] leading-relaxed text-foreground outline-none focus:bg-primary/[0.03]'
            />

            <div className='border-t border-border px-5 py-4 space-y-4' aria-live='polite'>
                {busy !== 'idle' && !outcome && (
                    <p className='flex items-center gap-2 font-mono text-[0.6875rem] text-muted-foreground'>
                        <LoaderCircle className='h-3.5 w-3.5 animate-spin' />
                        {busy === 'resetting'
                            ? 'নতুন করে Sample Database তৈরি হচ্ছে...'
                            : 'PostgreSQL চালু হচ্ছে, প্রথমবার কয়েক সেকেন্ড লাগতে পারে...'}
                    </p>
                )}

                {loadError && (
                    <p className='font-mono text-[0.75rem] text-destructive'>
                        PostgreSQL চালু করা যায়নি ({loadError})। Page টা আবার Load করে চেষ্টা করুন।
                    </p>
                )}

                {!outcome && busy === 'idle' && !loadError && (
                    <p className='font-mono text-[0.6875rem] text-muted-foreground'>
                        Run চাপুন, অথবা Ctrl/⌘ + Enter। Query বদলে নিজের মতো চালিয়ে দেখুন, Reset চাপলে সব আগের মতো হয়ে যাবে।
                    </p>
                )}

                {outcome && (
                    <>
                        {outcome.results.map((result, i) =>
                            result.fields.length > 0 ? (
                                <ResultTable key={i} result={result} />
                            ) : (
                                <p key={i} className='font-mono text-[0.75rem] text-muted-foreground'>
                                    {commandTag(result)}
                                </p>
                            )
                        )}
                        {outcome.error && <ErrorBox error={outcome.error} />}
                        <p className='font-mono text-[0.625rem] text-muted-foreground/70'>
                            {toBn(outcome.results.length)}টা Statement চলেছে, {toBn(Math.max(1, Math.round(outcome.ms)))} মিলিসেকেন্ডে।
                            {outcome.error && ' তার পরের Statement এ Error, তাই বাকিগুলো আর চালানো হয়নি।'}
                        </p>
                    </>
                )}
            </div>

            {caption && (
                <div className='px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed'>
                    {caption}
                </div>
            )}
        </figure>
    );
}
