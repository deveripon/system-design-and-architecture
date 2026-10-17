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
/* 1. ct_tour_extras, একটা একটা Column করে                                       */
/* ------------------------------------------------------------------------- */

interface BuildStep {
    column: string;
    type: string;
    why: string;
}

const BUILD: BuildStep[] = [
    {
        column: 'extra_id',
        type: 'integer',
        why: 'প্রতিটা Extra কে আলাদা করে চেনার একটা নম্বর। পূর্ণ সংখ্যা, তাই integer। এখন নম্বরটা নিজে হাতে দিতে হবে, নিজে থেকে বাড়ানোর ব্যবস্থা (Identity) আসবে Lesson 08 এ।',
    },
    {
        column: 'tour_id',
        type: 'integer',
        why: 'Extra টা কোন ট্যুরের সাথে বিক্রি হয়। tours Table এর tour_id যে Type, এখানেও ঠিক সেই Type, যাতে দুটো মিলিয়ে JOIN করা যায়। সত্যিই tours এ আছে কিনা সেই পাহারা (Foreign Key) আসবে Lesson 09 এ।',
    },
    {
        column: 'name',
        type: 'text',
        why: 'Extra এর নাম, যেমন Life jacket। লম্বায় কত হবে আগে থেকে জানা নেই, তাই text। text এ দৈর্ঘ্য বলে দিতে হয় না, varchar(n) কখন লাগে সেটা Lesson 04 এ।',
    },
    {
        column: 'price_bdt',
        type: 'numeric(8, 2)',
        why: 'টাকা, তাই হুবহু হিসাব রাখে এমন numeric। (8, 2) মানে মোট ৮টা অঙ্ক, তার ২টা দশমিকের পরে, অর্থাৎ সবচেয়ে বড় দাম 999999.99। নামের শেষে _bdt বলে দেয় মুদ্রা কোনটা।',
    },
    {
        column: 'is_optional',
        type: 'boolean',
        why: 'Extra টা ঐচ্ছিক নাকি বাধ্যতামূলক, হ্যাঁ অথবা না। হ্যাঁ/না এর জন্য boolean। নামের শুরুতে is_ থাকলে পড়েই বোঝা যায় উত্তরটা হ্যাঁ/না।',
    },
    {
        column: 'created_at',
        type: 'timestamptz',
        why: 'Row টা কখন ঢুকল। নির্দিষ্ট একটা মুহূর্ত, তাই Time Zone সহ timestamp। psql এর \\d এটাকে পুরো নামে দেখায়: timestamp with time zone। নামের শেষে _at মানে মুহূর্ত, _on মানে শুধু তারিখ।',
    },
];

// psql's \d prints the long name for these two types; every row below is copied
// from \d ct_tour_extras on PostgreSQL 18 after each version of the statement.
const D_TYPE: Record<string, string> = {
    'numeric(8, 2)': 'numeric(8,2)',
    timestamptz: 'timestamp with time zone',
};

/**
 * Builds the lesson's first table one column at a time: each step adds one
 * "name type" line to the statement and shows what psql's \d prints for the
 * table at that point, with the reason for the type next to it.
 */
export function CtBuildLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const shown = BUILD.slice(0, step + 1);
    const current = BUILD[step];
    const nameWidth = Math.max(...shown.map(s => s.column.length));

    return (
        <Panel
            label='Interactive'
            title='ct_tour_extras, একটা একটা Column করে'
            footer='ডান দিকের প্রতিটা ফলাফল PostgreSQL 18 এর psql এ এই Statement চালিয়ে \d ct_tour_extras দিয়ে নেওয়া। Table টা খালি, তাই প্রতিটা ধাপে আগেরটা DROP করে নতুন করে বানানো হয়েছে। ভরা Table এ নতুন Column যোগ করার আসল উপায় ALTER TABLE, সেটা Lesson 10 এ।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন Column পর্যন্ত'>
                {BUILD.map((s, i) => (
                    <button
                        key={s.column}
                        type='button'
                        data-step={i + 1}
                        aria-pressed={step === i}
                        onClick={() => setStep(i)}
                        className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}. {s.column}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='next'
                    disabled={step === BUILD.length - 1}
                    onClick={() => setStep(v => Math.min(BUILD.length - 1, v + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের Column
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <pre className='overflow-x-auto border border-border bg-background py-3 font-mono text-[0.75rem] leading-relaxed'>
                    <span className='block px-4 text-foreground'>CREATE TABLE ct_tour_extras (</span>
                    {shown.map((s, i) => (
                        <span
                            key={s.column}
                            className={cn(
                                'block px-4 transition-colors duration-300',
                                i === step ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                            )}>
                            {'  '}
                            {s.column.padEnd(nameWidth)} {s.type}
                            {i < shown.length - 1 ? ',' : ''}
                        </span>
                    ))}
                    <span className='block px-4 text-foreground'>);</span>
                </pre>

                <motion.div
                    key={current.column}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    data-build-step={current.column}
                    data-columns={shown.length}>
                    <p className='text-sm leading-relaxed text-foreground mb-3'>
                        <span className='font-mono font-bold text-primary'>{current.column}</span>: {current.why}
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <p className='border-b border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                            \d ct_tour_extras: Table &quot;public.ct_tour_extras&quot;
                        </p>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {['Column', 'Type', 'Nullable', 'Default'].map(c => (
                                        <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {shown.map((s, i) => (
                                    <tr
                                        key={s.column}
                                        className={cn(
                                            'border-b border-border/60 last:border-b-0',
                                            i === step && 'bg-primary/10'
                                        )}>
                                        <td className='px-3 py-1 whitespace-nowrap text-foreground/90'>{s.column}</td>
                                        <td className='px-3 py-1 whitespace-nowrap text-foreground/90'>{D_TYPE[s.type] ?? s.type}</td>
                                        <td className='px-3 py-1 whitespace-nowrap text-muted-foreground/60'> </td>
                                        <td className='px-3 py-1 whitespace-nowrap text-muted-foreground/60'> </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className='mt-3 text-xs leading-relaxed text-muted-foreground'>
                        Nullable আর Default এর ঘর এখনো ফাঁকা: কোনো Column এ NULL আটকানো নেই, কোনো আগে থেকে ঠিক করা মানও নেই।
                        এই দুটো ঘর ভরবে Lesson 07 এ।
                    </p>
                </motion.div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. দুটো Session, একটা TEMP Table                                             */
/* ------------------------------------------------------------------------- */

type Who = 'A' | 'B' | 'C';

interface SessionEvent {
    who: Who;
    label: string;
    sql: string;
    output: string;
    note: string;
}

// Every output below is copied from psql on PostgreSQL 18, two connections to
// the same island_tours database open at the same time.
const EVENTS: SessionEvent[] = [
    {
        who: 'A',
        label: 'A বানায়',
        sql: 'CREATE TEMP TABLE ct_cart (tour_id integer, seats smallint);\nINSERT INTO ct_cart VALUES (1, 2), (5, 1);',
        output: 'CREATE TABLE\nINSERT 0 2',
        note: 'Session A একটা TEMP Table বানাল, ভেতরে দুটো Row। একজন Customer এর ঝুড়ি, ধরে নিন।',
    },
    {
        who: 'A',
        label: 'A পড়ে',
        sql: 'SELECT * FROM ct_cart;',
        output: ' tour_id | seats \n---------+-------\n       1 |     2\n       5 |     1\n(2 rows)',
        note: 'নিজের Session এ Table টা একদম সাধারণ Table এর মতো: পড়া যায়, লেখা যায়।',
    },
    {
        who: 'B',
        label: 'B পড়তে চায়',
        sql: 'SELECT * FROM ct_cart;',
        output: 'ERROR:  relation "ct_cart" does not exist\nLINE 1: SELECT * FROM ct_cart;\n                      ^',
        note: 'একই Database, একই সময়ে আরেকটা Connection। Session B এর কাছে ct_cart নামে কিছুই নেই।',
    },
    {
        who: 'B',
        label: 'B Catalog দেখে',
        sql: "SELECT schemaname, tablename FROM pg_tables\nWHERE tablename = 'ct_cart';",
        output: ' schemaname | tablename \n------------+-----------\n pg_temp_6  | ct_cart\n(1 row)',
        note: 'Catalog এ Table টার অস্তিত্ব দেখা যায়, কিন্তু সে থাকে pg_temp_6 নামের একটা Schema তে, যেটা শুধু Session A এর। B সেটা খুঁজেই দেখে না।',
    },
    {
        who: 'A',
        label: 'A চলে যায়',
        sql: '\\q',
        output: '',
        note: 'Session A বের হয়ে গেল। কোনো DROP লেখা হয়নি।',
    },
    {
        who: 'C',
        label: 'নতুন Session',
        sql: "SELECT * FROM ct_cart;\nSELECT schemaname, tablename FROM pg_tables\nWHERE tablename = 'ct_cart';",
        output: 'ERROR:  relation "ct_cart" does not exist\nLINE 1: SELECT * FROM ct_cart;\n                      ^\n schemaname | tablename \n------------+-----------\n(0 rows)',
        note: 'এবার Catalog এও নেই। Session শেষ হতেই PostgreSQL নিজে TEMP Table টা মুছে দিয়েছে, ভেতরের Row সহ।',
    },
];

const WHO_TITLE: Record<Who, string> = {
    A: 'Session A',
    B: 'Session B',
    C: 'নতুন Session',
};

/**
 * Two psql connections side by side. Each click runs the next real statement:
 * A creates and reads a temporary table, B cannot see it, then A disconnects and
 * the table is gone for everybody.
 */
export function CtTempSessionsLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const done = EVENTS.slice(0, step + 1);
    const current = EVENTS[step];

    const column = (side: 'left' | 'right') => {
        const mine = done.filter(e => (side === 'left' ? e.who === 'A' : e.who !== 'A'));
        const title = side === 'left' ? WHO_TITLE.A : step >= 5 ? WHO_TITLE.C : WHO_TITLE.B;
        const closed = side === 'left' && step >= 4;
        return (
            <div className={cn('border border-border bg-background', closed && 'opacity-60')} data-session={side === 'left' ? 'A' : 'B'}>
                <p className='border-b border-border bg-muted/30 px-3 py-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground'>
                    {title}
                    {closed && ' · বন্ধ'}
                </p>
                <div className='min-h-[12rem] space-y-3 overflow-x-auto px-3 py-3 font-mono text-[0.6875rem] leading-relaxed'>
                    {mine.map(e => (
                        <motion.div
                            key={e.label}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}>
                            <pre className={cn('whitespace-pre', e === current ? 'text-primary' : 'text-foreground/80')}>
                                {e.sql
                                    .split('\n')
                                    .map(line => `island_tours=# ${line}`)
                                    .join('\n')}
                            </pre>
                            {e.output && (
                                <pre
                                    className={cn(
                                        'whitespace-pre',
                                        e.output.startsWith('ERROR') ? 'text-destructive' : 'text-muted-foreground'
                                    )}>
                                    {e.output}
                                </pre>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Panel
            label='Interactive'
            title='দুটো Session, একটা TEMP Table'
            footer='প্রতিটা আদেশ আর তার ফলাফল PostgreSQL 18 এ একই island_tours Database এ একসাথে খোলা দুটো psql Connection থেকে নেওয়া। pg_temp এর পরের সংখ্যাটা Connection ভেদে বদলায়, Query বক্সে আপনি দেখবেন pg_temp_0।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন ধাপ পর্যন্ত'>
                {EVENTS.map((e, i) => (
                    <button
                        key={e.label}
                        type='button'
                        data-step={i + 1}
                        aria-pressed={step === i}
                        onClick={() => setStep(i)}
                        className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}. {e.label}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='next'
                    disabled={step === EVENTS.length - 1}
                    onClick={() => setStep(v => Math.min(EVENTS.length - 1, v + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
            </div>

            <p className='text-sm leading-relaxed text-foreground mb-4' data-temp-step={step + 1}>
                <span className='font-mono font-bold text-primary'>{toBn(step + 1)}.</span> {current.note}
            </p>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {column('left')}
                {column('right')}
            </div>
        </Panel>
    );
}
