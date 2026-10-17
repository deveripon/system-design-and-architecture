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

/* The nine real tours (checked against PostgreSQL 18). */
const TOURS = [
    { id: 1, title: 'Saint Martin Island Escape', price: 12500, active: true },
    { id: 2, title: "Cox's Bazar Beach Weekend", price: 8500, active: true },
    { id: 3, title: 'Sundarbans Mangrove Cruise', price: 18000, active: true },
    { id: 4, title: 'Sajek Valley Cloud Trip', price: 9500, active: true },
    { id: 5, title: 'Bandarban Hill Trek', price: 14000, active: true },
    { id: 6, title: 'Sylhet Tea Garden Tour', price: 7800, active: true },
    { id: 7, title: 'Ratargul Swamp Boat Day', price: 3500, active: true },
    { id: 8, title: 'Saint Martin Luxury Stay', price: 32000, active: false },
    { id: 9, title: "Cox's Bazar Family Package", price: 15500, active: true },
];

const money = (n: number) => n.toFixed(2);

/* ------------------------------------------------------------------------- */
/* 1. ধাপে ধাপে: ভেতরের Query, মান বসানো, বাইরের Query                         */
/* ------------------------------------------------------------------------- */

type Scope = 'all' | 'active';

const STEPS = [
    { n: 1, label: 'ভেতরের Query চলে' },
    { n: 2, label: 'মানটা বসে' },
    { n: 3, label: 'বাইরের Query চলে' },
];

/**
 * Walks the "tours above the average price" query in three steps, and lets
 * the reader change which tours the average is taken over. With the inactive
 * Luxury Stay in the average, Island Escape falls below it; without it,
 * Island Escape rises above.
 */
export function SubqueryStepLab() {
    const reduce = useReducedMotion();
    const [scope, setScope] = useState<Scope>('all');
    const [step, setStep] = useState(1);

    const inAverage = TOURS.filter(t => scope === 'all' || t.active);
    const avg = inAverage.reduce((sum, t) => sum + t.price, 0) / inAverage.length;
    const outerRows = TOURS.filter(t => scope === 'all' || t.active);
    const kept = outerRows.filter(t => t.price > avg);

    const innerSql =
        scope === 'all'
            ? 'SELECT avg(price_bdt) FROM tours'
            : 'SELECT avg(price_bdt) FROM tours WHERE is_active';
    const outerWhere = scope === 'all' ? 'WHERE price_bdt >' : 'WHERE is_active AND price_bdt >';

    return (
        <Panel
            label='Lab'
            title='গড়ের চেয়ে দামি ট্যুর, তিন ধাপে'
            footer='নয়টা আসল ট্যুর, আসল দাম। গড়টা এখানে Browser এ হিসাব হচ্ছে, আর সংখ্যাগুলো PostgreSQL 18 এর ফলাফলের সাথে মিলিয়ে দেখা: সব ট্যুরের গড় 13477.78, চালু ট্যুরের গড় 11162.50।'>
            <div className='flex flex-wrap gap-2 mb-4'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground self-center mr-1'>
                    কোন ট্যুরের গড়
                </span>
                {(['all', 'active'] as const).map(s => (
                    <button
                        key={s}
                        type='button'
                        data-scope={s}
                        onClick={() => setScope(s)}
                        aria-pressed={scope === s}
                        className={cn(BTN, scope === s ? BTN_ON : BTN_OFF)}>
                        {s === 'all' ? 'সব নয়টা ট্যুর' : 'শুধু চালু ট্যুর'}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
                {STEPS.map(s => (
                    <button
                        key={s.n}
                        type='button'
                        data-step={s.n}
                        onClick={() => setStep(s.n)}
                        aria-pressed={step === s.n}
                        className={cn(BTN, step === s.n ? BTN_ON : BTN_OFF)}>
                        {toBn(s.n)}. {s.label}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6' data-active-step={step} data-kept={kept.length}>
                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        ভেতরের Query
                    </p>
                    <pre
                        className={cn(
                            'overflow-x-auto border px-4 py-3 font-mono text-[0.75rem] leading-relaxed',
                            step === 1 ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground'
                        )}>
                        {`(${innerSql})`}
                    </pre>
                    <ul className='grid grid-cols-3 gap-1.5'>
                        {TOURS.map(t => {
                            const used = scope === 'all' || t.active;
                            return (
                                <li
                                    key={t.id}
                                    className={cn(
                                        'border px-2 py-1 font-mono text-[0.6875rem] text-center',
                                        used ? 'border-border text-foreground' : 'border-dashed border-border text-muted-foreground/50 line-through'
                                    )}>
                                    {money(t.price)}
                                </li>
                            );
                        })}
                    </ul>
                    <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                        {toBn(inAverage.length)}টা দামের গড়:{' '}
                        <span className='font-mono font-bold text-primary'>{money(avg)}</span>
                        {scope === 'active' && ' (বন্ধ Luxury Stay বাদ)'}
                    </p>
                </div>

                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        বাইরের Query
                    </p>
                    <pre
                        className={cn(
                            'overflow-x-auto border px-4 py-3 font-mono text-[0.75rem] leading-relaxed',
                            step >= 2 ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground'
                        )}>
                        {`SELECT title, price_bdt\nFROM tours\n${outerWhere} `}
                        <span className={step >= 2 ? 'font-bold text-primary' : 'text-muted-foreground'}>
                            {step >= 2 ? money(avg) : '(…)'}
                        </span>
                    </pre>
                    {step < 3 ? (
                        <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                            {step === 1
                                ? 'বাইরের Query এখনো অপেক্ষায়। তার WHERE এর ডান দিকে একটা খালি জায়গা, যেটা ভেতরের Query এর উত্তরের জন্য রাখা।'
                                : 'ভেতরের Query এর উত্তর এখন খালি জায়গায় বসে গেছে। বাইরের Query এর চোখে এটা হাতে লেখা একটা সংখ্যার মতোই।'}
                        </p>
                    ) : (
                        <ul className='space-y-1'>
                            {outerRows.map(t => {
                                const isKept = t.price > avg;
                                return (
                                    <motion.li
                                        key={`${scope}-${t.id}`}
                                        initial={reduce ? false : { opacity: 0, x: -6 }}
                                        animate={{ opacity: isKept ? 1 : 0.45, x: 0 }}
                                        transition={{ duration: 0.25, ease: EASE }}
                                        data-verdict={isKept ? 'kept' : 'dropped'}
                                        className={cn(
                                            'flex items-center justify-between gap-3 border px-3 py-1.5 font-mono text-[0.6875rem]',
                                            isKept ? 'border-primary/60 bg-primary/5 text-foreground' : 'border-border text-muted-foreground'
                                        )}>
                                        <span className='truncate'>{t.title}</span>
                                        <span className='shrink-0'>
                                            {money(t.price)} {isKept ? '>' : '≤'} {money(avg)}
                                        </span>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    )}
                    {step === 3 && (
                        <p className='text-[0.8125rem] leading-relaxed text-foreground'>
                            ফলাফল: {toBn(kept.length)}টা ট্যুর।{' '}
                            {scope === 'all'
                                ? 'বন্ধ Luxury Stay এর 32000 গড়টাকে টেনে উপরে তুলেছে, তাই Island Escape এর 12500 গড়ের নিচে পড়ে গেছে।'
                                : 'Luxury Stay বাদ পড়ায় গড় নেমে 11162.50, আর এবার Island Escape গড়ের উপরে।'}
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ভেতরের Query এর আকার বদলালে কী হয়                                        */
/* ------------------------------------------------------------------------- */

interface ShapeCase {
    id: string;
    label: string;
    inner: string;
    columns: string[];
    rows: string[][];
    verdict: 'value' | 'null' | 'error';
    /** What the outer query got, in words. */
    note: string;
    /** Outer result rows when there is no error. */
    outer?: string[];
    error?: { pg: string; mysql: string };
}

const OUTER = 'SELECT title FROM tours\nWHERE price_bdt > (';

/* Every result and error text below is from PostgreSQL 18 and MySQL 8.4. */
const CASES: ShapeCase[] = [
    {
        id: 'one',
        label: 'tour_id = 3',
        inner: 'SELECT price_bdt FROM tours WHERE tour_id = 3',
        columns: ['price_bdt'],
        rows: [['18000.00']],
        verdict: 'value',
        note: 'ঠিক একটা Row, একটা Column। মানটা 18000.00, আর বাইরের Query তার চেয়ে দামি ট্যুর খোঁজে।',
        outer: ['Saint Martin Luxury Stay'],
    },
    {
        id: 'none',
        label: 'tour_id = 99',
        inner: 'SELECT price_bdt FROM tours WHERE tour_id = 99',
        columns: ['price_bdt'],
        rows: [],
        verdict: 'null',
        note: 'কোনো Row নেই। Error হয় না, মানটা NULL। price_bdt > NULL কখনো সত্যি হয় না, তাই ফলাফল খালি।',
        outer: [],
    },
    {
        id: 'two-rows',
        label: 'destination_id = 1',
        inner: 'SELECT price_bdt FROM tours WHERE destination_id = 1',
        columns: ['price_bdt'],
        rows: [['12500.00'], ['32000.00']],
        verdict: 'error',
        note: 'Saint Martin এ দুটো ট্যুর, তাই দুটো দাম। একটা ঘরে কোনটা বসবে, Database বলতে পারে না।',
        error: {
            pg: 'ERROR:  more than one row returned by a subquery used as an expression',
            mysql: 'ERROR 1242 (21000): Subquery returns more than 1 row',
        },
    },
    {
        id: 'min',
        label: 'min(...) destination_id = 1',
        inner: 'SELECT min(price_bdt) FROM tours WHERE destination_id = 1',
        columns: ['min'],
        rows: [['12500.00']],
        verdict: 'value',
        note: 'একই দুটো দাম, কিন্তু min() তাদের একটা মানে নামিয়ে আনে: 12500.00। এখন প্রশ্নটাও পরিষ্কার: সস্তা Saint Martin ট্যুরের চেয়ে দামি কারা।',
        outer: ['Saint Martin Luxury Stay', 'Sundarbans Mangrove Cruise', "Cox's Bazar Family Package", 'Bandarban Hill Trek'],
    },
    {
        id: 'two-columns',
        label: 'price_bdt, title',
        inner: 'SELECT price_bdt, title FROM tours WHERE tour_id = 1',
        columns: ['price_bdt', 'title'],
        rows: [['12500.00', 'Saint Martin Island Escape']],
        verdict: 'error',
        note: 'Row একটাই, কিন্তু Column দুটো। একটা সংখ্যার জায়গায় দুটো জিনিস বসানো যায় না।',
        error: {
            pg: 'ERROR:  subquery must return only one column',
            mysql: 'ERROR 1241 (21000): Operand should contain 1 column(s)',
        },
    },
];

/**
 * Five inner queries of the same shape family. Pick one and see what it
 * returns and what the outer query does with it.
 */
export function ShapeLab() {
    const [pick, setPick] = useState(CASES[0].id);
    const c = CASES.find(x => x.id === pick) ?? CASES[0];

    return (
        <Panel
            label='Lab'
            title='ভেতরের Query কী ফেরত দিল, বাইরেরটা কী করল'
            footer='বাইরের Query একটাই: যেসব ট্যুরের দাম ভেতরের Query এর মানের চেয়ে বেশি। শুধু ভেতরের Query বদলাচ্ছে। ফলাফল আর Error এর লেখা আসল PostgreSQL 18 আর MySQL 8.4 থেকে নেওয়া।'>
            <div className='flex flex-wrap gap-2 mb-6'>
                {CASES.map(x => (
                    <button
                        key={x.id}
                        type='button'
                        data-case={x.id}
                        onClick={() => setPick(x.id)}
                        aria-pressed={pick === x.id}
                        className={cn(BTN, 'font-mono', pick === x.id ? BTN_ON : BTN_OFF)}>
                        {x.label}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6' data-verdict={c.verdict}>
                <div className='space-y-3'>
                    <pre className='overflow-x-auto border border-border px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        {OUTER}
                        <span className='text-primary font-bold'>{c.inner}</span>
                        {');'}
                    </pre>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        ভেতরের Query ফেরত দিল: {toBn(c.rows.length)} Row × {toBn(c.columns.length)} Column
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {c.columns.map(col => (
                                        <th key={col} className='border-b border-border px-3 py-1.5 text-left'>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {c.rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={c.columns.length} className='px-3 py-2 text-muted-foreground italic'>
                                            (0 rows)
                                        </td>
                                    </tr>
                                ) : (
                                    c.rows.map((row, i) => (
                                        <tr key={i} className='border-b border-border/60 last:border-b-0'>
                                            {row.map((cell, j) => (
                                                <td key={j} className='px-3 py-1.5'>
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='space-y-3'>
                    <p className='text-[0.8125rem] leading-relaxed text-foreground'>{c.note}</p>
                    {c.verdict === 'error' && c.error ? (
                        <div className='space-y-2 border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.6875rem] leading-relaxed'>
                            <p className='text-destructive font-bold'>PostgreSQL</p>
                            <p className='text-foreground/90'>{c.error.pg}</p>
                            <p className='text-destructive font-bold pt-1'>MySQL</p>
                            <p className='text-foreground/90'>{c.error.mysql}</p>
                        </div>
                    ) : (
                        <div className='border border-border'>
                            <p className='border-b border-border bg-muted/30 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                                বাইরের Query এর ফলাফল
                            </p>
                            {c.outer && c.outer.length > 0 ? (
                                <ul className='px-3 py-2 space-y-1 font-mono text-[0.75rem]'>
                                    {c.outer.map(t => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className='px-3 py-2 font-mono text-[0.75rem] text-muted-foreground italic'>(0 rows)</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Panel>
    );
}
