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

/** The fifteen sample customers, phone as stored (NULL for the five without one). */
const CUSTOMERS: { id: number; name: string; phone: string | null }[] = [
    { id: 1, name: 'Rahim', phone: '+8801000000101' },
    { id: 2, name: 'Nusrat', phone: '+8801000000102' },
    { id: 3, name: 'Tanvir', phone: null },
    { id: 4, name: 'Farhana', phone: '+8801000000104' },
    { id: 5, name: 'Sabbir', phone: '+8801000000105' },
    { id: 6, name: 'Mitu', phone: null },
    { id: 7, name: 'Arif', phone: '+8801000000107' },
    { id: 8, name: 'Sumaiya', phone: '+8801000000108' },
    { id: 9, name: 'Priya', phone: null },
    { id: 10, name: 'Aiman', phone: null },
    { id: 11, name: 'Oliver', phone: null },
    { id: 12, name: 'Kamal', phone: '+8801000000112' },
    { id: 13, name: 'Shuvo', phone: '+8801000000113' },
    { id: 14, name: 'Lamia', phone: '+8801000000114' },
    { id: 15, name: 'Imran', phone: '+8801000000115' },
];

const NEW_PHONE = '+8801000000199';

/** Last three digits are enough to see which number a cell holds. */
function tail(phone: string | null) {
    return phone === null ? 'NULL' : `…${phone.slice(-3)}`;
}

/* ------------------------------------------------------------------------- */
/* 1. কোন WHERE কতগুলো Row ধরে                                                   */
/* ------------------------------------------------------------------------- */

type Trap = 'right' | 'missing' | 'highlight' | 'or' | 'self' | 'subquery' | 'null';

const ALL_IDS = CUSTOMERS.map(c => c.id);

/** Every hit list below is what PostgreSQL 18 really matched on the sample customers. */
const TRAPS: { key: Trap; label: string; sql: string[]; hits: number[]; tag: string; note: string }[] = [
    {
        key: 'right',
        label: 'ঠিক WHERE',
        sql: ['UPDATE oops_customers', "SET phone = '+8801000000199'", 'WHERE customer_id = 7;'],
        hits: [7],
        tag: 'UPDATE 1',
        note: 'Primary Key দিয়ে ঠিকানা, তাই ঠিক একটা Row। উত্তরের 1 সংখ্যাটাই প্রমাণ যে কাজটা যা ভেবেছিলেন তাই হয়েছে।',
    },
    {
        key: 'missing',
        label: 'WHERE ভুলে গেছি',
        sql: ['UPDATE oops_customers', "SET phone = '+8801000000199';"],
        hits: ALL_IDS,
        tag: 'UPDATE 15',
        note: 'কোনো শর্ত নেই, তাই প্রতিটা Row ই যোগ্য। কোনো সতর্কবার্তা আসে না, PostgreSQL ধরে নেয় আপনি জেনেশুনেই চাইছেন।',
    },
    {
        key: 'highlight',
        label: 'শুধু দাগানো অংশ চলল',
        sql: ['UPDATE oops_customers', "SET phone = '+8801000000199'", '-- WHERE customer_id = 7;  (দাগানো ছিল না)'],
        hits: ALL_IDS,
        tag: 'UPDATE 15',
        note: 'Editor এ WHERE লেখা ছিল ঠিকই, কিন্তু GUI পাঠিয়েছে শুধু দাগানো দুই লাইন। Database এর কাছে এটা WHERE ছাড়া UPDATE ই।',
    },
    {
        key: 'or',
        label: 'OR 1 = 1 রয়ে গেছে',
        sql: ['UPDATE oops_customers', "SET phone = '+8801000000199'", 'WHERE customer_id = 7 OR 1 = 1;'],
        hits: ALL_IDS,
        tag: 'UPDATE 15',
        note: 'পরীক্ষার সময় লেখা OR 1 = 1 মুছতে ভুলে গেলে শর্তটা প্রতিটা Row এ সত্যি। WHERE আছে, কিন্তু কাজ করছে WHERE না থাকার মতো।',
    },
    {
        key: 'self',
        label: 'phone = phone',
        sql: ['UPDATE oops_customers', "SET phone = '+8801000000199'", 'WHERE phone = phone;'],
        hits: CUSTOMERS.filter(c => c.phone !== null).map(c => c.id),
        tag: 'UPDATE 10',
        note: 'একটা Column কে নিজের সাথে মেলালে প্রায় সবসময় সত্যি। বাঁচে শুধু পাঁচজন যাদের phone NULL, কারণ NULL = NULL সত্যি না, অজানা। 10 সংখ্যাটা অদ্ভুত লাগার কথা।',
    },
    {
        key: 'subquery',
        label: 'Subquery তে ভুল Column',
        sql: [
            'UPDATE oops_customers',
            "SET phone = '+8801000000199'",
            'WHERE customer_id IN (',
            '  SELECT customer_id FROM oops_phone_requests);',
        ],
        hits: ALL_IDS,
        tag: 'UPDATE 15',
        note: 'oops_phone_requests এ customer_id নামে Column ই নেই, আছে id। তবু Error হয় না: ভেতরের Query বাইরের Table এর customer_id দেখতে পায়, তাই শর্তটা হয়ে যায় customer_id IN (customer_id), প্রতিটা Row এ সত্যি।',
    },
    {
        key: 'null',
        label: '= NULL',
        sql: ['UPDATE oops_customers', "SET phone = '+8801000000199'", 'WHERE customer_id = NULL;'],
        hits: [],
        tag: 'UPDATE 0',
        note: 'উল্টো দিকের ভুল: = NULL কখনো সত্যি হয় না, তাই একটাও Row বদলায় না। Error নেই, কিন্তু কাজও হয়নি। 0 সংখ্যাটাও সমান জোরে একটা সংকেত।',
    },
];

/**
 * Pick a WHERE and see which of the fifteen customers it catches, with the
 * command tag PostgreSQL printed for it on a fresh copy of the table.
 */
export function WhereTrapLab() {
    const [key, setKey] = useState<Trap>('right');
    const reduce = useReducedMotion();
    const trap = TRAPS.find(t => t.key === key) ?? TRAPS[0];
    const bad = trap.hits.length !== 1;
    return (
        <Panel
            label='Interactive Lab'
            title='কোন WHERE কতগুলো Row ধরে'
            footer={
                <>
                    প্রতিটা উত্তর আসল PostgreSQL 18 এ customers Table এর একটা নতুন Copy তে চালানো। কাজ ছিল একটাই: শুধু Arif (customer_id 7)
                    এর নম্বর বদলানো। যেকোনো উত্তরে 1 ছাড়া অন্য সংখ্যা মানে কিছু একটা ভুল।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-6'>
                {TRAPS.map(t => (
                    <button
                        key={t.key}
                        type='button'
                        onClick={() => setKey(t.key)}
                        className={cn(BTN, key === t.key ? BTN_ON : BTN_OFF)}>
                        {t.label}
                    </button>
                ))}
            </div>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
                <div className='space-y-3'>
                    <pre className='border border-border bg-muted/30 p-4 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap'>
                        {trap.sql.join('\n')}
                    </pre>
                    <div
                        className={cn(
                            'inline-block border px-3 py-1.5 font-mono text-[0.8125rem] font-bold',
                            bad ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground'
                        )}>
                        {trap.tag}
                    </div>
                    <AnimatePresence mode='wait'>
                        <motion.p
                            key={trap.key}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                            {trap.note}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <div className='grid grid-cols-5 gap-1.5 self-start'>
                    {CUSTOMERS.map((c, i) => {
                        const hit = trap.hits.includes(c.id);
                        return (
                            <motion.div
                                key={c.id}
                                animate={{ opacity: hit ? 1 : 0.55 }}
                                transition={{ duration: 0.25, ease: EASE, delay: reduce ? 0 : i * 0.02 }}
                                className={cn(
                                    'border px-1.5 py-2 text-center',
                                    hit ? 'border-primary bg-primary/10' : 'border-border bg-card'
                                )}>
                                <div className={cn('font-mono text-[0.75rem] font-bold', hit ? 'text-primary' : 'text-foreground')}>
                                    {c.id}
                                </div>
                                <div className='text-[0.625rem] text-muted-foreground truncate'>{c.name}</div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Autocommit আর BEGIN, নিজের হাতে                                            */
/* ------------------------------------------------------------------------- */

type Phones = Record<number, string | null>;

const START: Phones = Object.fromEntries(CUSTOMERS.map(c => [c.id, c.phone]));

interface SessionState {
    phones: Phones;
    /** What ROLLBACK would bring back; null when no transaction is open. */
    snapshot: Phones | null;
    log: { sql: string; reply: string[] }[];
}

const FRESH: SessionState = { phones: START, snapshot: null, log: [] };

type Action = 'begin' | 'update-all' | 'update-one' | 'check' | 'rollback' | 'commit';

const ACTIONS: { key: Action; label: string; sql: string }[] = [
    { key: 'begin', label: 'BEGIN', sql: 'BEGIN;' },
    { key: 'update-all', label: 'UPDATE, WHERE ভুলে', sql: "UPDATE customers SET phone = '+8801000000199';" },
    { key: 'update-one', label: 'UPDATE, WHERE সহ', sql: "UPDATE customers SET phone = '+8801000000199' WHERE customer_id = 7;" },
    { key: 'check', label: 'SELECT দিয়ে যাচাই', sql: 'SELECT count(DISTINCT phone) FROM customers;' },
    { key: 'rollback', label: 'ROLLBACK', sql: 'ROLLBACK;' },
    { key: 'commit', label: 'COMMIT', sql: 'COMMIT;' },
];

function distinctPhones(phones: Phones) {
    return new Set(Object.values(phones).filter((p): p is string => p !== null)).size;
}

/** What psql would do for each statement, autocommit on, the default. */
function step(s: SessionState, action: Action): SessionState {
    const sql = ACTIONS.find(a => a.key === action)?.sql ?? '';
    const push = (reply: string[], next: Partial<SessionState>): SessionState => ({
        ...s,
        ...next,
        log: [...s.log, { sql, reply }].slice(-5),
    });
    switch (action) {
        case 'begin':
            return s.snapshot
                ? push(['WARNING:  there is already a transaction in progress', 'BEGIN'], {})
                : push(['BEGIN'], { snapshot: s.phones });
        case 'update-all': {
            const phones = Object.fromEntries(CUSTOMERS.map(c => [c.id, NEW_PHONE]));
            return push(['UPDATE 15'], { phones });
        }
        case 'update-one':
            return push(['UPDATE 1'], { phones: { ...s.phones, 7: NEW_PHONE } });
        case 'check':
            return push([' count', '-------', ` ${String(distinctPhones(s.phones)).padStart(5)}`, '(1 row)'], {});
        case 'rollback':
            return s.snapshot
                ? push(['ROLLBACK'], { phones: s.snapshot, snapshot: null })
                : push(['WARNING:  there is no transaction in progress', 'ROLLBACK'], {});
        case 'commit':
            return s.snapshot
                ? push(['COMMIT'], { snapshot: null })
                : push(['WARNING:  there is no transaction in progress', 'COMMIT'], {});
    }
}

/**
 * A small psql session over the fifteen customers. Without BEGIN every UPDATE
 * is saved at once and ROLLBACK only warns; after BEGIN the same mistake can be
 * looked at and taken back. The prompt shows the star psql shows inside a
 * transaction.
 */
export function SafeUpdateLab() {
    const [s, setS] = useState<SessionState>(FRESH);
    const reduce = useReducedMotion();
    const open = s.snapshot !== null;
    const prompt = open ? 'island_tours=*#' : 'island_tours=#';
    const changed = CUSTOMERS.filter(c => s.phones[c.id] !== START[c.id]).length;
    const status = open
        ? changed > 0
            ? `Transaction খোলা: ${changed}টা Row বদলেছে, কিন্তু এখনো Save হয়নি। ROLLBACK চাপলে সব ফেরত আসবে।`
            : 'Transaction খোলা, এখনো কিছু বদলায়নি।'
        : changed > 0
          ? `কোনো Transaction খোলা নেই, আর ${changed}টা Row এর বদল স্থায়ীভাবে Save হয়ে গেছে। ROLLBACK এখন কিছুই ফেরাতে পারবে না।`
          : 'সব নম্বর আসল অবস্থায়। Autocommit চালু, মানে BEGIN না দিলে প্রতিটা Statement চলামাত্র Save।';
    return (
        <Panel
            label='Interactive Lab'
            title='BEGIN দিলে আর না দিলে'
            footer={
                <>
                    এটা psql এর আচরণের ছোট্ট নকল, প্রতিটা উত্তর এই লেসনের জন্য PostgreSQL 18 এর psql এ চালিয়ে মেলানো। দুইভাবে চেষ্টা করুন: প্রথমে
                    BEGIN ছাড়া সরাসরি ভুল UPDATE আর তারপর ROLLBACK, তারপর শুরু থেকে BEGIN দিয়ে একই কাজ। Prompt এর তারা চিহ্নটা খেয়াল করুন।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-6'>
                {ACTIONS.map(a => (
                    <button key={a.key} type='button' onClick={() => setS(step(s, a.key))} className={cn(BTN, BTN_OFF)}>
                        {a.label}
                    </button>
                ))}
                <button type='button' onClick={() => setS(FRESH)} className={cn(BTN, 'border-dashed', BTN_OFF)}>
                    শুরু থেকে
                </button>
            </div>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'>
                <div className='border border-border bg-muted/30 p-4 font-mono text-[0.75rem] leading-relaxed min-h-[12rem]'>
                    {s.log.length === 0 && <div className='text-muted-foreground'>{prompt} _</div>}
                    {s.log.map((entry, i) => (
                        <div key={`${i}-${entry.sql}`} className='mb-2'>
                            <div className='text-foreground break-all'>{entry.sql}</div>
                            {entry.reply.map((line, j) => (
                                <div
                                    key={j}
                                    className={cn(
                                        'whitespace-pre',
                                        line.startsWith('WARNING') ? 'text-primary' : 'text-muted-foreground'
                                    )}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    ))}
                    {s.log.length > 0 && <div className={cn(open ? 'text-primary font-bold' : 'text-muted-foreground')}>{prompt} _</div>}
                </div>
                <div className='space-y-3'>
                    <div className='grid grid-cols-5 gap-1.5'>
                        {CUSTOMERS.map(c => {
                            const now = s.phones[c.id];
                            const diff = now !== START[c.id];
                            return (
                                <motion.div
                                    key={c.id}
                                    layout={!reduce}
                                    className={cn(
                                        'border px-1 py-1.5 text-center',
                                        diff ? (open ? 'border-primary border-dashed bg-primary/5' : 'border-primary bg-primary/15') : 'border-border bg-card'
                                    )}>
                                    <div className='font-mono text-[0.625rem] text-muted-foreground'>{c.id}</div>
                                    <div className={cn('font-mono text-[0.6875rem] font-bold', diff ? 'text-primary' : 'text-foreground')}>
                                        {tail(now)}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    <AnimatePresence mode='wait'>
                        <motion.p
                            key={status}
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={reduce ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.2, ease: EASE }}
                            className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                            {status}
                        </motion.p>
                    </AnimatePresence>
                    <p className='text-[0.6875rem] text-muted-foreground'>
                        ডোরাকাটা কিনারা মানে বদলটা খোলা Transaction এ, শুধু এই Session দেখছে। ভরাট রং মানে Save হয়ে গেছে, সবাই দেখছে।
                    </p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন অবস্থায় কোন পথে ফেরা                                                    */
/* ------------------------------------------------------------------------- */

type Situation = 'open' | 'recompute' | 'copy' | 'audit' | 'pitr' | 'dump';

const SITUATIONS: {
    key: Situation;
    label: string;
    path: string;
    time: string;
    loss: string;
    steps: string[];
    code: string;
}[] = [
    {
        key: 'open',
        label: 'BEGIN দিয়েছিলাম, COMMIT দিইনি',
        path: 'ROLLBACK',
        time: 'কয়েক সেকেন্ড',
        loss: 'কিছুই না',
        steps: [
            'আর কোনো Statement চালানোর আগে ROLLBACK।',
            'SELECT দিয়ে দেখুন সংখ্যা আগের মতো ফিরেছে কিনা।',
            'তারপর ঠিক WHERE সহ কাজটা আবার, এবারও BEGIN দিয়ে।',
        ],
        code: 'ROLLBACK;\nSELECT count(DISTINCT phone) FROM customers;  -- 10',
    },
    {
        key: 'recompute',
        label: 'নষ্ট মানটা অন্য Data থেকে হিসাব করা যায়',
        path: 'আবার হিসাব করে UPDATE ... FROM',
        time: 'কয়েক মিনিট',
        loss: 'কিছুই না',
        steps: [
            'কোন নিয়মে মানটা তৈরি হয় লিখে ফেলুন, যেমন total_bdt = price_bdt × seats।',
            'আগে SELECT দিয়ে নতুন হিসাব আর বর্তমান মান পাশাপাশি দেখুন।',
            'সঠিক Join সহ UPDATE ... FROM, আর একটা Departure যেন একটাই Tour পায়।',
        ],
        code: 'UPDATE bookings AS b\nSET total_bdt = t.price_bdt * b.seats\nFROM departures AS d\nJOIN tours AS t ON t.tour_id = d.tour_id\nWHERE d.departure_id = b.departure_id;',
    },
    {
        key: 'copy',
        label: 'COMMIT হয়ে গেছে, তবে আগে Copy রেখেছিলাম',
        path: 'Copy থেকে UPDATE ... FROM',
        time: 'কয়েক মিনিট',
        loss: 'কিছুই না, যদি Copy নেওয়ার পরে কেউ কিছু না বদলে থাকে',
        steps: [
            'Copy টা ছোঁবেন না, আগে দেখে নিন তাতে কতগুলো Row আছে।',
            'Primary Key মিলিয়ে নষ্ট Column টা ফেরত আনুন।',
            'EXCEPT দিয়ে যাচাই: আসল আর ফেরত আনা Data র পার্থক্য শূন্য Row।',
        ],
        code: 'UPDATE customers AS c\nSET phone = b.phone\nFROM fix_20261101_phone_before AS b\nWHERE b.customer_id = c.customer_id;',
    },
    {
        key: 'audit',
        label: 'Audit Trigger চালু ছিল',
        path: 'Audit Table থেকে পুরনো মান',
        time: 'কয়েক মিনিট',
        loss: 'কিছুই না',
        steps: [
            'Audit Table এ দুর্ঘটনার Row গুলো আলাদা করুন: সময় বা নতুন মান দিয়ে।',
            'শুধু সেই Row গুলোর old_phone দিয়ে UPDATE ... FROM।',
            'ফেরানোটাও Audit এ উঠবে, পুরো গল্পটা তাই লেখা থাকবে।',
        ],
        code: "UPDATE customers AS c\nSET phone = a.old_phone\nFROM customers_audit AS a\nWHERE a.customer_id = c.customer_id\n  AND a.new_phone = '+8801000000199';",
    },
    {
        key: 'pitr',
        label: 'WAL Archive আর Base Backup আছে',
        path: 'Point in Time Recovery, আলাদা Server এ',
        time: 'এক বা কয়েক ঘণ্টা',
        loss: 'প্রায় কিছুই না',
        steps: [
            'ভুলের সময়টা যত ঠিকভাবে সম্ভব লিখে রাখুন, যেমন 10:04।',
            'Base Backup একটা নতুন Server এ Restore, recovery_target_time ভুলের ঠিক আগে।',
            'সেখান থেকে শুধু নষ্ট Column টা বের করে আসল Database এ UPDATE ... FROM।',
        ],
        code: "# নতুন Server এর postgresql.conf এ\nrestore_command = 'cp /mnt/archive/%f %p'\nrecovery_target_time = '2026-11-01 10:03:59+06'",
    },
    {
        key: 'dump',
        label: 'শুধু গত রাতের pg_dump',
        path: 'Rescue Database এ Restore, Column কপি',
        time: 'এক বা কয়েক ঘণ্টা',
        loss: 'Dump এর পরে আজ যা বদলেছে',
        steps: [
            'Dump টা আলাদা একটা Database এ Restore, কখনো আসলটার উপরে না।',
            '\\copy দিয়ে customer_id আর phone একটা CSV তে।',
            'আসল Database এ Temp Table এ Load, তারপর UPDATE ... FROM।',
            'আজ সকালে যাঁরা নম্বর বদলেছিলেন, তাঁদের তালিকা আলাদা করে মিলিয়ে নিন।',
        ],
        code: 'createdb island_rescue\npg_restore -d island_rescue island_tours.dump',
    },
];

/** Pick what you still have after the mistake, see the cheapest way back and what it costs. */
export function RecoveryPickerLab() {
    const [key, setKey] = useState<Situation>('open');
    const reduce = useReducedMotion();
    const s = SITUATIONS.find(x => x.key === key) ?? SITUATIONS[0];
    return (
        <Panel
            label='Interactive Lab'
            title='হাতে কী আছে, সেই অনুযায়ী ফেরার পথ'
            footer={
                <>
                    ভুলের পরে প্রথম প্রশ্ন: আমার হাতে কী আছে? খোলা Transaction, হিসাব করার মতো Data, একটা Copy, Audit, নাকি শুধু Backup। যত উপরের
                    জিনিস হাতে থাকে, ফেরা তত দ্রুত আর তত কম হারায়। প্রতিটা পথ এই লেসনের বক্সে বা PostgreSQL 18 এর Container এ চালিয়ে দেখা।
                </>
            }>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'>
                <div className='flex flex-col gap-2'>
                    {SITUATIONS.map(x => (
                        <button
                            key={x.key}
                            type='button'
                            onClick={() => setKey(x.key)}
                            className={cn(BTN, key === x.key ? BTN_ON : BTN_OFF)}>
                            {x.label}
                        </button>
                    ))}
                </div>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={s.key}
                        initial={reduce ? false : { opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduce ? undefined : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className='space-y-4'>
                        <div className='flex flex-wrap gap-3'>
                            <div className='border border-primary bg-primary/10 px-3 py-1.5 text-[0.75rem] font-bold text-primary'>{s.path}</div>
                            <div className='border border-border px-3 py-1.5 text-[0.75rem] text-muted-foreground'>সময়: {s.time}</div>
                            <div className='border border-border px-3 py-1.5 text-[0.75rem] text-muted-foreground'>হারায়: {s.loss}</div>
                        </div>
                        <ol className='list-decimal pl-5 space-y-1.5 text-[0.8125rem] leading-relaxed text-foreground'>
                            {s.steps.map(line => (
                                <li key={line}>{line}</li>
                            ))}
                        </ol>
                        <pre className='border border-border bg-muted/30 p-4 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap'>
                            {s.code}
                        </pre>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Panel>
    );
}
