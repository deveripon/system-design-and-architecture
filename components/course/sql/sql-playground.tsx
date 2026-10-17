'use client';

import { toBn } from '@/lib/utils';
import { LoaderCircle, Play, RotateCcw } from 'lucide-react';
import { useId, useState } from 'react';
import { getEngine, resetEngine } from './sql-engine';
import { commandTag, ErrorBox, type Outcome, ResultTable, runScript } from './sql-run';

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
        setOutcome(await runScript(db, sql));
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
