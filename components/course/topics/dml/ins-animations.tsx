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

const BTN = 'px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left';
const BTN_ON = 'border-primary bg-primary/10 text-primary';
const BTN_OFF = 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40';

/* ------------------------------------------------------------------------- */
/* 1. কোন মান কোন ঘরে যায়                                                       */
/* ------------------------------------------------------------------------- */

interface MappingCell {
    column: string;
    value: string;
    /** The value sits in a column it was never meant for. */
    wrong?: boolean;
    /** Filled by the database, not by the statement. */
    filled?: boolean;
}

interface MappingScenario {
    id: string;
    label: string;
    engine: 'PostgreSQL 18' | 'MySQL 8.4';
    tableNote: string;
    sql: string;
    outcome: { kind: 'row'; cells: MappingCell[]; verdict: string } | { kind: 'error'; message: string; detail?: string };
}

/**
 * Every outcome here was produced by running the same statement on the same
 * table: PostgreSQL in the lesson's query box engine, MySQL in a mysql:8.4
 * container. Nothing is simulated beyond picking which run to show.
 */
const MAPPING: MappingScenario[] = [
    {
        id: 'pg-named',
        label: 'PostgreSQL, তালিকা সহ',
        engine: 'PostgreSQL 18',
        tableNote: 'guide_id (Identity), full_name, phone, language DEFAULT ‘Bangla’',
        sql: "INSERT INTO ins_guides (language, phone, full_name)\nVALUES ('English', '+8801000000206', 'Mahfuz Alam');",
        outcome: {
            kind: 'row',
            cells: [
                { column: 'guide_id', value: '1', filled: true },
                { column: 'full_name', value: 'Mahfuz Alam' },
                { column: 'phone', value: '+8801000000206' },
                { column: 'language', value: 'English' },
            ],
            verdict: 'তালিকার ক্রম Table এর ক্রম থেকে আলাদা, তবু প্রতিটা মান নিজের নামের ঘরে। guide_id এর নম্বর দিল Identity।',
        },
    },
    {
        id: 'pg-swap',
        label: 'PostgreSQL, তালিকা ছাড়া, ভুল ক্রম',
        engine: 'PostgreSQL 18',
        tableNote: 'full_name, phone, language, তিনটাই text',
        sql: "INSERT INTO ins_guides\nVALUES ('Mahfuz Alam', 'English', '+8801000000206');",
        outcome: {
            kind: 'row',
            cells: [
                { column: 'full_name', value: 'Mahfuz Alam' },
                { column: 'phone', value: 'English', wrong: true },
                { column: 'language', value: '+8801000000206', wrong: true },
            ],
            verdict: 'INSERT 0 1, কোনো Error নেই। তিনটা Column ই text, তাই PostgreSQL এর কাছে "English" একটা ঠিকঠাক ফোন নম্বর।',
        },
    },
    {
        id: 'pg-identity',
        label: 'PostgreSQL, তালিকা ছাড়া, Identity আগে',
        engine: 'PostgreSQL 18',
        tableNote: 'guide_id (Identity), full_name, phone, language',
        sql: "INSERT INTO ins_guides\nVALUES ('Mahfuz Alam', '+8801000000206', 'English');",
        outcome: {
            kind: 'error',
            message: 'ERROR:  invalid input syntax for type integer: "Mahfuz Alam"',
        },
    },
    {
        id: 'pg-short',
        label: 'PostgreSQL, তালিকা ছাড়া, একটা মান কম',
        engine: 'PostgreSQL 18',
        tableNote: 'full_name, phone, language NOT NULL, কোনো DEFAULT নেই',
        sql: "INSERT INTO ins_guides\nVALUES ('Tania Akter', '+8801000000207');",
        outcome: {
            kind: 'error',
            message: 'ERROR:  null value in column "language" of relation "ins_guides" violates not-null constraint',
            detail: 'DETAIL:  Failing row contains (Tania Akter, +8801000000207, null).',
        },
    },
    {
        id: 'pg-added',
        label: 'PostgreSQL, পুরনো কোড, নতুন Column শেষে',
        engine: 'PostgreSQL 18',
        tableNote: 'আগে full_name, phone; তারপর ADD COLUMN language ... DEFAULT ‘Bangla’',
        sql: "INSERT INTO ins_guides\nVALUES ('Tania Akter', '+8801000000207');",
        outcome: {
            kind: 'row',
            cells: [
                { column: 'full_name', value: 'Tania Akter' },
                { column: 'phone', value: '+8801000000207' },
                { column: 'language', value: 'Bangla', filled: true },
            ],
            verdict: 'পুরনো কোড চলতেই থাকল, কারণ PostgreSQL কম মান পেলে প্রথম দুটো Column ধরে নেয় আর বাকিটা DEFAULT দেয়। Tania English বলেন কিনা, পুরনো কোড জানেই না।',
        },
    },
    {
        id: 'my-1136',
        label: 'MySQL, পুরনো কোড, Column মাঝে যোগ',
        engine: 'MySQL 8.4',
        tableNote: 'ADD COLUMN language ... AFTER full_name এর পরে: full_name, language, phone',
        sql: "INSERT INTO ins_guides\nVALUES ('Tania Akter', '+8801000000207');",
        outcome: {
            kind: 'error',
            message: "ERROR 1136 (21S01): Column count doesn't match value count at row 1",
        },
    },
    {
        id: 'my-swap',
        label: 'MySQL, তাড়াহুড়োর সমাধান',
        engine: 'MySQL 8.4',
        tableNote: 'full_name, language, phone',
        sql: "INSERT INTO ins_guides\nVALUES ('Tania Akter', '+8801000000207', 'English');",
        outcome: {
            kind: 'row',
            cells: [
                { column: 'full_name', value: 'Tania Akter' },
                { column: 'language', value: '+8801000000207', wrong: true },
                { column: 'phone', value: 'English', wrong: true },
            ],
            verdict: 'Query OK, 1 row affected। Error চলে গেল, কিন্তু ফোন নম্বর এখন language এ আর English এখন phone এ।',
        },
    },
    {
        id: 'my-named',
        label: 'MySQL, তালিকা সহ',
        engine: 'MySQL 8.4',
        tableNote: 'full_name, language, phone',
        sql: "INSERT INTO ins_guides (full_name, phone, language)\nVALUES ('Nasrin Akter', '+8801000000208', 'English');",
        outcome: {
            kind: 'row',
            cells: [
                { column: 'full_name', value: 'Nasrin Akter' },
                { column: 'language', value: 'English' },
                { column: 'phone', value: '+8801000000208' },
            ],
            verdict: 'Table এ language মাঝখানে থাকলেও কিছু যায় আসে না: নাম দিয়ে মেলানো Column এর অবস্থানের তোয়াক্কা করে না।',
        },
    },
];

/**
 * Pick a statement and a table shape; see where each value lands, or the
 * error that stops it. The two silent swaps are the point: no error, wrong
 * data, and only a column list prevents them.
 */
export function ColumnMappingLab() {
    const reduce = useReducedMotion();
    const [id, setId] = useState(MAPPING[0].id);
    const s = MAPPING.find(m => m.id === id) ?? MAPPING[0];

    return (
        <Panel
            label='Interactive'
            title='কোন মান কোন ঘরে যায়'
            footer='PostgreSQL এর ফলাফল এই লেসনের Query বক্সের Engine এ, MySQL এর ফলাফল mysql:8.4 Container এ, একই Table এ একই Statement চালিয়ে নেওয়া। লাল দাগের ঘর মানে মানটা ভুল Column এ বসেছে, আর ভাঙা দাগের ঘর Database নিজে ভরেছে।'>
            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='কোন পরিস্থিতি দেখবেন'>
                {MAPPING.map(m => (
                    <button
                        key={m.id}
                        type='button'
                        onClick={() => setId(m.id)}
                        aria-pressed={m.id === id}
                        className={cn(BTN, m.id === id ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
            </div>

            <div className='grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
                <div className='space-y-3'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary'>
                            {s.engine}
                        </span>
                        <span className='text-[0.75rem] text-muted-foreground'>{s.tableNote}</span>
                    </div>
                    <pre className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90'>
                        {s.sql}
                    </pre>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={s.id}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className='space-y-3'>
                        {s.outcome.kind === 'row' ? (
                            <>
                                <div className='overflow-x-auto'>
                                    <table className='w-full border-collapse font-mono text-[0.75rem]'>
                                        <thead>
                                            <tr>
                                                {s.outcome.cells.map(c => (
                                                    <th
                                                        key={c.column}
                                                        className='border border-border bg-muted/40 px-3 py-2 text-left font-bold text-foreground'>
                                                        {c.column}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {s.outcome.cells.map((c, i) => (
                                                    <motion.td
                                                        key={c.column}
                                                        initial={reduce ? false : { opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.25, delay: reduce ? 0 : 0.08 * i, ease: EASE }}
                                                        className={cn(
                                                            'px-3 py-2 whitespace-nowrap',
                                                            c.wrong
                                                                ? 'border-2 border-destructive bg-destructive/10 text-destructive font-bold'
                                                                : c.filled
                                                                  ? 'border border-dashed border-muted-foreground/60 text-muted-foreground'
                                                                  : 'border border-primary/50 bg-primary/5 text-foreground'
                                                        )}>
                                                        {c.value}
                                                    </motion.td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p
                                    className={cn(
                                        'text-[0.8125rem] leading-relaxed',
                                        s.outcome.cells.some(c => c.wrong) ? 'text-destructive' : 'text-muted-foreground'
                                    )}>
                                    {s.outcome.verdict}
                                </p>
                            </>
                        ) : (
                            <div className='border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                                <p className='font-bold text-destructive'>{s.outcome.message}</p>
                                {s.outcome.detail && <p className='mt-2 text-muted-foreground'>{s.outcome.detail}</p>}
                                <p className='mt-3 font-sans text-[0.8125rem] text-muted-foreground'>
                                    কিছুই ঢোকেনি। অন্তত এখানে ভুলটা চোখে পড়ে, চুপচাপ ভুল Data র চেয়ে Error অনেক ভালো।
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা INSERT এর পরিণতি, আর নম্বরের খাতা                                   */
/* ------------------------------------------------------------------------- */

interface BookingRow {
    customerId: number;
    departureId: number;
    seats: number | string;
    status: string;
    total: string | null;
}

interface OutcomeCandidate {
    id: string;
    label: string;
    rows: BookingRow[];
    /** The value cannot even be read as the column's type, so no row is ever built. */
    typeError?: string;
}

const CUSTOMERS_THAT_EXIST = 15;

const OUTCOME_CANDIDATES: OutcomeCandidate[] = [
    { id: 'imran', label: 'Imran, Sajek, 2 সিট', rows: [{ customerId: 15, departureId: 12, seats: 2, status: 'pending', total: '19000.00' }] },
    { id: 'lamia', label: 'Lamia, Sajek, 1 সিট', rows: [{ customerId: 14, departureId: 12, seats: 1, status: 'confirmed', total: '9500.00' }] },
    { id: 'ghost', label: 'Customer 99, যে নেই', rows: [{ customerId: 99, departureId: 12, seats: 2, status: 'pending', total: '19000.00' }] },
    { id: 'zero', label: 'শূন্য সিট', rows: [{ customerId: 14, departureId: 12, seats: 0, status: 'pending', total: '0.00' }] },
    { id: 'caps', label: 'বড় হাতের Pending', rows: [{ customerId: 14, departureId: 12, seats: 2, status: 'Pending', total: '19000.00' }] },
    { id: 'nototal', label: 'total_bdt বাদ পড়ল', rows: [{ customerId: 14, departureId: 12, seats: 2, status: 'pending', total: null }] },
    {
        id: 'text',
        label: "সিটের ঘরে 'two'",
        rows: [{ customerId: 14, departureId: 12, seats: 'two', status: 'pending', total: '19000.00' }],
        typeError: 'ERROR:  invalid input syntax for type smallint: "two"',
    },
    {
        id: 'batch-check',
        label: 'তিন Row একসাথে, মাঝেরটায় বানান ভুল',
        rows: [
            { customerId: 13, departureId: 12, seats: 1, status: 'confirmed', total: '9500.00' },
            { customerId: 12, departureId: 12, seats: 1, status: 'confirmd', total: '9500.00' },
            { customerId: 11, departureId: 12, seats: 1, status: 'pending', total: '9500.00' },
        ],
    },
    {
        id: 'batch-fk',
        label: 'তিন Row একসাথে, শেষেরটার Customer নেই',
        rows: [
            { customerId: 13, departureId: 12, seats: 1, status: 'confirmed', total: '9500.00' },
            { customerId: 12, departureId: 12, seats: 1, status: 'confirmed', total: '9500.00' },
            { customerId: 99, departureId: 12, seats: 1, status: 'pending', total: '9500.00' },
        ],
    },
];

interface StoredRow extends BookingRow {
    bookingId: number;
}

interface Attempt {
    run: number;
    candidate: OutcomeCandidate;
    ok: boolean;
    lines: string[];
    used: number[];
    stored: number[];
}

const VALID_STATUS = ['pending', 'confirmed', 'cancelled'];

function failingRow(id: number, r: BookingRow) {
    return `DETAIL:  Failing row contains (${id}, ${r.customerId}, ${r.departureId}, ${r.seats}, ${r.status}, ${r.total ?? 'null'}, …).`;
}

/**
 * Plays one INSERT against the lesson's ins_bookings the way PostgreSQL 18
 * does, checked against real runs: a value that is not even the right type
 * fails before any row exists; otherwise each row takes the next number, then
 * NOT NULL, the CHECKs (by name: seats before status) and UNIQUE are checked
 * row by row, and the foreign keys only once every row of the statement is in.
 * Any failure keeps the numbers already taken and stores nothing.
 */
function play(candidate: OutcomeCandidate, stored: StoredRow[], next: number) {
    if (candidate.typeError) {
        return { ok: false, lines: [candidate.typeError], used: [] as number[], newRows: [] as StoredRow[], next };
    }
    const used: number[] = [];
    const pending: StoredRow[] = [];
    let n = next;
    for (const r of candidate.rows) {
        const id = n++;
        used.push(id);
        let error: string[] | null = null;
        if (r.total === null) {
            error = [
                'ERROR:  null value in column "total_bdt" of relation "ins_bookings" violates not-null constraint',
                failingRow(id, r),
            ];
        } else if (typeof r.seats === 'number' && r.seats <= 0) {
            error = ['ERROR:  new row for relation "ins_bookings" violates check constraint "ins_bookings_seats_check"', failingRow(id, r)];
        } else if (!VALID_STATUS.includes(r.status)) {
            error = ['ERROR:  new row for relation "ins_bookings" violates check constraint "ins_bookings_status_check"', failingRow(id, r)];
        } else if ([...stored, ...pending].some(s => s.customerId === r.customerId && s.departureId === r.departureId)) {
            error = [
                'ERROR:  duplicate key value violates unique constraint "ins_bookings_customer_id_departure_id_key"',
                `DETAIL:  Key (customer_id, departure_id)=(${r.customerId}, ${r.departureId}) already exists.`,
            ];
        }
        if (error) return { ok: false, lines: error, used, newRows: [] as StoredRow[], next: n };
        pending.push({ ...r, bookingId: id });
    }
    const orphan = pending.find(p => p.customerId > CUSTOMERS_THAT_EXIST);
    if (orphan) {
        return {
            ok: false,
            lines: [
                'ERROR:  insert or update on table "ins_bookings" violates foreign key constraint "ins_bookings_customer_id_fkey"',
                `DETAIL:  Key (customer_id)=(${orphan.customerId}) is not present in table "customers".`,
            ],
            used,
            newRows: [] as StoredRow[],
            next: n,
        };
    }
    return { ok: true, lines: [`INSERT 0 ${pending.length}`], used, newRows: pending, next: n };
}

/**
 * The lesson's booking table with every rule, and a counter that shows what
 * the identity sequence has handed out. Send rows one statement at a time:
 * failures store nothing, but most of them still take a number, which is why
 * gaps in an id column are normal.
 */
export function InsertOutcomeLab() {
    const reduce = useReducedMotion();
    const [rows, setRows] = useState<StoredRow[]>([]);
    const [next, setNext] = useState(1);
    const [burned, setBurned] = useState<number[]>([]);
    const [last, setLast] = useState<Attempt | null>(null);

    const send = (candidate: OutcomeCandidate) => {
        const result = play(candidate, rows, next);
        if (result.ok) setRows(prev => [...prev, ...result.newRows]);
        else setBurned(prev => [...prev, ...result.used]);
        setNext(result.next);
        setLast(prev => ({
            run: (prev?.run ?? 0) + 1,
            candidate,
            ok: result.ok,
            lines: result.lines,
            used: result.used,
            stored: result.newRows.map(r => r.bookingId),
        }));
    };

    const reset = () => {
        setRows([]);
        setNext(1);
        setBurned([]);
        setLast(null);
    };

    const handedOut = Array.from({ length: next - 1 }, (_, i) => i + 1);

    return (
        <Panel
            label='Interactive'
            title='একটা একটা INSERT পাঠান, নম্বরের খাতা দেখুন'
            footer='Table টা লেসনের ins_bookings: customers আর departures এর দিকে Foreign Key, seats > 0, status এর তিনটা মান, total_bdt NOT NULL, আর একই Customer একই Departure এ একবারই। প্রতিটা বার্তা PostgreSQL 18 এ একই ক্রমে একই INSERT চালিয়ে মেলানো; DETAIL এর শেষে booked_at এর সময় INSERT এর মুহূর্তে বসে, তাই এখানে … দেখানো। Imran কে দুইবার পাঠিয়ে দেখুন।'>
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন INSERT পাঠাবেন'>
                {OUTCOME_CANDIDATES.map(c => (
                    <button key={c.id} type='button' onClick={() => send(c)} className={cn(BTN, BTN_OFF)}>
                        {c.label}
                    </button>
                ))}
                <button type='button' onClick={reset} className={cn(BTN, 'border-dashed border-border text-muted-foreground hover:text-foreground')}>
                    আবার শুরু
                </button>
            </div>

            <div className='grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'>
                <div className='space-y-4'>
                    <AnimatePresence mode='wait'>
                        {last ? (
                            <motion.div
                                key={last.run}
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className={cn(
                                    'border px-4 py-3 font-mono text-[0.75rem] leading-relaxed',
                                    last.ok ? 'border-primary/50 bg-primary/5' : 'border-destructive/40 bg-destructive/5'
                                )}>
                                <p className='mb-2 font-sans text-[0.8125rem] font-bold text-foreground'>{last.candidate.label}</p>
                                {last.lines.map(line => (
                                    <p
                                        key={line}
                                        className={cn(
                                            line.startsWith('ERROR') ? 'font-bold text-destructive' : line.startsWith('INSERT') ? 'font-bold text-primary' : 'text-muted-foreground'
                                        )}>
                                        {line}
                                    </p>
                                ))}
                                <p className='mt-3 font-sans text-[0.8125rem] text-muted-foreground'>
                                    {last.ok
                                        ? `নতুন booking_id: ${last.stored.join(', ')}।`
                                        : last.used.length
                                          ? `কোনো Row থাকেনি, তবু নম্বর খরচ হলো: ${last.used.join(', ')}।`
                                          : 'Row বানানোর আগেই আটকেছে, তাই কোনো নম্বর খরচ হয়নি।'}
                                </p>
                            </motion.div>
                        ) : (
                            <p className='border border-dashed border-border px-4 py-6 text-center text-[0.8125rem] text-muted-foreground'>
                                উপরের যেকোনো বোতাম চাপুন। শুরুতে Table খালি, পরের নম্বর 1।
                            </p>
                        )}
                    </AnimatePresence>

                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse font-mono text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    {['booking_id', 'customer_id', 'departure_id', 'seats', 'status', 'total_bdt'].map(h => (
                                        <th key={h} className='border border-border px-2.5 py-1.5 text-left font-bold text-foreground'>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className='border border-border px-2.5 py-2 text-muted-foreground italic'>
                                            (0 rows)
                                        </td>
                                    </tr>
                                )}
                                {rows.map(r => (
                                    <motion.tr
                                        key={r.bookingId}
                                        initial={reduce ? false : { opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, ease: EASE }}>
                                        {[r.bookingId, r.customerId, r.departureId, r.seats, r.status, r.total].map((v, i) => (
                                            <td key={i} className='border border-border px-2.5 py-1.5 text-foreground/90'>
                                                {String(v)}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary'>
                        Sequence এর খাতা
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {handedOut.map(n => {
                            const isStored = rows.some(r => r.bookingId === n);
                            const isBurned = burned.includes(n);
                            return (
                                <motion.span
                                    key={n}
                                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2, ease: EASE }}
                                    className={cn(
                                        'inline-flex h-9 w-9 items-center justify-center border font-mono text-[0.8125rem] font-bold',
                                        isStored && 'border-primary bg-primary/10 text-primary',
                                        isBurned && 'border-dashed border-muted-foreground/60 text-muted-foreground line-through'
                                    )}>
                                    {n}
                                </motion.span>
                            );
                        })}
                        <span className='inline-flex h-9 min-w-9 items-center justify-center border border-dashed border-primary/60 px-2 font-mono text-[0.8125rem] text-primary'>
                            {next}?
                        </span>
                    </div>
                    <ul className='space-y-1 text-[0.8125rem] text-muted-foreground'>
                        <li>Table এ আছে: {rows.length}টা Row</li>
                        <li>খরচ হয়েছে কিন্তু Row নেই: {burned.length}টা নম্বর</li>
                        <li>পরের Row পাবে: {next}</li>
                    </ul>
                    <p className='text-[0.75rem] leading-relaxed text-muted-foreground'>
                        দুটো ব্যাচ মিলিয়ে দেখুন: বানান ভুল ধরা পড়ে Row বানানোর সময়েই, তাই তৃতীয় Row পর্যন্ত যায় না আর দুটো নম্বর খরচ হয়। Foreign
                        Key দেখা হয় সব Row বানানোর পরে, তাই সেখানে তিনটাই খরচ।
                    </p>
                </div>
            </div>
        </Panel>
    );
}
