'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

function Panel({
    label,
    title,
    children,
    footer,
}: {
    label: string;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    return (
        <figure className='my-10 border border-border bg-card'>
            <figcaption className='flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30'>
                <span className='font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary'>
                    {label}
                </span>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    {title}
                </span>
            </figcaption>
            <div className='p-5 md:p-8'>{children}</div>
            {footer && (
                <div className='px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed'>
                    {footer}
                </div>
            )}
        </figure>
    );
}

const BTN = 'px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left';
const BTN_ON = 'border-primary bg-primary/10 text-primary';
const BTN_OFF = 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40';
const BTN_DISABLED = 'border-border/50 text-muted-foreground/40 cursor-not-allowed';

/* ------------------------------------------------------------------------- */
/* 1. বার বার: Working Table আর জমানো ফল                                        */
/* ------------------------------------------------------------------------- */

type Place = { id: number; name: string; parent: number | null };

/** The same seventeen places the lesson builds with VALUES. */
const PLACES: Place[] = [
    { id: 1, name: 'Bangladesh', parent: null },
    { id: 2, name: 'Chattogram Division', parent: 1 },
    { id: 3, name: 'Khulna Division', parent: 1 },
    { id: 4, name: 'Sylhet Division', parent: 1 },
    { id: 5, name: 'Barishal Division', parent: 1 },
    { id: 6, name: "Cox's Bazar District", parent: 2 },
    { id: 7, name: 'Rangamati District', parent: 2 },
    { id: 8, name: 'Bandarban District', parent: 2 },
    { id: 9, name: 'Sylhet District', parent: 4 },
    { id: 10, name: 'Patuakhali District', parent: 5 },
    { id: 11, name: "Saint Martin's Island", parent: 6 },
    { id: 12, name: "Cox's Bazar", parent: 6 },
    { id: 13, name: 'Sajek Valley', parent: 7 },
    { id: 14, name: 'Bandarban', parent: 8 },
    { id: 15, name: 'Sundarbans', parent: 3 },
    { id: 16, name: 'Sylhet', parent: 9 },
    { id: 17, name: 'Kuakata', parent: 10 },
];

type Dataset = 'count' | 'down' | 'up';

const DATASETS: { key: Dataset; label: string; anchor: string; step: string }[] = [
    {
        key: 'count',
        label: '1 থেকে 5 গোনা',
        anchor: 'SELECT 1',
        step: 'SELECT x + 1 FROM n WHERE x < 5',
    },
    {
        key: 'down',
        label: 'Bangladesh থেকে নিচে',
        anchor: "SELECT ... FROM places WHERE parent_id IS NULL",
        step: 'SELECT p.* FROM places p JOIN tree t ON p.parent_id = t.place_id',
    },
    {
        key: 'up',
        label: "Saint Martin's থেকে উপরে",
        anchor: "SELECT ... FROM places WHERE name = 'Saint Martin''s Island'",
        step: 'SELECT p.* FROM places p JOIN up u ON p.place_id = u.parent_id',
    },
];

/** Every round's new rows, exactly as PostgreSQL produces them for each dataset, ending with the empty round. */
function roundsFor(dataset: Dataset): string[][] {
    if (dataset === 'count') {
        const rounds: string[][] = [['1']];
        let x = 1;
        while (x < 5) {
            x += 1;
            rounds.push([String(x)]);
        }
        rounds.push([]);
        return rounds;
    }
    if (dataset === 'down') {
        const rounds: Place[][] = [PLACES.filter(p => p.parent === null)];
        while (rounds[rounds.length - 1].length > 0) {
            const ids = new Set(rounds[rounds.length - 1].map(p => p.id));
            rounds.push(PLACES.filter(p => p.parent !== null && ids.has(p.parent)));
        }
        return rounds.map(r => r.map(p => p.name));
    }
    const start = PLACES.find(p => p.id === 11)!;
    const rounds: Place[][] = [[start]];
    while (rounds[rounds.length - 1].length > 0) {
        const parents = new Set(rounds[rounds.length - 1].map(p => p.parent));
        rounds.push(PLACES.filter(p => parents.has(p.id)));
    }
    return rounds.map(r => r.map(p => p.name));
}

/**
 * Runs a recursive CTE one round at a time. The working table holds only the
 * rows the previous round produced; the recursive member reads just those,
 * and the query stops the moment a round produces nothing.
 */
export function RecursionStepLab() {
    const reduce = useReducedMotion();
    const [dataset, setDataset] = useState<Dataset>('down');
    const [round, setRound] = useState(0);

    const rounds = roundsFor(dataset);
    const last = rounds.length - 1;
    const current = rounds[round];
    const total = rounds.slice(0, round + 1).reduce((sum, r) => sum + r.length, 0);
    const done = round === last;
    const meta = DATASETS.find(d => d.key === dataset)!;

    let verdict: string;
    if (round === 0) {
        verdict = `বার ০: Anchor একবার চলল আর ${toBn(current.length)}টা Row দিল। এগুলোই প্রথম Working Table।`;
    } else if (done) {
        verdict = `বার ${toBn(round)}: Recursive Member আগের বারের Row গুলো থেকে কিছুই বানাতে পারল না। Working Table খালি, তাই PostgreSQL থামল। মোট ${toBn(total)}টা Row।`;
    } else {
        verdict = `বার ${toBn(round)}: Recursive Member শুধু আগের বারের ${toBn(rounds[round - 1].length)}টা Row পড়ল আর ${toBn(current.length)}টা নতুন Row দিল। এগুলোই পরের বারের Working Table।`;
    }

    return (
        <Panel
            label='Interactive'
            title='একটা Recursive CTE, এক বার এক বার করে'
            footer={
                <>
                    সব Row এই লেসনের আসল Query গুলোর ফল: 1 থেকে 5 গোনা, জায়গার Tree এর নিচে নামা, আর Saint Martin&apos;s
                    Island থেকে উপরে ওঠা। খেয়াল করুন, Recursive Member কখনো পুরো জমানো ফল পড়ে না, শুধু ঠিক আগের বারের নতুন
                    Row গুলো পড়ে। এই কারণেই Bangladesh দ্বিতীয়বার খোঁজা হয় না।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-5'>
                {DATASETS.map(d => (
                    <button
                        key={d.key}
                        type='button'
                        data-dataset={d.key}
                        onClick={() => {
                            setDataset(d.key);
                            setRound(0);
                        }}
                        className={cn(BTN, dataset === d.key ? BTN_ON : BTN_OFF)}>
                        {d.label}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 font-mono text-[0.75rem]'>
                <div className='border border-border p-3'>
                    <div className='text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1'>Anchor</div>
                    <div className='text-foreground break-words'>{meta.anchor}</div>
                </div>
                <div className='border border-primary/50 bg-primary/5 p-3'>
                    <div className='text-[0.625rem] uppercase tracking-[0.12em] text-primary mb-1'>Recursive Member</div>
                    <div className='text-foreground break-words'>{meta.step}</div>
                </div>
            </div>

            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-action='next'
                    disabled={done}
                    onClick={() => setRound(r => Math.min(last, r + 1))}
                    className={cn(BTN, done ? BTN_DISABLED : BTN_OFF)}>
                    পরের বার
                </button>
                <button
                    type='button'
                    data-action='all'
                    disabled={done}
                    onClick={() => setRound(last)}
                    className={cn(BTN, done ? BTN_DISABLED : BTN_OFF)}>
                    শেষ পর্যন্ত
                </button>
                <button type='button' data-action='reset' onClick={() => setRound(0)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
                <span
                    className='font-mono text-[0.6875rem] text-muted-foreground'
                    data-round={round}
                    data-total={total}
                    data-done={done ? 'true' : 'false'}>
                    {`বার ${toBn(round)} · জমানো ${toBn(total)}`}
                </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <div className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary mb-2'>
                        Working Table: এই বারের নতুন Row
                    </div>
                    <div className='border border-primary/50 min-h-[9rem] p-3 space-y-1.5'>
                        {current.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>খালি। এখানেই থামা।</p>
                        ) : (
                            current.map((name, i) => (
                                <motion.div
                                    key={`${dataset}-${round}-${name}`}
                                    initial={reduce ? false : { opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.04, ease: EASE }}
                                    className='font-mono text-[0.75rem] text-foreground'>
                                    {name}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
                <div>
                    <div className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        জমানো ফল, বার অনুযায়ী
                    </div>
                    <div className='border border-border min-h-[9rem] p-3 space-y-2'>
                        {rounds.slice(0, round + 1).map((r, i) => (
                            <div key={`acc-${i}`} className='flex gap-3 text-[0.75rem]'>
                                <span className='font-mono text-muted-foreground shrink-0'>{`বার ${toBn(i)}`}</span>
                                <span className={cn('font-mono', i === round ? 'text-primary' : 'text-foreground/80')}>
                                    {r.length === 0 ? '(কিছু না)' : r.join(', ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p className='mt-5 text-sm leading-relaxed text-foreground'>{verdict}</p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. চক্রে আটকানো আর তা থেকে বাঁচা                                             */
/* ------------------------------------------------------------------------- */

/** The lesson's made-up transfer map, one row per one-way leg. */
const LEGS: [string, string][] = [
    ['Dhaka', 'Chattogram'],
    ['Chattogram', 'Dhaka'],
    ['Chattogram', "Cox's Bazar"],
    ["Cox's Bazar", 'Chattogram'],
    ["Cox's Bazar", 'Teknaf'],
    ['Teknaf', "Saint Martin's Island"],
    ["Saint Martin's Island", 'Teknaf'],
    ['Chattogram', 'Bandarban'],
    ['Chattogram', 'Rangamati'],
    ['Rangamati', 'Sajek Valley'],
    ['Dhaka', 'Sylhet'],
    ['Dhaka', 'Khulna'],
    ['Khulna', 'Sundarbans'],
    ['Dhaka', 'Kuakata'],
];

type Guard = 'none' | 'path' | 'cycle';
type Trip = { path: string[]; cycle: boolean };

const GUARDS: { key: Guard; label: string; sql: string }[] = [
    { key: 'none', label: 'কোনো পাহারা নেই', sql: 'JOIN routes r ON r.from_place = t.place' },
    { key: 'path', label: 'Path এ আছে কিনা দেখা', sql: 'WHERE NOT r.to_place = ANY(t.path)' },
    { key: 'cycle', label: 'CYCLE Clause', sql: 'CYCLE place SET is_cycle USING path' },
];

/** The rows the next round produces from this round's rows, under one guard. */
function nextRound(rows: Trip[], guard: Guard): Trip[] {
    const out: Trip[] = [];
    for (const row of rows) {
        if (row.cycle) continue;
        const here = row.path[row.path.length - 1];
        for (const [from, to] of LEGS) {
            if (from !== here) continue;
            const seen = row.path.includes(to);
            if (guard === 'path' && seen) continue;
            out.push({ path: [...row.path, to], cycle: guard === 'cycle' && seen });
        }
    }
    return out;
}

/** How many rounds the lab draws before it gives up on the unguarded walk. */
const MAX_DRAWN = 8;

/**
 * Walks the transfer map from Dhaka three ways. Without a guard the two-way
 * legs make the walk go round forever; checking the path, or letting the
 * CYCLE clause mark the repeat, ends it after the same reachable places.
 */
export function CycleGuardLab() {
    const [guard, setGuard] = useState<Guard>('none');
    const [round, setRound] = useState(0);

    const rounds: Trip[][] = [[{ path: ['Dhaka'], cycle: false }]];
    while (rounds.length <= MAX_DRAWN && rounds[rounds.length - 1].length > 0) {
        rounds.push(nextRound(rounds[rounds.length - 1], guard));
    }
    const ends = rounds[rounds.length - 1].length === 0;
    const last = rounds.length - 1;
    const shown = rounds.slice(0, round + 1);
    const total = shown.reduce((sum, r) => sum + r.length, 0);
    const done = round === last;

    let verdict: string;
    if (!done) {
        verdict = `বার ${toBn(round)} পর্যন্ত ${toBn(total)}টা Row। পরের বার চাপুন।`;
    } else if (!ends) {
        verdict = `${toBn(round)} বার পরেও প্রতিবার নতুন Row আসছে, আর সংখ্যা বাড়ছেই, কারণ দুই দিকের পথে গাড়ি ঘুরতেই থাকে। আসল Query এখানে থামত না। এই Lab ${toBn(MAX_DRAWN)} বারে নিজেই থেমেছে।`;
    } else if (guard === 'path') {
        verdict = `বার ${toBn(round)} এ নতুন কিছু নেই, তাই থামা। মোট ${toBn(total)}টা Row: Dhaka আর যে ${toBn(total - 1)}টা জায়গায় যাওয়া যায়, প্রতিটা একবার।`;
    } else {
        const marked = shown.flat().filter(t => t.cycle).length;
        verdict = `বার ${toBn(round)} এ নতুন কিছু নেই, তাই থামা। মোট ${toBn(total)}টা Row, তার মধ্যে ${toBn(marked)}টা is_cycle = true: যেখানে পথটা আগের কোনো জায়গায় ফিরে গেছে। সেগুলো থেকে আর এগোনো হয়নি।`;
    }

    return (
        <Panel
            label='Interactive'
            title='দুই দিকের পথ আর তিন রকম পাহারা'
            footer={
                <>
                    প্রতিটা বারের Row এই লেসনের বানানো যাতায়াতের নকশা থেকে হিসাব করা, আর শেষের সংখ্যাগুলো PostgreSQL 18 এর
                    সাথে মেলানো: Path দেখে 12টা Row, CYCLE Clause দিয়ে 15টা, যার 3টা is_cycle। পাহারা ছাড়া Query টা নিজের
                    বক্সে কখনো চালাবেন না: সেটা থামে না, Browser এর Tab আটকে যায়।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                {GUARDS.map(g => (
                    <button
                        key={g.key}
                        type='button'
                        data-guard={g.key}
                        onClick={() => {
                            setGuard(g.key);
                            setRound(0);
                        }}
                        className={cn(BTN, guard === g.key ? BTN_ON : BTN_OFF)}>
                        {g.label}
                    </button>
                ))}
            </div>
            <p className='mb-5 font-mono text-[0.75rem] text-foreground break-words'>
                {GUARDS.find(g => g.key === guard)!.sql}
            </p>

            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-action='next'
                    disabled={done}
                    onClick={() => setRound(r => Math.min(last, r + 1))}
                    className={cn(BTN, done ? BTN_DISABLED : BTN_OFF)}>
                    পরের বার
                </button>
                <button
                    type='button'
                    data-action='all'
                    disabled={done}
                    onClick={() => setRound(last)}
                    className={cn(BTN, done ? BTN_DISABLED : BTN_OFF)}>
                    শেষ পর্যন্ত
                </button>
                <button type='button' data-action='reset' onClick={() => setRound(0)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
                <span
                    className='font-mono text-[0.6875rem] text-muted-foreground'
                    data-rows={total}
                    data-ends={ends ? 'true' : 'false'}>
                    {`বার ${toBn(round)} · মোট ${toBn(total)}টা Row`}
                </span>
            </div>

            <div className='space-y-3'>
                {shown.map((r, i) => (
                    <div key={`round-${guard}-${i}`} className='border border-border p-3'>
                        <div className='flex flex-wrap items-baseline justify-between gap-2 mb-2'>
                            <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                                {`বার ${toBn(i)}`}
                            </span>
                            <span className='font-mono text-[0.625rem] text-muted-foreground'>{`${toBn(r.length)}টা নতুন Row`}</span>
                        </div>
                        {r.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>কিছু না, থামা।</p>
                        ) : (
                            <div className='flex flex-wrap gap-1.5'>
                                {r.slice(0, 24).map((t, j) => (
                                    <span
                                        key={`${i}-${j}`}
                                        title={t.path.join(' > ')}
                                        className={cn(
                                            'px-2 py-0.5 border font-mono text-[0.6875rem]',
                                            t.cycle
                                                ? 'border-destructive/50 text-destructive'
                                                : 'border-border text-foreground/85'
                                        )}>
                                        {t.path[t.path.length - 1]}
                                        {t.cycle && ' ↺'}
                                    </span>
                                ))}
                                {r.length > 24 && (
                                    <span className='px-2 py-0.5 font-mono text-[0.6875rem] text-muted-foreground'>
                                        {`আরও ${toBn(r.length - 24)}টা`}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className='mt-5 text-sm leading-relaxed text-foreground'>{verdict}</p>
        </Panel>
    );
}
