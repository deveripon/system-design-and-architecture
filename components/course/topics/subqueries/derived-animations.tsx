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
const SQL_BOX = 'overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground whitespace-pre';
const CELL = 'px-3 py-1.5 font-mono text-[0.75rem] whitespace-nowrap';

/** Two decimals the way PostgreSQL prints round(x, 2). */
function money(value: number) {
    return (Math.round(value * 100) / 100).toFixed(2);
}

/* ------------------------------------------------------------------------- */
/* 1. দুই ধাপের গড়                                                             */
/* ------------------------------------------------------------------------- */

/** The 17 confirmed bookings of the sample database, as (booking, customer, amount). */
export const CONFIRMED: { booking: number; customer: number; total: number }[] = [
    { booking: 1, customer: 1, total: 25000 },
    { booking: 8, customer: 1, total: 19000 },
    { booking: 2, customer: 2, total: 50000 },
    { booking: 13, customer: 2, total: 25000 },
    { booking: 3, customer: 3, total: 12500 },
    { booking: 22, customer: 3, total: 12500 },
    { booking: 4, customer: 4, total: 25500 },
    { booking: 21, customer: 4, total: 10500 },
    { booking: 6, customer: 6, total: 36000 },
    { booking: 7, customer: 7, total: 18000 },
    { booking: 9, customer: 8, total: 28000 },
    { booking: 23, customer: 8, total: 42500 },
    { booking: 10, customer: 9, total: 14000 },
    { booking: 11, customer: 10, total: 15600 },
    { booking: 19, customer: 11, total: 28000 },
    { booking: 15, customer: 13, total: 25500 },
    { booking: 16, customer: 14, total: 36000 },
];

/** All 15 customers by id, so the "everyone" level can show its zeros. */
export const CUSTOMER_NAMES: Record<number, string> = {
    1: 'Rahim Uddin',
    2: 'Nusrat Jahan',
    3: 'Tanvir Ahmed',
    4: 'Farhana Akter',
    5: 'Sabbir Hossain',
    6: 'Mitu Rahman',
    7: 'Arif Chowdhury',
    8: 'Sumaiya Islam',
    9: 'Priya Sharma',
    10: 'Aiman Zulkifli',
    11: 'Oliver Bennett',
    12: 'Kamal Hasan',
    13: 'Shuvo Das',
    14: 'Lamia Haque',
    15: 'Imran Kabir',
};

type Level = 'booking' | 'buyer' | 'everyone';

/** One row per customer: the inner query of the two-level average. */
export function perCustomer(level: Exclude<Level, 'booking'>): { customer: number; spent: number }[] {
    const sums = CONFIRMED.reduce<Record<number, number>>((acc, row) => {
        acc[row.customer] = (acc[row.customer] ?? 0) + row.total;
        return acc;
    }, {});
    const ids = level === 'everyone' ? Object.keys(CUSTOMER_NAMES).map(Number) : Object.keys(sums).map(Number);
    return ids.sort((a, b) => a - b).map(id => ({ customer: id, spent: sums[id] ?? 0 }));
}

/** The outer number for each level, computed from the rows above. */
export function levelAnswer(level: Level): { rows: number; answer: string } {
    if (level === 'booking') {
        const total = CONFIRMED.reduce((sum, row) => sum + row.total, 0);
        return { rows: CONFIRMED.length, answer: money(total / CONFIRMED.length) };
    }
    const rows = perCustomer(level);
    const total = rows.reduce((sum, row) => sum + row.spent, 0);
    return { rows: rows.length, answer: money(total / rows.length) };
}

const LEVEL_SQL: Record<Level, string> = {
    booking: `SELECT round(avg(total_bdt), 2)
FROM bookings
WHERE status = 'confirmed';`,
    buyer: `SELECT round(avg(spent), 2)
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS per_customer;`,
    everyone: `SELECT round(avg(coalesce(s.spent, 0)), 2)
FROM customers c
LEFT JOIN (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS s ON s.customer_id = c.customer_id;`,
};

const LEVELS: { key: Level; label: string }[] = [
    { key: 'booking', label: 'প্রতি Booking এ গড়' },
    { key: 'buyer', label: 'যাঁরা কিনেছেন, প্রতিজনে' },
    { key: 'everyone', label: 'সব Customer, শূন্যসহ' },
];

const STEP_NAMES = ['উৎস: confirmed Booking', 'ভেতরের Query: প্রতিজনের মোট', 'বাইরের Query: গড়'];

/**
 * Walks the two-level average on the real 17 confirmed bookings: the source
 * rows, the inner per-customer totals, then the outer average. The one-step
 * "per booking" version has no middle step, which is the whole point.
 */
export function TwoLevelLab() {
    const reduce = useReducedMotion();
    const [level, setLevel] = useState<Level>('buyer');
    const [step, setStep] = useState(1);
    const hasInner = level !== 'booking';
    const shown = hasInner ? step : step === 2 ? 3 : step;
    const answer = levelAnswer(level);
    const inner = hasInner ? perCustomer(level) : [];

    const choose = (next: Level) => {
        setLevel(next);
        setStep(1);
    };

    return (
        <Panel
            label='Interactive'
            title='দুই ধাপের গড়, ধাপে ধাপে'
            footer='প্রতিটা সংখ্যা Sample Data এর ১৭টা confirmed Booking থেকে হিসাব করা। নিচের Query বক্সে একই Query চালালে হুবহু একই উত্তর আসবে।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='কোন স্তরের গড়'>
                {LEVELS.map(l => (
                    <button
                        key={l.key}
                        type='button'
                        data-level={l.key}
                        aria-pressed={level === l.key}
                        onClick={() => choose(l.key)}
                        className={cn(BTN, level === l.key ? BTN_ON : BTN_OFF)}>
                        {l.label}
                    </button>
                ))}
            </div>

            <pre className={SQL_BOX}>{LEVEL_SQL[level]}</pre>

            <div className='mt-5 flex flex-wrap items-center gap-2'>
                {STEP_NAMES.map((name, i) => {
                    const n = i + 1;
                    const disabled = !hasInner && n === 2;
                    return (
                        <button
                            key={name}
                            type='button'
                            data-action='step'
                            data-step={n}
                            disabled={disabled}
                            onClick={() => setStep(n)}
                            className={cn(BTN, shown === n ? BTN_ON : BTN_OFF, disabled && 'opacity-40 cursor-not-allowed')}>
                            {toBn(n)}. {name}
                        </button>
                    );
                })}
            </div>

            <motion.div
                key={`${level}-${shown}`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className='mt-5'
                data-shown-step={shown}
                data-answer={shown === 3 ? answer.answer : undefined}>
                {shown === 1 && (
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-muted/40 text-left'>
                                    <th className={CELL}>booking_id</th>
                                    <th className={CELL}>customer</th>
                                    <th className={CELL}>total_bdt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CONFIRMED.map(row => (
                                    <tr key={row.booking} className='border-t border-border/60'>
                                        <td className={CELL}>{row.booking}</td>
                                        <td className={CELL}>{CUSTOMER_NAMES[row.customer]}</td>
                                        <td className={CELL}>{money(row.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className='px-3 py-2 text-xs text-muted-foreground border-t border-border'>
                            {toBn(CONFIRMED.length)}টা Row। {hasInner ? 'এগুলো থেকে প্রথমে প্রতিজনের মোট বানানো হবে।' : 'এক ধাপেই এই ১৭টার গড় নেওয়া হবে।'}
                        </p>
                    </div>
                )}

                {shown === 2 && hasInner && (
                    <div className='overflow-x-auto border border-primary/50'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-primary/10 text-left'>
                                    <th className={CELL}>customer_id</th>
                                    <th className={CELL}>name</th>
                                    <th className={CELL}>spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inner.map(row => (
                                    <tr key={row.customer} className={cn('border-t border-border/60', row.spent === 0 && 'text-muted-foreground')}>
                                        <td className={CELL}>{row.customer}</td>
                                        <td className={CELL}>{CUSTOMER_NAMES[row.customer]}</td>
                                        <td className={CELL}>{money(row.spent)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className='px-3 py-2 text-xs text-muted-foreground border-t border-border'>
                            {toBn(inner.length)} Row এর অস্থায়ী Table।{' '}
                            {level === 'everyone'
                                ? 'যাঁদের কোনো confirmed Booking নেই, LEFT JOIN আর COALESCE তাঁদের 0 দিয়ে রেখেছে।'
                                : 'যাঁদের কোনো confirmed Booking নেই, তাঁরা এখানে নেই।'}
                        </p>
                    </div>
                )}

                {shown === 3 && (
                    <div className='border border-primary/50 bg-primary/5 px-5 py-4'>
                        <p className='font-mono text-[0.75rem] text-muted-foreground'>
                            avg, {toBn(answer.rows)}টা মানের উপর
                        </p>
                        <p className='mt-1 font-mono text-2xl font-bold text-primary'>{answer.answer}</p>
                        <p className='mt-2 text-sm text-muted-foreground leading-relaxed'>
                            {level === 'booking' &&
                                'এটা Booking প্রতি গড়। যিনি দুটো Booking করেছেন, তিনি এখানে দুইবার গোনা হয়েছেন, তাই এটা মানুষ প্রতি গড় না।'}
                            {level === 'buyer' &&
                                'এটা কেনা মানুষ প্রতি গড়: প্রতিজন একবার, তাঁর সব confirmed Booking মিলিয়ে।'}
                            {level === 'everyone' &&
                                'এটা সব Customer প্রতি গড়: যাঁরা কিছু কেনেননি, তাঁরাও শূন্য নিয়ে গড়ে বসেছেন, তাই সংখ্যা কমেছে।'}
                        </p>
                    </div>
                )}
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Fan-out আর তার সমাধান                                                    */
/* ------------------------------------------------------------------------- */

/** Tour 1's four departures and the seven bookings on them, from the sample data. */
export const TOUR1_DEPARTURES = [
    { id: 1, seatsLeft: 14 },
    { id: 2, seatsLeft: 19 },
    { id: 8, seatsLeft: 14 },
    { id: 9, seatsLeft: 19 },
];

export const TOUR1_BOOKINGS = [
    { id: 1, departure: 1, seats: 2 },
    { id: 2, departure: 1, seats: 4 },
    { id: 3, departure: 2, seats: 1 },
    { id: 12, departure: 2, seats: 2 },
    { id: 13, departure: 8, seats: 2 },
    { id: 14, departure: 8, seats: 4 },
    { id: 22, departure: 9, seats: 1 },
];

type Mode = 'join-first' | 'sum-first';

/** The rows the final GROUP BY sees, and the three totals it produces. */
export function fanOutResult(mode: Mode) {
    const rows =
        mode === 'join-first'
            ? TOUR1_BOOKINGS.map(b => {
                  const d = TOUR1_DEPARTURES.find(x => x.id === b.departure)!;
                  return { departure: d.id, seatsLeft: d.seatsLeft, booking: String(b.id), seats: b.seats };
              })
            : TOUR1_DEPARTURES.map(d => ({
                  departure: d.id,
                  seatsLeft: d.seatsLeft,
                  booking: 'সব',
                  seats: TOUR1_BOOKINGS.filter(b => b.departure === d.id).reduce((sum, b) => sum + b.seats, 0),
              }));
    return {
        rows,
        departures: rows.length,
        free: rows.reduce((sum, r) => sum + r.seatsLeft, 0),
        booked: rows.reduce((sum, r) => sum + r.seats, 0),
    };
}

const MODE_SQL: Record<Mode, string> = {
    'join-first': `SELECT t.tour_id,
       count(*)          AS departures,
       sum(d.seats_left) AS free_seats,
       sum(b.seats)      AS booked
FROM tours t
JOIN departures d     ON d.tour_id = t.tour_id
LEFT JOIN bookings b  ON b.departure_id = d.departure_id
WHERE t.tour_id = 1
GROUP BY t.tour_id;`,
    'sum-first': `SELECT t.tour_id,
       count(*)          AS departures,
       sum(d.seats_left) AS free_seats,
       coalesce(sum(bk.seats), 0) AS booked
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN (
    SELECT departure_id, sum(seats) AS seats
    FROM bookings
    GROUP BY departure_id
) AS bk ON bk.departure_id = d.departure_id
WHERE t.tour_id = 1
GROUP BY t.tour_id;`,
};

/**
 * Tour 1 two ways. Joining bookings first makes 7 rows and counts each
 * departure's free seats once per booking (113); summing bookings per
 * departure first keeps 4 rows (66). Booked seats are 16 either way.
 */
export function FanOutFixLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<Mode>('join-first');
    const result = fanOutResult(mode);

    return (
        <Panel
            label='Interactive'
            title='Tour 1: আগে Join, নাকি আগে যোগ'
            footer='সংখ্যাগুলো Tour 1 এর আসল চারটা Departure আর সাতটা Booking থেকে। ঠিক উত্তর: Departure ৪টা, খালি সিট ৬৬টা, বিক্রি হওয়া সিট ১৬টা।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='কোন ক্রমে'>
                {(['join-first', 'sum-first'] as Mode[]).map(m => (
                    <button
                        key={m}
                        type='button'
                        data-mode={m}
                        aria-pressed={mode === m}
                        onClick={() => setMode(m)}
                        className={cn(BTN, mode === m ? BTN_ON : BTN_OFF)}>
                        {m === 'join-first' ? 'আগে Join, পরে যোগ' : 'আগে যোগ (Derived Table), পরে Join'}
                    </button>
                ))}
            </div>

            <pre className={SQL_BOX}>{MODE_SQL[mode]}</pre>

            <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className='mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]'
                data-departures={result.departures}
                data-free={result.free}
                data-booked={result.booked}>
                <div className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className={CELL}>departure</th>
                                <th className={CELL}>seats_left</th>
                                <th className={CELL}>booking</th>
                                <th className={CELL}>seats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.rows.map((row, i) => {
                                const repeated = result.rows.findIndex(r => r.departure === row.departure) !== i;
                                return (
                                    <tr key={`${row.departure}-${row.booking}`} className='border-t border-border/60'>
                                        <td className={CELL}>{row.departure}</td>
                                        <td className={cn(CELL, repeated && 'text-destructive font-bold')}>
                                            {row.seatsLeft}
                                            {repeated && ' ↺'}
                                        </td>
                                        <td className={CELL}>{row.booking}</td>
                                        <td className={CELL}>{row.seats}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <p className='px-3 py-2 text-xs text-muted-foreground border-t border-border'>
                        GROUP BY এর আগে {toBn(result.rows.length)}টা Row।{' '}
                        {mode === 'join-first'
                            ? 'লাল চিহ্নের seats_left আগের Row এর পুনরাবৃত্তি, যোগফলে আবার ঢুকবে।'
                            : 'প্রতিটা Departure ঠিক একবার, কোনো পুনরাবৃত্তি নেই।'}
                    </p>
                </div>
                <div className={cn('border px-4 py-3 space-y-2', mode === 'join-first' ? 'border-destructive/50 bg-destructive/5' : 'border-primary/50 bg-primary/5')}>
                    <p className='font-mono text-[0.75rem]'>departures = {result.departures}</p>
                    <p className='font-mono text-[0.75rem]'>free_seats = {result.free}</p>
                    <p className='font-mono text-[0.75rem]'>booked = {result.booked}</p>
                    <p className='pt-1 text-sm leading-relaxed text-muted-foreground'>
                        {mode === 'join-first'
                            ? 'departures আর free_seats ফুলে গেছে, কারণ এক Departure এর Row প্রতিটা Booking এর জন্য একবার করে এসেছে। booked ঠিক আছে, কারণ seats নিজেই bookings এর Column।'
                            : 'তিনটাই ঠিক। ভেতরের Query bookings কে Departure প্রতি এক Row এ নামিয়ে এনেছে, তাই Join এর পরে কোনো Departure দুইবার আসেনি।'}
                    </p>
                </div>
            </motion.div>
        </Panel>
    );
}
