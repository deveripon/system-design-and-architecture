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
/* 1. একই শব্দ, আলাদা Database, আলাদা ক্রম                                      */
/* ------------------------------------------------------------------------- */

type ListId = 'mixed' | 'english';

interface LocaleCase {
    id: string;
    label: string;
    sql: string;
    upper: string;
    /** The sorted list exactly as PostgreSQL 18 printed it. */
    sorted: Record<ListId, string[]>;
    note: string;
}

const LISTS: Record<ListId, { label: string; input: string[] }> = {
    mixed: { label: 'বাংলা আর English', input: ['সিলেট', 'কক্সবাজার', 'Sylhet', 'bandarban', 'Bandarban'] },
    english: { label: 'শুধু English', input: ['banana', 'Apple', 'apple', 'éclair', 'zebra'] },
};

const C_ORDER: Record<ListId, string[]> = {
    mixed: ['Bandarban', 'Sylhet', 'bandarban', 'কক্সবাজার', 'সিলেট'],
    english: ['Apple', 'apple', 'banana', 'zebra', 'éclair'],
};

const HUMAN_ORDER: Record<ListId, string[]> = {
    mixed: ['bandarban', 'Bandarban', 'Sylhet', 'কক্সবাজার', 'সিলেট'],
    english: ['apple', 'Apple', 'banana', 'éclair', 'zebra'],
};

/* Every list and every upper() value below was printed by PostgreSQL 18.6 in
   a database created with exactly the statement shown (the box row by the
   page's own PGlite 18.3). */
const CASES: LocaleCase[] = [
    {
        id: 'c',
        label: "libc 'C'",
        sql: "CREATE DATABASE createdb_c LOCALE 'C' TEMPLATE template0;",
        upper: 'éCLAIR',
        sorted: C_ORDER,
        note: 'C মানে Byte এর ক্রম। বড় হাতের সব অক্ষর ছোট হাতের আগে, é চলে যায় z এর পরে, আর upper() শুধু ASCII অক্ষর বড় করে, é কে ছোঁয় না। দ্রুত আর সব মেশিনে একই, কিন্তু মানুষের চোখে অদ্ভুত।',
    },
    {
        id: 'en',
        label: 'libc en_US.utf8',
        sql: 'CREATE DATABASE createdb_plain;   -- কিছু বলা হয়নি, ছাঁচের Locale',
        upper: 'ÉCLAIR',
        sorted: HUMAN_ORDER,
        note: 'Docker এর postgres:18 Image এ ছাঁচের Locale en_US.utf8, তাই কিছু না বললে এটাই আসে। অভিধানের মতো ক্রম: apple আর Apple পাশাপাশি, éclair বসে e এর জায়গায়। নিয়মগুলো আসে Operating System এর glibc থেকে।',
    },
    {
        id: 'und',
        label: "ICU 'und'",
        sql: "CREATE DATABASE createdb_und LOCALE_PROVIDER icu ICU_LOCALE 'und' TEMPLATE template0;",
        upper: 'ÉCLAIR',
        sorted: HUMAN_ORDER,
        note: "und মানে কোনো নির্দিষ্ট ভাষা না, Unicode এর সাধারণ নিয়ম। এই পাঁচটা শব্দে ফল en_US.utf8 এর মতোই, কিন্তু নিয়ম আসে ICU Library থেকে, তাই Linux, macOS বা Windows যেখানেই চলুক, একই থাকে।",
    },
    {
        id: 'bn',
        label: "ICU 'bn-BD'",
        sql: "CREATE DATABASE createdb_bn LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD' TEMPLATE template0;",
        upper: 'ÉCLAIR',
        sorted: { mixed: ['কক্সবাজার', 'সিলেট', 'bandarban', 'Bandarban', 'Sylhet'], english: HUMAN_ORDER.english },
        note: 'বাংলার নিয়মে বাংলা লিপি আগে, তারপর Latin। English শব্দগুলোর নিজেদের মধ্যে ক্রম und এর মতোই। Bangladesh এর ব্যবহারকারীর জন্য তালিকা সাজাতে চাইলে এটাই সবচেয়ে স্বাভাবিক।',
    },
    {
        id: 'builtin',
        label: "builtin 'C.UTF-8'",
        sql: "CREATE DATABASE createdb_builtin LOCALE_PROVIDER builtin BUILTIN_LOCALE 'C.UTF-8' TEMPLATE template0;",
        upper: 'ÉCLAIR',
        sorted: C_ORDER,
        note: 'PostgreSQL 17 থেকে আসা নিজস্ব Provider। সাজায় C এর মতো Code Point ধরে, কিন্তু upper() আর lower() পুরো Unicode বোঝে, তাই é থেকে É হয়। কোনো বাইরের Library লাগে না, Upgrade এ ক্রম বদলায় না।',
    },
    {
        id: 'box',
        label: 'এই পাতার বক্স',
        sql: "SELECT datcollate, datctype FROM pg_database WHERE datname = current_database();   -- C | C.UTF-8",
        upper: 'ÉCLAIR',
        sorted: C_ORDER,
        note: 'বক্সের Database এর Collate হলো C, Ctype C.UTF-8। তাই ক্রম C এর মতো, কিন্তু upper() é কে É বানায়। আপনার Docker এর ফল আর বক্সের ফল তাই আলাদা দেখাতে পারে, এটা কোনো Bug না।',
    },
];

/**
 * Pick a database and a word list: the same five words come back in a
 * different order, because ORDER BY follows the database's default collation.
 */
export function CreatedbCollationLab() {
    const reduce = useReducedMotion();
    const [caseId, setCaseId] = useState('en');
    const [list, setList] = useState<ListId>('mixed');
    const active = CASES.find(c => c.id === caseId) ?? CASES[1];
    const sorted = active.sorted[list];

    return (
        <Panel
            label='Lab'
            title='একই শব্দ, কোন Database এ সাজালেন তার ওপর ক্রম'
            footer='প্রতিটা ক্রম আর upper() এর প্রতিটা উত্তর postgres:18 Container এ ঠিক উপরের Statement দিয়ে বানানো Database এ চালিয়ে পাওয়া, আর শেষ বোতামটা এই পাতার বক্সের ফল। Query প্রতিবার একই: SELECT string_agg(w, &apos;, &apos; ORDER BY w) FROM (VALUES ...) AS v(w);'>
            <div className='flex flex-wrap gap-2 mb-3'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground self-center mr-1'>
                    Database
                </span>
                {CASES.map(c => (
                    <button
                        key={c.id}
                        type='button'
                        data-locale={c.id}
                        onClick={() => setCaseId(c.id)}
                        aria-pressed={caseId === c.id}
                        className={cn(BTN, caseId === c.id ? BTN_ON : BTN_OFF)}>
                        {c.label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground self-center mr-1'>
                    শব্দের তালিকা
                </span>
                {(Object.keys(LISTS) as ListId[]).map(l => (
                    <button
                        key={l}
                        type='button'
                        data-list={l}
                        onClick={() => setList(l)}
                        aria-pressed={list === l}
                        className={cn(BTN, list === l ? BTN_ON : BTN_OFF)}>
                        {LISTS[l].label}
                    </button>
                ))}
            </div>

            <pre className='overflow-x-auto border border-primary bg-primary/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground mb-6'>
                {active.sql}
            </pre>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6' data-active-locale={active.id} data-first={sorted[0]}>
                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        যে ক্রমে দেওয়া হলো
                    </p>
                    <ul className='flex flex-wrap gap-1.5'>
                        {LISTS[list].input.map(w => (
                            <li key={w} className='border border-border px-2.5 py-1 font-mono text-[0.75rem] text-muted-foreground'>
                                {w}
                            </li>
                        ))}
                    </ul>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground pt-2'>
                        upper(&apos;éclair&apos;)
                    </p>
                    <p className='font-mono text-[0.875rem] font-bold text-primary' data-upper={active.upper}>
                        {active.upper}
                    </p>
                </div>

                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        ORDER BY w এর পরে
                    </p>
                    <ol className='space-y-1'>
                        {sorted.map((w, i) => (
                            <motion.li
                                key={w}
                                layout={!reduce}
                                transition={{ duration: 0.35, ease: EASE }}
                                data-word={w}
                                className='flex items-center gap-3 border border-primary/50 bg-primary/5 px-3 py-1.5 font-mono text-[0.75rem] text-foreground'>
                                <span className='text-primary font-bold w-5 shrink-0'>{toBn(i + 1)}</span>
                                <span>{w}</span>
                            </motion.li>
                        ))}
                    </ol>
                </div>
            </div>

            <p className='mt-6 text-[0.8125rem] leading-relaxed text-foreground'>{active.note}</p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. DROP DATABASE: কে ভেতরে আছে, আর আপনি কোন ভাবে বললেন                      */
/* ------------------------------------------------------------------------- */

type Situation = 'empty' | 'self' | 'other' | 'missing';
type Variant = 'plain' | 'ifexists' | 'force';

const SITUATIONS: { id: Situation; label: string; detail: string }[] = [
    { id: 'empty', label: 'কেউ Connect নেই', detail: 'আপনি postgres এ, createdb_lab এ কেউ নেই' },
    { id: 'self', label: 'আপনি নিজেই ভেতরে', detail: 'আপনার psql এখন createdb_lab এ' },
    { id: 'other', label: 'আরেকজন Connect করা', detail: 'আরেকটা Window তে কেউ createdb_lab এ বসে আছেন' },
    { id: 'missing', label: 'Database টাই নেই', detail: 'createdb_lab নামে কিছু নেই' },
];

const VARIANTS: { id: Variant; sql: string }[] = [
    { id: 'plain', sql: 'DROP DATABASE createdb_lab;' },
    { id: 'ifexists', sql: 'DROP DATABASE IF EXISTS createdb_lab;' },
    { id: 'force', sql: 'DROP DATABASE createdb_lab WITH (FORCE);' },
];

interface DropOutcome {
    lines: string[];
    gone: boolean;
    other?: string[];
    note: string;
}

const BUSY = [
    'ERROR:  database "createdb_lab" is being accessed by other users',
    'DETAIL:  There is 1 other session using the database.',
];
const CURRENT = ['ERROR:  cannot drop the currently open database'];
const MISSING = ['ERROR:  database "createdb_lab" does not exist'];
const TERMINATED = [
    'FATAL:  terminating connection due to administrator command',
    'server closed the connection unexpectedly',
    '        This probably means the server terminated abnormally',
    '        before or while processing the request.',
    'The connection to the server was lost. Attempting reset: Failed.',
    'The connection to the server was lost. Attempting reset: Failed.',
];

/* Each cell was run on PostgreSQL 18.6 in the lesson's container. */
const OUTCOMES: Record<Situation, Record<Variant, DropOutcome>> = {
    empty: {
        plain: { lines: ['DROP DATABASE'], gone: true, note: 'কেউ নেই, তাই সাথে সাথে মুছে গেল। কোনো প্রশ্ন নেই, কোনো Recycle Bin নেই।' },
        ifexists: { lines: ['DROP DATABASE'], gone: true, note: 'Database টা ছিল, তাই IF EXISTS এর কোনো ভূমিকাই রইল না। সাধারণ DROP এর মতোই মুছে গেল।' },
        force: { lines: ['DROP DATABASE'], gone: true, note: 'থামানোর মতো কোনো Connection ছিল না, তাই FORCE চুপচাপ সাধারণ DROP এর মতো কাজ করল।' },
    },
    self: {
        plain: { lines: CURRENT, gone: false, note: 'যে ঘরে দাঁড়িয়ে আছেন, সেটা ভাঙা যায় না। আগে \\c postgres দিয়ে বেরিয়ে আসুন।' },
        ifexists: { lines: CURRENT, gone: false, note: 'IF EXISTS শুধু “নেই” এর Error ঢাকে। Database আছে, আপনি ভেতরে, তাই একই Error।' },
        force: { lines: CURRENT, gone: false, note: 'FORCE অন্যদের Connection বন্ধ করে, আপনার নিজেরটা না। এখানেও আগে বের হতে হবে।' },
    },
    other: {
        plain: { lines: BUSY, gone: false, note: 'PostgreSQL কয়েক সেকেন্ড অপেক্ষা করে দেখে অন্যজন বের হন কিনা, তারপর হাল ছেড়ে দেয়। Data নিরাপদ, কিছুই মোছেনি।' },
        ifexists: { lines: BUSY, gone: false, note: 'IF EXISTS এখানেও কিছু বদলায় না। সমস্যা “নেই” না, সমস্যা “কেউ ভেতরে আছেন”।' },
        force: {
            lines: ['DROP DATABASE'],
            gone: true,
            other: TERMINATED,
            note: 'PostgreSQL 13 থেকে আসা FORCE অন্যজনের Connection কেটে দিয়ে তারপর মুছেছে। ডান দিকে দেখুন, অন্য Window তে পরের Query টাই ব্যর্থ। তাঁকে আগে জানিয়ে তারপর এটা চালাবেন।',
        },
    },
    missing: {
        plain: { lines: MISSING, gone: false, note: 'যা নেই তা মোছা যায় না। Script এর মাঝে এমন হলে বাকি Script থেমে যেতে পারে।' },
        ifexists: {
            lines: ['NOTICE:  database "createdb_lab" does not exist, skipping', 'DROP DATABASE'],
            gone: false,
            note: 'Error এর বদলে একটা NOTICE, আর কাজ সফল বলে ধরা হয়। বারবার চালানো Script এর জন্য ঠিক এটাই দরকার।',
        },
        force: { lines: MISSING, gone: false, note: 'FORCE শুধু Connection এর ব্যাপারে। নেই এমন Database এর Error ঢাকতে IF EXISTS লাগে, দুটো একসাথেও লেখা যায়।' },
    },
};

/**
 * Four situations times three ways of writing DROP DATABASE: the reader sees
 * the real psql reply, whether the database survived, and, for FORCE with a
 * second session, what that other session sees on its next query.
 */
export function CreatedbDropLab() {
    const reduce = useReducedMotion();
    const [situation, setSituation] = useState<Situation>('other');
    const [variant, setVariant] = useState<Variant>('plain');
    const outcome = OUTCOMES[situation][variant];
    const sql = VARIANTS.find(v => v.id === variant)?.sql ?? '';
    const prompt = situation === 'self' ? 'createdb_lab=#' : 'postgres=#';
    const detail = SITUATIONS.find(s => s.id === situation)?.detail ?? '';

    return (
        <Panel
            label='Lab'
            title='DROP DATABASE: কখন মোছে, কখন থামে'
            footer='বারোটা ঘরের প্রতিটা PostgreSQL 18.6 এ চালিয়ে দেখা, Error আর NOTICE এর লেখা হুবহু psql এর। “আরেকজন Connect করা” অবস্থাটা বানানো হয়েছিল আরেকটা psql Window খোলা রেখে।'>
            <div className='flex flex-wrap gap-2 mb-3'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground self-center mr-1'>
                    অবস্থা
                </span>
                {SITUATIONS.map(s => (
                    <button
                        key={s.id}
                        type='button'
                        data-situation={s.id}
                        onClick={() => setSituation(s.id)}
                        aria-pressed={situation === s.id}
                        className={cn(BTN, situation === s.id ? BTN_ON : BTN_OFF)}>
                        {s.label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground self-center mr-1'>
                    Command
                </span>
                {VARIANTS.map(v => (
                    <button
                        key={v.id}
                        type='button'
                        data-variant={v.id}
                        onClick={() => setVariant(v.id)}
                        aria-pressed={variant === v.id}
                        className={cn(BTN, 'font-mono', variant === v.id ? BTN_ON : BTN_OFF)}>
                        {v.sql}
                    </button>
                ))}
            </div>

            <p className='text-[0.8125rem] text-muted-foreground mb-3'>{detail}</p>

            <div
                className='grid grid-cols-1 lg:grid-cols-2 gap-6'
                data-situation-active={situation}
                data-variant-active={variant}
                data-gone={outcome.gone ? 'yes' : 'no'}>
                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        আপনার psql
                    </p>
                    <motion.pre
                        key={`${situation}-${variant}`}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        <span className='text-muted-foreground'>{prompt} </span>
                        {sql}
                        {'\n'}
                        {outcome.lines.map(line => (
                            <span
                                key={line}
                                className={cn(
                                    'block',
                                    line.startsWith('ERROR') || line.startsWith('DETAIL')
                                        ? 'text-destructive'
                                        : line.startsWith('NOTICE')
                                          ? 'text-muted-foreground'
                                          : 'text-primary font-bold'
                                )}>
                                {line}
                            </span>
                        ))}
                    </motion.pre>
                    <p className='text-[0.8125rem] leading-relaxed text-foreground'>{outcome.note}</p>
                </div>

                <div className='space-y-3'>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        ফলাফল
                    </p>
                    <div
                        className={cn(
                            'border px-4 py-3 font-mono text-[0.75rem]',
                            outcome.gone ? 'border-destructive/60 bg-destructive/5' : 'border-primary/60 bg-primary/5'
                        )}>
                        createdb_lab:{' '}
                        <span className={cn('font-bold', outcome.gone ? 'text-destructive' : 'text-primary')}>
                            {situation === 'missing' ? 'আগে থেকেই নেই' : outcome.gone ? 'চিরতরে মুছে গেছে' : 'অক্ষত আছে'}
                        </span>
                    </div>
                    {outcome.other ? (
                        <>
                            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground pt-2'>
                                অন্য Window, পরের Query তে
                            </p>
                            <motion.pre
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: reduce ? 0 : 0.2, ease: EASE }}
                                className='overflow-x-auto border border-destructive/50 bg-destructive/5 px-4 py-3 font-mono text-[0.6875rem] leading-relaxed text-foreground'>
                                <span className='text-muted-foreground'>createdb_lab=&gt; </span>
                                SELECT count(*) FROM pg_class;
                                {'\n'}
                                {outcome.other.map((line, i) => (
                                    <span key={`${i}-${line}`} className='block text-destructive'>
                                        {line}
                                    </span>
                                ))}
                                <span className='block text-muted-foreground'>!?&gt;</span>
                            </motion.pre>
                        </>
                    ) : (
                        <p className='text-[0.8125rem] leading-relaxed text-muted-foreground'>
                            {situation === 'other'
                                ? 'অন্য Window এর মানুষটি কিছুই টের পাননি, তাঁর কাজ চলছে।'
                                : 'অন্য কোনো Window এর ওপর এর কোনো প্রভাব নেই।'}
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    );
}
