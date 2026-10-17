'use client';

import { EASE } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

const BTN = 'px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed';
const BTN_ON = 'border-primary bg-primary/10 text-primary';
const BTN_OFF = 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40';

interface LogEntry {
    id: number;
    sql: string;
    ok: boolean;
    lines: string[];
}

function Log({ entries, empty }: { entries: LogEntry[]; empty: string }) {
    const reduce = useReducedMotion();
    if (entries.length === 0) {
        return <p className='text-xs text-muted-foreground leading-relaxed'>{empty}</p>;
    }
    return (
        <ol className='space-y-2'>
            <AnimatePresence initial={false}>
                {entries.map(entry => (
                    <motion.li
                        key={entry.id}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        data-log-ok={entry.ok ? 'true' : 'false'}
                        className={cn(
                            'border px-3 py-2 font-mono text-[0.6875rem] leading-relaxed',
                            entry.ok ? 'border-border bg-background' : 'border-destructive/40 bg-destructive/5'
                        )}>
                        <span className='block text-foreground/90 break-all'>{entry.sql}</span>
                        {entry.lines.map((line, i) => (
                            <span
                                key={i}
                                className={cn(
                                    'block break-all',
                                    entry.ok ? 'text-primary' : i === 0 ? 'text-destructive font-bold' : 'text-muted-foreground'
                                )}>
                                {line}
                            </span>
                        ))}
                    </motion.li>
                ))}
            </AnimatePresence>
        </ol>
    );
}

function addLog(log: LogEntry[], seq: number, entry: Omit<LogEntry, 'id'>): LogEntry[] {
    return [{ ...entry, id: seq }, ...log].slice(0, 6);
}

/* ------------------------------------------------------------------------- */
/* 1. STORED বনাম VIRTUAL: গুণটা কখন হয়                                       */
/* ------------------------------------------------------------------------- */

type Kind = 'stored' | 'virtual';

interface QuoteRow {
    id: number;
    customer: string;
    seats: number;
    price: number;
}

interface QuoteState {
    rows: QuoteRow[];
    onWrite: number;
    onRead: number;
    inserted: boolean;
    updated: boolean;
    shown: boolean;
    seq: number;
    log: LogEntry[];
}

const QUOTE_START: QuoteState = {
    rows: [
        { id: 1, customer: 'Nusrat Jahan', seats: 2, price: 12500 },
        { id: 2, customer: 'Rahim Uddin', seats: 4, price: 8500 },
    ],
    // The two starting rows already exist; the counters only count what the
    // reader runs.
    onWrite: 0,
    onRead: 0,
    inserted: false,
    updated: false,
    shown: false,
    seq: 0,
    log: [],
};

const money = (n: number) => n.toFixed(2);

/**
 * Three statements against gen_quotes, once with total_bdt STORED and once
 * VIRTUAL. The counters show where the multiplication happens: on every write
 * for STORED, on every read of the column for VIRTUAL. Every row and total is
 * what PostgreSQL 18 returns for the same statements.
 */
export function StoredVirtualLab() {
    const [kind, setKind] = useState<Kind>('stored');
    const [state, setState] = useState<QuoteState>(QUOTE_START);
    const stored = kind === 'stored';

    const choose = (next: Kind) => {
        setKind(next);
        setState(QUOTE_START);
    };

    const insert = () =>
        setState(s => ({
            ...s,
            rows: [...s.rows, { id: 3, customer: 'Tanvir Ahmed', seats: 1, price: 18000 }],
            onWrite: s.onWrite + (stored ? 1 : 0),
            inserted: true,
            seq: s.seq + 1,
            log: addLog(s.log, s.seq + 1, {
                sql: "INSERT INTO gen_quotes (customer, seats, unit_price_bdt) VALUES ('Tanvir Ahmed', 1, 18000);",
                ok: true,
                lines: [stored ? 'INSERT 0 1   (লেখার সময় 1 × 18000.00 গুণ হলো, উত্তর Disk এ)' : 'INSERT 0 1   (Disk এ শুধু seats আর দাম, কোনো গুণ হয়নি)'],
            }),
        }));

    const update = () =>
        setState(s => ({
            ...s,
            rows: s.rows.map(r => (r.id === 1 ? { ...r, seats: 3 } : r)),
            onWrite: s.onWrite + (stored ? 1 : 0),
            updated: true,
            seq: s.seq + 1,
            log: addLog(s.log, s.seq + 1, {
                sql: "UPDATE gen_quotes SET seats = 3 WHERE customer = 'Nusrat Jahan';",
                ok: true,
                lines: [stored ? 'UPDATE 1   (নতুন seats দিয়ে আবার গুণ, পুরনো উত্তরের জায়গায় নতুনটা)' : 'UPDATE 1   (শুধু seats বদলাল, গুণ হবে পরের SELECT এ)'],
            }),
        }));

    const select = () =>
        setState(s => ({
            ...s,
            onRead: s.onRead + (stored ? 0 : s.rows.length),
            shown: true,
            seq: s.seq + 1,
            log: addLog(s.log, s.seq + 1, {
                sql: 'SELECT customer, seats, unit_price_bdt, total_bdt FROM gen_quotes;',
                ok: true,
                lines: [
                    stored
                        ? `(${s.rows.length} rows)   Disk থেকে তুলে আনা, কোনো গুণ না`
                        : `(${s.rows.length} rows)   প্রতিটা Row এর জন্য একবার করে গুণ, মোট ${s.rows.length} বার`,
                ],
            }),
        }));

    return (
        <Panel
            label='Interactive'
            title='গুণটা কখন হয়: লেখার সময় না পড়ার সময়'
            footer='একই তিনটা Statement দুই ধরনের Column এ চালান, আর নিচের দুই গণনা মিলিয়ে দেখুন। ফলাফলের সংখ্যাগুলো PostgreSQL 18 এ একই Statement চালিয়ে মেলানো। মাপের হিসাব এই লেসনের Query Box থেকে: ৫০০০ Row আর তিনটা হিসাবের Column এ STORED Table 303104 Byte, VIRTUAL 229376 Byte।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='Column এর ধরন'>
                {(['stored', 'virtual'] as const).map(k => (
                    <button
                        key={k}
                        type='button'
                        data-kind={k}
                        aria-pressed={kind === k}
                        onClick={() => choose(k)}
                        className={cn(BTN, kind === k ? BTN_ON : BTN_OFF)}>
                        {k === 'stored' ? 'STORED' : 'VIRTUAL'}
                    </button>
                ))}
            </div>
            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-muted-foreground'>
                {'total_bdt numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) '}
                <span className='text-primary font-bold'>{stored ? 'STORED' : 'VIRTUAL'}</span>
            </pre>

            <div className='flex flex-wrap gap-2 my-5' role='group' aria-label='কোন Statement'>
                <button type='button' data-action='insert' disabled={state.inserted} onClick={insert} className={cn(BTN, BTN_OFF)}>
                    INSERT Tanvir, 1 × 18000
                </button>
                <button type='button' data-action='update' disabled={state.updated} onClick={update} className={cn(BTN, BTN_OFF)}>
                    UPDATE Nusrat এর seats 3
                </button>
                <button type='button' data-action='select' onClick={select} className={cn(BTN, BTN_OFF)}>
                    SELECT
                </button>
                <button type='button' data-action='reset' onClick={() => setState(QUOTE_START)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-5'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='border border-border bg-background px-4 py-3' data-on-write={state.onWrite}>
                            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>লেখার সময় গুণ</p>
                            <motion.p key={`w${state.onWrite}`} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} className='mt-1 font-mono text-xl font-bold text-primary'>
                                {state.onWrite}
                            </motion.p>
                        </div>
                        <div className='border border-border bg-background px-4 py-3' data-on-read={state.onRead}>
                            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>পড়ার সময় গুণ</p>
                            <motion.p key={`r${state.onRead}`} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} className='mt-1 font-mono text-xl font-bold text-primary'>
                                {state.onRead}
                            </motion.p>
                        </div>
                    </div>
                    <div className='overflow-x-auto border border-border'>
                        <p className='border-b border-border bg-muted/40 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                            Disk এ যা আছে
                        </p>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/20'>
                                    {['customer', 'seats', 'unit_price_bdt', 'total_bdt'].map(c => (
                                        <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {state.rows.map(r => (
                                    <tr key={r.id} className='border-b border-border/60 last:border-b-0'>
                                        <td className='px-3 py-1 whitespace-nowrap text-foreground/90'>{r.customer}</td>
                                        <td className='px-3 py-1 whitespace-nowrap text-foreground/90'>{r.seats}</td>
                                        <td className='px-3 py-1 whitespace-nowrap text-foreground/90'>{money(r.price)}</td>
                                        <td className={cn('px-3 py-1 whitespace-nowrap', stored ? 'text-primary font-bold' : 'text-muted-foreground italic')}>
                                            {stored ? money(r.seats * r.price) : 'রাখা নেই'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {state.shown && (
                        <p className='text-xs text-muted-foreground leading-relaxed'>
                            SELECT এর উত্তরে দুই ধরনেই total_bdt একই:{' '}
                            <span className='font-mono text-foreground'>{state.rows.map(r => money(r.seats * r.price)).join(', ')}</span>। পার্থক্য শুধু হিসাবটা কখন হলো।
                        </p>
                    )}
                </div>
                <Log entries={state.log} empty='শুরুতে দুটো Row আছে। একটা বোতাম চাপুন, Statement আর তার উত্তর এখানে আসবে, সবচেয়ে নতুনটা উপরে।' />
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Sequence এর কাঁটা: Option বদলালে nextval কী দেয়                          */
/* ------------------------------------------------------------------------- */

interface DialPreset {
    id: string;
    label: string;
    sql: string;
    start: number;
    step: number;
    min: number;
    max: number | null;
    cycle: boolean;
    cache: number;
    about: string;
}

const PRESETS: DialPreset[] = [
    {
        id: 'plain',
        label: 'সাধারণ',
        sql: 'CREATE SEQUENCE gen_dial_seq;',
        start: 1,
        step: 1,
        min: 1,
        max: null,
        cycle: false,
        cache: 1,
        about: 'কিছু না বললে শুরু 1, লাফ 1, শেষ bigint এর সীমা 9223372036854775807।',
    },
    {
        id: 'max',
        label: 'MAXVALUE 115',
        sql: 'CREATE SEQUENCE gen_dial_seq START WITH 100 INCREMENT BY 5 MAXVALUE 115;',
        start: 100,
        step: 5,
        min: 1,
        max: 115,
        cycle: false,
        cache: 1,
        about: 'চারটা নম্বরের পরে শেষ সীমা। পঞ্চমবার চাপলে Error 2200H।',
    },
    {
        id: 'cycle',
        label: 'CYCLE, MINVALUE ছাড়া',
        sql: 'CREATE SEQUENCE gen_dial_seq START WITH 100 INCREMENT BY 5 MAXVALUE 115 CYCLE;',
        start: 100,
        step: 5,
        min: 1,
        max: 115,
        cycle: true,
        cache: 1,
        about: 'শেষ সীমায় পৌঁছে আবার শুরু হয়, কিন্তু MINVALUE থেকে, যেটা না লিখলে 1।',
    },
    {
        id: 'cycle-min',
        label: 'CYCLE, MINVALUE 100',
        sql: 'CREATE SEQUENCE gen_dial_seq START WITH 100 INCREMENT BY 5 MINVALUE 100 MAXVALUE 115 CYCLE;',
        start: 100,
        step: 5,
        min: 100,
        max: 115,
        cycle: true,
        cache: 1,
        about: 'এবার সর্বনিম্ন মান 100, তাই 115 এর পরে ঠিক 100 এ ফেরে।',
    },
    {
        id: 'cache',
        label: 'CACHE 20, তিন জানালা',
        sql: 'CREATE SEQUENCE gen_dial_seq CACHE 20;',
        start: 1,
        step: 1,
        min: 1,
        max: null,
        cycle: false,
        cache: 20,
        about: 'প্রতিটা জানালা (Session) প্রথমবার চাপলে কুড়িটা নম্বর তুলে নেয়। জানালা বন্ধ করলে বাকিগুলো হারায়।',
    },
];

type WindowName = 'A' | 'B' | 'C';

interface DialState {
    /** The next value the shared sequence on disk will hand out. */
    next: number;
    /** Per session: the next value in its cached block, and the block's end. */
    windows: Record<WindowName, { cur: number; end: number } | null>;
    given: { window: WindowName; value: number }[];
    seq: number;
    log: LogEntry[];
}

function freshDial(preset: DialPreset): DialState {
    return { next: preset.start, windows: { A: null, B: null, C: null }, given: [], seq: 0, log: [] };
}

function pressNext(state: DialState, preset: DialPreset, window: WindowName): DialState {
    const sql = `SELECT nextval('gen_dial_seq');${preset.cache > 1 ? `   -- জানালা ${window}` : ''}`;
    const block = state.windows[window];
    if (block && block.cur <= block.end) {
        const value = block.cur;
        return {
            ...state,
            windows: { ...state.windows, [window]: { cur: value + preset.step, end: block.end } },
            given: [...state.given, { window, value }].slice(-12),
            seq: state.seq + 1,
            log: addLog(state.log, state.seq + 1, { sql, ok: true, lines: [`${value}   (জানালার নিজের গোছা থেকে)`] }),
        };
    }
    let value = state.next;
    if (preset.max !== null && value > preset.max) {
        if (!preset.cycle) {
            return {
                ...state,
                seq: state.seq + 1,
                log: addLog(state.log, state.seq + 1, {
                    sql,
                    ok: false,
                    lines: [`ERROR:  nextval: reached maximum value of sequence "gen_dial_seq" (${preset.max})`],
                }),
            };
        }
        value = preset.min;
    }
    const end = value + (preset.cache - 1) * preset.step;
    return {
        ...state,
        next: end + preset.step,
        windows: { ...state.windows, [window]: { cur: value + preset.step, end } },
        given: [...state.given, { window, value }].slice(-12),
        seq: state.seq + 1,
        log: addLog(state.log, state.seq + 1, {
            sql,
            ok: true,
            lines: [preset.cache > 1 ? `${value}   (Disk থেকে নতুন গোছা নিল: ${value} থেকে ${end})` : String(value)],
        }),
    };
}

/**
 * nextval against five real sequence definitions. The rules are PostgreSQL's:
 * a step past MAXVALUE errors unless CYCLE, CYCLE restarts at MINVALUE, and with
 * CACHE every session takes a block of numbers and loses what it did not use.
 * The CACHE run matches the lesson's psql transcript (1, 2, 21, 3, 41, then 61).
 */
export function SequenceDialLab() {
    const [presetId, setPresetId] = useState('plain');
    const preset = PRESETS.find(p => p.id === presetId) ?? PRESETS[0];
    const [state, setState] = useState<DialState>(() => freshDial(preset));
    const cached = preset.cache > 1;

    const choose = (id: string) => {
        const next = PRESETS.find(p => p.id === id) ?? PRESETS[0];
        setPresetId(id);
        setState(freshDial(next));
    };

    const close = (window: WindowName) =>
        setState(s => {
            const block = s.windows[window];
            const lost = block && block.cur <= block.end ? `${block.cur} থেকে ${block.end} আর কেউ পাবে না` : 'হারানোর মতো কিছু ছিল না';
            return {
                ...s,
                windows: { ...s.windows, [window]: null },
                seq: s.seq + 1,
                log: addLog(s.log, s.seq + 1, { sql: `\\q   -- জানালা ${window} বন্ধ`, ok: true, lines: [lost] }),
            };
        });

    return (
        <Panel
            label='Interactive'
            title='Option বদলান, nextval চাপুন'
            footer='প্রতিটা Preset এর ফলাফল PostgreSQL 18 এ একই CREATE SEQUENCE চালিয়ে মেলানো। CACHE এর Preset এ চেষ্টা করুন: A দুইবার, B একবার, A আবার, C একবার, তারপর A বন্ধ করে আবার A। ঠিক লেসনের psql এর মতো 1, 2, 21, 3, 41, তারপর 61 আসবে।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='Sequence এর Option'>
                {PRESETS.map(p => (
                    <button
                        key={p.id}
                        type='button'
                        data-preset={p.id}
                        aria-pressed={presetId === p.id}
                        onClick={() => choose(p.id)}
                        className={cn(BTN, presetId === p.id ? BTN_ON : BTN_OFF)}>
                        {p.label}
                    </button>
                ))}
            </div>
            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-primary font-bold'>
                {preset.sql}
            </pre>
            <p className='mt-3 mb-5 text-sm text-foreground leading-relaxed'>{preset.about}</p>

            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='nextval'>
                {(cached ? (['A', 'B', 'C'] as const) : (['A'] as const)).map(w => (
                    <button key={w} type='button' data-action={`next-${w}`} onClick={() => setState(s => pressNext(s, preset, w))} className={cn(BTN, BTN_OFF)}>
                        {cached ? `জানালা ${w}: nextval` : 'nextval'}
                    </button>
                ))}
                {cached &&
                    (['A', 'B', 'C'] as const).map(w => (
                        <button key={`close-${w}`} type='button' data-action={`close-${w}`} onClick={() => close(w)} className={cn(BTN, BTN_OFF)}>
                            {`জানালা ${w} বন্ধ`}
                        </button>
                    ))}
                <button type='button' data-action='reset' onClick={() => setState(freshDial(preset))} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-5'>
                <div className='space-y-4'>
                    <div className='border border-border bg-background px-4 py-3' data-disk-last={state.next - preset.step}>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                            pg_sequences এর last_value
                        </p>
                        <p className='mt-1 text-sm text-foreground'>
                            {state.given.length === 0 ? (
                                <span className='font-mono text-muted-foreground'>NULL, এখনো কেউ চাপেনি</span>
                            ) : (
                                <motion.span key={state.next} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} className='font-mono font-bold text-primary'>
                                    {state.next - preset.step}
                                </motion.span>
                            )}
                        </p>
                    </div>
                    <div className='flex flex-wrap gap-1.5' data-given={state.given.map(g => g.value).join(',')}>
                        {state.given.map((g, i) => (
                            <motion.span
                                key={`${i}-${g.value}`}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className='border border-primary/50 bg-primary/10 px-2 py-1 font-mono text-[0.75rem] font-bold text-primary'>
                                {cached ? `${g.window}:${g.value}` : g.value}
                            </motion.span>
                        ))}
                    </div>
                </div>
                <Log entries={state.log} empty='একটা বোতাম চাপুন। প্রতিটা nextval এর উত্তর এখানে আসবে, সবচেয়ে নতুনটা উপরে।' />
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. পুরনো Data আনার পরে Sequence পিছিয়ে থাকে                                 */
/* ------------------------------------------------------------------------- */

interface LoadState {
    ids: number[];
    last: number;
    called: boolean;
    loaded: boolean;
    seq: number;
    log: LogEntry[];
}

const LOAD_START: LoadState = { ids: [], last: 1, called: false, loaded: false, seq: 0, log: [] };

const nextOf = (s: LoadState) => (s.called ? s.last + 1 : s.last);

/**
 * gen_departures gets the 16 sample departures with their own ids, then new
 * rows. Every message matches PostgreSQL 18. A failed insert still uses its
 * number, so pressing INSERT seventeen times would also get past the old rows,
 * which is why the lab lets you try before you fix it with setval.
 */
export function LoadResetLab() {
    const [state, setState] = useState<LoadState>(LOAD_START);
    const max = state.ids.length ? Math.max(...state.ids) : null;
    const next = nextOf(state);

    const load = () =>
        setState(s => ({
            ...s,
            ids: Array.from({ length: 16 }, (_, i) => i + 1),
            loaded: true,
            seq: s.seq + 1,
            log: addLog(s.log, s.seq + 1, {
                sql: 'INSERT INTO gen_departures OVERRIDING SYSTEM VALUE SELECT departure_id, tour_id, starts_on, seats_left FROM departures;',
                ok: true,
                lines: ['INSERT 0 16   (id 1 থেকে 16 নিজেদের সাথে এল, Sequence কে কেউ জানাল না)'],
            }),
        }));

    const insert = () =>
        setState(s => {
            const id = nextOf(s);
            const sql = "INSERT INTO gen_departures (tour_id, starts_on, seats_left) VALUES (7, DATE '2026-12-26', 15);";
            const moved = { ...s, last: id, called: true, seq: s.seq + 1 };
            if (s.ids.includes(id)) {
                return {
                    ...moved,
                    log: addLog(s.log, s.seq + 1, {
                        sql,
                        ok: false,
                        lines: ['ERROR:  duplicate key value violates unique constraint "gen_departures_pkey"', `DETAIL:  Key (departure_id)=(${id}) already exists.`],
                    }),
                };
            }
            return {
                ...moved,
                ids: [...s.ids, id],
                log: addLog(s.log, s.seq + 1, { sql, ok: true, lines: [`INSERT 0 1   (departure_id = ${id})`] }),
            };
        });

    const fix = () =>
        setState(s => {
            const top = s.ids.length ? Math.max(...s.ids) : null;
            const sql = "SELECT setval(pg_get_serial_sequence('gen_departures', 'departure_id'), max(departure_id)) FROM gen_departures;";
            if (top === null) {
                return { ...s, seq: s.seq + 1, log: addLog(s.log, s.seq + 1, { sql, ok: true, lines: ['setval = NULL   (খালি Table, max NULL, Sequence যেমন ছিল তেমনই)'] }) };
            }
            return { ...s, last: top, called: true, seq: s.seq + 1, log: addLog(s.log, s.seq + 1, { sql, ok: true, lines: [`setval = ${top}`] }) };
        });

    return (
        <Panel
            label='Interactive'
            title='পুরনো Data আনা, তারপর প্রথম নতুন Row'
            footer='প্রতিটা বার্তা PostgreSQL 18 এ একই ক্রমে চালিয়ে মেলানো। চেষ্টা করুন: আনুন, তারপর INSERT দুইবার, তারপর setval, তারপর INSERT। দেখবেন ব্যর্থ চেষ্টাগুলোও নম্বর খেয়েছে, আর setval এর পরে পরের Row ঠিক 17 পায়।'>
            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='ধাপ'>
                <button type='button' data-action='load' disabled={state.loaded || state.ids.length > 0} onClick={load} className={cn(BTN, BTN_OFF)}>
                    ১. পুরনো ১৬টা Departure আনুন
                </button>
                <button type='button' data-action='insert' onClick={insert} className={cn(BTN, BTN_OFF)}>
                    ২. নতুন Departure INSERT
                </button>
                <button type='button' data-action='fix' onClick={fix} className={cn(BTN, BTN_OFF)}>
                    ৩. setval(max)
                </button>
                <button type='button' data-action='reset' onClick={() => setState(LOAD_START)} className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-5'>
                <div className='grid grid-cols-2 gap-3 content-start'>
                    <div className='border border-border bg-background px-4 py-3' data-max={max ?? 'null'}>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>Table এর সবচেয়ে বড় id</p>
                        <motion.p key={`m${max}`} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} className='mt-1 font-mono text-xl font-bold text-foreground'>
                            {max ?? 'NULL'}
                        </motion.p>
                    </div>
                    <div className={cn('border px-4 py-3', max !== null && next <= max ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-background')} data-next={next}>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>Sequence এর পরের নম্বর</p>
                        <motion.p key={`n${next}`} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} className={cn('mt-1 font-mono text-xl font-bold', max !== null && next <= max ? 'text-destructive' : 'text-primary')}>
                            {next}
                        </motion.p>
                    </div>
                    <p className='col-span-2 text-xs text-muted-foreground leading-relaxed'>
                        {max !== null && next <= max
                            ? `পরের নম্বর ${next} আগেই Table এ আছে, তাই পরের INSERT আটকাবে।`
                            : 'পরের নম্বর Table এর সবচেয়ে বড় id এর চেয়ে বড়, INSERT নিরাপদ।'}
                    </p>
                </div>
                <Log entries={state.log} empty='শুরুতে gen_departures খালি, Sequence এর পরের নম্বর 1। প্রথম বোতাম দিয়ে শুরু করুন।' />
            </div>
        </Panel>
    );
}
