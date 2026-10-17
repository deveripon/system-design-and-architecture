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

/* ------------------------------------------------------------------------- */
/* 1. Top N per group, with a choice of function and N                       */
/* ------------------------------------------------------------------------- */

type Fn = 'row_number' | 'rank' | 'dense_rank';

/** Real bookings that were not cancelled, three months, in whole taka. */
const MONTHS: { key: string; label: string; rows: { id: number; total: number }[] }[] = [
    {
        key: '2026-01',
        label: 'January 2026',
        rows: [
            { id: 3, total: 12500 },
            { id: 4, total: 25500 },
            { id: 6, total: 36000 },
            { id: 7, total: 18000 },
        ],
    },
    {
        key: '2026-03',
        label: 'March 2026',
        rows: [
            { id: 9, total: 28000 },
            { id: 10, total: 14000 },
            { id: 11, total: 15600 },
        ],
    },
    {
        key: '2026-10',
        label: 'October 2026',
        rows: [
            { id: 14, total: 50000 },
            { id: 16, total: 36000 },
            { id: 17, total: 36000 },
            { id: 19, total: 28000 },
            { id: 20, total: 15600 },
            { id: 21, total: 10500 },
            { id: 22, total: 12500 },
            { id: 23, total: 42500 },
            { id: 24, total: 15600 },
        ],
    },
];

const FNS: { key: Fn; label: string; note: string }[] = [
    { key: 'row_number', label: 'ROW_NUMBER', note: 'সমান অঙ্কেও আলাদা নম্বর, booking_id দিয়ে ঠিক করা' },
    { key: 'rank', label: 'RANK', note: 'সমান অঙ্কে একই নম্বর, তারপর ফাঁক' },
    { key: 'dense_rank', label: 'DENSE_RANK', note: 'সমান অঙ্কে একই নম্বর, ফাঁক ছাড়া' },
];

/** The numbers PostgreSQL gives, computed the same way: biggest first, booking_id breaks ties for ROW_NUMBER. */
function number(rows: { id: number; total: number }[], fn: Fn) {
    const sorted = [...rows].sort((a, b) => b.total - a.total || a.id - b.id);
    let rank = 0;
    let dense = 0;
    let previous: number | null = null;
    return sorted.map((row, i) => {
        if (row.total !== previous) {
            rank = i + 1;
            dense += 1;
            previous = row.total;
        }
        const value = fn === 'row_number' ? i + 1 : fn === 'rank' ? rank : dense;
        return { ...row, value };
    });
}

export function TopNLab() {
    const reduce = useReducedMotion();
    const [month, setMonth] = useState('2026-10');
    const [fn, setFn] = useState<Fn>('row_number');
    const [n, setN] = useState(3);
    const current = MONTHS.find(m => m.key === month) ?? MONTHS[0];
    const numbered = number(current.rows, fn);
    const kept = numbered.filter(row => row.value <= n).length;
    const fnLabel = FNS.find(f => f.key === fn)?.label ?? '';

    return (
        <Panel
            label='Interactive'
            title='মাস, Function আর N বদলে দেখুন কে টেকে'
            footer='সংখ্যাগুলো আসল Data থেকে, বাতিল Booking বাদ। October এ Booking 16 আর 17 দুটোই 36000, আর 20 আর 24 দুটোই 15600। ROW_NUMBER এ সমান অঙ্কের মধ্যে ছোট booking_id আগে, কারণ Query তে Tie-breaker হিসেবে booking_id দেওয়া আছে। Tie-breaker না দিলে কে আগে আসবে তার কোনো নিশ্চয়তা নেই।'>
            <div className='space-y-4'>
                <div className='flex flex-wrap gap-2' role='group' aria-label='মাস'>
                    {MONTHS.map(m => (
                        <button
                            key={m.key}
                            type='button'
                            data-month={m.key}
                            aria-pressed={month === m.key}
                            onClick={() => setMonth(m.key)}
                            className={cn(BTN, month === m.key ? BTN_ON : BTN_OFF)}>
                            {m.label}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap gap-2' role='group' aria-label='Function'>
                    {FNS.map(f => (
                        <button
                            key={f.key}
                            type='button'
                            data-fn={f.key}
                            aria-pressed={fn === f.key}
                            onClick={() => setFn(f.key)}
                            className={cn(BTN, 'font-mono', fn === f.key ? BTN_ON : BTN_OFF)}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2' role='group' aria-label='N'>
                    <span className='font-mono text-[0.6875rem] text-muted-foreground'>{'WHERE n <='}</span>
                    {[1, 2, 3, 4].map(value => (
                        <button
                            key={value}
                            type='button'
                            data-n={value}
                            aria-pressed={n === value}
                            onClick={() => setN(value)}
                            className={cn(BTN, 'font-mono w-10 text-center', n === value ? BTN_ON : BTN_OFF)}>
                            {value}
                        </button>
                    ))}
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {`${fnLabel.toLowerCase()}() OVER (PARTITION BY month\n${' '.repeat(fnLabel.length + 9)}ORDER BY total_bdt DESC${fn === 'row_number' ? ', booking_id' : ''}) AS n`}
                </pre>

                <div className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]' data-kept={kept}>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className='px-3 py-2 border-b border-border'>booking_id</th>
                                <th className='px-3 py-2 border-b border-border'>total_bdt</th>
                                <th className='px-3 py-2 border-b border-border'>n</th>
                                <th className='px-3 py-2 border-b border-border'>{`n <= ${n}`}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {numbered.map(row => {
                                const keep = row.value <= n;
                                return (
                                    <motion.tr
                                        key={`${month}-${row.id}`}
                                        layout={!reduce}
                                        transition={{ duration: 0.3, ease: EASE }}
                                        className={cn('border-b border-border/60 last:border-b-0', keep ? 'bg-primary/5' : 'opacity-45')}>
                                        <td className='px-3 py-1.5'>{row.id}</td>
                                        <td className='px-3 py-1.5'>{row.total.toFixed(2)}</td>
                                        <td className={cn('px-3 py-1.5 font-bold', keep && 'text-primary')}>{row.value}</td>
                                        <td className='px-3 py-1.5'>{keep ? 'থাকে' : 'বাদ'}</td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className='text-sm text-foreground'>
                    {current.label} এ {toBn(current.rows.length)}টা Booking থেকে টিকে থাকে{' '}
                    <strong className='text-primary'>{toBn(kept)}টা</strong>।{' '}
                    <span className='text-muted-foreground'>{FNS.find(f => f.key === fn)?.note}।</span>
                </p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Gaps and islands, one row at a time                                    */
/* ------------------------------------------------------------------------- */

type Dataset = 'days' | 'ids' | 'status';

/** The 24 real booking days, Dhaka dates, already sorted. */
const DAYS = [
    '2025-12-20', '2025-12-28', '2026-01-05', '2026-01-06', '2026-01-10', '2026-01-25',
    '2026-01-28', '2026-01-30', '2026-02-20', '2026-03-01', '2026-03-02', '2026-03-25',
    '2026-09-15', '2026-09-20', '2026-09-28', '2026-10-01', '2026-10-02', '2026-10-04',
    '2026-10-08', '2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14',
];

/** booking_id of every real payment, sorted. 12, 17, 18, 20 and 24 have none. */
const PAID_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 19, 21, 22, 23];

/** Every real booking in booked_at order with its status. */
const STATUSES: { id: number; status: string }[] = [
    { id: 1, status: 'confirmed' }, { id: 2, status: 'confirmed' }, { id: 4, status: 'confirmed' },
    { id: 5, status: 'cancelled' }, { id: 3, status: 'confirmed' }, { id: 6, status: 'confirmed' },
    { id: 7, status: 'confirmed' }, { id: 12, status: 'cancelled' }, { id: 8, status: 'confirmed' },
    { id: 9, status: 'confirmed' }, { id: 10, status: 'confirmed' }, { id: 11, status: 'confirmed' },
    { id: 13, status: 'confirmed' }, { id: 15, status: 'confirmed' }, { id: 18, status: 'cancelled' },
    { id: 14, status: 'pending' }, { id: 16, status: 'confirmed' }, { id: 19, status: 'confirmed' },
    { id: 17, status: 'pending' }, { id: 20, status: 'pending' }, { id: 21, status: 'confirmed' },
    { id: 22, status: 'confirmed' }, { id: 23, status: 'confirmed' }, { id: 24, status: 'pending' },
];

interface TrickRow {
    label: string;
    /** The extra columns shown, in order. */
    cells: string[];
    /** Rows with the same group key belong to the same island. */
    group: string;
}

function minusDays(day: string, n: number) {
    const [y, m, d] = day.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d - n)).toISOString().slice(0, 10);
}

function buildRows(dataset: Dataset): TrickRow[] {
    if (dataset === 'days') {
        return DAYS.map((day, i) => {
            const key = minusDays(day, i + 1);
            return { label: day, cells: [String(i + 1), key], group: key };
        });
    }
    if (dataset === 'ids') {
        return PAID_IDS.map((id, i) => {
            const key = String(id - (i + 1));
            return { label: String(id), cells: [String(i + 1), key], group: key };
        });
    }
    const seen: Record<string, number> = {};
    return STATUSES.map((row, i) => {
        seen[row.status] = (seen[row.status] ?? 0) + 1;
        const all = i + 1;
        const own = seen[row.status];
        const key = String(all - own);
        return {
            label: `#${row.id} ${row.status}`,
            cells: [String(all), String(own), key],
            group: `${row.status}:${key}`,
        };
    });
}

const DATASETS: {
    key: Dataset;
    label: string;
    headers: string[];
    unit: string;
    sql: string;
}[] = [
    {
        key: 'days',
        label: 'Booking এর দিন',
        headers: ['day', 'rn', 'day - rn'],
        unit: 'দিন',
        sql: 'day - row_number() OVER (ORDER BY day)::int',
    },
    {
        key: 'ids',
        label: 'Payment এর booking_id',
        headers: ['booking_id', 'rn', 'id - rn'],
        unit: 'টা id',
        sql: 'booking_id - row_number() OVER (ORDER BY booking_id)',
    },
    {
        key: 'status',
        label: 'Status এর ধারা',
        headers: ['booking', 'সবার rn', 'status এর rn', 'বিয়োগ'],
        unit: 'টা Booking',
        sql: 'row_number() OVER (ORDER BY booked_at)\n  - row_number() OVER (PARTITION BY status ORDER BY booked_at)',
    },
];

export function IslandsLab() {
    const [dataset, setDataset] = useState<Dataset>('days');
    const rows = buildRows(dataset);
    const [step, setStep] = useState(0);
    const shown = Math.min(step, rows.length);
    const meta = DATASETS.find(d => d.key === dataset) ?? DATASETS[0];

    // Consecutive rows with the same group are one island.
    const islandOf: number[] = [];
    const sizes: number[] = [];
    rows.forEach((row, i) => {
        if (i > 0 && rows[i - 1].group === row.group) {
            islandOf.push(islandOf[i - 1]);
            sizes[sizes.length - 1] += 1;
        } else {
            islandOf.push(sizes.length);
            sizes.push(1);
        }
    });
    const visibleIslands = shown === 0 ? 0 : islandOf[shown - 1] + 1;
    const done = shown === rows.length;
    const longest = Math.max(...sizes);

    const choose = (key: Dataset) => {
        setDataset(key);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='একটা একটা Row করে Island বানানো'
            footer='তিনটা তালিকাই আসল Data থেকে। প্রথমটায় Booking এর দিন, দ্বিতীয়টায় যেসব Booking এর Payment আছে তাদের booking_id, তৃতীয়টায় সময়ের ক্রমে প্রতিটা Booking এর status। প্রতিটার শেষ ফলাফল PostgreSQL এর সাথে মিলিয়ে দেখা: সতেরোটা দিনের Island, চারটা id এর Island, আর এগারোটা status এর ধারা।'>
            <div className='space-y-4'>
                <div className='flex flex-wrap gap-2' role='group' aria-label='তালিকা'>
                    {DATASETS.map(d => (
                        <button
                            key={d.key}
                            type='button'
                            data-dataset={d.key}
                            aria-pressed={dataset === d.key}
                            onClick={() => choose(d.key)}
                            className={cn(BTN, dataset === d.key ? BTN_ON : BTN_OFF)}>
                            {d.label}
                        </button>
                    ))}
                </div>
                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {meta.sql}
                </pre>
                <div className='flex flex-wrap items-center gap-2'>
                    <button
                        type='button'
                        data-action='next'
                        disabled={done}
                        onClick={() => setStep(s => Math.min(rows.length, s + 1))}
                        className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                        পরের Row
                    </button>
                    <button
                        type='button'
                        data-action='all'
                        disabled={done}
                        onClick={() => setStep(rows.length)}
                        className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                        সবগুলো
                    </button>
                    <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                        আবার শুরু
                    </button>
                    <span className='font-mono text-[0.6875rem] text-muted-foreground' data-step={shown}>
                        {toBn(shown)} / {toBn(rows.length)}
                    </span>
                </div>
                <div className='max-h-[26rem] overflow-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead className='sticky top-0 bg-muted'>
                            <tr className='text-left'>
                                {meta.headers.map(h => (
                                    <th key={h} className='px-3 py-2 border-b border-border'>
                                        {h}
                                    </th>
                                ))}
                                <th className='px-3 py-2 border-b border-border'>Island</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.slice(0, shown).map((row, i) => {
                                const island = islandOf[i];
                                return (
                                    <motion.tr
                                        key={`${dataset}-${row.label}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.25, ease: EASE }}
                                        className={cn(
                                            'border-b border-border/60',
                                            island % 2 === 1 ? 'bg-primary/10' : 'bg-primary/[0.02]'
                                        )}>
                                        <td className='px-3 py-1.5'>{row.label}</td>
                                        {row.cells.map((cell, c) => (
                                            <td
                                                key={c}
                                                className={cn(
                                                    'px-3 py-1.5',
                                                    c === row.cells.length - 1 && 'font-bold text-primary'
                                                )}>
                                                {cell}
                                            </td>
                                        ))}
                                        <td className='px-3 py-1.5'>{island + 1}</td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {shown === 0 && (
                        <p className='px-4 py-6 text-sm text-muted-foreground'>
                            পরের Row চাপুন। প্রতিটা Row এর পাশে তার Row Number আর বিয়োগফল আসবে।
                        </p>
                    )}
                </div>
                <p className='text-sm text-foreground' data-islands={visibleIslands} data-longest={done ? longest : 0}>
                    এখন পর্যন্ত {toBn(visibleIslands)}টা Island।
                    {done && (
                        <>
                            {' '}
                            সবচেয়ে লম্বাটায় <strong className='text-primary'>{toBn(longest)} {meta.unit}</strong>।
                        </>
                    )}
                </p>
            </div>
        </Panel>
    );
}
