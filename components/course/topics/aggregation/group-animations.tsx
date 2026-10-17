'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { BOOKINGS, type BookingRow } from './group-data';

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

/* ------------------------------------------------------------------------- */
/* 1. GROUP BY ধাপে ধাপে, আসল ২৪টা Booking এ                                     */
/* ------------------------------------------------------------------------- */

type GroupKey = 'status' | 'departure_id' | 'seats';

const KEYS: { key: GroupKey; label: string }[] = [
    { key: 'status', label: 'status' },
    { key: 'departure_id', label: 'departure_id' },
    { key: 'seats', label: 'seats' },
];

const STEPS = ['১. সব Row', '২. স্তূপে ভাগ', '৩. প্রতি স্তূপে এক Row'];

function keyOf(row: BookingRow, key: GroupKey): string | number {
    if (key === 'status') return row.status;
    if (key === 'departure_id') return row.departureId;
    return row.seats;
}

interface Group {
    value: string | number;
    rows: BookingRow[];
}

/** Groups in ORDER BY key order: text alphabetically, numbers by size. */
function groupRows(key: GroupKey): Group[] {
    const values = [...new Set(BOOKINGS.map(r => keyOf(r, key)))].sort((a, b) =>
        typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))
    );
    return values.map(value => ({ value, rows: BOOKINGS.filter(r => keyOf(r, key) === value) }));
}

const money = (taka: number) => `${taka}.00`;

/**
 * Pick a column and walk GROUP BY through its three steps on the 24 real
 * bookings: every row, the rows sorted into piles, then one row per pile with
 * count(*), sum(seats) and sum(total_bdt). The totals match PostgreSQL.
 */
export function GroupStepLab() {
    const reduce = useReducedMotion();
    const [key, setKey] = useState<GroupKey>('status');
    const [step, setStep] = useState(0);
    const groups = groupRows(key);
    const sql = `SELECT ${key}, count(*) AS bookings,
       sum(seats) AS seats, sum(total_bdt) AS amount
FROM bookings
GROUP BY ${key}
ORDER BY ${key};`;

    return (
        <Panel
            label='Interactive'
            title='GROUP BY কীভাবে কাজ করে, ধাপে ধাপে'
            footer='এখানের ২৪টা Row আর প্রতিটা যোগফল Sample Database এর আসল Data, PostgreSQL এ একই Query চালিয়ে মিলিয়ে নেওয়া। Column বদলে দেখুন: status এ স্তূপ ৩টা, departure_id তে ১৫টা, seats এ ৫টা। যতগুলো আলাদা মান, ততগুলো Row।'>
            <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1'>
                    GROUP BY
                </span>
                {KEYS.map(k => (
                    <button
                        key={k.key}
                        type='button'
                        data-key={k.key}
                        aria-pressed={key === k.key}
                        onClick={() => setKey(k.key)}
                        className={cn(BTN, 'font-mono', key === k.key ? BTN_ON : BTN_OFF)}>
                        {k.label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
                {STEPS.map((label, i) => (
                    <button
                        key={label}
                        type='button'
                        data-step={i}
                        aria-pressed={step === i}
                        onClick={() => setStep(i)}
                        className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                        {label}
                    </button>
                ))}
            </div>

            <pre className='mb-6 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {sql}
            </pre>

            <motion.div
                key={`${key}-${step}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                data-active-step={step}
                data-groups={groups.length}>
                {step === 0 && (
                    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2'>
                        {BOOKINGS.map(row => (
                            <div key={row.id} className='border border-border px-2 py-1.5 font-mono text-[0.6875rem]'>
                                <span className='text-muted-foreground'>#{row.id}</span>{' '}
                                <span className='text-foreground'>{String(keyOf(row, key))}</span>
                            </div>
                        ))}
                    </div>
                )}

                {step === 1 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {groups.map(g => (
                            <div key={String(g.value)} className='border border-primary/40 bg-primary/5 p-3'>
                                <p className='font-mono text-[0.75rem] font-bold text-primary mb-2'>
                                    {key} = {String(g.value)}
                                    <span className='ml-2 font-normal text-muted-foreground'>({toBn(g.rows.length)}টা Row)</span>
                                </p>
                                <div className='flex flex-wrap gap-1.5'>
                                    {g.rows.map(row => (
                                        <span key={row.id} className='border border-border bg-background px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground'>
                                            #{row.id}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {[key, 'bookings', 'seats', 'amount'].map(h => (
                                        <th key={h} className='border-b border-border px-3 py-2 text-left font-bold text-foreground'>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map(g => (
                                    <tr key={String(g.value)} className='border-b border-border/60 last:border-b-0'>
                                        <td className='px-3 py-1.5 text-primary'>{String(g.value)}</td>
                                        <td className='px-3 py-1.5'>{g.rows.length}</td>
                                        <td className='px-3 py-1.5'>{g.rows.reduce((sum, r) => sum + r.seats, 0)}</td>
                                        <td className='px-3 py-1.5'>{money(g.rows.reduce((sum, r) => sum + r.total, 0))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                            ({groups.length} rows), ২৪টা Row থেকে
                        </p>
                    </div>
                )}
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. চলবে নাকি Error? সোনালি নিয়মের পরীক্ষা                                     */
/* ------------------------------------------------------------------------- */

interface RuleCase {
    id: string;
    sql: string;
    runs: boolean;
    /** It runs, but the answer is useless or misleading. */
    trap?: boolean;
    output: string;
    why: string;
    mysql: string;
}

const CASES: RuleCase[] = [
    {
        id: 'grouped',
        sql: 'SELECT status, count(*)\nFROM bookings\nGROUP BY status\nORDER BY status;',
        runs: true,
        output: 'cancelled | 3\nconfirmed | 17\npending   | 4\n(3 rows)',
        why: 'status দিয়ে ভাগ করা হয়েছে, আর count(*) একটা Aggregate। দুটো Column ই নিয়ম মানে।',
        mysql: 'MySQL এও একই তিনটা Row।',
    },
    {
        id: 'extra-column',
        sql: 'SELECT status, booking_id, count(*)\nFROM bookings\nGROUP BY status;',
        runs: false,
        output:
            'ERROR:  column "bookings.booking_id" must appear in the GROUP BY clause or be used in an aggregate function',
        why: 'confirmed স্তূপে ১৭টা আলাদা booking_id। একটা Row তে কোনটা বসবে, বলা নেই।',
        mysql:
            'MySQL 8.4 এর Default Mode এও ERROR 1055। ONLY_FULL_GROUP_BY বন্ধ করলে MySQL প্রতিটা স্তূপ থেকে নিজের ইচ্ছামতো একটা booking_id বসিয়ে দেয় (পরীক্ষায় 5, 1 আর 14)।',
    },
    {
        id: 'no-group',
        sql: 'SELECT status, count(*)\nFROM bookings;',
        runs: false,
        output:
            'ERROR:  column "bookings.status" must appear in the GROUP BY clause or be used in an aggregate function',
        why: 'GROUP BY না থাকলে পুরো Table একটা স্তূপ। ২৪টা Row এর status তিন রকম, ঘর একটা।',
        mysql:
            'MySQL এ ERROR 1140। Mode বন্ধ থাকলে উত্তর আসে confirmed | 24, যেটা পড়লে মনে হয় ২৪টাই confirmed। আসলে confirmed ১৭টা।',
    },
    {
        id: 'primary-key',
        sql: 'SELECT tour_id, title, count(*)\nFROM tours\nGROUP BY tour_id\nORDER BY tour_id;',
        runs: true,
        output: '1 | Saint Martin Island Escape | 1\n2 | Cox\'s Bazar Beach Weekend  | 1\n... (9 rows)',
        why: 'tour_id হলো tours এর Primary Key। একটা tour_id মানে একটাই ট্যুর, তাই title নিয়ে কোনো দ্বিধা নেই।',
        mysql: 'MySQL 8.4 ও Primary Key ধরে নির্ভরতা বোঝে, তাই এটাও চলে।',
    },
    {
        id: 'not-key',
        sql: 'SELECT title, price_bdt\nFROM tours\nGROUP BY title;',
        runs: false,
        output: 'ERROR:  column "tours.price_bdt" must appear in the GROUP BY clause or be used in an aggregate function',
        why: 'title Primary Key না। আজ দুটো ট্যুরের নাম আলাদা হলেও Database সেটার নিশ্চয়তা পায় না।',
        mysql: 'MySQL এও ERROR 1055, একই কারণে।',
    },
    {
        id: 'no-label',
        sql: 'SELECT count(*)\nFROM bookings\nGROUP BY status\nORDER BY count(*) DESC;',
        runs: true,
        trap: true,
        output: '17\n4\n3\n(3 rows)',
        why: 'নিয়ম ভাঙেনি, তাই চলে। কিন্তু কোন সংখ্যাটা কোন status এর, Result দেখে বলা যায় না। যে Column দিয়ে ভাগ করছেন, সেটা SELECT এ রাখুন।',
        mysql: 'MySQL এও চলে, একই সমস্যা নিয়ে।',
    },
    {
        id: 'alias-trap',
        sql: "SELECT CASE WHEN seats >= 3 THEN 'group'\n            ELSE 'small' END AS seats,\n       count(*)\nFROM bookings\nGROUP BY seats;",
        runs: true,
        trap: true,
        output: 'group | 3\ngroup | 1\ngroup | 2\nsmall | 13\nsmall | 5\n(5 rows)',
        why: 'GROUP BY seats পড়ে Table এর আসল seats Column, আপনার দেওয়া নাম না। তাই ভাগ হয় ১, ২, ৩, ৪, ৫ সিট ধরে, আর একই লেবেল কয়েকবার আসে। নামটা বদলে size রাখলে ঠিক দুটো Row আসে।',
        mysql: 'MySQL 8.4 এও ঠিক একই ফাঁদ: পাঁচটা Row।',
    },
];

/**
 * Seven real queries: predict whether each runs, then see PostgreSQL's real
 * answer, why, and what MySQL 8.4 does with the same text.
 */
export function RuleCheckLab() {
    const [active, setActive] = useState(CASES[0].id);
    const [guesses, setGuesses] = useState<Record<string, boolean>>({});
    const current = CASES.find(c => c.id === active) ?? CASES[0];
    const guess = guesses[current.id];
    const answered = guess !== undefined;
    const score = CASES.filter(c => guesses[c.id] !== undefined && guesses[c.id] === c.runs).length;

    return (
        <Panel
            label='Interactive'
            title='চলবে, নাকি Error?'
            footer='প্রতিটা Output PostgreSQL 18 এ চালিয়ে নেওয়া, আর MySQL এর আচরণ MySQL 8.4 এর Default Mode এ পরীক্ষা করা। শেষের দুটো চলে, কিন্তু উত্তরটা কাজের না: Error না আসা মানেই ঠিক উত্তর না।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {CASES.map((c, i) => (
                    <button
                        key={c.id}
                        type='button'
                        data-case={c.id}
                        aria-pressed={active === c.id}
                        onClick={() => setActive(c.id)}
                        className={cn(BTN, active === c.id ? BTN_ON : BTN_OFF)}>
                        Query {toBn(i + 1)}
                        {guesses[c.id] !== undefined && (guesses[c.id] === c.runs ? ' ✓' : ' ✗')}
                    </button>
                ))}
            </div>

            <pre className='mb-4 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground'>
                {current.sql}
            </pre>

            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <span className='text-sm text-muted-foreground mr-1'>আপনার আন্দাজ:</span>
                {[
                    { value: true, label: 'চলবে' },
                    { value: false, label: 'Error দেবে' },
                ].map(option => (
                    <button
                        key={option.label}
                        type='button'
                        data-guess={option.value ? 'runs' : 'error'}
                        aria-pressed={guess === option.value}
                        onClick={() => setGuesses(prev => ({ ...prev, [current.id]: option.value }))}
                        className={cn(BTN, guess === option.value ? BTN_ON : BTN_OFF)}>
                        {option.label}
                    </button>
                ))}
                <span className='ml-auto font-mono text-[0.6875rem] text-muted-foreground' data-score={score}>
                    সঠিক {toBn(score)} / {toBn(CASES.length)}
                </span>
            </div>

            {answered && (
                <div data-result={current.runs ? (current.trap ? 'trap' : 'runs') : 'error'} className='space-y-3'>
                    <p
                        className={cn(
                            'border px-4 py-2 text-sm',
                            guess === current.runs ? 'border-primary/50 bg-primary/10' : 'border-destructive/40 bg-destructive/5'
                        )}>
                        {guess === current.runs ? 'ঠিক ধরেছেন।' : 'এবার মেলেনি।'}{' '}
                        {current.runs ? (current.trap ? 'চলে, কিন্তু একটা ফাঁদ আছে।' : 'Query টা চলে।') : 'PostgreSQL চালাতে রাজি হয় না।'}
                    </p>
                    <pre
                        className={cn(
                            'overflow-x-auto border px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap',
                            current.runs ? 'border-border bg-muted/20 text-foreground' : 'border-destructive/40 bg-destructive/5 text-destructive'
                        )}>
                        {current.output}
                    </pre>
                    <p className='text-sm leading-relaxed text-foreground'>{current.why}</p>
                    <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                        <span className='font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-primary mr-2'>MySQL</span>
                        {current.mysql}
                    </p>
                </div>
            )}
        </Panel>
    );
}
