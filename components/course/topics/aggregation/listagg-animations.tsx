'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
    distinctAllowed,
    effectiveOrder,
    type GroupKey,
    type InnerOrder,
    type LabChoice,
    labResult,
    labSql,
    type ListFunction,
    type ListValue,
} from './listagg-data';

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

function Choices<T extends string>({
    label,
    options,
    value,
    onChange,
    attr,
    isDisabled,
}: {
    label: string;
    options: { id: T; text: string }[];
    value: T;
    onChange: (v: T) => void;
    attr: string;
    isDisabled?: (id: T) => boolean;
}) {
    return (
        <div>
            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>{label}</p>
            <div className='flex flex-wrap gap-2'>
                {options.map(o => {
                    const disabled = isDisabled?.(o.id) ?? false;
                    return (
                        <button
                            key={o.id}
                            type='button'
                            {...{ [attr]: o.id }}
                            disabled={disabled}
                            aria-pressed={o.id === value}
                            onClick={() => onChange(o.id)}
                            className={cn(BTN, disabled ? BTN_DISABLED : o.id === value ? BTN_ON : BTN_OFF)}>
                            {o.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. প্রতিটা দলের তালিকা নিজে বানান                                           */
/* ------------------------------------------------------------------------- */

const GROUPS: { id: GroupKey; text: string }[] = [
    { id: 'customer_id', text: 'customer_id' },
    { id: 'departure_id', text: 'departure_id' },
    { id: 'status', text: 'status' },
];
const VALUES: { id: ListValue; text: string }[] = [
    { id: 'booking_id', text: 'booking_id' },
    { id: 'status', text: 'status' },
    { id: 'seats', text: 'seats' },
];
const ORDERS: { id: InnerOrder; text: string }[] = [
    { id: 'booking_id', text: 'ORDER BY booking_id' },
    { id: 'booked_at_desc', text: 'ORDER BY booked_at DESC' },
    { id: 'value', text: 'ORDER BY তালিকার মান' },
];
const FUNCTIONS: { id: ListFunction; text: string }[] = [
    { id: 'string_agg', text: 'string_agg' },
    { id: 'array_agg', text: 'array_agg' },
];

/**
 * Pick what to group by, what to list, how to order inside the list, DISTINCT
 * and the function. The lab writes the query and shows the result for the 24
 * real bookings; every combination was compared with PostgreSQL 18.
 */
export function ListAggLab() {
    const reduce = useReducedMotion();
    const [choice, setChoice] = useState<LabChoice>({
        group: 'customer_id',
        value: 'booking_id',
        order: 'booking_id',
        distinct: false,
        fn: 'string_agg',
    });
    const set = (patch: Partial<LabChoice>) => setChoice(c => ({ ...c, ...patch }));
    const canDistinct = distinctAllowed(choice.value);
    const distinctOn = choice.distinct && canDistinct;
    const order = effectiveOrder(choice);
    const rows = labResult(choice);
    const textSortTrap = choice.fn === 'string_agg' && order === 'value' && choice.value === 'booking_id';

    return (
        <Panel
            label='Interactive'
            title='একটা Query, অনেক রকম তালিকা'
            footer={
                <>
                    Data হলো Island Tours এর আসল ২৪টা Booking। প্রতিটা বোতামের ফল PostgreSQL 18 এ চালিয়ে মিলিয়ে নেওয়া,
                    সবগুলো সম্ভাব্য জোড়া মিলিয়ে ৯০টা। লক্ষ করুন দুটো ORDER BY: ভেতরেরটা তালিকার ভেতরের ক্রম ঠিক করে,
                    বাইরেরটা দলগুলোর ক্রম।
                </>
            }>
            <div className='grid gap-5 md:grid-cols-2 mb-6'>
                <Choices label='দল বাঁধুন (GROUP BY)' options={GROUPS} value={choice.group} onChange={g => set({ group: g })} attr='data-group' />
                <Choices
                    label='তালিকায় কী থাকবে'
                    options={VALUES}
                    value={choice.value}
                    onChange={v => set({ value: v })}
                    attr='data-value'
                />
                <Choices
                    label='তালিকার ভেতরের ক্রম'
                    options={ORDERS}
                    value={order}
                    onChange={o => set({ order: o })}
                    attr='data-order'
                    isDisabled={() => distinctOn}
                />
                <div className='space-y-5'>
                    <Choices label='Function' options={FUNCTIONS} value={choice.fn} onChange={f => set({ fn: f })} attr='data-fn' />
                    <div>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>DISTINCT</p>
                        <button
                            type='button'
                            data-distinct={distinctOn ? 'on' : 'off'}
                            disabled={!canDistinct}
                            aria-pressed={distinctOn}
                            onClick={() => set({ distinct: !choice.distinct })}
                            className={cn(BTN, !canDistinct ? BTN_DISABLED : distinctOn ? BTN_ON : BTN_OFF)}>
                            {distinctOn ? 'DISTINCT চালু' : 'DISTINCT বন্ধ'}
                        </button>
                    </div>
                </div>
            </div>

            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground mb-4'>
                {labSql(choice)}
            </pre>

            <div className='space-y-2 mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                {!canDistinct && (
                    <p>booking_id প্রতিটা Booking এর আলাদা, তাই এখানে DISTINCT এর কিছু করার নেই। বোতামটা তাই বন্ধ।</p>
                )}
                {distinctOn && (
                    <p>
                        DISTINCT চালু থাকলে PostgreSQL শুধু তালিকার মান দিয়েই সাজাতে দেয়, অন্য কিছু দিয়ে চাইলে Error
                        দেয়। তাই ক্রমের বোতামগুলো এখন বন্ধ।
                    </p>
                )}
                {textSortTrap && (
                    <p className='text-primary'>
                        খেয়াল করুন: booking_id::text দিয়ে সাজালে লেখা হিসেবে সাজায়, তাই 17 আগে আসে 8 এর। সংখ্যার ক্রম
                        চাইলে ORDER BY booking_id লিখুন, কারণ ভেতরের ORDER BY যেকোনো Column দিয়ে হতে পারে।
                    </p>
                )}
            </div>

            <div className='overflow-x-auto border border-border' data-rows={rows.length}>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            <th className='border-b border-border px-3 py-2 text-left font-bold text-foreground'>{choice.group}</th>
                            <th className='border-b border-border px-3 py-2 text-left font-bold text-foreground'>list</th>
                            <th className='border-b border-border px-3 py-2 text-right font-bold text-muted-foreground'>Row</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <motion.tr
                                key={`${choice.group}-${row.key}`}
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className='border-b border-border/60 last:border-b-0'>
                                <td className='px-3 py-1.5 text-foreground/90'>{row.key}</td>
                                <td className='px-3 py-1.5 text-primary whitespace-pre'>{row.list}</td>
                                <td className='px-3 py-1.5 text-right text-muted-foreground'>{toBn(row.count)}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className='mt-2 font-mono text-[0.625rem] text-muted-foreground'>
                {toBn(rows.length)}টা দল, ২৪টা Row থেকে। শেষ Column টা দেখায় প্রতিটা দলে কয়টা Row মিলে তালিকাটা হলো।
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. আগে আন্দাজ, তারপর আসল উত্তর                                              */
/* ------------------------------------------------------------------------- */

interface PredictCase {
    id: string;
    engine: 'PostgreSQL' | 'MySQL';
    query: string;
    question: string;
    options: string[];
    answer: number;
    output: string;
    why: string;
}

const CASES: PredictCase[] = [
    {
        id: 'all-null',
        engine: 'PostgreSQL',
        query: "SELECT string_agg(phone, ', ')\nFROM customers\nWHERE city = 'Kolkata';",
        question: 'Kolkata তে একজনই Customer, Priya Sharma, আর তাঁর phone নেই। কী আসবে?',
        options: ["'' (খালি লেখা)", 'NULL', "'NULL' লেখা", 'Error'],
        answer: 1,
        output: ' string_agg\n------------\n NULL',
        why: 'string_agg NULL বাদ দিয়ে জোড়ে। জোড়ার মতো একটা মানও না থাকলে উত্তর খালি লেখা না, NULL। Report এ কিছু দেখাতে চাইলে বাইরে COALESCE দিন।',
    },
    {
        id: 'array-null',
        engine: 'PostgreSQL',
        query: "SELECT array_agg(phone)\nFROM customers\nWHERE city = 'Kolkata';",
        question: 'একই Row, এবার array_agg। কী আসবে?',
        options: ['NULL', '{}', '{NULL}', 'Error'],
        answer: 2,
        output: ' array_agg\n-----------\n {NULL}',
        why: 'array_agg NULL কে ফেলে দেয় না, তালিকায় একটা ঘর হিসেবে রেখে দেয়। তাই এক ঘরের একটা Array, যার ভেতরে NULL। এটাই string_agg আর array_agg এর বড় পার্থক্য।',
    },
    {
        id: 'no-rows',
        engine: 'PostgreSQL',
        query: "SELECT string_agg(full_name, ', '), count(*)\nFROM customers\nWHERE city = 'Paris';",
        question: 'Paris এ কোনো Customer নেই। string_agg আর count(*) কী দেবে?',
        options: ['NULL আর 0', "'' আর 0", 'কোনো Row ই আসবে না', 'NULL আর NULL'],
        answer: 0,
        output: ' string_agg | count\n------------+-------\n NULL       |     0',
        why: 'GROUP BY ছাড়া Aggregate সবসময় একটা Row দেয়, শূন্য Row থেকেও। count গোনে বলে 0, কিন্তু জোড়ার মতো কিছু নেই বলে string_agg NULL।',
    },
    {
        id: 'integer',
        engine: 'PostgreSQL',
        query: "SELECT customer_id, string_agg(booking_id, ', ')\nFROM bookings\nGROUP BY customer_id;",
        question: 'booking_id একটা integer। এভাবে লিখলে কী হবে?',
        options: ['1, 8, 17 এর মতো তালিকা', 'Error', 'সংখ্যাগুলোর যোগফল', 'NULL'],
        answer: 1,
        output: 'ERROR:  function string_agg(integer, unknown) does not exist\nHINT:  No function matches the given name and argument types.\n       You might need to add explicit type casts.',
        why: 'string_agg শুধু লেখা জোড়ে। integer দিলে PostgreSQL নিজে থেকে বদলায় না, তাই এমন কোনো Function খুঁজে পায় না। booking_id::text লিখলেই চলে।',
    },
    {
        id: 'distinct-order',
        engine: 'PostgreSQL',
        query: "SELECT status,\n       string_agg(DISTINCT method, ', ' ORDER BY payment_id)\nFROM payments\nGROUP BY status;",
        question: 'DISTINCT এর সাথে অন্য একটা Column দিয়ে সাজাতে চাইলে?',
        options: ['payment_id এর ক্রমে আলাদা আলাদা method', 'Error', 'DISTINCT বাদ পড়ে যায়', 'ORDER BY বাদ পড়ে যায়'],
        answer: 1,
        output: 'ERROR:  in an aggregate with DISTINCT, ORDER BY expressions\n        must appear in argument list',
        why: 'একই method এর অনেকগুলো payment_id থাকতে পারে, তাই কোনটা ধরে সাজাবে PostgreSQL বুঝতে পারে না। DISTINCT থাকলে ভেতরের ORDER BY তে শুধু তালিকার মানটাই চলে: ORDER BY method।',
    },
    {
        id: 'mysql-default',
        engine: 'MySQL',
        query: 'SELECT customer_id, GROUP_CONCAT(booking_id) AS ids\nFROM bookings\nGROUP BY customer_id;',
        question: 'MySQL এ Separator না দিলে প্রথম Customer এর তালিকা কেমন দেখাবে?',
        options: ['1, 8, 17', '1,8,17', '1 8 17', 'Error, Separator দিতেই হবে'],
        answer: 1,
        output: '+-------------+--------+\n| customer_id | ids    |\n|           1 | 1,8,17 |',
        why: 'GROUP_CONCAT এর নিজের Separator হলো শুধু একটা কমা, Space ছাড়া। সংখ্যাকে লেখায় বদলানোর দরকারও নেই, MySQL নিজে করে নেয়। সুন্দর দেখাতে SEPARATOR \', \' লিখুন।',
    },
    {
        id: 'mysql-cut',
        engine: 'MySQL',
        query: "SET SESSION group_concat_max_len = 20;\nSELECT GROUP_CONCAT(full_name ORDER BY customer_id\n                    SEPARATOR ', ')\nFROM customers;",
        question: 'তালিকার সীমা ২০ অক্ষর, অথচ পনেরোজনের নাম জুড়লে ২১০ অক্ষর। কী হবে?',
        options: ['Error, Query থেমে যাবে', 'পুরো ২১০ অক্ষর আসবে', 'প্রথম ২০ অক্ষর আসবে, সাথে শুধু একটা Warning', 'NULL আসবে'],
        answer: 2,
        output: "Rahim Uddin, Nusrat    (২০ অক্ষর)\nWarning 1260: Row 2 was cut by GROUP_CONCAT()",
        why: 'MySQL তালিকাটা চুপচাপ কেটে ফেলে, Error দেয় না, শুধু একটা Warning, যা App এর Code প্রায় কখনো পড়ে না। আসল সীমা ১০২৪, তাই ছোট Data তে ধরা পড়ে না, বড় Data তে তালিকা নিঃশব্দে ছোট হয়ে যায়।',
    },
];

/** Seven small questions where the output surprises people; pick an answer, then see the real one. */
export function PredictListLab() {
    const [active, setActive] = useState(CASES[0].id);
    const [picks, setPicks] = useState<Record<string, number>>({});
    const current = CASES.find(c => c.id === active) ?? CASES[0];
    const picked = picks[current.id];
    const answered = picked !== undefined;
    const score = CASES.filter(c => picks[c.id] === c.answer).length;

    return (
        <Panel
            label='Predict'
            title='আগে আন্দাজ, তারপর আসল উত্তর'
            footer={
                <>
                    প্রতিটা উত্তর আসল PostgreSQL 18 আর MySQL 8.4.11 এ চালিয়ে নেওয়া। প্রথম পাঁচটা PostgreSQL, শেষের
                    দুটো MySQL এর GROUP_CONCAT।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-6'>
                {CASES.map((c, i) => (
                    <button
                        key={c.id}
                        type='button'
                        data-case={c.id}
                        aria-pressed={c.id === active}
                        onClick={() => setActive(c.id)}
                        className={cn(BTN, c.id === active ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}. {c.engine}
                        {picks[c.id] !== undefined && (picks[c.id] === c.answer ? ' ✓' : ' ✗')}
                    </button>
                ))}
            </div>
            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground mb-4'>
                {current.query}
            </pre>
            <p className='text-sm md:text-base leading-relaxed text-foreground mb-4'>{current.question}</p>
            <div className='grid gap-2 sm:grid-cols-2 mb-4'>
                {current.options.map((option, i) => {
                    const isAnswer = i === current.answer;
                    const isPicked = i === picked;
                    return (
                        <button
                            key={option}
                            type='button'
                            data-choice={i}
                            disabled={answered}
                            onClick={() => setPicks(p => ({ ...p, [current.id]: i }))}
                            className={cn(
                                BTN,
                                'py-2.5',
                                !answered && BTN_OFF,
                                answered && isAnswer && 'border-primary bg-primary/10 text-primary',
                                answered && isPicked && !isAnswer && 'border-destructive/60 bg-destructive/5 text-destructive',
                                answered && !isAnswer && !isPicked && 'border-border/50 text-muted-foreground/50'
                            )}>
                            {option}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <div data-correct={picked === current.answer ? 'yes' : 'no'} className='space-y-3'>
                    <pre className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        {current.output}
                    </pre>
                    <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>{current.why}</p>
                </div>
            )}
            <p className='mt-4 font-mono text-[0.625rem] text-muted-foreground' data-score={score}>
                এখন পর্যন্ত সঠিক: {toBn(score)} / {toBn(CASES.length)}
            </p>
        </Panel>
    );
}
