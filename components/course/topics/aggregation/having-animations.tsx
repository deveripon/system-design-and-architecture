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
/* 1. দুটো ছাঁকনি নিজে চালান                                                    */
/* ------------------------------------------------------------------------- */

/** The 24 real rows of `bookings`, as the sample database holds them. */
const BOOKINGS: { id: number; customer: number; departure: number; seats: number; status: string }[] = [
    { id: 1, customer: 1, departure: 1, seats: 2, status: 'confirmed' },
    { id: 2, customer: 2, departure: 1, seats: 4, status: 'confirmed' },
    { id: 3, customer: 3, departure: 2, seats: 1, status: 'confirmed' },
    { id: 4, customer: 4, departure: 3, seats: 3, status: 'confirmed' },
    { id: 5, customer: 5, departure: 3, seats: 2, status: 'cancelled' },
    { id: 6, customer: 6, departure: 4, seats: 2, status: 'confirmed' },
    { id: 7, customer: 7, departure: 4, seats: 1, status: 'confirmed' },
    { id: 8, customer: 1, departure: 5, seats: 2, status: 'confirmed' },
    { id: 9, customer: 8, departure: 6, seats: 2, status: 'confirmed' },
    { id: 10, customer: 9, departure: 6, seats: 1, status: 'confirmed' },
    { id: 11, customer: 10, departure: 7, seats: 2, status: 'confirmed' },
    { id: 12, customer: 11, departure: 2, seats: 2, status: 'cancelled' },
    { id: 13, customer: 2, departure: 8, seats: 2, status: 'confirmed' },
    { id: 14, customer: 12, departure: 8, seats: 4, status: 'pending' },
    { id: 15, customer: 13, departure: 10, seats: 3, status: 'confirmed' },
    { id: 16, customer: 14, departure: 11, seats: 2, status: 'confirmed' },
    { id: 17, customer: 1, departure: 11, seats: 2, status: 'pending' },
    { id: 18, customer: 6, departure: 12, seats: 1, status: 'cancelled' },
    { id: 19, customer: 11, departure: 13, seats: 2, status: 'confirmed' },
    { id: 20, customer: 9, departure: 14, seats: 2, status: 'pending' },
    { id: 21, customer: 4, departure: 15, seats: 3, status: 'confirmed' },
    { id: 22, customer: 3, departure: 9, seats: 1, status: 'confirmed' },
    { id: 23, customer: 8, departure: 10, seats: 5, status: 'confirmed' },
    { id: 24, customer: 13, departure: 14, seats: 2, status: 'pending' },
];

type GroupKey = 'customer' | 'departure';
type HavingKey = 'none' | 'count' | 'seats';

const GROUPS: { key: GroupKey; label: string; column: string }[] = [
    { key: 'customer', label: 'Customer অনুযায়ী', column: 'customer_id' },
    { key: 'departure', label: 'Departure অনুযায়ী', column: 'departure_id' },
];

const HAVINGS: { key: HavingKey; label: string; sql: string }[] = [
    { key: 'none', label: 'HAVING নেই', sql: '' },
    { key: 'count', label: 'count(*) >= 2', sql: 'HAVING count(*) >= 2' },
    { key: 'seats', label: 'sum(seats) > 4', sql: 'HAVING sum(seats) > 4' },
];

function passes(having: HavingKey, count: number, seats: number) {
    if (having === 'count') return count >= 2;
    if (having === 'seats') return seats > 4;
    return true;
}

/**
 * The two filters on the real 24 bookings. Switch the row filter, the grouping
 * and the group filter, and watch which rows enter, which groups form, and which
 * groups survive. Every number here is the same one the query boxes print.
 */
export function SievesLab() {
    const reduce = useReducedMotion();
    const [group, setGroup] = useState<GroupKey>('customer');
    const [where, setWhere] = useState(false);
    const [having, setHaving] = useState<HavingKey>('count');

    const column = GROUPS.find(g => g.key === group)!.column;
    const rows = BOOKINGS.filter(b => !where || b.status !== 'cancelled');
    const map = new Map<number, { count: number; seats: number }>();
    for (const r of rows) {
        const k = group === 'customer' ? r.customer : r.departure;
        const g = map.get(k) ?? { count: 0, seats: 0 };
        map.set(k, { count: g.count + 1, seats: g.seats + r.seats });
    }
    const groups = [...map.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([key, g]) => ({ key, ...g, pass: passes(having, g.count, g.seats) }));
    const kept = groups.filter(g => g.pass).length;

    const sql = [
        `SELECT ${column}, count(*) AS bookings, sum(seats) AS seats`,
        'FROM bookings',
        ...(where ? ["WHERE status <> 'cancelled'"] : []),
        `GROUP BY ${column}`,
        ...(having !== 'none' ? [HAVINGS.find(h => h.key === having)!.sql] : []),
        `ORDER BY ${column};`,
    ].join('\n');

    return (
        <Panel
            label='Interactive'
            title='WHERE আর HAVING, আসল ২৪টা Booking এ'
            footer='Data একদম আসল: Sample Database এর bookings Table এর ২৪টা Row। WHERE চালু করলে তিনটা cancelled Row দলে ঢোকার আগেই বাদ পড়ে, তাই কিছু দলের হিসাব বদলায়, আর Departure 12 এর মতো দল পুরোপুরি হারিয়ে যায়। HAVING কখনো একটা Row বাদ দেয় না, শুধু পুরো দল রাখে বা ফেলে।'>
            <div className='grid gap-4 md:grid-cols-3 mb-6'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        GROUP BY
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {GROUPS.map(g => (
                            <button
                                key={g.key}
                                data-group={g.key}
                                onClick={() => setGroup(g.key)}
                                className={cn(BTN, group === g.key ? BTN_ON : BTN_OFF)}>
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        WHERE
                    </p>
                    <button
                        data-where={where ? 'on' : 'off'}
                        onClick={() => setWhere(v => !v)}
                        className={cn(BTN, where ? BTN_ON : BTN_OFF)}>
                        {where ? "status <> 'cancelled' চালু" : 'WHERE নেই'}
                    </button>
                </div>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        HAVING
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {HAVINGS.map(h => (
                            <button
                                key={h.key}
                                data-having={h.key}
                                onClick={() => setHaving(h.key)}
                                className={cn(BTN, having === h.key ? BTN_ON : BTN_OFF)}>
                                {h.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        ধাপ ১: Row গুলো ({toBn(rows.length)}টা দলে ঢুকছে, {toBn(BOOKINGS.length - rows.length)}টা বাদ)
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                        {BOOKINGS.map(b => {
                            const dropped = where && b.status === 'cancelled';
                            return (
                                <span
                                    key={b.id}
                                    title={`booking ${b.id}: ${b.status}`}
                                    className={cn(
                                        'px-1.5 py-1 border font-mono text-[0.625rem] tabular-nums transition-opacity',
                                        dropped
                                            ? 'border-border text-muted-foreground/50 line-through opacity-50'
                                            : b.status === 'cancelled'
                                              ? 'border-destructive/50 text-destructive'
                                              : 'border-border text-foreground/80'
                                    )}>
                                    #{b.id}·{group === 'customer' ? `c${b.customer}` : `d${b.departure}`}·{b.seats}
                                </span>
                            );
                        })}
                    </div>
                    <p className='mt-2 font-mono text-[0.625rem] text-muted-foreground'>
                        #booking·{group === 'customer' ? 'customer' : 'departure'}·seats, লাল মানে cancelled
                    </p>
                    <pre className='mt-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        {sql}
                    </pre>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        ধাপ ২: দলগুলো ({toBn(groups.length)}টা তৈরি, {toBn(kept)}টা টিকল)
                    </p>
                    <div className='overflow-x-auto border border-border' data-result-count={kept}>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    <th className='px-3 py-1.5 text-left'>{column}</th>
                                    <th className='px-3 py-1.5 text-right'>bookings</th>
                                    <th className='px-3 py-1.5 text-right'>seats</th>
                                    <th className='px-3 py-1.5 text-left'>HAVING</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map(g => (
                                    <motion.tr
                                        key={`${group}-${g.key}`}
                                        layout={!reduce}
                                        transition={{ duration: 0.25, ease: EASE }}
                                        className={cn(
                                            'border-t border-border/60',
                                            g.pass ? 'text-foreground' : 'text-muted-foreground/50'
                                        )}>
                                        <td className='px-3 py-1'>{g.key}</td>
                                        <td className='px-3 py-1 text-right tabular-nums'>{g.count}</td>
                                        <td className='px-3 py-1 text-right tabular-nums'>{g.seats}</td>
                                        <td className='px-3 py-1'>
                                            {having === 'none' ? '' : g.pass ? 'থাকল' : 'বাদ'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. শর্তটা কোথায় বসবে                                                         */
/* ------------------------------------------------------------------------- */

type Place = 'where' | 'having' | 'either';

const CASES: { id: string; condition: string; answer: Place; why: string }[] = [
    {
        id: 'status',
        condition: "status = 'confirmed'",
        answer: 'where',
        why: "একটা Row এর Column। GROUP BY customer_id হলে HAVING এ লিখলে PostgreSQL Error দেয়: column \"bookings.status\" must appear in the GROUP BY clause। শুধু WHERE এই শর্ত বসাতে পারে, আর তাতে দলে কী ঢুকবে সেটাই বদলায়।",
    },
    {
        id: 'count',
        condition: 'count(*) >= 2',
        answer: 'having',
        why: 'count(*) জন্মায় দল তৈরির পরে। WHERE এ লিখলে Error: aggregate functions are not allowed in WHERE।',
    },
    {
        id: 'spent',
        condition: 'sum(total_bdt) >= 30000',
        answer: 'having',
        why: 'একটা দলের মোট টাকা। Aggregate, তাই শুধু HAVING।',
    },
    {
        id: 'october',
        condition: "booked_at >= '2026-10-01'",
        answer: 'where',
        why: 'একটা Booking এর তারিখ, একটা Row এর ব্যাপার। দলে কোন Booking গুলো গোনা হবে, সেটা ঠিক করে।',
    },
    {
        id: 'grouped',
        condition: 'customer_id <> 15   (GROUP BY customer_id)',
        answer: 'either',
        why: 'যে Column দিয়ে দল হচ্ছে, তার শর্ত দুই জায়গাতেই চলে, উত্তরও এক। তবু WHERE এ লিখুন: Docs এর ভাষায় এটা WHERE ধাপেই বেশি কার্যকর, আর MySQL এর Manual বলে HAVING চলে প্রায় শেষে, কোনো Optimization ছাড়া।',
    },
    {
        id: 'avg',
        condition: 'avg(seats) > 2',
        answer: 'having',
        why: 'গড় একটা দলের হিসাব। একটা Row এর কোনো গড় নেই।',
    },
    {
        id: 'seats',
        condition: 'seats > 1',
        answer: 'where',
        why: 'একটা Booking এর সিট। WHERE এ দিলে শুধু একাধিক সিটের Booking গোনা হয়। মনে রাখুন, এটা sum(seats) > 1 এর সাথে এক না।',
    },
    {
        id: 'latest',
        condition: "max(booked_at) >= '2026-10-01'",
        answer: 'having',
        why: 'দলের সবচেয়ে নতুন Booking এর তারিখ, মানে "যাঁর শেষ Booking অক্টোবরে"। max() Aggregate, তাই HAVING।',
    },
];

const PLACES: { key: Place; label: string }[] = [
    { key: 'where', label: 'WHERE' },
    { key: 'having', label: 'HAVING' },
    { key: 'either', label: 'দুটোতেই চলে' },
];

/**
 * Eight conditions from Island Tours reports. Decide where each one belongs,
 * then read why. The rule underneath: a condition on one row goes to WHERE, a
 * condition on a group's aggregate goes to HAVING.
 */
export function WhereOrHavingLab() {
    const reduce = useReducedMotion();
    const [answers, setAnswers] = useState<Record<string, Place>>({});
    const score = CASES.filter(c => answers[c.id] === c.answer).length;
    const done = Object.keys(answers).length;

    return (
        <Panel
            label='Interactive'
            title='শর্তটা কোথায় বসবে'
            footer='নিয়ম একটাই প্রশ্নে: শর্তটা কি একটা Row দেখে বলা যায়, নাকি পুরো দলের হিসাব লাগে? Row দেখে বলা গেলে WHERE, দলের হিসাব লাগলে HAVING। সব শর্ত Island Tours এর bookings Table নিয়ে, GROUP BY customer_id ধরে।'>
            <div className='space-y-4' data-score={score}>
                {CASES.map(c => {
                    const picked = answers[c.id];
                    const correct = picked === c.answer;
                    return (
                        <div key={c.id} className='border border-border bg-background p-4'>
                            <div className='flex flex-wrap items-center justify-between gap-3'>
                                <code className='font-mono text-[0.8125rem] text-foreground'>{c.condition}</code>
                                <div className='flex flex-wrap gap-2'>
                                    {PLACES.map(p => (
                                        <button
                                            key={p.key}
                                            data-case={c.id}
                                            data-choice={p.key}
                                            onClick={() => setAnswers(a => ({ ...a, [c.id]: p.key }))}
                                            className={cn(
                                                BTN,
                                                picked === p.key
                                                    ? correct
                                                        ? BTN_ON
                                                        : 'border-destructive/60 bg-destructive/5 text-destructive'
                                                    : BTN_OFF
                                            )}>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {picked && (
                                <motion.p
                                    initial={reduce ? false : { opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: EASE }}
                                    className='mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                                    <strong className={correct ? 'text-primary' : 'text-destructive'}>
                                        {correct ? 'ঠিক। ' : `উত্তর: ${PLACES.find(p => p.key === c.answer)!.label}। `}
                                    </strong>
                                    {c.why}
                                </motion.p>
                            )}
                        </div>
                    );
                })}
            </div>
            <p className='mt-5 font-mono text-[0.6875rem] text-muted-foreground'>
                {done === 0
                    ? 'প্রতিটা শর্তের পাশে একটা বেছে নিন।'
                    : `${toBn(done)}টার মধ্যে ${toBn(score)}টা ঠিক।`}
            </p>
        </Panel>
    );
}
