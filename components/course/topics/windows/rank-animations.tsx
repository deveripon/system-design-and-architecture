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
/* Real rows, checked against PostgreSQL 18                                    */
/* ------------------------------------------------------------------------- */

interface Item {
    id: number;
    label: string;
    value: number;
    shown: string;
}

const REVIEWS: Item[] = [
    [1, 5], [2, 4], [3, 5], [4, 4], [5, 5], [6, 3], [7, 4], [8, 5], [9, 2], [10, 4],
].map(([id, rating]) => ({ id, label: `Review ${id}`, value: rating, shown: `${rating}★` }));

const CUSTOMERS: Item[] = [
    { id: 2, label: 'Nusrat Jahan', value: 75000 },
    { id: 8, label: 'Sumaiya Islam', value: 70500 },
    { id: 1, label: 'Rahim Uddin', value: 44000 },
    { id: 4, label: 'Farhana Akter', value: 36000 },
    { id: 6, label: 'Mitu Rahman', value: 36000 },
    { id: 14, label: 'Lamia Haque', value: 36000 },
    { id: 11, label: 'Oliver Bennett', value: 28000 },
    { id: 13, label: 'Shuvo Das', value: 25500 },
    { id: 3, label: 'Tanvir Ahmed', value: 25000 },
    { id: 7, label: 'Arif Chowdhury', value: 18000 },
    { id: 10, label: 'Aiman Zulkifli', value: 15600 },
    { id: 9, label: 'Priya Sharma', value: 14000 },
].map(c => ({ ...c, shown: `${c.value}.00` }));

const DEPARTURES: Item[] = [
    [3, 27], [7, 23], [10, 22], [14, 21], [2, 19], [9, 19], [12, 18], [5, 16],
    [1, 14], [8, 14], [4, 13], [11, 12], [15, 12], [13, 10], [16, 10], [6, 9],
].map(([id, seats]) => ({ id, label: `Departure ${id}`, value: seats, shown: `${seats}` }));

interface Numbered extends Item {
    rn: number;
    rank: number;
    dense: number;
    /** Position of the tie group, for shading; -1 when the value is unique. */
    group: number;
}

/**
 * Highest value first; within a tie, the smaller id first. That is one of the
 * orders ROW_NUMBER may pick without a tie breaker, and the one it must pick
 * with `ORDER BY value DESC, id`.
 */
function numberRows(items: Item[]): Numbered[] {
    const sorted = [...items].sort((a, b) => b.value - a.value || a.id - b.id);
    const counts = new Map<number, number>();
    for (const item of sorted) counts.set(item.value, (counts.get(item.value) ?? 0) + 1);
    const tiedValues = [...new Set(sorted.map(i => i.value))].filter(v => (counts.get(v) ?? 0) > 1);
    let rank = 0;
    let dense = 0;
    let previous: number | null = null;
    return sorted.map((item, index) => {
        if (item.value !== previous) {
            rank = index + 1;
            dense += 1;
            previous = item.value;
        }
        return { ...item, rn: index + 1, rank, dense, group: tiedValues.indexOf(item.value) };
    });
}

const DATASETS = {
    reviews: { label: 'Review এর rating', column: 'rating', rows: numberRows(REVIEWS) },
    customers: { label: 'Customer এর মোট খরচ', column: 'spent', rows: numberRows(CUSTOMERS) },
    departures: { label: 'Departure এর খালি সিট', column: 'seats_left', rows: numberRows(DEPARTURES) },
};

type DatasetKey = keyof typeof DATASETS;

/* ------------------------------------------------------------------------- */
/* 1. তিন ফাংশন পাশাপাশি, Tie Breaker সহ আর ছাড়া                                 */
/* ------------------------------------------------------------------------- */

/**
 * ROW_NUMBER, RANK and DENSE_RANK on three real columns with ties. Without a
 * tie breaker the ROW_NUMBER inside a tie group is marked as not guaranteed;
 * switching the tie breaker on makes every number fixed.
 */
export function TieNumberingLab() {
    const reduce = useReducedMotion();
    const [dataset, setDataset] = useState<DatasetKey>('customers');
    const [tieBreak, setTieBreak] = useState(false);
    const data = DATASETS[dataset];
    const tieGroups = new Set(data.rows.filter(r => r.group >= 0).map(r => r.group)).size;
    const lastRank = data.rows[data.rows.length - 1].rank;
    const lastDense = data.rows[data.rows.length - 1].dense;
    const order = `${data.column} DESC${tieBreak ? `, ${dataset === 'reviews' ? 'review_id' : dataset === 'customers' ? 'customer_id' : 'departure_id'}` : ''}`;

    return (
        <Panel
            label='Lab'
            title='ROW_NUMBER, RANK, DENSE_RANK: সমান মানে কী হয়'
            footer='তিনটা আসল Column, আসল Row। নম্বরগুলো Browser এ গোনা, আর PostgreSQL 18 এর ফলাফলের সাথে মিলিয়ে দেখা। Tie Breaker বন্ধ থাকলে সমান মানের Row গুলোর ROW_NUMBER এখানে id এর ক্রমে দেখানো হয়েছে, কিন্তু PostgreSQL অন্য ক্রমও বেছে নিতে পারে, তাই সেগুলো দাগ দেওয়া।'>
            <div
                className='flex flex-wrap gap-2 mb-3'
                data-ties={tieGroups}
                data-last-rank={lastRank}
                data-last-dense={lastDense}>
                {(Object.keys(DATASETS) as DatasetKey[]).map(key => (
                    <button
                        key={key}
                        type='button'
                        data-dataset={key}
                        onClick={() => setDataset(key)}
                        aria-pressed={dataset === key}
                        className={cn(BTN, dataset === key ? BTN_ON : BTN_OFF)}>
                        {DATASETS[key].label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-tiebreak={tieBreak ? 'on' : 'off'}
                    onClick={() => setTieBreak(v => !v)}
                    aria-pressed={tieBreak}
                    className={cn(BTN, tieBreak ? BTN_ON : BTN_OFF)}>
                    {tieBreak ? 'Tie Breaker চালু: id দিয়ে' : 'Tie Breaker বন্ধ'}
                </button>
                <code className='font-mono text-[0.75rem] text-muted-foreground'>OVER (ORDER BY {order})</code>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full min-w-[34rem] border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='border-b border-border text-left text-muted-foreground'>
                            <th className='py-2 pr-3 font-bold'>Row</th>
                            <th className='py-2 pr-3 font-bold text-right'>{data.column}</th>
                            <th className='py-2 pr-3 font-bold text-right text-primary'>ROW_NUMBER</th>
                            <th className='py-2 pr-3 font-bold text-right text-primary'>RANK</th>
                            <th className='py-2 font-bold text-right text-primary'>DENSE_RANK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, i) => {
                            const tied = row.group >= 0;
                            const unsure = tied && !tieBreak;
                            return (
                                <motion.tr
                                    key={`${dataset}-${row.id}`}
                                    initial={reduce ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.02, ease: EASE }}
                                    className={cn(
                                        'border-b border-border/50',
                                        tied && (row.group % 2 === 0 ? 'bg-primary/[0.07]' : 'bg-primary/[0.03]'),
                                    )}>
                                    <td className='py-1.5 pr-3 font-sans text-[0.8125rem]'>{row.label}</td>
                                    <td className='py-1.5 pr-3 text-right'>{row.shown}</td>
                                    <td className='py-1.5 pr-3 text-right'>
                                        <span
                                            className={cn(
                                                'inline-block min-w-[2.25rem] px-1 text-center',
                                                unsure && 'border border-dashed border-primary/60 text-primary',
                                            )}
                                            title={unsure ? 'সমান মান, এই নম্বর নিশ্চিত না' : undefined}>
                                            {row.rn}
                                            {unsure ? '?' : ''}
                                        </span>
                                    </td>
                                    <td className={cn('py-1.5 pr-3 text-right', tied && 'font-bold text-primary')}>
                                        {row.rank}
                                    </td>
                                    <td className={cn('py-1.5 text-right', tied && 'font-bold text-primary')}>
                                        {row.dense}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className='mt-5 text-sm leading-relaxed text-muted-foreground'>
                এখানে {toBn(tieGroups)}টা সমান মানের দল। শেষ Row এর RANK {toBn(lastRank)}, কারণ RANK সবসময় মোট Row
                গুনে চলে। শেষ Row এর DENSE_RANK {toBn(lastDense)}, কারণ সে শুধু আলাদা আলাদা মান গোনে।{' '}
                {tieBreak
                    ? 'Tie Breaker থাকায় প্রতিটা ROW_NUMBER এখন স্থির: যতবার চালান, একই নম্বর।'
                    : 'দাগ দেওয়া ROW_NUMBER গুলো আজ যা, কাল তা না-ও হতে পারে। Tie Breaker চালু করে দেখুন।'}
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রথম N জন: কোন ফাংশনে কতজন                                               */
/* ------------------------------------------------------------------------- */

type Fn = 'row_number' | 'rank' | 'dense_rank';

const FNS: { key: Fn; label: string; column: 'rn' | 'rank' | 'dense'; alias: string }[] = [
    { key: 'row_number', label: 'ROW_NUMBER', column: 'rn', alias: 'row_no' },
    { key: 'rank', label: 'RANK', column: 'rank', alias: 'rnk' },
    { key: 'dense_rank', label: 'DENSE_RANK', column: 'dense', alias: 'dense' },
];

/**
 * The voucher question: "the top N customers by confirmed spend". The same N
 * picks a different number of people depending on the function, because of
 * the three-way tie at 36000.
 */
export function TopNLab() {
    const [n, setN] = useState(5);
    const [fn, setFn] = useState<Fn>('row_number');
    const meta = FNS.find(f => f.key === fn)!;
    const rows = DATASETS.customers.rows;
    const picked = rows.filter(r => r[meta.column] <= n);
    const counts = FNS.map(f => ({ ...f, count: rows.filter(r => r[f.column] <= n).length }));

    return (
        <Panel
            label='Lab'
            title='প্রথম N জনকে Voucher: কতজন পাবেন'
            footer='বারোজন Customer, confirmed Booking এর মোট খরচ অনুযায়ী। N আর ফাংশন বদলে দেখুন কতজন তালিকায় আসেন। N = 5 এ তিনটা সংখ্যা PostgreSQL 18 এ চালানো একটা Query থেকে মেলানো: 5, 6, 7।'>
            <div className='flex flex-wrap items-center gap-2 mb-3'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1'>N</span>
                {[1, 2, 3, 4, 5, 6].map(v => (
                    <button
                        key={v}
                        type='button'
                        data-n={v}
                        onClick={() => setN(v)}
                        aria-pressed={n === v}
                        className={cn(BTN, 'min-w-[2.5rem] text-center', n === v ? BTN_ON : BTN_OFF)}>
                        {v}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5'>
                {FNS.map(f => (
                    <button
                        key={f.key}
                        type='button'
                        data-fn={f.key}
                        onClick={() => setFn(f.key)}
                        aria-pressed={fn === f.key}
                        className={cn(BTN, fn === f.key ? BTN_ON : BTN_OFF)}>
                        {f.label}
                    </button>
                ))}
            </div>

            <code className='block mb-4 font-mono text-[0.75rem] text-muted-foreground'>
                ... WHERE {meta.alias} {'<='} {n}
            </code>

            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-1.5' data-count={picked.length}>
                {rows.map(row => {
                    const inList = row[meta.column] <= n;
                    const tied = row.group >= 0;
                    return (
                        <li
                            key={row.id}
                            className={cn(
                                'flex items-center justify-between gap-3 border px-3 py-1.5 text-[0.8125rem] transition-colors',
                                inList ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border text-muted-foreground',
                            )}>
                            <span>
                                {row.label}
                                {tied && <span className='ml-2 font-mono text-[0.625rem] text-primary'>tie</span>}
                            </span>
                            <span className='font-mono text-[0.75rem]'>
                                {row.shown} · {row[meta.column]}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <div className='mt-5 grid grid-cols-3 gap-2 text-center'>
                {counts.map(c => (
                    <div
                        key={c.key}
                        className={cn('border px-2 py-2', c.key === fn ? 'border-primary bg-primary/10' : 'border-border')}>
                        <div className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                            {c.label}
                        </div>
                        <div className='text-lg font-bold text-foreground'>{toBn(c.count)} জন</div>
                    </div>
                ))}
            </div>
        </Panel>
    );
}
