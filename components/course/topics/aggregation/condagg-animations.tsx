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

/** The 24 real rows of bookings, as a fresh sample database returns them. */
const BOOKINGS = [
    { id: 1, departure: 1, seats: 2, status: 'confirmed', total: 25000 },
    { id: 2, departure: 1, seats: 4, status: 'confirmed', total: 50000 },
    { id: 3, departure: 2, seats: 1, status: 'confirmed', total: 12500 },
    { id: 4, departure: 3, seats: 3, status: 'confirmed', total: 25500 },
    { id: 5, departure: 3, seats: 2, status: 'cancelled', total: 17000 },
    { id: 6, departure: 4, seats: 2, status: 'confirmed', total: 36000 },
    { id: 7, departure: 4, seats: 1, status: 'confirmed', total: 18000 },
    { id: 8, departure: 5, seats: 2, status: 'confirmed', total: 19000 },
    { id: 9, departure: 6, seats: 2, status: 'confirmed', total: 28000 },
    { id: 10, departure: 6, seats: 1, status: 'confirmed', total: 14000 },
    { id: 11, departure: 7, seats: 2, status: 'confirmed', total: 15600 },
    { id: 12, departure: 2, seats: 2, status: 'cancelled', total: 25000 },
    { id: 13, departure: 8, seats: 2, status: 'confirmed', total: 25000 },
    { id: 14, departure: 8, seats: 4, status: 'pending', total: 50000 },
    { id: 15, departure: 10, seats: 3, status: 'confirmed', total: 25500 },
    { id: 16, departure: 11, seats: 2, status: 'confirmed', total: 36000 },
    { id: 17, departure: 11, seats: 2, status: 'pending', total: 36000 },
    { id: 18, departure: 12, seats: 1, status: 'cancelled', total: 9500 },
    { id: 19, departure: 13, seats: 2, status: 'confirmed', total: 28000 },
    { id: 20, departure: 14, seats: 2, status: 'pending', total: 15600 },
    { id: 21, departure: 15, seats: 3, status: 'confirmed', total: 10500 },
    { id: 22, departure: 9, seats: 1, status: 'confirmed', total: 12500 },
    { id: 23, departure: 10, seats: 5, status: 'confirmed', total: 42500 },
    { id: 24, departure: 14, seats: 2, status: 'pending', total: 15600 },
] as const;

type Booking = (typeof BOOKINGS)[number];

/** Money exactly as psql prints numeric(10, 2): no thousands separator. */
const money = (n: number) => n.toFixed(2);

const STATUS_TONE: Record<string, string> = {
    confirmed: 'text-primary',
    pending: 'text-foreground',
    cancelled: 'text-muted-foreground line-through',
};

/* ------------------------------------------------------------------------- */
/* 1. এক দফায় পাঁচটা গোনা, Row ধরে ধরে                                         */
/* ------------------------------------------------------------------------- */

const ONE_PASS_COUNTERS: { name: string; rule: string; feeds: (b: Booking) => boolean; add: (b: Booking) => number; isMoney?: boolean }[] = [
    { name: 'total', rule: 'count(*)', feeds: () => true, add: () => 1 },
    { name: 'confirmed', rule: "FILTER (WHERE status = 'confirmed')", feeds: b => b.status === 'confirmed', add: () => 1 },
    { name: 'pending', rule: "FILTER (WHERE status = 'pending')", feeds: b => b.status === 'pending', add: () => 1 },
    { name: 'cancelled', rule: "FILTER (WHERE status = 'cancelled')", feeds: b => b.status === 'cancelled', add: () => 1 },
    {
        name: 'revenue',
        rule: "sum(total_bdt) FILTER (WHERE status = 'confirmed')",
        feeds: b => b.status === 'confirmed',
        add: b => b.total,
        isMoney: true,
    },
];

/**
 * Step through the 24 real bookings one row at a time and watch five counters
 * fill from a single pass: every row visits every counter, and only the
 * counters whose condition is true for it move.
 */
export function OnePassLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const seen = BOOKINGS.slice(0, step);
    const current = step > 0 ? BOOKINGS[step - 1] : null;
    const done = step === BOOKINGS.length;

    return (
        <Panel
            label='Interactive'
            title='এক দফায় পাঁচটা হিসাব'
            footer={
                <>
                    শেষে পাঁচটা সংখ্যা ঠিক এই Query র ফলাফল: 24, 17, 4, 3 আর 423600.00। Table টা একবারই পড়া
                    হয়েছে। চারটা আলাদা Query লিখলে একই Table চারবার পড়তে হতো।
                </>
            }>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT count(*) AS total,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS revenue
FROM bookings;`}
            </pre>

            <div className='flex flex-wrap gap-2 mb-5'>
                <button type='button' data-action='step' disabled={done} onClick={() => setStep(s => Math.min(s + 1, BOOKINGS.length))} className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                    পরের Row
                </button>
                <button type='button' data-action='run' disabled={done} onClick={() => setStep(BOOKINGS.length)} className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                    বাকি সব একবারে
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
                <span className='self-center font-mono text-[0.6875rem] text-muted-foreground' data-step={step}>
                    {toBn(step)} / {toBn(BOOKINGS.length)} Row পড়া হয়েছে
                </span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6'>
                <div className='border border-border'>
                    <div className='grid grid-cols-[3rem_1fr_5.5rem] gap-2 border-b border-border bg-muted/30 px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground'>
                        <span>id</span>
                        <span>status</span>
                        <span className='text-right'>total_bdt</span>
                    </div>
                    <div className='max-h-80 overflow-y-auto'>
                        {BOOKINGS.map((b, i) => (
                            <div
                                key={b.id}
                                className={cn(
                                    'grid grid-cols-[3rem_1fr_5.5rem] gap-2 px-3 py-1 font-mono text-[0.75rem] border-b border-border/50 transition-colors',
                                    i === step - 1 ? 'bg-primary/15' : i < step ? 'bg-muted/20' : 'opacity-45'
                                )}>
                                <span>{b.id}</span>
                                <span className={STATUS_TONE[b.status]}>{b.status}</span>
                                <span className='text-right'>{money(b.total)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='space-y-3'>
                    {ONE_PASS_COUNTERS.map(counter => {
                        const value = seen.filter(counter.feeds).reduce((sum, b) => sum + counter.add(b), 0);
                        const fed = current ? counter.feeds(current) : false;
                        const anyFed = seen.some(counter.feeds);
                        return (
                            <div
                                key={counter.name}
                                data-counter={counter.name}
                                className={cn(
                                    'border px-4 py-3 transition-colors',
                                    fed ? 'border-primary bg-primary/10' : 'border-border bg-background'
                                )}>
                                <div className='flex items-baseline justify-between gap-3'>
                                    <span className='font-mono text-[0.75rem] font-bold text-foreground'>{counter.name}</span>
                                    <motion.span
                                        key={value}
                                        initial={reduce ? false : { scale: 1.25 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.25, ease: EASE }}
                                        className='font-mono text-base font-bold text-primary'>
                                        {counter.isMoney ? (anyFed ? money(value) : 'NULL') : value}
                                    </motion.span>
                                </div>
                                <p className='mt-1 font-mono text-[0.625rem] text-muted-foreground break-words'>{counter.rule}</p>
                                {current && (
                                    <p className={cn('mt-1 text-[0.75rem]', fed ? 'text-primary' : 'text-muted-foreground/70')}>
                                        {fed ? `#${current.id} এখানে গোনা হলো` : `#${current.id} এর শর্ত মেলেনি, এই খাতা চুপ`}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    {!current && (
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                            এখনো কোনো Row পড়া হয়নি। লক্ষ্য করুন revenue এর ঘরে NULL: কোনো Row না পেলে SUM শূন্য দেয় না,
                            NULL দেয়। count কিন্তু শুরুতেই শূন্য।
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা Departure এর ভাঙা হিসাব                                          */
/* ------------------------------------------------------------------------- */

const DEPARTURE_IDS = Array.from({ length: 16 }, (_, i) => i + 1);

/**
 * Pick a departure and see its bookings and the one result row that
 * GROUP BY departure_id with conditional counts makes for it, including the
 * departure whose only booking is cancelled (SUM gives NULL) and the one with
 * no bookings at all (no group, so no row).
 */
export function BreakdownLab() {
    const [departure, setDeparture] = useState(12);
    const [coalesce, setCoalesce] = useState(false);
    const rows = BOOKINGS.filter(b => b.departure === departure);
    const live = rows.filter(b => b.status !== 'cancelled');
    const held = live.reduce((sum, b) => sum + b.seats, 0);
    const heldText = live.length === 0 ? (coalesce ? '0' : 'NULL') : String(held);
    const count = (status: string) => rows.filter(b => b.status === status).length;

    return (
        <Panel
            label='Interactive'
            title='একটা Departure, তার একটা Row'
            footer={
                <>
                    Departure 12 এর একমাত্র Booking বাতিল, তাই সেখানে confirmed আর pending শূন্য, কিন্তু held
                    এর ঘরে NULL। Departure 16 এর কোনো Booking ই নেই, তাই bookings Table এ তার কোনো Row নেই,
                    আর GROUP BY তার জন্য কোনো দল বানায় না। শূন্য দেখাতে হলে departures Table টাও লাগবে, যা
                    Module 06 এর কাজ।
                </>
            }>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT departure_id,
       count(*) AS bookings,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       ${coalesce ? "COALESCE(sum(seats) FILTER (WHERE status <> 'cancelled'), 0)" : "sum(seats) FILTER (WHERE status <> 'cancelled')"} AS held
FROM bookings
GROUP BY departure_id;`}
            </pre>

            <div className='flex flex-wrap gap-1.5 mb-3'>
                {DEPARTURE_IDS.map(id => (
                    <button
                        key={id}
                        type='button'
                        data-departure={id}
                        aria-pressed={id === departure}
                        onClick={() => setDeparture(id)}
                        className={cn('w-9 h-8 border font-mono text-[0.75rem] font-bold transition-colors', id === departure ? BTN_ON : BTN_OFF)}>
                        {id}
                    </button>
                ))}
            </div>
            <button
                type='button'
                data-action='coalesce'
                aria-pressed={coalesce}
                onClick={() => setCoalesce(v => !v)}
                className={cn(BTN, 'mb-5', coalesce ? BTN_ON : BTN_OFF)}>
                {coalesce ? 'COALESCE চালু: NULL এর জায়গায় 0' : 'held এ COALESCE লাগান'}
            </button>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='border border-border'>
                    <p className='border-b border-border bg-muted/30 px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground'>
                        bookings, departure_id = {departure}
                    </p>
                    {rows.length === 0 ? (
                        <p className='px-3 py-4 text-sm text-muted-foreground'>এই Departure এর কোনো Booking নেই।</p>
                    ) : (
                        rows.map(b => (
                            <div key={b.id} className='grid grid-cols-[3rem_1fr_3rem] gap-2 px-3 py-1.5 font-mono text-[0.75rem] border-b border-border/50 last:border-b-0'>
                                <span>#{b.id}</span>
                                <span className={STATUS_TONE[b.status]}>{b.status}</span>
                                <span className='text-right'>{b.seats} সিট</span>
                            </div>
                        ))
                    )}
                </div>

                <div data-result-row={rows.length === 0 ? 'none' : heldText}>
                    {rows.length === 0 ? (
                        <div className='border border-dashed border-border px-4 py-6 text-sm text-muted-foreground leading-relaxed'>
                            ফলাফলে Departure {departure} এর কোনো Row ই আসবে না। GROUP BY শুধু সেই দলগুলো বানায়
                            যাদের অন্তত একটা Row আছে।
                        </div>
                    ) : (
                        <div className='overflow-x-auto border border-border'>
                            <table className='w-full border-collapse font-mono text-[0.75rem]'>
                                <thead>
                                    <tr className='bg-muted/40'>
                                        {['departure_id', 'bookings', 'confirmed', 'pending', 'cancelled', 'held'].map(h => (
                                            <th key={h} className='border-b border-border px-2.5 py-2 text-left font-bold'>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='px-2.5 py-2'>{departure}</td>
                                        <td className='px-2.5 py-2'>{rows.length}</td>
                                        <td className='px-2.5 py-2'>{count('confirmed')}</td>
                                        <td className='px-2.5 py-2'>{count('pending')}</td>
                                        <td className='px-2.5 py-2'>{count('cancelled')}</td>
                                        <td className={cn('px-2.5 py-2 font-bold', heldText === 'NULL' ? 'text-muted-foreground italic' : 'text-primary')}>
                                            {heldText}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {rows.length > 0 && live.length === 0 && (
                        <p className='mt-3 text-sm text-muted-foreground leading-relaxed'>
                            count এর FILTER এ কোনো Row না মিললে উত্তর 0, কিন্তু sum এর FILTER এ কোনো Row না মিললে
                            উত্তর NULL। Report এ শূন্য চাইলে COALESCE লাগে।
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. WHERE বনাম FILTER: কোন Column বদলায়                                      */
/* ------------------------------------------------------------------------- */

const MODES = [
    {
        id: 'filter-only',
        label: 'শুধু FILTER',
        where: '',
        values: ['24', '17', '4', '3', '423600.00'],
        note: 'কোনো WHERE নেই। প্রতিটা খাতা সব 24টা Row দেখে, আর নিজের FILTER দিয়ে নিজের ভাগ নেয়।',
    },
    {
        id: 'where-confirmed',
        label: "WHERE status = 'confirmed'",
        where: "WHERE status = 'confirmed'",
        values: ['17', '17', '0', '0', '423600.00'],
        note: 'WHERE আগে চলে আর বাকি সাতটা Row ফেলে দেয়। তাই total নামে 17 তে, আর pending ও cancelled কোনো Row ই পায় না। FILTER গুলো এখনো আছে, কিন্তু তাদের দেখার মতো কিছু বাকি নেই।',
    },
    {
        id: 'where-recent',
        label: "WHERE booked_at >= '2026-09-01'",
        where: "WHERE booked_at >= '2026-09-01'",
        values: ['12', '7', '4', '1', '180000.00'],
        note: 'এবার WHERE সময়ের সীমা টানে: শুধু সেপ্টেম্বর থেকে আসা 12টা Booking। FILTER গুলো সেই 12টার ভেতরেই ভাগ করে। দুটো একসাথে: WHERE ঠিক করে কোন Row গুলো নিয়ে কথা, FILTER ঠিক করে প্রতিটা Column কোন ভাগটা গুনবে।',
    },
];

const HEADERS = ['total', 'confirmed', 'pending', 'cancelled', 'revenue'];

/**
 * The same five-column query under three WHERE clauses, with the cells that
 * changed from the plain FILTER version marked, so the reader sees that WHERE
 * shrinks every column while FILTER only shapes its own.
 */
export function WhereFilterLab() {
    const [mode, setMode] = useState(MODES[0].id);
    const current = MODES.find(m => m.id === mode) ?? MODES[0];
    const base = MODES[0].values;

    return (
        <Panel
            label='Interactive'
            title='WHERE বদলালে কী বদলায়'
            footer='প্রতিটা সংখ্যা একটা নতুন Load করা Sample Database এ এই Query চালিয়ে নেওয়া।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {MODES.map(m => (
                    <button
                        key={m.id}
                        type='button'
                        data-mode={m.id}
                        aria-pressed={m.id === mode}
                        onClick={() => setMode(m.id)}
                        className={cn(BTN, 'font-mono', m.id === mode ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT count(*) AS total,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS revenue
FROM bookings${current.where ? `\n${current.where}` : ''};`}
            </pre>
            <div className='overflow-x-auto border border-border mb-4' data-active-mode={current.id}>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            {HEADERS.map(h => (
                                <th key={h} className='border-b border-border px-3 py-2 text-left font-bold'>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {current.values.map((v, i) => (
                                <td
                                    key={HEADERS[i]}
                                    data-changed={v !== base[i]}
                                    className={cn('px-3 py-2', v !== base[i] ? 'bg-primary/15 text-primary font-bold' : 'text-foreground/90')}>
                                    {v}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>{current.note}</p>
        </Panel>
    );
}
