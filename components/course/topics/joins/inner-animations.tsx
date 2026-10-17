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
/* 1. Row ধরে ধরে জোড়া মেলানো                                                  */
/* ------------------------------------------------------------------------- */

interface Side {
    table: string;
    alias: string;
    key: string;
    rows: { id: number; label: string; key: number | null }[];
}

interface Dataset {
    id: string;
    label: string;
    on: string;
    left: Side;
    right: Side;
    /** Column headers of the result rows. */
    result: [string, string];
}

/* All rows are the real sample data (checked against PostgreSQL 18). */
const CUSTOMERS = [
    [1, 'Rahim Uddin'], [2, 'Nusrat Jahan'], [3, 'Tanvir Ahmed'], [4, 'Farhana Akter'],
    [5, 'Sabbir Hossain'], [6, 'Mitu Rahman'], [7, 'Arif Chowdhury'], [8, 'Sumaiya Islam'],
    [9, 'Priya Sharma'], [10, 'Aiman Zulkifli'], [11, 'Oliver Bennett'], [12, 'Kamal Hasan'],
    [13, 'Shuvo Das'], [14, 'Lamia Haque'], [15, 'Imran Kabir'],
] as const;

/** booking_id → customer_id, for all 24 bookings. */
const BOOKING_CUSTOMER = [1, 2, 3, 4, 5, 6, 7, 1, 8, 9, 10, 11, 2, 12, 13, 14, 1, 6, 11, 9, 4, 3, 8, 13];

const DATASETS: Dataset[] = [
    {
        id: 'customers-bookings',
        label: 'customers ⋈ bookings',
        on: 'ON b.customer_id = c.customer_id',
        left: {
            table: 'customers',
            alias: 'c',
            key: 'customer_id',
            rows: CUSTOMERS.map(([id, name]) => ({ id, label: name, key: id })),
        },
        right: {
            table: 'bookings',
            alias: 'b',
            key: 'customer_id',
            rows: BOOKING_CUSTOMER.map((customer, i) => ({ id: i + 1, label: `booking ${i + 1}`, key: customer })),
        },
        result: ['c.full_name', 'b.booking_id'],
    },
    {
        id: 'destinations-tours',
        label: 'destinations ⋈ tours',
        on: 'ON t.destination_id = d.destination_id',
        left: {
            table: 'destinations',
            alias: 'd',
            key: 'destination_id',
            rows: [
                { id: 1, label: "Saint Martin's Island", key: 1 },
                { id: 2, label: "Cox's Bazar", key: 2 },
                { id: 3, label: 'Sundarbans', key: 3 },
                { id: 4, label: 'Sajek Valley', key: 4 },
                { id: 5, label: 'Bandarban', key: 5 },
                { id: 6, label: 'Sylhet', key: 6 },
                { id: 7, label: 'Kuakata', key: 7 },
            ],
        },
        right: {
            table: 'tours',
            alias: 't',
            key: 'destination_id',
            rows: [
                { id: 1, label: 'Saint Martin Island Escape', key: 1 },
                { id: 2, label: "Cox's Bazar Beach Weekend", key: 2 },
                { id: 3, label: 'Sundarbans Mangrove Cruise', key: 3 },
                { id: 4, label: 'Sajek Valley Cloud Trip', key: 4 },
                { id: 5, label: 'Bandarban Hill Trek', key: 5 },
                { id: 6, label: 'Sylhet Tea Garden Tour', key: 6 },
                { id: 7, label: 'Ratargul Swamp Boat Day', key: 6 },
                { id: 8, label: 'Saint Martin Luxury Stay', key: 1 },
                { id: 9, label: "Cox's Bazar Family Package", key: 2 },
            ],
        },
        result: ['d.name', 't.title'],
    },
    {
        id: 'tours-guides',
        label: 'tours ⋈ guides',
        on: 'ON g.guide_id = t.guide_id',
        left: {
            table: 'tours',
            alias: 't',
            key: 'guide_id',
            rows: [
                { id: 1, label: 'Saint Martin Island Escape', key: 1 },
                { id: 2, label: "Cox's Bazar Beach Weekend", key: 2 },
                { id: 3, label: 'Sundarbans Mangrove Cruise', key: 3 },
                { id: 4, label: 'Sajek Valley Cloud Trip', key: 1 },
                { id: 5, label: 'Bandarban Hill Trek', key: 4 },
                { id: 6, label: 'Sylhet Tea Garden Tour', key: 2 },
                { id: 7, label: 'Ratargul Swamp Boat Day', key: null },
                { id: 8, label: 'Saint Martin Luxury Stay', key: 4 },
                { id: 9, label: "Cox's Bazar Family Package", key: 3 },
            ],
        },
        right: {
            table: 'guides',
            alias: 'g',
            key: 'guide_id',
            rows: [
                { id: 1, label: 'Jamal Hossain', key: 1 },
                { id: 2, label: 'Shirin Akter', key: 2 },
                { id: 3, label: 'Rubel Mia', key: 3 },
                { id: 4, label: 'Ayesha Siddiqua', key: 4 },
                { id: 5, label: 'Nazmul Karim', key: 5 },
            ],
        },
        result: ['t.title', 'g.full_name'],
    },
];

/** A NULL key never equals anything, not even another NULL. */
const matches = (a: number | null, b: number | null) => a !== null && b !== null && a === b;

/**
 * Steps through the left table one row at a time. Each step lights the left
 * row, its matching right rows, and appends the pairs to the result. A left
 * row with no match adds nothing and is marked as dropped; at the end, right
 * rows that nobody matched are marked too.
 */
export function JoinMatchLab() {
    const reduce = useReducedMotion();
    const [datasetId, setDatasetId] = useState(DATASETS[0].id);
    const [step, setStep] = useState(0);
    const data = DATASETS.find(d => d.id === datasetId) ?? DATASETS[0];
    const total = data.left.rows.length;
    const done = step >= total;
    const current = done ? null : data.left.rows[step];

    const pairs = data.left.rows.slice(0, step).flatMap(l =>
        data.right.rows.filter(r => matches(l.key, r.key)).map(r => ({ l, r }))
    );
    const droppedLeft = data.left.rows
        .slice(0, step)
        .filter(l => !data.right.rows.some(r => matches(l.key, r.key)));
    const droppedRight = done ? data.right.rows.filter(r => !data.left.rows.some(l => matches(l.key, r.key))) : [];
    const lit = current ? data.right.rows.filter(r => matches(current.key, r.key)).map(r => r.id) : [];

    const choose = (id: string) => {
        setDatasetId(id);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='Row ধরে ধরে INNER JOIN'
            footer={
                <>
                    বাম Table এর প্রতিটা Row এর জন্য Database ডান Table এ সেই সব Row খোঁজে যাদের Key মেলে। যত মিল, ফলাফলে
                    তত Row। কোনো মিল না পেলে সেই Row ফলাফলে আসেই না। NULL Key কোনো কিছুর সাথে মেলে না, তাই guide
                    ছাড়া Ratargul বাদ পড়ে। সব তথ্য Sample Database এর আসল Row।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-5'>
                {DATASETS.map(d => (
                    <button
                        key={d.id}
                        type='button'
                        data-dataset={d.id}
                        onClick={() => choose(d.id)}
                        className={cn(BTN, 'font-mono', d.id === datasetId ? BTN_ON : BTN_OFF)}>
                        {d.label}
                    </button>
                ))}
            </div>
            <p className='mb-5 font-mono text-[0.75rem] text-muted-foreground break-words'>
                SELECT {data.result[0]}, {data.result[1]} FROM {data.left.table} {data.left.alias} JOIN{' '}
                {data.right.table} {data.right.alias} {data.on};
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4' data-step={step} data-result-count={pairs.length}>
                <div className='border border-border bg-background'>
                    <p className='border-b border-border px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary'>
                        {data.left.table} ({toBn(total)})
                    </p>
                    <ul className='max-h-80 overflow-y-auto divide-y divide-border/50'>
                        {data.left.rows.map((row, i) => {
                            const dropped = droppedLeft.includes(row);
                            const active = i === step;
                            return (
                                <li
                                    key={row.id}
                                    className={cn(
                                        'flex items-center justify-between gap-2 px-3 py-1.5 text-[0.75rem] transition-colors',
                                        active && 'bg-primary/10 text-primary',
                                        dropped && 'text-muted-foreground/60 line-through',
                                        i > step && !active && 'text-muted-foreground'
                                    )}>
                                    <span className='truncate'>{row.label}</span>
                                    <span className='font-mono text-[0.6875rem]'>{row.key ?? 'NULL'}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className='border border-border bg-background'>
                    <p className='border-b border-border px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary'>
                        {data.right.table} ({toBn(data.right.rows.length)})
                    </p>
                    <ul className='max-h-80 overflow-y-auto divide-y divide-border/50'>
                        {data.right.rows.map(row => {
                            const isLit = lit.includes(row.id);
                            const orphan = droppedRight.includes(row);
                            return (
                                <li
                                    key={row.id}
                                    className={cn(
                                        'flex items-center justify-between gap-2 px-3 py-1.5 text-[0.75rem] transition-colors',
                                        isLit && 'bg-primary/15 text-primary font-bold',
                                        orphan && 'text-muted-foreground/60 line-through'
                                    )}>
                                    <span className='truncate'>{row.label}</span>
                                    <span className='font-mono text-[0.6875rem]'>{row.key ?? 'NULL'}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className='border border-primary/40 bg-primary/5'>
                    <p className='border-b border-primary/30 px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary'>
                        ফলাফল ({toBn(pairs.length)} Row)
                    </p>
                    <ul className='max-h-80 overflow-y-auto divide-y divide-primary/15'>
                        {pairs.map(({ l, r }, i) => (
                            <motion.li
                                key={`${l.id}-${r.id}`}
                                initial={reduce ? false : { opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className='grid grid-cols-[1fr_auto] gap-2 px-3 py-1.5 text-[0.75rem]'>
                                <span className='truncate'>{l.label}</span>
                                <span className='truncate text-right text-muted-foreground'>
                                    {r.label}
                                    <span className='sr-only'> ({i + 1})</span>
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className='mt-5 min-h-12 text-sm leading-relaxed text-muted-foreground' aria-live='polite'>
                {current && (
                    <p>
                        এখন বাম দিকের <strong className='text-foreground'>{current.label}</strong>, Key{' '}
                        <code className='font-mono'>{current.key ?? 'NULL'}</code>।{' '}
                        {lit.length > 0
                            ? `ডান দিকে ${toBn(lit.length)}টা মিল, তাই ফলাফলে ${toBn(lit.length)}টা নতুন Row আসবে।`
                            : 'ডান দিকে কোনো মিল নেই, তাই এই Row ফলাফলে কিছুই যোগ করবে না।'}
                    </p>
                )}
                {done && (
                    <p>
                        শেষ। ফলাফলে <strong className='text-foreground'>{toBn(pairs.length)}</strong>টা Row।{' '}
                        {droppedLeft.length > 0 &&
                            `বাম দিক থেকে বাদ: ${droppedLeft.map(r => r.label).join(', ')}। `}
                        {droppedRight.length > 0 &&
                            `ডান দিক থেকে বাদ: ${droppedRight.map(r => r.label).join(', ')}। `}
                        INNER JOIN শুধু জোড়া পাওয়া Row রাখে, দুই দিকেই।
                    </p>
                )}
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
                <button
                    type='button'
                    data-action='prev'
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    আগের Row
                </button>
                <button
                    type='button'
                    data-action='next'
                    onClick={() => setStep(s => Math.min(total, s + 1))}
                    disabled={done}
                    className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                    পরের Row
                </button>
                <button type='button' data-action='all' onClick={() => setStep(total)} className={cn(BTN, BTN_OFF)}>
                    সব একসাথে
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কয়টা Row আসবে, আগে আন্দাজ                                                */
/* ------------------------------------------------------------------------- */

interface CountCase {
    id: string;
    sql: string;
    options: string[];
    answer: string;
    why: string;
}

/* Every answer is the real result on the sample database (PostgreSQL 18, MySQL 8.4). */
const CASES: CountCase[] = [
    {
        id: 'bookings-customers',
        sql: 'SELECT count(*) FROM bookings b JOIN customers c ON c.customer_id = b.customer_id;',
        options: ['15', '24', '39', '360'],
        answer: '24',
        why: 'প্রতিটা Booking এর ঠিক একজন Customer, তাই প্রতিটা Booking একবার করে জোড়া পায়। ফলাফল = Booking এর সংখ্যা, ২৪।',
    },
    {
        id: 'customers-bookings',
        sql: 'SELECT count(*) FROM customers c JOIN bookings b ON b.customer_id = c.customer_id;',
        options: ['15', '14', '24', '23'],
        answer: '24',
        why: 'INNER JOIN এ Table এর ক্রম উল্টালেও জোড়াগুলো একই, তাই একই ২৪। Imran বাদ পড়েন, কিন্তু সংখ্যা গোনে জোড়া, মানুষ না।',
    },
    {
        id: 'destinations-tours',
        sql: 'SELECT count(*) FROM destinations d JOIN tours t ON t.destination_id = d.destination_id;',
        options: ['7', '9', '16', '63'],
        answer: '9',
        why: 'প্রতিটা ট্যুরের একটা Destination, তাই ৯টা ট্যুর ৯টা জোড়া। Kuakata এর কোনো ট্যুর নেই, সে চুপচাপ বাদ।',
    },
    {
        id: 'tours-guides',
        sql: 'SELECT count(*) FROM tours t JOIN guides g ON g.guide_id = t.guide_id;',
        options: ['9', '8', '5', '4'],
        answer: '8',
        why: 'Ratargul এর guide_id NULL, আর NULL কোনো কিছুর সমান না। তাই ৯টা ট্যুরের ৮টা জোড়া পায়। Nazmul এর কোনো ট্যুর নেই, তিনিও বাদ।',
    },
    {
        id: 'natural',
        sql: 'SELECT count(*) FROM bookings NATURAL JOIN payments;',
        options: ['19', '24', '0', 'Error'],
        answer: '0',
        why: 'NATURAL JOIN booking_id আর status দুটোই মেলায়। confirmed কখনো paid এর সমান না, তাই শূন্য, কোনো Error ছাড়া।',
    },
    {
        id: 'wrong-on',
        sql: 'SELECT count(*) FROM bookings b JOIN customers c ON c.customer_id = b.booking_id;',
        options: ['24', '15', '0', 'Error'],
        answer: '15',
        why: 'ভুল Column জোড়া হয়েছে: Booking নম্বর আর Customer নম্বর। ১ থেকে ১৫ নম্বর Booking এর জন্য একই নম্বরের Customer আছে, তাই ১৫টা জোড়া, সবগুলোর মানে ভুল।',
    },
    {
        id: 'no-on',
        sql: 'SELECT count(*) FROM bookings b JOIN customers c;',
        options: ['24', '360', '0', 'Error'],
        answer: 'Error',
        why: 'PostgreSQL ON ছাড়া JOIN মানে না, syntax error দেয়। MySQL কিন্তু এটা মেনে নেয় আর ২৪ × ১৫ = ৩৬০টা Row দেয়, সবাই সবার সাথে।',
    },
];

export function JoinCountLab() {
    const [picks, setPicks] = useState<Record<string, string>>({});
    const answered = CASES.filter(c => picks[c.id] !== undefined);
    const score = answered.filter(c => picks[c.id] === c.answer).length;

    return (
        <Panel
            label='Predict'
            title='কয়টা Row আসবে?'
            footer='আগে আন্দাজ করুন, তারপর উপরের Query বক্সে নিজে চালিয়ে মিলিয়ে নিন। JOIN লেখার পর Row এর সংখ্যা আন্দাজ করার অভ্যাসটাই ভুল JOIN ধরার সবচেয়ে সস্তা উপায়।'>
            <div className='space-y-6' data-score={score}>
                {CASES.map(c => {
                    const pick = picks[c.id];
                    return (
                        <div key={c.id} className='border border-border bg-background p-4'>
                            <p className='font-mono text-[0.75rem] text-foreground break-words'>{c.sql}</p>
                            <div className='mt-3 flex flex-wrap gap-2'>
                                {c.options.map(option => {
                                    const chosen = pick === option;
                                    const right = pick !== undefined && option === c.answer;
                                    return (
                                        <button
                                            key={option}
                                            type='button'
                                            data-case={c.id}
                                            data-choice={option}
                                            onClick={() => setPicks(p => ({ ...p, [c.id]: option }))}
                                            className={cn(
                                                BTN,
                                                'font-mono',
                                                right ? BTN_ON : chosen ? 'border-destructive/60 text-destructive' : BTN_OFF
                                            )}>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {pick !== undefined && (
                                <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                                    <strong className={pick === c.answer ? 'text-primary' : 'text-destructive'}>
                                        {pick === c.answer ? 'ঠিক।' : `উত্তর ${c.answer}।`}
                                    </strong>{' '}
                                    {c.why}
                                </p>
                            )}
                        </div>
                    );
                })}
                <p className='font-mono text-[0.75rem] text-muted-foreground'>
                    স্কোর: {toBn(score)} / {toBn(CASES.length)}
                </p>
            </div>
        </Panel>
    );
}
