'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
    BY_AMOUNT,
    BY_TIME,
    type FrameUnit,
    SLIDE_PRESETS,
    type SlidePreset,
    slideFrame,
    UNIT_OFFSETS,
    unitFrame,
} from './frame-data';

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

const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------------------- */
/* 1. Frame টা Row ধরে নিচে নামছে                                               */
/* ------------------------------------------------------------------------- */

type Measure = 'sum' | 'avg' | 'count';

const MEASURES: { key: Measure; label: string }[] = [
    { key: 'sum', label: 'sum(total_bdt)' },
    { key: 'avg', label: 'avg(total_bdt)' },
    { key: 'count', label: 'count(*)' },
];

/**
 * The 17 confirmed bookings in time order. Pick a frame and a function, then
 * step the current row down the list: the tinted rows are the frame, and the
 * number on the right is what the window function returns for that row.
 */
export function FrameSlideLab() {
    const reduce = useReducedMotion();
    const [preset, setPreset] = useState<SlidePreset>('running');
    const [measure, setMeasure] = useState<Measure>('sum');
    const [current, setCurrent] = useState(0);

    const frame = slideFrame(preset, current, BY_TIME.length);
    const amounts = frame.map(i => BY_TIME[i].amount);
    const total = amounts.reduce((a, b) => a + b, 0);
    const result =
        measure === 'count'
            ? String(frame.length)
            : measure === 'sum'
              ? money(total)
              : money(Math.round((total / frame.length) * 100) / 100);
    const last = BY_TIME.length - 1;

    return (
        <Panel
            label='Interactive'
            title='Frame টা Row ধরে নিচে নামছে'
            footer='প্রতিটা Booking এর মান PostgreSQL 18 থেকে নেওয়া, আর প্রতিটা Frame PostgreSQL এর নিজের হিসাবের সাথে মিলিয়ে দেখা। এখানে Booking গুলো booked_at এর ক্রমে, কোনো দুটোর সময় এক না, তাই ROWS এর হিসাব নিশ্চিত।'>
            <div className='flex flex-wrap gap-2 mb-3'>
                {(Object.keys(SLIDE_PRESETS) as SlidePreset[]).map(key => (
                    <button
                        key={key}
                        type='button'
                        data-preset={key}
                        aria-pressed={preset === key}
                        onClick={() => setPreset(key)}
                        className={cn(BTN, preset === key ? BTN_ON : BTN_OFF)}>
                        {SLIDE_PRESETS[key].label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5'>
                {MEASURES.map(m => (
                    <button
                        key={m.key}
                        type='button'
                        data-measure={m.key}
                        aria-pressed={measure === m.key}
                        onClick={() => setMeasure(m.key)}
                        className={cn(BTN, 'font-mono', measure === m.key ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`${MEASURES.find(m => m.key === measure)?.label} OVER (\n  ORDER BY booked_at\n  ${SLIDE_PRESETS[preset].clause}\n)`}
            </pre>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-5'>
                <ol className='border border-border divide-y divide-border/60' data-frame-count={frame.length}>
                    {BY_TIME.map((row, i) => {
                        const inside = frame.includes(i);
                        const here = i === current;
                        return (
                            <li key={row.id}>
                                <button
                                    type='button'
                                    data-row={row.id}
                                    onClick={() => setCurrent(i)}
                                    className={cn(
                                        'flex w-full items-center justify-between gap-3 px-3 py-1.5 font-mono text-[0.75rem] transition-colors',
                                        here
                                            ? 'bg-primary/20 text-primary font-bold'
                                            : inside
                                              ? 'bg-primary/[0.07] text-foreground'
                                              : 'text-muted-foreground/70 hover:text-foreground',
                                    )}>
                                    <span>
                                        #{row.id} <span className='opacity-70'>{row.day}</span>
                                    </span>
                                    <span className='tabular-nums'>{money(row.amount)}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
                <div className='space-y-3'>
                    <div className='border border-primary/50 bg-primary/5 p-4'>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>
                            Current Row
                        </p>
                        <p className='font-mono text-sm font-bold text-primary'>#{BY_TIME[current].id}</p>
                        <p className='mt-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>
                            Frame এ Row
                        </p>
                        <p className='font-mono text-sm text-foreground'>{toBn(frame.length)}টা</p>
                        <p className='mt-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>
                            ফলাফল
                        </p>
                        <motion.p
                            key={`${preset}-${measure}-${current}`}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            data-result={result}
                            className='font-mono text-lg font-bold text-primary tabular-nums'>
                            {result}
                        </motion.p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            type='button'
                            data-action='prev'
                            disabled={current === 0}
                            onClick={() => setCurrent(c => Math.max(0, c - 1))}
                            className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                            আগের Row
                        </button>
                        <button
                            type='button'
                            data-action='next'
                            disabled={current === last}
                            onClick={() => setCurrent(c => Math.min(last, c + 1))}
                            className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                            পরের Row
                        </button>
                    </div>
                    <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                        যেকোনো Row তে ক্লিক করলে সেটাই Current Row হয়। Frame টা সবসময় Current Row থেকে মাপা, তাই Row
                        বদলালে Frame ও সরে যায়।
                    </p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ROWS, RANGE আর GROUPS: "আগের" মানে কী                                    */
/* ------------------------------------------------------------------------- */

const UNIT_LABEL: Record<FrameUnit, string> = { rows: 'ROWS', range: 'RANGE', groups: 'GROUPS' };

const UNIT_NOTE: Record<FrameUnit, string> = {
    rows: 'ROWS গোনে Row। কয়টা Row পিছনে, শুধু সেটা দেখে, মান কত সেটা না। তাই এখানে ক্রমটা booking_id দিয়ে অনন্য করা হয়েছে, নইলে সমান মানের দুটো Row এর কোনটা আগে সেটা নিশ্চিত না।',
    range: 'RANGE মাপে মানের দূরত্ব। Current Row এর মান থেকে এতটুকু পিছনে যত Row, সব আসে, আর সমান মানের Peer রাও আসে। পিছনে কোনো মান না থাকলে শুধু নিজে আর নিজের Peer।',
    groups: 'GROUPS গোনে সমান মানের দল। আগের একটা দল মানে ঠিক আগের আলাদা মান, সেটার সব Row সহ, তার সাথে নিজের দলের সব Row।',
};

/**
 * The 17 confirmed amounts in order, with real ties (two 12,500, two 25,000 …)
 * and real gaps. Pick a unit and an offset and click a row: the tinted rows are
 * `<unit> BETWEEN <offset> PRECEDING AND CURRENT ROW`.
 */
export function FrameUnitsLab() {
    const [unit, setUnit] = useState<FrameUnit>('rows');
    const [size, setSize] = useState<0 | 1>(0);
    const [current, setCurrent] = useState(3);

    const offset = UNIT_OFFSETS[unit][size];
    const frame = unitFrame(unit, offset, current);
    const total = frame.reduce((a, i) => a + BY_AMOUNT[i].amount, 0);
    const clause = `${UNIT_LABEL[unit]} BETWEEN ${offset} PRECEDING AND CURRENT ROW`;
    const order = unit === 'rows' ? 'total_bdt, booking_id' : 'total_bdt';

    return (
        <Panel
            label='Interactive'
            title='ROWS, RANGE আর GROUPS: পিছনে কতদূর'
            footer='১৭টা confirmed Booking, total_bdt এর ক্রমে। সব হিসাব PostgreSQL 18 এর string_agg OVER দিয়ে যাচাই করা, ছয়টা সেটিং আর সতেরোটা Row এর প্রতিটা।'>
            <div className='flex flex-wrap gap-2 mb-3'>
                {(['rows', 'range', 'groups'] as FrameUnit[]).map(key => (
                    <button
                        key={key}
                        type='button'
                        data-unit={key}
                        aria-pressed={unit === key}
                        onClick={() => setUnit(key)}
                        className={cn(BTN, 'font-mono', unit === key ? BTN_ON : BTN_OFF)}>
                        {UNIT_LABEL[key]}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5'>
                {([0, 1] as const).map(s => (
                    <button
                        key={s}
                        type='button'
                        data-offset={UNIT_OFFSETS[unit][s]}
                        aria-pressed={size === s}
                        onClick={() => setSize(s)}
                        className={cn(BTN, 'font-mono', size === s ? BTN_ON : BTN_OFF)}>
                        {`${UNIT_OFFSETS[unit][s]} PRECEDING`}
                    </button>
                ))}
            </div>
            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`count(*) OVER (\n  ORDER BY ${order}\n  ${clause}\n)`}
            </pre>
            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_16rem] gap-5'>
                <ol className='border border-border divide-y divide-border/60' data-frame-size={frame.length}>
                    {BY_AMOUNT.map((row, i) => {
                        const inside = frame.includes(i);
                        const here = i === current;
                        const peer = !here && row.amount === BY_AMOUNT[current].amount;
                        return (
                            <li key={row.id}>
                                <button
                                    type='button'
                                    data-amount-row={row.id}
                                    onClick={() => setCurrent(i)}
                                    className={cn(
                                        'flex w-full items-center justify-between gap-3 px-3 py-1.5 font-mono text-[0.75rem] transition-colors',
                                        here
                                            ? 'bg-primary/20 text-primary font-bold'
                                            : inside
                                              ? 'bg-primary/[0.07] text-foreground'
                                              : 'text-muted-foreground/70 hover:text-foreground',
                                    )}>
                                    <span>
                                        #{row.id}
                                        {peer && <span className='ml-2 text-[0.625rem] text-primary/80'>peer</span>}
                                    </span>
                                    <span className='tabular-nums'>{money(row.amount)}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
                <div className='space-y-3'>
                    <div className='border border-primary/50 bg-primary/5 p-4'>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>
                            Current Row
                        </p>
                        <p className='font-mono text-sm font-bold text-primary'>
                            #{BY_AMOUNT[current].id} · {money(BY_AMOUNT[current].amount)}
                        </p>
                        <p className='mt-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1'>
                            count(*) / sum
                        </p>
                        <p className='font-mono text-lg font-bold text-primary tabular-nums' data-count={frame.length}>
                            {frame.length} / {money(total)}
                        </p>
                    </div>
                    <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>{UNIT_NOTE[unit]}</p>
                </div>
            </div>
        </Panel>
    );
}
