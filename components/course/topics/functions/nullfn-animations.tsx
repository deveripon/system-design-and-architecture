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
/* 1. COALESCE এর খোঁজ নিজে চালান                                              */
/* ------------------------------------------------------------------------- */

const PHONE = '+8801000000101';
const EMAIL = 'rahim.uddin@mail.example';
const FALLBACK = "'no contact'";

/**
 * Switch phone and email on and off for one customer and watch which argument
 * COALESCE(phone, email, 'no contact') returns, which ones it never reads, and
 * the CASE expression that does exactly the same.
 */
export function CoalesceChainLab() {
    const reduce = useReducedMotion();
    const [hasPhone, setHasPhone] = useState(false);
    const [hasEmail, setHasEmail] = useState(true);
    const [withFallback, setWithFallback] = useState(true);

    const args = [
        { name: 'phone', value: hasPhone ? `'${PHONE}'` : 'NULL' },
        { name: 'email', value: hasEmail ? `'${EMAIL}'` : 'NULL' },
        ...(withFallback ? [{ name: 'fallback', value: FALLBACK }] : []),
    ];
    const picked = args.findIndex(a => a.value !== 'NULL');
    const result = picked === -1 ? 'NULL' : args[picked].value;
    const expression = `COALESCE(${args.map(a => (a.name === 'fallback' ? FALLBACK : a.name)).join(', ')})`;
    const caseText = [
        'CASE',
        '  WHEN phone IS NOT NULL THEN phone',
        '  WHEN email IS NOT NULL THEN email',
        ...(withFallback ? [`  ELSE ${FALLBACK}`] : []),
        'END',
    ].join('\n');

    const toggles: { label: string; on: boolean; set: (v: boolean) => void; key: string }[] = [
        { key: 'phone', label: 'phone আছে', on: hasPhone, set: setHasPhone },
        { key: 'email', label: 'email আছে', on: hasEmail, set: setHasEmail },
        { key: 'fallback', label: "শেষে 'no contact'", on: withFallback, set: setWithFallback },
    ];

    return (
        <Panel
            label='Interactive'
            title='COALESCE কোন মানটা নেয়'
            footer='সত্যিকারের Data তে Rahim Uddin এর phone আছে, আর Tanvir Ahmed এর মতো পাঁচজনের নেই। এখানে একজন Customer এর ঘরগুলো নিজে বদলে দেখুন। লক্ষ করুন, শেষে নিশ্চিত একটা লেখা না রাখলে দুটোই ফাঁকা হলে উত্তর NULL ই থেকে যায়।'>
            <div className='flex flex-wrap gap-2 mb-6'>
                {toggles.map(t => (
                    <button
                        key={t.key}
                        type='button'
                        data-toggle={t.key}
                        aria-pressed={t.on}
                        onClick={() => t.set(!t.on)}
                        className={cn(BTN, t.on ? BTN_ON : BTN_OFF)}>
                        {t.on ? '✓ ' : ''}
                        {t.label}
                    </button>
                ))}
            </div>

            <p className='font-mono text-[0.8125rem] text-foreground mb-4'>{expression}</p>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6'>
                {args.map((a, i) => {
                    const state = i === picked ? 'picked' : picked !== -1 && i > picked ? 'skipped' : 'null';
                    return (
                        <motion.div
                            key={`${a.name}-${a.value}`}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: state === 'skipped' ? 0.4 : 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE, delay: reduce ? 0 : i * 0.08 }}
                            data-arg={a.name}
                            data-state={state}
                            className={cn(
                                'border px-3 py-2',
                                state === 'picked' ? 'border-primary bg-primary/10' : 'border-border',
                                state === 'null' && 'border-dashed'
                            )}>
                            <span className='block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                                {toBn(i + 1)}. {a.name === 'fallback' ? 'শেষ ভরসা' : a.name}
                            </span>
                            <span className={cn('block font-mono text-[0.75rem] break-all', state === 'picked' ? 'text-primary font-bold' : 'text-foreground/80')}>
                                {a.value}
                            </span>
                            <span className='block text-[0.6875rem] text-muted-foreground mt-1'>
                                {state === 'picked' ? 'প্রথম অফাঁকা মান, এটাই উত্তর' : state === 'skipped' ? 'আগেই উত্তর মিলেছে, পড়াই হলো না' : 'NULL, তাই পরের ঘরে'}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='border border-border bg-background px-4 py-3'>
                    <span className='block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1'>উত্তর</span>
                    <span data-result className={cn('font-mono text-sm font-bold', result === 'NULL' ? 'text-muted-foreground italic' : 'text-primary')}>
                        {result}
                    </span>
                </div>
                <div className='border border-border bg-background px-4 py-3'>
                    <span className='block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1'>একই কাজ CASE দিয়ে</span>
                    <pre className='font-mono text-[0.6875rem] leading-relaxed text-foreground/80 whitespace-pre-wrap'>{caseText}</pre>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. রাতপ্রতি দাম: তিনভাবে                                                     */
/* ------------------------------------------------------------------------- */

const TOURS = [
    { title: 'Saint Martin Island Escape', days: 3, price: 12500 },
    { title: "Cox's Bazar Beach Weekend", days: 2, price: 8500 },
    { title: 'Sundarbans Mangrove Cruise', days: 3, price: 18000 },
    { title: 'Sajek Valley Cloud Trip', days: 2, price: 9500 },
    { title: 'Bandarban Hill Trek', days: 4, price: 14000 },
    { title: 'Sylhet Tea Garden Tour', days: 2, price: 7800 },
    { title: 'Ratargul Swamp Boat Day', days: 1, price: 3500 },
    { title: 'Saint Martin Luxury Stay', days: 4, price: 32000 },
    { title: "Cox's Bazar Family Package", days: 3, price: 15500 },
];

type Mode = 'plain' | 'nullif' | 'coalesce';

const MODES: { id: Mode; label: string; sql: string }[] = [
    { id: 'plain', label: 'সরাসরি ভাগ', sql: 'round(price_bdt / (duration_days - 1), 2)' },
    { id: 'nullif', label: 'NULLIF দিয়ে', sql: 'round(price_bdt / NULLIF(duration_days - 1, 0), 2)' },
    {
        id: 'coalesce',
        label: 'NULLIF আর COALESCE',
        sql: "COALESCE(round(price_bdt / NULLIF(duration_days - 1, 0), 2)::text, 'day trip')",
    },
];

/** Price per night for the nine real tours, written three ways; one day trip decides the outcome. */
export function NightPriceLab() {
    const [mode, setMode] = useState<Mode>('plain');
    const current = MODES.find(m => m.id === mode)!;
    const failed = mode === 'plain';

    return (
        <Panel
            label='Interactive'
            title='রাতপ্রতি দাম, তিনভাবে লেখা'
            footer='নয়টা ট্যুর আর তাদের দাম Sample Database থেকে নেওয়া, উত্তরগুলো আসল PostgreSQL এ চালিয়ে মেলানো। একটা মাত্র Row (Ratargul এর একদিনের ট্যুর) ঠিক করে দেয় পুরো Query চলবে কিনা।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {MODES.map(m => (
                    <button
                        key={m.id}
                        type='button'
                        data-mode={m.id}
                        aria-pressed={m.id === mode}
                        onClick={() => setMode(m.id)}
                        className={cn(BTN, m.id === mode ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>
            <p className='font-mono text-[0.75rem] text-foreground mb-5 break-all'>
                SELECT title, {current.sql} AS per_night FROM tours;
            </p>

            {failed ? (
                <div data-outcome='error' className='border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem]'>
                    <p className='text-destructive font-bold'>ERROR: division by zero</p>
                    <p className='mt-2 text-muted-foreground'>
                        আটটা ট্যুরের হিসাব ঠিকই ছিল, কিন্তু একটা Row এ শূন্য দিয়ে ভাগ পড়তেই পুরো Query থেমে গেল। কোনো Row ই ফেরত আসেনি।
                    </p>
                </div>
            ) : (
                <div data-outcome='rows' className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40'>
                                <th className='px-3 py-2 text-left'>title</th>
                                <th className='px-3 py-2 text-left'>days</th>
                                <th className='px-3 py-2 text-left'>per_night</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOURS.map(t => {
                                const nights = t.days - 1;
                                const value = nights === 0 ? null : (t.price / nights).toFixed(2);
                                const shown = value ?? (mode === 'coalesce' ? 'day trip' : 'NULL');
                                return (
                                    <tr key={t.title} className={cn('border-t border-border/60', nights === 0 && 'bg-primary/5')}>
                                        <td className='px-3 py-1.5'>{t.title}</td>
                                        <td className='px-3 py-1.5'>{t.days}</td>
                                        <td className={cn('px-3 py-1.5', value === null && mode === 'nullif' && 'italic text-muted-foreground')}>
                                            {shown}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একই প্রশ্ন, দুই Database                                                  */
/* ------------------------------------------------------------------------- */

const DIALECT_CASES = [
    {
        id: 'greatest',
        sql: 'SELECT GREATEST(5, NULL, 9);',
        pg: '9',
        mysql: 'NULL',
        why: 'PostgreSQL তালিকার NULL বাদ দেয়। MySQL Standard মেনে একটা NULL পেলেই NULL দেয়।',
    },
    {
        id: 'least',
        sql: 'SELECT LEAST(5, NULL, 9);',
        pg: '5',
        mysql: 'NULL',
        why: 'GREATEST এর মতোই। MySQL এ নিরাপদ থাকতে আগে COALESCE দিয়ে NULL সরিয়ে নিন।',
    },
    {
        id: 'divide',
        sql: 'SELECT 1 / 0;',
        pg: 'ERROR: division by zero',
        mysql: 'NULL, সাথে Warning 1365 Division by 0',
        why: 'MySQL SELECT এ শূন্য দিয়ে ভাগে Error দেয় না, চুপচাপ NULL দেয়। তবে Strict Mode এ UPDATE বা INSERT এ একই ভাগ ERROR 1365 দেয়। NULLIF দুই জায়গাতেই কাজ করে।',
    },
    {
        id: 'mixed-types',
        sql: "SELECT COALESCE(guide_id, 'No guide yet') FROM tours WHERE tour_id = 7;",
        pg: 'ERROR: invalid input syntax for type integer: "No guide yet"',
        mysql: 'No guide yet',
        why: 'PostgreSQL এ সব Argument একই Type হতে হয়, তাই guide_id::text লাগে। MySQL নিজে থেকে লেখায় বদলে নেয়।',
    },
    {
        id: 'ifnull',
        sql: "SELECT IFNULL(phone, 'No phone') FROM customers WHERE customer_id = 3;",
        pg: 'ERROR: function ifnull(text, unknown) does not exist',
        mysql: 'No phone',
        why: 'IFNULL শুধু MySQL এর। দুই Database এই চলে COALESCE, তাই সেটাই অভ্যাস করুন।',
    },
    {
        id: 'isnull',
        sql: 'SELECT ISNULL(phone) FROM customers WHERE customer_id = 3;',
        pg: 'ERROR: function isnull(text) does not exist',
        mysql: '1',
        why: 'MySQL এর ISNULL() একটা প্রশ্ন, উত্তর 1 বা 0। দুই জায়গাতেই চলে phone IS NULL।',
    },
];

/** Six expressions run in both databases; every output here was produced in PostgreSQL 18 and MySQL 8.4. */
export function NullDialectLab() {
    const [id, setId] = useState(DIALECT_CASES[0].id);
    const current = DIALECT_CASES.find(c => c.id === id)!;
    return (
        <Panel
            label='Interactive'
            title='একই প্রশ্ন, PostgreSQL আর MySQL'
            footer='প্রতিটা উত্তর PostgreSQL 18 আর MySQL 8.4 এ আসলে চালিয়ে নেওয়া, Island Tours এর Sample Data তে।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {DIALECT_CASES.map((c, i) => (
                    <button
                        key={c.id}
                        type='button'
                        data-case={c.id}
                        aria-pressed={c.id === id}
                        onClick={() => setId(c.id)}
                        className={cn(BTN, c.id === id ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}
                    </button>
                ))}
            </div>
            <p className='font-mono text-[0.8125rem] text-foreground mb-4 break-all'>{current.sql}</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div className='border border-border bg-background px-4 py-3'>
                    <span className='block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary mb-1'>PostgreSQL 18</span>
                    <span data-pg className={cn('font-mono text-[0.75rem] break-all', current.pg.startsWith('ERROR') ? 'text-destructive' : 'text-foreground')}>
                        {current.pg}
                    </span>
                </div>
                <div className='border border-border bg-background px-4 py-3'>
                    <span className='block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary mb-1'>MySQL 8.4</span>
                    <span data-mysql className='font-mono text-[0.75rem] break-all text-foreground'>
                        {current.mysql}
                    </span>
                </div>
            </div>
            <p className='text-sm leading-relaxed text-muted-foreground'>{current.why}</p>
        </Panel>
    );
}
