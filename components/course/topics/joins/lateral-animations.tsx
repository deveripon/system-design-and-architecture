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
const BTN_DISABLED = 'border-border/50 text-muted-foreground/40 cursor-not-allowed';

/* ------------------------------------------------------------------------- */
/* 1. প্রতিটা Customer এর জন্য ভেতরের Query, এক এক করে                         */
/* ------------------------------------------------------------------------- */

/**
 * Every customer with their bookings, newest booked_at first, exactly as
 * PostgreSQL returns `ORDER BY b.booked_at DESC` on the sample database.
 */
const CUSTOMERS: { id: number; name: string; bookings: { id: number; status: string }[] }[] = [
    { id: 1, name: 'Rahim Uddin', bookings: [{ id: 17, status: 'pending' }, { id: 8, status: 'confirmed' }, { id: 1, status: 'confirmed' }] },
    { id: 2, name: 'Nusrat Jahan', bookings: [{ id: 13, status: 'confirmed' }, { id: 2, status: 'confirmed' }] },
    { id: 3, name: 'Tanvir Ahmed', bookings: [{ id: 22, status: 'confirmed' }, { id: 3, status: 'confirmed' }] },
    { id: 4, name: 'Farhana Akter', bookings: [{ id: 21, status: 'confirmed' }, { id: 4, status: 'confirmed' }] },
    { id: 5, name: 'Sabbir Hossain', bookings: [{ id: 5, status: 'cancelled' }] },
    { id: 6, name: 'Mitu Rahman', bookings: [{ id: 18, status: 'cancelled' }, { id: 6, status: 'confirmed' }] },
    { id: 7, name: 'Arif Chowdhury', bookings: [{ id: 7, status: 'confirmed' }] },
    { id: 8, name: 'Sumaiya Islam', bookings: [{ id: 23, status: 'confirmed' }, { id: 9, status: 'confirmed' }] },
    { id: 9, name: 'Priya Sharma', bookings: [{ id: 20, status: 'pending' }, { id: 10, status: 'confirmed' }] },
    { id: 10, name: 'Aiman Zulkifli', bookings: [{ id: 11, status: 'confirmed' }] },
    { id: 11, name: 'Oliver Bennett', bookings: [{ id: 19, status: 'confirmed' }, { id: 12, status: 'cancelled' }] },
    { id: 12, name: 'Kamal Hasan', bookings: [{ id: 14, status: 'pending' }] },
    { id: 13, name: 'Shuvo Das', bookings: [{ id: 24, status: 'pending' }, { id: 15, status: 'confirmed' }] },
    { id: 14, name: 'Lamia Haque', bookings: [{ id: 16, status: 'confirmed' }] },
    { id: 15, name: 'Imran Kabir', bookings: [] },
];

type JoinKind = 'cross' | 'left';
type ResultRow = { customer: number; name: string; booking: number | null; status: string | null };

/** The joined rows produced by the first `upto` customers for one join kind and limit. */
function rowsUpTo(join: JoinKind, limit: number, upto: number): ResultRow[] {
    const out: ResultRow[] = [];
    for (const c of CUSTOMERS.slice(0, upto)) {
        const picked = c.bookings.slice(0, limit);
        if (picked.length === 0) {
            if (join === 'left') out.push({ customer: c.id, name: c.name, booking: null, status: null });
            continue;
        }
        for (const b of picked) out.push({ customer: c.id, name: c.name, booking: b.id, status: b.status });
    }
    return out;
}

/**
 * Steps through the fifteen real customers. For each one the lab fills that
 * customer's id into the inner query, shows the rows it returns, and adds
 * them to the result, so the reader sees LATERAL run once per outer row and
 * sees CROSS drop Imran while LEFT keeps him with NULLs.
 */
export function LateralStepLab() {
    const reduce = useReducedMotion();
    const [join, setJoin] = useState<JoinKind>('cross');
    const [limit, setLimit] = useState(2);
    const [step, setStep] = useState(0);

    const current = step > 0 ? CUSTOMERS[step - 1] : null;
    const inner = current ? current.bookings.slice(0, limit) : [];
    const rows = rowsUpTo(join, limit, step);
    const before = rowsUpTo(join, limit, Math.max(0, step - 1)).length;
    const finalCount = rowsUpTo(join, limit, CUSTOMERS.length).length;
    const done = step === CUSTOMERS.length;

    let verdict = 'Next চাপুন। প্রথম Customer এর জন্য ভেতরের Query চলবে।';
    if (current) {
        if (inner.length > 0) {
            verdict = `ভেতরের Query ${toBn(inner.length)}টা Row দিল, তাই ${current.name} এর পাশে ${toBn(inner.length)}টা Row যোগ হলো।`;
        } else if (join === 'cross') {
            verdict = `ভেতরের Query কিছুই দিল না। CROSS JOIN LATERAL এ জোড়ার কিছু নেই, তাই ${current.name} ফলাফল থেকে বাদ।`;
        } else {
            verdict = `ভেতরের Query কিছুই দিল না। LEFT JOIN LATERAL তবু ${current.name} কে রাখল, ভেতরের ঘরগুলো NULL।`;
        }
    }

    const reset = (next?: () => void) => {
        next?.();
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='LATERAL প্রতিটা Row এর জন্য একবার চলে'
            footer={
                <>
                    সব মান island_tours এর আসল Data থেকে: প্রতিটা Customer এর Booking, booked_at এর নতুন থেকে পুরনো ক্রমে।
                    শেষ পর্যন্ত গেলে মোট Row: CROSS এ LIMIT 1, 2, 3 দিলে 14, 23, 24; LEFT এ 15, 24, 25। পার্থক্য সবসময় এক,
                    আর সেই একজন Imran Kabir।
                </>
            }>
            <div className='grid gap-4 md:grid-cols-2 mb-6'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>JOIN এর ধরন</p>
                    <div className='flex flex-wrap gap-2'>
                        {(['cross', 'left'] as JoinKind[]).map(kind => (
                            <button
                                key={kind}
                                type='button'
                                data-join={kind}
                                aria-pressed={join === kind}
                                onClick={() => reset(() => setJoin(kind))}
                                className={cn(BTN, join === kind ? BTN_ON : BTN_OFF)}>
                                {kind === 'cross' ? 'CROSS JOIN LATERAL' : 'LEFT JOIN LATERAL ... ON true'}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>প্রতি Customer সর্বোচ্চ</p>
                    <div className='flex flex-wrap gap-2'>
                        {[1, 2, 3].map(n => (
                            <button
                                key={n}
                                type='button'
                                data-limit={n}
                                aria-pressed={limit === n}
                                onClick={() => reset(() => setLimit(n))}
                                className={cn(BTN, limit === n ? BTN_ON : BTN_OFF)}>
                                {`LIMIT ${n}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='mb-5 border border-border bg-background p-4 font-mono text-[0.75rem] leading-relaxed'>
                <div>SELECT c.full_name, x.booking_id, x.status</div>
                <div>FROM customers c</div>
                <div className='text-primary font-bold'>
                    {join === 'cross' ? 'CROSS JOIN LATERAL (' : 'LEFT JOIN LATERAL ('}
                </div>
                <div className='pl-4'>SELECT b.booking_id, b.status FROM bookings b</div>
                <div className='pl-4'>
                    WHERE b.customer_id ={' '}
                    <span className={cn('font-bold', current ? 'text-primary' : 'text-muted-foreground')}>
                        {current ? current.id : 'c.customer_id'}
                    </span>
                </div>
                <div className='pl-4'>ORDER BY b.booked_at DESC LIMIT {limit}</div>
                <div className='text-primary font-bold'>{join === 'cross' ? ') AS x;' : ') AS x ON true;'}</div>
            </div>

            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-action='prev'
                    disabled={step === 0}
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    className={cn(BTN, step === 0 ? BTN_DISABLED : BTN_OFF)}>
                    Prev
                </button>
                <button
                    type='button'
                    data-action='next'
                    disabled={done}
                    onClick={() => setStep(s => Math.min(CUSTOMERS.length, s + 1))}
                    className={cn(BTN, done ? BTN_DISABLED : BTN_ON)}>
                    Next
                </button>
                <button type='button' data-action='all' onClick={() => setStep(CUSTOMERS.length)} className={cn(BTN, BTN_OFF)}>
                    সবগুলো একবারে
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                    Reset
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-step={step}>
                    {`বাইরের Row ${toBn(step)} / ${toBn(CUSTOMERS.length)}`}
                </span>
            </div>

            <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>এই মুহূর্তের Customer</p>
                    <div className='border border-border bg-background p-4 min-h-[8rem]'>
                        {current ? (
                            <>
                                <p className='text-sm font-bold'>
                                    <span className='font-mono text-primary mr-2'>{current.id}</span>
                                    {current.name}
                                </p>
                                <p className='mt-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>ভেতরের Query এর ফল</p>
                                <div className='mt-2 flex flex-wrap gap-2'>
                                    {inner.length > 0 ? (
                                        inner.map(b => (
                                            <span key={b.id} className='px-2 py-1 border border-primary/60 bg-primary/10 font-mono text-[0.75rem] text-primary'>
                                                {b.id} · {b.status}
                                            </span>
                                        ))
                                    ) : (
                                        <span className='px-2 py-1 border border-dashed border-border font-mono text-[0.75rem] text-muted-foreground'>
                                            কোনো Row নেই
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className='text-sm text-muted-foreground'>এখনো কোনো Row শুরু হয়নি।</p>
                        )}
                    </div>
                    <p className='mt-3 text-sm leading-relaxed' data-verdict={current ? (inner.length > 0 ? 'joined' : join === 'cross' ? 'dropped' : 'kept-null') : 'idle'}>
                        {verdict}
                    </p>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        ফলাফল এখন পর্যন্ত:{' '}
                        <span data-result-count={rows.length} className='text-primary font-bold'>
                            {toBn(rows.length)}
                        </span>{' '}
                        Row {done && `(শেষ, মোট ${toBn(finalCount)})`}
                    </p>
                    <div className='max-h-80 overflow-y-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    <th className='border-b border-border px-3 py-1.5 text-left'>full_name</th>
                                    <th className='border-b border-border px-3 py-1.5 text-left'>booking_id</th>
                                    <th className='border-b border-border px-3 py-1.5 text-left'>status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => {
                                    const fresh = i >= before;
                                    return (
                                        <motion.tr
                                            key={`${row.customer}-${row.booking ?? 'null'}`}
                                            initial={reduce || !fresh ? false : { opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, ease: EASE }}
                                            className={cn('border-b border-border/60 last:border-b-0', fresh && step > 0 && 'bg-primary/10')}>
                                            <td className='px-3 py-1'>{row.name}</td>
                                            <td className={cn('px-3 py-1', row.booking === null && 'italic text-muted-foreground')}>
                                                {row.booking ?? 'NULL'}
                                            </td>
                                            <td className={cn('px-3 py-1', row.status === null && 'italic text-muted-foreground')}>
                                                {row.status ?? 'NULL'}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className='px-3 py-3 text-muted-foreground'>
                                            এখনো খালি
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন প্রশ্নে কোন হাতিয়ার                                                 */
/* ------------------------------------------------------------------------- */

type Tool = 'inner' | 'left' | 'group' | 'distinct-on' | 'not-exists' | 'lateral';

const TOOLS: { id: Tool; text: string }[] = [
    { id: 'inner', text: 'INNER JOIN' },
    { id: 'left', text: 'LEFT JOIN' },
    { id: 'group', text: 'JOIN + GROUP BY' },
    { id: 'distinct-on', text: 'DISTINCT ON' },
    { id: 'not-exists', text: 'NOT EXISTS' },
    { id: 'lateral', text: 'LATERAL' },
];

const CASES: { id: string; question: string; correct: Tool[]; why: string }[] = [
    {
        id: 'last-two',
        question: 'প্রতিটা Customer এর সবচেয়ে নতুন দুটো Booking, Customer এর নামসহ।',
        correct: ['lateral'],
        why: 'প্রতি দলে একটার বেশি Row চাই, তাই DISTINCT ON চলবে না, সে শুধু একটা রাখে। প্রতিটা Customer এর জন্য ORDER BY booked_at DESC LIMIT 2, ঠিক এই কাজটাই LATERAL এর।',
    },
    {
        id: 'last-one',
        question: 'প্রতিটা Customer এর সবচেয়ে নতুন একটা Booking, PostgreSQL এ।',
        correct: ['distinct-on', 'lateral'],
        why: 'দুটোই ঠিক উত্তর দেয়, এই লেসনে তিনভাবে মিলিয়েও দেখা হয়েছে। DISTINCT ON ছোট আর PostgreSQL এর নিজস্ব; LATERAL পরে একটার জায়গায় দুটো চাইলে শুধু LIMIT বদলালেই হয়, আর MySQL 8.0.14 এর পরেও চলে।',
    },
    {
        id: 'never-booked',
        question: 'কোন Customer আজ পর্যন্ত একটাও Booking করেননি?',
        correct: ['not-exists', 'left'],
        why: 'প্রশ্নটা কিছু একটা নেই কিনা, তাই Anti Join। NOT EXISTS সবচেয়ে পরিষ্কার, Lesson 08 এর বিষয়। LEFT JOIN করে ডান দিকের key IS NULL ছেঁকেও একই উত্তর, Imran Kabir।',
    },
    {
        id: 'revenue',
        question: 'প্রতিটা ট্যুরের নামের পাশে নিশ্চিত Booking থেকে মোট আয়।',
        correct: ['group', 'lateral'],
        why: 'tours, departures আর bookings জুড়ে GROUP BY, Lesson 02 এর পরে এটাই স্বাভাবিক পথ। LATERAL এর ভেতরে sum লিখলেও হয়, আর তার বাড়তি সুবিধা: যে ট্যুরের কোনো Booking নেই সেও একটা Row পায়।',
    },
    {
        id: 'name-beside',
        question: 'প্রতিটা Booking এর পাশে যিনি বুক করেছেন তাঁর নাম।',
        correct: ['inner'],
        why: 'প্রতিটা Booking এর ঠিক একজন Customer আছেন, আর customer_id কখনো ফাঁকা না। সোজা INNER JOIN, এর বেশি কিছু লাগে না।',
    },
    {
        id: 'cheapest',
        question: 'প্রতিটা Destination এর সবচেয়ে সস্তা ট্যুর, ট্যুর না থাকলেও Destination টা দেখাতে হবে।',
        correct: ['lateral'],
        why: 'প্রতিটা Destination এর জন্য ORDER BY price_bdt LIMIT 1, আর Kuakata কে রাখতে LEFT JOIN LATERAL ... ON true। GROUP BY দিয়ে min(price_bdt) পাওয়া যায়, কিন্তু সেই দামের ট্যুরের নাম পেতে আরেকটা ধাপ লাগে।',
    },
    {
        id: 'tickets',
        question: 'প্রতিটা Booking এর প্রতিটা সিটের জন্য একটা আলাদা টিকিট Row।',
        correct: ['lateral'],
        why: 'একটা Row থেকে seats টা Row বানাতে হবে, আর seats প্রতিটা Booking এর আলাদা। generate_series(1, b.seats) কে বাঁ দিকের Row দেখতে হয়, Function এর বেলায় সেটাই LATERAL।',
    },
];

/** Seven questions; the reader picks a tool, sees whether it fits and why, and keeps a score. */
export function WhichToolLab() {
    const [picks, setPicks] = useState<Record<string, Tool>>({});
    const answered = Object.keys(picks).length;
    const score = CASES.filter(c => picks[c.id] && c.correct.includes(picks[c.id])).length;

    return (
        <Panel
            label='Interactive'
            title='কোন প্রশ্নে কোন হাতিয়ার'
            footer={
                <>
                    কয়েকটা প্রশ্নের একাধিক ঠিক উত্তর আছে, আর সেটা জানাও শেখার অংশ। প্রতিটা ব্যাখ্যা এই লেসন আর Module 06 এর
                    আগের লেসনের আসল Query থেকে।
                </>
            }>
            <p className='mb-5 font-mono text-[0.6875rem] text-muted-foreground'>
                <span data-score={score}>{`স্কোর ${toBn(score)} / ${toBn(CASES.length)}`}</span>
                {answered > 0 && answered < CASES.length && `, উত্তর দিয়েছেন ${toBn(answered)}টা`}
            </p>
            <ol className='space-y-6'>
                {CASES.map((c, i) => {
                    const pick = picks[c.id];
                    const right = pick ? c.correct.includes(pick) : false;
                    return (
                        <li key={c.id} data-case={c.id} className='border border-border bg-background p-4'>
                            <p className='text-sm font-bold leading-relaxed'>
                                <span className='font-mono text-primary mr-2'>{String(i + 1).padStart(2, '0')}</span>
                                {c.question}
                            </p>
                            <div className='mt-3 flex flex-wrap gap-2'>
                                {TOOLS.map(tool => {
                                    const chosen = pick === tool.id;
                                    return (
                                        <button
                                            key={tool.id}
                                            type='button'
                                            data-choice={tool.id}
                                            aria-pressed={chosen}
                                            onClick={() => setPicks(p => ({ ...p, [c.id]: tool.id }))}
                                            className={cn(BTN, chosen ? (right ? BTN_ON : 'border-destructive/60 bg-destructive/5 text-destructive') : BTN_OFF)}>
                                            {tool.text}
                                        </button>
                                    );
                                })}
                            </div>
                            {pick && (
                                <p className={cn('mt-3 text-sm leading-relaxed', right ? 'text-foreground' : 'text-muted-foreground')} data-result={right ? 'right' : 'wrong'}>
                                    <strong className={right ? 'text-primary' : 'text-destructive'}>{right ? 'ঠিক। ' : 'এটা না। '}</strong>
                                    {c.why}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ol>
        </Panel>
    );
}
