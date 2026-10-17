'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
    BOOKINGS,
    byId,
    chain,
    CUSTOMERS,
    DEPARTURES,
    DESTINATIONS,
    GUIDES,
    placementReport,
    TOURS,
    tourReport,
    type Booking,
    type GuideJoin,
    type LastJoin,
    type Placement,
} from './multi-data';

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
const SQL_BOX = 'overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground';

/* ------------------------------------------------------------------------- */
/* 1. শিকল বানান, একটা একটা Table                                               */
/* ------------------------------------------------------------------------- */

const STEPS = [
    { table: 'bookings', line: 'FROM bookings b' },
    { table: 'customers', line: 'JOIN customers c    ON c.customer_id = b.customer_id' },
    { table: 'departures', line: 'JOIN departures d   ON d.departure_id = b.departure_id' },
    { table: 'tours', line: 'JOIN tours t        ON t.tour_id = d.tour_id' },
    { table: 'destinations', line: 'JOIN destinations ds ON ds.destination_id = t.destination_id' },
    { table: 'guides', line: 'JOIN guides g       ON g.guide_id = t.guide_id' },
];

const FOCUS = [1, 13, 14, 17, 21, 23];

/**
 * Builds the six-table chain one join at a time over the real 24 bookings.
 * Every step shows the SQL so far and the row count; the guides step can be
 * INNER or LEFT, which is where booking 21 (Ratargul, no guide) lives or dies.
 * A focus picker walks one booking's keys hop by hop.
 */
export function ChainBuildLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(1);
    const [guideJoin, setGuideJoin] = useState<GuideJoin>('inner');
    const [focus, setFocus] = useState(21);

    const rows = chain(step, guideJoin);
    const lines = STEPS.slice(0, step).map((s, i) =>
        i === 5 && guideJoin === 'left' ? s.line.replace('JOIN guides', 'LEFT JOIN guides') : s.line
    );
    const sql = ['SELECT b.booking_id' + (step >= 2 ? ', c.full_name' : '') + (step >= 4 ? ', t.title' : '') + (step >= 5 ? ', ds.name' : '') + (step >= 6 ? ', g.full_name' : ''), ...lines].join('\n');
    const lost = step >= 6 && guideJoin === 'inner';

    const b = byId(BOOKINGS, focus)!;
    const c = byId(CUSTOMERS, b.customer)!;
    const d = byId(DEPARTURES, b.departure)!;
    const t = byId(TOURS, d.tour)!;
    const ds = byId(DESTINATIONS, t.destination)!;
    const g = byId(GUIDES, t.guide);
    const hops = [
        { table: 'bookings', key: `booking_id = ${b.id}`, found: `customer_id ${b.customer}, departure_id ${b.departure}` },
        { table: 'customers', key: `customer_id = ${b.customer}`, found: c.name },
        { table: 'departures', key: `departure_id = ${b.departure}`, found: `tour_id ${d.tour}` },
        { table: 'tours', key: `tour_id = ${d.tour}`, found: `${t.title}, guide_id ${t.guide ?? 'NULL'}` },
        { table: 'destinations', key: `destination_id = ${t.destination}`, found: ds.name },
        {
            table: 'guides',
            key: `guide_id = ${t.guide ?? 'NULL'}`,
            found: g ? g.name : guideJoin === 'inner' ? 'কোনো মিল নেই, Row বাদ' : 'কোনো মিল নেই, NULL বসল',
        },
    ];

    return (
        <Panel
            label='Interactive'
            title='শিকল বানান, একটা একটা Join'
            footer='প্রতিটা সংখ্যা আসল Sample Data থেকে হিসাব করা, Query বক্সে একই Query চালালে একই সংখ্যা আসবে।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='কয়টা Table'>
                {STEPS.map((s, i) => (
                    <button
                        key={s.table}
                        type='button'
                        data-step={i + 1}
                        aria-pressed={step === i + 1}
                        onClick={() => setStep(i + 1)}
                        className={cn(BTN, step === i + 1 ? BTN_ON : BTN_OFF)}>
                        {i === 0 ? s.table : `+ ${s.table}`}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-5' role='group' aria-label='guides এর Join'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    guides এর Join
                </span>
                {(['inner', 'left'] as GuideJoin[]).map(kind => (
                    <button
                        key={kind}
                        type='button'
                        data-guide={kind}
                        aria-pressed={guideJoin === kind}
                        onClick={() => setGuideJoin(kind)}
                        className={cn(BTN, guideJoin === kind ? BTN_ON : BTN_OFF)}>
                        {kind === 'inner' ? 'INNER JOIN' : 'LEFT JOIN'}
                    </button>
                ))}
            </div>

            <pre className={SQL_BOX}>{sql}</pre>

            <p className='mt-4 text-sm' data-count={rows.length}>
                ফলাফলে <strong className='text-primary'>{toBn(rows.length)}টা Row</strong>
                {lost
                    ? '। Booking 21 এর ট্যুরের কোনো Guide নেই, তাই INNER JOIN তাকে ফেলে দিয়েছে।'
                    : step >= 6
                      ? '। LEFT JOIN Booking 21 কে রেখেছে, তার Guide এর ঘরে NULL।'
                      : '। এখন পর্যন্ত প্রতিটা Booking ঠিক একটা করে মিল পেয়েছে, তাই সংখ্যা বদলায়নি।'}
            </p>

            <div className='mt-4 max-h-72 overflow-auto border border-border'>
                <table className='w-full border-collapse font-mono text-[0.6875rem]'>
                    <thead>
                        <tr className='bg-muted/40 text-left'>
                            <th className='px-2 py-1.5'>booking</th>
                            {step >= 2 && <th className='px-2 py-1.5'>customer</th>}
                            {step >= 4 && <th className='px-2 py-1.5'>tour</th>}
                            {step >= 5 && <th className='px-2 py-1.5'>destination</th>}
                            {step >= 6 && <th className='px-2 py-1.5'>guide</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {BOOKINGS.map(bk => {
                            const row = rows.find(r => r.booking === bk.id);
                            const full = chain(step, 'left').find(r => r.booking === bk.id)!;
                            const shown = row ?? full;
                            return (
                                <tr
                                    key={bk.id}
                                    className={cn(
                                        'border-t border-border/60',
                                        !row && 'line-through text-muted-foreground/60',
                                        bk.id === focus && 'bg-primary/10'
                                    )}>
                                    <td className='px-2 py-1'>{bk.id}</td>
                                    {step >= 2 && <td className='px-2 py-1'>{shown.customer}</td>}
                                    {step >= 4 && <td className='px-2 py-1'>{shown.tour}</td>}
                                    {step >= 5 && <td className='px-2 py-1'>{shown.destination}</td>}
                                    {step >= 6 && (
                                        <td className={cn('px-2 py-1', shown.guide === null && 'italic text-primary')}>
                                            {shown.guide ?? 'NULL'}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className='mt-6'>
                <div className='flex flex-wrap items-center gap-2 mb-3' role='group' aria-label='কোন Booking ধরে হাঁটবেন'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        একটা Booking এর চাবি ধরে হাঁটুন
                    </span>
                    {FOCUS.map(id => (
                        <button
                            key={id}
                            type='button'
                            data-focus={id}
                            aria-pressed={focus === id}
                            onClick={() => setFocus(id)}
                            className={cn(BTN, focus === id ? BTN_ON : BTN_OFF)}>
                            {`booking ${id}`}
                        </button>
                    ))}
                </div>
                <ol className='space-y-1.5'>
                    {hops.slice(0, step).map((h, i) => (
                        <motion.li
                            key={`${focus}-${h.table}`}
                            initial={reduce ? false : { opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.08, ease: EASE }}
                            className='grid grid-cols-[7rem_minmax(0,1fr)] gap-3 border border-border bg-background px-3 py-2 text-[0.75rem]'>
                            <span className='font-mono font-bold text-primary'>{h.table}</span>
                            <span>
                                <span className='font-mono text-muted-foreground'>{h.key}</span>
                                <span className='mx-2 text-muted-foreground'>→</span>
                                <span className={cn(h.found.includes('বাদ') && 'text-primary font-bold')}>{h.found}</span>
                            </span>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Tour Report: শেষ Join টা কী হবে                                           */
/* ------------------------------------------------------------------------- */

const LAST_JOINS: { key: LastJoin; label: string; sql: string }[] = [
    {
        key: 'inner',
        label: 'শেষে JOIN customers',
        sql: `FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN bookings b   ON b.departure_id = d.departure_id
JOIN customers c       ON c.customer_id = b.customer_id`,
    },
    {
        key: 'left',
        label: 'শেষেও LEFT JOIN',
        sql: `FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN bookings b   ON b.departure_id = d.departure_id
LEFT JOIN customers c  ON c.customer_id = b.customer_id`,
    },
    {
        key: 'nested',
        label: 'বন্ধনীর ভেতরে INNER',
        sql: `FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN (bookings b JOIN customers c
           ON c.customer_id = b.customer_id)
       ON b.departure_id = d.departure_id`,
    },
];

/**
 * The tour report that loses tours. tours LEFT JOIN departures LEFT JOIN
 * bookings keeps the inactive tour's empty departure and the Family Package
 * with no departure at all; one INNER JOIN to customers at the end throws both
 * away. LEFT, or the INNER join nested in brackets, keeps them.
 */
export function JoinTrapLab() {
    const [last, setLast] = useState<LastJoin>('inner');
    const rows = tourReport(last);
    const perTour = TOURS.map(t => ({ ...t, rows: rows.filter(r => r.tour === t.id) }));
    const current = LAST_JOINS.find(l => l.key === last)!;

    return (
        <Panel
            label='Interactive'
            title='যে Report থেকে ট্যুর হারায়'
            footer='বন্ধনীর রূপটা PostgreSQL আর MySQL দুটোতেই চলে, আর ফলাফল LEFT JOIN এর মতোই ২৬টা Row। পার্থক্য দেখা দেয় তখন, যখন কোনো Booking এর Customer পাওয়া যায় না: বন্ধনীর রূপে সেই Booking বাদ যায়, কিন্তু তার ট্যুর আর Departure থেকে যায়।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='শেষ Join'>
                {LAST_JOINS.map(l => (
                    <button
                        key={l.key}
                        type='button'
                        data-last={l.key}
                        aria-pressed={last === l.key}
                        onClick={() => setLast(l.key)}
                        className={cn(BTN, last === l.key ? BTN_ON : BTN_OFF)}>
                        {l.label}
                    </button>
                ))}
            </div>
            <pre className={SQL_BOX}>{current.sql}</pre>
            <p className='mt-4 text-sm' data-count={rows.length}>
                ফলাফলে <strong className='text-primary'>{toBn(rows.length)}টা Row</strong>
                {last === 'inner'
                    ? "। Saint Martin Luxury Stay আর Cox's Bazar Family Package Report থেকে গায়েব।"
                    : '। নয়টা ট্যুরই আছে, Booking না থাকা জায়গায় NULL।'}
            </p>
            <div className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2'>
                {perTour.map(t => (
                    <div
                        key={t.id}
                        data-tour={t.id}
                        data-kept={t.rows.length > 0}
                        className={cn(
                            'border px-3 py-2 text-[0.75rem] transition-colors',
                            t.rows.length > 0 ? 'border-border bg-background' : 'border-primary/60 bg-primary/5'
                        )}>
                        <div className={cn('font-bold', t.rows.length === 0 && 'line-through text-muted-foreground')}>
                            {t.title}
                        </div>
                        <div className='font-mono text-[0.6875rem] text-muted-foreground'>
                            {t.rows.length > 0 ? `${t.rows.length} row` + (t.rows.length > 1 ? 's' : '') : 'হারিয়ে গেছে'}
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. শর্ত কোথায় বসবে: ON নাকি WHERE                                           */
/* ------------------------------------------------------------------------- */

const STATUSES: Booking['status'][] = ['confirmed', 'pending', 'cancelled'];

/**
 * customers LEFT JOIN bookings with a status condition placed in ON or in
 * WHERE, grouped per customer. ON keeps all 15 customers and counts zero for
 * the rest; WHERE keeps only those who have at least one such booking.
 */
export function OnVsWhereLab() {
    const [placement, setPlacement] = useState<Placement>('on');
    const [status, setStatus] = useState<Booking['status']>('confirmed');
    const result = placementReport(placement, status);
    const keptIds = new Set(result.map(r => r.id));

    const sql =
        placement === 'on'
            ? `SELECT c.customer_id, c.full_name, count(b.booking_id)
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
                    AND b.status = '${status}'
GROUP BY c.customer_id, c.full_name;`
            : `SELECT c.customer_id, c.full_name, count(b.booking_id)
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = '${status}'
GROUP BY c.customer_id, c.full_name;`;

    return (
        <Panel
            label='Interactive'
            title='শর্তটা ON এ রাখুন, নয়তো WHERE এ'
            footer='WHERE এর বেলায় যে Customer এর ওই status এর কোনো Booking নেই, তাঁর Row এ b.status হয় অন্য কিছু, নয়তো NULL। দুই ক্ষেত্রেই শর্ত সত্য হয় না, তাই Row বাদ। LEFT JOIN এর রাখা Row টা WHERE নিজেই ফেলে দেয়।'>
            <div className='flex flex-wrap gap-2 mb-3' role='group' aria-label='শর্তের জায়গা'>
                {(['on', 'where'] as Placement[]).map(p => (
                    <button
                        key={p}
                        type='button'
                        data-placement={p}
                        aria-pressed={placement === p}
                        onClick={() => setPlacement(p)}
                        className={cn(BTN, placement === p ? BTN_ON : BTN_OFF)}>
                        {p === 'on' ? 'ON এর ভেতরে' : 'WHERE এ'}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন status'>
                {STATUSES.map(s => (
                    <button
                        key={s}
                        type='button'
                        data-status={s}
                        aria-pressed={status === s}
                        onClick={() => setStatus(s)}
                        className={cn(BTN, status === s ? BTN_ON : BTN_OFF)}>
                        {s}
                    </button>
                ))}
            </div>
            <pre className={SQL_BOX}>{sql}</pre>
            <p className='mt-4 text-sm' data-count={result.length}>
                ফলাফলে <strong className='text-primary'>{toBn(result.length)}জন Customer</strong>
                {placement === 'on'
                    ? `, যাঁদের ${toBn(result.filter(r => r.count === 0).length)}জনের গুনতি শূন্য।`
                    : `। বাকি ${toBn(15 - result.length)}জন পুরো ফলাফল থেকেই বাদ।`}
            </p>
            <div className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1'>
                {CUSTOMERS.map(c => {
                    const row = result.find(r => r.id === c.id);
                    return (
                        <div
                            key={c.id}
                            data-customer={c.id}
                            className={cn(
                                'flex items-baseline justify-between gap-2 border-b border-border/60 py-1 text-[0.75rem]',
                                !keptIds.has(c.id) && 'line-through text-muted-foreground/60'
                            )}>
                            <span>
                                <span className='font-mono text-muted-foreground mr-1.5'>{c.id}</span>
                                {c.name}
                            </span>
                            <span className={cn('font-mono font-bold', row?.count === 0 && 'text-primary')}>
                                {row ? row.count : 'বাদ'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
