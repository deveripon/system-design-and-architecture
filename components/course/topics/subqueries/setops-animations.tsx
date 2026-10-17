'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
    combine,
    SET_DATASETS,
    SET_OPS,
    setOpSql,
    sortValues,
    type SetDatasetKey,
    type SetOp,
} from './setops-data';

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
/* 1. দুটো আসল তালিকা, ছয় রকম Set Operation                                     */
/* ------------------------------------------------------------------------- */

const OP_RULE: Record<SetOp, string> = {
    'union-all': 'A এর সব Row, তার নিচে B এর সব Row। কিছু বাদ যায় না, একই মান দুইবার এলে দুইবারই থাকে।',
    union: 'A আর B একসাথে, কিন্তু একই Row একবারের বেশি না। ডুপ্লিকেট মোছা হয় দুই দিক মিলিয়েই, এমনকি এক দিকের ভেতরেও।',
    intersect: 'শুধু যে মান A তেও আছে, B তেও আছে। প্রতিটা মান একবার।',
    'intersect-all': 'দুই দিকেই যতবার আছে, তার কম সংখ্যাটা যতবার, ততবার। A তে ২ বার আর B তে ৪ বার থাকলে ফলাফলে ২ বার।',
    except: 'A তে আছে কিন্তু B তে নেই, এমন মান। প্রতিটা একবার। দিক বদলালে উত্তর বদলায়।',
    'except-reverse': 'এবার উল্টো: B তে আছে কিন্তু A তে নেই, এমন মান। একই দুটো তালিকা, অন্য প্রশ্ন।',
};

/**
 * Two real lists from the sample database and the six ways to combine them.
 * The input chips light up when their value reaches the result, so the reader
 * sees which rows each operator keeps, drops or merges. Every combination was
 * checked against PostgreSQL row for row.
 */
export function SetOpsLab() {
    const reduce = useReducedMotion();
    const [datasetKey, setDatasetKey] = useState<SetDatasetKey>('places');
    const [op, setOp] = useState<SetOp>('union-all');

    const dataset = SET_DATASETS.find(d => d.key === datasetKey)!;
    const result = sortValues(combine(dataset.left, dataset.right, op), dataset.numeric);
    const leftSet = new Set(dataset.left);
    const rightSet = new Set(dataset.right);

    const leftLit = (v: string) => {
        if (op === 'union-all' || op === 'union') return true;
        if (op === 'intersect' || op === 'intersect-all') return rightSet.has(v);
        if (op === 'except') return !rightSet.has(v);
        return false;
    };
    const rightLit = (v: string) => {
        if (op === 'union-all' || op === 'union') return true;
        if (op === 'intersect' || op === 'intersect-all') return leftSet.has(v);
        if (op === 'except-reverse') return !leftSet.has(v);
        return false;
    };

    const chip = (v: string, lit: boolean, key: string) => (
        <span
            key={key}
            className={cn(
                'px-2 py-1 border font-mono text-[0.6875rem] transition-colors',
                lit ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground/50 line-through'
            )}>
            {v}
        </span>
    );

    return (
        <Panel
            label='Interactive'
            title='দুটো তালিকা, ছয়ভাবে মেলানো'
            footer={
                <>
                    তিনটা তালিকাই Sample Database এর আসল Row। উজ্জ্বল ঘর মানে সেই মান ফলাফলে পৌঁছায়, কাটা ঘর মানে এই
                    Operation তাকে রাখে না। প্রতিটা ফলাফল PostgreSQL এ চালিয়ে মিলিয়ে দেখা।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                {SET_DATASETS.map(d => (
                    <button
                        key={d.key}
                        type='button'
                        data-dataset={d.key}
                        aria-pressed={d.key === datasetKey}
                        onClick={() => setDatasetKey(d.key)}
                        className={cn(BTN, d.key === datasetKey ? BTN_ON : BTN_OFF)}>
                        {d.label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
                {SET_OPS.map(o => (
                    <button
                        key={o.key}
                        type='button'
                        data-op={o.key}
                        aria-pressed={o.key === op}
                        onClick={() => setOp(o.key)}
                        className={cn(BTN, 'font-mono', o.key === op ? BTN_ON : BTN_OFF)}>
                        {o.label}
                    </button>
                ))}
            </div>

            <pre className='mb-6 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {setOpSql(dataset, op)}
            </pre>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='border border-border bg-background p-4'>
                    <p className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3'>
                        A: {dataset.leftName} ({toBn(dataset.left.length)}টা Row)
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                        {dataset.left.map((v, i) => chip(v, leftLit(v), `l${i}`))}
                    </div>
                </div>
                <div className='border border-border bg-background p-4'>
                    <p className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3'>
                        B: {dataset.rightName} ({toBn(dataset.right.length)}টা Row)
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                        {dataset.right.map((v, i) => chip(v, rightLit(v), `r${i}`))}
                    </div>
                </div>
                <motion.div
                    key={`${datasetKey}-${op}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className='border border-primary/50 bg-primary/5 p-4'
                    data-count={result.length}>
                    <p className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary mb-3'>
                        ফলাফল ({toBn(result.length)}টা Row)
                    </p>
                    {result.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>কোনো Row নেই। ফাঁকা ফলাফলও একটা উত্তর।</p>
                    ) : (
                        <div className='flex flex-wrap gap-1.5'>
                            {result.map((v, i) => (
                                <span
                                    key={`o${i}`}
                                    className='px-2 py-1 border border-primary/60 font-mono text-[0.6875rem] text-foreground'>
                                    {v}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
            <p className='mt-5 text-sm leading-relaxed text-muted-foreground'>{OP_RULE[op]}</p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. চালানোর আগে আন্দাজ: কয়টা Row আসবে                                         */
/* ------------------------------------------------------------------------- */

interface CountCase {
    id: string;
    sql: string;
    options: number[];
    answer: number;
    why: string;
}

const COUNT_CASES: CountCase[] = [
    {
        id: 'contacts',
        sql: 'SELECT full_name FROM customers\nUNION ALL\nSELECT full_name FROM guides;',
        options: [15, 20, 75],
        answer: 20,
        why: '১৫ জন Customer আর ৫ জন Guide, একটার নিচে আরেকটা। 75 হতো CROSS JOIN এ, যেখানে প্রত্যেকের সাথে প্রত্যেকের জোড়া হয়।',
    },
    {
        id: 'places',
        sql: 'SELECT city FROM customers\nUNION\nSELECT region FROM destinations;',
        options: [22, 9, 4],
        answer: 9,
        why: 'UNION ALL হলে 22 (15 + 7)। UNION সব ডুপ্লিকেট মোছে, এমনকি ছয়বার আসা Dhaka ও একবারে নামে। আলাদা নাম মোট ৯টা।',
    },
    {
        id: 'both',
        sql: 'SELECT city FROM customers\nINTERSECT\nSELECT region FROM destinations;',
        options: [4, 5, 0],
        answer: 4,
        why: 'Barishal, Chattogram, Khulna আর Sylhet দুই তালিকাতেই আছে। 5 হতো INTERSECT ALL এ, কারণ Chattogram দুই দিকেই একাধিকবার।',
    },
    {
        id: 'reverse',
        sql: 'SELECT region FROM destinations\nEXCEPT\nSELECT city FROM customers;',
        options: [0, 2, 5],
        answer: 0,
        why: 'চারটা অঞ্চলের প্রতিটাতেই অন্তত একজন Customer থাকেন, তাই বাদ দেওয়ার পর কিছু থাকে না। উল্টো দিকে লিখলে আসত 5টা শহর।',
    },
    {
        id: 'except-all',
        sql: 'SELECT city FROM customers\nEXCEPT ALL\nSELECT region FROM destinations;',
        options: [5, 10, 13],
        answer: 10,
        why: '15 টা শহর থেকে প্রতিটা মিলের জন্য একটা করে কাটা যায়: Chattogram ২টা, Barishal, Khulna, Sylhet ১টা করে। থাকে 10টা, তার মধ্যে Dhaka ছয়বার।',
    },
    {
        id: 'precedence',
        sql: 'VALUES (1), (2)\nUNION\nVALUES (2), (3)\nINTERSECT\nVALUES (3);',
        options: [1, 3, 4],
        answer: 3,
        why: 'INTERSECT আগে চলে: {2, 3} আর {3} এর মিল {3}। তারপর {1, 2} এর সাথে UNION, ফলে 1, 2, 3। বাঁ থেকে ডানে পড়ে ভাবলে উত্তর হতো 1।',
    },
    {
        id: 'null-safe',
        sql: 'SELECT guide_id FROM guides\nEXCEPT\nSELECT guide_id FROM tours;',
        options: [0, 1, 5],
        answer: 1,
        why: 'Nazmul Karim (guide_id 5) এর কোনো ট্যুর নেই। tours এ একটা guide_id NULL থাকলেও EXCEPT বিভ্রান্ত হয় না। একই প্রশ্ন NOT IN দিয়ে লিখলে আসত 0।',
    },
    {
        id: 'limit',
        sql: 'SELECT title FROM tours\nUNION ALL\nSELECT title FROM tours\nORDER BY title\nLIMIT 2;',
        options: [2, 4, 18],
        answer: 2,
        why: 'বন্ধনী ছাড়া LIMIT পুরো ফলাফলের উপর বসে, একটা অংশের উপর না। 18টা Row জোড়া লাগে, তারপর সাজিয়ে প্রথম 2টা।',
    },
];

/**
 * Predict the row count of eight set operations on the real data before the
 * answer is shown. Each case targets one rule: stacking, deduplication, the
 * direction of EXCEPT, the ALL variants, precedence, NULLs and LIMIT.
 */
export function RowCountLab() {
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState<Record<string, number>>({});
    const current = COUNT_CASES[index];
    const picked = choices[current.id];
    const score = COUNT_CASES.filter(c => choices[c.id] === c.answer).length;
    const answered = Object.keys(choices).length;

    return (
        <Panel
            label='Interactive'
            title='চালানোর আগে আন্দাজ: কয়টা Row'
            footer={<>প্রতিটা উত্তর Sample Database এ PostgreSQL 18 চালিয়ে পাওয়া। আগে নিজে হিসাব করুন, তারপর বাছুন।</>}>
            <div className='flex flex-wrap gap-2 mb-5'>
                {COUNT_CASES.map((c, i) => (
                    <button
                        key={c.id}
                        type='button'
                        data-case={c.id}
                        aria-pressed={i === index}
                        onClick={() => setIndex(i)}
                        className={cn(BTN, 'font-mono', i === index ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}
                        {choices[c.id] !== undefined && (choices[c.id] === c.answer ? ' ✓' : ' ✗')}
                    </button>
                ))}
            </div>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground'>
                {current.sql}
            </pre>
            <div className='flex flex-wrap gap-2 mb-5'>
                {current.options.map(n => (
                    <button
                        key={n}
                        type='button'
                        data-choice={n}
                        onClick={() => setChoices(prev => ({ ...prev, [current.id]: n }))}
                        className={cn(
                            BTN,
                            'font-mono min-w-14 text-center',
                            picked === undefined
                                ? BTN_OFF
                                : n === current.answer
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : n === picked
                                    ? 'border-destructive/60 bg-destructive/5 text-destructive'
                                    : BTN_OFF
                        )}>
                        {n} Row
                    </button>
                ))}
            </div>
            {picked !== undefined && (
                <div
                    data-result={picked === current.answer ? 'right' : 'wrong'}
                    className={cn(
                        'border px-4 py-3 text-sm leading-relaxed',
                        picked === current.answer
                            ? 'border-primary/50 bg-primary/5 text-foreground'
                            : 'border-destructive/40 bg-destructive/5 text-foreground'
                    )}>
                    <strong>{picked === current.answer ? 'ঠিক। ' : `উত্তর ${current.answer}। `}</strong>
                    {current.why}
                </div>
            )}
            <p className='mt-5 font-mono text-[0.6875rem] text-muted-foreground' data-score={score}>
                {toBn(answered)}টা উত্তর দিয়েছেন, ঠিক {toBn(score)}টা, মোট {toBn(COUNT_CASES.length)}টা প্রশ্ন।
            </p>
        </Panel>
    );
}
