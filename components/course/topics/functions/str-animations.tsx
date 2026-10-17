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

/** Characters the way PostgreSQL counts them: one per code point, so a Bengali vowel sign counts too. */
const chars = (s: string) => Array.from(s);

/** PostgreSQL's initcap: lower everything, then raise the first letter after any non letter or digit. */
function initcap(s: string) {
    return s.toLowerCase().replace(/(^|[^A-Za-z0-9])([a-z])/g, (_, before: string, letter: string) => before + letter.toUpperCase());
}

/* ------------------------------------------------------------------------- */
/* 1. একটা Function বেছে নিন, একটা মানের উপর চালান                               */
/* ------------------------------------------------------------------------- */

const INPUTS = [
    { id: 'name', label: 'full_name', value: 'Rahim Uddin' },
    { id: 'email', label: 'email', value: 'rahim.uddin@mail.example' },
    { id: 'phone', label: 'phone', value: '+8801000000101' },
    { id: 'title', label: 'title', value: 'Saint Martin Island Escape' },
    { id: 'messy', label: 'হাতে লেখা শহর', value: '  dhaka  ' },
    { id: 'bengali', label: 'বাংলা শহর', value: 'ঢাকা' },
] as const;

type Result = string | number;

const FUNCTIONS: {
    id: string;
    call: (arg: string) => string;
    run: (s: string) => Result;
    note: string;
}[] = [
    { id: 'upper', call: a => `upper(${a})`, run: s => s.toUpperCase(), note: 'সব অক্ষর বড় হাতের। বাংলার বড় ছোট হাত নেই, তাই বাংলা যেমন ছিল তেমনই থাকে।' },
    { id: 'lower', call: a => `lower(${a})`, run: s => s.toLowerCase(), note: 'সব অক্ষর ছোট হাতের। খোঁজার আগে দুই দিকে lower দিলে বড় ছোট হাতের তফাত আর বাধা হয় না।' },
    { id: 'initcap', call: a => `initcap(${a})`, run: initcap, note: 'প্রতিটা শব্দের প্রথম অক্ষর বড়, বাকি ছোট। অক্ষর বা অঙ্ক ছাড়া যেকোনো চিহ্নের পরে নতুন শব্দ ধরে, তাই Email এ বিন্দু আর @ এর পরের অক্ষরও বড় হয়ে যায়।' },
    { id: 'trim', call: a => `trim(${a})`, run: s => s.replace(/^ +| +$/g, ''), note: 'দুই পাশের ফাঁকা জায়গা কেটে ফেলে, মাঝের ফাঁকা জায়গায় হাত দেয় না।' },
    { id: 'char_length', call: a => `char_length(${a})`, run: s => chars(s).length, note: 'অক্ষরের সংখ্যা। ফাঁকা জায়গাও একটা অক্ষর।' },
    { id: 'octet_length', call: a => `octet_length(${a})`, run: s => new TextEncoder().encode(s).length, note: 'Byte এর সংখ্যা। ইংরেজি অক্ষর এক Byte, বাংলা অক্ষর তিন Byte।' },
    { id: 'left', call: a => `left(${a}, 5)`, run: s => chars(s).slice(0, 5).join(''), note: 'শুরু থেকে পাঁচটা অক্ষর।' },
    { id: 'right', call: a => `right(${a}, 6)`, run: s => chars(s).slice(-6).join(''), note: 'শেষ থেকে ছয়টা অক্ষর।' },
    { id: 'split1', call: a => `split_part(${a}, '@', 1)`, run: s => s.split('@')[0] ?? '', note: '@ চিহ্ন ধরে কাটলে প্রথম টুকরো। চিহ্নটা না থাকলে পুরো লেখাটাই প্রথম টুকরো।' },
    { id: 'split2', call: a => `split_part(${a}, '@', 2)`, run: s => s.split('@')[1] ?? '', note: '@ চিহ্ন ধরে কাটলে দ্বিতীয় টুকরো। চিহ্নটা না থাকলে দ্বিতীয় টুকরো নেই, তাই খালি লেখা।' },
    { id: 'replace', call: a => `replace(${a}, '+880', '0')`, run: s => s.split('+880').join('0'), note: 'যেখানে যতবার +880 পাবে, সবখানে 0 বসাবে। না পেলে কিছুই বদলায় না।' },
    { id: 'lpad', call: a => `lpad(${a}, 15, '*')`, run: s => (chars(s).length >= 15 ? chars(s).slice(0, 15).join('') : '*'.repeat(15 - chars(s).length) + s), note: 'বাঁ দিকে * বসিয়ে লেখাটাকে ঠিক ১৫ অক্ষর বানায়। লেখা আগে থেকেই লম্বা হলে ১৫ অক্ষরে কেটে ফেলে।' },
];

/** Pick one real value and one function; the lab shows the SQL call and the exact value PostgreSQL returns. */
export function StringToolLab() {
    const reduce = useReducedMotion();
    const [inputId, setInputId] = useState<(typeof INPUTS)[number]['id']>('name');
    const [fnId, setFnId] = useState('upper');
    const input = INPUTS.find(i => i.id === inputId)!;
    const fn = FUNCTIONS.find(f => f.id === fnId)!;
    const result = fn.run(input.value);
    const literal = `'${input.value}'`;
    const shown = typeof result === 'number' ? toBn(result) : `'${result}'`;
    const unchanged = typeof result === 'string' && result === input.value;

    return (
        <Panel
            label='Interactive'
            title='একটা মান, একটা Function'
            footer='প্রতিটা ফলাফল আসল PostgreSQL এ একই Function চালিয়ে মিলিয়ে নেওয়া। ফলাফলের দুই পাশের উদ্ধৃতিচিহ্ন দেখায় লেখাটা ঠিক কোথায় শুরু আর শেষ, যাতে ফাঁকা জায়গা চোখে পড়ে।'>
            <div className='space-y-5'>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>১. মান বেছে নিন</p>
                    <div className='flex flex-wrap gap-2'>
                        {INPUTS.map(i => (
                            <button
                                key={i.id}
                                type='button'
                                data-input={i.id}
                                aria-pressed={i.id === inputId}
                                onClick={() => setInputId(i.id)}
                                className={cn(BTN, i.id === inputId ? BTN_ON : BTN_OFF)}>
                                <span className='block font-mono text-[0.625rem] opacity-70'>{i.label}</span>
                                <span className='block whitespace-pre'>&apos;{i.value}&apos;</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>২. Function বেছে নিন</p>
                    <div className='flex flex-wrap gap-2'>
                        {FUNCTIONS.map(f => (
                            <button
                                key={f.id}
                                type='button'
                                data-fn={f.id}
                                aria-pressed={f.id === fnId}
                                onClick={() => setFnId(f.id)}
                                className={cn(BTN, 'font-mono', f.id === fnId ? BTN_ON : BTN_OFF)}>
                                {f.call('x')}
                            </button>
                        ))}
                    </div>
                </div>
                <motion.div
                    key={`${inputId}-${fnId}`}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className='border border-primary/40 bg-primary/5 p-4 md:p-5'
                    data-result={String(result)}>
                    <p className='font-mono text-[0.8125rem] text-muted-foreground break-all'>
                        SELECT <span className='text-foreground'>{fn.call(literal)}</span>;
                    </p>
                    <p className='mt-3 font-mono text-lg md:text-xl font-bold text-primary whitespace-pre break-all'>{shown}</p>
                    <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                        {fn.note}
                        {unchanged && ' এই মানের বেলায় কিছুই বদলায়নি।'}
                    </p>
                </motion.div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ধাপে ধাপে পরিষ্কার: Function এর ভেতরে Function                            */
/* ------------------------------------------------------------------------- */

const PIPELINES = [
    {
        id: 'name',
        label: 'নাম কার্ড',
        input: "'  rAHIM uDDIN  '",
        steps: [
            { sql: "trim('  rAHIM uDDIN  ')", value: "'rAHIM uDDIN'", why: 'দুই পাশের ফাঁকা জায়গা গেল।' },
            { sql: "initcap(trim('  rAHIM uDDIN  '))", value: "'Rahim Uddin'", why: 'প্রতিটা শব্দের প্রথম অক্ষর বড়, বাকিগুলো ছোট।' },
            { sql: "initcap(trim('  rAHIM uDDIN  ')) || ' (Dhaka)'", value: "'Rahim Uddin (Dhaka)'", why: 'পরিষ্কার নামের পরে শহরটা জুড়ে দেওয়া হলো।' },
        ],
    },
    {
        id: 'phone',
        label: 'SMS এর নম্বর',
        input: "'+880 1000-000101'",
        steps: [
            { sql: "replace('+880 1000-000101', ' ', '')", value: "'+8801000-000101'", why: 'মাঝের ফাঁকা জায়গাটা মুছে গেল।' },
            { sql: "replace(replace('+880 1000-000101', ' ', ''), '-', '')", value: "'+8801000000101'", why: 'ড্যাশ চিহ্নটাও মুছে গেল, এবার নম্বরটা একটানা।' },
            { sql: "replace(replace(replace('+880 1000-000101', ' ', ''), '-', ''), '+880', '0')", value: "'01000000101'", why: 'দেশের কোড +880 এর জায়গায় দেশি শুরুর 0।' },
        ],
    },
    {
        id: 'code',
        label: 'Booking Code',
        input: '7',
        steps: [
            { sql: '7::text', value: "'7'", why: 'সংখ্যাটাকে লেখায় বদলানো হলো, কারণ lpad শুধু লেখা নেয়। এই :: এর বিস্তারিত Lesson 04 এ।' },
            { sql: "lpad(7::text, 5, '0')", value: "'00007'", why: 'বাঁ দিকে শূন্য বসিয়ে ঠিক পাঁচ অক্ষর।' },
            { sql: "'IT-' || lpad(7::text, 5, '0')", value: "'IT-00007'", why: 'সামনে কোম্পানির ছোট নাম জুড়ে তৈরি হলো Booking Code।' },
        ],
    },
];

/** Step a messy value through one function at a time and watch the expression grow from the inside out. */
export function CleanupPipelineLab() {
    const reduce = useReducedMotion();
    const [pipelineId, setPipelineId] = useState('name');
    const [step, setStep] = useState(0);
    const pipeline = PIPELINES.find(p => p.id === pipelineId)!;
    const last = pipeline.steps.length;

    return (
        <Panel
            label='Interactive'
            title='Function এর ভেতরে Function'
            footer='প্রতিটা ধাপের মান আসল PostgreSQL এ চালিয়ে মিলিয়ে নেওয়া। লম্বা Expression পড়ার নিয়ম একটাই: সবচেয়ে ভেতরের বন্ধনী আগে, তারপর বাইরের দিকে।'>
            <div className='flex flex-wrap gap-2 mb-6'>
                {PIPELINES.map(p => (
                    <button
                        key={p.id}
                        type='button'
                        data-pipeline={p.id}
                        aria-pressed={p.id === pipelineId}
                        onClick={() => {
                            setPipelineId(p.id);
                            setStep(0);
                        }}
                        className={cn(BTN, p.id === pipelineId ? BTN_ON : BTN_OFF)}>
                        {p.label}
                    </button>
                ))}
            </div>

            <ol className='space-y-3' data-step={step}>
                <li className='flex flex-wrap items-baseline gap-3 border border-border bg-background px-4 py-3'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>শুরু</span>
                    <span className='font-mono text-sm whitespace-pre'>{pipeline.input}</span>
                </li>
                {pipeline.steps.slice(0, step).map((s, i) => (
                    <motion.li
                        key={`${pipelineId}-${i}`}
                        initial={reduce ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className={cn(
                            'border px-4 py-3',
                            i === step - 1 ? 'border-primary/50 bg-primary/5' : 'border-border bg-background'
                        )}>
                        <p className='font-mono text-[0.75rem] text-muted-foreground break-all'>
                            ধাপ {toBn(i + 1)}: <span className='text-foreground'>{s.sql}</span>
                        </p>
                        <p className='mt-1.5 font-mono text-base font-bold text-primary whitespace-pre'>{s.value}</p>
                        <p className='mt-1 text-sm text-muted-foreground'>{s.why}</p>
                    </motion.li>
                ))}
            </ol>

            <div className='mt-5 flex flex-wrap items-center gap-2'>
                <button type='button' data-action='back' onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    আগের ধাপ
                </button>
                <button type='button' data-action='next' onClick={() => setStep(s => Math.min(last, s + 1))} disabled={step === last} className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground'>
                    {toBn(step)} / {toBn(last)}
                </span>
            </div>
        </Panel>
    );
}
