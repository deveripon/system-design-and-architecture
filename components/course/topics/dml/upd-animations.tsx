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
const STEP_BTN =
    'px-3 py-1.5 border border-border text-[0.6875rem] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:hover:text-muted-foreground disabled:hover:border-border';

/* ------------------------------------------------------------------------- */
/* 1. একটা UPDATE ধাপে ধাপে: WHERE, SET, লেখা, ফল                                  */
/* ------------------------------------------------------------------------- */

interface TourRow {
    id: number;
    title: string;
    days: number;
    price: string;
    active: boolean;
}

// The nine tours exactly as public/sql/island-tours.sql loads them.
const TOURS: TourRow[] = [
    { id: 1, title: 'Saint Martin Island Escape', days: 3, price: '12500.00', active: true },
    { id: 2, title: "Cox's Bazar Beach Weekend", days: 2, price: '8500.00', active: true },
    { id: 3, title: 'Sundarbans Mangrove Cruise', days: 3, price: '18000.00', active: true },
    { id: 4, title: 'Sajek Valley Cloud Trip', days: 2, price: '9500.00', active: true },
    { id: 5, title: 'Bandarban Hill Trek', days: 4, price: '14000.00', active: true },
    { id: 6, title: 'Sylhet Tea Garden Tour', days: 2, price: '7800.00', active: true },
    { id: 7, title: 'Ratargul Swamp Boat Day', days: 1, price: '3500.00', active: true },
    { id: 8, title: 'Saint Martin Luxury Stay', days: 4, price: '32000.00', active: false },
    { id: 9, title: "Cox's Bazar Family Package", days: 3, price: '15500.00', active: true },
];

interface StepStatement {
    id: string;
    label: string;
    sql: string;
    column: 'price_bdt' | 'is_active';
    /** New value per matched tour id. A tour missing here did not match WHERE. */
    changes: Record<number, string>;
    tag: string;
    lesson: string;
}

// Every new value below is the output of the same statement run on a fresh
// copy of tours in PostgreSQL 18 (the query boxes of this lesson).
const STATEMENTS: StepStatement[] = [
    {
        id: 'raise',
        label: '৩ দিন বা বেশি: ১০% বাড়াও',
        sql: 'UPDATE upd_tours\nSET price_bdt = round(price_bdt * 1.10, -2)\nWHERE duration_days >= 3;',
        column: 'price_bdt',
        changes: { 1: '13800.00', 3: '19800.00', 5: '15400.00', 8: '35200.00', 9: '17100.00' },
        tag: 'UPDATE 5',
        lesson: 'পাঁচটা Row শর্ত মানল, পাঁচটাই বদলাল। বাকি চারটা Row এর দিকে PostgreSQL ফিরেও তাকায়নি, ওদের পুরনো Version ই থাকল।',
    },
    {
        id: 'same',
        label: 'যা আছে তাই আবার লেখা',
        sql: 'UPDATE upd_tours\nSET is_active = true\nWHERE tour_id IN (7, 8);',
        column: 'is_active',
        changes: { 7: 'true', 8: 'true' },
        tag: 'UPDATE 2',
        lesson: '৭ নম্বর আগে থেকেই true, তবু গোনায় এসেছে, আর তার নতুন Version ও লেখা হয়েছে। PostgreSQL এর গোনা মানে শর্ত মানা Row, মান বদলাক বা না বদলাক।',
    },
    {
        id: 'none',
        label: 'কোনো Row মেলে না',
        sql: 'UPDATE upd_tours\nSET price_bdt = 0\nWHERE duration_days = 5;',
        column: 'price_bdt',
        changes: {},
        tag: 'UPDATE 0',
        lesson: 'পাঁচ দিনের কোনো ট্যুর নেই, তাই কিছুই বদলায়নি। এটা Error না, শুধু UPDATE 0। App এর কোডকেই এই শূন্য দেখে বুঝতে হবে যে কিছু হয়নি।',
    },
    {
        id: 'case',
        label: 'ELSE ছাড়া CASE, WHERE ছাড়া',
        sql: 'UPDATE upd_tours\nSET price_bdt = CASE\n  WHEN duration_days = 1  THEN price_bdt + 500\n  WHEN duration_days >= 4 THEN round(price_bdt * 0.95, 2)\nEND;',
        column: 'price_bdt',
        changes: {
            1: 'NULL',
            2: 'NULL',
            3: 'NULL',
            4: 'NULL',
            5: '13300.00',
            6: 'NULL',
            7: '4000.00',
            8: '30400.00',
            9: 'NULL',
        },
        tag: 'UPDATE 9',
        lesson: 'WHERE নেই, তাই নয়টা Row ই বদলাল। কোনো WHEN না মিললে CASE দেয় NULL, তাই ছয়টা ট্যুরের দাম মুছে গেল। ELSE price_bdt দিন, অথবা WHERE দিয়ে শুধু দরকারি Row বেছে নিন।',
    },
];

const STEPS = [
    { title: 'শুরু', sub: 'Table যেমন আছে' },
    { title: 'WHERE', sub: 'কোন Row গুলো মিলল' },
    { title: 'SET', sub: 'পুরনো মান থেকে নতুন মান' },
    { title: 'লেখা', sub: 'প্রতিটা মিলে যাওয়া Row এর নতুন Version' },
    { title: 'ফল', sub: 'psql যা দেখায়' },
];

function shownValue(row: TourRow, column: StepStatement['column']) {
    return column === 'price_bdt' ? row.price : String(row.active);
}

/**
 * Walk one UPDATE over the real tours rows: which rows WHERE picks, the new
 * value SET computes from the old one, the new row versions, and the command
 * tag psql prints at the end.
 */
export function UpdateStepLab() {
    const reduce = useReducedMotion() ?? false;
    const [id, setId] = useState(STATEMENTS[0].id);
    const [step, setStep] = useState(0);
    const statement = STATEMENTS.find(s => s.id === id) ?? STATEMENTS[0];
    const matched = TOURS.filter(t => t.id in statement.changes).length;

    const choose = (next: string) => {
        setId(next);
        setStep(0);
    };

    return (
        <Panel
            label='Lab'
            title='একটা UPDATE, ধাপে ধাপে'
            footer={
                <>
                    চারটা Statement এর প্রতিটা নতুন মান এই লেসনের Query Box এর মতো tours এর একটা কপিতে PostgreSQL 18 এ চালিয়ে পাওয়া। আসল
                    PostgreSQL এক Row করে কাজ করে, এখানে প্রতিটা ধাপ সব Row এর উপর একসাথে দেখানো হয়েছে যাতে চোখে পড়ে কোন Row কী পেল।
                </>
            }>
            <div className='space-y-6'>
                <div className='flex flex-wrap gap-2'>
                    {STATEMENTS.map(s => (
                        <button key={s.id} type='button' onClick={() => choose(s.id)} className={cn(BTN, s.id === id ? BTN_ON : BTN_OFF)}>
                            {s.label}
                        </button>
                    ))}
                </div>

                <pre className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {statement.sql}
                </pre>

                <div className='flex flex-wrap items-center gap-2'>
                    {STEPS.map((s, i) => (
                        <button
                            key={s.title}
                            type='button'
                            onClick={() => setStep(i)}
                            className={cn(
                                'border px-2.5 py-1 font-mono text-[0.6875rem] transition-colors',
                                i === step ? 'border-primary bg-primary/10 text-primary' : i < step ? 'border-primary/40 text-foreground' : 'border-border text-muted-foreground'
                            )}>
                            {toBn(i + 1)}. {s.title}
                        </button>
                    ))}
                </div>
                <p className='text-sm text-muted-foreground'>{STEPS[step].sub}</p>

                <div className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className='px-3 py-2 font-bold'>tour_id</th>
                                <th className='px-3 py-2 font-bold'>title</th>
                                <th className='px-3 py-2 font-bold'>duration_days</th>
                                <th className='px-3 py-2 font-bold'>{statement.column}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOURS.map(row => {
                                const hit = row.id in statement.changes;
                                const old = shownValue(row, statement.column);
                                const next = statement.changes[row.id];
                                const dim = step >= 1 && !hit;
                                return (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            'border-t border-border/60 transition-colors duration-300',
                                            step >= 1 && hit && 'bg-primary/5',
                                            dim && 'text-muted-foreground/60'
                                        )}>
                                        <td className='px-3 py-1.5'>{row.id}</td>
                                        <td className='px-3 py-1.5 whitespace-nowrap'>{row.title}</td>
                                        <td className='px-3 py-1.5'>{row.days}</td>
                                        <td className='px-3 py-1.5 whitespace-nowrap'>
                                            {step >= 2 && hit ? (
                                                <span className='inline-flex items-center gap-2'>
                                                    <span className={cn(step >= 3 && 'line-through opacity-50')}>{old}</span>
                                                    <span className='text-muted-foreground'>→</span>
                                                    <motion.span
                                                        initial={reduce ? false : { opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.35, ease: EASE }}
                                                        className={cn('font-bold', next === 'NULL' ? 'text-destructive' : 'text-primary')}>
                                                        {next}
                                                    </motion.span>
                                                    {step >= 3 && <span className='text-[0.625rem] text-primary'>নতুন Version</span>}
                                                </span>
                                            ) : (
                                                old
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {step >= 1 && (
                    <p className='font-mono text-[0.75rem] text-muted-foreground'>
                        WHERE এ মিলল {toBn(matched)}টা Row, বাদ গেল {toBn(TOURS.length - matched)}টা
                    </p>
                )}

                {step === 4 && (
                    <div className='space-y-2 border border-primary/50 bg-primary/5 px-4 py-3'>
                        <p className='font-mono text-sm font-bold text-primary'>{statement.tag}</p>
                        <p className='text-sm text-foreground'>{statement.lesson}</p>
                    </div>
                )}

                <div className='flex gap-2'>
                    <button type='button' className={STEP_BTN} disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>
                        আগের ধাপ
                    </button>
                    <button
                        type='button'
                        className={STEP_BTN}
                        disabled={step === STEPS.length - 1}
                        onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}>
                        পরের ধাপ
                    </button>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. UPDATE ... FROM: প্রতিটা Row এর জোড়া                                         */
/* ------------------------------------------------------------------------- */

interface FromTarget {
    key: string;
    target: string;
    partners: string[];
    before: string;
    after: string;
    /** 'one' updated, 'none' untouched, 'many' updated from an unpredictable partner. */
    kind: 'one' | 'none' | 'many';
}

interface FromCase {
    id: string;
    label: string;
    sql: string;
    rows: FromTarget[];
    orphans?: string[];
    tag: string;
    note: string;
}

// From the lesson's query boxes, run in PostgreSQL 18. For the "many" case the
// value that landed is deliberately not shown: it is one of the partners, and
// which one is not guaranteed.
const FROM_CASES: FromCase[] = [
    {
        id: 'destinations',
        label: 'destinations দেখে দাম',
        sql: "UPDATE upd_tours t\nSET price_bdt = round(t.price_bdt * 1.10, 2)\nFROM destinations d\nWHERE d.destination_id = t.destination_id\n  AND d.region = 'Chattogram';",
        rows: [
            { key: '1', target: 'tour 1 · Saint Martin Island Escape', partners: ["Saint Martin's Island · Chattogram"], before: '12500.00', after: '13750.00', kind: 'one' },
            { key: '2', target: "tour 2 · Cox's Bazar Beach Weekend", partners: ["Cox's Bazar · Chattogram"], before: '8500.00', after: '9350.00', kind: 'one' },
            { key: '3', target: 'tour 3 · Sundarbans Mangrove Cruise', partners: [], before: '18000.00', after: '18000.00', kind: 'none' },
            { key: '4', target: 'tour 4 · Sajek Valley Cloud Trip', partners: ['Sajek Valley · Chattogram'], before: '9500.00', after: '10450.00', kind: 'one' },
            { key: '5', target: 'tour 5 · Bandarban Hill Trek', partners: ['Bandarban · Chattogram'], before: '14000.00', after: '15400.00', kind: 'one' },
            { key: '6', target: 'tour 6 · Sylhet Tea Garden Tour', partners: [], before: '7800.00', after: '7800.00', kind: 'none' },
            { key: '7', target: 'tour 7 · Ratargul Swamp Boat Day', partners: [], before: '3500.00', after: '3500.00', kind: 'none' },
            { key: '8', target: 'tour 8 · Saint Martin Luxury Stay', partners: ["Saint Martin's Island · Chattogram"], before: '32000.00', after: '35200.00', kind: 'one' },
            { key: '9', target: "tour 9 · Cox's Bazar Family Package", partners: ["Cox's Bazar · Chattogram"], before: '15500.00', after: '17050.00', kind: 'one' },
        ],
        tag: 'UPDATE 6',
        note: 'প্রতিটা ট্যুরের destination একটাই, তাই জোড়া হয় একটা, নয়তো শূন্য। Chattogram এর বাইরের তিনটা ট্যুর জোড়া পায়নি, তাই চুপচাপ যেমন ছিল তেমন।',
    },
    {
        id: 'values',
        label: 'VALUES তালিকা থেকে নতুন দাম',
        sql: 'UPDATE upd_tours AS t\nSET price_bdt = v.new_price\nFROM (VALUES (1, 13000.00), (4, 9900.00), (42, 5000.00))\n     AS v(tour_id, new_price)\nWHERE t.tour_id = v.tour_id;',
        rows: [
            { key: '1', target: 'tour 1 · Saint Martin Island Escape', partners: ['(1, 13000.00)'], before: '12500.00', after: '13000.00', kind: 'one' },
            { key: '4', target: 'tour 4 · Sajek Valley Cloud Trip', partners: ['(4, 9900.00)'], before: '9500.00', after: '9900.00', kind: 'one' },
            { key: 'rest', target: 'বাকি সাতটা ট্যুর', partners: [], before: 'আগের দাম', after: 'আগের দাম', kind: 'none' },
        ],
        orphans: ['(42, 5000.00): 42 নম্বর ট্যুর নেই, এই Row টা কারো জোড়া হয়নি, কোনো Error ও আসেনি'],
        tag: 'UPDATE 2',
        note: 'App থেকে একসাথে অনেক Row এ আলাদা আলাদা মান বসানোর সবচেয়ে পরিষ্কার উপায়। শুধু মনে রাখবেন, ভুল id চুপচাপ বাদ পড়ে। গোনা 2 দেখে বুঝতে হবে তিনটার একটা মেলেনি।',
    },
    {
        id: 'many',
        label: 'bookings থেকে, একাধিক জোড়া',
        sql: 'UPDATE upd_customers c\nSET last_total = b.total_bdt\nFROM bookings b\nWHERE b.customer_id = c.customer_id;',
        rows: [
            {
                key: '1',
                target: 'customer 1 · Rahim Uddin',
                partners: ['booking 1 · 25000.00', 'booking 8 · 19000.00', 'booking 17 · 36000.00'],
                before: 'NULL',
                after: 'তিনটার যেকোনো একটা',
                kind: 'many',
            },
            {
                key: '2',
                target: 'customer 2 · Nusrat Jahan',
                partners: ['booking 2 · 50000.00', 'booking 13 · 25000.00'],
                before: 'NULL',
                after: 'দুটোর যেকোনো একটা',
                kind: 'many',
            },
            {
                key: '13',
                target: 'customer 13 · Shuvo Das',
                partners: ['booking 15 · 25500.00', 'booking 24 · 15600.00'],
                before: 'NULL',
                after: 'দুটোর যেকোনো একটা',
                kind: 'many',
            },
            { key: '15', target: 'customer 15 · Imran Kabir', partners: [], before: 'NULL', after: 'NULL', kind: 'none' },
        ],
        tag: 'UPDATE 14',
        note: '২৪টা জোড়া, কিন্তু Customer ১৪ জন, তাই UPDATE 14। কোনো Error নেই, কোনো Warning নেই। একেকজন Customer যেকোনো এক জোড়ার মান পেয়েছেন, PostgreSQL এর Documentation বলে কোনটা পাবেন তা আগে থেকে বলা যায় না।',
    },
    {
        id: 'fixed',
        label: 'আগে প্রতি Customer এ একটা Row',
        sql: 'UPDATE upd_customers c\nSET last_total = x.total_bdt\nFROM (SELECT DISTINCT ON (customer_id) customer_id, total_bdt\n      FROM bookings\n      ORDER BY customer_id, booked_at DESC) AS x\nWHERE x.customer_id = c.customer_id;',
        rows: [
            { key: '1', target: 'customer 1 · Rahim Uddin', partners: ['booking 17 · 36000.00 (সবশেষ)'], before: 'NULL', after: '36000.00', kind: 'one' },
            { key: '2', target: 'customer 2 · Nusrat Jahan', partners: ['booking 13 · 25000.00 (সবশেষ)'], before: 'NULL', after: '25000.00', kind: 'one' },
            { key: '13', target: 'customer 13 · Shuvo Das', partners: ['booking 24 · 15600.00 (সবশেষ)'], before: 'NULL', after: '15600.00', kind: 'one' },
            { key: '15', target: 'customer 15 · Imran Kabir', partners: [], before: 'NULL', after: 'NULL', kind: 'none' },
        ],
        tag: 'UPDATE 14',
        note: 'DISTINCT ON প্রতিটা Customer এর শুধু সবশেষ Booking রাখে, তাই প্রতিটা Row এর জোড়া একটাই, আর ফল প্রতিবার একই। Imran Kabir এর কোনো Booking নেই, তাঁর last_total NULL ই থাকল।',
    },
];

function KindBadge({ kind }: { kind: FromTarget['kind'] }) {
    const label = kind === 'one' ? 'বদলাল' : kind === 'none' ? 'ছোঁয়া হয়নি' : 'অনিশ্চিত';
    return (
        <span
            className={cn(
                'border px-2 py-0.5 font-mono text-[0.625rem] font-bold',
                kind === 'one' && 'border-primary/60 text-primary',
                kind === 'none' && 'border-border text-muted-foreground',
                kind === 'many' && 'border-destructive/60 text-destructive'
            )}>
            {label}
        </span>
    );
}

/**
 * Pick what UPDATE ... FROM joins to and see, row by row, how many partner
 * rows each target found and what that did to it.
 */
export function UpdateFromLab() {
    const reduce = useReducedMotion() ?? false;
    const [id, setId] = useState(FROM_CASES[0].id);
    const current = FROM_CASES.find(c => c.id === id) ?? FROM_CASES[0];

    return (
        <Panel
            label='Lab'
            title='UPDATE ... FROM: কে কয়টা জোড়া পেল'
            footer={
                <>
                    প্রতিটা ফল এই লেসনের Query Box এর Statement থেকে, PostgreSQL 18 এ চালানো। একাধিক জোড়ার ক্ষেত্রে কোন মান বসেছে সেটা ইচ্ছা করে
                    দেখানো হয়নি: আপনার স্ক্রিনে যেটাই আসুক, সেটা নিশ্চিত না, পরের বার বা অন্য Server এ আলাদা হতে পারে।
                </>
            }>
            <div className='space-y-6'>
                <div className='flex flex-wrap gap-2'>
                    {FROM_CASES.map(c => (
                        <button key={c.id} type='button' onClick={() => setId(c.id)} className={cn(BTN, c.id === id ? BTN_ON : BTN_OFF)}>
                            {c.label}
                        </button>
                    ))}
                </div>
                <pre className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {current.sql}
                </pre>
                <div className='space-y-2'>
                    {current.rows.map((row, i) => (
                        <motion.div
                            key={`${current.id}-${row.key}`}
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.05, ease: EASE }}
                            className={cn(
                                'grid gap-3 border px-4 py-3 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,13rem)] md:items-center',
                                row.kind === 'many' ? 'border-destructive/40' : row.kind === 'one' ? 'border-primary/40' : 'border-border'
                            )}>
                            <p className='font-mono text-[0.75rem] text-foreground'>{row.target}</p>
                            <div className='flex flex-wrap gap-1.5'>
                                {row.partners.length === 0 ? (
                                    <span className='font-mono text-[0.6875rem] text-muted-foreground'>কোনো জোড়া নেই</span>
                                ) : (
                                    row.partners.map(p => (
                                        <span key={p} className='border border-border bg-muted/40 px-2 py-0.5 font-mono text-[0.6875rem] text-foreground'>
                                            {p}
                                        </span>
                                    ))
                                )}
                            </div>
                            <div className='flex flex-wrap items-center gap-2'>
                                <KindBadge kind={row.kind} />
                                <span className='font-mono text-[0.6875rem] text-muted-foreground'>
                                    {row.before} → {row.after}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    {current.orphans?.map(o => (
                        <p key={o} className='border border-dashed border-border px-4 py-2 font-mono text-[0.6875rem] text-muted-foreground'>
                            {o}
                        </p>
                    ))}
                </div>
                <div className='space-y-2 border border-primary/50 bg-primary/5 px-4 py-3'>
                    <p className='font-mono text-sm font-bold text-primary'>{current.tag}</p>
                    <p className='text-sm text-foreground'>{current.note}</p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একই আসনে দুজন: Lost Update বনাম SQL এর ভেতরে হিসাব                           */
/* ------------------------------------------------------------------------- */

interface SeatStep {
    who: 'A' | 'B' | 'none';
    sql: string;
    reply: string;
    /** The committed value other sessions would read after this step. */
    committed: number;
    /** A value only the writing session can see yet. */
    pending?: number;
    lockedBy?: 'A';
    waiting?: boolean;
    note: string;
}

// Departure 15 (Ratargul Swamp Boat Day) starts with 12 seats left. Staff A
// books 2, staff B books 3. Both sequences were run with two psql sessions on
// PostgreSQL 18; in the second, B's UPDATE waited until A committed.
const SEAT_MODES: Record<'app' | 'sql', { label: string; steps: SeatStep[] }> = {
    app: {
        label: 'App পড়ে, App হিসাব করে লেখে',
        steps: [
            { who: 'none', sql: '', reply: '', committed: 12, note: 'Departure 15 এ ১২টা আসন খালি। A দুটো আর B তিনটা আসন বেচবেন, প্রায় একই মুহূর্তে।' },
            {
                who: 'A',
                sql: 'SELECT seats_left FROM departures WHERE departure_id = 15;',
                reply: '12',
                committed: 12,
                note: 'A এর App 12 পড়ল আর মনে রাখল: 12 থেকে 2 গেলে 10।',
            },
            {
                who: 'B',
                sql: 'SELECT seats_left FROM departures WHERE departure_id = 15;',
                reply: '12',
                committed: 12,
                note: 'B এর App ও 12 পড়ল, কারণ A এখনো কিছু লেখেনি। B এর হিসাব: 12 থেকে 3 গেলে 9।',
            },
            {
                who: 'A',
                sql: 'UPDATE departures SET seats_left = 10 WHERE departure_id = 15;',
                reply: 'UPDATE 1',
                committed: 10,
                note: 'A নিজের হিসাবের ফল লিখল: 10।',
            },
            {
                who: 'B',
                sql: 'UPDATE departures SET seats_left = 9 WHERE departure_id = 15;',
                reply: 'UPDATE 1',
                committed: 9,
                note: 'B তার পুরনো হিসাব লিখল: 9। A এর লেখা 10 এর উপর চাপা পড়ল। ৫টা আসন বিক্রি, অথচ খাতায় কমেছে মাত্র ৩টা।',
            },
        ],
    },
    sql: {
        label: 'হিসাবটা SQL এর ভেতরে',
        steps: [
            { who: 'none', sql: '', reply: '', committed: 12, note: 'একই শুরু: ১২টা আসন, A দুটো, B তিনটা।' },
            {
                who: 'A',
                sql: 'BEGIN;\nUPDATE departures SET seats_left = seats_left - 2\nWHERE departure_id = 15 RETURNING seats_left;',
                reply: '10',
                committed: 12,
                pending: 10,
                lockedBy: 'A',
                note: 'A এর Transaction এ মান এখন 10, কিন্তু COMMIT হয়নি, তাই বাকিরা এখনো 12 দেখে। Row টায় A এর Lock বসল।',
            },
            {
                who: 'B',
                sql: 'UPDATE departures SET seats_left = seats_left - 3\nWHERE departure_id = 15 RETURNING seats_left;',
                reply: 'অপেক্ষা করছে...',
                committed: 12,
                pending: 10,
                lockedBy: 'A',
                waiting: true,
                note: 'B একই Row বদলাতে চাইল। A এর Lock আছে, তাই B এর UPDATE থেমে অপেক্ষা করছে, কোনো Error ছাড়াই।',
            },
            {
                who: 'A',
                sql: 'COMMIT;',
                reply: 'COMMIT',
                committed: 7,
                note: 'A এর COMMIT এ 10 পাকা হলো, Lock ছাড়ল। B সাথে সাথে জেগে উঠে নতুন 10 থেকে 3 কমাল, তার RETURNING দেখাল 7। লেখার সময় দ্বিতীয় Session অপেক্ষা করেছিল প্রায় তিন সেকেন্ড, যতক্ষণ A খোলা ছিল।',
            },
        ],
    },
};

/**
 * Two staff members sell seats on the same departure at the same time. Step
 * through the version where the app does the arithmetic (one booking is lost)
 * and the version where UPDATE does it (the second waits, nothing is lost).
 */
export function ConcurrentSeatsLab() {
    const [mode, setMode] = useState<'app' | 'sql'>('app');
    const [step, setStep] = useState(0);
    const steps = SEAT_MODES[mode].steps;
    const current = steps[step];
    const finished = step === steps.length - 1;

    const choose = (next: 'app' | 'sql') => {
        setMode(next);
        setStep(0);
    };

    const log = (who: 'A' | 'B') =>
        steps.slice(1, step + 1).filter(s => s.who === who);

    return (
        <Panel
            label='Lab'
            title='একই আসনে একসাথে দুজন'
            footer={
                <>
                    দুটো ধারাই postgres:18 Container এ দুটো আলাদা psql Session খুলে চালানো। ডান দিকের ধারায় B এর UPDATE সত্যিই আটকে ছিল যতক্ষণ A
                    এর Transaction খোলা ছিল। এই Lock আর অপেক্ষার নিয়ম Module 12 এর বিষয়, এখানে শুধু এটুকু দেখুন: হিসাবটা SQL এ রাখলে কেউ হারায় না।
                </>
            }>
            <div className='space-y-6'>
                <div className='flex flex-wrap gap-2'>
                    {(['app', 'sql'] as const).map(m => (
                        <button key={m} type='button' onClick={() => choose(m)} className={cn(BTN, m === mode ? BTN_ON : BTN_OFF)}>
                            {SEAT_MODES[m].label}
                        </button>
                    ))}
                </div>

                <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_minmax(0,1fr)]'>
                    {(['A', 'B'] as const).map((who, col) => (
                        <div key={who} className={cn('space-y-2 border border-border p-3', col === 1 && 'md:order-3')}>
                            <p className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground'>
                                কর্মী {who} · {who === 'A' ? '২ আসন' : '৩ আসন'}
                            </p>
                            {log(who).length === 0 && <p className='text-[0.75rem] text-muted-foreground'>এখনো কিছু চালাননি</p>}
                            {log(who).map(s => (
                                <div key={s.sql} className='space-y-1'>
                                    <pre className='overflow-x-auto whitespace-pre-wrap bg-muted/30 px-2 py-1.5 font-mono text-[0.6875rem] text-foreground'>
                                        {s.sql}
                                    </pre>
                                    <p className={cn('font-mono text-[0.6875rem]', s.waiting && s === current ? 'text-destructive' : 'text-primary')}>
                                        {s.waiting && s !== current ? 'অপেক্ষা শেষ: 7' : s.reply}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className='flex flex-col items-center justify-center gap-2 border border-primary/40 p-4 md:order-2'>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>departure 15</p>
                        <p className='font-mono text-[0.6875rem] text-muted-foreground'>seats_left (COMMIT হওয়া)</p>
                        <p className='font-mono text-3xl font-bold text-primary transition-all duration-300'>{current.committed}</p>
                        {current.pending !== undefined && (
                            <p className='font-mono text-[0.6875rem] text-muted-foreground'>A এর চোখে: {current.pending}</p>
                        )}
                        {current.lockedBy && (
                            <p className='border border-border px-2 py-0.5 font-mono text-[0.625rem] text-foreground'>Row Lock: {current.lockedBy}</p>
                        )}
                    </div>
                </div>

                <p className='text-sm text-foreground'>{current.note}</p>

                {finished && (
                    <div
                        className={cn(
                            'border px-4 py-3 text-sm font-bold',
                            mode === 'app' ? 'border-destructive/60 bg-destructive/5 text-destructive' : 'border-primary/60 bg-primary/5 text-primary'
                        )}>
                        {mode === 'app'
                            ? 'শেষে 9, হওয়ার কথা 7। একটা Booking এর আসন খাতা থেকে হারিয়ে গেল: Lost Update।'
                            : 'শেষে 7, ঠিক যতটা হওয়ার কথা। দুটো Booking ই খাতায় উঠল।'}
                    </div>
                )}

                <div className='flex gap-2'>
                    <button type='button' className={STEP_BTN} disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>
                        আগের ধাপ
                    </button>
                    <button type='button' className={STEP_BTN} disabled={finished} onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}>
                        পরের ধাপ
                    </button>
                </div>
            </div>
        </Panel>
    );
}
