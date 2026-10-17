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
/* 1. একটা একটা করে Booking, Grid ভরে ওঠে                                        */
/* ------------------------------------------------------------------------- */

type Status = 'confirmed' | 'pending' | 'cancelled';

/** The 24 real bookings in the order they were made, with the Dhaka month. */
const BOOKINGS: { id: number; month: string; day: string; status: Status; amount: number }[] = [
    { id: 1, month: '2025-12', day: '2025-12-20', status: 'confirmed', amount: 25000 },
    { id: 2, month: '2025-12', day: '2025-12-28', status: 'confirmed', amount: 50000 },
    { id: 4, month: '2026-01', day: '2026-01-05', status: 'confirmed', amount: 25500 },
    { id: 5, month: '2026-01', day: '2026-01-06', status: 'cancelled', amount: 17000 },
    { id: 3, month: '2026-01', day: '2026-01-10', status: 'confirmed', amount: 12500 },
    { id: 6, month: '2026-01', day: '2026-01-25', status: 'confirmed', amount: 36000 },
    { id: 7, month: '2026-01', day: '2026-01-28', status: 'confirmed', amount: 18000 },
    { id: 12, month: '2026-01', day: '2026-01-30', status: 'cancelled', amount: 25000 },
    { id: 8, month: '2026-02', day: '2026-02-20', status: 'confirmed', amount: 19000 },
    { id: 9, month: '2026-03', day: '2026-03-01', status: 'confirmed', amount: 28000 },
    { id: 10, month: '2026-03', day: '2026-03-02', status: 'confirmed', amount: 14000 },
    { id: 11, month: '2026-03', day: '2026-03-25', status: 'confirmed', amount: 15600 },
    { id: 13, month: '2026-09', day: '2026-09-15', status: 'confirmed', amount: 25000 },
    { id: 15, month: '2026-09', day: '2026-09-20', status: 'confirmed', amount: 25500 },
    { id: 18, month: '2026-09', day: '2026-09-28', status: 'cancelled', amount: 9500 },
    { id: 14, month: '2026-10', day: '2026-10-01', status: 'pending', amount: 50000 },
    { id: 16, month: '2026-10', day: '2026-10-02', status: 'confirmed', amount: 36000 },
    { id: 19, month: '2026-10', day: '2026-10-04', status: 'confirmed', amount: 28000 },
    { id: 17, month: '2026-10', day: '2026-10-08', status: 'pending', amount: 36000 },
    { id: 20, month: '2026-10', day: '2026-10-10', status: 'pending', amount: 15600 },
    { id: 21, month: '2026-10', day: '2026-10-11', status: 'confirmed', amount: 10500 },
    { id: 22, month: '2026-10', day: '2026-10-12', status: 'confirmed', amount: 12500 },
    { id: 23, month: '2026-10', day: '2026-10-13', status: 'confirmed', amount: 42500 },
    { id: 24, month: '2026-10', day: '2026-10-14', status: 'pending', amount: 15600 },
];

const STATUSES: Status[] = ['confirmed', 'pending', 'cancelled'];

/** Every month from the first booking to the last, empty ones included. */
const CALENDAR = [
    '2025-12',
    '2026-01',
    '2026-02',
    '2026-03',
    '2026-04',
    '2026-05',
    '2026-06',
    '2026-07',
    '2026-08',
    '2026-09',
    '2026-10',
];

type Metric = 'count' | 'amount';

const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');

function querySql(metric: Metric, calendar: boolean) {
    const agg = (s: Status) =>
        metric === 'count'
            ? `count(*) FILTER (WHERE status = '${s}') AS ${s}`
            : `coalesce(sum(total_bdt) FILTER (WHERE status = '${s}'), 0.00) AS ${s}`;
    if (!calendar) {
        return `SELECT to_char(booked_at, 'YYYY-MM') AS month,
       ${agg('confirmed')},
       ${agg('pending')},
       ${agg('cancelled')}
FROM bookings
GROUP BY 1
ORDER BY 1;`;
    }
    const lagg = (s: Status) =>
        metric === 'count'
            ? `count(b.booking_id) FILTER (WHERE b.status = '${s}') AS ${s}`
            : `coalesce(sum(b.total_bdt) FILTER (WHERE b.status = '${s}'), 0.00) AS ${s}`;
    return `SELECT to_char(m, 'YYYY-MM') AS month,
       ${lagg('confirmed')},
       ${lagg('pending')},
       ${lagg('cancelled')}
FROM generate_series(DATE '2025-12-01', DATE '2026-10-01', INTERVAL '1 month') AS m
LEFT JOIN bookings b ON date_trunc('month', b.booked_at) = m
GROUP BY m
ORDER BY m;`;
}

/**
 * The pivot built one booking at a time. Each long row from the bookings table
 * lands in the cell of its month and status, rows appear only when their month
 * first has a booking (the way GROUP BY works), and the calendar switch shows
 * the generate_series version where empty months stay as zero rows. The final
 * grid in both metrics equals the real PostgreSQL output.
 */
export function PivotStepLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const [metric, setMetric] = useState<Metric>('count');
    const [calendar, setCalendar] = useState(false);

    const done = BOOKINGS.slice(0, step);
    const current = step > 0 ? BOOKINGS[step - 1] : null;
    const seenMonths = Array.from(new Set(done.map(b => b.month)));
    const months = calendar ? CALENDAR : seenMonths;

    const cell = (month: string, status: Status) => {
        const rows = done.filter(b => b.month === month && b.status === status);
        return metric === 'count' ? rows.length : rows.reduce((sum, b) => sum + b.amount, 0);
    };
    const filled = months.reduce(
        (n, month) => n + STATUSES.filter(s => cell(month, s) > 0).length,
        0
    );

    return (
        <Panel
            label='Interactive'
            title='একটা একটা Booking, Grid ভরে ওঠে'
            footer={
                <>
                    ২৪টা Booking শেষ হলে Grid টা হুবহু উপরের Query র আসল ফলাফল। খালি মাস বন্ধ থাকলে শুধু ৬টা মাস আসে, কারণ GROUP
                    BY শুধু সেই দলগুলো বানায় যাদের অন্তত একটা Row আছে। খালি মাস চালু করলে generate_series এর ১১টা মাস আগে থেকেই
                    থাকে, আর এপ্রিল থেকে আগস্টের পাঁচটা Row শেষ পর্যন্ত শূন্যই থাকে।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                <button
                    type='button'
                    data-metric='count'
                    onClick={() => setMetric('count')}
                    className={cn(BTN, metric === 'count' ? BTN_ON : BTN_OFF)}>
                    count(*)
                </button>
                <button
                    type='button'
                    data-metric='amount'
                    onClick={() => setMetric('amount')}
                    className={cn(BTN, metric === 'amount' ? BTN_ON : BTN_OFF)}>
                    sum(total_bdt)
                </button>
                <span className='w-px bg-border mx-1' />
                <button
                    type='button'
                    data-calendar='off'
                    onClick={() => setCalendar(false)}
                    className={cn(BTN, !calendar ? BTN_ON : BTN_OFF)}>
                    শুধু Booking থাকা মাস
                </button>
                <button
                    type='button'
                    data-calendar='on'
                    onClick={() => setCalendar(true)}
                    className={cn(BTN, calendar ? BTN_ON : BTN_OFF)}>
                    খালি মাসসহ
                </button>
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90'>
                {querySql(metric, calendar)}
            </pre>

            <div className='flex flex-wrap items-center gap-2 mb-4'>
                <button
                    type='button'
                    data-action='next'
                    disabled={step >= BOOKINGS.length}
                    onClick={() => setStep(s => Math.min(BOOKINGS.length, s + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের Booking
                </button>
                <button
                    type='button'
                    data-action='all'
                    onClick={() => setStep(BOOKINGS.length)}
                    className={cn(BTN, BTN_OFF)}>
                    সব একসাথে
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
                <span
                    className='font-mono text-[0.6875rem] text-muted-foreground'
                    data-step={step}
                    data-cells-filled={filled}
                    data-rows={months.length}>
                    {toBn(step)} / {toBn(BOOKINGS.length)} Booking, {toBn(months.length)}টা Row
                </span>
            </div>

            <div className='mb-4 min-h-[2.75rem] border border-border bg-muted/20 px-4 py-2 text-sm leading-relaxed'>
                {current ? (
                    <motion.p
                        key={current.id}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}>
                        Booking <span className='font-mono'>#{current.id}</span>, {current.day}, অবস্থা{' '}
                        <span className='font-mono text-primary'>{current.status}</span>
                        {metric === 'amount' && (
                            <>
                                , টাকা <span className='font-mono'>{money(current.amount)}</span>
                            </>
                        )}
                        । এটা যায় <span className='font-mono'>{current.month}</span> এর Row এ,{' '}
                        <span className='font-mono'>{current.status}</span> Column এ।
                    </motion.p>
                ) : (
                    <p className='text-muted-foreground'>পরের Booking চাপুন। প্রথম Booking এর আগে কোনো দলই নেই।</p>
                )}
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full min-w-[26rem] border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            <th className='border border-border px-3 py-2 text-left'>month</th>
                            {STATUSES.map(s => (
                                <th key={s} className='border border-border px-3 py-2 text-right text-primary'>
                                    {s}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {months.map(month => (
                            <tr key={month}>
                                <td className='border border-border px-3 py-1.5'>{month}</td>
                                {STATUSES.map(s => {
                                    const value = cell(month, s);
                                    const hot = current && current.month === month && current.status === s;
                                    return (
                                        <td
                                            key={s}
                                            data-cell={`${month}:${s}`}
                                            className={cn(
                                                'border border-border px-3 py-1.5 text-right transition-colors duration-300',
                                                hot && 'bg-primary/15 text-primary font-bold',
                                                !hot && value === 0 && 'text-muted-foreground/50'
                                            )}>
                                            {metric === 'count' ? value : money(value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {months.length === 0 && (
                            <tr>
                                <td colSpan={4} className='border border-border px-3 py-3 text-center text-muted-foreground'>
                                    (0 rows)
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একই Grid, সাত রকম হাতিয়ার                                                  */
/* ------------------------------------------------------------------------- */

interface Tool {
    key: string;
    name: string;
    where: string;
    code: string;
    /** Real output for January and October 2026, header first. */
    output: string[][];
    columns: string;
    empty: string;
    verdict: string;
    warn?: boolean;
}

const TOOLS: Tool[] = [
    {
        key: 'filter',
        name: 'count(*) FILTER',
        where: 'PostgreSQL, এই পাতার বক্সেও',
        code: `count(*) FILTER (WHERE status = 'confirmed') AS confirmed`,
        output: [
            ['month', 'confirmed', 'pending', 'cancelled'],
            ['2026-01', '4', '0', '2'],
            ['2026-10', '5', '4', '0'],
        ],
        columns: 'Query লেখার সময় ঠিক করা',
        empty: 'count দেয় 0, sum দেয় NULL',
        verdict: 'PostgreSQL এ প্রথম পছন্দ। পড়তে সহজ, এক পাসে সব Column।',
    },
    {
        key: 'case',
        name: 'sum(CASE …)',
        where: 'PostgreSQL, MySQL, প্রায় সব Database',
        code: `sum(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed`,
        output: [
            ['month', 'confirmed', 'pending', 'cancelled'],
            ['2026-01', '4', '0', '2'],
            ['2026-10', '5', '4', '0'],
        ],
        columns: 'Query লেখার সময় ঠিক করা',
        empty: 'ELSE 0 থাকলে 0',
        verdict: 'সবচেয়ে বহনযোগ্য। অন্য Database এ গেলেও হুবহু চলে।',
    },
    {
        key: 'mysql-bool',
        name: 'SUM(status = …)',
        where: 'শুধু MySQL',
        code: `SUM(status = 'confirmed') AS confirmed`,
        output: [
            ['month', 'confirmed', 'pending', 'cancelled'],
            ['2026-01', '4', '0', '2'],
            ['2026-10', '5', '4', '0'],
        ],
        columns: 'Query লেখার সময় ঠিক করা',
        empty: '0',
        verdict: 'MySQL এ তুলনা 1 বা 0 দেয়, তাই চলে। PostgreSQL এ ERROR: function sum(boolean) does not exist।',
    },
    {
        key: 'crosstab-1',
        name: 'crosstab(source)',
        where: 'PostgreSQL, tablefunc Extension লাগে',
        code: `crosstab($$… ORDER BY 1, 2$$) AS ct(month text, c1 int, c2 int, c3 int)`,
        output: [
            ['month', 'c1', 'c2', 'c3'],
            ['2026-01', '2', '4', ''],
            ['2026-10', '5', '4', ''],
        ],
        columns: 'AS ct(…) তালিকায় ঠিক করা',
        empty: 'NULL, আর মান বাঁ দিকে সরে যায়',
        verdict: 'ফাঁদ: জানুয়ারির c1 আসলে cancelled, অক্টোবরের c1 confirmed। দল ভেদে Column এর মানে বদলায়।',
        warn: true,
    },
    {
        key: 'crosstab-2',
        name: 'crosstab(source, categories)',
        where: 'PostgreSQL, tablefunc Extension লাগে',
        code: `crosstab($$…$$, $$VALUES ('confirmed'), ('pending'), ('cancelled')$$) AS ct(…)`,
        output: [
            ['month', 'confirmed', 'pending', 'cancelled'],
            ['2026-01', '4', '', '2'],
            ['2026-10', '5', '4', ''],
        ],
        columns: 'Category Query আর AS ct(…) দুটোতেই',
        empty: 'NULL, বাইরে coalesce দিয়ে 0',
        verdict: 'crosstab ব্যবহার করলে এটাই। নাম ধরে বসায়, তবু Column এর তালিকা হাতে লিখতে হয়।',
    },
    {
        key: 'crosstabview',
        name: '\\crosstabview',
        where: 'শুধু psql এর পর্দায়',
        code: `SELECT month, status, count(*) … \\crosstabview month status`,
        output: [
            ['month', 'confirmed', 'cancelled', 'pending'],
            ['2026-01', '4', '2', ''],
            ['2026-10', '5', '', '4'],
        ],
        columns: 'Data দেখে নিজে বানায়',
        empty: 'ফাঁকা ঘর',
        verdict: 'চোখ বুলানোর জন্য দারুণ, কিন্তু এটা psql এর দেখানোর কৌশল। App বা অন্য Tool এই ফলাফল পায় না।',
    },
    {
        key: 'json',
        name: 'jsonb_object_agg',
        where: 'PostgreSQL, এই পাতার বক্সেও',
        code: `jsonb_object_agg(status, n) AS counts`,
        output: [
            ['month', 'counts'],
            ['2026-01', '{"cancelled": 2, "confirmed": 4}'],
            ['2026-10', '{"pending": 4, "confirmed": 5}'],
        ],
        columns: 'একটাই Column, ভেতরে যত খুশি চাবি',
        empty: 'চাবিটাই থাকে না',
        verdict: 'নতুন অবস্থা এলে Query বদলাতে হয় না। App বা Chart কোডে JSON টা খুলে Column বানায়।',
    },
];

/**
 * The same month by status grid built seven ways, each with where it runs,
 * how its columns are decided, what an empty cell becomes, and the real output
 * for January and October 2026 from PostgreSQL 18, psql 18 or MySQL 8.4.
 */
export function PivotToolLab() {
    const reduce = useReducedMotion();
    const [key, setKey] = useState('filter');
    const tool = TOOLS.find(t => t.key === key)!;

    return (
        <Panel
            label='Interactive'
            title='একই Grid, সাত রকম হাতিয়ার'
            footer={
                <>
                    সব ফলাফল আসল: FILTER, CASE আর JSON এর সারি এই পাতার PostgreSQL থেকে, crosstab আর \crosstabview এর সারি একটা
                    PostgreSQL 18 Server এর psql থেকে, আর SUM(status = …) এর সারি MySQL 8.4 থেকে। শুধু জানুয়ারি আর অক্টোবর দেখানো
                    হয়েছে, কারণ এই দুই মাসেই একাধিক অবস্থা আছে।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-5'>
                {TOOLS.map(t => (
                    <button
                        key={t.key}
                        type='button'
                        data-tool={t.key}
                        onClick={() => setKey(t.key)}
                        className={cn(BTN, 'font-mono', t.key === key ? BTN_ON : BTN_OFF)}>
                        {t.name}
                    </button>
                ))}
            </div>

            <motion.div
                key={tool.key}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                data-active-tool={tool.key}>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border mb-4 text-sm'>
                    {[
                        ['কোথায় চলে', tool.where],
                        ['Column কে ঠিক করে', tool.columns],
                        ['খালি ঘরে কী আসে', tool.empty],
                    ].map(([k, v]) => (
                        <div key={k} className='bg-card px-4 py-3'>
                            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1'>
                                {k}
                            </p>
                            <p className='leading-relaxed'>{v}</p>
                        </div>
                    ))}
                </div>
                <pre className='mb-4 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] text-foreground/90'>
                    {tool.code}
                </pre>
                <div className='overflow-x-auto mb-4'>
                    <table className='w-full min-w-[22rem] border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40'>
                                {tool.output[0].map(h => (
                                    <th key={h} className='border border-border px-3 py-2 text-left'>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tool.output.slice(1).map(row => (
                                <tr key={row[0]}>
                                    {row.map((v, i) => (
                                        <td
                                            key={i}
                                            className={cn(
                                                'border border-border px-3 py-1.5',
                                                tool.warn && i === 1 && row[0] === '2026-01' && 'bg-destructive/10 text-destructive font-bold'
                                            )}>
                                            {v}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p
                    className={cn(
                        'border px-4 py-3 text-sm leading-relaxed',
                        tool.warn ? 'border-destructive/40 bg-destructive/5' : 'border-primary/40 bg-primary/5'
                    )}>
                    {tool.verdict}
                </p>
            </motion.div>
        </Panel>
    );
}
