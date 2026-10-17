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
/* 1. একটা একটা Row ধরে জোড়া                                                  */
/* ------------------------------------------------------------------------- */

/** The 15 real rows of `customers`, as the sample database holds them. */
const CUSTOMERS: { id: number; name: string; city: string }[] = [
    { id: 1, name: 'Rahim Uddin', city: 'Dhaka' },
    { id: 2, name: 'Nusrat Jahan', city: 'Dhaka' },
    { id: 3, name: 'Tanvir Ahmed', city: 'Chattogram' },
    { id: 4, name: 'Farhana Akter', city: 'Sylhet' },
    { id: 5, name: 'Sabbir Hossain', city: 'Rajshahi' },
    { id: 6, name: 'Mitu Rahman', city: 'Dhaka' },
    { id: 7, name: 'Arif Chowdhury', city: 'Khulna' },
    { id: 8, name: 'Sumaiya Islam', city: 'Dhaka' },
    { id: 9, name: 'Priya Sharma', city: 'Kolkata' },
    { id: 10, name: 'Aiman Zulkifli', city: 'Kuala Lumpur' },
    { id: 11, name: 'Oliver Bennett', city: 'London' },
    { id: 12, name: 'Kamal Hasan', city: 'Barishal' },
    { id: 13, name: 'Shuvo Das', city: 'Dhaka' },
    { id: 14, name: 'Lamia Haque', city: 'Chattogram' },
    { id: 15, name: 'Imran Kabir', city: 'Dhaka' },
];

type Mode = 'eq' | 'ne' | 'lt';
type Verdict = 'match' | 'self' | 'reverse' | 'city';

const MODES: { key: Mode; label: string; on: string }[] = [
    { key: 'eq', label: 'শুধু একই শহর', on: 'ON a.city = b.city' },
    { key: 'ne', label: 'নিজেকে বাদ', on: 'ON a.city = b.city AND a.customer_id <> b.customer_id' },
    { key: 'lt', label: 'প্রতিটা জোড়া একবার', on: 'ON a.city = b.city AND a.customer_id < b.customer_id' },
];

function judge(mode: Mode, a: (typeof CUSTOMERS)[number], b: (typeof CUSTOMERS)[number]): Verdict {
    if (a.city !== b.city) return 'city';
    if (mode !== 'eq' && a.id === b.id) return 'self';
    if (mode === 'lt' && a.id > b.id) return 'reverse';
    return 'match';
}

const VERDICT_TEXT: Record<Verdict, string> = {
    match: 'জোড়া হলো',
    self: 'নিজেই, বাদ',
    reverse: 'উল্টো দিক, বাদ',
    city: 'অন্য শহর',
};

/**
 * The self join done by hand. Copy a is walked one row at a time; for the
 * current a row every row of copy b is checked against the ON condition and
 * marked. The running total ends at the same 47, 32 or 16 the query boxes
 * print.
 */
export function SelfPairLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<Mode>('lt');
    const [step, setStep] = useState(0);

    const done = step >= CUSTOMERS.length;
    const current = done ? null : CUSTOMERS[step];
    const countUpTo = (last: number) =>
        CUSTOMERS.slice(0, last).reduce(
            (sum, a) => sum + CUSTOMERS.filter(b => judge(mode, a, b) === 'match').length,
            0
        );
    const produced = countUpTo(done ? CUSTOMERS.length : step + 1);
    const total = countUpTo(CUSTOMERS.length);
    const sql = `SELECT a.full_name, b.full_name\nFROM customers a\nJOIN customers b\n  ${MODES.find(m => m.key === mode)!.on};`;

    return (
        <Panel
            label='Interactive'
            title='একটা একটা Row ধরে নিজের সাথে জোড়া'
            footer={
                <>
                    Database ঠিক এভাবেই কাজ করে: a এর প্রতিটা Row এর জন্য b এর প্রতিটা Row কে ON শর্তে পরীক্ষা।
                    ১৫টা Row মানে ২২৫টা পরীক্ষা। শর্ত বদলালে Row এর সংখ্যা ৪৭, ৩২ বা ১৬, ঠিক যা Query বক্স দেখায়।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                {MODES.map(m => (
                    <button
                        key={m.key}
                        type='button'
                        data-mode={m.key}
                        aria-pressed={mode === m.key}
                        onClick={() => {
                            setMode(m.key);
                            setStep(0);
                        }}
                        className={cn(BTN, mode === m.key ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {sql}
            </pre>

            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-action='prev'
                    onClick={() => setStep(s => Math.max(0, Math.min(s, CUSTOMERS.length) - 1))}
                    disabled={step === 0}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    আগের Row
                </button>
                <button
                    type='button'
                    data-action='next'
                    onClick={() => setStep(s => Math.min(CUSTOMERS.length, s + 1))}
                    disabled={done}
                    className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                    পরের Row
                </button>
                <button
                    type='button'
                    data-action='all'
                    onClick={() => setStep(CUSTOMERS.length)}
                    className={cn(BTN, BTN_OFF)}>
                    সব একবারে
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setStep(0)}
                    className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
                <span className='ml-auto font-mono text-[0.75rem] text-muted-foreground' data-count={produced}>
                    এ পর্যন্ত {toBn(produced)}টা Row, মোট হবে {toBn(total)}টা
                </span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4' data-step={step}>
                <div className='border border-border'>
                    <p className='border-b border-border bg-muted/30 px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary'>
                        customers AS a
                    </p>
                    <ul className='divide-y divide-border/60'>
                        {CUSTOMERS.map((a, i) => (
                            <li
                                key={a.id}
                                className={cn(
                                    'flex items-center justify-between gap-3 px-3 py-1.5 font-mono text-[0.6875rem] transition-colors',
                                    i === step && 'bg-primary/10 text-primary font-bold',
                                    i < step && 'text-muted-foreground/60'
                                )}>
                                <span>
                                    {a.id}. {a.name}
                                </span>
                                <span className='opacity-80'>{a.city}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='border border-border'>
                    <p className='border-b border-border bg-muted/30 px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary'>
                        customers AS b {current ? `, পরীক্ষা ${current.name} এর জন্য` : ''}
                    </p>
                    {current ? (
                        <ul className='divide-y divide-border/60'>
                            {CUSTOMERS.map(b => {
                                const v = judge(mode, current, b);
                                return (
                                    <motion.li
                                        key={`${current.id}-${b.id}-${mode}`}
                                        initial={reduce ? false : { opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.25, ease: EASE }}
                                        className={cn(
                                            'flex items-center justify-between gap-3 px-3 py-1.5 font-mono text-[0.6875rem]',
                                            v === 'match' && 'bg-primary/10 text-foreground',
                                            v === 'city' && 'text-muted-foreground/50',
                                            (v === 'self' || v === 'reverse') && 'text-muted-foreground line-through'
                                        )}>
                                        <span>
                                            {b.id}. {b.name}
                                        </span>
                                        <span className={cn(v === 'match' ? 'text-primary font-bold' : 'opacity-80')}>
                                            {VERDICT_TEXT[v]}
                                        </span>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className='px-3 py-6 text-sm leading-relaxed text-muted-foreground'>
                            a এর পনেরোটা Row ই শেষ। ফলাফলে মোট {toBn(total)}টা Row। এবার উপরে আরেকটা শর্ত বেছে আবার
                            চালিয়ে দেখুন, কোন জোড়াগুলো পড়ে যায়।
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কর্মী থেকে Manager এর দিকে হাঁটা                                         */
/* ------------------------------------------------------------------------- */

const STAFF = [
    { id: 1, name: 'Rumana', role: 'Owner', manager: null as number | null },
    { id: 2, name: 'Faruk', role: 'Operations Manager', manager: 1 },
    { id: 3, name: 'Tanim', role: 'Developer', manager: 1 },
    { id: 4, name: 'Nabila', role: 'Support', manager: 2 },
    { id: 5, name: 'Sadia', role: 'Sales', manager: 2 },
    { id: 6, name: 'Jamal Hossain', role: 'Guide', manager: 2 },
];

const nameOf = (id: number | null) => (id === null ? null : STAFF.find(s => s.id === id)!.name);
const managerOf = (id: number | null) => (id === null ? null : STAFF.find(s => s.id === id)!.manager);

/**
 * The staff tree through a self join. INNER drops the owner, who has no
 * manager; LEFT keeps her with NULL. A second self join climbs one more level.
 * The rows shown are the ones the lesson's query box returns.
 */
export function TreeWalkLab() {
    const [join, setJoin] = useState<'inner' | 'left'>('left');
    const [levels, setLevels] = useState<1 | 2>(1);
    const [picked, setPicked] = useState<number>(4);

    const rows = STAFF.filter(s => join === 'left' || s.manager !== null);
    const chain: number[] = [];
    for (let id: number | null = picked; id !== null && chain.length < 4; id = managerOf(id)) chain.push(id);

    const keyword = join === 'left' ? 'LEFT JOIN' : 'JOIN';
    const sql =
        levels === 1
            ? `SELECT e.full_name AS employee, m.full_name AS manager\nFROM staff e\n${keyword} staff m ON m.staff_id = e.manager_id;`
            : `SELECT e.full_name AS employee, m.full_name AS manager,\n       top.full_name AS managers_manager\nFROM staff e\n${keyword} staff m   ON m.staff_id = e.manager_id\nLEFT JOIN staff top ON top.staff_id = m.manager_id;`;

    return (
        <Panel
            label='Interactive'
            title='কর্মী থেকে Manager, একই Table ধরে'
            footer={
                <>
                    INNER JOIN এ Rumana হারিয়ে যান, কারণ তাঁর manager_id খালি আর খালির সাথে কোনো Row মেলে না।
                    দুই ধাপের জন্য Table টাকে তৃতীয়বার আনতে হয়। ধাপ যত, Join তত: যেকোনো গভীরতার গাছের জন্য
                    লাগে Recursive CTE, Module 07 এ।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-3'>
                {(['left', 'inner'] as const).map(j => (
                    <button
                        key={j}
                        type='button'
                        data-join={j}
                        aria-pressed={join === j}
                        onClick={() => setJoin(j)}
                        className={cn(BTN, join === j ? BTN_ON : BTN_OFF)}>
                        {j === 'left' ? 'LEFT JOIN' : 'INNER JOIN'}
                    </button>
                ))}
                {([1, 2] as const).map(l => (
                    <button
                        key={l}
                        type='button'
                        data-levels={l}
                        aria-pressed={levels === l}
                        onClick={() => setLevels(l)}
                        className={cn(BTN, levels === l ? BTN_ON : BTN_OFF)}>
                        {l === 1 ? 'এক ধাপ উপরে' : 'দুই ধাপ উপরে'}
                    </button>
                ))}
            </div>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {sql}
            </pre>
            <div className='overflow-x-auto border border-border' data-rows={rows.length}>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            <th className='border-b border-border px-3 py-2 text-left'>employee</th>
                            <th className='border-b border-border px-3 py-2 text-left'>manager</th>
                            {levels === 2 && <th className='border-b border-border px-3 py-2 text-left'>managers_manager</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(s => {
                            const m = nameOf(s.manager);
                            const top = nameOf(managerOf(s.manager));
                            return (
                                <tr
                                    key={s.id}
                                    data-staff={s.id}
                                    onClick={() => setPicked(s.id)}
                                    className={cn(
                                        'cursor-pointer border-b border-border/60 last:border-b-0',
                                        chain.includes(s.id) && 'bg-primary/10'
                                    )}>
                                    <td className='px-3 py-1.5'>{s.name}</td>
                                    <td className={cn('px-3 py-1.5', !m && 'italic text-muted-foreground/60')}>{m ?? 'NULL'}</td>
                                    {levels === 2 && (
                                        <td className={cn('px-3 py-1.5', !top && 'italic text-muted-foreground/60')}>
                                            {top ?? 'NULL'}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                    ({rows.length} rows)
                </p>
            </div>
            <p className='mt-4 text-sm leading-relaxed text-muted-foreground' data-chain={chain.join('>')}>
                কোনো Row তে চাপ দিলে তাঁর উপরের শিকল দেখা যাবে:{' '}
                <span className='font-mono text-foreground'>{chain.map(id => nameOf(id)).join(' → ')}</span>
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন প্রশ্নে কোন পথ                                                       */
/* ------------------------------------------------------------------------- */

type Pattern = 'self' | 'join' | 'window';

const PATTERNS: { key: Pattern; label: string }[] = [
    { key: 'self', label: 'Self Join' },
    { key: 'join', label: 'আলাদা দুই Table এর Join' },
    { key: 'window', label: 'Window Function ভালো' },
];

const CASES: { id: string; question: string; answer: Pattern; why: string }[] = [
    {
        id: 'city-pairs',
        question: 'একই শহরের দুজন Customer এর জোড়া, একসাথে ভ্রমণের প্রস্তাবের জন্য।',
        answer: 'self',
        why: 'দুজনেই customers Table এর Row। একই Table এর দুটো Row কে পাশাপাশি আনতে Table টাকে নিজের সাথে জোড়া লাগাতে হয়, a.customer_id < b.customer_id দিয়ে।',
    },
    {
        id: 'booking-name',
        question: 'প্রতিটা Booking এর পাশে Customer এর নাম।',
        answer: 'join',
        why: 'Booking আর Customer আলাদা দুই Table, সম্পর্ক bookings.customer_id থেকে customers.customer_id। সাধারণ INNER JOIN, Lesson 02 এর কাজ।',
    },
    {
        id: 'manager',
        question: 'প্রতিটা কর্মীর পাশে তাঁর Manager এর নাম, Manager নিজেও কর্মী।',
        answer: 'self',
        why: 'Manager একই staff Table এর আরেকটা Row। manager_id ধরে Table টাকে নিজের সাথে LEFT JOIN, যাতে মালিক বাদ না পড়েন।',
    },
    {
        id: 'previous-departure',
        question: 'প্রতিটা Departure এর পাশে একই Tour এর ঠিক আগের Departure এর তারিখ।',
        answer: 'window',
        why: 'Self Join দিয়ে করা যায় (আগের সব Departure এর সাথে জোড়া, তারপর max), কিন্তু lag() এক নজরে ঠিক আগের Row টা দেয়, জোড়ার পাহাড় ছাড়াই। Module 08 এ শিখবেন।',
    },
    {
        id: 'co-travellers',
        question: 'একই Departure এ যাওয়া দুজন যাত্রীর নাম, পাশাপাশি।',
        answer: 'self',
        why: 'জোড়াটা bookings Table এর দুটো Row থেকে আসে, তাই bookings দুইবার। নাম আনতে customers ও দুইবার আসে, প্রত্যেক পাশের জন্য একবার।',
    },
    {
        id: 'tour-count',
        question: 'প্রতিটা Destination এ কয়টা Tour।',
        answer: 'join',
        why: 'destinations আর tours আলাদা Table। Join করে GROUP BY, অথবা Destination এর নাম না লাগলে শুধু tours এ GROUP BY। কোথাও একই Table দুইবার লাগে না।',
    },
];

/**
 * Six real questions from the Island Tours office. The reader picks whether
 * each needs a self join, an ordinary join between two tables, or is better
 * served by a window function, and sees why.
 */
export function PatternPickLab() {
    const [answers, setAnswers] = useState<Record<string, Pattern>>({});
    const score = CASES.filter(c => answers[c.id] === c.answer).length;
    const answered = Object.keys(answers).length;

    return (
        <Panel
            label='Interactive'
            title='কোন প্রশ্নে Self Join, কোনটায় না'
            footer={
                <>
                    নিজেকে একটা প্রশ্ন করুন: যে দুটো জিনিস পাশাপাশি চাই, তারা কি একই Table এর দুটো Row? হ্যাঁ হলে Self
                    Join। আর যদি প্রশ্নটা হয় ঠিক আগের বা পরের Row, তাহলে Window Function এর কথা ভাবুন।
                </>
            }>
            <div className='space-y-5'>
                {CASES.map(c => {
                    const picked = answers[c.id];
                    return (
                        <div key={c.id} className='border border-border p-4' data-case={c.id} data-picked={picked ?? 'none'}>
                            <p className='text-sm leading-relaxed text-foreground mb-3'>{c.question}</p>
                            <div className='flex flex-wrap gap-2'>
                                {PATTERNS.map(p => (
                                    <button
                                        key={p.key}
                                        type='button'
                                        data-choice={p.key}
                                        aria-pressed={picked === p.key}
                                        onClick={() => setAnswers(prev => ({ ...prev, [c.id]: p.key }))}
                                        className={cn(
                                            BTN,
                                            picked === p.key
                                                ? p.key === c.answer
                                                    ? BTN_ON
                                                    : 'border-destructive/60 bg-destructive/5 text-destructive'
                                                : BTN_OFF
                                        )}>
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            {picked && (
                                <p className='mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                                    <span className={cn('font-bold', picked === c.answer ? 'text-primary' : 'text-destructive')}>
                                        {picked === c.answer ? 'ঠিক। ' : 'আরেকবার ভাবুন। '}
                                    </span>
                                    {c.why}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
            <p className='mt-5 font-mono text-[0.75rem] text-muted-foreground' data-score={score}>
                {toBn(answered)}টা উত্তর দিয়েছেন, ঠিক {toBn(score)}টা, মোট {toBn(CASES.length)}টা প্রশ্ন।
            </p>
        </Panel>
    );
}
