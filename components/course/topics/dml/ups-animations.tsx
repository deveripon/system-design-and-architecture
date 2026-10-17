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
const PRE = 'overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground';

/* ------------------------------------------------------------------------- */
/* 1. একই তিনটা Row, চার রকম Statement                                          */
/* ------------------------------------------------------------------------- */

type Mode = 'plain' | 'nothing' | 'update' | 'update-where';

interface TourRow {
    id: number;
    title: string;
    price: string;
}

type RowFate = 'inserted' | 'updated' | 'skipped' | 'unchanged' | 'error' | 'not-reached';

const START: TourRow[] = [
    { id: 1, title: 'Saint Martin Island Escape', price: '12500.00' },
    { id: 2, title: "Cox's Bazar Beach Weekend", price: '8500.00' },
    { id: 4, title: 'Sajek Valley Cloud Trip', price: '9500.00' },
];

const INCOMING: TourRow[] = [
    { id: 1, title: 'Saint Martin Island Escape', price: '13000.00' },
    { id: 2, title: "Cox's Bazar Beach Weekend", price: '8500.00' },
    { id: 10, title: 'Kuakata Sunrise Weekend', price: '9000.00' },
];

interface ModeResult {
    label: string;
    clause: string;
    /** What happened to each incoming row, in order. */
    fates: RowFate[];
    final: TourRow[];
    tag: string;
    returning: { id: number; oldPrice: string; newPrice: string }[];
    error?: string;
    note: string;
}

/** Every result below is the output of the same statements run on PostgreSQL 18 (PGlite 0.5.8). */
const MODES: Record<Mode, ModeResult> = {
    plain: {
        label: 'শুধু INSERT',
        clause: '',
        fates: ['error', 'not-reached', 'not-reached'],
        final: START,
        tag: 'ERROR',
        returning: [],
        error: 'duplicate key value violates unique constraint "ups_lab_tours_pkey"\nDETAIL:  Key (tour_id)=(1) already exists.',
        note: 'প্রথম Row এই আটকে যায়, আর একটা Statement হয় পুরো সফল নয়তো কিছুই না। তাই Kuakata ও ঢোকেনি, Table আগের মতোই।',
    },
    nothing: {
        label: 'DO NOTHING',
        clause: 'ON CONFLICT (tour_id) DO NOTHING',
        fates: ['skipped', 'skipped', 'inserted'],
        final: [...START, INCOMING[2]],
        tag: 'INSERT 0 1',
        returning: [{ id: 10, oldPrice: '', newPrice: '9000.00' }],
        note: 'মিল পাওয়া দুটো Row চুপচাপ বাদ। Saint Martin এর নতুন দাম 13000.00 ও বাদ পড়ল, যেটা হয়তো আপনি চাননি।',
    },
    update: {
        label: 'DO UPDATE',
        clause: 'ON CONFLICT (tour_id) DO UPDATE\nSET price_bdt = EXCLUDED.price_bdt',
        fates: ['updated', 'updated', 'inserted'],
        final: [{ ...START[0], price: '13000.00' }, START[1], START[2], INCOMING[2]],
        tag: 'INSERT 0 3',
        returning: [
            { id: 1, oldPrice: '12500.00', newPrice: '13000.00' },
            { id: 2, oldPrice: '8500.00', newPrice: '8500.00' },
            { id: 10, oldPrice: '', newPrice: '9000.00' },
        ],
        note: 'Cox\'s Bazar এর দাম একই, তবু Row টা নতুন করে লেখা হলো আর গোনায় এলো। তিনটাই গোনা, যদিও বদল আসলে দুটো।',
    },
    'update-where': {
        label: 'DO UPDATE ... WHERE',
        clause: 'ON CONFLICT (tour_id) DO UPDATE\nSET price_bdt = EXCLUDED.price_bdt\nWHERE t.price_bdt IS DISTINCT FROM EXCLUDED.price_bdt',
        fates: ['updated', 'unchanged', 'inserted'],
        final: [{ ...START[0], price: '13000.00' }, START[1], START[2], INCOMING[2]],
        tag: 'INSERT 0 2',
        returning: [
            { id: 1, oldPrice: '12500.00', newPrice: '13000.00' },
            { id: 10, oldPrice: '', newPrice: '9000.00' },
        ],
        note: 'একই দামের Row এ WHERE মিথ্যা, তাই সেটা বদলায়নি, গোনায় নেই, RETURNING এও নেই। গোনা এখন সত্যিকারের বদলের সমান।',
    },
};

const FATE_TEXT: Record<RowFate, string> = {
    inserted: 'নতুন Row ঢুকল',
    updated: 'পুরনো Row বদলাল',
    skipped: 'বাদ পড়ল',
    unchanged: 'মিল আছে, কিন্তু WHERE মিথ্যা',
    error: 'Error, Statement বাতিল',
    'not-reached': 'পরীক্ষাই হয়নি',
};

/**
 * Three incoming price rows (one changed, one identical, one new) sent at the
 * same three-row table with four different statements. The reader steps
 * through the rows and sees each one's fate, the final table, the command tag
 * and what RETURNING old/new reports.
 */
export function UpsertModeLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<Mode>('plain');
    const [step, setStep] = useState(0);
    const result = MODES[mode];
    const done = step >= INCOMING.length || (mode === 'plain' && step >= 1);

    const pick = (m: Mode) => {
        setMode(m);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='একই তিনটা Row, চার রকম Statement'
            footer='বাঁ দিকে Statement বাছুন, তারপর একটা একটা করে Row পাঠান। প্রতিটা ফলাফল, Command Tag আর RETURNING এর Row গুলো PostgreSQL 18 এ একই তিন Row এর Table এ একই Statement চালিয়ে নেওয়া। Command Tag দেখানো হয়েছে psql এর মতো করে, বক্সে একই জিনিস INSERT 2 এর মতো ছোট করে আসে।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন Statement'>
                {(Object.keys(MODES) as Mode[]).map(m => (
                    <button
                        key={m}
                        type='button'
                        data-mode={m}
                        onClick={() => pick(m)}
                        className={cn(BTN, mode === m ? BTN_ON : BTN_OFF)}>
                        {MODES[m].label}
                    </button>
                ))}
            </div>

            <pre className={cn(PRE, 'mb-5')}>
                {`INSERT INTO ups_lab_tours AS t (tour_id, title, price_bdt) VALUES\n  (1,  'Saint Martin Island Escape', 13000.00),\n  (2,  'Cox''s Bazar Beach Weekend',  8500.00),\n  (10, 'Kuakata Sunrise Weekend',     9000.00)${result.clause ? '\n' + result.clause : ''}\nRETURNING t.tour_id, old.price_bdt, new.price_bdt;`}
            </pre>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6'>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        প্রস্তাবিত Row, একটা একটা করে
                    </p>
                    <ol className='space-y-1.5'>
                        {INCOMING.map((row, i) => {
                            // An error ends the statement, so rows after it count as settled too.
                            const reached = i < step || done;
                            const fate = result.fates[i];
                            return (
                                <li
                                    key={row.id}
                                    data-row={row.id}
                                    data-fate={reached ? fate : 'pending'}
                                    className={cn(
                                        'flex flex-wrap items-baseline gap-x-3 border px-3 py-1.5 font-mono text-[0.75rem]',
                                        !reached && 'border-border text-muted-foreground/70',
                                        reached && (fate === 'inserted' || fate === 'updated') && 'border-primary/50 bg-primary/5 text-foreground',
                                        reached && (fate === 'skipped' || fate === 'unchanged' || fate === 'not-reached') && 'border-border text-muted-foreground',
                                        reached && fate === 'error' && 'border-destructive/60 bg-destructive/5 text-destructive'
                                    )}>
                                    <span className='font-bold'>({row.id}, {row.price})</span>
                                    <span className='ml-auto text-[0.6875rem] font-bold'>{reached ? FATE_TEXT[fate] : 'অপেক্ষায়'}</span>
                                </li>
                            );
                        })}
                    </ol>
                    <div className='mt-4 flex flex-wrap gap-2'>
                        <button
                            type='button'
                            data-action='next-row'
                            disabled={done}
                            onClick={() => setStep(s => s + 1)}
                            className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                            পরের Row পাঠান
                        </button>
                        <button
                            type='button'
                            data-action='all-rows'
                            disabled={done}
                            onClick={() => setStep(INCOMING.length)}
                            className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                            সব একবারে
                        </button>
                        <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                            আবার শুরু
                        </button>
                    </div>
                    {done && (
                        <motion.div
                            key={`${mode}-done`}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            data-tag={result.tag}
                            className={cn(
                                'mt-4 border px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap break-words',
                                result.error ? 'border-destructive/60 bg-destructive/5 text-destructive' : 'border-primary bg-primary/10 text-primary'
                            )}>
                            {result.error ? `ERROR:  ${result.error}` : result.tag}
                        </motion.div>
                    )}
                    {done && <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{result.note}</p>}
                </div>

                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        ups_lab_tours, {done ? 'Statement এর পরে' : 'Statement শেষ হওয়ার আগে'}
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {['tour_id', 'title', 'price_bdt'].map(c => (
                                        <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(done ? result.final : START).map(r => {
                                    const changed = done && START.find(s => s.id === r.id)?.price !== r.price;
                                    return (
                                        <tr key={r.id} className='border-b border-border/60 last:border-b-0'>
                                            <td className={cn('px-3 py-1 whitespace-nowrap', changed && 'text-primary font-bold')}>{r.id}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.title}</td>
                                            <td className={cn('px-3 py-1 whitespace-nowrap', changed && 'text-primary font-bold')}>{r.price}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className='mt-4 mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        RETURNING
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]' data-returning={done ? result.returning.length : 0}>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {['tour_id', 'old.price_bdt', 'new.price_bdt'].map(c => (
                                        <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {!done || result.returning.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className='px-3 py-3 text-muted-foreground'>
                                            {done ? '(0 rows)' : 'Statement শেষ হলে দেখা যাবে'}
                                        </td>
                                    </tr>
                                ) : (
                                    result.returning.map(r => (
                                        <tr key={r.id} className='border-b border-border/60 last:border-b-0'>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.id}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.oldPrice || 'NULL'}</td>
                                            <td className='px-3 py-1 whitespace-nowrap'>{r.newPrice}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. দুই জানালা, একই মুহূর্তে একই Email                                         */
/* ------------------------------------------------------------------------- */

type RaceMode = 'naive' | 'nothing' | 'update' | 'merge';

interface RaceStep {
    at: string;
    who: 'A' | 'B';
    sql: string;
    out: string;
    kind?: 'wait' | 'error' | 'ok';
}

const A_START: RaceStep[] = [
    { at: '0.0 s', who: 'A', sql: 'BEGIN;', out: 'BEGIN' },
    {
        at: '0.0 s',
        who: 'A',
        sql: "SELECT count(*) FROM ups_race_subscribers\nWHERE email = 'jui.sarker@mail.example';",
        out: ' count\n-------\n     0',
    },
    {
        at: '0.0 s',
        who: 'A',
        sql: "INSERT INTO ups_race_subscribers (email, full_name)\nVALUES ('jui.sarker@mail.example', 'Jui Sarker');",
        out: 'INSERT 0 1',
    },
];

const A_COMMIT: RaceStep = { at: '3.0 s', who: 'A', sql: 'COMMIT;', out: 'COMMIT', kind: 'ok' };

interface RaceResult {
    label: string;
    b: RaceStep[];
    /** B's last statement, which waits for A and finishes after A commits. */
    bFinal: RaceStep;
    final: string;
    verdict: string;
}

const B_INSERT_SQL = "INSERT INTO ups_race_subscribers (email, full_name)\nVALUES ('jui.sarker@mail.example', 'Jui S.')";

/** Statements and output from two psql sessions on PostgreSQL 18.6; session B started one second after A. */
const RACE: Record<RaceMode, RaceResult> = {
    naive: {
        label: 'আগে খোঁজা, তারপর INSERT',
        b: [
            { at: '1.0 s', who: 'B', sql: 'BEGIN;', out: 'BEGIN' },
            {
                at: '1.0 s',
                who: 'B',
                sql: "SELECT count(*) FROM ups_race_subscribers\nWHERE email = 'jui.sarker@mail.example';",
                out: ' count\n-------\n     0',
            },
            { at: '1.0 s', who: 'B', sql: `${B_INSERT_SQL};`, out: '(অপেক্ষা করছে...)', kind: 'wait' },
        ],
        bFinal: {
            at: '3.0 s',
            who: 'B',
            sql: '',
            out: 'ERROR:  duplicate key value violates unique constraint "ups_race_subscribers_pkey"\nDETAIL:  Key (email)=(jui.sarker@mail.example) already exists.\nTime: 1966.064 ms',
            kind: 'error',
        },
        final: 'jui.sarker@mail.example | Jui Sarker',
        verdict: 'দুজনেই 0 দেখেছিল, দুজনেই INSERT করল। দ্বিতীয়জন প্রায় দুই সেকেন্ড অপেক্ষা করে Error পেল। App এ এটাই সেই ভাঙা পাতা।',
    },
    nothing: {
        label: 'ON CONFLICT DO NOTHING',
        b: [{ at: '1.0 s', who: 'B', sql: `${B_INSERT_SQL}\nON CONFLICT (email) DO NOTHING;`, out: '(অপেক্ষা করছে...)', kind: 'wait' }],
        bFinal: { at: '3.0 s', who: 'B', sql: '', out: 'INSERT 0 0\nTime: 1999.630 ms', kind: 'ok' },
        final: 'jui.sarker@mail.example | Jui Sarker',
        verdict: 'অপেক্ষা একই, কিন্তু শেষে Error নেই: Row টা আগেই আছে দেখে চুপচাপ বাদ। একটাই Row, প্রথম জানালার নাম।',
    },
    update: {
        label: 'ON CONFLICT DO UPDATE',
        b: [
            {
                at: '1.0 s',
                who: 'B',
                sql: `${B_INSERT_SQL}\nON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;`,
                out: '(অপেক্ষা করছে...)',
                kind: 'wait',
            },
        ],
        bFinal: { at: '3.0 s', who: 'B', sql: '', out: 'INSERT 0 1\nTime: 1982.962 ms', kind: 'ok' },
        final: 'jui.sarker@mail.example | Jui S.',
        verdict: 'অপেক্ষার পরে দ্বিতীয় জানালা প্রথমটার Row খুঁজে পেয়ে সেটাই বদলাল। Docs এর কথায়, ঢোকানো অথবা বদলানো, দুটোর একটা নিশ্চিত।',
    },
    merge: {
        label: 'MERGE',
        b: [
            {
                at: '1.0 s',
                who: 'B',
                sql: "MERGE INTO ups_race_subscribers AS s\nUSING (VALUES ('jui.sarker@mail.example', 'Jui S.')) AS v(email, full_name)\nON s.email = v.email\nWHEN MATCHED THEN UPDATE SET full_name = v.full_name\nWHEN NOT MATCHED THEN INSERT (email, full_name) VALUES (v.email, v.full_name);",
                out: '(অপেক্ষা করছে...)',
                kind: 'wait',
            },
        ],
        bFinal: {
            at: '3.0 s',
            who: 'B',
            sql: '',
            out: 'ERROR:  duplicate key value violates unique constraint "ups_race_subscribers_pkey"\nDETAIL:  Key (email)=(jui.sarker@mail.example) already exists.\nTime: 1913.424 ms',
            kind: 'error',
        },
        final: 'jui.sarker@mail.example | Jui Sarker',
        verdict: 'MERGE শুরুতে মিল পায়নি, তাই INSERT এর পথ ধরেছিল। প্রথম জানালা COMMIT করার পরে সেই INSERT ই Error পেল। MERGE এই দৌড় সামলায় না।',
    },
};

/**
 * Two psql windows race for the same email: window A inserts inside a
 * transaction and commits after three seconds, window B starts one second
 * later with one of four statements. Each step is the real output.
 */
export function RaceLab() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<RaceMode>('naive');
    const [step, setStep] = useState(0);
    const race = RACE[mode];
    const timeline: RaceStep[] = [...A_START, ...race.b, A_COMMIT, race.bFinal];
    const done = step >= timeline.length;

    const pick = (m: RaceMode) => {
        setMode(m);
        setStep(0);
    };

    const shown = timeline.slice(0, step);
    const windowLines = (who: 'A' | 'B') => shown.filter(s => s.who === who);

    return (
        <Panel
            label='Interactive'
            title='দুই psql জানালা, একই মুহূর্তে একই Email'
            footer='জানালা A একটা Transaction এর ভেতরে Jui কে ঢোকায় আর তিন সেকেন্ড পরে COMMIT করে। জানালা B এক সেকেন্ড পরে শুরু হয়। প্রতিটা লাইন PostgreSQL 18.6 এ দুটো আসল psql Session এর Output, সময় সহ। B এর অপেক্ষার সময়টা A এর COMMIT পর্যন্ত, প্রায় দুই সেকেন্ড।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='জানালা B কী চালাবে'>
                {(Object.keys(RACE) as RaceMode[]).map(m => (
                    <button
                        key={m}
                        type='button'
                        data-race={m}
                        onClick={() => pick(m)}
                        className={cn(BTN, mode === m ? BTN_ON : BTN_OFF)}>
                        {RACE[m].label}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {(['A', 'B'] as const).map(who => (
                    <div key={who} className='border border-border' data-window={who}>
                        <p className='border-b border-border bg-muted/30 px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground'>
                            জানালা {who === 'A' ? 'A: প্রথম Tab' : 'B: দ্বিতীয় Tab'}
                        </p>
                        <div className='space-y-2 p-3 min-h-[10rem]'>
                            {windowLines(who).length === 0 && (
                                <p className='font-mono text-[0.75rem] text-muted-foreground/60'>island_tours=#</p>
                            )}
                            {windowLines(who).map((s, i) => (
                                <motion.div
                                    key={`${mode}-${who}-${i}`}
                                    initial={reduce ? false : { opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, ease: EASE }}>
                                    {s.sql && (
                                        <pre className='overflow-x-auto font-mono text-[0.75rem] leading-relaxed text-foreground whitespace-pre-wrap'>
                                            <span className='text-muted-foreground'>{s.at} </span>
                                            {s.sql}
                                        </pre>
                                    )}
                                    <pre
                                        className={cn(
                                            'overflow-x-auto font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap break-words',
                                            s.kind === 'error' && 'text-destructive',
                                            s.kind === 'wait' && 'text-muted-foreground italic',
                                            s.kind === 'ok' && 'text-primary font-bold',
                                            !s.kind && 'text-muted-foreground'
                                        )}>
                                        {!s.sql && <span className='text-muted-foreground'>{s.at} </span>}
                                        {s.out}
                                    </pre>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
                <button
                    type='button'
                    data-action='next-step'
                    disabled={done}
                    onClick={() => setStep(s => s + 1)}
                    className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                    পরের ধাপ ({toBn(Math.min(step + 1, timeline.length))}/{toBn(timeline.length)})
                </button>
                <button
                    type='button'
                    data-action='all-steps'
                    disabled={done}
                    onClick={() => setStep(timeline.length)}
                    className={cn(BTN, done ? 'border-border text-muted-foreground/50' : BTN_OFF)}>
                    শেষ পর্যন্ত
                </button>
                <button type='button' data-action='reset' onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            {done && (
                <motion.div
                    key={`${mode}-verdict`}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    data-race-final={mode}
                    className='mt-4 space-y-2'>
                    <pre className={PRE}>{`SELECT email, full_name FROM ups_race_subscribers;\n ${race.final}\n(1 row)`}</pre>
                    <p className='text-sm leading-relaxed text-muted-foreground'>{race.verdict}</p>
                </motion.div>
            )}
        </Panel>
    );
}
