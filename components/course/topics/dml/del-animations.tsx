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
/* 1. কোন অনুরোধে কোন পথ                                                        */
/* ------------------------------------------------------------------------- */

type Strategy = 'hard' | 'soft' | 'archive' | 'anonymize';
type Verdict = 'good' | 'bad' | 'partial' | 'na';

interface Outcome {
    verdict: Verdict;
    /** What PostgreSQL answered, copied from a real run in the lesson's sample database. */
    result: string;
    note: string;
}

interface Request {
    key: string;
    title: string;
    facts: string;
    outcomes: Record<Strategy, Outcome>;
}

const STRATEGIES: { key: Strategy; label: string; sql: string }[] = [
    { key: 'hard', label: 'Hard Delete', sql: 'DELETE FROM ... WHERE ...' },
    { key: 'soft', label: 'Soft Delete', sql: 'UPDATE ... SET deleted_at = ...' },
    { key: 'archive', label: 'Archive', sql: 'WITH moved AS (DELETE ... RETURNING *) INSERT ...' },
    { key: 'anonymize', label: 'Anonymize', sql: "UPDATE ... SET full_name = 'Deleted customer', ..." },
];

const REQUESTS: Request[] = [
    {
        key: 'imran',
        title: 'Imran Kabir: "Account টা মুছে দিন"',
        facts: 'Customer 15। Sign up করেছেন, কোনো Booking নেই, কোনো Payment নেই।',
        outcomes: {
            hard: {
                verdict: 'good',
                result: 'DELETE 1',
                note: 'কোনো Booking তাকে দেখায় না, তাই কিছুই ভাঙে না। রাখার মতো কোনো ইতিহাস নেই, আর তিনি যা চেয়েছেন ঠিক তাই হলো। এখানে এটাই সবচেয়ে সৎ পথ।',
            },
            soft: {
                verdict: 'bad',
                result: 'UPDATE 1',
                note: 'Row লুকাল, কিন্তু imran.kabir@mail.example আর তার ফোন নম্বর Database এ রয়েই গেল। তিনি মুছে দিতে বলেছিলেন, লুকিয়ে রাখতে না।',
            },
            archive: {
                verdict: 'bad',
                result: 'INSERT 0 1, তারপর DELETE 1',
                note: 'Row আরেকটা Table এ গেল, তথ্য কিন্তু একই রকম রইল। ব্যক্তিগত তথ্য সরানো আর মুছে ফেলা এক জিনিস না।',
            },
            anonymize: {
                verdict: 'partial',
                result: 'UPDATE 1',
                note: 'চলে, ব্যক্তিগত তথ্যও যায়। কিন্তু কোনো Booking নেই, তাই এই নামহীন Row রাখার কোনো কারণও নেই। শুধু একটা অর্থহীন Row বাড়ল।',
            },
        },
    },
    {
        key: 'oliver',
        title: 'Oliver Bennett: "আমার সব তথ্য মুছে দিন"',
        facts: 'Customer 11। Booking 12 (cancelled) আর 19 (confirmed), Booking 19 এর জন্য Payment 16, 28000 টাকা paid।',
        outcomes: {
            hard: {
                verdict: 'bad',
                result: 'ERROR 23503: Key (customer_id)=(11) is still referenced from table "bookings"',
                note: 'সাধারণ Foreign Key মুছতেই দেয় না। CASCADE থাকলে দিত, কিন্তু সাথে 2টা Booking আর 1টা Payment যেত, আর আয় 423600.00 থেকে 395600.00 হয়ে যেত।',
            },
            soft: {
                verdict: 'partial',
                result: 'UPDATE 1',
                note: 'ইতিহাস বাঁচল, আয় ঠিক থাকল। কিন্তু নাম, Email আর ফোন এখনো আছে। তিনি তার তথ্য মুছতে বলেছিলেন, সেটা হয়নি।',
            },
            archive: {
                verdict: 'bad',
                result: 'ERROR 23503',
                note: 'Archive মানে মূল Table থেকে DELETE। Booking এখনো তাকে দেখায়, তাই ঠিক Hard Delete এর মতোই আটকায়।',
            },
            anonymize: {
                verdict: 'good',
                result: "UPDATE 1: full_name 'Deleted customer', email deleted-11@mail.example, phone NULL",
                note: 'মানুষটা চলে গেলেন, হিসাব রইল। Booking 12 আর 19, Payment 16, আয় 423600.00, সব অক্ষত। সাথে deleted_at দিলে তিনি সব তালিকা থেকেও লুকান।',
            },
        },
    },
    {
        key: 'hold',
        title: 'Booking 20: Payment ছাড়া pending Hold',
        facts: 'Departure 14, যাত্রা 14 November 2026। আজ 1 November, টাকা আসেনি, Seat আটকে আছে।',
        outcomes: {
            hard: {
                verdict: 'partial',
                result: 'DELETE 1',
                note: 'Booking 20 এর কোনো Payment নেই, তাই মুছে যায়। কিন্তু কে কোন Trip চেয়েছিলেন সেই তথ্য হারাল। আর Booking 14 এ একই চেষ্টা করলে ERROR 23503, কারণ তার একটা failed Payment আছে।',
            },
            soft: {
                verdict: 'good',
                result: "UPDATE 1: status 'cancelled'",
                note: 'এই Table এ status Column ই Soft Delete এর কাজ করে। Seat ছাড়া পায়, ইতিহাস থাকে, Payment এর সাথে সম্পর্কও ভাঙে না।',
            },
            archive: {
                verdict: 'partial',
                result: 'INSERT 0 1, তারপর DELETE 1',
                note: 'চলে, কিন্তু আজকের Hold আজই Archive এ পাঠানোর মানে নেই। Archive পুরনো, বন্ধ হয়ে যাওয়া ইতিহাসের জন্য।',
            },
            anonymize: {
                verdict: 'na',
                result: 'প্রযোজ্য না',
                note: 'Booking এ নাম বা Email নেই, ব্যক্তিগত তথ্য থাকে customers এ। এখানে মোছার প্রশ্ন ব্যবসার, গোপনীয়তার না।',
            },
        },
    },
    {
        key: 'refund',
        title: 'Payment 5: ফেরত দেওয়া 17000 টাকা',
        facts: 'Booking 5 বাতিল, bKash এ 17000 টাকা এসেছিল, পরে ফেরত গেছে। status refunded।',
        outcomes: {
            hard: {
                verdict: 'bad',
                result: 'DELETE 1',
                note: 'Database আপত্তি করে না, কারণ কেউ এই Payment কে দেখায় না। কিন্তু bKash এর Statement এ টাকা আসা আর ফেরত যাওয়া দুটোই আছে, আপনার খাতায় কিছু নেই। মাস শেষের হিসাব আর মেলে না।',
            },
            soft: {
                verdict: 'good',
                result: 'কোনো বদল লাগে না',
                note: "status = 'refunded' ই এর চিহ্ন। Payment কখনো মোছা হয় না, শুধু তার অবস্থা বদলায়, অথবা উল্টো একটা নতুন Row যোগ হয়।",
            },
            archive: {
                verdict: 'partial',
                result: 'বছর শেষে, পুরো বছর একসাথে',
                note: 'Audit শেষ হলে পুরনো বছরের সব Payment একসাথে Archive করা যায়। একটা একটা করে বেছে Archive করা হিসাবের ছবিটাই ভেঙে দেয়।',
            },
            anonymize: {
                verdict: 'na',
                result: 'প্রযোজ্য না',
                note: 'Payment এ কারো নাম নেই। ব্যক্তিগত তথ্য Booking হয়ে customers এ যায়, মুছতে হলে সেখানে Anonymize।',
            },
        },
    },
];

const VERDICT_LABEL: Record<Verdict, string> = {
    good: 'সঠিক পথ',
    bad: 'ভুল পথ',
    partial: 'চলে, কিন্তু সমস্যা আছে',
    na: 'প্রযোজ্য না',
};

/**
 * Four real requests the Island Tours team gets, four ways to handle each.
 * Every result line is what PostgreSQL answered in the sample database.
 */
export function DeleteFateLab() {
    const reduce = useReducedMotion();
    const [request, setRequest] = useState(REQUESTS[1].key);
    const [strategy, setStrategy] = useState<Strategy>('hard');
    const current = REQUESTS.find(r => r.key === request) ?? REQUESTS[0];
    const outcome = current.outcomes[strategy];
    const sql = STRATEGIES.find(s => s.key === strategy)?.sql ?? '';

    return (
        <Panel
            label='Interactive Lab'
            title='কোন অনুরোধে কোন পথ'
            footer={
                <>
                    প্রতিটা ফলাফল এই লেসনের Sample Database এ চালিয়ে পাওয়া। একটা অনুরোধ বেছে চারটা পথই চেষ্টা করুন। লক্ষ্য করুন, কোনো একটা পথ
                    সব অনুরোধে সঠিক না: ব্যক্তিগত তথ্য, টাকার হিসাব আর Foreign Key, তিনটা মিলিয়ে সিদ্ধান্ত।
                </>
            }>
            <div className='space-y-6'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-2'>অনুরোধ</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        {REQUESTS.map(r => (
                            <button
                                key={r.key}
                                type='button'
                                onClick={() => setRequest(r.key)}
                                className={cn(BTN, r.key === request ? BTN_ON : BTN_OFF)}>
                                {r.title}
                            </button>
                        ))}
                    </div>
                    <p className='mt-3 text-sm text-muted-foreground leading-relaxed'>{current.facts}</p>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-2'>পথ</p>
                    <div className='flex flex-wrap gap-2'>
                        {STRATEGIES.map(s => (
                            <button
                                key={s.key}
                                type='button'
                                onClick={() => setStrategy(s.key)}
                                className={cn(BTN, s.key === strategy ? BTN_ON : BTN_OFF)}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <p className='mt-2 font-mono text-[0.75rem] text-muted-foreground'>{sql}</p>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={`${request}-${strategy}`}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className={cn(
                            'border p-5 space-y-3',
                            outcome.verdict === 'good' ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                        )}>
                        <p
                            className={cn(
                                'font-mono text-[0.6875rem] font-bold uppercase tracking-[0.15em]',
                                outcome.verdict === 'good' ? 'text-primary' : 'text-muted-foreground'
                            )}>
                            {VERDICT_LABEL[outcome.verdict]}
                        </p>
                        <p className='font-mono text-[0.8125rem] text-foreground break-words'>{outcome.result}</p>
                        <p className='text-sm leading-relaxed text-foreground/90'>{outcome.note}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ভুলে যাওয়া Filter                                                          */
/* ------------------------------------------------------------------------- */

type FilterChoice = 'none' | 'live' | 'gone';

interface AppQuery {
    key: string;
    title: string;
    question: string;
    sql: string;
    right: FilterChoice;
    results: Record<FilterChoice, string>;
    why: string;
}

const FILTERS: { key: FilterChoice; label: string; clause: string }[] = [
    { key: 'none', label: 'Filter নেই', clause: '' },
    { key: 'live', label: 'deleted_at IS NULL', clause: 'AND c.deleted_at IS NULL' },
    { key: 'gone', label: 'deleted_at IS NOT NULL', clause: 'AND c.deleted_at IS NOT NULL' },
];

/** Results from del_soft_customers with customer 11 soft deleted, run in the sample database. */
const QUERIES: AppQuery[] = [
    {
        key: 'newsletter',
        title: 'Newsletter পাঠানো',
        question: 'এই মাসের অফারের Email কতজনকে যাবে?',
        sql: 'SELECT count(*) FROM del_soft_customers AS c WHERE true',
        right: 'live',
        results: { none: 'count 15', live: 'count 14', gone: 'count 1' },
        why: 'Filter ছাড়া যে মানুষটা নিজের তথ্য মুছতে বলেছেন, তিনিই অফারের Email পাবেন। গোপনীয়তার আইনে এটা সরাসরি অভিযোগের কারণ।',
    },
    {
        key: 'revenue',
        title: 'মাসিক আয়ের Report',
        question: 'confirmed Booking থেকে মোট আয় কত?',
        sql: "SELECT sum(b.total_bdt) FROM del_soft_bookings AS b JOIN del_soft_customers AS c USING (customer_id) WHERE b.status = 'confirmed'",
        right: 'none',
        results: { none: 'sum 423600.00', live: 'sum 395600.00', gone: 'sum 28000.00' },
        why: 'Oliver চলে গেছেন, কিন্তু তার Booking 19 সত্যিই হয়েছিল, টাকাও এসেছিল। ইতিহাসের Report এ Filter দিলে 28000 টাকা হারিয়ে যায়।',
    },
    {
        key: 'login',
        title: 'Login',
        question: 'এই Email দিয়ে কেউ Login করতে চাইছেন, Account আছে কি?',
        sql: "SELECT customer_id, full_name FROM del_soft_customers AS c WHERE c.email = 'oliver.bennett@mail.example'",
        right: 'live',
        results: { none: '1 row: 11 | Oliver Bennett', live: '0 rows', gone: '1 row: 11 | Oliver Bennett' },
        why: 'Filter না দিলে মুছে ফেলা Account দিয়ে আবার ঢোকা যায়। Login এ শুধু জীবিত Account খোঁজা চাই।',
    },
    {
        key: 'dashboard',
        title: 'বিদেশি গ্রাহকের Dashboard',
        question: 'Bangladesh এর বাইরে এখন কতজন সক্রিয় গ্রাহক, কোন দেশে?',
        sql: "SELECT country, count(*) FROM del_soft_customers AS c WHERE c.country <> 'Bangladesh' GROUP BY country",
        right: 'live',
        results: {
            none: 'India 1, Malaysia 1, United Kingdom 1',
            live: 'India 1, Malaysia 1',
            gone: 'United Kingdom 1',
        },
        why: '"সক্রিয় গ্রাহক" প্রশ্নটাই বলে দেয় Filter লাগবে। United Kingdom এর একমাত্র গ্রাহক চলে গেছেন।',
    },
    {
        key: 'purge',
        title: 'Purge Job এর তালিকা',
        question: 'কোন Account গুলো মুছে ফেলার অপেক্ষায় আছে?',
        sql: 'SELECT customer_id, full_name, deleted_at FROM del_soft_customers AS c WHERE true',
        right: 'gone',
        results: { none: '15 rows', live: '14 rows', gone: '1 row: 11 | Oliver Bennett | 2026-11-01 10:00:00+06' },
        why: 'এখানে প্রশ্নটা উল্টো: শুধু মুছে ফেলা Row চাই। একই Column, একই Table, তিন রকম প্রশ্ন, তিন রকম Filter।',
    },
];

/**
 * Five queries an app really runs, against a customers table where one
 * customer has been soft deleted. The reader picks a filter for each and
 * sees which answer is right for that question.
 */
export function ForgottenFilterLab() {
    const reduce = useReducedMotion();
    const [picked, setPicked] = useState<Record<string, FilterChoice>>(() =>
        Object.fromEntries(QUERIES.map(q => [q.key, 'none' as FilterChoice]))
    );
    const rightCount = QUERIES.filter(q => picked[q.key] === q.right).length;

    return (
        <Panel
            label='Interactive Lab'
            title='প্রতিটা Query তে কোন Filter'
            footer={
                <>
                    del_soft_customers এ Customer 11 Soft Delete করা। প্রতিটা ফলাফল এই লেসনের Sample Database এ চালানো। পাঁচটা প্রশ্নে
                    সঠিক Filter তিন রকম: কোথাও IS NULL, কোথাও কোনো Filter না, কোথাও IS NOT NULL। Soft Delete এর আসল খরচ এটাই, প্রতিটা Query
                    লেখার সময় এই প্রশ্নটা আপনাকে করতে হয়।
                </>
            }>
            <div className='space-y-5'>
                <p className='font-mono text-[0.6875rem] text-muted-foreground'>
                    ঠিক উত্তর: {rightCount} / {QUERIES.length}
                </p>
                {QUERIES.map(q => {
                    const choice = picked[q.key];
                    const ok = choice === q.right;
                    const clause = FILTERS.find(f => f.key === choice)?.clause ?? '';
                    return (
                        <div key={q.key} className='border border-border p-4 space-y-3'>
                            <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                                <span className='font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-primary'>
                                    {q.title}
                                </span>
                                <span className='text-sm text-muted-foreground'>{q.question}</span>
                            </div>
                            <p className='font-mono text-[0.75rem] text-muted-foreground break-words'>
                                {q.sql}
                                {clause && <span className='text-primary'> {clause}</span>}
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {FILTERS.map(f => (
                                    <button
                                        key={f.key}
                                        type='button'
                                        onClick={() => setPicked(prev => ({ ...prev, [q.key]: f.key }))}
                                        className={cn(BTN, f.key === choice ? BTN_ON : BTN_OFF)}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={choice}
                                    initial={reduce ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={reduce ? undefined : { opacity: 0 }}
                                    transition={{ duration: 0.2, ease: EASE }}
                                    className='space-y-1'>
                                    <p className='font-mono text-[0.8125rem] text-foreground'>{q.results[choice]}</p>
                                    <p className={cn('text-sm leading-relaxed', ok ? 'text-primary' : 'text-muted-foreground')}>
                                        {ok ? 'ঠিক। ' : 'এই প্রশ্নের জন্য ভুল। '}
                                        {q.why}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
