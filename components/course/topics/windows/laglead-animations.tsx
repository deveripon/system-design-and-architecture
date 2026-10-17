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
/* 1. LAG আর LEAD হাতে চালিয়ে দেখা                                              */
/* ------------------------------------------------------------------------- */

interface LookRow {
    key: string;
    /** What the row is called on screen, for example a month or a booking. */
    label: string;
    /** The value LAG and LEAD read from this row. */
    value: string;
    /** Which partition the row belongs to, only used by the bookings data. */
    group: number;
}

// Real rows from the Island Tours sample database. Monthly confirmed revenue,
// and the bookings of customers 1, 2 and 13 by booking date.
const MONTHLY: LookRow[] = [
    { key: '2025-12', label: '2025-12', value: '75000.00', group: 0 },
    { key: '2026-01', label: '2026-01', value: '92000.00', group: 0 },
    { key: '2026-02', label: '2026-02', value: '19000.00', group: 0 },
    { key: '2026-03', label: '2026-03', value: '57600.00', group: 0 },
    { key: '2026-09', label: '2026-09', value: '50500.00', group: 0 },
    { key: '2026-10', label: '2026-10', value: '129500.00', group: 0 },
];

const BOOKINGS_BY_DATE: LookRow[] = [
    { key: 'b1', label: 'customer 1, booking 1', value: '2025-12-20', group: 1 },
    { key: 'b2', label: 'customer 2, booking 2', value: '2025-12-28', group: 2 },
    { key: 'b8', label: 'customer 1, booking 8', value: '2026-02-20', group: 1 },
    { key: 'b13', label: 'customer 2, booking 13', value: '2026-09-15', group: 2 },
    { key: 'b15', label: 'customer 13, booking 15', value: '2026-09-20', group: 13 },
    { key: 'b17', label: 'customer 1, booking 17', value: '2026-10-08', group: 1 },
    { key: 'b24', label: 'customer 13, booking 24', value: '2026-10-14', group: 13 },
];

type Dataset = 'monthly' | 'bookings';
type Fn = 'lag' | 'lead';

/** The rows in the order the window walks them: by customer first when partitioned. */
function orderedRows(dataset: Dataset, partition: boolean): LookRow[] {
    if (dataset === 'monthly') return MONTHLY;
    if (!partition) return BOOKINGS_BY_DATE;
    return [...BOOKINGS_BY_DATE].sort((a, b) => a.group - b.group || a.value.localeCompare(b.value));
}

/** Index of the row LAG or LEAD reads for row i, or null when there is none. */
function sourceIndex(rows: LookRow[], i: number, fn: Fn, offset: number, partition: boolean) {
    const j = fn === 'lag' ? i - offset : i + offset;
    if (j < 0 || j >= rows.length) return null;
    if (partition && rows[j].group !== rows[i].group) return null;
    return j;
}

/**
 * Pick the data, LAG or LEAD, the offset, a default and whether to partition,
 * then click any row to see which row it reads. Every output matches what
 * PostgreSQL 18 returns for the query printed above the table.
 */
export function LagLeadLab() {
    const reduce = useReducedMotion();
    const [dataset, setDataset] = useState<Dataset>('monthly');
    const [fn, setFn] = useState<Fn>('lag');
    const [offset, setOffset] = useState(1);
    const [withDefault, setWithDefault] = useState(false);
    const [partition, setPartition] = useState(true);
    const [selected, setSelected] = useState(2);

    const usePartition = dataset === 'bookings' && partition;
    const useDefault = dataset === 'monthly' && withDefault;
    const rows = orderedRows(dataset, usePartition);
    const current = Math.min(selected, rows.length - 1);
    const results = rows.map((_, i) => {
        const j = sourceIndex(rows, i, fn, offset, usePartition);
        if (j !== null) return rows[j].value;
        return useDefault ? '0' : null;
    });
    const sourceOfCurrent = sourceIndex(rows, current, fn, offset, usePartition);

    const column = dataset === 'monthly' ? 'revenue' : 'booked_at::date';
    const args = `${column}${offset !== 1 || useDefault ? `, ${offset}` : ''}${useDefault ? ', 0' : ''}`;
    const over = usePartition
        ? 'PARTITION BY customer_id ORDER BY booked_at'
        : dataset === 'monthly'
          ? 'ORDER BY month'
          : 'ORDER BY booked_at';
    const sql = `${fn}(${args}) OVER (${over})`;

    return (
        <Panel
            label='Interactive'
            title='LAG আর LEAD কোন Row পড়ে'
            footer='যেকোনো Row এ ক্লিক করুন: সেই Row এর জন্য LAG বা LEAD কোন Row থেকে মান আনছে, সেটা চিহ্নিত হবে। Booking এর Data তে শুধু Customer 1, 2 আর 13, অর্থাৎ WHERE customer_id IN (1, 2, 13)। মানগুলো PostgreSQL 18 এ উপরের Query চালিয়ে মেলানো।'>
            <div className='space-y-5'>
                <div className='flex flex-wrap gap-2'>
                    {(
                        [
                            ['monthly', 'মাসিক আয়, ৬টা Row'],
                            ['bookings', 'তিনজন Customer এর Booking, ৭টা Row'],
                        ] as const
                    ).map(([key, label]) => (
                        <button
                            key={key}
                            type='button'
                            data-dataset={key}
                            aria-pressed={dataset === key}
                            onClick={() => setDataset(key)}
                            className={cn(BTN, dataset === key ? BTN_ON : BTN_OFF)}>
                            {label}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap gap-2'>
                    {(['lag', 'lead'] as const).map(key => (
                        <button
                            key={key}
                            type='button'
                            data-fn={key}
                            aria-pressed={fn === key}
                            onClick={() => setFn(key)}
                            className={cn(BTN, fn === key ? BTN_ON : BTN_OFF)}>
                            {key === 'lag' ? 'LAG: পেছনে' : 'LEAD: সামনে'}
                        </button>
                    ))}
                    {[1, 2].map(n => (
                        <button
                            key={n}
                            type='button'
                            data-offset={n}
                            aria-pressed={offset === n}
                            onClick={() => setOffset(n)}
                            className={cn(BTN, offset === n ? BTN_ON : BTN_OFF)}>
                            {`${toBn(n)} Row দূরে`}
                        </button>
                    ))}
                    {dataset === 'monthly' ? (
                        <button
                            type='button'
                            data-default={withDefault ? 'zero' : 'null'}
                            aria-pressed={withDefault}
                            onClick={() => setWithDefault(v => !v)}
                            className={cn(BTN, withDefault ? BTN_ON : BTN_OFF)}>
                            {withDefault ? 'Default: 0' : 'Default: NULL'}
                        </button>
                    ) : (
                        <button
                            type='button'
                            data-partition={partition ? 'on' : 'off'}
                            aria-pressed={partition}
                            onClick={() => setPartition(v => !v)}
                            className={cn(BTN, partition ? BTN_ON : BTN_OFF)}>
                            {partition ? 'PARTITION BY customer_id: চালু' : 'PARTITION BY: বন্ধ'}
                        </button>
                    )}
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] text-foreground'>
                    {sql}
                </pre>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[30rem] border-collapse font-mono text-[0.75rem]' data-results={results.map(r => r ?? 'NULL').join('|')}>
                        <thead>
                            <tr className='bg-muted/40 text-left'>
                                <th className='border-b border-border px-3 py-2'>Row</th>
                                <th className='border-b border-border px-3 py-2'>{column}</th>
                                <th className='border-b border-border px-3 py-2'>{fn}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => {
                                const isCurrent = i === current;
                                const isSource = i === sourceOfCurrent;
                                const newGroup = usePartition && i > 0 && rows[i - 1].group !== row.group;
                                return (
                                    <tr
                                        key={row.key}
                                        data-row={row.key}
                                        onClick={() => setSelected(i)}
                                        className={cn(
                                            'cursor-pointer border-b border-border/60 transition-colors',
                                            newGroup && 'border-t-2 border-t-primary/60',
                                            isCurrent && 'bg-primary/10',
                                            isSource && 'bg-primary/5'
                                        )}>
                                        <td className={cn('px-3 py-1.5', isCurrent && 'text-primary font-bold')}>
                                            {row.label}
                                        </td>
                                        <td className={cn('px-3 py-1.5', isSource && 'text-primary font-bold underline underline-offset-4')}>
                                            {row.value}
                                        </td>
                                        <td className={cn('px-3 py-1.5', results[i] === null ? 'text-muted-foreground/60 italic' : isCurrent ? 'text-primary font-bold' : '')}>
                                            {results[i] ?? 'NULL'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <motion.p
                    key={`${dataset}-${fn}-${offset}-${String(useDefault)}-${String(usePartition)}-${current}`}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    data-verdict={sourceOfCurrent === null ? 'none' : 'found'}
                    className='text-sm leading-relaxed text-foreground'>
                    {sourceOfCurrent === null
                        ? usePartition
                            ? `এই Row থেকে ${toBn(offset)} Row ${fn === 'lag' ? 'পেছনে' : 'সামনে'} একই Customer এর কোনো Booking নেই। দেয়ালের ওপারে অন্য Customer থাকলেও ${fn.toUpperCase()} সেখানে যায় না, তাই ${useDefault ? 'Default' : 'NULL'}।`
                            : `এই Row থেকে ${toBn(offset)} Row ${fn === 'lag' ? 'পেছনে' : 'সামনে'} কোনো Row নেই, তাই ফলাফল ${useDefault ? 'Default এর মান 0' : 'NULL'}।`
                        : `এই Row এর ${fn.toUpperCase()} পড়ছে ${toBn(offset)} Row ${fn === 'lag' ? 'উপরের' : 'নিচের'} মান, ${rows[sourceOfCurrent].value}।`}
                </motion.p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Frame বদলালে LAST_VALUE বদলায়                                             */
/* ------------------------------------------------------------------------- */

const TOUR1_DEPARTURES = ['2026-01-15', '2026-02-12', '2026-11-20', '2026-12-18'];

type FrameMode = 'default' | 'full';

/**
 * Tour 1's four departures. Step the current row down and switch the frame:
 * with only ORDER BY the frame stops at the current row, so LAST_VALUE copies
 * the current row and NTH_VALUE(…, 2) is NULL on the first row.
 */
export function FrameValueLab() {
    const [frame, setFrame] = useState<FrameMode>('default');
    const [current, setCurrent] = useState(1);
    const end = frame === 'default' ? current : TOUR1_DEPARTURES.length - 1;
    const first = TOUR1_DEPARTURES[0];
    const last = TOUR1_DEPARTURES[end];
    const second = end >= 1 ? TOUR1_DEPARTURES[1] : null;
    const over =
        frame === 'default'
            ? 'ORDER BY starts_on'
            : 'ORDER BY starts_on\n      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING';

    return (
        <Panel
            label='Interactive'
            title='Frame এর শেষ কোথায়, LAST_VALUE সেখানেই'
            footer='Tour 1 এর আসল চারটা Departure। Next দিয়ে এক Row এক Row নামুন, আর Frame বদলে দেখুন LAST_VALUE আর NTH_VALUE কখন বদলায়। FIRST_VALUE কখনো বদলায় না, কারণ Frame সবসময় প্রথম Row থেকে শুরু।'>
            <div className='space-y-5'>
                <div className='flex flex-wrap gap-2'>
                    {(
                        [
                            ['default', 'শুধু ORDER BY (Default Frame)'],
                            ['full', 'পুরো Partition (UNBOUNDED FOLLOWING)'],
                        ] as const
                    ).map(([key, label]) => (
                        <button
                            key={key}
                            type='button'
                            data-frame={key}
                            aria-pressed={frame === key}
                            onClick={() => setFrame(key)}
                            className={cn(BTN, frame === key ? BTN_ON : BTN_OFF)}>
                            {label}
                        </button>
                    ))}
                    <button
                        type='button'
                        data-action='prev'
                        disabled={current === 0}
                        onClick={() => setCurrent(c => Math.max(0, c - 1))}
                        className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                        Prev
                    </button>
                    <button
                        type='button'
                        data-action='next'
                        disabled={current === TOUR1_DEPARTURES.length - 1}
                        onClick={() => setCurrent(c => Math.min(TOUR1_DEPARTURES.length - 1, c + 1))}
                        className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                        Next
                    </button>
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {`first_value(starts_on), last_value(starts_on), nth_value(starts_on, 2)\nOVER (PARTITION BY tour_id ${over})`}
                </pre>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]'>
                    <ol className='space-y-1.5' data-current={current} data-frame-end={end}>
                        {TOUR1_DEPARTURES.map((d, i) => {
                            const inFrame = i <= end;
                            return (
                                <li
                                    key={d}
                                    className={cn(
                                        'flex items-center justify-between border px-3 py-2 font-mono text-[0.75rem] transition-colors',
                                        inFrame ? 'border-primary/60 bg-primary/5' : 'border-border text-muted-foreground',
                                        i === current && 'bg-primary/15 font-bold text-primary'
                                    )}>
                                    <span>{d}</span>
                                    <span className='text-[0.625rem] uppercase tracking-[0.1em]'>
                                        {i === current ? 'এই Row' : inFrame ? 'Frame এ' : 'Frame এর বাইরে'}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                    <dl className='grid grid-cols-1 gap-2 font-mono text-[0.75rem]' data-last={last} data-second={second ?? 'NULL'}>
                        <div className='border border-border px-3 py-2'>
                            <dt className='text-muted-foreground'>first_value</dt>
                            <dd className='text-foreground'>{first}</dd>
                        </div>
                        <div className='border border-border px-3 py-2'>
                            <dt className='text-muted-foreground'>last_value</dt>
                            <dd className={cn(frame === 'default' ? 'text-primary font-bold' : 'text-foreground')}>{last}</dd>
                        </div>
                        <div className='border border-border px-3 py-2'>
                            <dt className='text-muted-foreground'>nth_value(…, 2)</dt>
                            <dd className={second === null ? 'italic text-muted-foreground/70' : 'text-foreground'}>
                                {second ?? 'NULL'}
                            </dd>
                        </div>
                        <p className='font-sans text-sm leading-relaxed text-foreground'>
                            {frame === 'default'
                                ? `Frame শেষ হচ্ছে এই Row এ, তাই last_value হলো এই Row এর নিজের তারিখ।${second === null ? ' দ্বিতীয় Row এখনো Frame এ ঢোকেনি, তাই nth_value NULL।' : ''}`
                                : 'Frame পুরো Partition জুড়ে, তাই প্রতিটা Row এ last_value একই: শেষ Departure।'}
                        </p>
                    </dl>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. NTILE: সমান ভাগে ভাগ করা                                                 */
/* ------------------------------------------------------------------------- */

// The nine tours sorted by price, as in the sample database.
const TOURS_BY_PRICE: [string, string][] = [
    ['Ratargul Swamp Boat Day', '3500.00'],
    ['Sylhet Tea Garden Tour', '7800.00'],
    ["Cox's Bazar Beach Weekend", '8500.00'],
    ['Sajek Valley Cloud Trip', '9500.00'],
    ['Saint Martin Island Escape', '12500.00'],
    ['Bandarban Hill Trek', '14000.00'],
    ["Cox's Bazar Family Package", '15500.00'],
    ['Sundarbans Mangrove Cruise', '18000.00'],
    ['Saint Martin Luxury Stay', '32000.00'],
];

/**
 * What NTILE(n) gives row i of `rows`: buckets as equal as possible, with the
 * first (rows % n) buckets one row larger, exactly as PostgreSQL does it.
 */
export function ntileBucket(rows: number, n: number, i: number) {
    const base = Math.floor(rows / n);
    const extra = rows % n;
    const bigRows = extra * (base + 1);
    if (i < bigRows) return Math.floor(i / (base + 1)) + 1;
    return extra + Math.floor((i - bigRows) / base) + 1;
}

/**
 * Split the nine real tours into 1 to 6 buckets by price and watch the bucket
 * sizes: nine rows never split evenly into four, so the first bucket gets the
 * extra row.
 */
export function NtileLab() {
    const [n, setN] = useState(4);
    const buckets = TOURS_BY_PRICE.map((_, i) => ntileBucket(TOURS_BY_PRICE.length, n, i));
    const sizes = Array.from({ length: n }, (_, b) => buckets.filter(x => x === b + 1).length);

    return (
        <Panel
            label='Interactive'
            title='NTILE ৯টা ট্যুরকে কয় ভাগে ভাগ করে'
            footer='ভাগের সংখ্যা বদলান। প্রতিটা ভাগে কয়টা ট্যুর পড়ল, সেটা নিচে। ভাগগুলো যত সম্ভব সমান হয়, আর যা বাকি থাকে সেটা প্রথম দিকের ভাগগুলোতে একটা করে যায়। ফলাফল PostgreSQL 18 এর ntile() এর সাথে মেলানো।'>
            <div className='space-y-5'>
                <div className='flex flex-wrap gap-2'>
                    {[1, 2, 3, 4, 5, 6].map(k => (
                        <button
                            key={k}
                            type='button'
                            data-buckets={k}
                            aria-pressed={n === k}
                            onClick={() => setN(k)}
                            className={cn(BTN, n === k ? BTN_ON : BTN_OFF)}>
                            {`NTILE(${k})`}
                        </button>
                    ))}
                </div>
                <ol className='space-y-1.5' data-assignment={buckets.join(',')}>
                    {TOURS_BY_PRICE.map(([title, price], i) => (
                        <li
                            key={title}
                            className={cn(
                                'grid grid-cols-[3rem_minmax(0,1fr)_6rem] items-center gap-3 border px-3 py-2 font-mono text-[0.75rem]',
                                buckets[i] % 2 === 1 ? 'border-primary/50 bg-primary/5' : 'border-border bg-background'
                            )}>
                            <span className='font-bold text-primary'>{buckets[i]}</span>
                            <span className='truncate text-foreground'>{title}</span>
                            <span className='text-right text-muted-foreground'>{price}</span>
                        </li>
                    ))}
                </ol>
                <p className='text-sm leading-relaxed text-foreground' data-sizes={sizes.join(',')}>
                    {`ভাগের মাপ: ${sizes.map(s => toBn(s)).join(', ')}। মোট ৯টা ট্যুর, ${toBn(n)}টা ভাগ।`}
                    {TOURS_BY_PRICE.length % n === 0
                        ? ' সমান ভাগ হয়েছে।'
                        : ` ${toBn(TOURS_BY_PRICE.length % n)}টা ভাগে একটা করে বেশি, আর সেগুলো সবার আগের ভাগ।`}
                </p>
            </div>
        </Panel>
    );
}
