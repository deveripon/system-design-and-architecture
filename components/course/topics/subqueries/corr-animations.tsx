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
/* Real rows from the sample database                                        */
/* ------------------------------------------------------------------------- */

const CUSTOMERS: { id: number; name: string }[] = [
    { id: 1, name: 'Rahim Uddin' },
    { id: 2, name: 'Nusrat Jahan' },
    { id: 3, name: 'Tanvir Ahmed' },
    { id: 4, name: 'Farhana Akter' },
    { id: 5, name: 'Sabbir Hossain' },
    { id: 6, name: 'Mitu Rahman' },
    { id: 7, name: 'Arif Chowdhury' },
    { id: 8, name: 'Sumaiya Islam' },
    { id: 9, name: 'Priya Sharma' },
    { id: 10, name: 'Aiman Zulkifli' },
    { id: 11, name: 'Oliver Bennett' },
    { id: 12, name: 'Kamal Hasan' },
    { id: 13, name: 'Shuvo Das' },
    { id: 14, name: 'Lamia Haque' },
    { id: 15, name: 'Imran Kabir' },
];

/** All 24 bookings: id, customer, total in whole taka, booked_at as the box prints it. */
const BOOKINGS: { id: number; customer: number; total: number; at: string }[] = [
    { id: 1, customer: 1, total: 25000, at: '2025-12-20 10:15:00+06' },
    { id: 2, customer: 2, total: 50000, at: '2025-12-28 20:02:00+06' },
    { id: 3, customer: 3, total: 12500, at: '2026-01-10 09:30:00+06' },
    { id: 4, customer: 4, total: 25500, at: '2026-01-05 18:45:00+06' },
    { id: 5, customer: 5, total: 17000, at: '2026-01-06 12:10:00+06' },
    { id: 6, customer: 6, total: 36000, at: '2026-01-25 22:40:00+06' },
    { id: 7, customer: 7, total: 18000, at: '2026-01-28 08:05:00+06' },
    { id: 8, customer: 1, total: 19000, at: '2026-02-20 11:20:00+06' },
    { id: 9, customer: 8, total: 28000, at: '2026-03-01 16:35:00+06' },
    { id: 10, customer: 9, total: 14000, at: '2026-03-02 14:00:00+06' },
    { id: 11, customer: 10, total: 15600, at: '2026-03-25 07:50:00+06' },
    { id: 12, customer: 11, total: 25000, at: '2026-01-30 15:30:00+06' },
    { id: 13, customer: 2, total: 25000, at: '2026-09-15 21:10:00+06' },
    { id: 14, customer: 12, total: 50000, at: '2026-10-01 12:25:00+06' },
    { id: 15, customer: 13, total: 25500, at: '2026-09-20 19:45:00+06' },
    { id: 16, customer: 14, total: 36000, at: '2026-10-02 10:05:00+06' },
    { id: 17, customer: 1, total: 36000, at: '2026-10-08 09:15:00+06' },
    { id: 18, customer: 6, total: 9500, at: '2026-09-28 23:30:00+06' },
    { id: 19, customer: 11, total: 28000, at: '2026-10-04 13:40:00+06' },
    { id: 20, customer: 9, total: 15600, at: '2026-10-10 17:20:00+06' },
    { id: 21, customer: 4, total: 10500, at: '2026-10-11 18:00:00+06' },
    { id: 22, customer: 3, total: 12500, at: '2026-10-12 08:30:00+06' },
    { id: 23, customer: 8, total: 42500, at: '2026-10-13 20:55:00+06' },
    { id: 24, customer: 13, total: 15600, at: '2026-10-14 11:05:00+06' },
];

const bookingsOf = (id: number) => BOOKINGS.filter(b => b.customer === id);

/* ------------------------------------------------------------------------- */
/* 1. Watch a correlated subquery run, one outer row at a time               */
/* ------------------------------------------------------------------------- */

type StepMode = 'count' | 'latest' | 'above';

const STEP_MODES: { key: StepMode; label: string; sql: string }[] = [
    {
        key: 'count',
        label: 'Booking কয়টা (SELECT এ)',
        sql: `SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c;`,
    },
    {
        key: 'latest',
        label: 'শেষ Booking কবে (SELECT এ)',
        sql: `SELECT c.full_name,
       (SELECT max(b.booked_at) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS last_booked
FROM customers c;`,
    },
    {
        key: 'above',
        label: 'নিজের গড়ের উপরে (WHERE এ)',
        sql: `SELECT b.booking_id, b.customer_id, b.total_bdt
FROM bookings b
WHERE b.total_bdt > (SELECT avg(b2.total_bdt) FROM bookings b2
                     WHERE b2.customer_id = b.customer_id);`,
    },
];

interface StepResult {
    /** What the outer row is, shown on the left. */
    outer: string;
    /** The inner query with the outer value filled in. */
    inner: string;
    /** The single value the inner query returned. */
    value: string;
    /** The output row it produces, or null when the row is dropped. */
    output: string | null;
}

/** The two-decimal average a customer's bookings would print, and whether total beats it. */
function ownAverage(customer: number): { sum: number; n: number; text: string } {
    const mine = bookingsOf(customer);
    const sum = mine.reduce((s, b) => s + b.total, 0);
    return { sum, n: mine.length, text: (sum / mine.length).toFixed(2) };
}

function stepsFor(mode: StepMode): StepResult[] {
    if (mode === 'above') {
        return BOOKINGS.map((b): StepResult => {
            const avg = ownAverage(b.customer);
            // total > sum / n, compared without fractions so 26666.67 never rounds wrong
            const above = b.total * avg.n > avg.sum;
            return {
                outer: `booking ${b.id}, customer ${b.customer}, ${b.total}.00`,
                inner: `SELECT avg(b2.total_bdt) FROM bookings b2\nWHERE b2.customer_id = ${b.customer}`,
                value: avg.text,
                output: above ? `${b.id} | ${b.customer} | ${b.total}.00` : null,
            };
        });
    }
    return CUSTOMERS.map((c): StepResult => {
        const mine = bookingsOf(c.id);
        if (mode === 'count') {
            return {
                outer: `customer ${c.id}, ${c.name}`,
                inner: `SELECT count(*) FROM bookings b\nWHERE b.customer_id = ${c.id}`,
                value: String(mine.length),
                output: `${c.name} | ${mine.length}`,
            };
        }
        const latest = mine.map(b => b.at).sort().at(-1) ?? null;
        return {
            outer: `customer ${c.id}, ${c.name}`,
            inner: `SELECT max(b.booked_at) FROM bookings b\nWHERE b.customer_id = ${c.id}`,
            value: latest ?? 'NULL',
            output: `${c.name} | ${latest ?? 'NULL'}`,
        };
    });
}

/**
 * The per-row model, stepped through on the real data. Each click takes one
 * outer row, fills its value into the inner query, shows what the inner query
 * returned and what lands in the result. The final counts match the boxes:
 * 15 rows for the two SELECT modes, 8 bookings above their own average.
 */
export function CorrelatedStepLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<StepMode>('count');
    const [step, setStep] = useState(0);

    const steps = stepsFor(mode);
    const total = steps.length;
    const current = step > 0 ? steps[step - 1] : null;
    const output = steps.slice(0, step).flatMap(s => (s.output ? [s.output] : []));
    const finished = step === total;
    const sql = STEP_MODES.find(m => m.key === mode)!.sql;

    const choose = (m: StepMode) => {
        setMode(m);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='Correlated Subquery চলছে, বাইরের একটা Row করে'
            footer='Data আসল: customers এর ১৫ জন আর bookings এর ২৪টা Row, যেমন Sample Database এ আছে। প্রতিটা ধাপে বাইরের একটা Row নেওয়া হয়, তার নম্বর ভেতরের Query তে বসে, ভেতরের Query একটা মান দেয়। গড় এখানে দুই দশমিকে দেখানো হয়েছে, PostgreSQL আরও অঙ্ক রাখে। এটা বোঝার মডেল, Database আসলে কীভাবে চালায় সেটা এই লেসনের "How Fast Is It" অংশে।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {STEP_MODES.map(m => (
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
                    onClick={() => setStep(s => Math.min(total, s + 1))}
                    className={cn(BTN, finished ? 'border-border text-muted-foreground/50' : BTN_ON)}>
                    পরের Row
                </button>
                <button
                    type='button'
                    data-action='all'
                    onClick={() => setStep(total)}
                    className={cn(BTN, BTN_OFF)}>
                    সবগুলো একবারে
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setStep(0)}
                    className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-step={step}>
                    {toBn(step)} / {toBn(total)}টা বাইরের Row দেখা হয়েছে
                </span>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                    <div>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                            ১. বাইরের Row
                        </p>
                        <div className='border border-border bg-background px-4 py-3 font-mono text-[0.75rem] min-h-[2.75rem]'>
                            {current ? current.outer : <span className='text-muted-foreground'>পরের Row চাপুন</span>}
                        </div>
                    </div>
                    <div>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                            ২. ভেতরের Query, নম্বর বসিয়ে
                        </p>
                        {current ? (
                            <motion.pre
                                key={`${mode}-${step}`}
                                initial={reduce ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className='overflow-x-auto border border-primary/50 bg-primary/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                                {current.inner}
                            </motion.pre>
                        ) : (
                            <div className='border border-border bg-background px-4 py-3 font-mono text-[0.75rem] text-muted-foreground min-h-[3.5rem]'>
                                এখনো কিছু চলেনি
                            </div>
                        )}
                    </div>
                    <div>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                            ৩. ভেতরের উত্তর, আর তার ফল
                        </p>
                        <div
                            className='border border-border bg-background px-4 py-3 text-sm leading-relaxed min-h-[3rem]'
                            data-verdict={current ? (current.output ? 'kept' : 'dropped') : 'none'}>
                            {current ? (
                                <>
                                    <span className='font-mono font-bold text-primary'>{current.value}</span>
                                    {mode === 'above' ? (
                                        current.output ? (
                                            <span>: Booking এর মোট এই গড়ের চেয়ে বেশি, তাই রাখা হলো।</span>
                                        ) : (
                                            <span className='text-muted-foreground'>
                                                : Booking এর মোট গড়ের চেয়ে বেশি না, তাই বাদ।
                                            </span>
                                        )
                                    ) : (
                                        <span>: এই মানটা ফলাফলের নতুন Column এ বসল।</span>
                                    )}
                                </>
                            ) : (
                                <span className='text-muted-foreground'>প্রতিটা Row এর জন্য ভেতরের Query একটাই মান দেয়।</span>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        ফলাফল:{' '}
                        <span className='text-primary font-bold' data-output-count={output.length}>
                            {toBn(output.length)}টা Row
                        </span>
                    </p>
                    <div className='max-h-80 overflow-y-auto border border-border'>
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
/* 2. Whose column is it: four inner WHERE clauses and what they really do   */
/* ------------------------------------------------------------------------- */

interface ScopeCase {
    key: string;
    label: string;
    sql: string;
    bindings: { name: string; table: string; outer: boolean }[];
    correlated: boolean;
    result: string;
    verdict: 'right' | 'wrong' | 'error';
    why: string;
}

const SCOPE_CASES: ScopeCase[] = [
    {
        key: 'qualified',
        label: 'দুই দিকেই Alias',
        sql: `SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c;`,
        bindings: [
            { name: 'b.customer_id', table: 'bookings (ভেতরের)', outer: false },
            { name: 'c.customer_id', table: 'customers (বাইরের)', outer: true },
        ],
        correlated: true,
        result: 'Rahim 3, Nusrat 2, Tanvir 2 ... Imran 0। পনেরো জনের যোগফল ২৪।',
        verdict: 'right',
        why: 'একটা নাম ভেতরের, একটা বাইরের। প্রতিটা Customer এর জন্য শুধু তাঁর নিজের Booking গোনা হয়।',
    },
    {
        key: 'bare',
        label: 'কোনো দিকেই Alias নেই',
        sql: `SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE customer_id = customer_id) AS bookings
FROM customers c;`,
        bindings: [
            { name: 'customer_id (বাঁয়ে)', table: 'bookings (ভেতরের)', outer: false },
            { name: 'customer_id (ডানে)', table: 'bookings (ভেতরের)', outer: false },
        ],
        correlated: false,
        result: 'পনেরো জনের প্রত্যেকের পাশে ২৪, Imran এর পাশেও।',
        verdict: 'wrong',
        why: 'দুটো নামই ভেতরের bookings এ আগে পাওয়া যায়। তুলনাটা প্রতিটা Booking এর নিজের সাথে নিজের, তাই সবসময় সত্য। Subquery টা বাইরের কিছুই দেখে না, Correlated ই না।',
    },
    {
        key: 'half',
        label: 'শুধু এক দিকে Alias',
        sql: `SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = customer_id) AS bookings
FROM customers c;`,
        bindings: [
            { name: 'b.customer_id', table: 'bookings (ভেতরের)', outer: false },
            { name: 'customer_id', table: 'bookings (ভেতরের)', outer: false },
        ],
        correlated: false,
        result: 'আবারও সবার পাশে ২৪।',
        verdict: 'wrong',
        why: 'b. লিখলেই অন্য দিকটা বাইরের হয়ে যায় না। Alias ছাড়া নামটা আগে ভেতরে খোঁজা হয়, আর bookings এ customer_id আছে।',
    },
    {
        key: 'missing',
        label: 'ভেতরের Table এ নামটাই নেই',
        sql: `SELECT count(*)
FROM customers c
WHERE c.customer_id IN (SELECT customer_id FROM payments);`,
        bindings: [
            { name: 'customer_id', table: 'payments এ নেই, তাই customers (বাইরের)', outer: true },
        ],
        correlated: true,
        result: '১৫, মানে সব Customer। অথচ Payment আছে মাত্র ১২ জনের।',
        verdict: 'wrong',
        why: 'payments এ customer_id নামে কোনো Column নেই। PostgreSQL তাই বাইরে খোঁজে, আর c.customer_id পায়। প্রশ্নটা হয়ে যায় "আমার নম্বর কি আমার নম্বরের তালিকায় আছে", যেটা সবার জন্য সত্য। কোনো Error নেই।',
    },
    {
        key: 'missing-alias',
        label: 'একই ভুল, Alias সহ',
        sql: `SELECT count(*)
FROM customers c
WHERE c.customer_id IN (SELECT p.customer_id FROM payments p);`,
        bindings: [{ name: 'p.customer_id', table: 'payments এ নেই, আর Alias বাইরে যেতে দেয় না', outer: false }],
        correlated: false,
        result: 'ERROR: column p.customer_id does not exist',
        verdict: 'error',
        why: 'p. লিখে আপনি বলে দিলেন নামটা payments এর। সেখানে না পেয়ে PostgreSQL চুপচাপ বাইরে যায় না, Error দেয়। নীরব ভুল উত্তরের চেয়ে জোরে Error অনেক ভালো।',
    },
];

/**
 * Five ways the inner WHERE can be written, with how each column name is
 * resolved and the real result. The lesson for the reader: qualify every
 * column inside a subquery, so a wrong name becomes an error, not a wrong number.
 */
export function ScopeTrapLab() {
    const [key, setKey] = useState(SCOPE_CASES[0].key);
    const c = SCOPE_CASES.find(s => s.key === key)!;

    return (
        <Panel
            label='Interactive'
            title='নামটা কার: পাঁচটা লেখা, পাঁচটা আসল ফলাফল'
            footer='প্রতিটা ফলাফল Sample Database এ চালিয়ে পাওয়া, PostgreSQL 18 আর MySQL 8.4 দুই জায়গাতেই একই। নিয়ম একটাই: ভেতরের Query তে নাম পেলে আগে ভেতরের FROM এ খোঁজা হয়, না পেলে বাইরের। প্রতিটা Column এর আগে Alias দিলে এই খোঁজাখুঁজির জায়গাই থাকে না।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {SCOPE_CASES.map(s => (
                    <button
                        key={s.key}
                        type='button'
                        data-case={s.key}
                        onClick={() => setKey(s.key)}
                        className={cn(BTN, key === s.key ? BTN_ON : BTN_OFF)}>
                        {s.label}
                    </button>
                ))}
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {c.sql}
            </pre>

            <div className='grid gap-5 lg:grid-cols-2'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        প্রতিটা নাম কোথায় পাওয়া গেল
                    </p>
                    <ul className='space-y-1.5'>
                        {c.bindings.map(b => (
                            <li
                                key={b.name}
                                className='flex flex-wrap items-baseline justify-between gap-2 border border-border/70 px-3 py-2 text-[0.8125rem]'>
                                <span className='font-mono text-foreground'>{b.name}</span>
                                <span className={cn('text-[0.75rem]', b.outer ? 'text-primary font-bold' : 'text-muted-foreground')}>
                                    {b.table}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className='mt-3 font-mono text-[0.6875rem] text-muted-foreground'>
                        Correlated?{' '}
                        <span className={c.correlated ? 'text-primary font-bold' : 'font-bold'}>
                            {c.correlated ? 'হ্যাঁ, বাইরের Row দেখে' : 'না, বাইরের কিছুই দেখে না'}
                        </span>
                    </p>
                </div>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        আসল ফলাফল
                    </p>
                    <div
                        data-verdict={c.verdict}
                        className={cn(
                            'border px-4 py-3 text-sm leading-relaxed',
                            c.verdict === 'right' && 'border-primary/50 bg-primary/5',
                            c.verdict === 'wrong' && 'border-destructive/50 bg-destructive/5',
                            c.verdict === 'error' && 'border-border bg-muted/30'
                        )}>
                        <p className='font-mono text-[0.75rem] font-bold mb-2'>{c.result}</p>
                        <p className='text-muted-foreground'>{c.why}</p>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. One question, several ways to write it                                 */
/* ------------------------------------------------------------------------- */

interface RewriteForm {
    key: string;
    label: string;
    sql: string;
    runs: string;
    where: string;
}

const REWRITES: { key: string; question: string; rows: number; forms: RewriteForm[] }[] = [
    {
        key: 'latest',
        question: 'প্রতিটা Customer এর সবশেষ Booking',
        rows: 14,
        forms: [
            {
                key: 'correlated',
                label: 'Correlated Subquery',
                sql: `SELECT b.customer_id, b.booking_id, b.booked_at
FROM bookings b
WHERE b.booked_at = (SELECT max(b2.booked_at)
                     FROM bookings b2
                     WHERE b2.customer_id = b.customer_id);`,
                runs: 'Plan এ SubPlan: প্রতিটা Booking এর জন্য ভেতরের অংশ আবার চলে।',
                where: 'এই লেসন',
            },
            {
                key: 'derived',
                label: 'গোছানো Table এর সাথে JOIN',
                sql: `SELECT b.customer_id, b.booking_id, b.booked_at
FROM bookings b
JOIN (SELECT customer_id, max(booked_at) AS last_at
      FROM bookings
      GROUP BY customer_id) m
  ON m.customer_id = b.customer_id
 AND m.last_at = b.booked_at;`,
                runs: 'একবার গুছিয়ে সবার max, তারপর একবার JOIN।',
                where: 'Lesson 04, Derived Tables',
            },
            {
                key: 'lateral',
                label: 'LATERAL',
                sql: `SELECT c.customer_id, l.booking_id, l.booked_at
FROM customers c
CROSS JOIN LATERAL (
    SELECT b.booking_id, b.booked_at
    FROM bookings b
    WHERE b.customer_id = c.customer_id
    ORDER BY b.booked_at DESC
    LIMIT 1
) l;`,
                runs: 'এটাও প্রতিটা Customer এর জন্য একবার, কিন্তু পুরো Row আনতে পারে।',
                where: 'Module 06, LATERAL Joins',
            },
            {
                key: 'distinct-on',
                label: 'DISTINCT ON',
                sql: `SELECT DISTINCT ON (b.customer_id)
       b.customer_id, b.booking_id, b.booked_at
FROM bookings b
ORDER BY b.customer_id, b.booked_at DESC;`,
                runs: 'একবার সাজিয়ে প্রতিটা দলের প্রথম Row। শুধু PostgreSQL এ।',
                where: 'Module 03, DISTINCT',
            },
        ],
    },
    {
        key: 'count',
        question: 'প্রতিটা Customer এর Booking কয়টা, ০ সহ',
        rows: 15,
        forms: [
            {
                key: 'correlated',
                label: 'Correlated Subquery',
                sql: `SELECT c.customer_id,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c;`,
                runs: 'SubPlan, loops=15: পনেরোবার bookings দেখা।',
                where: 'এই লেসন',
            },
            {
                key: 'left-join',
                label: 'LEFT JOIN আর GROUP BY',
                sql: `SELECT c.customer_id, count(b.booking_id) AS bookings
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id;`,
                runs: 'একবার Join, একবার গোনা। count(*) লিখলে Imran ভুল করে ১ পেতেন।',
                where: 'Module 06, LEFT JOIN',
            },
            {
                key: 'window',
                label: 'Window Function',
                sql: `SELECT DISTINCT c.customer_id,
       count(b.booking_id) OVER (PARTITION BY c.customer_id) AS bookings
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id;`,
                runs: 'Row না হারিয়ে দলের হিসাব। এখানে বাড়তি, তবে অন্য প্রশ্নে খুব কাজের।',
                where: 'Module 08, Window Functions',
            },
        ],
    },
];

/**
 * Pick a question and switch between equivalent queries. Every form returns
 * the same rows on the sample data (checked); what changes is how much work
 * the database does and which lesson teaches the form.
 */
export function RewriteLab() {
    const [qKey, setQKey] = useState(REWRITES[0].key);
    const q = REWRITES.find(r => r.key === qKey)!;
    const [fKey, setFKey] = useState(q.forms[0].key);
    const form = q.forms.find(f => f.key === fKey) ?? q.forms[0];

    const chooseQuestion = (key: string) => {
        setQKey(key);
        setFKey(REWRITES.find(r => r.key === key)!.forms[0].key);
    };

    return (
        <Panel
            label='Interactive'
            title='এক প্রশ্ন, কয়েক রকম লেখা, একই উত্তর'
            footer='প্রতিটা লেখা Sample Database এ চালিয়ে মেলানো হয়েছে: সবশেষ Booking এর প্রশ্নে চারটা লেখাই একই ১৪টা Row দেয়, Booking গোনার প্রশ্নে তিনটা লেখাই একই ১৫টা Row। কোনটা দ্রুত, সেটা Data আর Index এর উপর নির্ভর করে, তাই অনুমান না করে EXPLAIN দিয়ে দেখুন।'>
            <div className='flex flex-wrap gap-2 mb-4'>
                {REWRITES.map(r => (
                    <button
                        key={r.key}
                        type='button'
                        data-question={r.key}
                        onClick={() => chooseQuestion(r.key)}
                        className={cn(BTN, qKey === r.key ? BTN_ON : BTN_OFF)}>
                        {r.question}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5'>
                {q.forms.map(f => (
                    <button
                        key={f.key}
                        type='button'
                        data-form={f.key}
                        onClick={() => setFKey(f.key)}
                        className={cn(BTN, form.key === f.key ? BTN_ON : BTN_OFF)}>
                        {f.label}
                    </button>
                ))}
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {form.sql}
            </pre>

            <div className='grid gap-3 md:grid-cols-3'>
                <div className='border border-primary/50 bg-primary/5 px-4 py-3'>
                    <p className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>ফলাফল</p>
                    <p className='font-mono text-sm font-bold text-primary' data-rows={q.rows}>
                        {toBn(q.rows)}টা Row, বাকি লেখাগুলোর সাথে হুবহু এক
                    </p>
                </div>
                <div className='border border-border px-4 py-3'>
                    <p className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>কীভাবে চলে</p>
                    <p className='text-[0.8125rem] leading-relaxed'>{form.runs}</p>
                </div>
                <div className='border border-border px-4 py-3'>
                    <p className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>কোথায় শেখানো</p>
                    <p className='text-[0.8125rem] leading-relaxed'>{form.where}</p>
                </div>
            </div>
        </Panel>
    );
}
