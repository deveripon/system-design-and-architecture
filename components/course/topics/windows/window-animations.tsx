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
/* 1. Window টা চোখে দেখা                                                        */
/* ------------------------------------------------------------------------- */

interface Booking {
    id: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    seats: number;
    /** total_bdt in whole taka; every sample value ends in .00. */
    total: number;
}

// The 24 bookings of the Island Tours sample database.
const BOOKINGS: Booking[] = [
    { id: 1, status: 'confirmed', seats: 2, total: 25000 },
    { id: 2, status: 'confirmed', seats: 4, total: 50000 },
    { id: 3, status: 'confirmed', seats: 1, total: 12500 },
    { id: 4, status: 'confirmed', seats: 3, total: 25500 },
    { id: 5, status: 'cancelled', seats: 2, total: 17000 },
    { id: 6, status: 'confirmed', seats: 2, total: 36000 },
    { id: 7, status: 'confirmed', seats: 1, total: 18000 },
    { id: 8, status: 'confirmed', seats: 2, total: 19000 },
    { id: 9, status: 'confirmed', seats: 2, total: 28000 },
    { id: 10, status: 'confirmed', seats: 1, total: 14000 },
    { id: 11, status: 'confirmed', seats: 2, total: 15600 },
    { id: 12, status: 'cancelled', seats: 2, total: 25000 },
    { id: 13, status: 'confirmed', seats: 2, total: 25000 },
    { id: 14, status: 'pending', seats: 4, total: 50000 },
    { id: 15, status: 'confirmed', seats: 3, total: 25500 },
    { id: 16, status: 'confirmed', seats: 2, total: 36000 },
    { id: 17, status: 'pending', seats: 2, total: 36000 },
    { id: 18, status: 'cancelled', seats: 1, total: 9500 },
    { id: 19, status: 'confirmed', seats: 2, total: 28000 },
    { id: 20, status: 'pending', seats: 2, total: 15600 },
    { id: 21, status: 'confirmed', seats: 3, total: 10500 },
    { id: 22, status: 'confirmed', seats: 1, total: 12500 },
    { id: 23, status: 'confirmed', seats: 5, total: 42500 },
    { id: 24, status: 'pending', seats: 2, total: 15600 },
];

type Fn = 'count' | 'sum' | 'avg' | 'min' | 'max';
type Col = 'seats' | 'total_bdt';
type Filter = 'all' | 'confirmed';

const FNS: Fn[] = ['count', 'sum', 'avg', 'min', 'max'];

/** Formats a value the way PostgreSQL prints it for this column and function. */
function windowValue(rows: Booking[], fn: Fn, col: Col): string {
    if (fn === 'count') return String(rows.length);
    const values = rows.map(r => (col === 'seats' ? r.seats : r.total));
    let result: number;
    if (fn === 'sum') result = values.reduce((a, b) => a + b, 0);
    else if (fn === 'min') result = Math.min(...values);
    else if (fn === 'max') result = Math.max(...values);
    else result = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
    // avg is shown through round(..., 2); money keeps its two decimals.
    if (fn === 'avg' || col === 'total_bdt') return result.toFixed(2);
    return String(result);
}

function callText(fn: Fn, col: Col) {
    const inner = fn === 'count' ? 'count(*)' : `${fn}(${col})`;
    return fn === 'avg' ? `round(avg(${col}) OVER (), 2)` : `${inner} OVER ()`;
}

/**
 * Step through the bookings one row at a time and see which rows the window
 * covers for the current row. With OVER () the answer is always the same:
 * every row that survived WHERE, so every row gets the same value.
 */
export function WindowLab() {
    const reduce = useReducedMotion();
    const [fn, setFn] = useState<Fn>('avg');
    const [col, setCol] = useState<Col>('total_bdt');
    const [filter, setFilter] = useState<Filter>('all');
    const [current, setCurrent] = useState(0);

    const rows = filter === 'all' ? BOOKINGS : BOOKINGS.filter(b => b.status === 'confirmed');
    const at = Math.min(current, rows.length - 1);
    const value = windowValue(rows, fn, col);
    const sql = [
        `SELECT booking_id, ${col},`,
        `       ${callText(fn, col)} AS w`,
        'FROM bookings',
        ...(filter === 'confirmed' ? ["WHERE status = 'confirmed'"] : []),
        'ORDER BY booking_id;',
    ].join('\n');

    return (
        <Panel
            label='Interactive'
            title='Window টা চোখে দেখা'
            footer={
                <>
                    সব মান Island Tours এর আসল ২৪টা Booking থেকে, PostgreSQL 18 এর ফলাফলের সাথে মিলিয়ে নেওয়া। OVER () এর
                    খালি বন্ধনী মানে Window সবসময় পুরো ফলাফল, তাই যে Row ই বর্তমান হোক, আলো জ্বলে সব Row এ, আর উত্তর একই।
                    WHERE বদলালে Window এর আকার বদলায়, কারণ WHERE আগে চলে।
                </>
            }>
            <div className='space-y-5'>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1'>
                        Function
                    </span>
                    {FNS.map(f => (
                        <button
                            key={f}
                            type='button'
                            data-fn={f}
                            onClick={() => setFn(f)}
                            className={cn(BTN, fn === f ? BTN_ON : BTN_OFF)}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1'>
                        Column
                    </span>
                    {(['seats', 'total_bdt'] as Col[]).map(c => (
                        <button
                            key={c}
                            type='button'
                            data-col={c}
                            onClick={() => setCol(c)}
                            className={cn(BTN, col === c ? BTN_ON : BTN_OFF)}>
                            {c}
                        </button>
                    ))}
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground ml-3 mr-1'>
                        WHERE
                    </span>
                    {(['all', 'confirmed'] as Filter[]).map(f => (
                        <button
                            key={f}
                            type='button'
                            data-filter={f}
                            onClick={() => {
                                setFilter(f);
                                setCurrent(0);
                            }}
                            className={cn(BTN, filter === f ? BTN_ON : BTN_OFF)}>
                            {f === 'all' ? 'নেই, ২৪টা Row' : "status = 'confirmed'"}
                        </button>
                    ))}
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {sql}
                </pre>

                <div className='flex flex-wrap items-center gap-3'>
                    <button
                        type='button'
                        data-action='prev'
                        onClick={() => setCurrent(c => Math.max(0, Math.min(c, rows.length - 1) - 1))}
                        className={cn(BTN, BTN_OFF)}>
                        আগের Row
                    </button>
                    <button
                        type='button'
                        data-action='next'
                        onClick={() => setCurrent(c => Math.min(rows.length - 1, Math.min(c, rows.length - 1) + 1))}
                        className={cn(BTN, BTN_OFF)}>
                        পরের Row
                    </button>
                    <span className='text-sm text-muted-foreground' data-current={rows[at].id} data-window-size={rows.length} data-value={value}>
                        বর্তমান Row: Booking {toBn(rows[at].id)}। তার Window এ আছে {toBn(rows.length)}টা Row, উত্তর{' '}
                        <span className='font-mono text-foreground'>{value}</span>
                    </span>
                </div>

                <div className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40'>
                                <th className='px-3 py-2 text-left'>booking_id</th>
                                <th className='px-3 py-2 text-left'>status</th>
                                <th className='px-3 py-2 text-left'>{col}</th>
                                <th className='px-3 py-2 text-left text-primary'>w</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <motion.tr
                                    key={`${filter}-${row.id}`}
                                    initial={reduce ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25, ease: EASE, delay: reduce ? 0 : i * 0.01 }}
                                    className={cn(
                                        'border-t border-border/60',
                                        i === at ? 'bg-primary/20' : 'bg-primary/5'
                                    )}>
                                    <td className='px-3 py-1.5'>
                                        {i === at ? '▶ ' : ''}
                                        {row.id}
                                    </td>
                                    <td className='px-3 py-1.5 text-muted-foreground'>{row.status}</td>
                                    <td className='px-3 py-1.5'>{col === 'seats' ? row.seats : `${row.total}.00`}</td>
                                    <td className={cn('px-3 py-1.5', i === at ? 'text-primary font-bold' : 'text-foreground/80')}>
                                        {value}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Window Function কোথায় বসতে পারে                                            */
/* ------------------------------------------------------------------------- */

interface PlacementCase {
    id: string;
    where: string;
    sql: string;
    runs: boolean;
    postgres: string;
    mysql: string;
    why: string;
}

// Every outcome below was run on PostgreSQL 18 (in-browser PGlite) and MySQL
// 8.4.11 with the Island Tours sample database loaded.
const CASES: PlacementCase[] = [
    {
        id: 'select',
        where: 'SELECT এর তালিকায়',
        sql: 'SELECT booking_id, avg(total_bdt) OVER ()\nFROM bookings;',
        runs: true,
        postgres: '24 rows, প্রতিটার পাশে 24679.166666666667',
        mysql: '24 rows, প্রতিটার পাশে 24679.166667',
        why: 'Window Function এর আসল জায়গা। SELECT তালিকা তৈরি হয় Window এর হিসাবের পরে।',
    },
    {
        id: 'order-by',
        where: 'ORDER BY তে',
        sql: 'SELECT booking_id, total_bdt FROM bookings\nORDER BY total_bdt - avg(total_bdt) OVER () DESC,\n         booking_id\nLIMIT 3;',
        runs: true,
        postgres: '3 rows: 2, 14, 23',
        mysql: '3 rows: 2, 14, 23',
        why: 'ORDER BY চলে Window এর পরে, তাই মানটা দেখতে পায়।',
    },
    {
        id: 'where',
        where: 'WHERE এ',
        sql: 'SELECT booking_id FROM bookings\nWHERE total_bdt > avg(total_bdt) OVER ();',
        runs: false,
        postgres: 'ERROR: window functions are not allowed in WHERE',
        mysql: "ERROR 3593 (HY000): You cannot use the window function 'avg' in this context.'",
        why: 'WHERE চলে Window এর অনেক আগে। তখনো গড় হিসাবই হয়নি।',
    },
    {
        id: 'group-by',
        where: 'GROUP BY তে',
        sql: 'SELECT count(*) FROM bookings\nGROUP BY avg(total_bdt) OVER ();',
        runs: false,
        postgres: 'ERROR: window functions are not allowed in GROUP BY',
        mysql: 'ERROR 3593 (HY000), একই বার্তা',
        why: 'দল বাঁধাও Window এর আগে। যে মান এখনো নেই, তা দিয়ে দল বাঁধা যায় না।',
    },
    {
        id: 'having',
        where: 'HAVING এ',
        sql: 'SELECT status, count(*) FROM bookings\nGROUP BY status\nHAVING count(*) > avg(count(*)) OVER ();',
        runs: false,
        postgres: 'ERROR: window functions are not allowed in HAVING',
        mysql: 'ERROR 3593 (HY000), একই বার্তা',
        why: 'HAVING ও Window এর আগে চলে। দল ছাঁকা শেষ হলে তবে Window শুরু।',
    },
    {
        id: 'inside-aggregate',
        where: 'আরেকটা Aggregate এর ভেতরে',
        sql: 'SELECT sum(avg(total_bdt) OVER ())\nFROM bookings;',
        runs: false,
        postgres: 'ERROR: aggregate function calls cannot contain window function calls',
        mysql: 'ERROR 3593 (HY000), একই বার্তা',
        why: 'সাধারণ Aggregate চলে Window এর আগে, তাই তার ভেতরে Window রাখা যায় না। উল্টোটা চলে: Window এর ভেতরে Aggregate, যেমন sum(sum(x)) OVER ()।',
    },
    {
        id: 'cte',
        where: 'CTE তে হিসাব, বাইরে WHERE',
        sql: 'WITH w AS (\n  SELECT booking_id, total_bdt,\n         avg(total_bdt) OVER () AS avg_all\n  FROM bookings\n)\nSELECT booking_id FROM w\nWHERE total_bdt > avg_all;',
        runs: true,
        postgres: '13 rows',
        mysql: '13 rows',
        why: 'ভেতরের Query তে Window শেষ, বাইরের Query এর কাছে avg_all একটা সাধারণ Column। এটাই Window দিয়ে ছাঁকার নিয়ম।',
    },
];

/**
 * Seven places a window function might be written. The reader guesses whether
 * each one runs, then sees the real PostgreSQL and MySQL outcome and why.
 */
export function PlacementLab() {
    const [active, setActive] = useState(CASES[0].id);
    const [guesses, setGuesses] = useState<Record<string, boolean>>({});
    const current = CASES.find(c => c.id === active) ?? CASES[0];
    const guess = guesses[current.id];
    const answered = Object.keys(guesses).length;
    const score = CASES.filter(c => guesses[c.id] === c.runs).length;

    return (
        <Panel
            label='Interactive'
            title='Window Function কোথায় বসতে পারে'
            footer={
                <>
                    প্রতিটা ফলাফল আসল: PostgreSQL 18 আর MySQL 8.4.11 এ Island Tours এর Data দিয়ে চালানো। নিয়মটা একটাই, Window
                    এর হিসাব হয় WHERE, GROUP BY আর HAVING এর পরে, ORDER BY আর LIMIT এর আগে।
                </>
            }>
            <div className='space-y-5'>
                <div className='flex flex-wrap gap-2'>
                    {CASES.map(c => (
                        <button
                            key={c.id}
                            type='button'
                            data-case={c.id}
                            onClick={() => setActive(c.id)}
                            className={cn(BTN, active === c.id ? BTN_ON : BTN_OFF)}>
                            {c.where}
                            {guesses[c.id] !== undefined && (guesses[c.id] === c.runs ? ' ✓' : ' ✗')}
                        </button>
                    ))}
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {current.sql}
                </pre>

                <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-sm text-muted-foreground mr-1'>আপনার অনুমান:</span>
                    <button
                        type='button'
                        data-choice='runs'
                        onClick={() => setGuesses(g => ({ ...g, [current.id]: true }))}
                        className={cn(BTN, guess === true ? BTN_ON : BTN_OFF)}>
                        চলবে
                    </button>
                    <button
                        type='button'
                        data-choice='error'
                        onClick={() => setGuesses(g => ({ ...g, [current.id]: false }))}
                        className={cn(BTN, guess === false ? BTN_ON : BTN_OFF)}>
                        Error দেবে
                    </button>
                    <span className='ml-auto font-mono text-[0.6875rem] text-muted-foreground' data-score={score}>
                        {toBn(score)} / {toBn(answered)} ঠিক
                    </span>
                </div>

                {guess !== undefined && (
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        data-result={current.runs ? 'runs' : 'error'}
                        className={cn(
                            'border px-4 py-3 space-y-2 text-sm leading-relaxed',
                            guess === current.runs ? 'border-primary/50 bg-primary/5' : 'border-destructive/40 bg-destructive/5'
                        )}>
                        <p className='font-bold'>
                            {guess === current.runs ? 'ঠিক অনুমান।' : 'অনুমান মেলেনি।'}{' '}
                            {current.runs ? 'এটা চলে।' : 'এটা Error দেয়।'}
                        </p>
                        <p className='font-mono text-[0.75rem]'>
                            <span className='text-muted-foreground'>PostgreSQL:</span> {current.postgres}
                        </p>
                        <p className='font-mono text-[0.75rem]'>
                            <span className='text-muted-foreground'>MySQL:</span> {current.mysql}
                        </p>
                        <p className='text-muted-foreground'>{current.why}</p>
                    </motion.div>
                )}
            </div>
        </Panel>
    );
}
