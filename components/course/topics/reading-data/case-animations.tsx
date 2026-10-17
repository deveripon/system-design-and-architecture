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
/* 1. একটা Row CASE এর ভেতর দিয়ে                                               */
/* ------------------------------------------------------------------------- */

/** The nine tours exactly as the sample database holds them. */
const TOURS = [
    { id: 7, title: 'Ratargul Swamp Boat Day', price: 3500 },
    { id: 6, title: 'Sylhet Tea Garden Tour', price: 7800 },
    { id: 2, title: "Cox's Bazar Beach Weekend", price: 8500 },
    { id: 4, title: 'Sajek Valley Cloud Trip', price: 9500 },
    { id: 1, title: 'Saint Martin Island Escape', price: 12500 },
    { id: 5, title: 'Bandarban Hill Trek', price: 14000 },
    { id: 9, title: "Cox's Bazar Family Package", price: 15500 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', price: 18000 },
    { id: 8, title: 'Saint Martin Luxury Stay', price: 32000 },
];

interface Branch {
    sql: string;
    test: (price: number) => boolean;
    result: string;
}

const ORDERS: Record<'right' | 'wrong' | 'no-else', { label: string; branches: Branch[]; note: string }> = {
    right: {
        label: 'সঠিক ক্রম',
        note: 'ছোট সীমা আগে, তাই প্রতিটা দাম ঠিক নিজের দলে পড়ে।',
        branches: [
            { sql: 'WHEN price_bdt < 8000', test: p => p < 8000, result: 'Budget' },
            { sql: 'WHEN price_bdt < 15000', test: p => p < 15000, result: 'Standard' },
            { sql: 'ELSE', test: () => true, result: 'Premium' },
        ],
    },
    wrong: {
        label: 'উল্টো ক্রম',
        note: 'প্রথম শর্তটা ৫০০০ এর বেশি সবাইকে ধরে ফেলে। দ্বিতীয় শর্ত কখনো কোনো Row এর কাছে পৌঁছায় না।',
        branches: [
            { sql: 'WHEN price_bdt >= 5000', test: p => p >= 5000, result: 'Standard' },
            { sql: 'WHEN price_bdt >= 15000', test: p => p >= 15000, result: 'Premium' },
            { sql: 'ELSE', test: () => true, result: 'Budget' },
        ],
    },
    'no-else': {
        label: 'ELSE ছাড়া',
        note: 'কোনো শর্ত সত্য না হলে আর ELSE না থাকলে উত্তর হয় NULL, Error না।',
        branches: [
            { sql: 'WHEN price_bdt < 8000', test: p => p < 8000, result: 'Budget' },
            { sql: 'WHEN price_bdt < 15000', test: p => p < 15000, result: 'Standard' },
        ],
    },
};

/**
 * Pick a tour and a way of writing the CASE, and watch the row walk the WHEN
 * branches from the top until the first true one.
 */
export function CaseFlowLab() {
    const reduce = useReducedMotion();
    const [tourId, setTourId] = useState(6);
    const [order, setOrder] = useState<keyof typeof ORDERS>('right');
    const tour = TOURS.find(t => t.id === tourId) ?? TOURS[0];
    const { branches, note } = ORDERS[order];
    const winner = branches.findIndex(b => b.test(tour.price));
    const result = winner === -1 ? 'NULL' : branches[winner].result;

    return (
        <Panel
            label='Interactive'
            title='একটা Row, CASE এর সিঁড়ি বেয়ে'
            footer='দাম আর নামগুলো Sample Database এর tours Table থেকে হুবহু নেওয়া। সব নয়টা ট্যুর আর তিন রকম লেখা একবার করে চালিয়ে দেখুন, বিশেষ করে উল্টো ক্রমে Sundarbans কোথায় পড়ে।'>
            <div className='mb-4 flex flex-wrap gap-2'>
                {(Object.keys(ORDERS) as (keyof typeof ORDERS)[]).map(key => (
                    <button
                        key={key}
                        type='button'
                        data-order={key}
                        aria-pressed={order === key}
                        onClick={() => setOrder(key)}
                        className={cn(BTN, order === key ? BTN_ON : BTN_OFF)}>
                        {ORDERS[key].label}
                    </button>
                ))}
            </div>
            <div className='mb-6 flex flex-wrap gap-2'>
                {TOURS.map(t => (
                    <button
                        key={t.id}
                        type='button'
                        data-tour={t.id}
                        aria-pressed={tourId === t.id}
                        onClick={() => setTourId(t.id)}
                        className={cn(BTN, 'font-mono', tourId === t.id ? BTN_ON : BTN_OFF)}>
                        {t.price.toFixed(2)}
                    </button>
                ))}
            </div>

            <p className='mb-4 font-mono text-[0.8125rem] text-foreground'>
                {tour.title}, price_bdt = {tour.price.toFixed(2)}
            </p>

            <ol className='space-y-2' data-result={result}>
                {branches.map((branch, i) => {
                    const state =
                        winner === -1 || i < winner ? 'false' : i === winner ? 'win' : 'skipped';
                    return (
                        <motion.li
                            key={`${order}-${branch.sql}`}
                            initial={reduce ? false : { opacity: 0, x: -6 }}
                            animate={{ opacity: state === 'skipped' ? 0.4 : 1, x: 0 }}
                            transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.08, ease: EASE }}
                            className={cn(
                                'flex flex-wrap items-center justify-between gap-3 border px-4 py-2.5 font-mono text-[0.75rem]',
                                state === 'win' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                            )}>
                            <span>
                                {branch.sql} THEN &apos;{branch.result}&apos;
                            </span>
                            <span className='text-[0.6875rem]'>
                                {state === 'win' && 'সত্য, এখানেই উত্তর'}
                                {state === 'false' && 'মিথ্যা, পরের ধাপে'}
                                {state === 'skipped' && 'দেখাই হয়নি'}
                            </span>
                        </motion.li>
                    );
                })}
            </ol>

            <div className='mt-5 flex flex-wrap items-baseline gap-3'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                    price_band
                </span>
                <span
                    className={cn(
                        'border px-3 py-1 font-mono text-sm font-bold',
                        result === 'NULL' ? 'border-border text-muted-foreground italic' : 'border-primary text-primary'
                    )}>
                    {result}
                </span>
            </div>
            <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{note}</p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. নিজের পছন্দের ক্রমে সাজানো                                                */
/* ------------------------------------------------------------------------- */

type Status = 'pending' | 'confirmed' | 'cancelled';

/** All 24 bookings of the sample database: id and status. */
const BOOKINGS: { id: number; status: Status }[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
].map(id => ({
    id,
    status: [5, 12, 18].includes(id) ? 'cancelled' : [14, 17, 20, 24].includes(id) ? 'pending' : 'confirmed',
}));

const PRESETS: { id: string; label: string; ranks: Status[] | null }[] = [
    { id: 'alphabet', label: 'CASE ছাড়া, ORDER BY status', ranks: null },
    { id: 'pending-first', label: 'pending আগে', ranks: ['pending', 'confirmed', 'cancelled'] },
    { id: 'cancelled-first', label: 'cancelled আগে', ranks: ['cancelled', 'pending', 'confirmed'] },
    { id: 'confirmed-first', label: 'confirmed আগে', ranks: ['confirmed', 'pending', 'cancelled'] },
];

/** What a plain ORDER BY status gives: text sorted letter by letter. */
const ALPHABETICAL: Status[] = ['cancelled', 'confirmed', 'pending'];

const STATUS_STYLE: Record<Status, string> = {
    pending: 'border-primary/60 text-primary',
    confirmed: 'border-border text-foreground',
    cancelled: 'border-border text-muted-foreground line-through',
};

/**
 * Alphabetical order is rarely the order a person wants. Pick a ranking and
 * see the ORDER BY CASE that produces it, and the 24 real bookings in that order.
 */
export function StatusOrderLab() {
    const [presetId, setPresetId] = useState('alphabet');
    const preset = PRESETS.find(p => p.id === presetId) ?? PRESETS[0];
    const rank = (s: Status) => (preset.ranks ?? ALPHABETICAL).indexOf(s);
    const sorted = [...BOOKINGS].sort((a, b) => rank(a.status) - rank(b.status) || a.id - b.id);

    const sql = preset.ranks
        ? `ORDER BY CASE status\n           WHEN '${preset.ranks[0]}' THEN 1\n           WHEN '${preset.ranks[1]}' THEN 2\n           ELSE 3\n         END,\n         booking_id`
        : 'ORDER BY status, booking_id';

    return (
        <Panel
            label='Interactive'
            title='ক্রমটা আপনি ঠিক করুন'
            footer='বাঁদিকের লেখাটা বাছাই করা ক্রমের ORDER BY। Row গুলো Sample Database এর ২৪টা Booking। CASE ছাড়া ক্রম হয় বর্ণমালা অনুযায়ী, cancelled এর c আগে, তাই বাতিল Booking সবার উপরে চলে আসে।'>
            <div className='mb-6 flex flex-wrap gap-2'>
                {PRESETS.map(p => (
                    <button
                        key={p.id}
                        type='button'
                        data-preset={p.id}
                        aria-pressed={presetId === p.id}
                        onClick={() => setPresetId(p.id)}
                        className={cn(BTN, presetId === p.id ? BTN_ON : BTN_OFF)}>
                        {p.label}
                    </button>
                ))}
            </div>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]'>
                <pre className='overflow-x-auto border border-border bg-background p-4 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {`SELECT booking_id, status\nFROM bookings\n${sql};`}
                </pre>
                <div>
                    <p className='mb-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                        {toBn(sorted.length)}টা Row, এই ক্রমে
                    </p>
                    <ol className='flex flex-wrap gap-1.5' data-first={sorted[0].id}>
                        {sorted.map(b => (
                            <li
                                key={b.id}
                                className={cn('border px-2 py-1 font-mono text-[0.6875rem]', STATUS_STYLE[b.status])}
                                title={b.status}>
                                {b.id} {b.status}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Panel>
    );
}
