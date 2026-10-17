'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
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

const BTN = 'px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left';
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

function MiniTable({ columns, rows, highlight }: { columns: string[]; rows: string[][]; highlight?: string }) {
    return (
        <div className='overflow-x-auto border border-border'>
            <table className='w-full border-collapse font-mono text-[0.75rem]'>
                <thead>
                    <tr className='bg-muted/40'>
                        {columns.map(c => (
                            <th key={c} className='border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap'>
                                {c}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr
                            key={row[0]}
                            className={cn(
                                'border-b border-border/60 last:border-b-0 transition-colors duration-300',
                                row[0] === highlight && 'bg-primary/10'
                            )}>
                            {row.map((cell, c) => (
                                <td key={c} className={cn('px-3 py-1 whitespace-nowrap', c === 0 ? 'text-primary font-bold' : 'text-foreground/90')}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground'>
                ({rows.length} {rows.length === 1 ? 'row' : 'rows'})
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. serial, BY DEFAULT আর ALWAYS: একই চাপ, তিন রকম উত্তর                     */
/* ------------------------------------------------------------------------- */

type Mode = 'serial' | 'by-default' | 'always';

const MODES: { id: Mode; label: string; column: string; about: string }[] = [
    {
        id: 'serial',
        label: 'serial',
        column: 'point_id serial PRIMARY KEY',
        about: 'পুরনো ধরন। নিজের হাতে লেখা নম্বর চুপচাপ মেনে নেয়, Sequence কে কিছুই জানায় না।',
    },
    {
        id: 'by-default',
        label: 'BY DEFAULT',
        column: 'point_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY',
        about: 'নম্বর না দিলে Sequence থেকে নেয়, দিলে আপনারটা মেনে নেয়। serial এর মতোই ফাঁদ।',
    },
    {
        id: 'always',
        label: 'ALWAYS',
        column: 'point_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY',
        about: 'নম্বর দেবে শুধু Database। নিজের নম্বর দিলে সাথে সাথে Error, যদি না OVERRIDING SYSTEM VALUE লেখেন।',
    },
];

// Names handed to each successful DEFAULT insert, in order.
const COUNTERS = [
    'Kalabagan Counter',
    'Arambagh Counter',
    'Gabtoli Counter',
    'Mohakhali Counter',
    'Sayedabad Counter',
    'Abdullahpur Counter',
    'Jatrabari Counter',
    'Malibagh Counter',
];

interface IdentityState {
    rows: { id: number; name: string }[];
    next: number;
    namesUsed: number;
    log: LogEntry[];
    seq: number;
    last?: number;
}

const FRESH: IdentityState = { rows: [], next: 1, namesUsed: 0, log: [], seq: 0 };

function duplicate(id: number): string[] {
    return [
        'ERROR:  duplicate key value violates unique constraint "pk_points_pkey"',
        `DETAIL:  Key (point_id)=(${id}) already exists.`,
    ];
}

function withLog(state: IdentityState, entry: Omit<LogEntry, 'id'>, patch: Partial<IdentityState>): IdentityState {
    const seq = state.seq + 1;
    return { ...state, ...patch, seq, log: [{ ...entry, id: seq }, ...state.log].slice(0, 6) };
}

function insertDefault(state: IdentityState): IdentityState {
    const name = COUNTERS[state.namesUsed % COUNTERS.length];
    const sql = `INSERT INTO pk_points (name) VALUES ('${name}');`;
    const id = state.next;
    // The sequence hands out the number before the row is checked, so a
    // collision still uses it up.
    if (state.rows.some(r => r.id === id)) {
        return withLog(state, { sql, ok: false, lines: duplicate(id) }, { next: id + 1, last: undefined });
    }
    return withLog(
        state,
        { sql, ok: true, lines: [`INSERT 0 1   (point_id = ${id})`] },
        { next: id + 1, namesUsed: state.namesUsed + 1, rows: [...state.rows, { id, name }], last: id }
    );
}

function insertExplicit(state: IdentityState, mode: Mode, overriding: boolean): IdentityState {
    const sql = overriding
        ? "INSERT INTO pk_points (point_id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Uttara Counter');"
        : "INSERT INTO pk_points (point_id, name) VALUES (3, 'Uttara Counter');";
    if (mode === 'always' && !overriding) {
        return withLog(
            state,
            {
                sql,
                ok: false,
                lines: [
                    'ERROR:  cannot insert a non-DEFAULT value into column "point_id"',
                    'DETAIL:  Column "point_id" is an identity column defined as GENERATED ALWAYS.',
                    'HINT:  Use OVERRIDING SYSTEM VALUE to override.',
                ],
            },
            { last: undefined }
        );
    }
    if (state.rows.some(r => r.id === 3)) {
        return withLog(state, { sql, ok: false, lines: duplicate(3) }, { last: undefined });
    }
    return withLog(
        state,
        { sql, ok: true, lines: ['INSERT 0 1   (Sequence ছোঁয়া হয়নি)'] },
        { rows: [...state.rows, { id: 3, name: 'Uttara Counter' }], last: 3 }
    );
}

/**
 * The same three buttons against serial, GENERATED BY DEFAULT and GENERATED
 * ALWAYS. Every message and every number is what PostgreSQL 18 returns for the
 * same statements in the same order.
 */
export function IdentityModesLab() {
    const [mode, setMode] = useState<Mode>('serial');
    const [state, setState] = useState<IdentityState>(FRESH);
    const current = MODES.find(m => m.id === mode) ?? MODES[0];
    const sorted = [...state.rows].sort((a, b) => a.id - b.id);

    const choose = (next: Mode) => {
        setMode(next);
        setState(FRESH);
    };

    return (
        <Panel
            label='Interactive'
            title='একই চাপ, তিন রকম Column'
            footer='প্রতিটা বার্তা আর প্রতিটা নম্বর PostgreSQL 18 এ একই ক্রমে একই Statement চালিয়ে মেলানো। চেষ্টা করুন: DEFAULT একবার, তারপর id 3, তারপর DEFAULT আরও দুইবার। serial আর BY DEFAULT এ তৃতীয় চাপে Error আসবে, ALWAYS এ id 3 এর চাপেই।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='Column এর ধরন'>
                {MODES.map(m => (
                    <button
                        key={m.id}
                        type='button'
                        data-mode={m.id}
                        aria-pressed={mode === m.id}
                        onClick={() => choose(m.id)}
                        className={cn(BTN, mode === m.id ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>

            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-muted-foreground'>
                {'CREATE TABLE pk_points (\n  '}
                <span className='text-primary font-bold'>{current.column}</span>
                {',\n  name text NOT NULL\n);'}
            </pre>
            <p className='mt-3 mb-5 text-sm text-foreground leading-relaxed'>{current.about}</p>

            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='কোন Insert'>
                <button
                    type='button'
                    data-action='default'
                    onClick={() => setState(s => insertDefault(s))}
                    className={cn(BTN, BTN_OFF)}>
                    DEFAULT দিয়ে Insert
                </button>
                <button
                    type='button'
                    data-action='explicit'
                    onClick={() => setState(s => insertExplicit(s, mode, false))}
                    className={cn(BTN, BTN_OFF)}>
                    নিজে id 3 দিয়ে Insert
                </button>
                {mode === 'always' && (
                    <button
                        type='button'
                        data-action='overriding'
                        onClick={() => setState(s => insertExplicit(s, mode, true))}
                        className={cn(BTN, BTN_OFF)}>
                        OVERRIDING SYSTEM VALUE দিয়ে id 3
                    </button>
                )}
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setState(FRESH)}
                    className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5'>
                <div className='space-y-4'>
                    <div className='border border-border bg-background px-4 py-3' data-next={state.next}>
                        <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                            pk_points_point_id_seq
                        </p>
                        <p className='mt-1 text-sm text-foreground'>
                            পরের DEFAULT পাবে:{' '}
                            <motion.span
                                key={state.next}
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className='font-mono font-bold text-primary'>
                                {state.next}
                            </motion.span>
                        </p>
                    </div>
                    <div data-rows={state.rows.length}>
                        <MiniTable columns={['point_id', 'name']} rows={sorted.map(r => [String(r.id), r.name])} highlight={state.last === undefined ? undefined : String(state.last)} />
                    </div>
                </div>
                <Log entries={state.log} empty='এখনো কিছু চালানো হয়নি। উপরের একটা বোতাম চাপুন, এখানে Statement আর তার উত্তর দেখা যাবে, সবচেয়ে নতুনটা উপরে।' />
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন চাপে নম্বর খরচ হয়                                                     */
/* ------------------------------------------------------------------------- */

type Fate = 'saved' | 'not-null' | 'unique' | 'rollback' | 'conflict';

const FATE_LABEL: Record<Fate, string> = {
    saved: 'Table এ',
    'not-null': 'NOT NULL Error',
    unique: 'UNIQUE Error',
    rollback: 'ROLLBACK',
    conflict: 'ON CONFLICT',
};

const NEW_EMAILS = [
    'nasrin@mail.example',
    'rafiq@mail.example',
    'sumon@mail.example',
    'mitu@mail.example',
    'tania@mail.example',
    'jahid@mail.example',
    'lima@mail.example',
    'kamal@mail.example',
];

interface GapState {
    rows: { id: number; email: string }[];
    handed: { n: number; fate: Fate }[];
    emailsUsed: number;
    log: LogEntry[];
    seq: number;
}

const GAP_FRESH: GapState = { rows: [], handed: [], emailsUsed: 0, log: [], seq: 0 };

function gapStep(state: GapState, action: Fate): GapState {
    const n = state.handed.length + 1;
    const seq = state.seq + 1;
    const existing = state.rows[0]?.email ?? NEW_EMAILS[0];
    let entry: Omit<LogEntry, 'id'>;
    let rows = state.rows;
    let emailsUsed = state.emailsUsed;
    switch (action) {
        case 'saved': {
            const email = NEW_EMAILS[state.emailsUsed % NEW_EMAILS.length];
            entry = { sql: `INSERT INTO pk_subscribers (email) VALUES ('${email}');`, ok: true, lines: [`INSERT 0 1   (subscriber_id = ${n})`] };
            rows = [...state.rows, { id: n, email }];
            emailsUsed = state.emailsUsed + 1;
            break;
        }
        case 'not-null':
            entry = {
                sql: 'INSERT INTO pk_subscribers (email) VALUES (NULL);',
                ok: false,
                lines: [
                    'ERROR:  null value in column "email" of relation "pk_subscribers" violates not-null constraint',
                    `DETAIL:  Failing row contains (${n}, null).`,
                ],
            };
            break;
        case 'unique':
            entry = {
                sql: `INSERT INTO pk_subscribers (email) VALUES ('${existing}');`,
                ok: false,
                lines: [
                    'ERROR:  duplicate key value violates unique constraint "pk_subscribers_email_key"',
                    `DETAIL:  Key (email)=(${existing}) already exists.`,
                ],
            };
            break;
        case 'rollback':
            entry = {
                sql: "BEGIN; INSERT INTO pk_subscribers (email) VALUES ('temp@mail.example'); ROLLBACK;",
                ok: true,
                lines: ['BEGIN', 'INSERT 0 1', 'ROLLBACK'],
            };
            break;
        case 'conflict':
            entry = {
                sql: `INSERT INTO pk_subscribers (email) VALUES ('${existing}') ON CONFLICT (email) DO NOTHING;`,
                ok: true,
                lines: ['INSERT 0 0'],
            };
            break;
    }
    return {
        rows,
        emailsUsed,
        seq,
        handed: [...state.handed, { n, fate: action }],
        log: [{ ...entry, id: seq }, ...state.log].slice(0, 5),
    };
}

const GAP_ACTIONS: { fate: Fate; label: string; needsRow: boolean }[] = [
    { fate: 'saved', label: 'নতুন email দিয়ে Insert', needsRow: false },
    { fate: 'not-null', label: 'email NULL দিয়ে Insert', needsRow: false },
    { fate: 'unique', label: 'পুরনো email আবার Insert', needsRow: true },
    { fate: 'rollback', label: 'BEGIN, Insert, ROLLBACK', needsRow: false },
    { fate: 'conflict', label: 'পুরনো email, ON CONFLICT DO NOTHING', needsRow: true },
];

/**
 * Five kinds of insert against an identity column with a UNIQUE email. Each
 * press takes the next number from the sequence; only one kind keeps the row.
 * Matches PostgreSQL 18: a failed, rolled back or skipped insert still uses its
 * number.
 */
export function SequenceGapLab() {
    const reduce = useReducedMotion();
    const [state, setState] = useState<GapState>(GAP_FRESH);
    const lost = state.handed.filter(h => h.fate !== 'saved').length;

    return (
        <Panel
            label='Interactive'
            title='কোন Insert এ নম্বর খরচ হয়'
            footer='Table: pk_subscribers (subscriber_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE)। প্রতিটা চাপের বার্তা PostgreSQL 18 এ একই Statement চালিয়ে মেলানো। লক্ষ করুন, NOT NULL এর Error এর DETAIL এ খরচ হওয়া নম্বরটাই দেখা যায়।'>
            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='কোন Insert'>
                {GAP_ACTIONS.map(a => (
                    <button
                        key={a.fate}
                        type='button'
                        data-action={a.fate}
                        disabled={a.needsRow && state.rows.length === 0}
                        onClick={() => setState(s => gapStep(s, a.fate))}
                        className={cn(BTN, BTN_OFF, 'disabled:opacity-40 disabled:cursor-not-allowed')}>
                        {a.label}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setState(GAP_FRESH)}
                    className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <div className='mb-6' data-handed={state.handed.length} data-lost={lost}>
                <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    Sequence যে নম্বরগুলো দিয়েছে
                </p>
                {state.handed.length === 0 ? (
                    <p className='text-xs text-muted-foreground'>এখনো কোনো নম্বর বেরোয়নি। পরের Insert পাবে 1।</p>
                ) : (
                    <div className='flex flex-wrap gap-2'>
                        {state.handed.map(h => (
                            <motion.div
                                key={h.n}
                                initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                data-number={h.n}
                                data-fate={h.fate}
                                className={cn(
                                    'min-w-[5.5rem] border px-2 py-1.5 text-center',
                                    h.fate === 'saved' ? 'border-primary bg-primary/10' : 'border-dashed border-border bg-background'
                                )}>
                                <span className={cn('block font-mono text-base font-bold', h.fate === 'saved' ? 'text-primary' : 'text-muted-foreground line-through')}>
                                    {h.n}
                                </span>
                                <span className='block text-[0.625rem] text-muted-foreground'>{FATE_LABEL[h.fate]}</span>
                            </motion.div>
                        ))}
                    </div>
                )}
                <p className='mt-3 text-sm text-foreground'>
                    বিলি হয়েছে {toBn(state.handed.length)}টা নম্বর, Table এ আছে {toBn(state.rows.length)}টা Row, হারিয়েছে{' '}
                    <span className='font-bold text-primary'>{toBn(lost)}</span>টা।
                </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5'>
                <MiniTable columns={['subscriber_id', 'email']} rows={state.rows.map(r => [String(r.id), r.email])} />
                <Log entries={state.log} empty='একটা বোতাম চাপুন। প্রতিটা চাপ একটা আলাদা Statement, ঠিক যেন psql এ একটা একটা করে লিখছেন।' />
            </div>
        </Panel>
    );
}
