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
/* 1. একটা Aggregate এর ভেতরে, Row এর পর Row                                  */
/* ------------------------------------------------------------------------- */

/** The real customers table, in customer_id order (phone shown only as present or NULL). */
const CUSTOMERS = [
    { name: 'Rahim Uddin', city: 'Dhaka', phone: true },
    { name: 'Nusrat Jahan', city: 'Dhaka', phone: true },
    { name: 'Tanvir Ahmed', city: 'Chattogram', phone: false },
    { name: 'Farhana Akter', city: 'Sylhet', phone: true },
    { name: 'Sabbir Hossain', city: 'Rajshahi', phone: true },
    { name: 'Mitu Rahman', city: 'Dhaka', phone: false },
    { name: 'Arif Chowdhury', city: 'Khulna', phone: true },
    { name: 'Sumaiya Islam', city: 'Dhaka', phone: true },
    { name: 'Priya Sharma', city: 'Kolkata', phone: false },
    { name: 'Aiman Zulkifli', city: 'Kuala Lumpur', phone: false },
    { name: 'Oliver Bennett', city: 'London', phone: false },
    { name: 'Kamal Hasan', city: 'Barishal', phone: true },
    { name: 'Shuvo Das', city: 'Dhaka', phone: true },
    { name: 'Lamia Haque', city: 'Chattogram', phone: true },
    { name: 'Imran Kabir', city: 'Dhaka', phone: true },
];

type AggKey = 'count-star' | 'count-phone' | 'count-distinct-city' | 'min-name' | 'max-name';

const AGGS: { key: AggKey; sql: string; note: string }[] = [
    { key: 'count-star', sql: 'COUNT(*)', note: 'প্রতিটা Row এ খাতায় এক যোগ হয়, ঘরে কী আছে দেখার দরকারই নেই।' },
    { key: 'count-phone', sql: 'COUNT(phone)', note: 'ফোনের ঘর NULL হলে এই Row টা গোনা হয় না।' },
    { key: 'count-distinct-city', sql: 'COUNT(DISTINCT city)', note: 'একটা খাতায় দেখা শহরের তালিকা থাকে। নতুন শহর এলে তবেই গোনা বাড়ে।' },
    { key: 'min-name', sql: 'MIN(full_name)', note: 'এখন পর্যন্ত বর্ণমালায় সবচেয়ে আগের নামটা খাতায় থাকে, ছোট কিছু এলে বদলায়।' },
    { key: 'max-name', sql: 'MAX(full_name)', note: 'এখন পর্যন্ত বর্ণমালায় সবচেয়ে পরের নামটা খাতায় থাকে, বড় কিছু এলে বদলায়।' },
];

/** The running state after the first `n` rows, and whether row n-1 changed it. */
function stateAfter(key: AggKey, n: number) {
    let count = 0;
    const cities: string[] = [];
    let best: string | null = null;
    let changed = false;
    for (let i = 0; i < n; i++) {
        const row = CUSTOMERS[i];
        changed = false;
        if (key === 'count-star') {
            count++;
            changed = true;
        } else if (key === 'count-phone') {
            if (row.phone) {
                count++;
                changed = true;
            }
        } else if (key === 'count-distinct-city') {
            if (!cities.includes(row.city)) {
                cities.push(row.city);
                changed = true;
            }
        } else {
            const better =
                best === null || (key === 'min-name' ? row.name < best : row.name > best);
            if (better) {
                best = row.name;
                changed = true;
            }
        }
    }
    const value =
        key === 'count-distinct-city'
            ? String(cities.length)
            : key === 'min-name' || key === 'max-name'
              ? (best ?? 'NULL')
              : String(count);
    return { value, changed, cities };
}

/**
 * Step one aggregate through the fifteen real customers and watch the little
 * piece of state the database keeps: a counter, a list of seen cities, or the
 * best name so far. The answer only exists once the last row has been read.
 */
export function AggregateMachineLab() {
    const reduce = useReducedMotion();
    const [agg, setAgg] = useState<AggKey>('count-star');
    const [step, setStep] = useState(0);
    const total = CUSTOMERS.length;
    const state = stateAfter(agg, step);
    const done = step === total;
    const current = AGGS.find(a => a.key === agg)!;

    return (
        <Panel
            label='Interactive'
            title='Aggregate এর খাতা, Row এর পর Row'
            footer='এই পনেরোটা Row হুবহু customers Table এর, customer_id এর ক্রমে। শেষ Row পর্যন্ত গেলে যে মান আসে সেটা PostgreSQL এর উত্তরের সাথে মিলিয়ে দেখা: COUNT(*) 15, COUNT(phone) 10, COUNT(DISTINCT city) 9, MIN(full_name) Aiman Zulkifli, MAX(full_name) Tanvir Ahmed।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {AGGS.map(a => (
                    <button
                        key={a.key}
                        type='button'
                        data-agg={a.key}
                        aria-pressed={a.key === agg}
                        onClick={() => {
                            setAgg(a.key);
                            setStep(0);
                        }}
                        className={cn(BTN, 'font-mono', a.key === agg ? BTN_ON : BTN_OFF)}>
                        {a.sql}
                    </button>
                ))}
            </div>

            <p className='font-mono text-[0.8125rem] text-foreground mb-1'>
                SELECT {current.sql} FROM customers;
            </p>
            <p className='text-sm text-muted-foreground leading-relaxed mb-5'>{current.note}</p>

            <div className='flex flex-wrap gap-2 mb-6'>
                <button
                    type='button'
                    data-action='next'
                    disabled={done}
                    onClick={() => setStep(s => Math.min(total, s + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের Row
                </button>
                <button
                    type='button'
                    data-action='all'
                    disabled={done}
                    onClick={() => setStep(total)}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    সব Row একবারে
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setStep(0)}
                    className={cn(BTN, BTN_OFF)}>
                    শুরু থেকে
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_16rem] gap-6'>
                <ol className='grid grid-cols-1 sm:grid-cols-3 gap-1.5' data-step={step}>
                    {CUSTOMERS.map((row, i) => {
                        const read = i < step;
                        const isLast = i === step - 1;
                        return (
                            <li
                                key={row.name}
                                className={cn(
                                    'border px-2.5 py-1.5 font-mono text-[0.6875rem] leading-snug transition-colors duration-300',
                                    isLast ? 'border-primary bg-primary/10' : read ? 'border-border bg-muted/30' : 'border-border/60 opacity-50'
                                )}>
                                <span className='block text-foreground truncate'>{row.name}</span>
                                <span className='block text-muted-foreground truncate'>
                                    {row.city} · {row.phone ? 'phone' : 'NULL'}
                                </span>
                            </li>
                        );
                    })}
                </ol>

                <div className='border border-border bg-background p-4 self-start'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        খাতা, {toBn(step)}/{toBn(total)} Row পড়া হয়েছে
                    </p>
                    <motion.p
                        key={`${agg}-${step}`}
                        initial={reduce ? false : { opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        data-result={state.value}
                        className={cn('font-mono text-xl font-bold break-words', done ? 'text-primary' : 'text-foreground')}>
                        {state.value}
                    </motion.p>
                    {agg === 'count-distinct-city' && state.cities.length > 0 && (
                        <p className='mt-3 font-mono text-[0.6875rem] text-muted-foreground leading-relaxed'>
                            দেখা শহর: {state.cities.join(', ')}
                        </p>
                    )}
                    <p className='mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                        {step === 0
                            ? 'এখনো কোনো Row পড়া হয়নি।'
                            : done
                              ? 'সব Row পড়া শেষ। এটাই Query এর উত্তর।'
                              : state.changed
                                ? 'এই Row খাতাটা বদলেছে।'
                                : 'এই Row খাতায় কিছু বদলায়নি।'}
                    </p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Column এ কোন COUNT                                                  */
/* ------------------------------------------------------------------------- */

const COLUMNS = [
    { key: 'customers.phone', all: 15, notNull: 10, distinct: 10, note: 'পাঁচজনের ফোন নেই, তাই COUNT(phone) 10। যাঁদের আছে, সবার নম্বর আলাদা, তাই DISTINCT ও 10।' },
    { key: 'customers.city', all: 15, notNull: 15, distinct: 9, note: 'কারও শহর ফাঁকা নেই, তাই প্রথম দুটো সমান। কিন্তু Dhaka ছয়বার আর Chattogram দুইবার, তাই আলাদা শহর মাত্র 9।' },
    { key: 'bookings.customer_id', all: 24, notNull: 24, distinct: 14, note: '24 টা Booking, কিন্তু করেছেন 14 জন। কয়েকজন একাধিকবার বুক করেছেন।' },
    { key: 'tours.guide_id', all: 9, notNull: 8, distinct: 4, note: 'Ratargul Swamp Boat Day এর Guide নেই, তাই 8। আর আটটা ট্যুর ভাগ করে নিয়েছেন মাত্র চারজন Guide।' },
    { key: 'reviews.comment', all: 10, notNull: 8, distinct: 8, note: 'দশটা Review এর দুটোতে মন্তব্য লেখা হয়নি।' },
    { key: 'payments.method', all: 19, notNull: 19, distinct: 4, note: 'উনিশটা Payment, কিন্তু উপায় মাত্র চারটা: bkash, nagad, card, bank।' },
];

/**
 * Pick a real column and compare COUNT(*), COUNT(column) and
 * COUNT(DISTINCT column) side by side. The gap between the first two is the
 * NULLs; the gap between the last two is the repeats.
 */
export function WhichCountLab() {
    const reduce = useReducedMotion();
    const [key, setKey] = useState(COLUMNS[0].key);
    const col = COLUMNS.find(c => c.key === key)!;
    const [table, column] = col.key.split('.');
    const bars = [
        { label: 'COUNT(*)', value: col.all },
        { label: `COUNT(${column})`, value: col.notNull },
        { label: `COUNT(DISTINCT ${column})`, value: col.distinct },
    ];

    return (
        <Panel
            label='Interactive'
            title='তিন COUNT, ছয়টা আসল Column'
            footer='প্রতিটা সংখ্যা Island Tours এর Sample Database থেকে PostgreSQL দিয়ে গোনা। প্রথম আর দ্বিতীয় বারের ফারাক মানে NULL কয়টা, দ্বিতীয় আর তৃতীয়টার ফারাক মানে একই মান কতবার ফিরে এসেছে।'>
            <div className='flex flex-wrap gap-2 mb-6'>
                {COLUMNS.map(c => (
                    <button
                        key={c.key}
                        type='button'
                        data-column={c.key}
                        aria-pressed={c.key === key}
                        onClick={() => setKey(c.key)}
                        className={cn(BTN, 'font-mono', c.key === key ? BTN_ON : BTN_OFF)}>
                        {c.key}
                    </button>
                ))}
            </div>

            <p className='font-mono text-[0.8125rem] text-foreground mb-5 break-words'>
                SELECT count(*), count({column}), count(DISTINCT {column}) FROM {table};
            </p>

            <div className='space-y-3 mb-5'>
                {bars.map(bar => (
                    <div key={bar.label} className='grid grid-cols-[minmax(0,13rem)_minmax(0,1fr)_2.5rem] items-center gap-3'>
                        <span className='font-mono text-[0.6875rem] text-muted-foreground break-words'>{bar.label}</span>
                        <div className='h-5 bg-muted/40 border border-border'>
                            <motion.div
                                className='h-full bg-primary/60'
                                initial={false}
                                animate={{ width: `${(bar.value / col.all) * 100}%` }}
                                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                            />
                        </div>
                        <span className='font-mono text-sm font-bold text-foreground text-right' data-count={bar.value}>
                            {bar.value}
                        </span>
                    </div>
                ))}
            </div>
            <p className='text-sm leading-relaxed text-muted-foreground'>{col.note}</p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. ছাঁকনি বদলালে Aggregate                                                  */
/* ------------------------------------------------------------------------- */

const FILTERS = [
    { key: 'all', where: '', count: '24', sum: '53', avg: '2.21', max: '50000.00', zero: '53' },
    { key: 'confirmed', where: "WHERE status = 'confirmed'", count: '17', sum: '38', avg: '2.24', max: '50000.00', zero: '38' },
    { key: 'pending', where: "WHERE status = 'pending'", count: '4', sum: '10', avg: '2.50', max: '50000.00', zero: '10' },
    { key: 'cancelled', where: "WHERE status = 'cancelled'", count: '3', sum: '5', avg: '1.67', max: '25000.00', zero: '5' },
    { key: 'november', where: "WHERE booked_at >= '2026-11-01'", count: '0', sum: 'NULL', avg: 'NULL', max: 'NULL', zero: '0' },
];

/**
 * The same five aggregates over bookings under five different WHERE clauses,
 * including one that lets no row through, so the empty-input answers (0 for
 * COUNT, NULL for the rest) show up next to ordinary ones.
 */
export function FilterThenAggregateLab() {
    const [key, setKey] = useState(FILTERS[0].key);
    const f = FILTERS.find(x => x.key === key)!;
    const cells = [
        { label: 'count(*)', value: f.count },
        { label: 'sum(seats)', value: f.sum },
        { label: 'round(avg(seats), 2)', value: f.avg },
        { label: 'max(total_bdt)', value: f.max },
        { label: 'coalesce(sum(seats), 0)', value: f.zero },
    ];

    return (
        <Panel
            label='Interactive'
            title='আগে WHERE, তারপর Aggregate'
            footer="প্রতিটা ছাঁকনির ফলাফল PostgreSQL এ চালিয়ে নেওয়া। শেষ ছাঁকনিতে একটাও Booking পড়ে না, কারণ ধরে নেওয়া আজ 1 November 2026 আর এই মাসে এখনো কোনো Booking আসেনি। লক্ষ করুন, তখনও উত্তরে একটা Row আসে, শুধু বেশিরভাগ ঘর NULL।">
            <div className='flex flex-wrap gap-2 mb-6'>
                {FILTERS.map(x => (
                    <button
                        key={x.key}
                        type='button'
                        data-filter={x.key}
                        aria-pressed={x.key === key}
                        onClick={() => setKey(x.key)}
                        className={cn(BTN, x.key === key ? BTN_ON : BTN_OFF)}>
                        {x.key === 'all' ? 'সব Booking' : x.key === 'november' ? 'November 2026' : x.key}
                    </button>
                ))}
            </div>

            <pre className='font-mono text-[0.8125rem] text-foreground mb-5 whitespace-pre-wrap break-words'>
                {`SELECT count(*), sum(seats), round(avg(seats), 2),
       max(total_bdt), coalesce(sum(seats), 0)
FROM bookings${f.where ? `\n${f.where}` : ''};`}
            </pre>

            <div className='grid grid-cols-2 md:grid-cols-5 gap-2' data-filter-result={f.key}>
                {cells.map(cell => (
                    <div
                        key={cell.label}
                        className={cn(
                            'border px-3 py-2',
                            cell.value === 'NULL' ? 'border-dashed border-border' : 'border-border bg-background'
                        )}>
                        <span className='block font-mono text-[0.625rem] text-muted-foreground break-words'>{cell.label}</span>
                        <span
                            className={cn(
                                'block font-mono text-base font-bold',
                                cell.value === 'NULL' ? 'text-muted-foreground/70 italic' : 'text-foreground'
                            )}>
                            {cell.value}
                        </span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}
