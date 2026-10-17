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
const GROUP_LABEL = 'font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground';

/* ------------------------------------------------------------------------- */
/* 1. সীমা পার হলে কী হয়                                                        */
/* ------------------------------------------------------------------------- */

type IntType = 'smallint' | 'integer' | 'bigint';

const INT_TYPES: { name: IntType; column: string; max: string; digits: number }[] = [
    { name: 'smallint', column: 's', max: '32767', digits: 5 },
    { name: 'integer', column: 'i', max: '2147483647', digits: 10 },
    { name: 'bigint', column: 'b', max: '9223372036854775807', digits: 19 },
];

const INT_VALUES = [
    '120',
    '32767',
    '32768',
    '2147483647',
    '2147483648',
    '9223372036854775807',
    '9223372036854775808',
];

// How many of INT_VALUES, from the start, each type accepts. Every pair was
// inserted into PostgreSQL 18; the rest stopped with "<type> out of range".
const FITS_UP_TO: Record<IntType, number> = { smallint: 2, integer: 4, bigint: 6 };

function groupDigits(value: string) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Pick a column type and a value, and see what PostgreSQL does with the
 * insert. The bar fills by number of digits against the type's limit, so the
 * three types can share one picture; every outcome is real.
 */
export function NumtypeOverflowLab() {
    const reduce = useReducedMotion();
    const [type, setType] = useState<IntType>('smallint');
    const [valueIndex, setValueIndex] = useState(2);
    const spec = INT_TYPES.find(t => t.name === type) ?? INT_TYPES[0];
    const value = INT_VALUES[valueIndex];
    const fits = valueIndex < FITS_UP_TO[type];
    const fill = Math.min(1, Math.log10(Number(value)) / Math.log10(Number(spec.max)));
    const outcomeKey = `${type}-${value}`;

    return (
        <Panel
            label='Interactive'
            title='সীমা পার হলে কী হয়'
            footer='প্রতিটা জোড়া PostgreSQL 18 এ num_counters Table এ INSERT করে দেখা। দাগটা অঙ্কের সংখ্যা দিয়ে ভরে, মানের দিয়ে না, তাই তিনটা Type একই ছবিতে ধরে। সীমার এক বেশি হলেই Row ঢোকে না, আর PostgreSQL কখনো সংখ্যা উল্টে দিয়ে চুপচাপ ভুল মান রাখে না।'>
            <div className='flex flex-wrap items-center gap-2 mb-3' role='group' aria-label='Column এর Type'>
                <span className={GROUP_LABEL}>Column</span>
                {INT_TYPES.map(t => (
                    <button
                        key={t.name}
                        type='button'
                        data-int-type={t.name}
                        aria-pressed={type === t.name}
                        onClick={() => setType(t.name)}
                        className={cn(BTN, 'font-mono', type === t.name ? BTN_ON : BTN_OFF)}>
                        {t.name}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-6' role='group' aria-label='কোন মান'>
                <span className={GROUP_LABEL}>মান</span>
                {INT_VALUES.map((v, i) => (
                    <button
                        key={v}
                        type='button'
                        data-int-value={v}
                        aria-pressed={valueIndex === i}
                        onClick={() => setValueIndex(i)}
                        className={cn(BTN, 'font-mono', valueIndex === i ? BTN_ON : BTN_OFF)}>
                        {groupDigits(v)}
                    </button>
                ))}
            </div>

            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`INSERT INTO num_counters (${spec.column}) VALUES (${value});\n-- ${spec.column} এর Type: ${spec.name}`}
            </pre>

            <div className='mt-5'>
                <div className='flex items-baseline justify-between gap-3 mb-1.5 font-mono text-[0.6875rem]'>
                    <span className='text-muted-foreground'>০</span>
                    <span className='text-primary font-bold'>
                        {spec.name} এর সীমা: {groupDigits(spec.max)}
                    </span>
                </div>
                <div className='relative h-6 border border-border bg-muted/30 overflow-hidden'>
                    <motion.div
                        className={cn('absolute inset-y-0 left-0', fits ? 'bg-primary/40' : 'bg-destructive/50')}
                        initial={false}
                        animate={{ width: `${(fits ? fill : 1) * 100}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                    />
                </div>
                <p className='mt-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                    মানটা {toBn(value.length)} অঙ্কের, {spec.name} এর সীমা {toBn(spec.digits)} অঙ্কের
                </p>
            </div>

            <motion.div
                key={outcomeKey}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                data-outcome={fits ? 'stored' : 'error'}
                className={cn(
                    'mt-5 border px-4 py-3 font-mono text-[0.75rem] leading-relaxed',
                    fits ? 'border-primary/40 bg-primary/5' : 'border-destructive/40 bg-destructive/5'
                )}>
                {fits ? (
                    <>
                        <p className='font-bold text-primary'>INSERT 0 1</p>
                        <p className='mt-1 text-foreground/90'>
                            Row ঢুকেছে, {spec.column} = {value}
                        </p>
                    </>
                ) : (
                    <>
                        <p className='font-bold text-destructive'>ERROR: {spec.name} out of range</p>
                        <p className='mt-1 text-muted-foreground'>SQLSTATE 22003। কোনো Row ঢোকেনি, Table আগের মতোই।</p>
                    </>
                )}
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. numeric(p, s) এর ঘরে মান বসানো                                              */
/* ------------------------------------------------------------------------- */

type NumType = '5,2' | '4,3' | '6,1' | '3,0';

const NUM_TYPES: { key: NumType; p: number; s: number; about: string }[] = [
    { key: '5,2', p: 5, s: 2, about: 'দাম, পয়সা সহ, 999.99 পর্যন্ত' },
    { key: '4,3', p: 4, s: 3, about: 'অনুপাত, যেমন 0.125' },
    { key: '6,1', p: 6, s: 1, about: 'এক দশমিকের মাপ' },
    { key: '3,0', p: 3, s: 0, about: 'দশমিক ছাড়া, 999 পর্যন্ত' },
];

const NUM_VALUES = ['123.456', '0.005', '-2.345', '999.995', '12', '1000', '9.9996'];

type Fit = { stored: string } | { would: string };

// Every "stored" value is PostgreSQL 18 output for SELECT value::numeric(p, s).
// Every "would" is the same value rounded to the scale, which PostgreSQL then
// refused with "numeric field overflow".
const FIT_TABLE: Record<NumType, Record<string, Fit>> = {
    '5,2': {
        '123.456': { stored: '123.46' },
        '0.005': { stored: '0.01' },
        '-2.345': { stored: '-2.35' },
        '999.995': { would: '1000.00' },
        '12': { stored: '12.00' },
        '1000': { would: '1000.00' },
        '9.9996': { stored: '10.00' },
    },
    '4,3': {
        '123.456': { would: '123.456' },
        '0.005': { stored: '0.005' },
        '-2.345': { stored: '-2.345' },
        '999.995': { would: '999.995' },
        '12': { would: '12.000' },
        '1000': { would: '1000.000' },
        '9.9996': { would: '10.000' },
    },
    '6,1': {
        '123.456': { stored: '123.5' },
        '0.005': { stored: '0.0' },
        '-2.345': { stored: '-2.3' },
        '999.995': { stored: '1000.0' },
        '12': { stored: '12.0' },
        '1000': { stored: '1000.0' },
        '9.9996': { stored: '10.0' },
    },
    '3,0': {
        '123.456': { stored: '123' },
        '0.005': { stored: '0' },
        '-2.345': { stored: '-2' },
        '999.995': { would: '1000' },
        '12': { stored: '12' },
        '1000': { would: '1000' },
        '9.9996': { stored: '10' },
    },
};

/** 12.00 and 12 are the same number; only zeros after a decimal point go. */
function trimZeros(value: string) {
    return value.includes('.') ? value.replace(/0+$/, '').replace(/\.$/, '') : value;
}

function Slots({ value, p, s, failed }: { value: string; p: number; s: number; failed: boolean }) {
    const negative = value.startsWith('-');
    const [whole, frac = ''] = value.replace('-', '').split('.');
    const room = p - s;
    // Whole digits that have no box: they are why the value was refused.
    const spill = Math.max(0, whole.length - room);
    const boxes = Array.from({ length: room }, (_, i) => {
        const offset = whole.length - room + i;
        return offset >= 0 ? whole[offset] : '';
    });
    return (
        <div className='flex items-end gap-1.5 font-mono' data-slots={`${p},${s}`}>
            {negative && <span className='pb-2 text-lg font-bold text-foreground'>-</span>}
            {spill > 0 &&
                whole
                    .slice(0, spill)
                    .split('')
                    .map((d, i) => (
                        <span
                            key={`spill-${i}`}
                            className='w-9 h-11 flex items-center justify-center border border-dashed border-destructive text-destructive text-lg font-bold'>
                            {d}
                        </span>
                    ))}
            {boxes.map((d, i) => (
                <span
                    key={`w-${i}`}
                    className={cn(
                        'w-9 h-11 flex items-center justify-center border text-lg font-bold',
                        failed ? 'border-border text-muted-foreground' : 'border-foreground/40 text-foreground'
                    )}>
                    {d}
                </span>
            ))}
            {s > 0 && <span className='pb-1 text-2xl font-bold text-foreground'>.</span>}
            {Array.from({ length: s }, (_, i) => (
                <span
                    key={`f-${i}`}
                    className={cn(
                        'w-9 h-11 flex items-center justify-center border text-lg font-bold',
                        failed ? 'border-border text-muted-foreground' : 'border-primary bg-primary/10 text-primary'
                    )}>
                    {frac[i] ?? ''}
                </span>
            ))}
        </div>
    );
}

/**
 * Four column types against seven values. The boxes show what got stored, or
 * which whole digits had no box to go in. Every outcome is PostgreSQL 18.
 */
export function NumtypeRoundingLab() {
    const reduce = useReducedMotion();
    const [typeKey, setTypeKey] = useState<NumType>('5,2');
    const [value, setValue] = useState('123.456');
    const spec = NUM_TYPES.find(t => t.key === typeKey) ?? NUM_TYPES[0];
    const fit = FIT_TABLE[typeKey][value];
    const stored = 'stored' in fit ? fit.stored : null;
    const shown = 'stored' in fit ? fit.stored : fit.would;
    const rounded = stored !== null && trimZeros(stored) !== trimZeros(value);

    return (
        <Panel
            label='Interactive'
            title='numeric এর ঘরে মান বসান'
            footer='প্রতিটা ফলাফল PostgreSQL 18 এ SELECT মান::numeric(p, s) চালিয়ে নেওয়া, INSERT এও ঠিক একই নিয়ম খাটে। লাল দাগের ঘর মানে সেই অঙ্কের জন্য কোনো ঘর নেই, তাই পুরো মানটাই ফেরত গেছে।'>
            <div className='flex flex-wrap items-center gap-2 mb-3' role='group' aria-label='Column এর Type'>
                <span className={GROUP_LABEL}>Column</span>
                {NUM_TYPES.map(t => (
                    <button
                        key={t.key}
                        type='button'
                        data-num-type={t.key}
                        aria-pressed={typeKey === t.key}
                        onClick={() => setTypeKey(t.key)}
                        className={cn(BTN, 'font-mono', typeKey === t.key ? BTN_ON : BTN_OFF)}>
                        numeric({t.p}, {t.s})
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-6' role='group' aria-label='কোন মান'>
                <span className={GROUP_LABEL}>মান</span>
                {NUM_VALUES.map(v => (
                    <button
                        key={v}
                        type='button'
                        data-num-value={v}
                        aria-pressed={value === v}
                        onClick={() => setValue(v)}
                        className={cn(BTN, 'font-mono', value === v ? BTN_ON : BTN_OFF)}>
                        {v}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
                <div>
                    <p className='text-sm leading-relaxed text-foreground mb-4'>
                        <span className='font-mono font-bold text-primary'>
                            numeric({spec.p}, {spec.s})
                        </span>
                        : {spec.about}। দশমিকের আগে {toBn(spec.p - spec.s)}টা ঘর, পরে {toBn(spec.s)}টা।
                    </p>
                    <Slots value={shown} p={spec.p} s={spec.s} failed={stored === null} />
                </div>

                <motion.div
                    key={`${typeKey}-${value}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    data-outcome={stored === null ? 'overflow' : rounded ? 'rounded' : 'exact'}
                    className={cn(
                        'border px-4 py-3 font-mono text-[0.75rem] leading-relaxed',
                        stored === null ? 'border-destructive/40 bg-destructive/5' : 'border-primary/40 bg-primary/5'
                    )}>
                    <p className='text-muted-foreground'>
                        SELECT {value}::numeric({spec.p}, {spec.s});
                    </p>
                    {stored !== null ? (
                        <>
                            <p className='mt-2 text-lg font-bold text-primary'>{stored}</p>
                            <p className='mt-1 font-sans text-sm text-foreground/90'>
                                {rounded
                                    ? 'ঢুকেছে, তবে গোল হয়ে। দশমিকের পরের বাড়তি অঙ্ক চুপচাপ বাদ, কোনো Warning নেই।'
                                    : 'ঢুকেছে, মান বদলায়নি। দরকার হলে শুধু শেষে শূন্য বসেছে।'}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className='mt-2 font-bold text-destructive'>ERROR: numeric field overflow</p>
                            <p className='mt-1 text-muted-foreground'>
                                DETAIL: A field with precision {spec.p}, scale {spec.s} must round to an absolute value
                                less than 10^{spec.p - spec.s}.
                            </p>
                            <p className='mt-2 font-sans text-sm text-foreground/90'>
                                গোল করলে হতো {shown}, দশমিকের আগে {toBn(shown.replace('-', '').split('.')[0].length)}টা অঙ্ক, ঘর
                                আছে {toBn(spec.p - spec.s)}টা। তাই কিছুই রাখা হয়নি।
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. দশবার 0.1 যোগ                                                              */
/* ------------------------------------------------------------------------- */

// PostgreSQL 18: SELECT g, sum(0.1::float8) OVER (ORDER BY g),
// sum(0.1::real) OVER (ORDER BY g), sum(0.10::numeric(10,2)) OVER (ORDER BY g)
// FROM generate_series(1, 10) g;
const DRIFT: { step: number; double: string; real: string; numeric: string }[] = [
    { step: 1, double: '0.1', real: '0.1', numeric: '0.10' },
    { step: 2, double: '0.2', real: '0.2', numeric: '0.20' },
    { step: 3, double: '0.30000000000000004', real: '0.3', numeric: '0.30' },
    { step: 4, double: '0.4', real: '0.4', numeric: '0.40' },
    { step: 5, double: '0.5', real: '0.5', numeric: '0.50' },
    { step: 6, double: '0.6', real: '0.6', numeric: '0.60' },
    { step: 7, double: '0.7', real: '0.70000005', numeric: '0.70' },
    { step: 8, double: '0.7999999999999999', real: '0.8000001', numeric: '0.80' },
    { step: 9, double: '0.8999999999999999', real: '0.9000001', numeric: '0.90' },
    { step: 10, double: '0.9999999999999999', real: '1.0000001', numeric: '1.00' },
];

const sameAs = (shown: string, exact: string) => Number(shown) === Number(exact);

/**
 * Ten payments of 0.10 added one at a time into three running totals. The
 * numeric total stays exact; the two float totals wander off and come back,
 * which is worse than wandering off for good, because a spot check can pass.
 */
export function NumtypeDriftLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(3);
    const rows = DRIFT.slice(0, step);
    const last = rows[rows.length - 1];

    return (
        <Panel
            label='Interactive'
            title='দশবার 0.10 যোগ করুন'
            footer='প্রতিটা সংখ্যা PostgreSQL 18 এ generate_series আর sum() OVER দিয়ে চালানো একটা Query থেকে নেওয়া, Query টা লেসনের পরের বক্সেই আছে। লাল ঘর মানে সেখানে মোট আর আসল যোগফল এক না।'>
            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-action='add'
                    disabled={step === DRIFT.length}
                    onClick={() => setStep(v => Math.min(DRIFT.length, v + 1))}
                    className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                    আরও একটা 0.10 যোগ করুন
                </button>
                <button
                    type='button'
                    data-action='all'
                    onClick={() => setStep(DRIFT.length)}
                    className={cn(BTN, BTN_OFF)}>
                    দশটাই একসাথে
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(1)} className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-step={step}>
                    {toBn(step)}টা Payment যোগ হয়েছে
                </span>
            </div>

            <div className='overflow-x-auto border border-border'>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            {['step', 'double precision', 'real', 'numeric(10,2)'].map(h => (
                                <th key={h} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <motion.tr
                                key={r.step}
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className='border-b border-border/60 last:border-b-0'>
                                <td className='px-3 py-1 text-muted-foreground'>{r.step}</td>
                                {[r.double, r.real].map((cell, i) => (
                                    <td
                                        key={i}
                                        data-drift={sameAs(cell, r.numeric) ? 'exact' : 'off'}
                                        className={cn(
                                            'px-3 py-1 whitespace-nowrap',
                                            sameAs(cell, r.numeric) ? 'text-foreground/90' : 'text-destructive font-bold'
                                        )}>
                                        {cell}
                                    </td>
                                ))}
                                <td className='px-3 py-1 whitespace-nowrap text-primary font-bold'>{r.numeric}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className='mt-4 text-sm leading-relaxed text-foreground'>
                {step === DRIFT.length
                    ? 'দশটা Payment শেষ। numeric বলছে ঠিক 1.00। double precision বলছে 0.9999999999999999, real বলছে 1.0000001। WHERE total = 1 লিখলে দুটো float মোটই বাদ পড়বে।'
                    : step === 3
                      ? 'তিন নম্বরেই double precision এর মোট 0.3 না, 0.30000000000000004। real এখনো ঠিক দেখাচ্ছে, কারণ তার কম অঙ্ক দেখানো হয়। চালিয়ে যান।'
                      : `এখন পর্যন্ত numeric এর মোট ${last.numeric}। লাল ঘরগুলো দেখুন: কোনোটা পরের ধাপে আবার ঠিক দেখায়, তাই এক দুইবার মিলিয়ে দেখে ভুলটা ধরা যায় না।`}
            </p>
        </Panel>
    );
}
