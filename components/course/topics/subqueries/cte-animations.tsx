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
/* 1. শিকলটা ধাপে ধাপে চালানো                                                    */
/* ------------------------------------------------------------------------- */

interface ChainStep {
    name: string;
    /** Which lines of the full statement belong to this step, inclusive. */
    lines: [number, number];
    about: string;
    columns: string[];
    rows: string[][];
}

const CHAIN_SQL = [
    'WITH confirmed AS (',
    '  SELECT b.booking_id, b.total_bdt, d.tour_id',
    '  FROM bookings b',
    '  JOIN departures d ON d.departure_id = b.departure_id',
    "  WHERE b.status = 'confirmed'",
    '),',
    'revenue_by_destination AS (',
    '  SELECT ds.name, sum(c.total_bdt) AS revenue',
    '  FROM confirmed c',
    '  JOIN tours t         ON t.tour_id = c.tour_id',
    '  JOIN destinations ds ON ds.destination_id = t.destination_id',
    '  GROUP BY ds.name',
    '),',
    'average AS (',
    '  SELECT avg(revenue) AS avg_revenue',
    '  FROM revenue_by_destination',
    ')',
    'SELECT r.name, r.revenue, round(a.avg_revenue, 2) AS average,',
    '       r.revenue > a.avg_revenue AS above',
    'FROM revenue_by_destination r',
    'CROSS JOIN average a',
    'ORDER BY r.revenue DESC;',
];

// Every row below is copied from PostgreSQL 18 running the statement above on
// the Island Tours sample database.
const CHAIN: ChainStep[] = [
    {
        name: 'confirmed',
        lines: [0, 5],
        about: '২৪টা Booking থেকে শুধু confirmed গুলো, প্রতিটার পাশে তার ট্যুরের নম্বর। ১৭টা Row।',
        columns: ['booking_id', 'total_bdt', 'tour_id'],
        rows: [
            ['1', '25000.00', '1'],
            ['2', '50000.00', '1'],
            ['3', '12500.00', '1'],
            ['4', '25500.00', '2'],
            ['6', '36000.00', '3'],
            ['7', '18000.00', '3'],
            ['8', '19000.00', '4'],
            ['9', '28000.00', '5'],
            ['10', '14000.00', '5'],
            ['11', '15600.00', '6'],
            ['13', '25000.00', '1'],
            ['15', '25500.00', '2'],
            ['16', '36000.00', '3'],
            ['19', '28000.00', '5'],
            ['21', '10500.00', '7'],
            ['22', '12500.00', '1'],
            ['23', '42500.00', '2'],
        ],
    },
    {
        name: 'revenue_by_destination',
        lines: [6, 12],
        about: 'confirmed কে Table এর মতো পড়ে, ট্যুর থেকে জায়গা বের করে, জায়গা প্রতি যোগফল। ৬টা Row, Kuakata তে কিছু নেই বলে সে আসেনি।',
        columns: ['name', 'revenue'],
        rows: [
            ["Saint Martin's Island", '125000.00'],
            ["Cox's Bazar", '93500.00'],
            ['Sundarbans', '90000.00'],
            ['Bandarban', '70000.00'],
            ['Sylhet', '26100.00'],
            ['Sajek Valley', '19000.00'],
        ],
    },
    {
        name: 'average',
        lines: [13, 16],
        about: 'আগের ধাপের ৬টা আয়ের গড়। একটাই Row, একটাই সংখ্যা।',
        columns: ['avg_revenue'],
        rows: [['70600.000000000000']],
    },
    {
        name: 'মূল SELECT',
        lines: [17, 21],
        about: 'revenue_by_destination কে দ্বিতীয়বার পড়ে, প্রতিটা Row এর পাশে average এর একমাত্র সংখ্যাটা বসায়, তুলনা করে।',
        columns: ['name', 'revenue', 'average', 'above'],
        rows: [
            ["Saint Martin's Island", '125000.00', '70600.00', 't'],
            ["Cox's Bazar", '93500.00', '70600.00', 't'],
            ['Sundarbans', '90000.00', '70600.00', 't'],
            ['Bandarban', '70000.00', '70600.00', 'f'],
            ['Sylhet', '26100.00', '70600.00', 'f'],
            ['Sajek Valley', '19000.00', '70600.00', 'f'],
        ],
    },
];

/**
 * Runs the owner's report one named step at a time: the step's lines light up
 * in the statement and its real intermediate result appears next to it, so the
 * reader sees that each CTE is just a small table the next step reads.
 */
export function CteChainLab() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const current = CHAIN[step];
    const [from, to] = current.lines;

    return (
        <Panel
            label='Interactive'
            title='শিকলটা ধাপে ধাপে চালান'
            footer='প্রতিটা ফলাফল PostgreSQL 18 এ এই Statement এর ধাপগুলো আলাদা করে চালিয়ে নেওয়া। Query বক্সে যেকোনো ধাপের নাম শেষের SELECT এ বসালে ঠিক এই Row গুলোই দেখবেন।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন ধাপ'>
                {CHAIN.map((s, i) => (
                    <button
                        key={s.name}
                        type='button'
                        data-step={i + 1}
                        aria-pressed={step === i}
                        onClick={() => setStep(i)}
                        className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}. {s.name}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='next'
                    disabled={step === CHAIN.length - 1}
                    onClick={() => setStep(v => Math.min(CHAIN.length - 1, v + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <pre className='overflow-x-auto border border-border bg-background py-3 font-mono text-[0.75rem] leading-relaxed'>
                    {CHAIN_SQL.map((line, i) => (
                        <span
                            key={i}
                            className={cn(
                                'block px-4 transition-colors duration-300',
                                i >= from && i <= to ? 'bg-primary/10 text-primary' : 'text-muted-foreground/60'
                            )}>
                            {line || ' '}
                        </span>
                    ))}
                </pre>

                <motion.div
                    key={current.name}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    data-step-result={current.name}
                    data-rows={current.rows.length}>
                    <p className='text-sm leading-relaxed text-foreground mb-3'>
                        <span className='font-mono font-bold text-primary'>{current.name}</span>: {current.about}
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {current.columns.map(c => (
                                        <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {current.rows.map((row, r) => (
                                    <tr key={r} className='border-b border-border/60 last:border-b-0'>
                                        {row.map((cell, c) => (
                                            <td key={c} className='px-3 py-1 whitespace-nowrap text-foreground/90'>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                            ({current.rows.length} {current.rows.length === 1 ? 'row' : 'rows'})
                        </p>
                    </div>
                </motion.div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. PostgreSQL আগে রান্না করবে নাকি মিশিয়ে দেবে                                    */
/* ------------------------------------------------------------------------- */

type Uses = 'once' | 'twice';
type Hint = 'default' | 'materialized' | 'not';

const HINT_SQL: Record<Hint, string> = {
    default: 'AS (',
    materialized: 'AS MATERIALIZED (',
    not: 'AS NOT MATERIALIZED (',
};

const ONCE_INLINED = `Seq Scan on bookings
  Filter: ((status = 'confirmed'::text) AND (customer_id = 1))`;

const ONCE_MATERIALIZED = `CTE Scan on confirmed
  Filter: (customer_id = 1)
  CTE confirmed
    ->  Seq Scan on bookings
          Filter: (status = 'confirmed'::text)`;

const TWICE_MATERIALIZED = `CTE Scan on spend s
  Filter: (total > (InitPlan 2).col1)
  CTE spend
    ->  HashAggregate
          Group Key: bookings.customer_id
          ->  Seq Scan on bookings
                Filter: (status <> 'cancelled'::text)
  InitPlan 2
    ->  Aggregate
          ->  CTE Scan on spend`;

const TWICE_INLINED = `HashAggregate
  Group Key: bookings.customer_id
  Filter: (sum(bookings.total_bdt) > (InitPlan 1).col1)
  InitPlan 1
    ->  Aggregate
          ->  HashAggregate
                Group Key: bookings_1.customer_id
                ->  Seq Scan on bookings bookings_1
                      Filter: (status <> 'cancelled'::text)
  ->  Seq Scan on bookings
        Filter: (status <> 'cancelled'::text)`;

function outcome(uses: Uses, hint: Hint) {
    const materialized = hint === 'materialized' || (hint === 'default' && uses === 'twice');
    const plan = uses === 'once'
        ? (materialized ? ONCE_MATERIALIZED : ONCE_INLINED)
        : (materialized ? TWICE_MATERIALIZED : TWICE_INLINED);
    const why =
        hint === 'materialized'
            ? 'আপনি নিজে MATERIALIZED লিখেছেন, তাই PostgreSQL ধাপটা আগে আলাদা করে চালিয়ে ফলাফল রেখে দেয়, তারপর সেটা পড়ে।'
            : hint === 'not'
              ? uses === 'once'
                  ? 'NOT MATERIALIZED লিখেছেন, কিন্তু একবার ব্যবহার হলে এমনিতেই মিশে যেত। ফলাফল Default এর মতোই।'
                  : 'NOT MATERIALIZED লিখেছেন, তাই দুই জায়গাতেই ধাপটার Query মিশে গেছে। bookings দুইবার পড়া হচ্ছে: bookings আর bookings_1।'
              : uses === 'once'
                ? 'একবারই ব্যবহার, পার্শ্বপ্রতিক্রিয়া নেই, তাই PostgreSQL ধাপটা মূল Query তে মিশিয়ে দিয়েছে। customer_id = 1 শর্তটা সরাসরি bookings পড়ার সময়েই বসেছে।'
                : 'দুইবার ব্যবহার, তাই PostgreSQL নিজে থেকেই ধাপটা একবার চালিয়ে রেখে দিয়েছে (CTE spend), আর দুই জায়গা থেকে সেটাই পড়েছে (CTE Scan)।';
    return { materialized, plan, why };
}

/**
 * Two real queries, one CTE used once and one used twice, each planned with no
 * hint, MATERIALIZED and NOT MATERIALIZED. The plans are real PostgreSQL 18
 * EXPLAIN (COSTS OFF) output on the sample data.
 */
export function MaterializeLab() {
    const [uses, setUses] = useState<Uses>('once');
    const [hint, setHint] = useState<Hint>('default');
    const result = outcome(uses, hint);
    const query =
        uses === 'once'
            ? `EXPLAIN (COSTS OFF)\nWITH confirmed ${HINT_SQL[hint]}\n  SELECT * FROM bookings WHERE status = 'confirmed'\n)\nSELECT booking_id FROM confirmed WHERE customer_id = 1;`
            : `EXPLAIN (COSTS OFF)\nWITH spend ${HINT_SQL[hint]}\n  SELECT customer_id, sum(total_bdt) AS total\n  FROM bookings WHERE status <> 'cancelled'\n  GROUP BY customer_id\n)\nSELECT s.customer_id, s.total FROM spend s\nWHERE s.total > (SELECT avg(total) FROM spend);`;

    return (
        <Panel
            label='Interactive'
            title='আগে রান্না করে রাখা, নাকি মিশিয়ে দেওয়া'
            footer='Plan গুলো PostgreSQL 18 এর আসল EXPLAIN (COSTS OFF) ফলাফল। খরচের সংখ্যা বাদ রাখা হয়েছে, কারণ সেগুলো মেশিন ভেদে বদলায়। কোন পথ নেওয়া হলো, সেটা বদলায় না।'>
            <div className='flex flex-wrap items-center gap-2 mb-3' role='group' aria-label='কয়বার ব্যবহার'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    CTE ব্যবহার
                </span>
                {(['once', 'twice'] as Uses[]).map(u => (
                    <button
                        key={u}
                        type='button'
                        data-uses={u}
                        aria-pressed={uses === u}
                        onClick={() => setUses(u)}
                        className={cn(BTN, uses === u ? BTN_ON : BTN_OFF)}>
                        {u === 'once' ? 'একবার' : 'দুইবার'}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-5' role='group' aria-label='কী লেখা'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    লেখা
                </span>
                {(['default', 'materialized', 'not'] as Hint[]).map(h => (
                    <button
                        key={h}
                        type='button'
                        data-hint={h}
                        aria-pressed={hint === h}
                        onClick={() => setHint(h)}
                        className={cn(BTN, hint === h ? BTN_ON : BTN_OFF)}>
                        {h === 'default' ? 'কিছু না' : h === 'materialized' ? 'MATERIALIZED' : 'NOT MATERIALIZED'}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                    {query}
                </pre>
                <div data-materialized={result.materialized ? 'yes' : 'no'}>
                    <p
                        className={cn(
                            'mb-3 inline-block border px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]',
                            result.materialized ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'
                        )}>
                        {result.materialized ? 'আলাদা করে চালানো হলো (CTE Scan)' : 'মূল Query তে মিশে গেল'}
                    </p>
                    <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.6875rem] leading-relaxed text-muted-foreground'>
                        {result.plan}
                    </pre>
                    <p className='mt-3 text-sm leading-relaxed text-foreground'>{result.why}</p>
                </div>
            </div>
        </Panel>
    );
}
