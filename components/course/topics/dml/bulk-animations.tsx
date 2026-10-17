'use client';

import { EASE } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
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

/** A stored value: SQL NULL, an empty string, or text. */
type Cell = { kind: 'null' } | { kind: 'empty' } | { kind: 'text'; value: string };

function CellView({ cell }: { cell: Cell }) {
    if (cell.kind === 'null') {
        return <span className='font-mono text-[0.6875rem] italic text-primary'>NULL</span>;
    }
    if (cell.kind === 'empty') {
        return <span className='font-mono text-[0.6875rem] text-foreground/80'>&apos;&apos; (ফাঁকা লেখা)</span>;
    }
    return <span className='font-mono text-[0.6875rem] text-foreground/90'>{cell.value}</span>;
}

/* ------------------------------------------------------------------------- */
/* 1. একটা CSV, তিনটা সুইচ                                                       */
/* ------------------------------------------------------------------------- */

/** How the phone field is written on each line, which decides what the NULL options do with it. */
type PhoneShape = 'text' | 'unquoted-empty' | 'quoted-empty' | 'na';

interface LabLine {
    line: number;
    raw: string;
    name: string;
    phone: PhoneShape;
    phoneText?: string;
    seats: string;
    note: string;
}

const LINES: LabLine[] = [
    {
        line: 2,
        raw: '"Rahman, Abdur",+8801000000501,2',
        name: 'Rahman, Abdur',
        phone: 'text',
        phoneText: '+8801000000501',
        seats: '2',
        note: 'নামের ভেতরে কমা, তাই নামটা Quote এর ভেতরে। Quote এর ভেতরের কমা Field ভাঙে না।',
    },
    {
        line: 3,
        raw: '"The ""Sea"" Team",,3',
        name: 'The "Sea" Team',
        phone: 'unquoted-empty',
        seats: '3',
        note: '"" মানে নামের ভেতরের একটা ", আর phone এর ঘর Quote ছাড়া একদম ফাঁকা।',
    },
    {
        line: 4,
        raw: 'Rina Akter,"",1',
        name: 'Rina Akter',
        phone: 'quoted-empty',
        seats: '1',
        note: 'phone এর ঘরে Quote আছে, ভেতরে কিছু নেই।',
    },
    {
        line: 5,
        raw: 'Jamal Uddin,NA,2',
        name: 'Jamal Uddin',
        phone: 'na',
        seats: '2',
        note: 'phone এর জায়গায় দুটো অক্ষর: NA।',
    },
    {
        line: 6,
        raw: 'Sumi Das,+8801000000506,two',
        name: 'Sumi Das',
        phone: 'text',
        phoneText: '+8801000000506',
        seats: 'two',
        note: 'seats একটা smallint Column, কিন্তু এখানে লেখা two।',
    },
];

/**
 * The phone value PostgreSQL 18 stored for each shape under each option pair.
 * Every entry was read back from a real COPY of this exact file.
 */
function phoneResult(line: LabLine, nullNa: boolean, forceNull: boolean): Cell {
    switch (line.phone) {
        case 'text':
            return { kind: 'text', value: line.phoneText ?? '' };
        case 'unquoted-empty':
            // An unquoted empty field is the null string only while the null string is empty.
            return nullNa ? { kind: 'empty' } : { kind: 'null' };
        case 'quoted-empty':
            // FORCE_NULL matches a quoted value against the null string, which is '' only by default.
            return forceNull && !nullNa ? { kind: 'null' } : { kind: 'empty' };
        case 'na':
            return nullNa ? { kind: 'null' } : { kind: 'text', value: 'NA' };
    }
}

export function CsvParserLab() {
    const reduce = useReducedMotion();
    const [nullNa, setNullNa] = useState(false);
    const [forceNull, setForceNull] = useState(false);
    const [ignore, setIgnore] = useState(false);
    const [picked, setPicked] = useState(3);

    const options = ['FORMAT csv', 'HEADER'];
    if (nullNa) options.push("NULL 'NA'");
    if (forceNull) options.push('FORCE_NULL (phone)');
    if (ignore) options.push('ON_ERROR ignore');
    const sql = `COPY bulk_lab (name, phone, seats) FROM '/tmp/lab.csv' WITH (${options.join(', ')});`;
    const current = LINES.find(l => l.line === picked) ?? LINES[0];

    const toggles: { label: string; on: boolean; flip: () => void; data: string }[] = [
        { label: "NULL 'NA'", on: nullNa, flip: () => setNullNa(v => !v), data: 'null-na' },
        { label: 'FORCE_NULL (phone)', on: forceNull, flip: () => setForceNull(v => !v), data: 'force-null' },
        { label: 'ON_ERROR ignore', on: ignore, flip: () => setIgnore(v => !v), data: 'on-error' },
    ];

    return (
        <Panel
            label='Interactive'
            title='একটা CSV, তিনটা সুইচ'
            footer={
                <>
                    File টা আর প্রতিটা ফলাফল আমাদের PostgreSQL 18 এ আটটা আলাদা COPY চালিয়ে নেওয়া, তিন সুইচের প্রতিটা জোড়ার জন্য একটা।
                    খেয়াল করার মতো একটা: NULL &apos;NA&apos; আর FORCE_NULL একসাথে দিলে Rina র Quote সহ ফাঁকা ঘর NULL হয় না, কারণ FORCE_NULL মেলায়
                    NULL এর লেখার সাথে, আর সেই লেখা তখন NA।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                {toggles.map(t => (
                    <button
                        key={t.label}
                        type='button'
                        data-toggle={t.data}
                        aria-pressed={t.on}
                        onClick={t.flip}
                        className={cn(BTN, t.on ? BTN_ON : BTN_OFF, 'font-mono')}>
                        {t.on ? '✓ ' : ''}
                        {t.label}
                    </button>
                ))}
            </div>
            <pre className='mb-6 overflow-x-auto border border-border bg-muted/30 px-3 py-2 font-mono text-[0.6875rem] text-foreground/90'>
                {sql}
            </pre>

            <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6'>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                        lab.csv, একটা লাইন বেছে নিন
                    </p>
                    <div className='border border-border font-mono text-[0.6875rem]'>
                        <div className='flex gap-3 border-b border-border/60 bg-muted/20 px-3 py-1.5 text-muted-foreground'>
                            <span className='w-4 text-right'>1</span>
                            <span>name,phone,seats</span>
                        </div>
                        {LINES.map(l => (
                            <button
                                key={l.line}
                                type='button'
                                data-line={l.line}
                                onClick={() => setPicked(l.line)}
                                className={cn(
                                    'flex w-full gap-3 border-b border-border/60 px-3 py-1.5 text-left last:border-b-0 transition-colors',
                                    picked === l.line ? 'bg-primary/10 text-primary' : 'hover:bg-muted/30 text-foreground/90'
                                )}>
                                <span className='w-4 shrink-0 text-right text-muted-foreground'>{l.line}</span>
                                <span className='whitespace-pre'>{l.raw}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={`${picked}-${nullNa}-${forceNull}-${ignore}`}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className='border border-border p-4'>
                    <p className='mb-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                        লাইন {current.line} এর তিনটা Field
                    </p>
                    <dl className='grid grid-cols-[5rem_minmax(0,1fr)] gap-y-2 text-[0.75rem]'>
                        <dt className='font-mono text-muted-foreground'>name</dt>
                        <dd>
                            <CellView cell={{ kind: 'text', value: current.name }} />
                        </dd>
                        <dt className='font-mono text-muted-foreground'>phone</dt>
                        <dd>
                            <CellView cell={phoneResult(current, nullNa, forceNull)} />
                        </dd>
                        <dt className='font-mono text-muted-foreground'>seats</dt>
                        <dd className='font-mono text-[0.6875rem]'>
                            {current.seats === 'two' ? <span className='text-destructive'>two (smallint হয় না)</span> : current.seats}
                        </dd>
                    </dl>
                    <p className='mt-3 text-[0.75rem] leading-relaxed text-muted-foreground'>{current.note}</p>
                </motion.div>
            </div>

            <div className='mt-6 border border-border'>
                <div className='flex flex-wrap items-baseline justify-between gap-2 border-b border-border bg-muted/20 px-3 py-2'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground'>
                        Table এ যা পৌঁছাল
                    </span>
                    <span
                        data-lab-result={ignore ? 'copied' : 'error'}
                        className={cn('font-mono text-[0.6875rem] font-bold', ignore ? 'text-primary' : 'text-destructive')}>
                        {ignore ? 'NOTICE: 1 row was skipped ... COPY 4' : 'ERROR 22P02: line 6, column seats: "two"'}
                    </span>
                </div>
                {ignore ? (
                    <table className='w-full border-collapse text-[0.75rem]'>
                        <tbody>
                            {LINES.filter(l => l.seats !== 'two').map(l => (
                                <tr key={l.line} className='border-b border-border/60 last:border-b-0'>
                                    <td className='px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground'>{l.line}</td>
                                    <td className='px-3 py-1.5'>
                                        <CellView cell={{ kind: 'text', value: l.name }} />
                                    </td>
                                    <td className='px-3 py-1.5'>
                                        <CellView cell={phoneResult(l, nullNa, forceNull)} />
                                    </td>
                                    <td className='px-3 py-1.5 font-mono text-[0.6875rem]'>{l.seats}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='px-3 py-3 text-[0.75rem] leading-relaxed text-muted-foreground'>
                        লাইন 6 এ two পেয়ে COPY থেমেছে, আর আগের চারটা লাইনও বাতিল। Table এ 0 Row। NULL এর সুইচগুলো বদলালেও কিছু বদলাবে না, যতক্ষণ
                        ON_ERROR ignore চালু না করছেন।
                    </p>
                )}
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. রাতের Import, ধাপে ধাপে                                                     */
/* ------------------------------------------------------------------------- */

type Fate = 'waiting' | 'ok' | 'rejected';

interface StagedLine {
    line: number;
    ref: string;
    rawEmail: string;
    email: string;
    tour: string;
    seats: string;
    /** The stage at which this line stops, with the verdict the query box gives it. */
    stopAt?: number;
    verdict?: string;
    customerId?: number;
    departureId?: number;
}

/** The eight lines of the agency file and the verdicts the query boxes in this lesson return. */
const STAGED: StagedLine[] = [
    { line: 2, ref: 'HT-1001', rawEmail: 'rahim.uddin@mail.example', email: 'rahim.uddin@mail.example', tour: 'Saint Martin Island Escape', seats: '2', customerId: 1, departureId: 8 },
    { line: 3, ref: 'HT-1002', rawEmail: ' Nusrat.Jahan@mail.example ', email: 'nusrat.jahan@mail.example', tour: "Cox's Bazar Beach Weekend", seats: '3', customerId: 2, departureId: 10 },
    { line: 4, ref: 'HT-1003', rawEmail: 'lamia.haque@mail.example', email: 'lamia.haque@mail.example', tour: 'Sylhet Tea Garden Tour', seats: 'two', stopAt: 4, verdict: 'seats is not a number' },
    { line: 5, ref: 'HT-1004', rawEmail: 'shuvo.das@mail.example', email: 'shuvo.das@mail.example', tour: 'Sundarbans Mangrove Cruise', seats: '1', customerId: 13, departureId: 11 },
    { line: 6, ref: 'HT-1005', rawEmail: 'unknown.person@mail.example', email: 'unknown.person@mail.example', tour: 'Sajek Valley Cloud Trip', seats: '2', stopAt: 5, verdict: 'unknown customer' },
    { line: 7, ref: 'HT-1006', rawEmail: 'kamal.hasan@mail.example', email: 'kamal.hasan@mail.example', tour: 'Kuakata Sunset Tour', seats: '2', customerId: 12, stopAt: 6, verdict: 'unknown departure' },
    { line: 8, ref: 'HT-1002', rawEmail: ' Nusrat.Jahan@mail.example ', email: 'nusrat.jahan@mail.example', tour: "Cox's Bazar Beach Weekend", seats: '3', stopAt: 3, verdict: 'duplicate of line 3' },
    { line: 9, ref: 'HT-1007', rawEmail: 'imran.kabir@mail.example', email: 'imran.kabir@mail.example', tour: 'Ratargul Swamp Boat Day', seats: '4', customerId: 15, departureId: 15 },
];

const STAGES: { title: string; sql: string; text: string }[] = [
    {
        title: 'File',
        sql: 'agent-2026-11-01.csv',
        text: 'রাত এগারোটায় Agency র File এল: Header এর পরে আটটা লাইন। এখনো Database এ কিছু নেই।',
    },
    {
        title: 'Staging',
        sql: 'COPY bulk_agent_staging (...) FROM ... WITH (FORMAT csv, HEADER);',
        text: 'সব Column text, তাই আটটা লাইনই ঢুকল, two সহ। line_no হলো File এর লাইন নম্বর, 2 থেকে 9।',
    },
    {
        title: 'পরিষ্কার',
        sql: 'lower(trim(customer_email))',
        text: 'Email এর দুই পাশের ফাঁকা গেল, সব ছোট হাতের। লাইন 3 আর 8 এর Email বদলাল।',
    },
    {
        title: 'নকল',
        sql: 'min(line_no) OVER (PARTITION BY agent_ref)',
        text: 'HT-1002 প্রথম এসেছিল লাইন 3 এ, তাই লাইন 8 নকল। এখানেই থামল।',
    },
    {
        title: 'seats',
        sql: "pg_input_is_valid(seats, 'smallint')",
        text: 'লাইন 4 এর two কোনো smallint না। Cast না করেই ধরা পড়ল, কোনো Error ছাড়া।',
    },
    {
        title: 'Customer',
        sql: 'LEFT JOIN customers c ON c.email = ...',
        text: 'লাইন 6 এর Email এর কোনো Customer নেই। বাকিরা customer_id পেল।',
    },
    {
        title: 'Departure',
        sql: 'LEFT JOIN tours, departures ON title, starts_on',
        text: 'লাইন 7 এর Kuakata Sunset Tour বলে কোনো ট্যুর নেই। বাকিরা departure_id পেল।',
    },
    {
        title: 'সরানো',
        sql: "INSERT ... WHERE verdict = 'ok'; INSERT INTO rejects ...; TRUNCATE staging;",
        text: 'চারটা ok লাইন bookings এ, চারটা Rejects এ কারণসহ। 4 আর 4 মিলে আট, কিছু হারায়নি। Staging খালি।',
    },
];

function fateAt(l: StagedLine, stage: number): Fate {
    if (l.stopAt !== undefined && stage >= l.stopAt) return 'rejected';
    if (stage >= 7) return 'ok';
    return 'waiting';
}

export function StagingFlowLab() {
    const reduce = useReducedMotion();
    const [stage, setStage] = useState(0);
    const info = STAGES[stage];
    const loaded = stage >= 7 ? STAGED.filter(l => l.stopAt === undefined).length : 0;
    const rejected = STAGED.filter(l => fateAt(l, stage) === 'rejected').length;

    return (
        <Panel
            label='Interactive'
            title='রাতের Import, ধাপে ধাপে'
            footer={
                <>
                    লাইন আর রায়গুলো এই লেসনের বক্সের হুবহু, একই Agency File থেকে। আসল Query তে সব প্রশ্ন একবারে একটা CASE এ হয়, আর প্রথম যে প্রশ্নে
                    লাইনটা আটকায়, সেটাই তার কারণ। এখানে প্রশ্নগুলো আলাদা ধাপে ভাগ করা, যাতে দেখা যায় কোন লাইন কোথায় থামে।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                {STAGES.map((s, i) => (
                    <button
                        key={s.title}
                        type='button'
                        data-stage={i}
                        onClick={() => setStage(i)}
                        className={cn(BTN, stage === i ? BTN_ON : BTN_OFF)}>
                        {i}. {s.title}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-4'>
                <button
                    type='button'
                    data-step='back'
                    disabled={stage === 0}
                    onClick={() => setStage(s => Math.max(0, s - 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    আগের ধাপ
                </button>
                <button
                    type='button'
                    data-step='next'
                    disabled={stage === STAGES.length - 1}
                    onClick={() => setStage(s => Math.min(STAGES.length - 1, s + 1))}
                    className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground' data-staging-count>
                    bookings {loaded} · rejects {rejected}
                </span>
            </div>

            <motion.div
                key={stage}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
                className='mb-4 border border-border bg-muted/20 px-4 py-3'>
                <pre className='mb-2 overflow-x-auto font-mono text-[0.6875rem] text-primary'>{info.sql}</pre>
                <p className='text-[0.8125rem] leading-relaxed text-foreground/90'>{info.text}</p>
            </motion.div>

            <div className='overflow-x-auto border border-border'>
                <table className='w-full min-w-[40rem] border-collapse text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/30 text-left font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground'>
                            <th className='px-3 py-2'>line</th>
                            <th className='px-3 py-2'>agent_ref</th>
                            <th className='px-3 py-2'>email</th>
                            <th className='px-3 py-2'>ids</th>
                            <th className='px-3 py-2'>কী হলো</th>
                        </tr>
                    </thead>
                    <tbody>
                        {STAGED.map(l => {
                            const fate = fateAt(l, stage);
                            const inDb = stage >= 1;
                            const cleaned = stage >= 2;
                            const showCustomer = stage >= 5 && l.customerId !== undefined && (l.stopAt === undefined || l.stopAt > 5);
                            const showDeparture = stage >= 6 && l.departureId !== undefined && l.stopAt === undefined;
                            return (
                                <tr
                                    key={l.line}
                                    data-fate={fate}
                                    className={cn(
                                        'border-b border-border/60 last:border-b-0 transition-colors duration-300',
                                        fate === 'rejected' && 'bg-destructive/5',
                                        fate === 'ok' && 'bg-primary/10'
                                    )}>
                                    <td className='px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground'>{inDb ? l.line : ''}</td>
                                    <td className='px-3 py-1.5 font-mono text-[0.6875rem]'>{l.ref}</td>
                                    <td className='px-3 py-1.5 font-mono text-[0.6875rem] whitespace-pre'>
                                        {cleaned ? l.email : `[${l.rawEmail}]`}
                                    </td>
                                    <td className='px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground'>
                                        {showCustomer ? `c ${l.customerId}` : ''}
                                        {showDeparture ? `, d ${l.departureId}` : ''}
                                    </td>
                                    <td className='px-3 py-1.5'>
                                        {fate === 'rejected' && <span className='font-mono text-[0.6875rem] text-destructive'>{l.verdict}</span>}
                                        {fate === 'ok' && <span className='font-mono text-[0.6875rem] font-bold text-primary'>ok, bookings এ</span>}
                                        {fate === 'waiting' && (
                                            <span className='text-[0.6875rem] text-muted-foreground'>{inDb ? 'এগোচ্ছে' : 'File এ'}</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}
