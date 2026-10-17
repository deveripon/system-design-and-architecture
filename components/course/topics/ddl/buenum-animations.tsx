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
/* 1. boolean কোন লেখা মানে আর কোনটা মানে না                                        */
/* ------------------------------------------------------------------------- */

interface BoolInput {
    input: string;
    /** 't', 'f', or null when PostgreSQL rejects it. */
    result: 't' | 'f' | null;
    why: string;
}

// Every result below was copied from PostgreSQL 18 running SELECT '<input>'::boolean.
const BOOL_INPUTS: BoolInput[] = [
    { input: 'true', result: 't', why: 'তালিকার পুরো শব্দ। সবচেয়ে পরিষ্কার লেখা, তবে SQL এর ভেতরে উদ্ধৃতি ছাড়া TRUE লেখাই সবচেয়ে ভালো।' },
    { input: 'yes', result: 't', why: 'true এর চারটা পুরো শব্দের একটা: true, yes, on, 1।' },
    { input: 'on', result: 't', why: 'পুরনো Configuration ফাইলের ভাষা, PostgreSQL এটাও true হিসেবে চেনে।' },
    { input: '1', result: 't', why: 'লেখা হিসেবে শুধু 1। মনে রাখুন, 01 বা 2 লেখা হিসেবে চলে না।' },
    { input: 'Y', result: 't', why: 'yes এর প্রথম অক্ষর। বড় হাতের বা ছোট হাতের, কোনো পার্থক্য নেই।' },
    { input: 'tr', result: 't', why: 'true এর শুরুর অংশ। tr দিয়ে শুরু হয় এমন শব্দ তালিকায় একটাই, তাই অস্পষ্টতা নেই।' },
    { input: ' TRUE ', result: 't', why: 'আগে আর পরের ফাঁকা জায়গা বাদ দেওয়া হয়, বড় হাতের অক্ষরও চলে।' },
    { input: 'false', result: 'f', why: 'false এর চারটা পুরো শব্দের একটা: false, no, off, 0।' },
    { input: 'nO', result: 'f', why: 'no, অক্ষরের ছাঁদ যেমনই হোক।' },
    { input: 'off', result: 'f', why: 'on এর উল্টো, তাই false।' },
    { input: 'of', result: 'f', why: 'of দিয়ে শুরু হয় শুধু off, তাই এটাও চলে।' },
    { input: '0', result: 'f', why: 'লেখা হিসেবে শুধু 0 মানে false।' },
    { input: 'o', result: null, why: 'o দিয়ে শুরু হয় on আর off দুটোই। কোনটা বোঝানো হলো বলা যায় না, তাই PostgreSQL আন্দাজ না করে Error দেয়।' },
    { input: '2', result: null, why: 'লেখা হিসেবে 2 তালিকায় নেই। মজার ব্যাপার: উদ্ধৃতি ছাড়া integer 2 কে 2::boolean করলে t আসে, কারণ সেটা সংখ্যা থেকে রূপান্তর, লেখা থেকে না।' },
    { input: 'yess', result: null, why: 'বানান ভুল। শুরুর অংশ চলে, কিন্তু বাড়তি অক্ষর চলে না।' },
    { input: 'হ্যাঁ', result: null, why: 'PostgreSQL শুধু ইংরেজি আটটা শব্দ আর তাদের শুরুর অংশ চেনে। বাংলা উত্তর আগে নিজেকে বদলে নিতে হয়।' },
    { input: 'null', result: null, why: 'উদ্ধৃতির ভেতরের null চার অক্ষরের একটা লেখা মাত্র। অজানা বোঝাতে উদ্ধৃতি ছাড়া NULL লিখুন।' },
    { input: '', result: null, why: 'ফাঁকা লেখা মানে অজানা না, এটা স্রেফ ভুল Input। অজানা মানে NULL।' },
];

/**
 * Click a spelling, see the statement and exactly what PostgreSQL 18 answered:
 * t, f, or the 22P02 error, with the rule that explains it.
 */
export function BooleanInputLab() {
    const reduce = useReducedMotion();
    const [pick, setPick] = useState(0);
    const current = BOOL_INPUTS[pick];

    return (
        <Panel
            label='Interactive'
            title='কোন লেখা boolean হয়'
            footer="প্রতিটা ফলাফল PostgreSQL 18 এ SELECT '<লেখা>'::boolean চালিয়ে নেওয়া। এই Page এর Query বক্সেও একই উত্তর আসবে।">
            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='কোন লেখা'>
                {BOOL_INPUTS.map((b, i) => (
                    <button
                        key={b.input || 'empty'}
                        type='button'
                        data-bool-input={b.input}
                        aria-pressed={pick === i}
                        onClick={() => setPick(i)}
                        className={cn(BTN, 'font-mono', pick === i ? BTN_ON : BTN_OFF)}>
                        &apos;{b.input.replaceAll(' ', '·')}&apos;
                    </button>
                ))}
            </div>

            <motion.div
                key={pick}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-start'
                data-bool-result={current.result ?? 'error'}>
                <div>
                    <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] text-foreground'>
                        SELECT &apos;{current.input}&apos;::boolean;
                    </pre>
                    <p className='mt-4 text-sm md:text-base leading-relaxed text-foreground'>{current.why}</p>
                </div>
                <div
                    className={cn(
                        'min-w-[9rem] border px-5 py-4 text-center',
                        current.result === 't' && 'border-primary bg-primary/10 text-primary',
                        current.result === 'f' && 'border-border text-foreground',
                        current.result === null && 'border-destructive/60 bg-destructive/5 text-destructive'
                    )}>
                    {current.result ? (
                        <>
                            <p className='font-mono text-[2rem] font-bold leading-none'>{current.result}</p>
                            <p className='mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em]'>
                                {current.result === 't' ? 'true' : 'false'}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className='font-mono text-[0.875rem] font-bold'>ERROR 22P02</p>
                            <p className='mt-2 font-mono text-[0.6875rem] leading-snug'>
                                invalid input syntax for type boolean: &quot;{current.input}&quot;
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. নতুন UUID Index এর কোথায় বসে: v4 বনাম v7                                       */
/* ------------------------------------------------------------------------- */

type Kind = 'v4' | 'v7';

// Five values made one after another by gen_random_uuid() and by uuidv7() on
// PostgreSQL 18, in the order they were created.
const MADE: Record<Kind, string[]> = {
    v4: [
        'a69655ac-fb1c-4f2d-9860-ec3bd1265430',
        '9528867e-0d57-4234-b62a-f71ce3e1dced',
        '063800aa-461d-4643-9117-a0df44b441bd',
        '24e08771-bc5b-46c5-8c5e-d168276e10e4',
        'a34fec95-fd38-4544-9b91-e1bf9c165018',
    ],
    v7: [
        '01a14992-63d6-7856-8dbd-e951b32f7b05',
        '01a14992-63d6-7864-9697-d38ee04c3157',
        '01a14992-63d6-7867-bc00-b4a2f123d28d',
        '01a14992-63d6-7869-80e7-af16427fa88f',
        '01a14992-63d6-786b-9b94-8d0a9a3ff064',
    ],
};

/**
 * Inserts the five real values one at a time into a sorted list, the way a
 * B-tree index keeps them. v7 values always land at the end; v4 values land
 * anywhere, which is what makes random keys scatter writes across an index.
 */
export function UuidOrderLab() {
    const reduce = useReducedMotion();
    const [kind, setKind] = useState<Kind>('v4');
    const [count, setCount] = useState(1);

    const made = MADE[kind].slice(0, count);
    const newest = made[made.length - 1];
    const sorted = [...made].sort();
    const landedAt = sorted.indexOf(newest);
    const atEnd = landedAt === sorted.length - 1;

    const choose = (k: Kind) => {
        setKind(k);
        setCount(1);
    };

    return (
        <Panel
            label='Interactive'
            title='নতুন মান সাজানো তালিকার কোথায় বসে'
            footer='দুই সারির মানই PostgreSQL 18 এ পরপর তৈরি করা আসল মান। ডান দিকের তালিকা সেভাবেই সাজানো, যেভাবে uuid এর উপরের Index মানগুলো সাজিয়ে রাখে: ছোট থেকে বড়। Index এর ভেতরের গল্প Module 13 এ।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন Version'>
                {(['v4', 'v7'] as Kind[]).map(k => (
                    <button
                        key={k}
                        type='button'
                        data-uuid-kind={k}
                        aria-pressed={kind === k}
                        onClick={() => choose(k)}
                        className={cn(BTN, kind === k ? BTN_ON : BTN_OFF)}>
                        {k === 'v4' ? 'gen_random_uuid() (v4)' : 'uuidv7() (v7)'}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='insert-next'
                    disabled={count === 5}
                    onClick={() => setCount(c => Math.min(5, c + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের Row INSERT করুন
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setCount(1)}
                    className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                        তৈরির ক্রমে
                    </p>
                    <ol className='border border-border font-mono text-[0.75rem]'>
                        {made.map((u, i) => (
                            <li
                                key={u}
                                className={cn(
                                    'flex gap-3 border-b border-border/60 px-3 py-1.5 last:border-b-0',
                                    u === newest && 'bg-primary/10 text-primary'
                                )}>
                                <span className='w-5 text-muted-foreground'>{toBn(i + 1)}</span>
                                <span className='break-all'>{u}</span>
                            </li>
                        ))}
                    </ol>
                </div>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                        সাজানো (Index এর মতো)
                    </p>
                    <ol className='border border-border font-mono text-[0.75rem]' data-landed-at={landedAt + 1}>
                        {sorted.map(u => (
                            <motion.li
                                layout={!reduce}
                                transition={{ duration: 0.35, ease: EASE }}
                                key={u}
                                className={cn(
                                    'flex gap-3 border-b border-border/60 px-3 py-1.5 last:border-b-0',
                                    u === newest && 'bg-primary/10 text-primary'
                                )}>
                                <span className='w-5 text-muted-foreground'>{toBn(made.indexOf(u) + 1)}</span>
                                <span className='break-all'>{u}</span>
                            </motion.li>
                        ))}
                    </ol>
                </div>
            </div>

            <p className='mt-5 text-sm md:text-base leading-relaxed text-foreground' data-at-end={atEnd ? 'yes' : 'no'}>
                {count === 1
                    ? 'প্রথম Row, তালিকায় একাই। এবার পরের Row INSERT করুন, আর দেখুন নতুন মানটা ডান দিকে কোথায় বসে।'
                    : atEnd
                      ? `নতুন মানটা বসল একদম শেষে, ${toBn(sorted.length)} নম্বর ঘরে। ${kind === 'v7' ? 'v7 এর শুরুতে সময়, তাই নতুন মান সবসময় আগেরগুলোর চেয়ে বড়। Index শুধু ডান কিনারে বাড়ে।' : 'এবার কাকতালীয়ভাবে শেষে পড়েছে, পরেরবার যেকোনো জায়গায় পড়তে পারে।'}`
                      : `নতুন মানটা বসল ${toBn(landedAt + 1)} নম্বর ঘরে, মাঝখানে। v4 পুরো এলোমেলো, তাই প্রতিটা নতুন Row Index এর যেকোনো জায়গায় ঢুকে পড়ে, আগের মানগুলোকে সরিয়ে।`}
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. ALTER TYPE এর প্রতিটা ধাপে pg_enum                                            */
/* ------------------------------------------------------------------------- */

interface EnumStep {
    sql: string;
    note: string;
    /** [label, sortorder] after the statement, or null when it failed. */
    rows: [string, string][] | null;
    error?: string;
}

// pg_enum after each statement, copied from PostgreSQL 18.
const ENUM_STEPS: EnumStep[] = [
    {
        sql: "CREATE TYPE buenum_seat_class AS ENUM ('economy', 'cabin');",
        note: 'দুটো মান, লেখার ক্রমে। enumsortorder হলো ক্রমের আসল চাবি, 1 আর 2।',
        rows: [
            ['economy', '1'],
            ['cabin', '2'],
        ],
    },
    {
        sql: "ALTER TYPE buenum_seat_class ADD VALUE 'suite';",
        note: 'জায়গা না বললে নতুন মান বসে একদম শেষে, পরের পূর্ণ সংখ্যা 3 নিয়ে।',
        rows: [
            ['economy', '1'],
            ['cabin', '2'],
            ['suite', '3'],
        ],
    },
    {
        sql: "ALTER TYPE buenum_seat_class ADD VALUE 'deck' BEFORE 'economy';",
        note: 'BEFORE দিয়ে সবার আগে। PostgreSQL আগের মানগুলোর নম্বর বদলায় না, নতুনটাকে দেয় 0।',
        rows: [
            ['deck', '0'],
            ['economy', '1'],
            ['cabin', '2'],
            ['suite', '3'],
        ],
    },
    {
        sql: "ALTER TYPE buenum_seat_class ADD VALUE 'business' AFTER 'economy';",
        note: 'দুটো মানের মাঝখানে বসাতে PostgreSQL ভগ্নাংশ নেয়: 1 আর 2 এর মাঝে 1.5। কারও নম্বর বদলাতে হয় না, তাই পুরনো Row ছুঁতেও হয় না।',
        rows: [
            ['deck', '0'],
            ['economy', '1'],
            ['business', '1.5'],
            ['cabin', '2'],
            ['suite', '3'],
        ],
    },
    {
        sql: "ALTER TYPE buenum_seat_class RENAME VALUE 'cabin' TO 'private_cabin';",
        note: 'নাম বদলায়, জায়গা বদলায় না। যে Row গুলোতে cabin ছিল, সেগুলো এখন নিজে থেকেই private_cabin দেখায়।',
        rows: [
            ['deck', '0'],
            ['economy', '1'],
            ['business', '1.5'],
            ['private_cabin', '2'],
            ['suite', '3'],
        ],
    },
    {
        sql: "ALTER TYPE buenum_seat_class DROP VALUE 'suite';",
        note: 'মান মুছে ফেলার কোনো উপায় নেই। PostgreSQL লেখাটা চেনে, কিন্তু কাজটা করা হয়নি বলে জানিয়ে দেয়। মুছতে হলে নতুন Type বানিয়ে Column সরাতে হয়, অংশ 011 এ দেখবেন।',
        rows: null,
        error: 'ERROR: dropping an enum value is not implemented (0A000)',
    },
];

/**
 * Steps through ALTER TYPE on an enum and shows pg_enum after each statement:
 * values added at the end, before, after, renamed, and the DROP VALUE that does
 * not exist.
 */
export function EnumChangeLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const current = ENUM_STEPS[step];
    const shown = current.rows ?? ENUM_STEPS[step - 1].rows ?? [];
    const before = step > 0 ? (ENUM_STEPS[step - 1].rows ?? []).map(r => r[0]) : [];

    return (
        <Panel
            label='Interactive'
            title='enum বদলালে pg_enum এ কী হয়'
            footer='প্রতিটা Table PostgreSQL 18 এ এই Statement গুলো একটা একটা চালিয়ে, প্রতিবার SELECT enumlabel, enumsortorder FROM pg_enum দিয়ে পড়া।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন ধাপ'>
                {ENUM_STEPS.map((s, i) => (
                    <button
                        key={s.sql}
                        type='button'
                        data-enum-step={i + 1}
                        aria-pressed={step === i}
                        onClick={() => setStep(i)}
                        className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                        ধাপ {toBn(i + 1)}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='next'
                    disabled={step === ENUM_STEPS.length - 1}
                    onClick={() => setStep(v => Math.min(ENUM_STEPS.length - 1, v + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
            </div>

            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] text-foreground'>
                {current.sql}
            </pre>

            <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-start'
                data-enum-rows={current.rows ? current.rows.length : 'error'}>
                <div className={cn('overflow-x-auto border', current.error ? 'border-destructive/50' : 'border-border')}>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40'>
                                <th className='border-b border-border px-3 py-2 text-left font-bold'>enumlabel</th>
                                <th className='border-b border-border px-3 py-2 text-left font-bold'>enumsortorder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shown.map(([label, order]) => {
                                const fresh = !current.error && step > 0 && !before.includes(label);
                                return (
                                    <tr key={label} className={cn('border-b border-border/60 last:border-b-0', fresh && 'bg-primary/10 text-primary')}>
                                        <td className='px-3 py-1'>{label}</td>
                                        <td className='px-3 py-1'>{order}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {current.error && (
                        <p className='border-t border-destructive/40 bg-destructive/5 px-3 py-2 font-mono text-[0.6875rem] text-destructive'>
                            {current.error}
                        </p>
                    )}
                </div>
                <p className='text-sm md:text-base leading-relaxed text-foreground'>{current.note}</p>
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. enum, CHECK নাকি Lookup Table: চারটা প্রশ্নে সিদ্ধান্ত                           */
/* ------------------------------------------------------------------------- */

interface Question {
    id: 'changes' | 'extra' | 'order' | 'shared';
    text: string;
}

const QUESTIONS: Question[] = [
    { id: 'changes', text: 'মানের তালিকা কি প্রায়ই বদলাবে, বা কোনো মান একদিন বাদ দিতে হতে পারে?' },
    { id: 'extra', text: 'প্রতিটা মানের সাথে বাড়তি তথ্য লাগবে কি (বাংলা নাম, রং, সক্রিয় কিনা)?' },
    { id: 'order', text: 'মানগুলোর একটা স্বাভাবিক ক্রম আছে কি, যেটা দিয়ে সাজাতে বা তুলনা করতে চান?' },
    { id: 'shared', text: 'একই তালিকা কি কয়েকটা Table এ ব্যবহার হবে?' },
];

type Answers = Record<Question['id'], boolean>;

function recommend(a: Answers): { way: string; why: string } {
    if (a.changes || a.extra) {
        return {
            way: 'Lookup Table',
            why: 'তালিকাটা Data হিসেবে থাকলে নতুন মান মানে একটা INSERT, বাদ দেওয়া মানে একটা is_active বা Row মুছে ফেলা, আর বাংলা নাম, ক্রম, রং সবই পাশে Column হিসেবে রাখা যায়। দাম একটাই: নাম দেখাতে JOIN লাগে।',
        };
    }
    if (a.order || a.shared) {
        return {
            way: 'enum Type',
            why: 'তালিকা স্থির, কিন্তু ক্রম গুরুত্বপূর্ণ বা কয়েকটা Table একই তালিকা চায়। enum একবার সংজ্ঞায়িত হয়, সবাই ভাগ করে নেয়, আর ORDER BY নিজে থেকেই ঘোষণার ক্রমে সাজায়। মনে রাখুন, মান মুছতে পারবেন না।',
        };
    }
    return {
        way: 'text + CHECK',
        why: 'ছোট, স্থির তালিকা, এক Table এর ভেতরেই। CHECK সবচেয়ে সহজ, যেকোনো Database এ চলে, আর বদলাতে হলে Constraint মুছে নতুন করে লেখা যায়। Island Tours এর bookings.status ঠিক এই পথে।',
    };
}

/**
 * Four yes or no questions about a list of allowed values, and the way that
 * fits: a lookup table when the list changes or carries data, an enum when it
 * is fixed but ordered or shared, a CHECK when it is small and local.
 */
export function ChooseWayLab() {
    const reduce = useReducedMotion();
    const [answers, setAnswers] = useState<Answers>({ changes: false, extra: false, order: false, shared: false });
    const result = recommend(answers);

    return (
        <Panel
            label='Interactive'
            title='কোন পথটা আপনার Column এর জন্য'
            footer='এটা একটা চিন্তার কাঠামো, আইন না। অনেক দল বড় হওয়ার পরে CHECK থেকে Lookup Table এ যায়, আর সেটা স্বাভাবিক।'>
            <ul className='space-y-3 mb-6'>
                {QUESTIONS.map(q => (
                    <li key={q.id} className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
                        <span className='flex-1 text-sm md:text-base leading-relaxed text-foreground'>{q.text}</span>
                        <span className='flex gap-2' role='group' aria-label={q.text}>
                            {[true, false].map(v => (
                                <button
                                    key={String(v)}
                                    type='button'
                                    data-question={q.id}
                                    data-answer={v ? 'yes' : 'no'}
                                    aria-pressed={answers[q.id] === v}
                                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                                    className={cn(BTN, answers[q.id] === v ? BTN_ON : BTN_OFF)}>
                                    {v ? 'হ্যাঁ' : 'না'}
                                </button>
                            ))}
                        </span>
                    </li>
                ))}
            </ul>
            <motion.div
                key={result.way}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='border border-primary bg-primary/5 px-5 py-4'
                data-way={result.way}>
                <p className='font-mono text-[0.875rem] font-bold text-primary'>{result.way}</p>
                <p className='mt-2 text-sm md:text-base leading-relaxed text-foreground'>{result.why}</p>
            </motion.div>
        </Panel>
    );
}
