'use client';

import { compareResults, type ResultShape, type Verdict } from '@/lib/sql/compare-results';
import { cn, toBn } from '@/lib/utils';
import type { Results } from '@electric-sql/pglite';
import { Check, Eye, Lightbulb, LoaderCircle, X } from 'lucide-react';
import { useId, useState } from 'react';
import { getEngine } from './sql-engine';
import { ErrorBox, formatCell, type Outcome, ResultTable, runScript } from './sql-run';

/** The last result of a run that has columns, as plain text, or null when there is none. */
function lastTable(outcome: Outcome): { result: Results<unknown[]>; shape: ResultShape } | null {
    const result = [...outcome.results].reverse().find(r => r.fields.length > 0);
    if (!result) return null;
    return {
        result,
        shape: {
            columns: result.fields.map(f => f.name),
            rows: result.rows.map(row => row.map(cell => formatCell(cell))),
        },
    };
}

function verdictText(verdict: Verdict): string {
    if (verdict.match) return 'সঠিক! আপনার ফলাফল প্রত্যাশিত ফলাফলের সাথে হুবহু মিলেছে।';
    switch (verdict.reason) {
        case 'no-result':
            return 'আপনার Query কোনো Table ফেরত দেয়নি। শেষ Statement টা একটা SELECT হওয়া চাই।';
        case 'column-count':
            return `Column এর সংখ্যা মেলেনি: আপনার ${toBn(verdict.actualColumns)}টা, দরকার ${toBn(verdict.expectedColumns)}টা।`;
        case 'row-count':
            return `Row এর সংখ্যা মেলেনি: আপনার ${toBn(verdict.actualRows)}টা, দরকার ${toBn(verdict.expectedRows)}টা।`;
        case 'values':
            return 'Row আর Column এর সংখ্যা ঠিক আছে, কিন্তু কিছু মান মেলেনি। শর্ত আর Column গুলো আবার দেখুন।';
        case 'order':
            return 'সব Row ঠিক আছে, শুধু ক্রমটা আলাদা। এই প্রশ্নে সাজানোর ক্রমও উত্তরের অংশ।';
    }
}

type Attempt =
    | { kind: 'verdict'; verdict: Verdict; outcome: Outcome; mine: Results<unknown[]> | null }
    | { kind: 'error'; outcome: Outcome }
    | { kind: 'load-error'; message: string };

/**
 * A practice task with a hidden answer. Check runs the reader's query and the
 * solution on the same PostgreSQL and compares the results, so any correct
 * query passes, not only the one the author wrote. The solution must only
 * read data.
 */
export function SqlExercise({
    task,
    solution,
    starter = '',
    hint,
    orderMatters = false,
    title = 'Exercise',
}: {
    task: React.ReactNode;
    solution: string;
    starter?: string;
    hint?: React.ReactNode;
    /** True when the task asks for a specific order, so a different order fails. */
    orderMatters?: boolean;
    title?: string;
}) {
    const editorId = useId();
    const [sql, setSql] = useState(starter.trim());
    const [busy, setBusy] = useState(false);
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const check = async () => {
        if (busy || !sql.trim()) return;
        setBusy(true);
        try {
            const db = await getEngine();
            const outcome = await runScript(db, sql);
            if (outcome.error) {
                setAttempt({ kind: 'error', outcome });
                return;
            }
            const expected = await runScript(db, solution);
            const answer = lastTable(expected);
            if (!answer) throw new Error('the solution returned no table');
            const mine = lastTable(outcome);
            setAttempt({
                kind: 'verdict',
                verdict: compareResults(mine?.shape ?? null, answer.shape, orderMatters),
                outcome,
                mine: mine?.result ?? null,
            });
        } catch (error) {
            setAttempt({ kind: 'load-error', message: error instanceof Error ? error.message : String(error) });
        } finally {
            setBusy(false);
        }
    };

    const verdict = attempt?.kind === 'verdict' ? attempt.verdict : null;

    return (
        <figure
            className='my-10 border border-border bg-card'
            data-sql-exercise
            data-verdict={verdict ? (verdict.match ? 'match' : 'mismatch') : attempt?.kind ?? 'none'}>
            <figcaption className='px-5 py-3 border-b border-border bg-muted/30'>
                <span className='font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary'>
                    {title}
                </span>
            </figcaption>

            <div className='px-5 py-4 text-sm md:text-base leading-relaxed text-foreground'>{task}</div>

            <textarea
                id={editorId}
                aria-label='আপনার Query'
                value={sql}
                placeholder='-- আপনার Query এখানে লিখুন'
                onChange={event => setSql(event.target.value)}
                onKeyDown={event => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault();
                        check();
                    }
                }}
                spellCheck={false}
                autoCapitalize='off'
                autoCorrect='off'
                rows={Math.min(12, Math.max(4, sql.split('\n').length + 1))}
                className='block w-full resize-y border-y border-border bg-background px-5 py-4 font-mono text-[0.8125rem] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus:bg-primary/[0.03]'
            />

            <div className='flex flex-wrap items-center gap-2 px-5 py-3'>
                <button
                    type='button'
                    onClick={check}
                    disabled={busy || !sql.trim()}
                    className='flex h-8 items-center gap-1.5 border border-primary bg-primary px-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60'>
                    {busy ? <LoaderCircle className='h-3.5 w-3.5 animate-spin' /> : <Check className='h-3.5 w-3.5' />}
                    Check
                </button>
                {hint && (
                    <button
                        type='button'
                        onClick={() => setShowHint(v => !v)}
                        aria-expanded={showHint}
                        className='flex h-8 items-center gap-1.5 border border-border px-2.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'>
                        <Lightbulb className='h-3.5 w-3.5' />
                        Hint
                    </button>
                )}
                <button
                    type='button'
                    onClick={() => setShowSolution(v => !v)}
                    aria-expanded={showSolution}
                    className='flex h-8 items-center gap-1.5 border border-border px-2.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'>
                    <Eye className='h-3.5 w-3.5' />
                    Solution
                </button>
                <span className='font-mono text-[0.625rem] text-muted-foreground'>Ctrl/⌘ + Enter</span>
            </div>

            {showHint && hint && (
                <div className='mx-5 mb-4 border-l-2 border-primary/60 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground'>
                    {hint}
                </div>
            )}

            {showSolution && (
                <div className='mx-5 mb-4 border border-border bg-background'>
                    <p className='border-b border-border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        একটা সম্ভাব্য সমাধান। অন্যভাবে লিখেও একই ফলাফল আনলে সেটাও সঠিক।
                    </p>
                    <pre className='overflow-x-auto px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground'>
                        {solution.trim()}
                    </pre>
                </div>
            )}

            {attempt && (
                <div className='border-t border-border px-5 py-4 space-y-4' aria-live='polite'>
                    {attempt.kind === 'load-error' && (
                        <p className='font-mono text-[0.75rem] text-destructive'>
                            যাচাই করা যায়নি ({attempt.message})। Page টা আবার Load করে চেষ্টা করুন।
                        </p>
                    )}
                    {attempt.kind === 'error' && attempt.outcome.error && <ErrorBox error={attempt.outcome.error} />}
                    {attempt.kind === 'verdict' && (
                        <>
                            <p
                                className={cn(
                                    'flex items-start gap-2 border px-4 py-3 text-sm leading-relaxed',
                                    attempt.verdict.match
                                        ? 'border-primary/50 bg-primary/10 text-foreground'
                                        : 'border-destructive/40 bg-destructive/5 text-foreground'
                                )}>
                                {attempt.verdict.match ? (
                                    <Check className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                                ) : (
                                    <X className='mt-0.5 h-4 w-4 shrink-0 text-destructive' />
                                )}
                                {verdictText(attempt.verdict)}
                            </p>
                            {attempt.mine && <ResultTable result={attempt.mine} />}
                        </>
                    )}
                </div>
            )}
        </figure>
    );
}
