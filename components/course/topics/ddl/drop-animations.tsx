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

/* ------------------------------------------------------------------------- */
/* 1. তিনটা কমান্ড নিজে চালিয়ে দেখুন                                              */
/* ------------------------------------------------------------------------- */

type Status = 'confirmed' | 'cancelled' | 'pending';

/** A row slot in the table file: a live row, a dead row left by DELETE, or space VACUUM freed. */
interface Slot {
    key: number;
    id: number | null;
    name: string;
    status: Status;
    state: 'live' | 'dead' | 'free';
}

interface LabState {
    exists: boolean;
    slots: Slot[];
    nextId: number;
    triggerLog: number;
    fileNo: number;
    tag: string;
    error: string | null;
    note: string;
    /** Which command made the last change, so DELETE can stagger and TRUNCATE can not. */
    last: 'delete' | 'truncate' | 'other';
}

const SEED: { name: string; status: Status }[] = [
    { name: 'Nusrat Jahan', status: 'confirmed' },
    { name: 'Arif Hasan', status: 'cancelled' },
    { name: 'Mitu Rahman', status: 'confirmed' },
    { name: 'Sohel Rana', status: 'cancelled' },
    { name: 'Tania Akter', status: 'pending' },
];

const NEW_GUESTS: { name: string; status: Status }[] = [
    { name: 'Rafiq Islam', status: 'confirmed' },
    { name: 'Shila Begum', status: 'pending' },
    { name: 'Kamal Uddin', status: 'cancelled' },
    { name: 'Lima Khatun', status: 'confirmed' },
];

function initial(): LabState {
    return {
        exists: true,
        slots: SEED.map((g, i) => ({ key: i + 1, id: i + 1, name: g.name, status: g.status, state: 'live' })),
        nextId: SEED.length + 1,
        triggerLog: 0,
        fileNo: 16553,
        tag: 'INSERT 0 5',
        error: null,
        note: 'পাঁচজন অতিথি দিয়ে শুরু। প্রতিটা Row মোছার সময় একটা AFTER DELETE Trigger একটা করে Log লেখে।',
        last: 'other',
    };
}

type Command = 'delete-where' | 'delete-all' | 'truncate' | 'truncate-restart' | 'vacuum' | 'insert' | 'drop';

const COMMANDS: { key: Command; sql: string }[] = [
    { key: 'delete-where', sql: "DELETE FROM drop_guests WHERE status = 'cancelled';" },
    { key: 'delete-all', sql: 'DELETE FROM drop_guests;' },
    { key: 'truncate', sql: 'TRUNCATE drop_guests;' },
    { key: 'truncate-restart', sql: 'TRUNCATE drop_guests RESTART IDENTITY;' },
    { key: 'vacuum', sql: 'VACUUM drop_guests;' },
    { key: 'insert', sql: 'INSERT INTO drop_guests (full_name, status) VALUES (...);' },
    { key: 'drop', sql: 'DROP TABLE drop_guests;' },
];

const MISSING = 'ERROR: relation "drop_guests" does not exist';

function apply(s: LabState, cmd: Command, serial: number): LabState {
    if (!s.exists) {
        return { ...s, error: MISSING, tag: '', note: 'Table টাই নেই, তাই কোনো কমান্ড চলে না। আবার শুরু করতে নিচের বোতাম চাপুন।', last: 'other' };
    }
    const live = s.slots.filter(x => x.state === 'live');
    switch (cmd) {
        case 'delete-where':
        case 'delete-all': {
            const hit = live.filter(x => cmd === 'delete-all' || x.status === 'cancelled');
            const keys = new Set(hit.map(x => x.key));
            return {
                ...s,
                slots: s.slots.map(x => (keys.has(x.key) ? { ...x, state: 'dead' } : x)),
                triggerLog: s.triggerLog + hit.length,
                tag: `DELETE ${hit.length}`,
                error: null,
                note:
                    hit.length === 0
                        ? 'কোনো Row শর্ত মেলেনি, তাই DELETE 0। ভুল না, শুধু কাজ নেই।'
                        : `${toBn(hit.length)}টা Row একটা একটা করে মৃত চিহ্নিত হলো, Trigger চলল ${toBn(hit.length)} বার। Row গুলো Disk এ এখনো জায়গা নিয়ে আছে, VACUUM এর অপেক্ষায়। Identity আগের জায়গা থেকেই চলবে।`,
                last: 'delete',
            };
        }
        case 'truncate':
        case 'truncate-restart':
            return {
                ...s,
                slots: [],
                nextId: cmd === 'truncate-restart' ? 1 : s.nextId,
                fileNo: s.fileNo + 3,
                tag: 'TRUNCATE TABLE',
                error: null,
                note:
                    cmd === 'truncate-restart'
                        ? 'সব Row একসাথে গেল, নতুন ফাঁকা ফাইল এল, আর Identity আবার 1 এ। Row Trigger একবারও চলেনি।'
                        : 'সব Row একসাথে গেল, নতুন ফাঁকা ফাইল এল। কোনো Row ছোঁয়া হয়নি, তাই Row Trigger একবারও চলেনি। Identity কিন্তু আগের জায়গাতেই আছে।',
                last: 'truncate',
            };
        case 'vacuum': {
            const dead = s.slots.filter(x => x.state === 'dead').length;
            return {
                ...s,
                slots: s.slots.map(x => (x.state === 'dead' ? { ...x, state: 'free' } : x)),
                tag: 'VACUUM',
                error: null,
                note:
                    dead === 0
                        ? 'মৃত Row নেই, VACUUM এর কিছু করার নেই।'
                        : `${toBn(dead)}টা মৃত Row এর জায়গা এখন নতুন Row এর জন্য খালি। ঘরগুলো ফাইলেই থাকে, পরের INSERT সেখানে বসবে।`,
                last: 'other',
            };
        }
        case 'insert': {
            const guest = NEW_GUESTS[serial % NEW_GUESTS.length];
            const free = s.slots.findIndex(x => x.state === 'free');
            const row: Slot = {
                key: 1000 + serial,
                id: s.nextId,
                name: guest.name,
                status: guest.status,
                state: 'live',
            };
            const slots = free === -1 ? [...s.slots, row] : s.slots.map((x, i) => (i === free ? row : x));
            return {
                ...s,
                slots,
                nextId: s.nextId + 1,
                tag: 'INSERT 0 1',
                error: null,
                note: `নতুন অতিথি পেলেন guest_id ${s.nextId}।${free === -1 ? '' : ' তিনি VACUUM করে খালি করা একটা ঘরে বসলেন।'}`,
                last: 'other',
            };
        }
        case 'drop':
            return {
                ...s,
                exists: false,
                slots: [],
                tag: 'DROP TABLE',
                error: null,
                note: 'Table, তার Column, Primary Key, Trigger আর Identity Sequence, সব একসাথে গেল। এখন যেকোনো কমান্ড চালালে Error।',
                last: 'other',
            };
    }
}

/**
 * One table, every command. DELETE marks rows dead one by one and fires the
 * row trigger each time, VACUUM turns dead rows into free space, TRUNCATE
 * swaps in an empty file at once without firing it, RESTART IDENTITY resets
 * the counter, DROP removes the table so every later command fails. The
 * numbers follow what PostgreSQL does in the query boxes of this lesson.
 */
export function DropCommandLab() {
    const reduce = useReducedMotion();
    const [state, setState] = useState<LabState>(initial);
    // Never reset, so a row inserted after "আবার শুরু" never reuses the key of a row still fading out.
    const [serial, setSerial] = useState(0);
    const [lastSql, setLastSql] = useState('');

    const run = (cmd: Command, sql: string) => {
        setState(s => apply(s, cmd, serial));
        if (cmd === 'insert') setSerial(n => n + 1);
        setLastSql(sql);
    };

    const live = state.slots.filter(x => x.state === 'live').length;
    const dead = state.slots.filter(x => x.state === 'dead').length;
    const used = state.slots.length;
    /** Dead rows fade one after another, the way DELETE visits them. */
    const deadOrder = new Map(state.slots.filter(x => x.state === 'dead').map((x, i) => [x.key, i] as const));

    return (
        <Panel
            label='Interactive'
            title='একটা Table, সাতটা কমান্ড'
            footer={
                <>
                    এটা সরল করা ছবি, কিন্তু প্রতিটা সংখ্যা PostgreSQL এর আসল আচরণ মেনে চলে: DELETE এর পরে Identity থামে না, TRUNCATE এর
                    পরেও না, শুধু RESTART IDENTITY তাকে 1 এ ফেরায়। DELETE এর মৃত Row ফাইলের জায়গা দখল করে রাখে, TRUNCATE ফাইলটাই বদলে
                    দেয় (ফাইল নম্বর বদলায়, এই লেসনের বক্সেও দেখবেন)। আসল Disk এ একটা Page এ অনেক Row থাকে, এখানে প্রতিটা ঘর একটা Row।
                </>
            }>
            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_16rem] gap-6'>
                <div>
                    <div className='flex flex-wrap gap-2 mb-4'>
                        {COMMANDS.map(c => (
                            <button
                                key={c.key}
                                type='button'
                                data-command={c.key}
                                onClick={() => run(c.key, c.sql)}
                                className={cn(BTN, lastSql === c.sql ? BTN_ON : BTN_OFF, 'font-mono')}>
                                {c.sql}
                            </button>
                        ))}
                        <button
                            type='button'
                            data-command='reset'
                            onClick={() => {
                                setState(initial());
                                setLastSql('');
                            }}
                            className={cn(BTN, BTN_OFF)}>
                            আবার শুরু
                        </button>
                    </div>

                    <div className='mb-4 min-h-[3.5rem] border border-border bg-muted/20 px-4 py-2 font-mono text-[0.75rem] leading-relaxed'>
                        {state.error ? (
                            <p className='text-destructive font-bold' data-lab-error>
                                {state.error}
                            </p>
                        ) : (
                            <p className='text-primary font-bold' data-lab-tag={state.tag}>
                                {state.tag}
                            </p>
                        )}
                        <motion.p
                            key={state.note}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className='font-sans text-sm text-foreground/90'>
                            {state.note}
                        </motion.p>
                    </div>

                    {state.exists ? (
                        <div className='border border-border' data-table-exists='true'>
                            <div className='grid grid-cols-[4rem_minmax(0,1fr)_7rem] bg-muted/40 font-mono text-[0.75rem] font-bold'>
                                <span className='px-3 py-2 border-r border-border'>guest_id</span>
                                <span className='px-3 py-2 border-r border-border'>full_name</span>
                                <span className='px-3 py-2'>status</span>
                            </div>
                            <AnimatePresence initial={false}>
                                {state.slots.map(slot => {
                                    const delay = state.last === 'delete' ? (deadOrder.get(slot.key) ?? 0) * 0.18 : 0;
                                    return (
                                        <motion.div
                                            key={slot.key}
                                            layout={!reduce}
                                            initial={reduce ? false : { opacity: 0, x: -8 }}
                                            animate={{ opacity: slot.state === 'live' ? 1 : 0.45, x: 0 }}
                                            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                                            transition={{ duration: 0.3, ease: EASE, delay: reduce ? 0 : delay }}
                                            data-slot={slot.state}
                                            className={cn(
                                                'grid grid-cols-[4rem_minmax(0,1fr)_7rem] border-t border-border font-mono text-[0.75rem]',
                                                slot.state === 'dead' && 'line-through decoration-primary bg-primary/5',
                                                slot.state === 'free' && 'border-dashed text-muted-foreground'
                                            )}>
                                            {slot.state === 'free' ? (
                                                <span className='col-span-3 px-3 py-1.5 italic'>খালি জায়গা, নতুন Row এর জন্য</span>
                                            ) : (
                                                <>
                                                    <span className='px-3 py-1.5 border-r border-border'>{slot.id}</span>
                                                    <span className='px-3 py-1.5 border-r border-border truncate'>{slot.name}</span>
                                                    <span className='px-3 py-1.5'>{slot.status}</span>
                                                </>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            {state.slots.length === 0 && (
                                <p className='border-t border-border px-3 py-3 text-center font-mono text-[0.75rem] text-muted-foreground'>
                                    (0 rows)
                                </p>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            data-table-exists='false'
                            className='border border-dashed border-primary/60 px-4 py-8 text-center font-mono text-[0.75rem] text-primary'>
                            drop_guests নামে কোনো Table নেই
                        </motion.div>
                    )}
                </div>

                <dl className='grid grid-cols-2 lg:grid-cols-1 gap-3 content-start font-mono text-[0.75rem]'>
                    {[
                        ['Table আছে?', state.exists ? 'হ্যাঁ' : 'না', 'exists'],
                        ['জীবিত Row', toBn(live), 'live'],
                        ['মৃত Row (VACUUM এর অপেক্ষায়)', toBn(dead), 'dead'],
                        ['ফাইলে মোট ঘর', state.exists ? toBn(used) : '', 'slots'],
                        ['পরের guest_id', state.exists ? String(state.nextId) : '', 'next-id'],
                        ['Trigger Log এ লাইন', toBn(state.triggerLog), 'trigger'],
                        ['ফাইল নম্বর', state.exists ? String(state.fileNo) : '', 'file'],
                    ].map(([k, v, id]) => (
                        <div key={id} className='border border-border px-3 py-2' data-stat={id}>
                            <dt className='text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground'>{k}</dt>
                            <dd className='mt-1 text-base font-bold text-foreground'>{v}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Island Tours এর কোন Table এ কী ঘটবে                                        */
/* ------------------------------------------------------------------------- */

type Table = 'destinations' | 'guides' | 'tours' | 'customers' | 'departures' | 'bookings' | 'payments' | 'reviews';

const TABLES: { name: Table; rows: number }[] = [
    { name: 'destinations', rows: 7 },
    { name: 'guides', rows: 5 },
    { name: 'tours', rows: 9 },
    { name: 'customers', rows: 15 },
    { name: 'departures', rows: 16 },
    { name: 'bookings', rows: 24 },
    { name: 'payments', rows: 19 },
    { name: 'reviews', rows: 10 },
];

/** Every foreign key of the sample database: the child table, the parent it points at, and its name. */
const FKS: { child: Table; parent: Table; name: string }[] = [
    { child: 'tours', parent: 'destinations', name: 'tours_destination_id_fkey' },
    { child: 'tours', parent: 'guides', name: 'tours_guide_id_fkey' },
    { child: 'departures', parent: 'tours', name: 'departures_tour_id_fkey' },
    { child: 'bookings', parent: 'customers', name: 'bookings_customer_id_fkey' },
    { child: 'bookings', parent: 'departures', name: 'bookings_departure_id_fkey' },
    { child: 'payments', parent: 'bookings', name: 'payments_booking_id_fkey' },
    { child: 'reviews', parent: 'bookings', name: 'reviews_booking_id_fkey' },
];

type Action = 'truncate' | 'truncate-cascade' | 'drop' | 'drop-cascade';

const ACTIONS: { key: Action; label: (t: Table) => string }[] = [
    { key: 'truncate', label: t => `TRUNCATE ${t};` },
    { key: 'truncate-cascade', label: t => `TRUNCATE ${t} CASCADE;` },
    { key: 'drop', label: t => `DROP TABLE ${t};` },
    { key: 'drop-cascade', label: t => `DROP TABLE ${t} CASCADE;` },
];

/** The table and every table that points at it, directly or through others. */
function descendants(t: Table): Table[] {
    const out: Table[] = [t];
    for (let i = 0; i < out.length; i++) {
        for (const fk of FKS) {
            if (fk.parent === out[i] && !out.includes(fk.child)) out.push(fk.child);
        }
    }
    return out;
}

interface Outcome {
    ok: boolean;
    lines: string[];
    emptied: Table[];
    removed: Table[];
    fksGone: string[];
}

function outcome(t: Table, a: Action): Outcome {
    const children = FKS.filter(fk => fk.parent === t);
    const own = FKS.filter(fk => fk.child === t);
    switch (a) {
        case 'truncate':
            if (children.length > 0) {
                return {
                    ok: false,
                    lines: [
                        'ERROR:  cannot truncate a table referenced in a foreign key constraint',
                        `DETAIL:  Table "${children[0].child}" references "${t}".`,
                        `HINT:  Truncate table "${children[0].child}" at the same time, or use TRUNCATE ... CASCADE.`,
                    ],
                    emptied: [],
                    removed: [],
                    fksGone: [],
                };
            }
            return { ok: true, lines: ['TRUNCATE TABLE'], emptied: [t], removed: [], fksGone: [] };
        case 'truncate-cascade': {
            const all = descendants(t);
            return {
                ok: true,
                lines: [...all.slice(1).map(c => `NOTICE:  truncate cascades to table "${c}"`), 'TRUNCATE TABLE'],
                emptied: all,
                removed: [],
                fksGone: [],
            };
        }
        case 'drop':
            if (children.length > 0) {
                return {
                    ok: false,
                    lines: [
                        `ERROR:  cannot drop table ${t} because other objects depend on it`,
                        ...children.map(
                            (fk, i) => `${i === 0 ? 'DETAIL:  ' : ''}constraint ${fk.name} on table ${fk.child} depends on table ${t}`
                        ),
                        'HINT:  Use DROP ... CASCADE to drop the dependent objects too.',
                    ],
                    emptied: [],
                    removed: [],
                    fksGone: [],
                };
            }
            return { ok: true, lines: ['DROP TABLE'], emptied: [], removed: [t], fksGone: own.map(fk => fk.name) };
        case 'drop-cascade':
            return {
                ok: true,
                lines: [
                    ...(children.length > 0
                        ? [
                              children.length === 1
                                  ? `NOTICE:  drop cascades to constraint ${children[0].name} on table ${children[0].child}`
                                  : `NOTICE:  drop cascades to ${children.length} other objects`,
                              ...(children.length > 1
                                  ? children.map(
                                        (fk, i) =>
                                            `${i === 0 ? 'DETAIL:  ' : ''}drop cascades to constraint ${fk.name} on table ${fk.child}`
                                    )
                                  : []),
                          ]
                        : []),
                    'DROP TABLE',
                ],
                emptied: [],
                removed: [t],
                fksGone: [...own, ...children].map(fk => fk.name),
            };
    }
}

/**
 * Pick one of the eight Island Tours tables and one of four commands, and see
 * what PostgreSQL answers, which tables lose their rows, which table goes and
 * which foreign keys go with it. Every outcome was checked against the real
 * database inside BEGIN ... ROLLBACK.
 */
export function CascadeExplorerLab() {
    const reduce = useReducedMotion();
    const [table, setTable] = useState<Table>('customers');
    const [action, setAction] = useState<Action>('truncate-cascade');
    const result = outcome(table, action);

    return (
        <Panel
            label='Interactive'
            title='Island Tours এর আট Table, চার কমান্ড'
            footer={
                <>
                    প্রতিটা ফলাফল আসল Database এ BEGIN আর ROLLBACK এর মাঝে চালিয়ে মেলানো। লক্ষ করুন: TRUNCATE ... CASCADE Foreign Key এর
                    তীর ধরে নিচে নামতে থাকে আর Row মুছে দেয়, DROP TABLE ... CASCADE শুধু এক ধাপের Constraint গুলো সরায়, অন্য কোনো
                    Table মোছে না। guides খালি করলে bookings ও খালি হয়, কারণ শিকলটা guides থেকে tours, departures হয়ে bookings পর্যন্ত যায়।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-3'>
                {TABLES.map(t => (
                    <button
                        key={t.name}
                        type='button'
                        data-table={t.name}
                        onClick={() => setTable(t.name)}
                        className={cn(BTN, table === t.name ? BTN_ON : BTN_OFF, 'font-mono')}>
                        {t.name}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-5'>
                {ACTIONS.map(a => (
                    <button
                        key={a.key}
                        type='button'
                        data-action={a.key}
                        onClick={() => setAction(a.key)}
                        className={cn(BTN, action === a.key ? BTN_ON : BTN_OFF, 'font-mono')}>
                        {a.label(table)}
                    </button>
                ))}
            </div>

            <motion.pre
                key={`${table}-${action}`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                data-outcome={result.ok ? 'ok' : 'error'}
                className={cn(
                    'mb-5 overflow-x-auto border px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre',
                    result.ok ? 'border-border bg-background text-foreground/90' : 'border-destructive/50 bg-destructive/5 text-destructive'
                )}>
                {result.lines.join('\n')}
            </motion.pre>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mb-4'>
                {TABLES.map(t => {
                    const emptied = result.emptied.includes(t.name);
                    const removed = result.removed.includes(t.name);
                    return (
                        <div
                            key={t.name}
                            data-cell={t.name}
                            data-state={removed ? 'removed' : emptied ? 'emptied' : 'kept'}
                            className={cn(
                                'border px-3 py-2 font-mono text-[0.75rem] transition-colors duration-300',
                                removed && 'border-dashed border-primary text-primary line-through',
                                emptied && 'border-primary bg-primary/10 text-primary',
                                !removed && !emptied && 'border-border text-foreground'
                            )}>
                            <div className='font-bold'>{t.name}</div>
                            <div className='text-[0.6875rem] mt-0.5'>
                                {removed ? 'Table নেই' : emptied ? `${t.rows} থেকে 0 Row` : `${t.rows} Row, অক্ষত`}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className='text-sm leading-relaxed text-foreground/90' data-fks-gone={result.fksGone.length}>
                {result.fksGone.length > 0 ? (
                    <>
                        যে Foreign Key গুলো চলে যায়:{' '}
                        <span className='font-mono text-[0.75rem] text-primary'>{result.fksGone.join(', ')}</span>
                    </>
                ) : result.ok ? (
                    'কোনো Foreign Key সরে না, সব নিয়ম জায়গামতো থাকে।'
                ) : (
                    'Error হয়েছে, তাই কিছুই বদলায়নি। এটাই PostgreSQL এর পাহারা।'
                )}
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন কাজে কোনটা                                                            */
/* ------------------------------------------------------------------------- */

type Pick = 'DELETE' | 'TRUNCATE' | 'DROP';

const SCENARIOS: { situation: string; answer: Pick; sql: string; why: string }[] = [
    {
        situation: 'রিপোর্টের কপি Table থেকে শুধু তিনটা cancelled Booking সরাতে হবে, বাকিগুলো থাকবে।',
        answer: 'DELETE',
        sql: "DELETE FROM drop_report WHERE status = 'cancelled';",
        why: 'কিছু Row যাবে, কিছু থাকবে, তাই WHERE লাগবে। WHERE শুধু DELETE এর আছে, TRUNCATE আর DROP সবকিছু নেয়।',
    },
    {
        situation: 'রাতের Import Table এ প্রতি রাতে নতুন CSV ঢোকে। Load এর আগে Table খালি চাই, import_id আবার 1 থেকে।',
        answer: 'TRUNCATE',
        sql: 'TRUNCATE drop_imports RESTART IDENTITY;',
        why: 'সব Row যাবে কিন্তু Table থাকবে, আর নম্বর নতুন করে শুরু হবে। ঠিক এই কাজের জন্যই TRUNCATE ... RESTART IDENTITY।',
    },
    {
        situation: 'Lesson 02 এ বানানো একটা অনুশীলনের Table কেউ আর ব্যবহার করে না, কোনো কোডও তাকে চেনে না।',
        answer: 'DROP',
        sql: 'DROP TABLE IF EXISTS ct_tour_extras;',
        why: 'Row না, Table টাকেই আর দরকার নেই। IF EXISTS থাকলে Script টা দুইবার চালালেও Error হয় না।',
    },
    {
        situation: 'Booking মোছার প্রতিটা ঘটনা একটা Audit Trigger দিয়ে Log হয়। পুরনো পরীক্ষামূলক Booking গুলো সরাতে হবে, Log যেন বাদ না পড়ে।',
        answer: 'DELETE',
        sql: "DELETE FROM drop_bookings WHERE booked_at < DATE '2026-01-01';",
        why: 'Row Level Trigger শুধু DELETE এ চলে। TRUNCATE কোনো Row ছোঁয় না বলে ON DELETE Trigger একবারও চলে না, Log ফাঁকা থেকে যায়।',
    },
    {
        situation: 'MySQL এ একটা Transaction এর মধ্যে একটা Table খালি করতে হবে, আর পরের ধাপ ব্যর্থ হলে সব ফেরত আনতে হবে।',
        answer: 'DELETE',
        sql: 'START TRANSACTION; DELETE FROM drop_staging; ... ROLLBACK;',
        why: 'MySQL এ TRUNCATE চুপচাপ COMMIT করে দেয়, তাই ROLLBACK কিছুই ফেরায় না। DELETE Transaction এর ভেতরে থাকে।',
    },
    {
        situation: 'পাঁচ কোটি Row এর পুরনো Log Table পুরোটা খালি করতে হবে। এই মুহূর্তে কেউ সেটা পড়ছে না, আর Disk এর জায়গাও এখনই ফেরত চাই।',
        answer: 'TRUNCATE',
        sql: 'TRUNCATE drop_old_logs;',
        why: 'DELETE পাঁচ কোটি Row একটা একটা করে মৃত চিহ্নিত করবে আর জায়গা ধরে রাখবে। TRUNCATE ফাইলটা বদলে দেয়, মুহূর্তেই শেষ, জায়গাও ফেরত। শুধু মনে রাখুন, সে কিছুক্ষণের জন্য Table টা পুরো আটকে রাখে।',
    },
];

/**
 * Six real situations from the Island Tours team. The reader picks a command
 * and gets the statement and the reason, right or wrong.
 */
export function DropChooserLab() {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [picks, setPicks] = useState<(Pick | null)[]>(() => SCENARIOS.map(() => null));
    const scenario = SCENARIOS[index];
    const pick = picks[index];
    const score = picks.filter((p, i) => p === SCENARIOS[i].answer).length;
    const answered = picks.filter(p => p !== null).length;

    return (
        <Panel
            label='Interactive'
            title='কোন কাজে কোন কমান্ড'
            footer={
                <>
                    তিনটা প্রশ্নে বেশিরভাগ সিদ্ধান্ত হয়ে যায়: কিছু Row যাবে নাকি সব? Table টা কি পরেও লাগবে? আর কেউ কি প্রতিটা মোছা Row এর
                    খবর রাখে, Trigger বা Foreign Key দিয়ে? সাথে MySQL হলে চতুর্থ প্রশ্ন: ফেরত আনার দরকার হতে পারে কি?
                </>
            }>
            <div className='flex flex-wrap items-center gap-2 mb-4'>
                {SCENARIOS.map((s, i) => (
                    <button
                        key={s.sql}
                        type='button'
                        data-scenario={i + 1}
                        onClick={() => setIndex(i)}
                        className={cn(
                            BTN,
                            index === i ? BTN_ON : BTN_OFF,
                            picks[i] !== null && picks[i] === s.answer && index !== i && 'text-primary'
                        )}>
                        পরিস্থিতি {toBn(i + 1)}
                    </button>
                ))}
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-score={score} data-answered={answered}>
                    {toBn(answered)} / {toBn(SCENARIOS.length)} উত্তর, {toBn(score)}টা ঠিক
                </span>
            </div>

            <motion.div
                key={index}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}>
                <p className='mb-4 text-base leading-relaxed text-foreground'>{scenario.situation}</p>
                <div className='flex flex-wrap gap-2 mb-4'>
                    {(['DELETE', 'TRUNCATE', 'DROP'] as Pick[]).map(p => (
                        <button
                            key={p}
                            type='button'
                            data-pick={p}
                            onClick={() => setPicks(prev => prev.map((v, i) => (i === index ? p : v)))}
                            className={cn(
                                BTN,
                                'font-mono',
                                pick === p
                                    ? p === scenario.answer
                                        ? BTN_ON
                                        : 'border-destructive bg-destructive/10 text-destructive'
                                    : BTN_OFF
                            )}>
                            {p}
                        </button>
                    ))}
                </div>
                {pick && (
                    <div
                        className={cn(
                            'border px-4 py-3 text-sm leading-relaxed',
                            pick === scenario.answer ? 'border-primary/60 bg-primary/5' : 'border-destructive/50 bg-destructive/5'
                        )}
                        data-verdict={pick === scenario.answer ? 'right' : 'wrong'}>
                        <p className='font-bold mb-1'>
                            {pick === scenario.answer ? 'ঠিক।' : `এখানে ${scenario.answer} ভালো।`}
                        </p>
                        <p className='mb-2'>{scenario.why}</p>
                        <code className='font-mono text-[0.75rem] text-primary'>{scenario.sql}</code>
                    </div>
                )}
            </motion.div>
        </Panel>
    );
}
