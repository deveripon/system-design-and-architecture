'use client';

import { EASE } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
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
const GROUP_LABEL = 'font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1';

/* ------------------------------------------------------------------------- */
/* 1. এক লেখা, পাঁচ রকম Column                                                   */
/* ------------------------------------------------------------------------- */

type InputKey = 'A' | 'B' | 'C';
type ColumnType = 'date' | 'time' | 'timestamp' | 'timestamptz' | 'timestamptz(0)';
type Zone = 'Asia/Dhaka' | 'UTC' | 'America/New_York';

const INPUTS: { key: InputKey; literal: string; about: string }[] = [
    { key: 'A', literal: '2026-11-01 10:00:00.5+06', about: 'ঢাকার রবিবার সকাল, আধা সেকেন্ড সহ' },
    { key: 'B', literal: '2026-10-31 22:30:00.25+00', about: 'London এর শনিবার রাত' },
    { key: 'C', literal: '2026-11-01 23:59:59.75+06', about: 'ঢাকার মাঝরাতের ঠিক আগে' },
];

const COLUMN_TYPES: ColumnType[] = ['date', 'time', 'timestamp', 'timestamptz', 'timestamptz(0)'];
const ZONES: Zone[] = ['Asia/Dhaka', 'UTC', 'America/New_York'];

// Every value below is real PostgreSQL 18 output: the three literals inserted
// into one column of each type, then read back under each session TimeZone.
// Types without a zone print the same text whatever the session zone is.
const PLAIN: Record<'date' | 'time' | 'timestamp', Record<InputKey, string>> = {
    date: { A: '2026-11-01', B: '2026-10-31', C: '2026-11-01' },
    time: { A: '10:00:00.5', B: '22:30:00.25', C: '23:59:59.75' },
    timestamp: { A: '2026-11-01 10:00:00.5', B: '2026-10-31 22:30:00.25', C: '2026-11-01 23:59:59.75' },
};

const AWARE: Record<'timestamptz' | 'timestamptz(0)', Record<Zone, Record<InputKey, string>>> = {
    timestamptz: {
        'Asia/Dhaka': { A: '2026-11-01 10:00:00.5+06', B: '2026-11-01 04:30:00.25+06', C: '2026-11-01 23:59:59.75+06' },
        UTC: { A: '2026-11-01 04:00:00.5+00', B: '2026-10-31 22:30:00.25+00', C: '2026-11-01 17:59:59.75+00' },
        'America/New_York': { A: '2026-11-01 00:00:00.5-04', B: '2026-10-31 18:30:00.25-04', C: '2026-11-01 12:59:59.75-05' },
    },
    'timestamptz(0)': {
        'Asia/Dhaka': { A: '2026-11-01 10:00:01+06', B: '2026-11-01 04:30:00+06', C: '2026-11-02 00:00:00+06' },
        UTC: { A: '2026-11-01 04:00:01+00', B: '2026-10-31 22:30:00+00', C: '2026-11-01 18:00:00+00' },
        'America/New_York': { A: '2026-11-01 00:00:01-04', B: '2026-10-31 18:30:00-04', C: '2026-11-01 13:00:00-05' },
    },
};

function stored(type: ColumnType, input: InputKey) {
    if (type === 'timestamptz' || type === 'timestamptz(0)') {
        return `${AWARE[type].UTC[input].replace('+00', '')} UTC`;
    }
    return PLAIN[type][input];
}

function shown(type: ColumnType, input: InputKey, zone: Zone) {
    if (type === 'timestamptz' || type === 'timestamptz(0)') return AWARE[type][zone][input];
    return PLAIN[type][input];
}

function explain(type: ColumnType, input: InputKey, zone: Zone) {
    switch (type) {
        case 'date':
            return input === 'B'
                ? 'শুধু লেখার তারিখের অংশটা রইল, ঘড়ি আর +00 বাদ। খেয়াল করুন, London এর শনিবার রাত ১০টা ৩০ তখন ঢাকায় রবিবার ভোর ৪টা ৩০। কিন্তু date Column লিখেছে 2026-10-31, কারণ সে মুহূর্তের হিসাব করে না, লেখার তারিখটা তুলে নেয়।'
                : 'শুধু তারিখের অংশটা রইল। ঘড়ির সময়, সেকেন্ডের ভগ্নাংশ আর +06, তিনটাই বাদ। দেখার Zone বদলালেও কিছু বদলায় না।';
        case 'time':
            return 'শুধু ঘড়ির অংশটা রইল। কোন দিন, কোন দেশ, দুটো তথ্যই হারিয়ে গেছে। রোজকার সময়সূচির জন্য এটাই ঠিক, কোনো ঘটনার জন্য না।';
        case 'timestamp':
            return input === 'B'
                ? 'তারিখ আর ঘড়ি রইল, কিন্তু +00 চুপচাপ বাদ। এখন এই লেখা দেখে কেউ বলতে পারবে না এটা London এর রাত নাকি ঢাকার রাত। দেখার Zone বদলালেও একই লেখা, কারণ সে জানেই না সে কোন মুহূর্ত।'
                : 'তারিখ আর ঘড়ি রইল, কিন্তু +06 চুপচাপ বাদ, কোনো সতর্কবার্তা ছাড়া। দেখার Zone বদলালেও লেখা একই থাকে, কারণ এটা কোনো মুহূর্ত না, শুধু দেয়ালঘড়ির একটা লেখা।';
        case 'timestamptz':
            if (zone === 'America/New_York') {
                return input === 'C'
                    ? 'একই মুহূর্ত, New York এর ঘড়িতে। শেষে -05 কেন, -04 না? কারণ 1 November 2026 এ New York এ রাত ২টায় Daylight Saving শেষ হয়েছে। A দেখুন, সেটা রাত ১২টার মুহূর্ত, তখনও -04 চলছিল।'
                    : 'একই মুহূর্ত, New York এর ঘড়িতে। এখন শেষে -04, কারণ এই মুহূর্তে সেখানে তখনও Daylight Saving চলছে। C বেছে দেখুন, একই দিনের দুপুরে Offset -05।';
            }
            return 'ভেতরে UTC তে একটা মুহূর্ত রাখা। দেখানোর ঘড়ি বদলালে লেখা বদলায়, মুহূর্ত বদলায় না। দেখার Zone বদলে নিজে মিলিয়ে দেখুন।';
        case 'timestamptz(0)':
            return input === 'C'
                ? 'সেকেন্ডের ভগ্নাংশ কাটা হয়নি, গোল করা হয়েছে। .75 গোল হয়ে পুরো এক সেকেন্ড বেড়েছে, আর ঢাকার ঘড়িতে মুহূর্তটা পরের দিনে চলে গেছে: 2026-11-02 00:00:00। দিনভিত্তিক Report এ এটা একটা Booking কে অন্য দিনে গুনবে।'
                : input === 'A'
                  ? 'সেকেন্ডের ভগ্নাংশ গোল করা হয়েছে, কাটা না। .5 গোল হয়ে উপরের দিকে গেছে, তাই 10:00:00 না, 10:00:01।'
                  : 'সেকেন্ডের ভগ্নাংশ গোল করা হয়েছে। .25 গোল হয়ে নিচের দিকে গেছে, তাই 22:30:00। বাকি সব timestamptz এর মতোই।';
    }
}

/**
 * The reader picks one of three literals, a column type and the session time
 * zone, and sees what the column keeps and what it prints. All values are real
 * PostgreSQL 18 output, so the lab and the query boxes always agree.
 */
export function ColumnTypeLab() {
    const reduce = useReducedMotion();
    const [input, setInput] = useState<InputKey>('A');
    const [type, setType] = useState<ColumnType>('timestamp');
    const [zone, setZone] = useState<Zone>('Asia/Dhaka');
    const literal = INPUTS.find(i => i.key === input)!.literal;
    const zoneAware = type === 'timestamptz' || type === 'timestamptz(0)';

    return (
        <Panel
            label='Interactive'
            title='এক লেখা, পাঁচ রকম Column'
            footer='প্রতিটা মান PostgreSQL 18 এ তিনটা লেখা পাঁচ ধরনের Column এ ঢুকিয়ে, তিনটা আলাদা TimeZone এ পড়ে নেওয়া। নিচের Query বক্সে SET TIME ZONE দিয়ে নিজেও একই জিনিস দেখতে পাবেন।'>
            <div className='space-y-3 mb-6'>
                <div className='flex flex-wrap items-center gap-2' role='group' aria-label='কোন লেখা ঢোকানো হবে'>
                    <span className={GROUP_LABEL}>লেখা</span>
                    {INPUTS.map(i => (
                        <button
                            key={i.key}
                            type='button'
                            data-input={i.key}
                            aria-pressed={input === i.key}
                            onClick={() => setInput(i.key)}
                            className={cn(BTN, input === i.key ? BTN_ON : BTN_OFF)}>
                            <span className='font-mono'>{i.key}</span> {i.about}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2' role='group' aria-label='Column এর ধরন'>
                    <span className={GROUP_LABEL}>Column</span>
                    {COLUMN_TYPES.map(t => (
                        <button
                            key={t}
                            type='button'
                            data-type={t}
                            aria-pressed={type === t}
                            onClick={() => setType(t)}
                            className={cn(BTN, 'font-mono', type === t ? BTN_ON : BTN_OFF)}>
                            {t}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2' role='group' aria-label='কোন TimeZone থেকে দেখছেন'>
                    <span className={GROUP_LABEL}>দেখার Zone</span>
                    {ZONES.map(z => (
                        <button
                            key={z}
                            type='button'
                            data-zone={z}
                            aria-pressed={zone === z}
                            onClick={() => setZone(z)}
                            className={cn(BTN, 'font-mono', zone === z ? BTN_ON : BTN_OFF)}>
                            {z}
                        </button>
                    ))}
                </div>
            </div>

            <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90'>
                {`SET TIME ZONE '${zone}';\nINSERT INTO tt_lab (v) VALUES ('${literal}');  -- v ${type}\nSELECT v FROM tt_lab;`}
            </pre>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div className='border border-border p-4'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        Database এ যা রইল
                    </p>
                    <motion.p
                        key={`${type}-${input}`}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        data-stored={stored(type, input)}
                        className='font-mono text-[0.9375rem] font-bold text-foreground'>
                        {stored(type, input)}
                    </motion.p>
                    <p className='mt-2 text-[0.75rem] text-muted-foreground'>
                        {zoneAware ? 'একটা UTC মুহূর্ত, দেখার Zone এর উপর নির্ভর করে না।' : 'লেখাটা যেমন, তেমন। কোন মুহূর্ত, সেটা জানা নেই।'}
                    </p>
                </div>
                <div className={cn('border p-4', zoneAware ? 'border-primary/60 bg-primary/5' : 'border-border')}>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        SELECT যা দেখায়, {zone}
                    </p>
                    <motion.p
                        key={`${type}-${input}-${zone}`}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        data-shown={shown(type, input, zone)}
                        className={cn('font-mono text-[0.9375rem] font-bold', zoneAware ? 'text-primary' : 'text-foreground')}>
                        {shown(type, input, zone)}
                    </motion.p>
                    <p className='mt-2 text-[0.75rem] text-muted-foreground'>
                        {zoneAware ? 'Zone বদলান, লেখা বদলাবে।' : 'Zone বদলান, কিছুই বদলাবে না।'}
                    </p>
                </div>
            </div>

            <p className='mt-4 text-sm leading-relaxed text-foreground' data-explain={type}>
                {explain(type, input, zone)}
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. MySQL TIMESTAMP এর ২০৩৮ সালের দেয়াল                                         */
/* ------------------------------------------------------------------------- */

const INT32_MAX = 2147483647;

interface Moment {
    id: string;
    utc: string;
    dhaka: string;
    seconds: string;
    /** Seconds since 1970-01-01 00:00:00 UTC, for the counter bar. */
    count: number;
    timestamp: true | string;
    datetime: true | string;
    note: string;
}

// Results from MySQL 8.4 (time_zone '+00:00', strict sql_mode) and PostgreSQL
// 18 in containers. PostgreSQL accepted every one of these moments.
const MOMENTS: Moment[] = [
    {
        id: 'before-1970',
        utc: '1969-12-31 23:59:59',
        dhaka: '1970-01-01 05:59:59',
        seconds: '-1',
        count: -1,
        timestamp: "ERROR 1292 (22007): Incorrect datetime value: '1969-12-31 23:59:59' for column 'ts'",
        datetime: true,
        note: 'TIMESTAMP গোনা শুরু করে 1970 থেকে। তার এক সেকেন্ড আগের মুহূর্তও সে রাখতে পারে না।',
    },
    {
        id: 'first',
        utc: '1970-01-01 00:00:01',
        dhaka: '1970-01-01 06:00:01',
        seconds: '1',
        count: 1,
        timestamp: true,
        datetime: true,
        note: 'TIMESTAMP এর সবচেয়ে ছোট মান। Docs এ পরিসর শুরু হয় 00:00:01 থেকে, আর 1970-01-01 00:00:00 ঢোকাতে গেলেও একই Error আসে।',
    },
    {
        id: 'today',
        utc: '2026-11-01 04:00:00',
        dhaka: '2026-11-01 10:00:00',
        seconds: '1793505600',
        count: 1793505600,
        timestamp: true,
        datetime: true,
        note: 'আজকের সকাল ১০টা। গোনার ঘরের প্রায় ৮৩.৫ শতাংশ এর মধ্যেই খরচ হয়ে গেছে।',
    },
    {
        id: 'last',
        utc: '2038-01-19 03:14:07',
        dhaka: '2038-01-19 09:14:07',
        seconds: '2147483647',
        count: 2147483647,
        timestamp: true,
        datetime: true,
        note: 'TIMESTAMP এর শেষ সেকেন্ড। 2147483647 হলো 32 bit এর একটা signed পূর্ণসংখ্যার সবচেয়ে বড় মান।',
    },
    {
        id: 'overflow',
        utc: '2038-01-19 03:14:08',
        dhaka: '2038-01-19 09:14:08',
        seconds: '2147483648',
        count: 2147483648,
        timestamp: "ERROR 1292 (22007): Incorrect datetime value: '2038-01-19 03:14:08' for column 'ts'",
        datetime: true,
        note: 'মাত্র এক সেকেন্ড পরে, আর TIMESTAMP Column আর নিতে পারে না। DATETIME আর PostgreSQL এর কোনো সমস্যা নেই।',
    },
    {
        id: 'datetime-last',
        utc: '9999-12-31 23:59:59',
        dhaka: '10000-01-01 05:59:59',
        seconds: '253402300799',
        count: 253402300799,
        timestamp: "ERROR 1292 (22007): Incorrect datetime value: '9999-12-31 23:59:59' for column 'ts'",
        datetime: true,
        note: 'DATETIME এর Docs এ লেখা সবচেয়ে বড় মান। এটা চার অঙ্কের সালের শেষ সেকেন্ড।',
    },
    {
        id: 'year-10000',
        utc: '10000-01-01 00:00:00',
        dhaka: '10000-01-01 06:00:00',
        seconds: '253402300800',
        count: 253402300800,
        timestamp: "ERROR 1292 (22007): Incorrect datetime value: '10000-01-01 00:00:00' for column 'ts'",
        datetime: "ERROR 1292 (22007): Incorrect datetime value: '10000-01-01 00:00:00' for column 'dt'",
        note: 'MySQL এর দুই ধরনই থামল। PostgreSQL এর timestamptz এখনও চলছে, তার শেষ 294276 সালে।',
    },
];

function Verdict({ name, result, okText }: { name: string; result: true | string; okText: string }) {
    const ok = result === true;
    return (
        <div className={cn('border p-3', ok ? 'border-border' : 'border-destructive/60 bg-destructive/5')}>
            <p className='flex items-center gap-2 font-mono text-[0.6875rem] font-bold'>
                {ok ? <Check className='w-3.5 h-3.5 text-primary' /> : <X className='w-3.5 h-3.5 text-destructive' />}
                {name}
            </p>
            <p className={cn('mt-1.5 font-mono text-[0.6875rem] leading-relaxed break-words', ok ? 'text-muted-foreground' : 'text-destructive')}>
                {ok ? okText : result}
            </p>
        </div>
    );
}

/**
 * Walks seven moments past MySQL TIMESTAMP's 32-bit counter. The bar shows how
 * much of the signed 32-bit range a moment uses; the three cells show what
 * MySQL TIMESTAMP, MySQL DATETIME and PostgreSQL timestamptz did with it.
 */
export function TimestampCliffLab() {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(2);
    const moment = MOMENTS[index];
    const used = Math.max(0, Math.min(1, moment.count / INT32_MAX));
    const over = moment.count > INT32_MAX;
    const under = moment.count < 1;

    return (
        <Panel
            label='Interactive'
            title='MySQL TIMESTAMP এর ২০৩৮ সালের দেয়াল'
            footer="প্রতিটা ফলাফল MySQL 8.4 (time_zone '+00:00', strict sql_mode) আর PostgreSQL 18 এ আসল INSERT চালিয়ে নেওয়া। ঢাকার সময় শুধু পাশে বোঝার জন্য।">
            <div className='flex flex-wrap gap-2 mb-5' role='group' aria-label='কোন মুহূর্ত'>
                {MOMENTS.map((m, i) => (
                    <button
                        key={m.id}
                        type='button'
                        data-moment={m.id}
                        aria-pressed={index === i}
                        onClick={() => setIndex(i)}
                        className={cn(BTN, 'font-mono', index === i ? BTN_ON : BTN_OFF)}>
                        {m.utc}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 font-mono text-[0.75rem]'>
                <p>
                    <span className='text-muted-foreground'>UTC: </span>
                    <span className='font-bold text-foreground'>{moment.utc}</span>
                </p>
                <p>
                    <span className='text-muted-foreground'>ঢাকা: </span>
                    <span className='text-foreground'>{moment.dhaka}</span>
                </p>
                <p>
                    <span className='text-muted-foreground'>1970 থেকে সেকেন্ড: </span>
                    <span className='font-bold text-primary' data-seconds={moment.seconds}>
                        {moment.seconds}
                    </span>
                </p>
            </div>

            <div className='mb-2 flex justify-between font-mono text-[0.625rem] text-muted-foreground'>
                <span>0</span>
                <span>32 bit signed এর শেষ: 2147483647</span>
            </div>
            <div className='relative h-5 border border-border bg-background overflow-hidden'>
                <motion.div
                    className={cn('absolute inset-y-0 left-0', over ? 'bg-destructive/50' : 'bg-primary/40')}
                    initial={false}
                    animate={{ width: `${used * 100}%` }}
                    transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                />
            </div>
            <p className='mt-2 font-mono text-[0.6875rem] text-muted-foreground' data-state={over ? 'over' : under ? 'under' : 'inside'}>
                {over ? 'ঘর উপচে গেছে: এই সংখ্যা 32 bit এ আঁটে না' : under ? 'ঘরের শুরুর আগে: TIMESTAMP এখানে কিছু রাখতে পারে না' : `ঘরের ${(used * 100).toFixed(1)}% ব্যবহার হয়েছে`}
            </p>

            <motion.div
                key={moment.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-5'>
                <Verdict name='MySQL TIMESTAMP' result={moment.timestamp} okText='Query OK, 1 row affected' />
                <Verdict name='MySQL DATETIME' result={moment.datetime} okText='Query OK, 1 row affected' />
                <Verdict name='PostgreSQL timestamptz' result={true} okText='INSERT 0 1' />
            </motion.div>

            <p className='mt-4 text-sm leading-relaxed text-foreground'>{moment.note}</p>
        </Panel>
    );
}
