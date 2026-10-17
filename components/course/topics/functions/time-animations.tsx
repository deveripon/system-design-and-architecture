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
/* 1. একটা মুহূর্ত, পাঁচ দেশের ঘড়ি                                               */
/* ------------------------------------------------------------------------- */

const ZONES = ['Asia/Dhaka', 'UTC', 'Europe/London', 'Asia/Kolkata', 'Asia/Kuala_Lumpur'] as const;
type Zone = (typeof ZONES)[number];

// Every wall clock below was produced by PostgreSQL 18 with
// to_char(at AT TIME ZONE zone, 'YYYY-MM-DD HH24:MI'), not computed here.
const INSTANTS: {
    id: string;
    label: string;
    stored: string;
    note: string;
    walls: Record<Zone, { wall: string; offset: string }>;
}[] = [
    {
        id: 'b1',
        label: 'Booking 1, শীতকাল',
        stored: "TIMESTAMPTZ '2025-12-20 10:15+06'",
        note: 'ডিসেম্বরে London এর ঘড়ি আর UTC একই, তাই দুটো ঘড়ি একই সময় দেখায়।',
        walls: {
            'Asia/Dhaka': { wall: '2025-12-20 10:15', offset: '+06:00' },
            UTC: { wall: '2025-12-20 04:15', offset: '+00:00' },
            'Europe/London': { wall: '2025-12-20 04:15', offset: '+00:00' },
            'Asia/Kolkata': { wall: '2025-12-20 09:45', offset: '+05:30' },
            'Asia/Kuala_Lumpur': { wall: '2025-12-20 12:15', offset: '+08:00' },
        },
    },
    {
        id: 'b19',
        label: 'Booking 19, অক্টোবরের শুরু',
        stored: "TIMESTAMPTZ '2026-10-04 13:40+06'",
        note: 'অক্টোবরের শেষ রবিবার পর্যন্ত London গ্রীষ্মকালীন সময়ে চলে, তখন UTC থেকে এক ঘণ্টা এগিয়ে। তাই এখানে London আর UTC আলাদা।',
        walls: {
            'Asia/Dhaka': { wall: '2026-10-04 13:40', offset: '+06:00' },
            UTC: { wall: '2026-10-04 07:40', offset: '+00:00' },
            'Europe/London': { wall: '2026-10-04 08:40', offset: '+01:00' },
            'Asia/Kolkata': { wall: '2026-10-04 13:10', offset: '+05:30' },
            'Asia/Kuala_Lumpur': { wall: '2026-10-04 15:40', offset: '+08:00' },
        },
    },
    {
        id: 'late',
        label: 'রাত ১টা ১৫, Dhaka',
        stored: "TIMESTAMPTZ '2026-11-02 01:15+06'",
        note: 'Dhaka তে তারিখ 2 নভেম্বর, কিন্তু UTC আর London এ তখনো 1 নভেম্বর সন্ধ্যা। একই মুহূর্ত, দুটো আলাদা তারিখ।',
        walls: {
            'Asia/Dhaka': { wall: '2026-11-02 01:15', offset: '+06:00' },
            UTC: { wall: '2026-11-01 19:15', offset: '+00:00' },
            'Europe/London': { wall: '2026-11-01 19:15', offset: '+00:00' },
            'Asia/Kolkata': { wall: '2026-11-02 00:45', offset: '+05:30' },
            'Asia/Kuala_Lumpur': { wall: '2026-11-02 03:15', offset: '+08:00' },
        },
    },
];

/**
 * Pick one stored instant and a viewer's time zone. The stored value never
 * changes; only the wall clock printed for each zone does.
 */
export function TimeZoneLab() {
    const reduce = useReducedMotion();
    const [instantId, setInstantId] = useState(INSTANTS[0].id);
    const [zone, setZone] = useState<Zone>('Asia/Dhaka');
    const instant = INSTANTS.find(i => i.id === instantId) ?? INSTANTS[0];
    const dhakaDate = instant.walls['Asia/Dhaka'].wall.slice(0, 10);

    return (
        <Panel
            label='Interactive'
            title='একটা মুহূর্ত, পাঁচ দেশের ঘড়ি'
            footer='প্রতিটা ঘড়ির সময় PostgreSQL 18 এ AT TIME ZONE দিয়ে বের করা, এখানে আন্দাজ করা না। যে দেশের তারিখ Dhaka থেকে আলাদা, সেটা আলাদা রঙে দেখাচ্ছে।'>
            <div className='flex flex-wrap gap-2 mb-4'>
                {INSTANTS.map(i => (
                    <button
                        key={i.id}
                        type='button'
                        data-instant={i.id}
                        onClick={() => setInstantId(i.id)}
                        className={cn(BTN, i.id === instantId ? BTN_ON : BTN_OFF)}>
                        {i.label}
                    </button>
                ))}
            </div>
            <div className='mb-6 border border-primary/50 bg-primary/5 px-4 py-3 font-mono text-[0.75rem] text-foreground'>
                <span className='text-muted-foreground'>Database এ রাখা: </span>
                {instant.stored}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3' data-active-instant={instant.id}>
                {ZONES.map(z => {
                    const w = instant.walls[z];
                    const otherDate = w.wall.slice(0, 10) !== dhakaDate;
                    const active = z === zone;
                    return (
                        <button
                            key={z}
                            type='button'
                            data-zone={z}
                            onClick={() => setZone(z)}
                            className={cn(
                                'border p-3 text-left transition-colors',
                                active ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                            )}>
                            <span className='block font-mono text-[0.625rem] font-bold text-muted-foreground'>{z}</span>
                            <motion.span
                                key={`${instant.id}-${z}`}
                                initial={reduce ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className={cn(
                                    'mt-1 block font-mono text-[0.8125rem] font-bold',
                                    otherDate ? 'text-primary' : 'text-foreground'
                                )}>
                                {w.wall}
                            </motion.span>
                            <span className='block font-mono text-[0.625rem] text-muted-foreground'>UTC {w.offset}</span>
                        </button>
                    );
                })}
            </div>
            <div className='mt-6 border border-border bg-background px-4 py-3'>
                <p className='font-mono text-[0.75rem] text-foreground' data-query>
                    SET TIME ZONE &apos;{zone}&apos;; SELECT booked_at ...
                </p>
                <p className='mt-1 font-mono text-[0.75rem] text-primary'>
                    {instant.walls[zone].wall}:00{instant.walls[zone].offset === '+05:30' ? '+05:30' : instant.walls[zone].offset.slice(0, 3)}
                </p>
                <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{instant.note}</p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. date_trunc আর extract হাতে কলমে                                            */
/* ------------------------------------------------------------------------- */

const UNITS = ['year', 'quarter', 'month', 'week', 'day', 'hour'] as const;
type Unit = (typeof UNITS)[number];

// Values from PostgreSQL 18 with TimeZone = 'Asia/Dhaka'.
const STAMPS: {
    id: string;
    label: string;
    at: string;
    trunc: Record<Unit, string>;
    fields: { name: string; value: string }[];
}[] = [
    {
        id: 'b1',
        label: 'Booking 1',
        at: '2025-12-20 10:15',
        trunc: {
            year: '2025-01-01 00:00',
            quarter: '2025-10-01 00:00',
            month: '2025-12-01 00:00',
            week: '2025-12-15 00:00',
            day: '2025-12-20 00:00',
            hour: '2025-12-20 10:00',
        },
        fields: [
            { name: 'year', value: '2025' },
            { name: 'quarter', value: '4' },
            { name: 'month', value: '12' },
            { name: 'week', value: '51' },
            { name: 'day', value: '20' },
            { name: 'isodow', value: '6' },
            { name: 'doy', value: '354' },
            { name: 'hour', value: '10' },
        ],
    },
    {
        id: 'b13',
        label: 'Booking 13',
        at: '2026-09-15 21:10',
        trunc: {
            year: '2026-01-01 00:00',
            quarter: '2026-07-01 00:00',
            month: '2026-09-01 00:00',
            week: '2026-09-14 00:00',
            day: '2026-09-15 00:00',
            hour: '2026-09-15 21:00',
        },
        fields: [
            { name: 'year', value: '2026' },
            { name: 'quarter', value: '3' },
            { name: 'month', value: '9' },
            { name: 'week', value: '38' },
            { name: 'day', value: '15' },
            { name: 'isodow', value: '2' },
            { name: 'doy', value: '258' },
            { name: 'hour', value: '21' },
        ],
    },
    {
        id: 'b24',
        label: 'Booking 24',
        at: '2026-10-14 11:05',
        trunc: {
            year: '2026-01-01 00:00',
            quarter: '2026-10-01 00:00',
            month: '2026-10-01 00:00',
            week: '2026-10-12 00:00',
            day: '2026-10-14 00:00',
            hour: '2026-10-14 11:00',
        },
        fields: [
            { name: 'year', value: '2026' },
            { name: 'quarter', value: '4' },
            { name: 'month', value: '10' },
            { name: 'week', value: '42' },
            { name: 'day', value: '14' },
            { name: 'isodow', value: '3' },
            { name: 'doy', value: '287' },
            { name: 'hour', value: '11' },
        ],
    },
];

const UNIT_NOTE: Record<Unit, string> = {
    year: 'বছরের প্রথম দিন, মাঝরাত।',
    quarter: 'তিন মাসের ভাগের প্রথম দিন: জানুয়ারি, এপ্রিল, জুলাই বা অক্টোবর।',
    month: 'মাসের প্রথম দিন, মাঝরাত। মাসিক Report এর মূল চাবি।',
    week: 'সেই সপ্তাহের সোমবার। PostgreSQL ISO নিয়ম মানে, তাই সপ্তাহ শুরু সোমবারে, শনি বা রবিবারে না।',
    day: 'সেই দিনের মাঝরাত। কোন দিনে, সেটা ঠিক করে Session এর TimeZone।',
    hour: 'ঘণ্টার শুরু, মিনিট আর সেকেন্ড শূন্য।',
};

/** Pick a real booking time and a unit; see where date_trunc snaps and what extract reads. */
export function DateTruncLab() {
    const [stampId, setStampId] = useState(STAMPS[1].id);
    const [unit, setUnit] = useState<Unit>('month');
    const stamp = STAMPS.find(s => s.id === stampId) ?? STAMPS[1];

    return (
        <Panel
            label='Interactive'
            title='date_trunc কোথায় কাটে, extract কী পড়ে'
            footer='সব মান PostgreSQL 18 এ TimeZone Asia/Dhaka রেখে বের করা। week এর সংখ্যা ISO নিয়মে, isodow এ সোমবার 1 আর রবিবার 7।'>
            <div className='flex flex-wrap gap-2 mb-3'>
                {STAMPS.map(s => (
                    <button
                        key={s.id}
                        type='button'
                        data-stamp={s.id}
                        onClick={() => setStampId(s.id)}
                        className={cn(BTN, s.id === stampId ? BTN_ON : BTN_OFF)}>
                        {s.label}: {s.at}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
                {UNITS.map(u => (
                    <button
                        key={u}
                        type='button'
                        data-unit={u}
                        onClick={() => setUnit(u)}
                        className={cn(BTN, 'font-mono', u === unit ? BTN_ON : BTN_OFF)}>
                        {u}
                    </button>
                ))}
            </div>
            <div className='border border-border bg-background px-4 py-3 font-mono text-[0.75rem]'>
                <p className='text-muted-foreground'>
                    date_trunc(&apos;{unit}&apos;, TIMESTAMPTZ &apos;{stamp.at}+06&apos;)
                </p>
                <p className='mt-1 text-primary font-bold' data-truncated>
                    {stamp.trunc[unit]}:00+06
                </p>
            </div>
            <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{UNIT_NOTE[unit]}</p>
            <div className='mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2'>
                {stamp.fields.map(f => (
                    <div key={f.name} className='border border-border p-2'>
                        <span className='block font-mono text-[0.625rem] text-muted-foreground'>
                            extract({f.name})
                        </span>
                        <span className='block font-mono text-[0.8125rem] font-bold text-foreground'>{f.value}</span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. মাসের হিসাবের ফাঁদ: আগে আন্দাজ, তারপর উত্তর                               */
/* ------------------------------------------------------------------------- */

const CASES = [
    {
        id: 'jan31',
        expr: "DATE '2026-01-31' + INTERVAL '1 month'",
        guess: ['2026-02-31', '2026-02-28 00:00:00', '2026-03-03 00:00:00'],
        answer: '2026-02-28 00:00:00',
        why: 'ফেব্রুয়ারিতে ৩১ তারিখ নেই। PostgreSQL মাস এক ঘর এগিয়ে দিন যদি না মেলে, সেই মাসের শেষ দিনে থামে।',
    },
    {
        id: 'two-steps',
        expr: "DATE '2026-01-31' + INTERVAL '1 month' + INTERVAL '1 month'",
        guess: ['2026-03-31 00:00:00', '2026-03-28 00:00:00', '2026-03-03 00:00:00'],
        answer: '2026-03-28 00:00:00',
        why: 'প্রথম ধাপেই ৩১ কমে ২৮ হয়ে গেছে। দ্বিতীয় ধাপ শুরু হয় ২৮ ফেব্রুয়ারি থেকে, তাই পৌঁছায় ২৮ মার্চে।',
    },
    {
        id: 'one-step',
        expr: "DATE '2026-01-31' + INTERVAL '2 months'",
        guess: ['2026-03-31 00:00:00', '2026-03-28 00:00:00', '2026-04-02 00:00:00'],
        answer: '2026-03-31 00:00:00',
        why: 'একবারে দুই মাস যোগ করলে মাঝে ফেব্রুয়ারিতে থামতে হয় না। আগের উত্তরের সাথে তুলনা করুন: একই দুই মাস, আলাদা ফলাফল।',
    },
    {
        id: 'plus30',
        expr: "DATE '2026-01-31' + 30",
        guess: ['2026-02-28', '2026-03-02', '2026-03-01'],
        answer: '2026-03-02',
        why: 'সংখ্যা যোগ মানে ঠিক ততগুলো দিন। ফেব্রুয়ারি 2026 এ ২৮ দিন, তাই ৩১ জানুয়ারি থেকে ৩০ দিন পরে ২ মার্চ। এক মাস আর ৩০ দিন এক জিনিস না।',
    },
    {
        id: 'leap',
        expr: "DATE '2028-02-29' + INTERVAL '1 year'",
        guess: ['2029-02-29 00:00:00', '2029-03-01 00:00:00', '2029-02-28 00:00:00'],
        answer: '2029-02-28 00:00:00',
        why: '2029 লিপ ইয়ার না, ফেব্রুয়ারিতে ২৯ নেই। আবারো মাসের শেষ দিনে থামা।',
    },
    {
        id: 'london-day',
        expr: "SET TIME ZONE 'Europe/London';\nTIMESTAMPTZ '2026-10-24 12:00+00' + INTERVAL '1 day'",
        guess: ['2026-10-25 12:00:00+00', '2026-10-25 13:00:00+00', '2026-10-25 11:00:00+00'],
        answer: '2026-10-25 13:00:00+00',
        why: '25 অক্টোবর 2026 এ London ঘড়ি এক ঘণ্টা পিছিয়ে নেয়। "এক দিন পর" মানে পরের দিন একই ঘড়ির সময়, দুপুর ১টা। সেই দিনটা ২৫ ঘণ্টার। INTERVAL \'24 hours\' দিলে উত্তর আসত দুপুর ১২টা।',
    },
];

/** Predict the result of a date calculation with months, then reveal what PostgreSQL says. */
export function MonthMathLab() {
    const [caseId, setCaseId] = useState(CASES[0].id);
    const [picked, setPicked] = useState<Record<string, string>>({});
    const current = CASES.find(c => c.id === caseId) ?? CASES[0];
    const choice = picked[current.id];
    const score = CASES.filter(c => picked[c.id] === c.answer).length;

    return (
        <Panel
            label='Interactive'
            title='আগে আন্দাজ করুন, তারপর PostgreSQL এর উত্তর'
            footer={`সঠিক আন্দাজ: ${toBn(score)} / ${toBn(CASES.length)}। প্রতিটা উত্তর PostgreSQL 18 এ চালিয়ে পাওয়া।`}>
            <div className='flex flex-wrap gap-2 mb-6'>
                {CASES.map((c, i) => (
                    <button
                        key={c.id}
                        type='button'
                        data-case={c.id}
                        onClick={() => setCaseId(c.id)}
                        className={cn(BTN, c.id === caseId ? BTN_ON : BTN_OFF)}>
                        {toBn(i + 1)}
                        {picked[c.id] ? (picked[c.id] === c.answer ? ' ✓' : ' ✗') : ''}
                    </button>
                ))}
            </div>
            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] text-foreground whitespace-pre-wrap'>
                {current.expr}
            </pre>
            <div className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2'>
                {current.guess.map(g => {
                    const isPicked = choice === g;
                    const isAnswer = g === current.answer;
                    return (
                        <button
                            key={g}
                            type='button'
                            data-guess={g}
                            disabled={Boolean(choice)}
                            onClick={() => setPicked(prev => ({ ...prev, [current.id]: g }))}
                            className={cn(
                                'border px-3 py-2 font-mono text-[0.75rem] text-left transition-colors disabled:cursor-default',
                                !choice && 'border-border hover:border-primary/50',
                                choice && isAnswer && 'border-primary bg-primary/10 text-primary',
                                choice && isPicked && !isAnswer && 'border-destructive/60 bg-destructive/5 text-destructive',
                                choice && !isPicked && !isAnswer && 'border-border text-muted-foreground'
                            )}>
                            {g}
                        </button>
                    );
                })}
            </div>
            {choice && (
                <p className='mt-4 text-sm leading-relaxed text-muted-foreground' data-verdict={choice === current.answer ? 'right' : 'wrong'}>
                    <strong className='text-foreground'>{choice === current.answer ? 'ঠিক ধরেছেন। ' : 'এবার মেলেনি। '}</strong>
                    {current.why}
                </p>
            )}
        </Panel>
    );
}
