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
/* Real rows from the sample database                                        */
/* ------------------------------------------------------------------------- */

/** The nine tours: price in whole taka, guide null where none is assigned. */
const TOURS: { id: number; title: string; dest: number; guide: number | null; price: number }[] = [
    { id: 1, title: 'Saint Martin Island Escape', dest: 1, guide: 1, price: 12500 },
    { id: 2, title: "Cox's Bazar Beach Weekend", dest: 2, guide: 2, price: 8500 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', dest: 3, guide: 3, price: 18000 },
    { id: 4, title: 'Sajek Valley Cloud Trip', dest: 4, guide: 1, price: 9500 },
    { id: 5, title: 'Bandarban Hill Trek', dest: 5, guide: 4, price: 14000 },
    { id: 6, title: 'Sylhet Tea Garden Tour', dest: 6, guide: 2, price: 7800 },
    { id: 7, title: 'Ratargul Swamp Boat Day', dest: 6, guide: null, price: 3500 },
    { id: 8, title: 'Saint Martin Luxury Stay', dest: 1, guide: 4, price: 32000 },
    { id: 9, title: "Cox's Bazar Family Package", dest: 2, guide: 3, price: 15500 },
];

type PartitionKey = 'none' | 'destination' | 'guide' | 'band';
type WindowFn = 'count' | 'avg' | 'rank';

const band = (price: number) => (price < 10000 ? 'budget' : price < 20000 ? 'standard' : 'premium');

const KEYS: { key: PartitionKey; label: string; clause: string; of: (t: (typeof TOURS)[number]) => string }[] = [
    { key: 'none', label: 'PARTITION নেই', clause: '', of: () => 'সব ট্যুর' },
    {
        key: 'destination',
        label: 'destination_id',
        clause: 'PARTITION BY destination_id',
        of: t => `destination ${t.dest}`,
    },
    {
        key: 'guide',
        label: 'guide_id',
        clause: 'PARTITION BY guide_id',
        of: t => (t.guide === null ? 'guide NULL' : `guide ${t.guide}`),
    },
    {
        key: 'band',
        label: 'দামের ধরন (CASE)',
        clause: "PARTITION BY CASE WHEN price_bdt < 10000 THEN 'budget' ... END",
        of: t => band(t.price),
    },
];

const FNS: { key: WindowFn; label: string; sql: string; column: string }[] = [
    { key: 'count', label: 'count(*)', sql: 'count(*)', column: 'n' },
    { key: 'avg', label: 'avg(price_bdt)', sql: 'round(avg(price_bdt), 2)', column: 'avg' },
    { key: 'rank', label: 'rank() দাম অনুযায়ী', sql: 'rank()', column: 'rank' },
];

/** Same numbers PostgreSQL prints: averages with two decimals, ranks with gaps on ties. */
function windowValue(fn: WindowFn, row: (typeof TOURS)[number], peers: (typeof TOURS)[number][]): string {
    if (fn === 'count') return String(peers.length);
    if (fn === 'avg') return (peers.reduce((sum, t) => sum + t.price, 0) / peers.length).toFixed(2);
    return String(peers.filter(t => t.price > row.price).length + 1);
}

/* ------------------------------------------------------------------------- */
/* 1. Pick a partition key and a function, then click a row to see its window */
/* ------------------------------------------------------------------------- */

export function PartitionWindowLab() {
    const reduce = useReducedMotion();
    const [key, setKey] = useState<PartitionKey>('destination');
    const [fn, setFn] = useState<WindowFn>('avg');
    const [current, setCurrent] = useState(8);

    const keyDef = KEYS.find(k => k.key === key)!;
    const fnDef = FNS.find(f => f.key === fn)!;
    const groupOf = keyDef.of;

    // Rows sorted the way the picture reads best: by partition, then by price, high first.
    const rows = [...TOURS].sort((a, b) => {
        const ga = groupOf(a);
        const gb = groupOf(b);
        if (ga !== gb) return ga < gb ? -1 : 1;
        return b.price - a.price || a.id - b.id;
    });
    const currentRow = TOURS.find(t => t.id === current)!;
    const peersOf = (t: (typeof TOURS)[number]) => TOURS.filter(o => groupOf(o) === groupOf(t));
    const windowRows = peersOf(currentRow);
    const groups = new Set(TOURS.map(groupOf)).size;

    const over =
        fn === 'rank'
            ? `OVER (${keyDef.clause ? `${keyDef.clause} ` : ''}ORDER BY price_bdt DESC)`
            : `OVER (${keyDef.clause})`;

    return (
        <Panel
            label='Interactive'
            title='একটা Row বেছে নিন, তার Window দেখুন'
            footer='সব সংখ্যা Sample Database এর নয়টা ট্যুর থেকে, আর PostgreSQL 18 এ চালিয়ে মেলানো। কোনো Row এ ক্লিক করলে সেটা "এই Row" হয়ে যায়, আর তার Window এর Row গুলো রঙিন হয়। একটা জিনিস লক্ষ করুন: PARTITION যাই হোক, ফলাফলে সবসময় নয়টা Row।'>
            <div data-key={key} data-fn={fn} data-current={current} data-window-size={windowRows.length} data-groups={groups}>
                <div className='mb-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    কী দিয়ে দল বানাবেন
                </div>
                <div className='flex flex-wrap gap-2 mb-5'>
                    {KEYS.map(k => (
                        <button
                            key={k.key}
                            type='button'
                            data-key-option={k.key}
                            onClick={() => setKey(k.key)}
                            className={cn(BTN, key === k.key ? BTN_ON : BTN_OFF)}>
                            {k.label}
                        </button>
                    ))}
                </div>
                <div className='mb-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    প্রতিটা দলে কী হিসাব
                </div>
                <div className='flex flex-wrap gap-2 mb-6'>
                    {FNS.map(f => (
                        <button
                            key={f.key}
                            type='button'
                            data-fn-option={f.key}
                            onClick={() => setFn(f.key)}
                            className={cn(BTN, fn === f.key ? BTN_ON : BTN_OFF)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <pre className='mb-6 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {`SELECT title, price_bdt,\n       ${fnDef.sql} ${over} AS ${fnDef.column}\nFROM tours;`}
                </pre>

                <div className='overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className='px-3 py-2 font-bold'>দল</th>
                                <th className='px-3 py-2 font-bold'>title</th>
                                <th className='px-3 py-2 font-bold text-right'>price_bdt</th>
                                <th className='px-3 py-2 font-bold text-right text-primary'>{fnDef.column}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((t, i) => {
                                const inWindow = groupOf(t) === groupOf(currentRow);
                                const isCurrent = t.id === current;
                                const newGroup = i > 0 && groupOf(rows[i - 1]) !== groupOf(t);
                                return (
                                    <tr
                                        key={t.id}
                                        data-tour={t.id}
                                        data-in-window={inWindow}
                                        onClick={() => setCurrent(t.id)}
                                        className={cn(
                                            'cursor-pointer transition-colors',
                                            newGroup ? 'border-t-2 border-border' : 'border-t border-border/50',
                                            isCurrent
                                                ? 'bg-primary/20'
                                                : inWindow
                                                  ? 'bg-primary/[0.07]'
                                                  : 'hover:bg-muted/40'
                                        )}>
                                        <td className={cn('px-3 py-1.5 whitespace-nowrap', inWindow ? 'text-primary' : 'text-muted-foreground')}>
                                            {groupOf(t)}
                                        </td>
                                        <td className='px-3 py-1.5 whitespace-nowrap'>
                                            <button
                                                type='button'
                                                data-row-option={t.id}
                                                aria-pressed={isCurrent}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    setCurrent(t.id);
                                                }}
                                                className='text-left hover:text-primary'>
                                                {isCurrent && <span className='mr-1.5 text-primary'>▸</span>}
                                                {t.title}
                                            </button>
                                        </td>
                                        <td className='px-3 py-1.5 text-right'>{t.price.toFixed(2)}</td>
                                        <td className='px-3 py-1.5 text-right font-bold text-primary'>
                                            {windowValue(fn, t, peersOf(t))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <motion.div
                    key={`${key}-${fn}-${current}`}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className='mt-5 border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm leading-relaxed'>
                    <span className='font-bold'>{currentRow.title}</span> এর Window এ{' '}
                    <span className='font-bold text-primary'>{toBn(windowRows.length)}টা</span> Row ({groupOf(currentRow)})।
                    তাই এই Row এর {fnDef.column} হলো{' '}
                    <span className='font-mono font-bold text-primary'>{windowValue(fn, currentRow, windowRows)}</span>।
                    মোট দল {toBn(groups)}টা, আর ফলাফলে Row এখনো {toBn(TOURS.length)}টা।
                </motion.div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Each booking's share of its departure's seats                          */
/* ------------------------------------------------------------------------- */

/** Non-cancelled bookings on departures that have more than one, with PostgreSQL's rounded share. */
const SHARES: { departure: number; bookings: { id: number; seats: number; pct: string }[] }[] = [
    { departure: 1, bookings: [{ id: 1, seats: 2, pct: '33.3' }, { id: 2, seats: 4, pct: '66.7' }] },
    { departure: 4, bookings: [{ id: 6, seats: 2, pct: '66.7' }, { id: 7, seats: 1, pct: '33.3' }] },
    { departure: 6, bookings: [{ id: 9, seats: 2, pct: '66.7' }, { id: 10, seats: 1, pct: '33.3' }] },
    { departure: 8, bookings: [{ id: 13, seats: 2, pct: '33.3' }, { id: 14, seats: 4, pct: '66.7' }] },
    { departure: 10, bookings: [{ id: 15, seats: 3, pct: '37.5' }, { id: 23, seats: 5, pct: '62.5' }] },
    { departure: 11, bookings: [{ id: 16, seats: 2, pct: '50.0' }, { id: 17, seats: 2, pct: '50.0' }] },
    { departure: 14, bookings: [{ id: 20, seats: 2, pct: '50.0' }, { id: 24, seats: 2, pct: '50.0' }] },
];

export function SeatShareLab() {
    const reduce = useReducedMotion();
    const [departure, setDeparture] = useState(10);
    const current = SHARES.find(s => s.departure === departure)!;
    const total = current.bookings.reduce((sum, b) => sum + b.seats, 0);

    return (
        <Panel
            label='Interactive'
            title='একটা Departure এর সিট, কার ভাগে কতটা'
            footer='শুধু cancelled নয় এমন Booking, আর শুধু যেসব Departure এ একাধিক Booking আছে। শতাংশগুলো PostgreSQL এর round(..., 1) থেকে নেওয়া। একটা Departure এ যত Booking ই থাকুক, ভাগগুলো যোগ করলে 100 হয়, কারণ সবার হর একই: সেই Departure এর মোট সিট।'>
            <div data-departure={departure} data-total={total}>
                <div className='flex flex-wrap gap-2 mb-6'>
                    {SHARES.map(s => (
                        <button
                            key={s.departure}
                            type='button'
                            data-departure-option={s.departure}
                            onClick={() => setDeparture(s.departure)}
                            className={cn(BTN, departure === s.departure ? BTN_ON : BTN_OFF)}>
                            {`departure ${s.departure}`}
                        </button>
                    ))}
                </div>
                <div className='mb-4 font-mono text-[0.75rem] text-muted-foreground'>
                    sum(seats) OVER (PARTITION BY departure_id) ={' '}
                    <span className='font-bold text-primary'>{total}</span>
                </div>
                <div className='space-y-3'>
                    {current.bookings.map(b => (
                        <div key={b.id} data-booking={b.id}>
                            <div className='mb-1 flex justify-between font-mono text-[0.75rem]'>
                                <span>{`booking ${b.id} · ${b.seats} seats`}</span>
                                <span className='font-bold text-primary'>{b.pct}%</span>
                            </div>
                            <div className='h-3 border border-border bg-background'>
                                <motion.div
                                    key={`${departure}-${b.id}`}
                                    className='h-full bg-primary/60'
                                    initial={reduce ? false : { width: 0 }}
                                    animate={{ width: `${b.pct}%` }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <p className='mt-5 text-sm leading-relaxed text-muted-foreground'>
                    প্রতিটা Row এর হিসাব: <span className='font-mono'>100.0 * seats / {total}</span>। হরটা ({total}) সেই
                    Departure এর বাইরে যায় না, তাই অন্য Departure এর Booking এই হিসাবে কোনো প্রভাব ফেলে না।
                </p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. The same answer written three ways, and what the planner does with each */
/* ------------------------------------------------------------------------- */

type Form = 'window' | 'join' | 'correlated';

const FORMS: { key: Form; label: string; sql: string; plan: string; note: string }[] = [
    {
        key: 'window',
        label: 'Window (PARTITION BY)',
        sql: `SELECT booking_id, customer_id, total_bdt,
       sum(total_bdt) OVER (PARTITION BY customer_id) AS cust_total
FROM bookings;`,
        plan: `WindowAgg
  Window: w1 AS (PARTITION BY customer_id)
  ->  Sort
        Sort Key: customer_id
        ->  Seq Scan on bookings`,
        note: 'Table একবার পড়া হয়, customer_id দিয়ে সাজানো হয়, তারপর প্রতিটা দলের যোগফল সেই দলের প্রতিটা Row এ বসে। সবচেয়ে ছোট লেখা, আর অন্য হিসাব যোগ করতে চাইলে শুধু আরেকটা OVER।',
    },
    {
        key: 'join',
        label: 'GROUP BY তারপর Join',
        sql: `SELECT b.booking_id, b.customer_id, b.total_bdt, t.cust_total
FROM bookings b
JOIN (SELECT customer_id, sum(total_bdt) AS cust_total
      FROM bookings
      GROUP BY customer_id) t
  ON t.customer_id = b.customer_id;`,
        plan: `Hash Join
  Hash Cond: (b.customer_id = t.customer_id)
  ->  Seq Scan on bookings b
  ->  Hash
        ->  Subquery Scan on t
              ->  HashAggregate
                    Group Key: bookings.customer_id
                    ->  Seq Scan on bookings`,
        note: 'Table দুইবার পড়া হয়: একবার যোগফল বানাতে (Module 07 এর Derived Table), একবার Row গুলো আনতে, তারপর Join। Window আসার আগে মানুষ এভাবেই লিখত, আর অনেক পুরনো Code এ এখনো এটাই দেখবেন।',
    },
    {
        key: 'correlated',
        label: 'Correlated Subquery',
        sql: `SELECT b.booking_id, b.customer_id, b.total_bdt,
       (SELECT sum(b2.total_bdt)
        FROM bookings b2
        WHERE b2.customer_id = b.customer_id) AS cust_total
FROM bookings b;`,
        plan: `Seq Scan on bookings b
  SubPlan 1
    ->  Aggregate
          ->  Seq Scan on bookings b2
                Filter: (customer_id = b.customer_id)`,
        note: 'বাইরের প্রতিটা Row এর জন্য ভেতরের Query একবার চলে (Module 07 Lesson 03 এর মডেল)। চব্বিশটা Row এ কিছু যায় আসে না, কিন্তু লাখ Row এ এটাই সবচেয়ে ধীর হতে পারে।',
    },
];

export function ThreeWaysLab() {
    const reduce = useReducedMotion();
    const [form, setForm] = useState<Form>('window');
    const current = FORMS.find(f => f.key === form)!;

    return (
        <Panel
            label='Interactive'
            title='একই উত্তর, তিনভাবে লেখা'
            footer='তিনটা Plan ই PGlite (PostgreSQL 18) এ EXPLAIN (COSTS OFF) চালিয়ে নেওয়া। তিনটা Query এর চব্বিশটা Row হুবহু এক, EXCEPT দিয়ে মিলিয়ে দেখা হয়েছে: পার্থক্য 0। বড় Data তে কোনটা দ্রুত, সেটা নিজের Table এ EXPLAIN ANALYZE দিয়ে মাপুন।'>
            <div data-form={form}>
                <div className='flex flex-wrap gap-2 mb-6'>
                    {FORMS.map(f => (
                        <button
                            key={f.key}
                            type='button'
                            data-form-option={f.key}
                            onClick={() => setForm(f.key)}
                            className={cn(BTN, form === f.key ? BTN_ON : BTN_OFF)}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <motion.div
                    key={form}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <div>
                        <div className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                            Query
                        </div>
                        <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                            {current.sql}
                        </pre>
                    </div>
                    <div>
                        <div className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                            EXPLAIN (COSTS OFF)
                        </div>
                        <pre className='overflow-x-auto border border-primary/40 bg-primary/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                            {current.plan}
                        </pre>
                    </div>
                </motion.div>
                <p className='mt-5 text-sm leading-relaxed text-muted-foreground'>{current.note}</p>
                <div className='mt-4 overflow-x-auto border border-border'>
                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className='px-3 py-2'>booking_id</th>
                                <th className='px-3 py-2'>customer_id</th>
                                <th className='px-3 py-2 text-right'>total_bdt</th>
                                <th className='px-3 py-2 text-right text-primary'>cust_total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                [1, 1, '25000.00', '80000.00'],
                                [2, 2, '50000.00', '75000.00'],
                                [3, 3, '12500.00', '25000.00'],
                                [4, 4, '25500.00', '36000.00'],
                                [5, 5, '17000.00', '17000.00'],
                            ].map(r => (
                                <tr key={String(r[0])} className='border-t border-border/60'>
                                    <td className='px-3 py-1.5'>{r[0]}</td>
                                    <td className='px-3 py-1.5'>{r[1]}</td>
                                    <td className='px-3 py-1.5 text-right'>{r[2]}</td>
                                    <td className='px-3 py-1.5 text-right font-bold text-primary'>{r[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                        প্রথম ৫টা Row, booking_id অনুযায়ী। তিনটা লেখাতেই এক।
                    </p>
                </div>
            </div>
        </Panel>
    );
}
