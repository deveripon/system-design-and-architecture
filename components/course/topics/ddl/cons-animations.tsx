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
/* 1. পাহারাদারদের সামনে একটা একটা Row                                            */
/* ------------------------------------------------------------------------- */

interface Promo {
    code: string | null;
    percentOff: number;
    startsOn: string;
    endsOn: string;
    maxUses: number;
    timesUsed: number;
}

interface Candidate {
    id: string;
    label: string;
    row: Promo;
}

const base = { startsOn: '2026-11-01', endsOn: '2026-11-30', maxUses: 100, timesUsed: 0 };

const CANDIDATES: Candidate[] = [
    { id: 'eid', label: 'ঈদের কোড, প্রথমবার', row: { ...base, code: 'EID25', percentOff: 25 } },
    { id: 'eid-again', label: 'একই কোড আবার', row: { ...base, code: 'EID25', percentOff: 30 } },
    { id: 'typo', label: '250 শতাংশ, টাইপো', row: { ...base, code: 'BIG50', percentOff: 250 } },
    { id: 'no-code', label: 'কোড ছাড়া', row: { ...base, code: null, percentOff: 20 } },
    { id: 'lower', label: 'ছোট হাতের কোড', row: { ...base, code: 'eid25', percentOff: 25 } },
    {
        id: 'dates',
        label: 'শেষ তারিখ শুরুর আগে',
        row: { ...base, code: 'PUJA10', percentOff: 10, startsOn: '2026-11-30', endsOn: '2026-11-01' },
    },
    {
        id: 'usage',
        label: 'সীমার বেশি ব্যবহার',
        row: { ...base, code: 'WINTER15', percentOff: 15, startsOn: '2026-12-01', endsOn: '2027-01-31', timesUsed: 120 },
    },
    { id: 'two-rules', label: 'দুই নিয়ম একসাথে ভাঙা', row: { ...base, code: 'X', percentOff: 250 } },
    {
        id: 'puja',
        label: 'পূজার কোড, ঠিকঠাক',
        row: { ...base, code: 'PUJA10', percentOff: 10, startsOn: '2026-10-10', endsOn: '2026-10-25' },
    },
];

/** The CHECK constraints of cons_promo_codes, already in alphabetical order, which is the order PostgreSQL tests them. */
const CHECKS: { name: string; rule: string; test: (r: Promo) => boolean }[] = [
    { name: 'promo_code_format', rule: "code ~ '^[A-Z0-9]{4,12}$'", test: r => /^[A-Z0-9]{4,12}$/.test(r.code ?? '') },
    { name: 'promo_dates_in_order', rule: 'ends_on > starts_on', test: r => r.endsOn > r.startsOn },
    { name: 'promo_max_uses_positive', rule: 'max_uses > 0', test: r => r.maxUses > 0 },
    { name: 'promo_percent_range', rule: 'percent_off BETWEEN 1 AND 50', test: r => r.percentOff >= 1 && r.percentOff <= 50 },
    {
        name: 'promo_usage_within_limit',
        rule: 'times_used BETWEEN 0 AND max_uses',
        test: r => r.timesUsed >= 0 && r.timesUsed <= r.maxUses,
    },
];

type GateState = 'pass' | 'fail' | 'skip';

interface Verdict {
    gates: { name: string; rule: string; state: GateState }[];
    accepted: boolean;
    message: string;
    detail: string;
    code: string;
}

function failingRow(r: Promo) {
    return `Failing row contains (${r.code ?? 'null'}, ${r.percentOff}, ${r.startsOn}, ${r.endsOn}, ${r.maxUses}, ${r.timesUsed}, t, …).`;
}

/**
 * Walks one row past the gates in the order PostgreSQL uses: every NOT NULL,
 * then each CHECK by name, then UNIQUE. The messages are the exact PostgreSQL
 * 18 text for the same INSERT on the same table.
 */
function judge(r: Promo, existing: string[]): Verdict {
    const gates: Verdict['gates'] = [];
    let failed: Omit<Verdict, 'gates' | 'accepted'> | null = null;

    const notNullOk = r.code !== null;
    gates.push({ name: 'NOT NULL', rule: 'code, percent_off, starts_on ...', state: notNullOk ? 'pass' : 'fail' });
    if (!notNullOk) {
        failed = {
            message: 'null value in column "code" of relation "cons_promo_codes" violates not-null constraint',
            detail: failingRow(r),
            code: '23502',
        };
    }

    for (const check of CHECKS) {
        if (failed) {
            gates.push({ name: check.name, rule: check.rule, state: 'skip' });
            continue;
        }
        const ok = check.test(r);
        gates.push({ name: check.name, rule: check.rule, state: ok ? 'pass' : 'fail' });
        if (!ok) {
            failed = {
                message: `new row for relation "cons_promo_codes" violates check constraint "${check.name}"`,
                detail: failingRow(r),
                code: '23514',
            };
        }
    }

    if (failed) {
        gates.push({ name: 'promo_code_unique', rule: 'UNIQUE (code)', state: 'skip' });
    } else {
        const duplicate = existing.includes(r.code as string);
        gates.push({ name: 'promo_code_unique', rule: 'UNIQUE (code)', state: duplicate ? 'fail' : 'pass' });
        if (duplicate) {
            failed = {
                message: 'duplicate key value violates unique constraint "promo_code_unique"',
                detail: `Key (code)=(${r.code}) already exists.`,
                code: '23505',
            };
        }
    }

    return failed
        ? { gates, accepted: false, ...failed }
        : { gates, accepted: true, message: 'INSERT 0 1', detail: '', code: '00000' };
}

/**
 * The lesson's promo table with all its rules. The reader sends candidate rows
 * one at a time and watches which guard stops each one, in PostgreSQL's real
 * order, with the real error text and SQLSTATE. Accepted rows pile up in the
 * table, so a code that went in once becomes a duplicate the second time.
 */
export function ConstraintGuardLab() {
    const reduce = useReducedMotion();
    const [rows, setRows] = useState<Promo[]>([]);
    const [last, setLast] = useState<{ candidate: Candidate; verdict: Verdict; run: number } | null>(null);

    const send = (candidate: Candidate) => {
        const verdict = judge(
            candidate.row,
            rows.map(r => r.code as string)
        );
        if (verdict.accepted) setRows(prev => [...prev, candidate.row]);
        setLast(prev => ({ candidate, verdict, run: (prev?.run ?? 0) + 1 }));
    };

    const reset = () => {
        setRows([]);
        setLast(null);
    };

    return (
        <Panel
            label='Interactive'
            title='পাহারাদারদের সামনে একটা একটা Row পাঠান'
            footer='প্রতিটা Error এর লেখা PostgreSQL 18 এ একই Table এ একই INSERT চালিয়ে নেওয়া। DETAIL এর শেষে created_at এর সময়টা INSERT এর মুহূর্তে বসে, তাই এখানে … দেখানো। ঈদের কোড দুইবার পাঠিয়ে দেখুন: প্রথমবার ঢোকে, দ্বিতীয়বার UNIQUE থামায়।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন Row পাঠাবেন'>
                {CANDIDATES.map(c => (
                    <button
                        key={c.id}
                        type='button'
                        data-candidate={c.id}
                        onClick={() => send(c)}
                        className={cn(BTN, last?.candidate.id === c.id ? BTN_ON : BTN_OFF)}>
                        {c.label}
                    </button>
                ))}
                <button type='button' data-action='reset' onClick={reset} className={cn(BTN, BTN_OFF)}>
                    Table খালি করুন
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6'>
                <div>
                    {last ? (
                        <motion.div
                            key={last.run}
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            data-outcome={last.verdict.accepted ? 'accepted' : last.verdict.code}>
                            <pre className='mb-4 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                                {`INSERT INTO cons_promo_codes\n  (code, percent_off, starts_on, ends_on, max_uses, times_used)\nVALUES (${last.candidate.row.code === null ? 'NULL' : `'${last.candidate.row.code}'`}, ${last.candidate.row.percentOff}, '${last.candidate.row.startsOn}', '${last.candidate.row.endsOn}', ${last.candidate.row.maxUses}, ${last.candidate.row.timesUsed});`}
                            </pre>
                            <ol className='space-y-1.5'>
                                {last.verdict.gates.map((g, i) => (
                                    <motion.li
                                        key={g.name}
                                        initial={reduce ? false : { opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.12, ease: EASE }}
                                        data-gate={g.name}
                                        data-state={g.state}
                                        className={cn(
                                            'flex flex-wrap items-baseline gap-x-3 border px-3 py-1.5 font-mono text-[0.75rem]',
                                            g.state === 'pass' && 'border-primary/40 bg-primary/5 text-foreground',
                                            g.state === 'fail' && 'border-destructive/60 bg-destructive/5 text-destructive',
                                            g.state === 'skip' && 'border-border text-muted-foreground/60'
                                        )}>
                                        <span className='font-bold'>
                                            {toBn(i + 1)}. {g.name}
                                        </span>
                                        <span className='opacity-80'>{g.rule}</span>
                                        <span className='ml-auto text-[0.6875rem] font-bold'>
                                            {g.state === 'pass' ? 'পাস' : g.state === 'fail' ? 'থামাল' : 'পরীক্ষাই হয়নি'}
                                        </span>
                                    </motion.li>
                                ))}
                            </ol>
                            <div
                                className={cn(
                                    'mt-4 border px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap break-words',
                                    last.verdict.accepted ? 'border-primary bg-primary/10 text-primary' : 'border-destructive/60 bg-destructive/5 text-destructive'
                                )}>
                                {last.verdict.accepted
                                    ? 'INSERT 0 1'
                                    : `ERROR:  ${last.verdict.message}\nDETAIL:  ${last.verdict.detail}\nSQLSTATE: ${last.verdict.code}`}
                            </div>
                        </motion.div>
                    ) : (
                        <p className='border border-dashed border-border px-4 py-6 text-sm leading-relaxed text-muted-foreground'>
                            উপরের যেকোনো বোতাম চাপুন। Row টা কোন কোন পাহারাদার পার হলো আর কে থামাল, এখানে দেখবেন।
                        </p>
                    )}
                </div>

                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        cons_promo_codes, এখন {toBn(rows.length)}টা Row
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]' data-rows={rows.length}>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {['code', 'percent_off', 'starts_on', 'ends_on', 'times_used'].map(c => (
                                        <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className='px-3 py-3 text-muted-foreground'>
                                            (0 rows)
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map(r => (
                                        <tr key={r.code} className='border-b border-border/60 last:border-b-0'>
                                            <td className='px-3 py-1 whitespace-nowrap text-primary font-bold'>{r.code}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.percentOff}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.startsOn}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.endsOn}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.timesUsed}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                        Table এ শুধু সেই Row গুলো, যারা সব পাহারাদার পার হয়েছে। ভুল Row একটাও এখানে পৌঁছায় না, যে পথ দিয়েই আসুক।
                    </p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. জোড়া হিসেবে UNIQUE, আর NULL এর সাথে তার আচরণ                                */
/* ------------------------------------------------------------------------- */

type NullMode = 'distinct' | 'not-distinct';

interface Slot {
    tourId: number;
    startsOn: string | null;
}

const SLOT_CANDIDATES: { id: string; slot: Slot }[] = [
    { id: '1-dec01', slot: { tourId: 1, startsOn: '2026-12-01' } },
    { id: '1-dec08', slot: { tourId: 1, startsOn: '2026-12-08' } },
    { id: '2-dec01', slot: { tourId: 2, startsOn: '2026-12-01' } },
    { id: '1-null', slot: { tourId: 1, startsOn: null } },
];

const sameSlot = (a: Slot, b: Slot, mode: NullMode) => {
    if (a.tourId !== b.tourId) return false;
    if (a.startsOn === null || b.startsOn === null) {
        return mode === 'not-distinct' && a.startsOn === null && b.startsOn === null;
    }
    return a.startsOn === b.startsOn;
};

const show = (s: Slot) => `(${s.tourId}, ${s.startsOn ?? 'null'})`;

const asValues = (s: Slot) => `(${s.tourId}, ${s.startsOn === null ? 'NULL' : `'${s.startsOn}'`})`;

/**
 * A table with UNIQUE (tour_id, starts_on). The reader adds departures and
 * sees that each column alone may repeat while the pair may not, then flips
 * the NULL rule and watches two "date not fixed yet" rows go from allowed to
 * duplicate.
 */
export function UniquePairLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<NullMode>('distinct');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [last, setLast] = useState<{ slot: Slot; clash: number; run: number } | null>(null);

    const add = (slot: Slot) => {
        const clash = slots.findIndex(s => sameSlot(s, slot, mode));
        if (clash === -1) setSlots(prev => [...prev, slot]);
        setLast(prev => ({ slot, clash, run: (prev?.run ?? 0) + 1 }));
    };

    const switchMode = (m: NullMode) => {
        setMode(m);
        setSlots([]);
        setLast(null);
    };

    const ddl =
        mode === 'distinct'
            ? 'CREATE TABLE cons_slots (\n  tour_id   integer,\n  starts_on date,\n  UNIQUE (tour_id, starts_on)\n);'
            : 'CREATE TABLE cons_slots (\n  tour_id   integer,\n  starts_on date,\n  UNIQUE NULLS NOT DISTINCT (tour_id, starts_on)\n);';

    return (
        <Panel
            label='Interactive'
            title='জোড়া যখন UNIQUE'
            footer='Error এর লেখা PostgreSQL 18 এ একই Table এ চালিয়ে নেওয়া। NULL মানে এখানে "তারিখ এখনো ঠিক হয়নি"। নিয়ম বদলালে Table খালি হয়ে যায়, কারণ এটা আসলে নতুন একটা Table।'>
            <div className='flex flex-wrap items-center gap-2 mb-3' role='group' aria-label='NULL এর নিয়ম'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>NULL এর নিয়ম</span>
                {(['distinct', 'not-distinct'] as NullMode[]).map(m => (
                    <button
                        key={m}
                        type='button'
                        data-mode={m}
                        aria-pressed={mode === m}
                        onClick={() => switchMode(m)}
                        className={cn(BTN, mode === m ? BTN_ON : BTN_OFF)}>
                        {m === 'distinct' ? 'UNIQUE (Default)' : 'UNIQUE NULLS NOT DISTINCT'}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-5' role='group' aria-label='কোন Departure যোগ করবেন'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>যোগ করুন</span>
                {SLOT_CANDIDATES.map(c => (
                    <button key={c.id} type='button' data-slot={c.id} onClick={() => add(c.slot)} className={cn(BTN, BTN_OFF, 'font-mono')}>
                        {show(c.slot)}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div>
                    <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        {ddl}
                    </pre>
                    {last && (
                        <motion.div
                            key={last.run}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            data-outcome={last.clash === -1 ? 'accepted' : 'duplicate'}
                            className={cn(
                                'mt-4 border px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap break-words',
                                last.clash === -1 ? 'border-primary bg-primary/10 text-primary' : 'border-destructive/60 bg-destructive/5 text-destructive'
                            )}>
                            {last.clash === -1
                                ? `INSERT INTO cons_slots VALUES ${asValues(last.slot)};\nINSERT 0 1`
                                : `ERROR:  duplicate key value violates unique constraint "cons_slots_tour_id_starts_on_key"\nDETAIL:  Key (tour_id, starts_on)=${show(last.slot)} already exists.`}
                        </motion.div>
                    )}
                    <p className='mt-4 text-sm leading-relaxed text-foreground'>
                        {mode === 'distinct'
                            ? 'Default নিয়মে দুটো NULL কখনো সমান না। তাই (1, null) যতবার খুশি ঢোকে, যদিও দেখতে একই রকম।'
                            : 'NULLS NOT DISTINCT এ NULL কেও একটা মান ধরা হয়। তাই দ্বিতীয় (1, null) নকল, প্রথমটার সাথে মিলে যায়।'}
                    </p>
                </div>

                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        cons_slots, এখন {toBn(slots.length)}টা Row
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]' data-rows={slots.length}>
                            <thead>
                                <tr className='bg-muted/40'>
                                    <th className='border-b border-border px-3 py-2 text-left font-bold'>tour_id</th>
                                    <th className='border-b border-border px-3 py-2 text-left font-bold'>starts_on</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slots.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className='px-3 py-3 text-muted-foreground'>
                                            (0 rows)
                                        </td>
                                    </tr>
                                ) : (
                                    slots.map((s, i) => (
                                        <tr
                                            key={i}
                                            className={cn(
                                                'border-b border-border/60 last:border-b-0 transition-colors duration-300',
                                                last && last.clash === i && 'bg-destructive/10 text-destructive'
                                            )}>
                                            <td className='px-3 py-1'>{s.tourId}</td>
                                            <td className={cn('px-3 py-1', s.startsOn === null && 'text-muted-foreground')}>
                                                {s.startsOn ?? 'NULL'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                        tour_id 1 কয়েকবার আসতে পারে, 2026-12-01 ও কয়েকবার। বাধা শুধু একই জোড়া দ্বিতীয়বার এলে। লাল Row টা সেই আগের
                        Row, যার সাথে নতুনটা মিলে গেছে।
                    </p>
                </div>
            </div>
        </Panel>
    );
}
