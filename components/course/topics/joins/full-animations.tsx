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
/* 1. Row মেলানো ধাপে ধাপে, চার রকম Join এ                                       */
/* ------------------------------------------------------------------------- */

/** The five real guides and nine real tours of the sample database. */
const GUIDES = [
    { id: 1, name: 'Jamal Hossain' },
    { id: 2, name: 'Shirin Akter' },
    { id: 3, name: 'Rubel Mia' },
    { id: 4, name: 'Ayesha Siddiqua' },
    { id: 5, name: 'Nazmul Karim' },
];

const TOURS: { id: number; title: string; guide: number | null }[] = [
    { id: 1, title: 'Saint Martin Island Escape', guide: 1 },
    { id: 2, title: "Cox's Bazar Beach Weekend", guide: 2 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', guide: 3 },
    { id: 4, title: 'Sajek Valley Cloud Trip', guide: 1 },
    { id: 5, title: 'Bandarban Hill Trek', guide: 4 },
    { id: 6, title: 'Sylhet Tea Garden Tour', guide: 2 },
    { id: 7, title: 'Ratargul Swamp Boat Day', guide: null },
    { id: 8, title: 'Saint Martin Luxury Stay', guide: 4 },
    { id: 9, title: "Cox's Bazar Family Package", guide: 3 },
];

type Kind = 'match' | 'left' | 'right';
type JoinType = 'inner' | 'left' | 'right' | 'full';

/**
 * Every row a FULL JOIN could produce, in the order the lab walks them: each
 * guide with each of their tours (or alone), then the tours nobody claimed.
 */
type Candidate = { guide: number | null; tour: number | null; kind: Kind };

const CANDIDATES: Candidate[] = [
    ...GUIDES.flatMap((g): Candidate[] => {
        const mine = TOURS.filter(t => t.guide === g.id);
        return mine.length
            ? mine.map(t => ({ guide: g.id, tour: t.id, kind: 'match' as Kind }))
            : [{ guide: g.id, tour: null, kind: 'left' as Kind }];
    }),
    ...TOURS.filter(t => t.guide === null || !GUIDES.some(g => g.id === t.guide)).map(t => ({
        guide: null,
        tour: t.id,
        kind: 'right' as Kind,
    })),
];

const JOINS: { key: JoinType; label: string; keeps: Kind[] }[] = [
    { key: 'inner', label: 'INNER JOIN', keeps: ['match'] },
    { key: 'left', label: 'LEFT JOIN', keeps: ['match', 'left'] },
    { key: 'right', label: 'RIGHT JOIN', keeps: ['match', 'right'] },
    { key: 'full', label: 'FULL OUTER JOIN', keeps: ['match', 'left', 'right'] },
];

const KIND_LABEL: Record<Kind, string> = {
    match: 'মিল',
    left: 'শুধু বামে',
    right: 'শুধু ডানে',
};

/**
 * Steps through the real guides and tours one candidate row at a time. Pick a
 * join type and watch which candidates it keeps: the matches always stay, the
 * lonely rows stay only if the join promises to keep their side.
 */
export function JoinTypeLab() {
    const reduce = useReducedMotion();
    const [join, setJoin] = useState<JoinType>('full');
    const [step, setStep] = useState(0);

    const keeps = JOINS.find(j => j.key === join)!.keeps;
    const shown = CANDIDATES.slice(0, step);
    const kept = shown.filter(c => keeps.includes(c.kind));
    const current = step > 0 ? CANDIDATES[step - 1] : null;
    const finalCount = CANDIDATES.filter(c => keeps.includes(c.kind)).length;
    const done = step >= CANDIDATES.length;

    const guideName = (id: number | null) => GUIDES.find(g => g.id === id)?.name ?? null;
    const tourTitle = (id: number | null) => TOURS.find(t => t.id === id)?.title ?? null;

    return (
        <Panel
            label='Interactive'
            title='Row জোড়া লাগানো, ধাপে ধাপে'
            footer='Data একদম আসল: guides এর পাঁচজন আর tours এর নয়টা ট্যুর, মেলানো হচ্ছে t.guide_id = g.guide_id দিয়ে। প্রথমে প্রতিটা Guide তাঁর ট্যুরগুলোর সাথে জোড়া পায়, Nazmul কারো সাথে না। তারপর আসে Ratargul, যাকে কোনো Guide দাবি করেনি। Join বদলালে Row তৈরির ক্রম একই থাকে, বদলায় শুধু কোন Row রাখা হবে। শেষ সংখ্যা: INNER 8, LEFT 9, RIGHT 9, FULL 10।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {JOINS.map(j => (
                    <button
                        key={j.key}
                        type='button'
                        data-join={j.key}
                        onClick={() => setJoin(j.key)}
                        className={cn(BTN, join === j.key ? BTN_ON : BTN_OFF)}>
                        {j.label}
                    </button>
                ))}
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                {`SELECT g.full_name, t.title\nFROM guides AS g\n${JOINS.find(j => j.key === join)!.label} tours AS t\n  ON t.guide_id = g.guide_id;`}
            </pre>

            <div className='flex flex-wrap items-center gap-2 mb-5'>
                <button
                    type='button'
                    data-action='next'
                    disabled={done}
                    onClick={() => setStep(s => Math.min(s + 1, CANDIDATES.length))}
                    className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_ON)}>
                    পরের Row
                </button>
                <button
                    type='button'
                    data-action='all'
                    onClick={() => setStep(CANDIDATES.length)}
                    className={cn(BTN, BTN_OFF)}>
                    সব একবারে
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setStep(0)}
                    className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-step={step}>
                    ধাপ {toBn(step)} / {toBn(CANDIDATES.length)}
                </span>
            </div>

            <div className='grid gap-4 md:grid-cols-2 mb-5'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        guides
                    </p>
                    <ul className='space-y-1'>
                        {GUIDES.map(g => (
                            <li
                                key={g.id}
                                className={cn(
                                    'border px-3 py-1.5 font-mono text-[0.75rem] transition-colors',
                                    current?.guide === g.id ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                                )}>
                                {g.id}. {g.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        tours
                    </p>
                    <ul className='space-y-1'>
                        {TOURS.map(t => (
                            <li
                                key={t.id}
                                className={cn(
                                    'border px-3 py-1.5 font-mono text-[0.75rem] transition-colors',
                                    current?.tour === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                                )}>
                                {t.title}{' '}
                                <span className='text-muted-foreground'>(guide {t.guide ?? 'NULL'})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {current && (
                <motion.p
                    key={`${join}-${step}`}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    data-verdict={keeps.includes(current.kind) ? 'kept' : 'dropped'}
                    className={cn(
                        'mb-5 border px-4 py-3 text-sm leading-relaxed',
                        keeps.includes(current.kind)
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-destructive/40 bg-destructive/5'
                    )}>
                    {current.kind === 'match' &&
                        `${guideName(current.guide)} আর ${tourTitle(current.tour)}: guide_id মেলে, তাই এটা মিল। সব Join মিল রাখে।`}
                    {current.kind === 'left' &&
                        `${guideName(current.guide)}: কোনো ট্যুরের guide_id ${current.guide} না, তাই এটা বামের একা Row। ${
                            keeps.includes('left') ? 'এই Join বামের সবাইকে রাখার কথা দেয়, তাই ট্যুরের Column গুলো NULL দিয়ে রাখা হলো।' : 'এই Join বামের একা Row রাখে না, তাই বাদ।'
                        }`}
                    {current.kind === 'right' &&
                        `${tourTitle(current.tour)}: এর guide_id NULL, কোনো Guide এর সাথে মেলে না, তাই এটা ডানের একা Row। ${
                            keeps.includes('right') ? 'এই Join ডানের সবাইকে রাখার কথা দেয়, তাই Guide এর Column গুলো NULL দিয়ে রাখা হলো।' : 'এই Join ডানের একা Row রাখে না, তাই বাদ।'
                        }`}
                </motion.p>
            )}

            <div className='overflow-x-auto border border-border'>
                <table className='w-full border-collapse font-mono text-[0.75rem]' data-rows={kept.length}>
                    <thead>
                        <tr className='bg-muted/40'>
                            <th className='border-b border-border px-3 py-2 text-left'>full_name</th>
                            <th className='border-b border-border px-3 py-2 text-left'>title</th>
                            <th className='border-b border-border px-3 py-2 text-left'>রকম</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kept.map(c => (
                            <tr key={`${c.guide}-${c.tour}`} className='border-b border-border/60 last:border-b-0'>
                                <td className={cn('px-3 py-1.5', c.guide === null && 'italic text-muted-foreground/60')}>
                                    {guideName(c.guide) ?? 'NULL'}
                                </td>
                                <td className={cn('px-3 py-1.5', c.tour === null && 'italic text-muted-foreground/60')}>
                                    {tourTitle(c.tour) ?? 'NULL'}
                                </td>
                                <td className={cn('px-3 py-1.5', c.kind !== 'match' && 'text-primary font-bold')}>
                                    {KIND_LABEL[c.kind]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                    এখন পর্যন্ত {toBn(kept.length)}টা Row রাখা হয়েছে
                    {done && `, শেষ ফলাফল ${toBn(finalCount)}টা Row`}
                </p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. টাকার হিসাব মেলানো: Database বনাম Gateway এর Statement                     */
/* ------------------------------------------------------------------------- */

/** The 19 real payments: id, amount and status, as the sample database holds them. */
const PAYMENTS: { id: number; amount: number; status: string }[] = [
    { id: 1, amount: 25000, status: 'paid' },
    { id: 2, amount: 50000, status: 'paid' },
    { id: 3, amount: 12500, status: 'paid' },
    { id: 4, amount: 25500, status: 'paid' },
    { id: 5, amount: 17000, status: 'refunded' },
    { id: 6, amount: 36000, status: 'paid' },
    { id: 7, amount: 18000, status: 'paid' },
    { id: 8, amount: 19000, status: 'paid' },
    { id: 9, amount: 28000, status: 'paid' },
    { id: 10, amount: 14000, status: 'paid' },
    { id: 11, amount: 15600, status: 'paid' },
    { id: 12, amount: 25000, status: 'paid' },
    { id: 13, amount: 50000, status: 'failed' },
    { id: 14, amount: 25500, status: 'paid' },
    { id: 15, amount: 36000, status: 'paid' },
    { id: 16, amount: 28000, status: 'paid' },
    { id: 17, amount: 10500, status: 'paid' },
    { id: 18, amount: 12500, status: 'paid' },
    { id: 19, amount: 42500, status: 'paid' },
];

/** The made-up gateway statement used in the lesson's query boxes. */
const STATEMENT: { id: number; amount: number }[] = [
    { id: 1, amount: 25000 },
    { id: 2, amount: 50000 },
    { id: 3, amount: 12500 },
    { id: 4, amount: 25500 },
    { id: 5, amount: 17000 },
    { id: 6, amount: 36000 },
    { id: 7, amount: 18000 },
    { id: 8, amount: 19000 },
    { id: 9, amount: 28000 },
    { id: 10, amount: 14000 },
    { id: 11, amount: 15000 },
    { id: 12, amount: 25000 },
    { id: 14, amount: 25500 },
    { id: 15, amount: 36000 },
    { id: 16, amount: 28000 },
    { id: 17, amount: 10500 },
    { id: 18, amount: 12500 },
    { id: 19, amount: 42500 },
    { id: 20, amount: 9500 },
];

type Problem = 'ok' | 'amount' | 'missing' | 'unknown';
type Filter = 'all' | 'neq' | 'distinct';

const ROWS: { id: number; db: number | null; statement: number | null; status: string | null; problem: Problem }[] = [
    ...new Set([...PAYMENTS.map(p => p.id), ...STATEMENT.map(s => s.id)]),
]
    .sort((a, b) => a - b)
    .map(id => {
        const p = PAYMENTS.find(x => x.id === id) ?? null;
        const s = STATEMENT.find(x => x.id === id) ?? null;
        const problem: Problem = !s ? 'missing' : !p ? 'unknown' : p.amount !== s.amount ? 'amount' : 'ok';
        return { id, db: p?.amount ?? null, statement: s?.amount ?? null, status: p?.status ?? null, problem };
    });

const FILTERS: { key: Filter; label: string; where: string; note: string }[] = [
    {
        key: 'all',
        label: 'WHERE নেই',
        where: '',
        note: 'পুরো FULL JOIN: ১৮টা মিল, Database এর একটা একা Row (Payment 13), আর Statement এর একটা একা Row (Payment 20)। মোট ২০।',
    },
    {
        key: 'neq',
        label: 'p.amount_bdt <> s.amount_bdt',
        where: 'WHERE p.amount_bdt <> s.amount_bdt',
        note: 'মাত্র একটা Row! একা Row গুলোতে একদিকের amount NULL, আর NULL এর সাথে <> এর উত্তর অজানা, তাই WHERE সেগুলো চুপচাপ ফেলে দেয়। সবচেয়ে বিপজ্জনক দুটো সমস্যাই হারিয়ে গেল।',
    },
    {
        key: 'distinct',
        label: 'p.amount_bdt IS DISTINCT FROM s.amount_bdt',
        where: 'WHERE p.amount_bdt IS DISTINCT FROM s.amount_bdt',
        note: 'তিনটা Row, ঠিক যা দরকার। IS DISTINCT FROM এর কাছে NULL আর একটা সংখ্যা আলাদা, তাই টাকার অমিল আর দুই দিকের একা Row, সবই ধরা পড়ে।',
    },
];

const PROBLEM_LABEL: Record<Problem, string> = {
    ok: 'মিলেছে',
    amount: 'টাকা আলাদা',
    missing: 'Statement এ নেই',
    unknown: 'Database এ নেই',
};

function keep(filter: Filter, row: (typeof ROWS)[number]) {
    if (filter === 'all') return true;
    if (filter === 'neq') return row.db !== null && row.statement !== null && row.db !== row.statement;
    return row.db !== row.statement;
}

/**
 * The reconciliation the lesson builds: our 19 payments against a gateway
 * statement. Switch the WHERE and see which problems survive. The plain `<>`
 * version is the classic silent mistake.
 */
export function ReconcileLab() {
    const [filter, setFilter] = useState<Filter>('all');
    const active = FILTERS.find(f => f.key === filter)!;
    const rows = ROWS.filter(r => keep(filter, r));

    return (
        <Panel
            label='Interactive'
            title='হিসাব মেলানো: payments বনাম Gateway Statement'
            footer='payments এর ১৯টা Row আসল। Statement টা এই লেসনের জন্য বানানো: Payment 11 এ টাকা কম, Payment 13 নেই (সেটা failed, টাকাই কাটেনি), আর Payment 20 আছে যেটা আমাদের Database চেনে না। Query বক্সে ঠিক এই Statement টাই VALUES হিসেবে বসানো।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        type='button'
                        data-filter={f.key}
                        onClick={() => setFilter(f.key)}
                        className={cn(BTN, 'font-mono', filter === f.key ? BTN_ON : BTN_OFF)}>
                        {f.label}
                    </button>
                ))}
            </div>
            <pre className='mb-4 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                {`SELECT COALESCE(p.payment_id, s.payment_id) AS payment_id, ...\nFROM payments AS p\nFULL JOIN (VALUES ...) AS s (payment_id, amount_bdt)\n  ON s.payment_id = p.payment_id\n${active.where}`}
            </pre>
            <p className='mb-4 text-sm leading-relaxed text-muted-foreground'>{active.note}</p>
            <div className='overflow-x-auto border border-border'>
                <table className='w-full border-collapse font-mono text-[0.75rem]' data-count={rows.length}>
                    <thead>
                        <tr className='bg-muted/40'>
                            <th className='border-b border-border px-3 py-2 text-left'>payment_id</th>
                            <th className='border-b border-border px-3 py-2 text-left'>status</th>
                            <th className='border-b border-border px-3 py-2 text-left'>db_amount</th>
                            <th className='border-b border-border px-3 py-2 text-left'>statement_amount</th>
                            <th className='border-b border-border px-3 py-2 text-left'>অবস্থা</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr
                                key={r.id}
                                className={cn(
                                    'border-b border-border/60 last:border-b-0',
                                    r.problem !== 'ok' && 'bg-primary/5'
                                )}>
                                <td className='px-3 py-1.5'>{r.id}</td>
                                <td className={cn('px-3 py-1.5', r.status === null && 'italic text-muted-foreground/60')}>
                                    {r.status ?? 'NULL'}
                                </td>
                                <td className={cn('px-3 py-1.5', r.db === null && 'italic text-muted-foreground/60')}>
                                    {r.db === null ? 'NULL' : `${r.db}.00`}
                                </td>
                                <td className={cn('px-3 py-1.5', r.statement === null && 'italic text-muted-foreground/60')}>
                                    {r.statement === null ? 'NULL' : `${r.statement}.00`}
                                </td>
                                <td className={cn('px-3 py-1.5', r.problem !== 'ok' && 'text-primary font-bold')}>
                                    {PROBLEM_LABEL[r.problem]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                    ({toBn(rows.length)}টা Row)
                </p>
            </div>
        </Panel>
    );
}
