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
/* 1. Customer ধরে ধরে মিলানো: JOIN, EXISTS আর NOT EXISTS                      */
/* ------------------------------------------------------------------------- */

/** The 15 real customers and the booking ids each one has in the sample data. */
const CUSTOMERS: { id: number; name: string; bookings: number[] }[] = [
    { id: 1, name: 'Rahim Uddin', bookings: [1, 8, 17] },
    { id: 2, name: 'Nusrat Jahan', bookings: [2, 13] },
    { id: 3, name: 'Tanvir Ahmed', bookings: [3, 22] },
    { id: 4, name: 'Farhana Akter', bookings: [4, 21] },
    { id: 5, name: 'Sabbir Hossain', bookings: [5] },
    { id: 6, name: 'Mitu Rahman', bookings: [6, 18] },
    { id: 7, name: 'Arif Chowdhury', bookings: [7] },
    { id: 8, name: 'Sumaiya Islam', bookings: [9, 23] },
    { id: 9, name: 'Priya Sharma', bookings: [10, 20] },
    { id: 10, name: 'Aiman Zulkifli', bookings: [11] },
    { id: 11, name: 'Oliver Bennett', bookings: [12, 19] },
    { id: 12, name: 'Kamal Hasan', bookings: [14] },
    { id: 13, name: 'Shuvo Das', bookings: [15, 24] },
    { id: 14, name: 'Lamia Haque', bookings: [16] },
    { id: 15, name: 'Imran Kabir', bookings: [] },
];

type Mode = 'join' | 'exists' | 'not-exists';

const MODES: { key: Mode; label: string; sql: string }[] = [
    {
        key: 'join',
        label: 'JOIN',
        sql: `SELECT c.full_name, b.booking_id
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;`,
    },
    {
        key: 'exists',
        label: 'EXISTS',
        sql: `SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id);`,
    },
    {
        key: 'not-exists',
        label: 'NOT EXISTS',
        sql: `SELECT c.full_name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings b
                  WHERE b.customer_id = c.customer_id);`,
    },
];

/** The output rows a mode produces for one customer. */
function outputFor(mode: Mode, c: (typeof CUSTOMERS)[number]): string[] {
    if (mode === 'join') return c.bookings.map(id => `${c.name} | ${id}`);
    if (mode === 'exists') return c.bookings.length > 0 ? [c.name] : [];
    return c.bookings.length === 0 ? [c.name] : [];
}

/** What the engine had to look at, said in one line. */
function verdictFor(mode: Mode, c: (typeof CUSTOMERS)[number]): string {
    const n = c.bookings.length;
    if (mode === 'join') {
        return n === 0
            ? 'কোনো মিল নেই, তাই কোনো Row হলো না'
            : `${toBn(n)}টা মিল, তাই ${toBn(n)}টা Row`;
    }
    if (n === 0) {
        return mode === 'exists'
            ? 'একটাও Booking নেই: EXISTS মিথ্যা, বাদ'
            : 'একটাও Booking নেই: NOT EXISTS সত্য, রাখা হলো';
    }
    const extra = n > 1 ? `, বাকি ${toBn(n - 1)}টা আর দেখা লাগেনি` : '';
    return mode === 'exists'
        ? `Booking ${c.bookings[0]} পেয়েই থামল${extra}: রাখা হলো`
        : `Booking ${c.bookings[0]} পেয়েই থামল${extra}: বাদ`;
}

/**
 * Step through the 15 real customers. For each one, the lab shows which of
 * their bookings the engine looks at and what lands in the output. JOIN gives
 * 24 rows, EXISTS 14, NOT EXISTS 1, the same numbers the query boxes print.
 */
export function SemiJoinStepLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<Mode>('exists');
    const [step, setStep] = useState(0);

    const done = CUSTOMERS.slice(0, step);
    const current = step > 0 ? CUSTOMERS[step - 1] : null;
    const output = done.flatMap(c => outputFor(mode, c));
    const finished = step === CUSTOMERS.length;
    const sql = MODES.find(m => m.key === mode)!.sql;

    const choose = (m: Mode) => {
        setMode(m);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='Customer ধরে ধরে মিলানো, আসল ১৫ জন'
            footer='Data আসল: customers এর ১৫ জন আর প্রত্যেকের Booking নম্বর, যেমন Sample Database এ আছে। JOIN প্রতিটা মিলের জন্য একটা Row দেয়, তাই শেষে ২৪টা। EXISTS প্রথম মিল পেয়েই থামে আর প্রত্যেক Customer কে বড়জোর একবার রাখে, তাই ১৪ জন। NOT EXISTS রাখে শুধু তাঁকে, যাঁর একটাও মিল নেই: Imran Kabir।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {MODES.map(m => (
                    <button
                        key={m.key}
                        type='button'
                        data-mode={m.key}
                        onClick={() => choose(m.key)}
                        className={cn(BTN, mode === m.key ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {sql}
            </pre>

            <div className='flex flex-wrap items-center gap-2 mb-6'>
                <button
                    type='button'
                    data-action='next'
                    disabled={finished}
                    onClick={() => setStep(s => Math.min(CUSTOMERS.length, s + 1))}
                    className={cn(BTN, finished ? 'border-border text-muted-foreground/50' : BTN_ON)}>
                    পরের Customer
                </button>
                <button
                    type='button'
                    data-action='all'
                    onClick={() => setStep(CUSTOMERS.length)}
                    className={cn(BTN, BTN_OFF)}>
                    সবাইকে একবারে
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setStep(0)}
                    className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-step={step}>
                    {toBn(step)} / {toBn(CUSTOMERS.length)} জন দেখা হয়েছে
                </span>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        customers, আর প্রত্যেকের bookings
                    </p>
                    <ul className='space-y-1'>
                        {CUSTOMERS.map((c, i) => {
                            const seen = i < step;
                            const isCurrent = i === step - 1;
                            const kept = seen && outputFor(mode, c).length > 0;
                            return (
                                <li
                                    key={c.id}
                                    className={cn(
                                        'flex items-start gap-3 border px-3 py-1.5 text-[0.75rem] transition-colors',
                                        isCurrent ? 'border-primary bg-primary/5' : 'border-border/60',
                                        !seen && 'opacity-50'
                                    )}>
                                    <span className='w-6 shrink-0 font-mono text-muted-foreground'>{c.id}</span>
                                    <span className='flex-1 min-w-0'>
                                        <span className={cn('font-medium', kept && 'text-primary')}>{c.name}</span>
                                        <span className='ml-2 font-mono text-[0.6875rem] text-muted-foreground'>
                                            {c.bookings.length === 0 ? 'কোনো Booking নেই' : c.bookings.join(', ')}
                                        </span>
                                    </span>
                                    {seen && (
                                        <span
                                            className={cn(
                                                'shrink-0 font-mono text-[0.625rem] font-bold',
                                                kept ? 'text-primary' : 'text-muted-foreground'
                                            )}>
                                            {mode === 'join'
                                                ? `${toBn(c.bookings.length)} Row`
                                                : kept
                                                  ? 'রাখা'
                                                  : 'বাদ'}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        এইমাত্র যা ঘটল
                    </p>
                    <div className='mb-5 min-h-[3.5rem] border border-border bg-background px-4 py-3 text-sm leading-relaxed'>
                        {current ? (
                            <motion.p
                                key={`${mode}-${step}`}
                                initial={reduce ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}>
                                <strong>{current.name}</strong>: {verdictFor(mode, current)}
                            </motion.p>
                        ) : (
                            <p className='text-muted-foreground'>
                                পরের Customer চাপুন। প্রতিবার একজন Customer নিয়ে bookings Table এ তাঁর Booking খোঁজা হবে।
                            </p>
                        )}
                    </div>

                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        ফলাফল:{' '}
                        <span className='text-primary font-bold' data-output-count={output.length}>
                            {toBn(output.length)}টা Row
                        </span>
                    </p>
                    <div className='max-h-72 overflow-y-auto border border-border'>
                        {output.length === 0 ? (
                            <p className='px-3 py-2 font-mono text-[0.75rem] text-muted-foreground'>(0 rows)</p>
                        ) : (
                            <ul className='divide-y divide-border/60'>
                                {output.map((row, i) => (
                                    <li key={`${row}-${i}`} className='px-3 py-1 font-mono text-[0.75rem] text-foreground/90'>
                                        {row}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. NOT IN এর NULL ফাঁদ, তিনটা লেখার তুলনা                                    */
/* ------------------------------------------------------------------------- */

/** The five real guides. Guide 5, Nazmul Karim, has no tour. */
const GUIDES: { id: number; name: string }[] = [
    { id: 1, name: 'Jamal Hossain' },
    { id: 2, name: 'Shirin Akter' },
    { id: 3, name: 'Rubel Mia' },
    { id: 4, name: 'Ayesha Siddiqua' },
    { id: 5, name: 'Nazmul Karim' },
];

/** tours.guide_id for the nine real tours; the Ratargul tour has no guide yet. */
const TOUR_GUIDE_IDS: (number | null)[] = [1, 2, 3, 1, 4, 2, null, 4, 3];

type Method = 'not-in' | 'not-in-filtered' | 'not-exists';

const METHODS: { key: Method; label: string; sql: string }[] = [
    {
        key: 'not-in',
        label: 'NOT IN',
        sql: `WHERE g.guide_id NOT IN (SELECT guide_id FROM tours)`,
    },
    {
        key: 'not-in-filtered',
        label: 'NOT IN, NULL বাদ দিয়ে',
        sql: `WHERE g.guide_id NOT IN (SELECT guide_id FROM tours
                         WHERE guide_id IS NOT NULL)`,
    },
    {
        key: 'not-exists',
        label: 'NOT EXISTS',
        sql: `WHERE NOT EXISTS (SELECT 1 FROM tours t
                  WHERE t.guide_id = g.guide_id)`,
    },
];

type Truth = 'TRUE' | 'FALSE' | 'UNKNOWN';

/** Three valued NOT IN: false on any match, unknown when a NULL is left, else true. */
function notIn(value: number, list: (number | null)[]): Truth {
    if (list.some(v => v === value)) return 'FALSE';
    if (list.some(v => v === null)) return 'UNKNOWN';
    return 'TRUE';
}

/**
 * The same anti join question, "which guide has no tour", written three ways
 * against the real tours list. NOT IN loses Nazmul Karim because the list
 * holds a NULL; the other two keep him.
 */
export function NotInTrapLab() {
    const [method, setMethod] = useState<Method>('not-in');

    const list = method === 'not-in-filtered' ? TOUR_GUIDE_IDS.filter(v => v !== null) : TOUR_GUIDE_IDS;
    const distinct = [...new Set(list)];
    const rows = GUIDES.map(g => {
        if (method === 'not-exists') {
            const found = TOUR_GUIDE_IDS.some(v => v === g.id);
            return {
                ...g,
                truth: (found ? 'FALSE' : 'TRUE') as Truth,
                why: found ? 'tours এ এই guide_id পাওয়া গেল' : 'tours এ এই guide_id একবারও নেই',
            };
        }
        const truth = notIn(g.id, list);
        const why =
            truth === 'FALSE'
                ? `তালিকায় ${g.id} আছে, তাই একটা তুলনা মিথ্যা`
                : truth === 'UNKNOWN'
                  ? `${g.id} তালিকায় নেই, কিন্তু ${g.id} <> NULL অজানা`
                  : `${g.id} কোনোটার সমান না, সব তুলনা সত্য`;
        return { ...g, truth, why };
    });
    const kept = rows.filter(r => r.truth === 'TRUE').length;
    const sql = METHODS.find(m => m.key === method)!.sql;

    return (
        <Panel
            label='Interactive'
            title='কোন Guide এর কোনো ট্যুর নেই? তিনভাবে'
            footer='Data আসল: guides এর পাঁচজন, আর tours এর নয়টা guide_id, যার একটা NULL (Ratargul Swamp Boat Day এর এখনো Guide নেই)। WHERE শুধু TRUE রাখে, FALSE আর UNKNOWN দুটোই বাদ যায়। এই তিনটা ফলাফল PostgreSQL 18 আর MySQL 8.4 দুই জায়গাতেই একই।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {METHODS.map(m => (
                    <button
                        key={m.key}
                        type='button'
                        data-method={m.key}
                        onClick={() => setMethod(m.key)}
                        className={cn(BTN, method === m.key ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>

            <pre className='mb-4 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT g.full_name FROM guides g\n${sql};`}
            </pre>

            {method !== 'not-exists' && (
                <p className='mb-4 font-mono text-[0.75rem] text-muted-foreground'>
                    ভেতরের তালিকা: ({distinct.map(v => (v === null ? 'NULL' : v)).join(', ')})
                </p>
            )}

            <ul className='space-y-1.5'>
                {rows.map(r => (
                    <li
                        key={r.id}
                        className={cn(
                            'flex flex-wrap items-baseline gap-x-3 gap-y-1 border px-3 py-2 text-[0.8125rem]',
                            r.truth === 'TRUE' ? 'border-primary bg-primary/5' : 'border-border/60'
                        )}>
                        <span className='w-5 font-mono text-muted-foreground'>{r.id}</span>
                        <span className={cn('min-w-[8rem] font-medium', r.truth === 'TRUE' && 'text-primary')}>{r.name}</span>
                        <span
                            className={cn(
                                'font-mono text-[0.6875rem] font-bold',
                                r.truth === 'TRUE' ? 'text-primary' : r.truth === 'UNKNOWN' ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                            {r.truth}
                        </span>
                        <span className='flex-1 text-[0.75rem] text-muted-foreground'>{r.why}</span>
                    </li>
                ))}
            </ul>

            <p className='mt-5 text-sm'>
                ফলাফলে{' '}
                <strong className='text-primary' data-kept={kept}>
                    {toBn(kept)}টা Row
                </strong>
                {kept === 0
                    ? '। Nazmul Karim এর সত্যিই কোনো ট্যুর নেই, তবু তিনি নেই। কোনো Error ও নেই। এটাই ফাঁদ।'
                    : '। Nazmul Karim, যাঁর কোনো ট্যুর নেই।'}
            </p>
        </Panel>
    );
}
