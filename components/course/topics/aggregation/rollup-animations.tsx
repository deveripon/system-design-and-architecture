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
/* 1. একই Data, পাঁচ রকম GROUP BY                                              */
/* ------------------------------------------------------------------------- */

type Key = 'method' | 'status';

/** The six (method, status) groups of the 19 real payments, amounts in paisa so sums stay exact. */
const DETAIL: { method: string; status: string; count: number; paisa: number }[] = [
    { method: 'bank', status: 'paid', count: 2, paisa: 5400000 },
    { method: 'bkash', status: 'failed', count: 1, paisa: 5000000 },
    { method: 'bkash', status: 'paid', count: 5, paisa: 10700000 },
    { method: 'bkash', status: 'refunded', count: 1, paisa: 1700000 },
    { method: 'card', status: 'paid', count: 7, paisa: 21160000 },
    { method: 'nagad', status: 'paid', count: 3, paisa: 5100000 },
];

interface Mode {
    id: string;
    label: string;
    sets: Key[][];
    /** ORDER BY terms: g = GROUPING(col) first, v = the value, NULLs last. */
    order: { kind: 'g' | 'v'; col: Key }[];
    sql: string;
    note: string;
}

const MODES: Mode[] = [
    {
        id: 'group',
        label: 'GROUP BY',
        sets: [['method', 'status']],
        order: [
            { kind: 'v', col: 'method' },
            { kind: 'v', col: 'status' },
        ],
        sql: 'GROUP BY method, status\nORDER BY method, status;',
        note: 'শুধু সাধারণ লাইন। প্রতিটা method আর status এর জোড়া একবার, কোনো মোট নেই।',
    },
    {
        id: 'rollup',
        label: 'ROLLUP (method, status)',
        sets: [['method', 'status'], ['method'], []],
        order: [
            { kind: 'g', col: 'method' },
            { kind: 'v', col: 'method' },
            { kind: 'g', col: 'status' },
            { kind: 'v', col: 'status' },
        ],
        sql: 'GROUP BY ROLLUP (method, status)\nORDER BY GROUPING(method), method,\n         GROUPING(status), status;',
        note: 'সাধারণ লাইনের সাথে প্রতিটা method এর Subtotal, আর শেষে একটা Grand Total।',
    },
    {
        id: 'rollup-flip',
        label: 'ROLLUP (status, method)',
        sets: [['status', 'method'], ['status'], []],
        order: [
            { kind: 'g', col: 'status' },
            { kind: 'v', col: 'status' },
            { kind: 'g', col: 'method' },
            { kind: 'v', col: 'method' },
        ],
        sql: 'GROUP BY ROLLUP (status, method)\nORDER BY GROUPING(status), status,\n         GROUPING(method), method;',
        note: 'Column এর ক্রম উল্টালে Subtotal ও উল্টে যায়: এবার প্রতিটা status এর মোট, method এর না।',
    },
    {
        id: 'cube',
        label: 'CUBE (method, status)',
        sets: [['method', 'status'], ['method'], ['status'], []],
        order: [
            { kind: 'g', col: 'method' },
            { kind: 'v', col: 'method' },
            { kind: 'g', col: 'status' },
            { kind: 'v', col: 'status' },
        ],
        sql: 'GROUP BY CUBE (method, status)\nORDER BY GROUPING(method), method,\n         GROUPING(status), status;',
        note: 'দুই দিকের মোটই: প্রতিটা method এর, প্রতিটা status এর, আর সবশেষে Grand Total।',
    },
    {
        id: 'sets',
        label: 'GROUPING SETS ((method), (status))',
        sets: [['method'], ['status']],
        order: [
            { kind: 'g', col: 'method' },
            { kind: 'v', col: 'method' },
            { kind: 'g', col: 'status' },
            { kind: 'v', col: 'status' },
        ],
        sql: 'GROUP BY GROUPING SETS ((method), (status))\nORDER BY GROUPING(method), method,\n         GROUPING(status), status;',
        note: 'শুধু যে দুটো দল চেয়েছেন: method অনুযায়ী আর status অনুযায়ী। সাধারণ লাইনও নেই, Grand Total ও নেই।',
    },
];

interface OutRow {
    method: string | null;
    status: string | null;
    count: number;
    paisa: number;
    g: Record<Key, 0 | 1>;
}

/** Runs the grouping sets over the six detail groups, the way PostgreSQL would. */
function compute(mode: Mode): OutRow[] {
    const rows: OutRow[] = [];
    for (const set of mode.sets) {
        const groups = new Map<string, OutRow>();
        for (const d of DETAIL) {
            const method = set.includes('method') ? d.method : null;
            const status = set.includes('status') ? d.status : null;
            const key = `${method}|${status}`;
            const row = groups.get(key) ?? {
                method,
                status,
                count: 0,
                paisa: 0,
                g: { method: set.includes('method') ? 0 : 1, status: set.includes('status') ? 0 : 1 },
            };
            row.count += d.count;
            row.paisa += d.paisa;
            groups.set(key, row);
        }
        rows.push(...groups.values());
    }
    return rows.sort((a, b) => {
        for (const term of mode.order) {
            if (term.kind === 'g') {
                const diff = a.g[term.col] - b.g[term.col];
                if (diff !== 0) return diff;
            } else {
                const x = a[term.col];
                const y = b[term.col];
                if (x === y) continue;
                if (x === null) return 1;
                if (y === null) return -1;
                return x < y ? -1 : 1;
            }
        }
        return 0;
    });
}

function money(paisa: number) {
    return `${Math.floor(paisa / 100)}.${String(paisa % 100).padStart(2, '0')}`;
}

function rowKind(row: OutRow): { label: string; tone: 'detail' | 'sub' | 'total' } {
    if (row.g.method === 1 && row.g.status === 1) return { label: 'Grand Total', tone: 'total' };
    if (row.g.method === 1) return { label: 'status এর মোট', tone: 'sub' };
    if (row.g.status === 1) return { label: 'method এর মোট', tone: 'sub' };
    return { label: 'সাধারণ', tone: 'detail' };
}

/**
 * The same 19 payments grouped five ways. Pick a GROUP BY form and the result
 * table rebuilds, every row badged as a detail line, a subtotal or the grand
 * total. The rows are worked out from the six real (method, status) groups.
 */
export function RollupBuilderLab() {
    const reduce = useReducedMotion();
    const [modeId, setModeId] = useState('rollup');
    const mode = MODES.find(m => m.id === modeId) ?? MODES[0];
    const rows = compute(mode);

    return (
        <Panel
            label='Interactive'
            title='একই Payment, পাঁচ রকম GROUP BY'
            footer='প্রতিটা ফলাফল ১৯টা আসল Payment এর ছয়টা (method, status) দল থেকে হিসাব করা, PostgreSQL এর ফলাফলের সাথে মিলিয়ে দেখা। SELECT অংশ সব রূপে একই: method, status, count(*) AS payments, sum(amount_bdt) AS amount।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {MODES.map(m => (
                    <button
                        key={m.id}
                        type='button'
                        data-mode={m.id}
                        aria-pressed={m.id === modeId}
                        onClick={() => setModeId(m.id)}
                        className={cn(BTN, 'font-mono', m.id === modeId ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>

            <pre className='mb-4 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT method, status, count(*) AS payments, sum(amount_bdt) AS amount\nFROM payments\n${mode.sql}`}
            </pre>

            <p className='mb-4 text-sm leading-relaxed text-muted-foreground'>{mode.note}</p>

            <motion.div
                key={mode.id}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='overflow-x-auto border border-border'
                data-rows={rows.length}>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40 text-left'>
                            <th className='px-3 py-2 font-bold'>method</th>
                            <th className='px-3 py-2 font-bold'>status</th>
                            <th className='px-3 py-2 font-bold text-right'>payments</th>
                            <th className='px-3 py-2 font-bold text-right'>amount</th>
                            <th className='px-3 py-2 font-bold'>কোন লাইন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            const kind = rowKind(row);
                            return (
                                <tr
                                    key={`${row.method}-${row.status}-${i}`}
                                    className={cn(
                                        'border-t border-border/60',
                                        kind.tone === 'sub' && 'bg-primary/5',
                                        kind.tone === 'total' && 'bg-primary/15 font-bold'
                                    )}>
                                    <td className={cn('px-3 py-1.5', row.method === null && 'text-muted-foreground/60 italic')}>
                                        {row.method ?? 'NULL'}
                                    </td>
                                    <td className={cn('px-3 py-1.5', row.status === null && 'text-muted-foreground/60 italic')}>
                                        {row.status ?? 'NULL'}
                                    </td>
                                    <td className='px-3 py-1.5 text-right'>{row.count}</td>
                                    <td className='px-3 py-1.5 text-right'>{money(row.paisa)}</td>
                                    <td className={cn('px-3 py-1.5', kind.tone !== 'detail' ? 'text-primary' : 'text-muted-foreground')}>
                                        {kind.label}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>

            <p className='mt-3 font-mono text-[0.6875rem] text-muted-foreground'>
                মোট {toBn(rows.length)}টা Row: {toBn(rows.filter(r => rowKind(r).tone === 'detail').length)}টা সাধারণ,{' '}
                {toBn(rows.filter(r => rowKind(r).tone === 'sub').length)}টা Subtotal,{' '}
                {toBn(rows.filter(r => rowKind(r).tone === 'total').length)}টা Grand Total।
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. GROUPING() এর Bit গুলো পড়া                                              */
/* ------------------------------------------------------------------------- */

/** The real ROLLUP (month, status) result over the 24 bookings, Dhaka time. */
const MONTH_ROWS: { month: string | null; status: string | null; bookings: string; amount: string }[] = [
    { month: '2025-12', status: 'confirmed', bookings: '2', amount: '75000.00' },
    { month: '2025-12', status: null, bookings: '2', amount: '75000.00' },
    { month: '2026-01', status: 'cancelled', bookings: '2', amount: '42000.00' },
    { month: '2026-01', status: 'confirmed', bookings: '4', amount: '92000.00' },
    { month: '2026-01', status: null, bookings: '6', amount: '134000.00' },
    { month: '2026-02', status: 'confirmed', bookings: '1', amount: '19000.00' },
    { month: '2026-02', status: null, bookings: '1', amount: '19000.00' },
    { month: '2026-03', status: 'confirmed', bookings: '3', amount: '57600.00' },
    { month: '2026-03', status: null, bookings: '3', amount: '57600.00' },
    { month: '2026-09', status: 'cancelled', bookings: '1', amount: '9500.00' },
    { month: '2026-09', status: 'confirmed', bookings: '2', amount: '50500.00' },
    { month: '2026-09', status: null, bookings: '3', amount: '60000.00' },
    { month: '2026-10', status: 'confirmed', bookings: '5', amount: '129500.00' },
    { month: '2026-10', status: 'pending', bookings: '4', amount: '117200.00' },
    { month: '2026-10', status: null, bookings: '9', amount: '246700.00' },
    { month: null, status: null, bookings: '24', amount: '592300.00' },
];

function explain(gm: number, gs: number) {
    if (gm === 1 && gs === 1) {
        return 'দুটো Column ই এই দলে নেই, তাই দুটো Bit ই 1। একসাথে 11, দশমিকে 3। এটা Grand Total: সব মাস, সব status।';
    }
    if (gs === 1) {
        return 'month এই দলে আছে, status নেই। ডানের Bit 1, বাঁয়েরটা 0। একসাথে 01, দশমিকে 1। এটা এই মাসের Subtotal।';
    }
    return 'month আর status দুটোই এই দলে আছে, তাই দুটো Bit ই 0। ফলাফল 0: একটা সাধারণ লাইন, কোনো মোট না।';
}

/**
 * Click any row of the real monthly bookings report and read its GROUPING()
 * values: one bit per column, rightmost column the lowest bit.
 */
export function GroupingBitsLab() {
    const reduce = useReducedMotion();
    const [picked, setPicked] = useState(1);
    const row = MONTH_ROWS[picked];
    const gm = row.month === null ? 1 : 0;
    const gs = row.status === null ? 1 : 0;
    const bits = gm * 2 + gs;

    return (
        <Panel
            label='Interactive'
            title='GROUPING() এর Bit গুলো পড়ুন'
            footer='Row গুলো আসল Query এর ফলাফল: GROUP BY ROLLUP (to_char(booked_at, ...), status), Dhaka সময়ে। ছোট রাখতে লেবেলে month লেখা, কিন্তু আসল Query তে GROUPING এর ভেতরে পুরো to_char(...) Expression লিখতে হয়, SELECT এর Alias সেখানে চলে না। এই Data তে কোনো Booking এর status NULL না, তাই এখানে ফাঁকা ঘর মানেই মোট। যে Column এ আসল NULL থাকে, সেখানে এই নিশ্চয়তা থাকে না।'>
            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6'>
                <div className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className='px-3 py-2 font-bold'>month</th>
                                <th className='px-3 py-2 font-bold'>status</th>
                                <th className='px-3 py-2 font-bold text-right'>bookings</th>
                                <th className='px-3 py-2 font-bold text-right'>amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MONTH_ROWS.map((r, i) => (
                                <tr
                                    key={i}
                                    data-row={i}
                                    onClick={() => setPicked(i)}
                                    className={cn(
                                        'cursor-pointer border-t border-border/60 transition-colors',
                                        i === picked ? 'bg-primary/15' : 'hover:bg-primary/5'
                                    )}>
                                    <td className={cn('px-3 py-1.5', r.month === null && 'text-muted-foreground/60 italic')}>
                                        <button type='button' className='text-left' onClick={() => setPicked(i)}>
                                            {r.month ?? 'NULL'}
                                        </button>
                                    </td>
                                    <td className={cn('px-3 py-1.5', r.status === null && 'text-muted-foreground/60 italic')}>
                                        {r.status ?? 'NULL'}
                                    </td>
                                    <td className='px-3 py-1.5 text-right'>{r.bookings}</td>
                                    <td className='px-3 py-1.5 text-right'>{r.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <motion.div
                    key={picked}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className='space-y-4'
                    data-bits={bits}>
                    <div className='grid grid-cols-3 gap-px bg-border border border-border font-mono text-center'>
                        <div className='bg-card p-3'>
                            <div className='text-[0.625rem] text-muted-foreground mb-1'>GROUPING(month)</div>
                            <div className={cn('text-xl font-bold', gm ? 'text-primary' : 'text-foreground')}>{gm}</div>
                        </div>
                        <div className='bg-card p-3'>
                            <div className='text-[0.625rem] text-muted-foreground mb-1'>GROUPING(status)</div>
                            <div className={cn('text-xl font-bold', gs ? 'text-primary' : 'text-foreground')}>{gs}</div>
                        </div>
                        <div className='bg-card p-3'>
                            <div className='text-[0.625rem] text-muted-foreground mb-1'>GROUPING(month, status)</div>
                            <div className='text-xl font-bold text-primary'>{bits}</div>
                        </div>
                    </div>
                    <div className='font-mono text-[0.75rem] text-muted-foreground'>
                        Bit: <span className='text-foreground'>{gm}</span>
                        <span className='text-foreground'>{gs}</span> (বাঁয়ে month, ডানে status) = দশমিকে {bits}
                    </div>
                    <p className='text-sm leading-relaxed text-foreground'>{explain(gm, gs)}</p>
                </motion.div>
            </div>
        </Panel>
    );
}
