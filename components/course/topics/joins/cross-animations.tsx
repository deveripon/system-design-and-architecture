'use client';

import { cn, toBn } from '@/lib/utils';
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

const BTN = 'px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left disabled:opacity-40';
const BTN_ON = 'border-primary bg-primary/10 text-primary';
const BTN_OFF = 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40';

/* ------------------------------------------------------------------------- */
/* 1. জোড়া লাগার প্রক্রিয়া: ৯টা ট্যুর × ৭টা Destination                          */
/* ------------------------------------------------------------------------- */

/** The real tours with the destination each one goes to. */
const PAIR_TOURS: { id: number; title: string; destination: number }[] = [
    { id: 1, title: 'Saint Martin Island Escape', destination: 1 },
    { id: 2, title: "Cox's Bazar Beach Weekend", destination: 2 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', destination: 3 },
    { id: 4, title: 'Sajek Valley Cloud Trip', destination: 4 },
    { id: 5, title: 'Bandarban Hill Trek', destination: 5 },
    { id: 6, title: 'Sylhet Tea Garden Tour', destination: 6 },
    { id: 7, title: 'Ratargul Swamp Boat Day', destination: 6 },
    { id: 8, title: 'Saint Martin Luxury Stay', destination: 1 },
    { id: 9, title: "Cox's Bazar Family Package", destination: 2 },
];

const PAIR_DESTINATIONS: { id: number; short: string }[] = [
    { id: 1, short: 'Saint Martin' },
    { id: 2, short: "Cox's Bazar" },
    { id: 3, short: 'Sundarbans' },
    { id: 4, short: 'Sajek' },
    { id: 5, short: 'Bandarban' },
    { id: 6, short: 'Sylhet' },
    { id: 7, short: 'Kuakata' },
];

/**
 * The row-pairing story on the real tables. Each click pairs one more tour
 * with all seven destinations, so the count grows by seven. Switching the ON
 * condition on keeps only the pairs whose keys match: nine rows, and the
 * Kuakata column stays empty because no tour goes there.
 */
export function CrossPairLab() {
    const [done, setDone] = useState(0);
    const [withOn, setWithOn] = useState(false);

    const total = PAIR_TOURS.length;
    const paired = PAIR_TOURS.slice(0, done);
    const rows = withOn
        ? paired.length
        : paired.length * PAIR_DESTINATIONS.length;
    const sql = withOn
        ? 'SELECT t.title, d.name\nFROM tours t\nCROSS JOIN destinations d\nWHERE t.destination_id = d.destination_id;'
        : 'SELECT t.title, d.name\nFROM tours t\nCROSS JOIN destinations d;';

    return (
        <Panel
            label='Interactive'
            title='প্রতিটা ট্যুর, প্রতিটা Destination এর সাথে'
            footer={
                <>
                    প্রতিটা ঘর ফলাফলের একটা Row। শর্ত ছাড়া প্রতিটা ঘরই Row, তাই ৯ × ৭ = ৬৩। শর্ত বসালে শুধু সেই
                    ঘরগুলো থাকে যেখানে ট্যুরের destination_id আর Destination এর id মেলে। তখন ফলাফল ঠিক
                    INNER JOIN এর ফলাফলের মতো, ৯টা Row।
                </>
            }>
            <div
                className='space-y-5'
                data-done={done}
                data-rows={rows}
                data-mode={withOn ? 'on' : 'cross'}>
                <div className='flex flex-wrap gap-2'>
                    <button
                        type='button'
                        onClick={() => setDone(d => Math.min(total, d + 1))}
                        disabled={done >= total}
                        data-action='next'
                        className={cn(BTN, BTN_OFF)}>
                        পরের ট্যুর জোড়া লাগান
                    </button>
                    <button
                        type='button'
                        onClick={() => setDone(total)}
                        disabled={done >= total}
                        data-action='all'
                        className={cn(BTN, BTN_OFF)}>
                        সব একবারে
                    </button>
                    <button
                        type='button'
                        onClick={() => setDone(0)}
                        data-action='reset'
                        className={cn(BTN, BTN_OFF)}>
                        আবার শুরু
                    </button>
                    <button
                        type='button'
                        onClick={() => setWithOn(v => !v)}
                        aria-pressed={withOn}
                        data-action='toggle-on'
                        className={cn(BTN, withOn ? BTN_ON : BTN_OFF)}>
                        {withOn ? 'শর্ত আছে: id মেলাতে হবে' : 'শর্ত নেই: সব জোড়া'}
                    </button>
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {sql}
                </pre>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[40rem] border-collapse font-mono text-[0.6875rem]'>
                        <thead>
                            <tr>
                                <th className='px-2 py-1.5 text-left font-bold text-muted-foreground'>tour</th>
                                {PAIR_DESTINATIONS.map(d => (
                                    <th
                                        key={d.id}
                                        className={cn(
                                            'px-1 py-1.5 text-center font-bold',
                                            withOn && d.id === 7 && done > 0
                                                ? 'text-destructive'
                                                : 'text-muted-foreground'
                                        )}>
                                        {d.short}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PAIR_TOURS.map((t, i) => {
                                const isDone = i < done;
                                return (
                                    <tr key={t.id} className='border-t border-border/60'>
                                        <td
                                            className={cn(
                                                'px-2 py-1 whitespace-nowrap transition-colors duration-300',
                                                isDone ? 'text-foreground' : 'text-muted-foreground/50'
                                            )}>
                                            {t.title}
                                        </td>
                                        {PAIR_DESTINATIONS.map(d => {
                                            const match = t.destination === d.id;
                                            const kept = isDone && (!withOn || match);
                                            const dropped = isDone && withOn && !match;
                                            return (
                                                <td key={d.id} className='px-1 py-1 text-center'>
                                                    <span
                                                        className={cn(
                                                            'inline-block h-5 w-full min-w-[3.5rem] border transition-all duration-300',
                                                            kept && match && withOn
                                                                ? 'border-primary bg-primary/30'
                                                                : kept
                                                                  ? 'border-primary/60 bg-primary/10'
                                                                  : dropped
                                                                    ? 'border-border bg-transparent opacity-30'
                                                                    : 'border-dashed border-border/60 bg-transparent'
                                                        )}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    <div className='border border-border bg-background px-4 py-3'>
                        <div className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                            জোড়া লাগানো ট্যুর
                        </div>
                        <div className='mt-1 text-lg font-black'>
                            {toBn(done)} / {toBn(total)}
                        </div>
                    </div>
                    <div className='border border-primary/50 bg-primary/5 px-4 py-3'>
                        <div className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-primary'>
                            ফলাফলে Row
                        </div>
                        <div className='mt-1 text-lg font-black text-primary'>{toBn(rows)}</div>
                    </div>
                    <div className='border border-border bg-background px-4 py-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                        {withOn
                            ? done === total
                                ? 'নয়টা ট্যুর, নয়টা মেলানো ঘর। Kuakata এর Column পুরো খালি: কোনো ট্যুর সেখানে যায় না।'
                                : 'প্রতিটা ট্যুরের সারিতে ঠিক একটা ঘর টিকে থাকে, তার নিজের Destination।'
                            : `এখন পর্যন্ত ${toBn(done)} × ৭ = ${toBn(rows)}টা Row। প্রতিটা নতুন ট্যুর সাতটা করে যোগ করে।`}
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. দুর্ঘটনার Cartesian Product: সংখ্যা কতগুণ ফুলে ওঠে                         */
/* ------------------------------------------------------------------------- */

interface AccidentCase {
    key: string;
    label: string;
    sql: string;
    rows: number;
    result: string;
    healthy: boolean;
    why: string;
}

/** Every number below is the real output of the query on the sample database. */
const CASES: AccidentCase[] = [
    {
        key: 'correct',
        label: 'ঠিক JOIN',
        sql: 'SELECT count(*), sum(b.total_bdt)\nFROM bookings b\nJOIN customers c ON c.customer_id = b.customer_id;',
        rows: 24,
        result: 'count 24, sum 592300.00',
        healthy: true,
        why: 'প্রতিটা Booking তার নিজের Customer এর সাথে একবারই জোড়া লাগে। Row সংখ্যা bookings এর সমান, যোগফল আসল আয়।',
    },
    {
        key: 'comma',
        label: 'Comma, WHERE ভুলে গেছেন',
        sql: 'SELECT count(*), sum(b.total_bdt)\nFROM bookings b, customers c;',
        rows: 360,
        result: 'count 360, sum 8884500.00',
        healthy: false,
        why: '২৪টা Booking এর প্রতিটা ১৫ জন Customer এর প্রত্যেকের সাথে জোড়া লাগল। প্রতিটা Booking পনেরো বার গোনা হলো, তাই যোগফলও ঠিক পনেরো গুণ: 592300 × 15 = 8884500।',
    },
    {
        key: 'on-true',
        label: 'JOIN ... ON true',
        sql: 'SELECT count(*), sum(b.total_bdt)\nFROM bookings b\nJOIN customers c ON true;',
        rows: 360,
        result: 'count 360, sum 8884500.00',
        healthy: false,
        why: 'ON এ যে শর্ত সবসময় সত্য, সেটা আসলে কোনো শর্তই না। ফলাফল হুবহু CROSS JOIN। MySQL এ ON পুরো বাদ দিলেও একই ঘটনা ঘটে, কোনো Error ছাড়া।',
    },
    {
        key: 'three',
        label: 'তিন Table, একটা শর্ত কম',
        sql: 'SELECT count(*), sum(b.total_bdt)\nFROM bookings b, departures d, tours t\nWHERE b.departure_id = d.departure_id;',
        rows: 216,
        result: 'count 216, sum 5330700.00',
        healthy: false,
        why: 'bookings আর departures ঠিকমতো জোড়া লেগেছে, ২৪টা Row। কিন্তু tours এর সাথে কোনো শর্ত নেই, তাই প্রতিটা Row নয়টা ট্যুরের সাথে জোড়া লাগল: ২৪ × ৯ = ২১৬, যোগফল নয় গুণ।',
    },
    {
        key: 'distinct',
        label: 'DISTINCT দিয়ে ঢাকা',
        sql: "SELECT DISTINCT c.full_name\nFROM bookings b, customers c\nWHERE b.status = 'pending';",
        rows: 15,
        result: '15টা নাম, আসলে হওয়ার কথা 4টা',
        healthy: false,
        why: 'DISTINCT বাড়তি কপিগুলো মুছে দেয়, তাই সংখ্যাটা কম দেখায় আর সন্দেহ জাগে না। কিন্তু pending Booking আছে মাত্র চারজনের, অথচ তালিকায় এল সব পনেরো জন। ভুলটা ঢাকা পড়েছে, সারেনি।',
    },
];

/**
 * Five ways the same data can be joined, with the real counts and totals. The
 * bar shows the row count against the 24 bookings that really exist.
 */
export function AccidentLab() {
    const [key, setKey] = useState('comma');
    const current = CASES.find(c => c.key === key) ?? CASES[0];
    const max = 360;

    return (
        <Panel
            label='Interactive'
            title='একই Data, পাঁচ রকম Join'
            footer={
                <>
                    এখানের প্রতিটা সংখ্যা Sample Database এ Query চালিয়ে পাওয়া। এই লেসনের যেকোনো Query বক্সে যেকোনো
                    একটা Query বসিয়ে নিজে মিলিয়ে দেখতে পারেন।
                </>
            }>
            <div className='space-y-5' data-case={current.key} data-rows={current.rows}>
                <div className='flex flex-wrap gap-2'>
                    {CASES.map(c => (
                        <button
                            key={c.key}
                            type='button'
                            onClick={() => setKey(c.key)}
                            aria-pressed={c.key === key}
                            data-case={c.key}
                            className={cn(BTN, c.key === key ? BTN_ON : BTN_OFF)}>
                            {c.label}
                        </button>
                    ))}
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {current.sql}
                </pre>

                <div className='space-y-2'>
                    <div className='flex items-baseline justify-between font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        <span>ফলাফলের Row</span>
                        <span>bookings এ আসলে ২৪টা</span>
                    </div>
                    <div className='relative h-6 border border-border bg-background'>
                        <div
                            className={cn(
                                'absolute inset-y-0 left-0 transition-all duration-500',
                                current.healthy ? 'bg-primary/40' : 'bg-destructive/30'
                            )}
                            style={{ width: `${Math.max(2, (current.rows / max) * 100)}%` }}
                        />
                        <div
                            className='absolute inset-y-0 border-l-2 border-primary'
                            style={{ left: `${(24 / max) * 100}%` }}
                        />
                        <span className='absolute inset-y-0 right-2 flex items-center font-mono text-[0.6875rem] font-bold'>
                            {toBn(current.rows)}
                        </span>
                    </div>
                </div>

                <div
                    className={cn(
                        'border px-4 py-3 text-sm leading-relaxed',
                        current.healthy
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-destructive/40 bg-destructive/5'
                    )}>
                    <p className='font-mono text-[0.75rem] font-bold'>{current.result}</p>
                    <p className='mt-2 text-muted-foreground'>{current.why}</p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Report এর Grid তিন ধাপে                                                  */
/* ------------------------------------------------------------------------- */

const GRID_MONTHS = ['2026-11', '2026-12', '2027-01', '2027-02'];

/** All nine tours, in report order, with their real departure months in the window. */
const GRID_TOURS: { title: string; active: boolean; months: string[] }[] = [
    { title: 'Bandarban Hill Trek', active: true, months: ['2027-01'] },
    { title: "Cox's Bazar Beach Weekend", active: true, months: ['2026-11'] },
    { title: "Cox's Bazar Family Package", active: true, months: [] },
    { title: 'Ratargul Swamp Boat Day', active: true, months: ['2026-11'] },
    { title: 'Saint Martin Island Escape', active: true, months: ['2026-11', '2026-12'] },
    { title: 'Saint Martin Luxury Stay', active: false, months: ['2027-02'] },
    { title: 'Sajek Valley Cloud Trip', active: true, months: ['2026-12'] },
    { title: 'Sundarbans Mangrove Cruise', active: true, months: ['2026-12'] },
    { title: 'Sylhet Tea Garden Tour', active: true, months: ['2026-11'] },
];

const GRID_STEPS: { title: string; sql: string }[] = [
    {
        title: '১. মাসের ক্যালেন্ডার',
        sql: "SELECT m.month\nFROM generate_series(DATE '2026-11-01', DATE '2027-02-01',\n                     interval '1 month') AS m(month);",
    },
    {
        title: '২. CROSS JOIN: সব ঘর',
        sql: "SELECT t.title, m.month\nFROM tours t\nCROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',\n                           interval '1 month') AS m(month)",
    },
    {
        title: '৩. LEFT JOIN: গুনতি',
        sql: "SELECT t.title, to_char(m.month, 'YYYY-MM') AS month,\n       count(d.departure_id) AS departures\nFROM tours t\nCROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',\n                           interval '1 month') AS m(month)\nLEFT JOIN departures d\n       ON d.tour_id = t.tour_id\n      AND d.starts_on >= m.month\n      AND d.starts_on <  m.month + interval '1 month'",
    },
];

/**
 * Builds the winter departure grid in the same three moves as the query: the
 * calendar, every tour times every month, then the real counts. A switch adds
 * the inactive tour back, which brings the only February departure with it.
 */
export function GridBuilderLab() {
    const [step, setStep] = useState(2);
    const [includeInactive, setIncludeInactive] = useState(false);

    const tours = GRID_TOURS.filter(t => includeInactive || t.active);
    const cells = tours.length * GRID_MONTHS.length;
    const filled = tours.reduce((sum, t) => sum + t.months.length, 0);
    const where = includeInactive ? '' : '\nWHERE t.is_active';
    const tail = step === 2 ? '\nGROUP BY t.title, m.month\nORDER BY t.title, m.month;' : ';';
    const sql = step === 0 ? GRID_STEPS[0].sql : GRID_STEPS[step].sql + where + tail;

    return (
        <Panel
            label='Interactive'
            title='শীতের Departure এর Grid, তিন ধাপে'
            footer={
                <>
                    আসল হিসাব: চালু আটটা ট্যুর × চারটা মাস = ৩২টা ঘর, তার আটটায় একটা করে Departure। বন্ধ ট্যুরটা
                    যোগ করলে ৯ × ৪ = ৩৬টা ঘর, আর ফেব্রুয়ারির একমাত্র Departure টা দেখা দেয়, কারণ সেটা বন্ধ ট্যুর
                    Saint Martin Luxury Stay এর।
                </>
            }>
            <div
                className='space-y-5'
                data-step={step}
                data-cells={step === 0 ? GRID_MONTHS.length : cells}
                data-filled={step === 2 ? filled : 0}>
                <div className='flex flex-wrap gap-2'>
                    {GRID_STEPS.map((s, i) => (
                        <button
                            key={s.title}
                            type='button'
                            onClick={() => setStep(i)}
                            aria-pressed={step === i}
                            data-step={i}
                            className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                            {s.title}
                        </button>
                    ))}
                    <button
                        type='button'
                        onClick={() => setIncludeInactive(v => !v)}
                        aria-pressed={includeInactive}
                        data-action='toggle-inactive'
                        className={cn(BTN, includeInactive ? BTN_ON : BTN_OFF)}>
                        {includeInactive ? 'বন্ধ ট্যুরও আছে' : 'শুধু চালু ট্যুর'}
                    </button>
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {sql}
                </pre>

                {step === 0 ? (
                    <div className='flex flex-wrap gap-2'>
                        {GRID_MONTHS.map(m => (
                            <span
                                key={m}
                                className='border border-primary/60 bg-primary/10 px-3 py-1.5 font-mono text-[0.75rem] font-bold text-primary'>
                                {m}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[34rem] border-collapse font-mono text-[0.6875rem]'>
                            <thead>
                                <tr>
                                    <th className='px-2 py-1.5 text-left text-muted-foreground'>title</th>
                                    {GRID_MONTHS.map(m => (
                                        <th key={m} className='px-2 py-1.5 text-center text-muted-foreground'>
                                            {m}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tours.map(t => (
                                    <tr key={t.title} className='border-t border-border/60'>
                                        <td
                                            className={cn(
                                                'px-2 py-1 whitespace-nowrap',
                                                t.active ? 'text-foreground' : 'text-muted-foreground italic'
                                            )}>
                                            {t.title}
                                        </td>
                                        {GRID_MONTHS.map(m => {
                                            const has = t.months.includes(m);
                                            const show = step === 2;
                                            return (
                                                <td key={m} className='px-2 py-1 text-center'>
                                                    <span
                                                        className={cn(
                                                            'inline-flex h-6 w-12 items-center justify-center border transition-colors duration-300',
                                                            show && has
                                                                ? 'border-primary bg-primary/25 font-bold text-primary'
                                                                : show
                                                                  ? 'border-border text-muted-foreground/60'
                                                                  : 'border-dashed border-border/70 text-transparent'
                                                        )}>
                                                        {show ? (has ? '1' : '0') : '·'}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    <div className='border border-border bg-background px-4 py-3'>
                        <div className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                            Row
                        </div>
                        <div className='mt-1 text-lg font-black'>
                            {step === 0 ? toBn(GRID_MONTHS.length) : toBn(cells)}
                        </div>
                    </div>
                    <div className='border border-primary/50 bg-primary/5 px-4 py-3'>
                        <div className='font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-primary'>
                            Departure আছে এমন ঘর
                        </div>
                        <div className='mt-1 text-lg font-black text-primary'>
                            {step === 2 ? toBn(filled) : 'এখনো গোনা হয়নি'}
                        </div>
                    </div>
                    <div className='border border-border bg-background px-4 py-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                        {step === 0
                            ? 'চারটা মাস, এখনো কোনো ট্যুর নেই।'
                            : step === 1
                              ? `${toBn(tours.length)}টা ট্যুর × ৪টা মাস। প্রতিটা ঘর একটা জোড়া, এখনো ফাঁকা।`
                              : `${toBn(cells - filled)}টা ঘরে ০। শূন্যগুলো CROSS JOIN ছাড়া কখনো দেখা যেত না।`}
                    </div>
                </div>
            </div>
        </Panel>
    );
}
