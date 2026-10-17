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
/* 1. একটা একটা Row মেলানো                                                      */
/* ------------------------------------------------------------------------- */

interface Side {
    id: number;
    label: string;
}

interface Dataset {
    key: 'customers' | 'destinations' | 'tours';
    button: string;
    left: { table: string; alias: string; key: string; rows: Side[] };
    right: { table: string; alias: string; key: string; fk: string; rows: (Side & { parent: number })[] };
}

/** Real rows of the sample database, exactly as the query boxes show them. */
const DATASETS: Dataset[] = [
    {
        key: 'customers',
        button: 'customers ও bookings',
        left: {
            table: 'customers',
            alias: 'c',
            key: 'customer_id',
            rows: [
                'Rahim Uddin', 'Nusrat Jahan', 'Tanvir Ahmed', 'Farhana Akter', 'Sabbir Hossain',
                'Mitu Rahman', 'Arif Chowdhury', 'Sumaiya Islam', 'Priya Sharma', 'Aiman Zulkifli',
                'Oliver Bennett', 'Kamal Hasan', 'Shuvo Das', 'Lamia Haque', 'Imran Kabir',
            ].map((label, i) => ({ id: i + 1, label })),
        },
        right: {
            table: 'bookings',
            alias: 'b',
            key: 'booking_id',
            fk: 'customer_id',
            rows: [
                [1, 1, 'confirmed'], [2, 2, 'confirmed'], [3, 3, 'confirmed'], [4, 4, 'confirmed'],
                [5, 5, 'cancelled'], [6, 6, 'confirmed'], [7, 7, 'confirmed'], [8, 1, 'confirmed'],
                [9, 8, 'confirmed'], [10, 9, 'confirmed'], [11, 10, 'confirmed'], [12, 11, 'cancelled'],
                [13, 2, 'confirmed'], [14, 12, 'pending'], [15, 13, 'confirmed'], [16, 14, 'confirmed'],
                [17, 1, 'pending'], [18, 6, 'cancelled'], [19, 11, 'confirmed'], [20, 9, 'pending'],
                [21, 4, 'confirmed'], [22, 3, 'confirmed'], [23, 8, 'confirmed'], [24, 13, 'pending'],
            ].map(([id, parent, status]) => ({
                id: id as number,
                parent: parent as number,
                label: `#${id} · ${status}`,
            })),
        },
    },
    {
        key: 'destinations',
        button: 'destinations ও tours',
        left: {
            table: 'destinations',
            alias: 'd',
            key: 'destination_id',
            rows: ["Saint Martin's Island", "Cox's Bazar", 'Sundarbans', 'Sajek Valley', 'Bandarban', 'Sylhet', 'Kuakata'].map(
                (label, i) => ({ id: i + 1, label })
            ),
        },
        right: {
            table: 'tours',
            alias: 't',
            key: 'tour_id',
            fk: 'destination_id',
            rows: [
                [1, 1, 'Saint Martin Island Escape'],
                [2, 2, "Cox's Bazar Beach Weekend"],
                [3, 3, 'Sundarbans Mangrove Cruise'],
                [4, 4, 'Sajek Valley Cloud Trip'],
                [5, 5, 'Bandarban Hill Trek'],
                [6, 6, 'Sylhet Tea Garden Tour'],
                [7, 6, 'Ratargul Swamp Boat Day'],
                [8, 1, 'Saint Martin Luxury Stay'],
                [9, 2, "Cox's Bazar Family Package"],
            ].map(([id, parent, title]) => ({ id: id as number, parent: parent as number, label: title as string })),
        },
    },
    {
        key: 'tours',
        button: 'tours ও departures',
        left: {
            table: 'tours',
            alias: 't',
            key: 'tour_id',
            rows: [
                'Saint Martin Island Escape', "Cox's Bazar Beach Weekend", 'Sundarbans Mangrove Cruise',
                'Sajek Valley Cloud Trip', 'Bandarban Hill Trek', 'Sylhet Tea Garden Tour',
                'Ratargul Swamp Boat Day', 'Saint Martin Luxury Stay', "Cox's Bazar Family Package",
            ].map((label, i) => ({ id: i + 1, label })),
        },
        right: {
            table: 'departures',
            alias: 'dp',
            key: 'departure_id',
            fk: 'tour_id',
            rows: [
                [1, 1, '2026-01-15'], [2, 1, '2026-02-12'], [3, 2, '2026-01-23'], [4, 3, '2026-02-05'],
                [5, 4, '2026-03-06'], [6, 5, '2026-03-19'], [7, 6, '2026-04-10'], [8, 1, '2026-11-20'],
                [9, 1, '2026-12-18'], [10, 2, '2026-11-27'], [11, 3, '2026-12-04'], [12, 4, '2026-12-11'],
                [13, 5, '2027-01-08'], [14, 6, '2026-11-14'], [15, 7, '2026-11-21'], [16, 8, '2027-02-14'],
            ].map(([id, parent, date]) => ({ id: id as number, parent: parent as number, label: `#${id} · ${date}` })),
        },
    },
];

type JoinKind = 'inner' | 'left';

interface OutputRow {
    left: string;
    right: string | null;
}

/**
 * Walks the left table one row at a time and looks for partners on the right.
 * With INNER JOIN a row with no partner is dropped; with LEFT JOIN it is kept
 * once, padded with NULL. The final counts are the ones the query boxes print:
 * 24 vs 25, 9 vs 10, 16 vs 17.
 */
export function RowMatchLab() {
    const reduce = useReducedMotion();
    const [datasetKey, setDatasetKey] = useState<Dataset['key']>('customers');
    const [join, setJoin] = useState<JoinKind>('left');
    const [step, setStep] = useState(0);

    const data = DATASETS.find(d => d.key === datasetKey)!;
    const total = data.left.rows.length;
    const current = step > 0 ? data.left.rows[step - 1] : null;
    const currentMatches = current ? data.right.rows.filter(r => r.parent === current.id) : [];

    const output: OutputRow[] = [];
    let dropped = 0;
    for (const row of data.left.rows.slice(0, step)) {
        const matches = data.right.rows.filter(r => r.parent === row.id);
        if (matches.length === 0) {
            if (join === 'left') output.push({ left: row.label, right: null });
            else dropped += 1;
        }
        for (const m of matches) output.push({ left: row.label, right: m.label });
    }
    const done = step === total;

    const L = data.left.alias;
    const R = data.right.alias;
    const sql = [
        `SELECT ${L}.*, ${R}.${data.right.key}`,
        `FROM ${data.left.table} ${L}`,
        `${join === 'left' ? 'LEFT JOIN' : 'JOIN'} ${data.right.table} ${R}`,
        `  ON ${R}.${data.right.fk} = ${L}.${data.left.key};`,
    ].join('\n');

    const choose = (key: Dataset['key']) => {
        setDatasetKey(key);
        setStep(0);
    };
    const chooseJoin = (kind: JoinKind) => {
        setJoin(kind);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='একটা একটা Row মেলান: INNER বনাম LEFT'
            footer='সব Row Sample Database এর আসল Data। প্রতিবার পরের Row চাপলে বাঁ দিকের পরের Row টা ডান দিকে নিজের Key খোঁজে। একাধিক মিল পেলে প্রতিটার জন্য একটা Row, কোনো মিল না পেলে INNER JOIN তাকে ফেলে দেয় আর LEFT JOIN NULL বসিয়ে রেখে দেয়। শেষে দুই রকম Join এর মোট Row সংখ্যা মিলিয়ে দেখুন।'>
            <div className='flex flex-wrap gap-2 mb-3'>
                {DATASETS.map(d => (
                    <button
                        key={d.key}
                        type='button'
                        data-dataset={d.key}
                        onClick={() => choose(d.key)}
                        className={cn(BTN, d.key === datasetKey ? BTN_ON : BTN_OFF)}>
                        {d.button}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5'>
                {(['inner', 'left'] as JoinKind[]).map(kind => (
                    <button
                        key={kind}
                        type='button'
                        data-join={kind}
                        onClick={() => chooseJoin(kind)}
                        className={cn(BTN, kind === join ? BTN_ON : BTN_OFF)}>
                        {kind === 'inner' ? 'INNER JOIN' : 'LEFT JOIN'}
                    </button>
                ))}
                <span className='mx-1 w-px bg-border' aria-hidden />
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
                    সব একবারে
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {sql}
            </pre>

            <div className='grid gap-4 lg:grid-cols-3'>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        {data.left.table} (বাঁ দিক)
                    </p>
                    <ul className='max-h-80 overflow-y-auto border border-border divide-y divide-border/60'>
                        {data.left.rows.map((row, i) => {
                            const isCurrent = i === step - 1;
                            const seen = i < step;
                            return (
                                <li
                                    key={row.id}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-1.5 font-mono text-[0.6875rem]',
                                        isCurrent ? 'bg-primary/10 text-primary' : seen ? 'text-muted-foreground' : 'text-foreground'
                                    )}>
                                    <span className='w-6 tabular-nums opacity-60'>{row.id}</span>
                                    <span className='truncate'>{row.label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        {data.right.table} এ খোঁজা: {data.right.fk} = {current ? current.id : '?'}
                    </p>
                    <div className='min-h-24 border border-border p-3 space-y-2' data-matches={currentMatches.length}>
                        {!current && (
                            <p className='text-[0.8125rem] text-muted-foreground'>
                                পরের Row চাপুন। বাঁ দিকের প্রথম Row ডান দিকে নিজের জোড়া খুঁজবে।
                            </p>
                        )}
                        {current && currentMatches.length === 0 && (
                            <motion.p
                                key={`${datasetKey}-${step}`}
                                initial={reduce ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className='text-[0.8125rem] leading-relaxed text-primary'>
                                {current.label} এর কোনো জোড়া নেই।{' '}
                                {join === 'left'
                                    ? 'LEFT JOIN Row টা রেখে দিল, ডান দিকের ঘরে NULL বসিয়ে।'
                                    : 'INNER JOIN Row টা ফলাফল থেকে বাদ দিল।'}
                            </motion.p>
                        )}
                        {current &&
                            currentMatches.map(m => (
                                <motion.div
                                    key={`${datasetKey}-${step}-${m.id}`}
                                    initial={reduce ? false : { opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.25, ease: EASE }}
                                    className='border border-primary/40 bg-primary/5 px-3 py-1.5 font-mono text-[0.6875rem] text-foreground'>
                                    {m.label}
                                </motion.div>
                            ))}
                    </div>
                </div>

                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        ফলাফল: {toBn(output.length)}টা Row
                        {dropped > 0 && `, বাদ ${toBn(dropped)}টা`}
                    </p>
                    <ul
                        className='max-h-80 overflow-y-auto border border-border divide-y divide-border/60'
                        data-output={output.length}
                        data-done={done ? 'yes' : 'no'}>
                        {output.length === 0 && (
                            <li className='px-3 py-2 text-[0.8125rem] text-muted-foreground'>এখনো কোনো Row নেই।</li>
                        )}
                        {output.map((row, i) => (
                            <li
                                key={`${row.left}-${row.right}-${i}`}
                                className={cn(
                                    'grid grid-cols-2 gap-2 px-3 py-1.5 font-mono text-[0.6875rem]',
                                    row.right === null && 'bg-primary/10 text-primary'
                                )}>
                                <span className='truncate'>{row.left}</span>
                                <span className={cn('truncate', row.right === null && 'italic')}>
                                    {row.right ?? 'NULL'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {done && (
                <p className='mt-5 border-l-2 border-primary/60 bg-primary/5 px-4 py-3 text-[0.8125rem] leading-relaxed text-foreground'>
                    শেষ। {join === 'left' ? 'LEFT JOIN' : 'INNER JOIN'} দিল {toBn(output.length)}টা Row।{' '}
                    {join === 'left'
                        ? `বাঁ দিকের ${toBn(total)}টা Row এর প্রত্যেকে অন্তত একবার আছে।`
                        : `জোড়া না পাওয়া ${toBn(dropped)}টা Row হারিয়ে গেছে। এবার LEFT JOIN চালিয়ে পার্থক্যটা দেখুন।`}
                </p>
            )}
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. LEFT JOIN এর পরে গোনা                                                     */
/* ------------------------------------------------------------------------- */

interface JoinedBooking {
    booking: number | null;
    status: string | null;
    seats: number | null;
}

const CUSTOMER_GROUPS: { id: number; name: string; note: string; rows: JoinedBooking[] }[] = [
    {
        id: 1,
        name: 'Rahim Uddin',
        note: 'তিনটা Booking, দুটো confirmed আর একটা pending।',
        rows: [
            { booking: 1, status: 'confirmed', seats: 2 },
            { booking: 8, status: 'confirmed', seats: 2 },
            { booking: 17, status: 'pending', seats: 2 },
        ],
    },
    {
        id: 6,
        name: 'Mitu Rahman',
        note: 'দুটো Booking, একটা বাতিল।',
        rows: [
            { booking: 6, status: 'confirmed', seats: 2 },
            { booking: 18, status: 'cancelled', seats: 1 },
        ],
    },
    {
        id: 5,
        name: 'Sabbir Hossain',
        note: 'একটাই Booking, সেটাও বাতিল।',
        rows: [{ booking: 5, status: 'cancelled', seats: 2 }],
    },
    {
        id: 15,
        name: 'Imran Kabir',
        note: 'কোনো Booking নেই। LEFT JOIN তাঁর জন্য একটা NULL ভরা Row বানিয়েছে।',
        rows: [{ booking: null, status: null, seats: null }],
    },
];

/**
 * One customer's group after customers LEFT JOIN bookings, and what five
 * aggregates make of it. The values are computed from the rows and match the
 * real PostgreSQL output for customers 1, 6, 5 and 15.
 */
export function CountTrapLab() {
    const [pick, setPick] = useState(15);
    const group = CUSTOMER_GROUPS.find(g => g.id === pick)!;
    const real = group.rows.filter(r => r.booking !== null);
    const seatSum = real.reduce((s, r) => s + (r.seats ?? 0), 0);

    const metrics: { sql: string; value: string; trap: boolean; why: string }[] = [
        {
            sql: 'count(*)',
            value: String(group.rows.length),
            trap: real.length === 0,
            why:
                real.length === 0
                    ? 'Row গোনে। NULL ভরা Row টাও একটা Row, তাই ১। Booking নেই, অথচ বলছে একটা।'
                    : 'Row গোনে। এখানে প্রতিটা Row একটা আসল Booking, তাই ঠিক উত্তর।',
        },
        {
            sql: 'count(b.booking_id)',
            value: String(real.length),
            trap: false,
            why: 'শুধু NULL নয় এমন booking_id গোনে। Booking না থাকলে ০, সবসময় সত্যি।',
        },
        {
            sql: 'sum(b.seats)',
            value: real.length === 0 ? 'NULL' : String(seatSum),
            trap: real.length === 0,
            why:
                real.length === 0
                    ? 'যোগ করার মতো একটাও মান নেই, তাই ০ না, NULL। Report এ ফাঁকা ঘর দেখাবে।'
                    : 'সব Booking এর সিট যোগ, বাতিলগুলোও। শুধু confirmed চাইলে FILTER লাগবে।',
        },
        {
            sql: 'coalesce(sum(b.seats), 0)',
            value: String(seatSum),
            trap: false,
            why: 'NULL এর বদলে ০। Booking না থাকা মানুষের জন্য এটাই পড়ার মতো উত্তর।',
        },
        {
            sql: "count(b.booking_id) FILTER (WHERE b.status = 'confirmed')",
            value: String(real.filter(r => r.status === 'confirmed').length),
            trap: false,
            why: 'Module 05 এর FILTER, এখন LEFT JOIN এর সাথে। মিল না থাকলে ০।',
        },
    ];

    return (
        <Panel
            label='Interactive'
            title='একই দলে পাঁচ রকম গোনা'
            footer='প্রতিটা দল customers LEFT JOIN bookings এর পরে GROUP BY c.customer_id থেকে এসেছে। সংখ্যাগুলো আসল PostgreSQL এর ফলাফলের সাথে মেলানো। Imran Kabir কে বেছে নিলে দুটো ফাঁদ একসাথে দেখা যায়: count(*) বলে ১, আর sum বলে NULL।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {CUSTOMER_GROUPS.map(g => (
                    <button
                        key={g.id}
                        type='button'
                        data-customer={g.id}
                        onClick={() => setPick(g.id)}
                        className={cn(BTN, g.id === pick ? BTN_ON : BTN_OFF)}>
                        {g.name}
                    </button>
                ))}
            </div>
            <p className='mb-3 text-[0.8125rem] text-muted-foreground'>{group.note}</p>
            <div className='mb-5 overflow-x-auto border border-border'>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            {['customer_id', 'booking_id', 'status', 'seats'].map(h => (
                                <th key={h} className='border-b border-border px-3 py-2 text-left font-bold'>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {group.rows.map((row, i) => (
                            <tr
                                key={i}
                                className={cn('border-b border-border/60 last:border-b-0', row.booking === null && 'bg-primary/10')}>
                                <td className='px-3 py-1.5'>{group.id}</td>
                                <td className='px-3 py-1.5'>{row.booking ?? 'NULL'}</td>
                                <td className='px-3 py-1.5'>{row.status ?? 'NULL'}</td>
                                <td className='px-3 py-1.5'>{row.seats ?? 'NULL'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ul className='space-y-2' data-count-star={group.rows.length} data-count-key={real.length}>
                {metrics.map(m => (
                    <li
                        key={m.sql}
                        className={cn(
                            'grid gap-2 border px-4 py-2.5 md:grid-cols-[minmax(0,18rem)_4rem_minmax(0,1fr)] md:items-baseline',
                            m.trap ? 'border-destructive/40 bg-destructive/5' : 'border-border'
                        )}>
                        <code className='font-mono text-[0.75rem] text-foreground break-words'>{m.sql}</code>
                        <span className={cn('font-mono text-sm font-bold', m.trap ? 'text-destructive' : 'text-primary')}>
                            {m.value}
                        </span>
                        <span className='text-[0.8125rem] leading-relaxed text-muted-foreground'>{m.why}</span>
                    </li>
                ))}
            </ul>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন Join টা লাগবে                                                         */
/* ------------------------------------------------------------------------- */

type Choice = 'inner' | 'left' | 'missing';

const CHOICES: { key: Choice; label: string }[] = [
    { key: 'inner', label: 'INNER JOIN' },
    { key: 'left', label: 'LEFT JOIN' },
    { key: 'missing', label: 'LEFT JOIN + IS NULL' },
];

const CASES: { id: number; question: string; answer: Choice; why: string }[] = [
    {
        id: 1,
        question: 'Admin Panel এর Customer তালিকা, প্রত্যেকের Booking সংখ্যাসহ। যিনি কখনো বুক করেননি, তিনিও থাকবেন।',
        answer: 'left',
        why: 'সব Customer চাই, মিল থাকুক বা না থাকুক। গোনার সময় count(b.booking_id), যাতে Imran এর পাশে ০ আসে।',
    },
    {
        id: 2,
        question: 'যাঁরা কখনো বুক করেননি, শুধু তাঁদের একটা স্বাগত SMS পাঠানো হবে।',
        answer: 'missing',
        why: 'প্রশ্নটা "কার নেই"। LEFT JOIN দিয়ে সবাইকে রেখে WHERE b.booking_id IS NULL দিয়ে শুধু জোড়াহীনদের রাখুন। উত্তর: Imran Kabir।',
    },
    {
        id: 3,
        question: 'যেসব ট্যুরে Booking এসেছে, শুধু সেগুলোর নামসহ মোট আয়।',
        answer: 'inner',
        why: 'শুধু মিল পাওয়া জোড়া দরকার। Booking ছাড়া ট্যুর এই Report এ চাই না, তাই INNER JOIN ই ঠিক।',
    },
    {
        id: 4,
        question: 'প্রতিটা ট্যুরের পাশে Guide এর নাম। যে ট্যুরের Guide এখনো ঠিক হয়নি, সেটাও তালিকায় থাকবে।',
        answer: 'left',
        why: 'tours LEFT JOIN guides। Ratargul Swamp Boat Day এর guide_id NULL, INNER JOIN হলে ট্যুরটাই হারিয়ে যেত।',
    },
    {
        id: 5,
        question: 'কোন Destination এ একটাও ট্যুর নেই, Content Team জানতে চায়।',
        answer: 'missing',
        why: 'destinations LEFT JOIN tours, তারপর WHERE t.tour_id IS NULL। উত্তর: Kuakata।',
    },
    {
        id: 6,
        question: 'confirmed Booking গুলোর পাশে Departure এর তারিখ।',
        answer: 'inner',
        why: 'প্রতিটা Booking এর একটা Departure আছেই, আর প্রশ্নটা শুধু জোড়াগুলো নিয়ে। INNER JOIN যথেষ্ট আর অর্থও পরিষ্কার।',
    },
    {
        id: 7,
        question: 'প্রতিটা Departure এ কয়টা Booking, শূন্য হলেও দেখাতে হবে।',
        answer: 'left',
        why: 'departures LEFT JOIN bookings আর count(b.booking_id)। Departure 16 এ কেউ বুক করেনি, তার পাশে ০।',
    },
    {
        id: 8,
        question: 'কোন Guide এর হাতে এখন কোনো ট্যুর নেই।',
        answer: 'missing',
        why: 'guides LEFT JOIN tours, WHERE t.tour_id IS NULL। উত্তর: Nazmul Karim।',
    },
];

/**
 * Eight real requests from the Island Tours team. For each, pick the join that
 * answers it; the explanation names the real row that makes the choice matter.
 */
export function JoinChoiceLab() {
    const [answers, setAnswers] = useState<Record<number, Choice>>({});
    const score = CASES.filter(c => answers[c.id] === c.answer).length;
    const answered = Object.keys(answers).length;

    return (
        <Panel
            label='Interactive'
            title='কোন প্রশ্নে কোন Join'
            footer='তিনটা উত্তরের মধ্যে একটা বেছে নিন। প্রশ্নে "সবাই, যার নেই সেও" থাকলে LEFT JOIN, "শুধু যার নেই" থাকলে LEFT JOIN আর IS NULL, আর শুধু জোড়াগুলো লাগলে INNER JOIN।'>
            <ol className='space-y-4' data-score={score}>
                {CASES.map(c => {
                    const picked = answers[c.id];
                    const right = picked === c.answer;
                    return (
                        <li key={c.id} className='border border-border p-4' data-case={c.id}>
                            <p className='mb-3 text-[0.875rem] leading-relaxed text-foreground'>
                                <span className='mr-2 font-mono text-[0.6875rem] text-muted-foreground'>{toBn(c.id)}.</span>
                                {c.question}
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {CHOICES.map(choice => (
                                    <button
                                        key={choice.key}
                                        type='button'
                                        data-choice={choice.key}
                                        onClick={() => setAnswers(a => ({ ...a, [c.id]: choice.key }))}
                                        className={cn(
                                            BTN,
                                            picked === choice.key
                                                ? right
                                                    ? BTN_ON
                                                    : 'border-destructive/60 bg-destructive/5 text-destructive'
                                                : BTN_OFF
                                        )}>
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                            {picked && (
                                <p
                                    className={cn(
                                        'mt-3 text-[0.8125rem] leading-relaxed',
                                        right ? 'text-foreground' : 'text-muted-foreground'
                                    )}>
                                    <strong className={right ? 'text-primary' : 'text-destructive'}>
                                        {right ? 'ঠিক। ' : `ঠিক উত্তর ${CHOICES.find(x => x.key === c.answer)!.label}। `}
                                    </strong>
                                    {c.why}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ol>
            <p className='mt-5 font-mono text-[0.6875rem] text-muted-foreground'>
                স্কোর: {toBn(score)} / {toBn(CASES.length)}
                {answered > 0 && answered < CASES.length && `, বাকি ${toBn(CASES.length - answered)}টা`}
            </p>
        </Panel>
    );
}
