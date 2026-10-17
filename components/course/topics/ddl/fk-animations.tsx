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

type RowState = 'plain' | 'lit' | 'gone' | 'changed';

interface MiniRow {
    key: string;
    cells: string[];
    state: RowState;
}

function MiniTable({ name, columns, rows }: { name: string; columns: string[]; rows: MiniRow[] }) {
    const reduce = useReducedMotion();
    return (
        <div>
            <p className='font-mono text-[0.6875rem] font-bold text-foreground mb-2'>{name}</p>
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
                            <motion.tr
                                key={row.key}
                                initial={false}
                                animate={{ opacity: row.state === 'gone' ? 0.35 : 1 }}
                                transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                                data-row-state={row.state}
                                className={cn(
                                    'border-b border-border/60 last:border-b-0 transition-colors duration-300',
                                    row.state === 'lit' && 'bg-primary/10',
                                    row.state === 'changed' && 'bg-primary/15',
                                    row.state === 'gone' && 'line-through'
                                )}>
                                {row.cells.map((cell, i) => (
                                    <td
                                        key={i}
                                        className={cn(
                                            'px-3 py-1 whitespace-nowrap',
                                            row.state === 'plain' ? 'text-foreground/90' : 'text-primary font-bold'
                                        )}>
                                        {cell}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. কোন Statement এ Check হয়, নিজে চালিয়ে দেখুন                                */
/* ------------------------------------------------------------------------- */

const HOTELS = [
    ['1', 'Sea Pearl Resort'],
    ['2', 'Hill View Lodge'],
    ['3', 'Riverside Inn'],
];

const ROOMS = [
    ['101', '1', 'Sea view double'],
    ['102', '1', 'Garden twin'],
    ['201', '2', 'Cloud deck single'],
];

interface CheckOp {
    id: string;
    side: 'child' | 'parent';
    sql: string;
    checked: boolean;
    ok: boolean;
    output: string;
    why: string;
    hotels: string[];
    rooms: string[];
}

// Every output below is psql against PostgreSQL 18, each statement run on a
// fresh copy of the three hotels and three rooms shown in the lab.
const OPS: CheckOp[] = [
    {
        id: 'child-insert-ok',
        side: 'child',
        sql: "INSERT INTO fk_rooms VALUES (202, 2, 'Hill twin');",
        checked: true,
        ok: true,
        output: 'INSERT 0 1',
        why: 'নতুন Room বলছে সে Hotel 2 এর। PostgreSQL fk_hotels এ 2 খুঁজে পেয়েছে, তাই Row ঢুকে গেছে।',
        hotels: ['2'],
        rooms: [],
    },
    {
        id: 'child-insert-orphan',
        side: 'child',
        sql: "INSERT INTO fk_rooms VALUES (301, 99, 'Ghost room');",
        checked: true,
        ok: false,
        output:
            'ERROR:  insert or update on table "fk_rooms" violates foreign key constraint "fk_rooms_hotel_id_fkey"\nDETAIL:  Key (hotel_id)=(99) is not present in table "fk_hotels".',
        why: 'Hotel 99 নেই। এই Row ঢুকলে সে হতো অনাথ, তাই PostgreSQL পুরো INSERT ফিরিয়ে দিয়েছে।',
        hotels: [],
        rooms: [],
    },
    {
        id: 'child-update',
        side: 'child',
        sql: 'UPDATE fk_rooms SET hotel_id = 99 WHERE room_id = 201;',
        checked: true,
        ok: false,
        output:
            'ERROR:  insert or update on table "fk_rooms" violates foreign key constraint "fk_rooms_hotel_id_fkey"\nDETAIL:  Key (hotel_id)=(99) is not present in table "fk_hotels".',
        why: 'UPDATE ও একটা নতুন মান লেখা। Error এর প্রথম শব্দগুলো লক্ষ করুন: insert or update, দুটোর জন্য একই বার্তা।',
        hotels: [],
        rooms: ['201'],
    },
    {
        id: 'child-delete',
        side: 'child',
        sql: 'DELETE FROM fk_rooms WHERE room_id = 102;',
        checked: false,
        ok: true,
        output: 'DELETE 1',
        why: 'Child মুছলে কেউ অনাথ হয় না। Hotel 1 এর এখন একটা Room কম, এর বেশি কিছু না। এখানে কোনো Check চলেই না।',
        hotels: [],
        rooms: ['102'],
    },
    {
        id: 'parent-insert',
        side: 'parent',
        sql: "INSERT INTO fk_hotels VALUES (4, 'Kuakata Sea Inn');",
        checked: false,
        ok: true,
        output: 'INSERT 0 1',
        why: 'নতুন Hotel কাউকে ভাঙে না। Room ছাড়া Hotel থাকতে পারে, যেমন Riverside Inn এখনই আছে।',
        hotels: [],
        rooms: [],
    },
    {
        id: 'parent-update-name',
        side: 'parent',
        sql: "UPDATE fk_hotels SET name = 'Sea Pearl Beach Resort' WHERE hotel_id = 1;",
        checked: false,
        ok: true,
        output: 'UPDATE 1',
        why: 'Key বদলায়নি, শুধু নাম। Room গুলো hotel_id = 1 দেখায়, নাম না, তাই কারও কিছু যায় আসে না।',
        hotels: ['1'],
        rooms: [],
    },
    {
        id: 'parent-delete-free',
        side: 'parent',
        sql: 'DELETE FROM fk_hotels WHERE hotel_id = 3;',
        checked: true,
        ok: true,
        output: 'DELETE 1',
        why: 'Check চলেছে, কিন্তু Riverside Inn কে কোনো Room দেখায় না। কেউ অনাথ হলো না, তাই মুছে গেছে।',
        hotels: ['3'],
        rooms: [],
    },
    {
        id: 'parent-delete-used',
        side: 'parent',
        sql: 'DELETE FROM fk_hotels WHERE hotel_id = 1;',
        checked: true,
        ok: false,
        output:
            'ERROR:  update or delete on table "fk_hotels" violates foreign key constraint "fk_rooms_hotel_id_fkey" on table "fk_rooms"\nDETAIL:  Key (hotel_id)=(1) is still referenced from table "fk_rooms".',
        why: 'Room 101 আর 102 এখনো Hotel 1 দেখায়। Default নিয়ম NO ACTION, তাই মোছা বাতিল। এবার বার্তার শুরু update or delete, কারণ এটা Parent এর দিক।',
        hotels: ['1'],
        rooms: ['101', '102'],
    },
    {
        id: 'parent-update-key',
        side: 'parent',
        sql: 'UPDATE fk_hotels SET hotel_id = 10 WHERE hotel_id = 1;',
        checked: true,
        ok: false,
        output:
            'ERROR:  update or delete on table "fk_hotels" violates foreign key constraint "fk_rooms_hotel_id_fkey" on table "fk_rooms"\nDETAIL:  Key (hotel_id)=(1) is still referenced from table "fk_rooms".',
        why: 'Key 1 থেকে 10 হলে Room 101 আর 102 এমন Hotel দেখাত, যেটা আর নেই। তাই Key বদলানোও মোছার মতোই আটকে গেছে।',
        hotels: ['1'],
        rooms: ['101', '102'],
    },
    {
        id: 'parent-drop',
        side: 'parent',
        sql: 'DROP TABLE fk_hotels;',
        checked: true,
        ok: false,
        output:
            'ERROR:  cannot drop table fk_hotels because other objects depend on it\nDETAIL:  constraint fk_rooms_hotel_id_fkey on table fk_rooms depends on table fk_hotels\nHINT:  Use DROP ... CASCADE to drop the dependent objects too.',
        why: 'পুরো Parent Table ফেলে দিলে Constraint টাই অর্থহীন। PostgreSQL আটকায়। DROP ... CASCADE দিলে Table যায় আর Constraint টা মুছে যায়, Room গুলো থাকে, কিন্তু তখন আর কোনো পাহারা নেই।',
        hotels: ['1', '2', '3'],
        rooms: [],
    },
    {
        id: 'parent-truncate',
        side: 'parent',
        sql: 'TRUNCATE fk_hotels;',
        checked: true,
        ok: false,
        output:
            'ERROR:  cannot truncate a table referenced in a foreign key constraint\nDETAIL:  Table "fk_rooms" references "fk_hotels".\nHINT:  Truncate table "fk_rooms" at the same time, or use TRUNCATE ... CASCADE.',
        why: 'TRUNCATE সব Row একসাথে ফেলে, Row ধরে ধরে Check করে না। তাই কোনো Child Table এটাকে দেখালে TRUNCATE সরাসরি নিষেধ।',
        hotels: ['1', '2', '3'],
        rooms: [],
    },
];

/**
 * Pick any statement against the hotels and rooms pair and see whether the
 * foreign key checks it, what PostgreSQL answered, and which rows took part.
 */
export function FkCheckLab() {
    const reduce = useReducedMotion();
    const [selected, setSelected] = useState(OPS[1].id);
    const op = OPS.find(o => o.id === selected) ?? OPS[0];

    const hotelRows: MiniRow[] = HOTELS.map(h => ({
        key: h[0],
        cells: h,
        state: op.hotels.includes(h[0]) ? 'lit' : 'plain',
    }));
    const roomRows: MiniRow[] = ROOMS.map(r => ({
        key: r[0],
        cells: r,
        state: op.rooms.includes(r[0]) ? 'lit' : 'plain',
    }));

    const group = (side: CheckOp['side'], label: string) => (
        <div className='mb-4' role='group' aria-label={label}>
            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>{label}</p>
            <div className='flex flex-wrap gap-2'>
                {OPS.filter(o => o.side === side).map(o => (
                    <button
                        key={o.id}
                        type='button'
                        data-op={o.id}
                        aria-pressed={selected === o.id}
                        onClick={() => setSelected(o.id)}
                        className={cn(BTN, 'font-mono', selected === o.id ? BTN_ON : BTN_OFF)}>
                        {o.sql.length > 46 ? `${o.sql.slice(0, 44)}…` : o.sql}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <Panel
            label='Interactive'
            title='কোন Statement এ Foreign Key জেগে ওঠে'
            footer='প্রতিটা ফলাফল psql এ PostgreSQL 18 এর আসল উত্তর। প্রতিটা Statement চালানো হয়েছে নিচের তিনটা Hotel আর তিনটা Room এর নতুন কপিতে, তাই একটার ফল অন্যটাকে ছোঁয় না। Query বক্সে নিজে চালালে psql এর INSERT 0 1 এর জায়গায় INSERT 1 দেখতে পারেন, বাকি সব হুবহু।'>
            {group('child', 'Child এর দিকে: fk_rooms')}
            {group('parent', 'Parent এর দিকে: fk_hotels')}

            <motion.div
                key={op.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                data-op-result={op.id}
                data-checked={op.checked ? 'yes' : 'no'}
                className='mt-6 space-y-4'>
                <div className='flex flex-wrap items-center gap-2'>
                    <span
                        className={cn(
                            'px-2 py-0.5 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]',
                            op.checked ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                        )}>
                        {op.checked ? 'Foreign Key Check হয়েছে' : 'কোনো Check নেই'}
                    </span>
                    <span
                        className={cn(
                            'px-2 py-0.5 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]',
                            op.ok ? 'border-border text-foreground' : 'border-destructive text-destructive'
                        )}>
                        {op.ok ? 'সফল' : 'আটকে গেছে'}
                    </span>
                </div>
                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                    <span className='block text-primary'>{op.sql}</span>
                    <span className={cn('block whitespace-pre-wrap mt-1', op.ok ? 'text-foreground' : 'text-destructive')}>
                        {op.output}
                    </span>
                </pre>
                <p className='text-sm leading-relaxed text-foreground'>{op.why}</p>
            </motion.div>

            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
                <MiniTable name='fk_hotels (Parent)' columns={['hotel_id', 'name']} rows={hotelRows} />
                <MiniTable name='fk_rooms (Child)' columns={['room_id', 'hotel_id', 'label']} rows={roomRows} />
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ON DELETE এর নিয়ম ধাপে ধাপে                                                */
/* ------------------------------------------------------------------------- */

type Action = 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT';

const ACTIONS: Action[] = ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT'];

const LAB_HOTELS = [
    ['0', 'Unassigned'],
    ['1', 'Sea Pearl Resort'],
    ['2', 'Hill View Lodge'],
];

const LAB_ROOMS = [
    ['101', '1', 'Sea view double'],
    ['102', '1', 'Garden twin'],
    ['201', '2', 'Cloud deck single'],
];

interface ActionOutcome {
    /** psql's answer to the DELETE. */
    output: string;
    error: boolean;
    /** room_id to its hotel_id after the statement; missing means deleted. */
    after: Record<string, string>;
    explain: string;
}

// PostgreSQL 18, the same script five times with only the ON DELETE word
// changed:
//   hotel_id integer DEFAULT 0 REFERENCES fk_hotels (hotel_id) ON DELETE <action>
const OUTCOMES: Record<Action, ActionOutcome> = {
    'NO ACTION': {
        output:
            'ERROR:  update or delete on table "fk_hotels" violates foreign key constraint "fk_rooms_hotel_id_fkey" on table "fk_rooms"\nDETAIL:  Key (hotel_id)=(1) is still referenced from table "fk_rooms".',
        error: true,
        after: { '101': '1', '102': '1', '201': '2' },
        explain:
            'Statement শেষ হওয়ার মুহূর্তে PostgreSQL দেখল Room 101 আর 102 এখনো Hotel 1 দেখাচ্ছে। Error, আর পুরো DELETE বাতিল: Hotel 1 ফিরে এসেছে, কিছুই বদলায়নি।',
    },
    RESTRICT: {
        output:
            'ERROR:  update or delete on table "fk_hotels" violates RESTRICT setting of foreign key constraint "fk_rooms_hotel_id_fkey" on table "fk_rooms"\nDETAIL:  Key (hotel_id)=(1) is referenced from table "fk_rooms".',
        error: true,
        after: { '101': '1', '102': '1', '201': '2' },
        explain:
            'ফল NO ACTION এর মতোই, কিছুই বদলায়নি, কিন্তু বার্তা আলাদা: violates RESTRICT setting, SQLSTATE 23001। RESTRICT অপেক্ষা করে না, কাউকে দেখানো Row মোছার চেষ্টাতেই থামিয়ে দেয়।',
    },
    CASCADE: {
        output: 'DELETE 1',
        error: false,
        after: { '201': '2' },
        explain:
            'Hotel 1 গেছে, আর তাকে দেখানো Room 101 আর 102 ও তার সাথে মুছে গেছে। psql বলছে DELETE 1, কারণ আপনি মুছেছেন একটা Hotel। Room দুটো মুছেছে Foreign Key নিজে, সেই সংখ্যা এখানে আসে না।',
    },
    'SET NULL': {
        output: 'DELETE 1',
        error: false,
        after: { '101': 'NULL', '102': 'NULL', '201': '2' },
        explain:
            'Hotel 1 গেছে, Room দুটো রয়ে গেছে, কিন্তু তাদের hotel_id এখন NULL: এই Room কোন Hotel এর, সেটা আর জানা নেই। Column টা NOT NULL হলে এখানে Error আসত।',
    },
    'SET DEFAULT': {
        output: 'DELETE 1',
        error: false,
        after: { '101': '0', '102': '0', '201': '2' },
        explain:
            'Room দুটোর hotel_id হয়ে গেছে Column এর Default, মানে 0। Hotel 0 (Unassigned) আছে বলে Foreign Key খুশি। Hotel 0 না থাকলে এখানেই ERROR 23503 আসত।',
    },
};

const STEPS = ['শুরুর অবস্থা', 'Parent Row মোছা', 'Child খোঁজা', 'নিয়ম খাটানো'];

/**
 * DELETE FROM fk_hotels WHERE hotel_id = 1 played in four steps for the
 * chosen ON DELETE action: the parent row goes, the foreign key finds the
 * rooms pointing at it, then the action decides their fate (or undoes it all).
 */
export function FkActionLab() {
    const reduce = useReducedMotion();
    const [action, setAction] = useState<Action>('CASCADE');
    const [step, setStep] = useState(0);
    const outcome = OUTCOMES[action];
    const finalError = step === 3 && outcome.error;

    const hotelState = (id: string): RowState => {
        if (id !== '1' || step === 0) return 'plain';
        if (step === 3 && outcome.error) return 'lit';
        return 'gone';
    };
    const hotelRows: MiniRow[] = LAB_HOTELS.map(h => ({ key: h[0], cells: h, state: hotelState(h[0]) }));

    const roomRows: MiniRow[] = LAB_ROOMS.map(r => {
        const pointsAtOne = r[1] === '1';
        if (step < 2 || !pointsAtOne) return { key: r[0], cells: r, state: 'plain' };
        if (step === 2) return { key: r[0], cells: r, state: 'lit' };
        const after = outcome.after[r[0]];
        if (after === undefined) return { key: r[0], cells: r, state: 'gone' };
        if (after !== r[1]) return { key: r[0], cells: [r[0], after, r[2]], state: 'changed' };
        return { key: r[0], cells: r, state: 'lit' };
    });

    const stepText = [
        `Hotel 1 কে দুটো Room দেখায়, 101 আর 102। Room 201 Hotel 2 এর। Room এর hotel_id এর Default 0, আর Hotel 0 এর নাম Unassigned। নিয়ম বেছে নিয়ে পরের ধাপে যান।`,
        'DELETE Hotel 1 এর Row টাকে মোছার জন্য চিহ্নিত করেছে। এখনো কিছু চূড়ান্ত না: একই Statement এর ভেতরে Foreign Key এর কাজ বাকি।',
        `Foreign Key খোঁজে fk_rooms এ hotel_id = 1 কারা। পাওয়া গেল ২টা Row: 101 আর 102। এবার ${action} ঠিক করবে এদের কী হবে।`,
        outcome.explain,
    ];

    return (
        <Panel
            label='Interactive'
            title='একটা DELETE, ধাপে ধাপে, আপনার বাছাই করা নিয়মে'
            footer='শেষ ধাপের প্রতিটা ফলাফল PostgreSQL 18 এ একই Script পাঁচবার চালিয়ে নেওয়া, শুধু ON DELETE এর পরের শব্দটা বদলে। এই লেসনের ON DELETE অংশের Query বক্সগুলোতে প্রতিটা নিয়ম নিজে চালিয়ে দেখতে পারবেন।'>
            <div className='flex flex-wrap items-center gap-2 mb-3' role='group' aria-label='ON DELETE এর নিয়ম'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>ON DELETE</span>
                {ACTIONS.map(a => (
                    <button
                        key={a}
                        type='button'
                        data-action-choice={a}
                        aria-pressed={action === a}
                        onClick={() => {
                            setAction(a);
                            setStep(0);
                        }}
                        className={cn(BTN, 'font-mono', action === a ? BTN_ON : BTN_OFF)}>
                        {a}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-5' role='group' aria-label='ধাপ'>
                {STEPS.map((s, i) => (
                    <button
                        key={s}
                        type='button'
                        data-step={i}
                        aria-pressed={step === i}
                        onClick={() => setStep(i)}
                        className={cn(BTN, step === i ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}. {s}
                    </button>
                ))}
                <button
                    type='button'
                    data-action='next'
                    disabled={step === STEPS.length - 1}
                    onClick={() => setStep(v => Math.min(STEPS.length - 1, v + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
            </div>

            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed mb-5'>
                <span className='block text-muted-foreground'>
                    hotel_id integer DEFAULT 0 REFERENCES fk_hotels (hotel_id) ON DELETE{' '}
                    <span className='text-primary font-bold'>{action}</span>
                </span>
                <span className={cn('block mt-1', step >= 1 ? 'text-primary' : 'text-muted-foreground/60')}>
                    DELETE FROM fk_hotels WHERE hotel_id = 1;
                </span>
                {step === 3 && (
                    <span className={cn('block whitespace-pre-wrap mt-1', outcome.error ? 'text-destructive' : 'text-foreground')}>
                        {outcome.output}
                    </span>
                )}
            </pre>

            <motion.p
                key={`${action}-${step}`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                data-step-text={step}
                data-outcome={step === 3 ? (outcome.error ? 'error' : 'done') : 'pending'}
                className={cn('text-sm leading-relaxed mb-5', finalError ? 'text-destructive' : 'text-foreground')}>
                {stepText[step]}
            </motion.p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <MiniTable name='fk_hotels (Parent)' columns={['hotel_id', 'name']} rows={hotelRows} />
                <MiniTable name='fk_rooms (Child)' columns={['room_id', 'hotel_id', 'label']} rows={roomRows} />
            </div>
        </Panel>
    );
}
