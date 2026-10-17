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
/* 1. একটা মান, তিনটা Column                                                     */
/* ------------------------------------------------------------------------- */

type Stored = { kind: 'ok'; value: string; len: number; bytes: number; note: string } | { kind: 'error'; message: string };

interface PadCase {
    label: string;
    /** What the INSERT sends, spaces included. */
    input: string;
    about: string;
    results: Record<'char' | 'varchar' | 'text', Stored>;
}

const TYPES: { key: 'char' | 'varchar' | 'text'; name: string }[] = [
    { key: 'char', name: 'char(5)' },
    { key: 'varchar', name: 'varchar(5)' },
    { key: 'text', name: 'text' },
];

const PAD_CASES: PadCase[] = [
    {
        label: "'CXB'",
        input: 'CXB',
        about: 'তিন অক্ষরের একটা কোড, পাঁচের কম।',
        results: {
            char: { kind: 'ok', value: 'CXB  ', len: 3, bytes: 5, note: 'বাকি দুই ঘর Space দিয়ে ভরা। Byte ৫, কিন্তু length বলে ৩, কারণ char এর শেষের Space গোনা হয় না।' },
            varchar: { kind: 'ok', value: 'CXB', len: 3, bytes: 3, note: 'যা এসেছে ঠিক তাই।' },
            text: { kind: 'ok', value: 'CXB', len: 3, bytes: 3, note: 'যা এসেছে ঠিক তাই।' },
        },
    },
    {
        label: "'CXB  '",
        input: 'CXB  ',
        about: 'একই কোড, শেষে দুটো Space সহ, যেমন Form থেকে অনেক সময় আসে।',
        results: {
            char: { kind: 'ok', value: 'CXB  ', len: 3, bytes: 5, note: "আগের মতোই। char এর কাছে 'CXB' আর 'CXB  ' একই জিনিস।" },
            varchar: { kind: 'ok', value: 'CXB  ', len: 5, bytes: 5, note: 'Space দুটো Data, রেখে দিল। length ৫।' },
            text: { kind: 'ok', value: 'CXB  ', len: 5, bytes: 5, note: 'Space দুটো Data, রেখে দিল। length ৫।' },
        },
    },
    {
        label: "'SAINTM'",
        input: 'SAINTM',
        about: 'ছয় অক্ষর, সীমার চেয়ে একটা বেশি।',
        results: {
            char: { kind: 'error', message: 'ERROR: value too long for type character(5)' },
            varchar: { kind: 'error', message: 'ERROR: value too long for type character varying(5)' },
            text: { kind: 'ok', value: 'SAINTM', len: 6, bytes: 6, note: 'text এর কোনো ঘোষিত সীমা নেই।' },
        },
    },
    {
        label: "'ABCDE   '",
        input: 'ABCDE   ',
        about: 'পাঁচ অক্ষর, তারপর তিনটা Space। মোট আট।',
        results: {
            char: { kind: 'ok', value: 'ABCDE', len: 5, bytes: 5, note: 'বাড়তি অংশটা শুধু Space, তাই Error না দিয়ে কেটে দিল। SQL Standard এর নিয়ম।' },
            varchar: { kind: 'ok', value: 'ABCDE', len: 5, bytes: 5, note: 'একই ব্যতিক্রম: বাড়তি শুধু Space হলে চুপচাপ কাটা।' },
            text: { kind: 'ok', value: 'ABCDE   ', len: 8, bytes: 8, note: 'সব রেখে দিল, Space সহ আট।' },
        },
    },
];

function Cells({ value }: { value: string }) {
    const chars = Array.from(value);
    return (
        <div className='flex flex-wrap gap-1'>
            {chars.map((ch, i) => (
                <span
                    key={i}
                    className={cn(
                        'inline-flex h-8 w-8 items-center justify-center border font-mono text-sm',
                        ch === ' '
                            ? 'border-dashed border-border text-muted-foreground/60'
                            : 'border-primary bg-primary/10 font-bold text-primary'
                    )}>
                    {ch === ' ' ? '␣' : ch}
                </span>
            ))}
        </div>
    );
}

/**
 * One value is inserted into a char(5), a varchar(5) and a text column. The
 * reader picks the value and sees what each column really keeps, or the exact
 * error it raises. Every outcome is a real PostgreSQL 18 result.
 */
export function PaddingLab() {
    const reduce = useReducedMotion();
    const [pick, setPick] = useState(0);
    const current = PAD_CASES[pick];

    return (
        <Panel
            label='Interactive'
            title='একটা মান, তিনটা Column'
            footer='প্রতিটা ফলাফল PostgreSQL 18 এ CREATE TABLE tt_pad (v char(5)) বা varchar(5) বা text, তারপর INSERT চালিয়ে নেওয়া। ␣ মানে একটা Space।'>
            <div className='flex flex-wrap gap-2 mb-4' role='group' aria-label='কোন মান Insert হবে'>
                {PAD_CASES.map((c, i) => (
                    <button
                        key={c.label}
                        type='button'
                        data-pad-case={i + 1}
                        aria-pressed={pick === i}
                        onClick={() => setPick(i)}
                        className={cn(BTN, 'font-mono', pick === i ? BTN_ON : BTN_OFF)}>
                        {c.label}
                    </button>
                ))}
            </div>

            <div className='mb-5 flex flex-wrap items-center gap-3'>
                <span className='font-mono text-[0.75rem] text-muted-foreground'>INSERT</span>
                <Cells value={current.input} />
                <span className='text-sm text-foreground/90'>{current.about}</span>
            </div>

            <motion.div
                key={current.label}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='grid grid-cols-1 lg:grid-cols-3 gap-4'
                data-pad-result={current.label}>
                {TYPES.map(t => {
                    const r = current.results[t.key];
                    return (
                        <div
                            key={t.key}
                            data-type={t.name}
                            data-outcome={r.kind}
                            className={cn('border p-4', r.kind === 'error' ? 'border-destructive/60 bg-destructive/5' : 'border-border')}>
                            <p className='font-mono text-[0.75rem] font-bold text-primary mb-3'>{t.name}</p>
                            {r.kind === 'ok' ? (
                                <>
                                    <Cells value={r.value} />
                                    <p className='mt-3 font-mono text-[0.6875rem] text-muted-foreground'>
                                        length {toBn(r.len)} · octet_length {toBn(r.bytes)}
                                    </p>
                                    <p className='mt-2 text-sm leading-relaxed text-foreground/90'>{r.note}</p>
                                </>
                            ) : (
                                <p className='font-mono text-[0.75rem] leading-relaxed text-destructive'>{r.message}</p>
                            )}
                        </div>
                    );
                })}
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Collation, কোন ক্রম                                                     */
/* ------------------------------------------------------------------------- */

type CollKey = 'C' | 'en_US.utf8' | 'und-x-icu' | 'bn-x-icu';

const COLLATIONS: { key: CollKey; where: string; box: 'yes' | 'like-c' | 'no' }[] = [
    { key: 'C', where: 'এই বক্সের Default, Code নম্বরের ক্রম', box: 'yes' },
    { key: 'en_US.utf8', where: 'সাধারণ Linux Server এর Default (libc)', box: 'like-c' },
    { key: 'und-x-icu', where: 'ICU, ভাষা নিরপেক্ষ Unicode নিয়ম', box: 'yes' },
    { key: 'bn-x-icu', where: 'ICU, বাংলা ভাষার নিয়ম', box: 'no' },
];

const BOX_NOTE: Record<'yes' | 'like-c' | 'no', string> = {
    yes: 'এই বক্সে চলে, একই ক্রম',
    'like-c': 'বক্সে নামটা আছে, কিন্তু C এর মতো সাজায়',
    no: 'বক্সে নেই, শুধু Server এ',
};

interface WordSet {
    label: string;
    orders: Record<CollKey, string[]>;
    lesson: string;
}

const EN_HUMAN = ['chattogram', "Cox's Bazar", 'dhaka', 'Dhaka', 'Sylhet', 'Zürich'];
const BN1_HUMAN = ['উখিয়া', 'উত্তরা', 'উৎসব', 'উথাল', 'উদয়'];
const BN2_ROOT = ['কক্সবাজার', 'কমলগঞ্জ', 'কংস নদ', 'কাপ্তাই', 'কুয়াকাটা'];
const BN2_BN = ['কংস নদ', 'কক্সবাজার', 'কমলগঞ্জ', 'কাপ্তাই', 'কুয়াকাটা'];

const WORD_SETS: WordSet[] = [
    {
        label: 'ইংরেজি শহর, যেমন Form এ টাইপ হয়',
        orders: {
            C: ["Cox's Bazar", 'Dhaka', 'Sylhet', 'Zürich', 'chattogram', 'dhaka'],
            'en_US.utf8': EN_HUMAN,
            'und-x-icu': EN_HUMAN,
            'bn-x-icu': EN_HUMAN,
        },
        lesson: 'C তে সব বড় হাত আগে, তারপর ছোট হাত, কারণ Code নম্বরে Z (90) এর পরে আসে c (99)। বাকি তিনটা মানুষের অভিধানের মতো, বড় ছোট হাত পাশাপাশি।',
    },
    {
        label: 'উ দিয়ে শুরু পাঁচটা বাংলা শব্দ',
        orders: {
            C: ['উখিয়া', 'উত্তরা', 'উথাল', 'উদয়', 'উৎসব'],
            'en_US.utf8': BN1_HUMAN,
            'und-x-icu': BN1_HUMAN,
            'bn-x-icu': BN1_HUMAN,
        },
        lesson: 'খণ্ড ত (ৎ) এর Code নম্বর U+09CE, বাংলার প্রায় সব অক্ষরের পরে। তাই C তে উৎসব একদম শেষে। Unicode এর নিয়ম ৎ কে ত এর সাথে বসায়, উত্তরার ঠিক পরে।',
    },
    {
        label: 'ক দিয়ে শুরু পাঁচটা জায়গা',
        orders: {
            C: BN2_BN,
            'en_US.utf8': BN2_ROOT,
            'und-x-icu': BN2_ROOT,
            'bn-x-icu': BN2_BN,
        },
        lesson: 'অনুস্বার (ং) কোথায় বসবে, সেখানে ভাষা নিরপেক্ষ নিয়ম আর বাংলার নিয়ম আলাদা। und-x-icu কংস নদ কে কমলগঞ্জের পরে রাখে, bn-x-icu রাখে সবার আগে। C এখানে কাকতালীয়ভাবে bn এর সাথে মেলে, কারণ ং এর Code নম্বর ছোট।',
    },
];

/**
 * The same handful of words sorted under four collations. The reader picks a
 * word set and a collation and watches the list rearrange; each order is the
 * real ORDER BY ... COLLATE result from PostgreSQL 18, and the badge says
 * whether the in-browser box can reproduce it.
 */
export function CollationSortLab() {
    const reduce = useReducedMotion();
    const [setIndex, setSetIndex] = useState(0);
    const [coll, setColl] = useState<CollKey>('C');
    const ws = WORD_SETS[setIndex];
    const order = ws.orders[coll];
    const meta = COLLATIONS.find(c => c.key === coll) ?? COLLATIONS[0];

    return (
        <Panel
            label='Interactive'
            title='একই শব্দ, চারটা Collation'
            footer='প্রতিটা ক্রম postgres:18 Container এ SELECT ... ORDER BY w COLLATE "নাম" চালিয়ে নেওয়া। বক্সের ব্যাজ বলে Query বক্সে একই ক্রম পাবেন কিনা।'>
            <div className='flex flex-wrap gap-2 mb-3' role='group' aria-label='কোন শব্দের সেট'>
                {WORD_SETS.map((s, i) => (
                    <button
                        key={s.label}
                        type='button'
                        data-word-set={i + 1}
                        aria-pressed={setIndex === i}
                        onClick={() => setSetIndex(i)}
                        className={cn(BTN, setIndex === i ? BTN_ON : BTN_OFF)}>
                        {s.label}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-2 mb-6' role='group' aria-label='কোন Collation'>
                {COLLATIONS.map(c => (
                    <button
                        key={c.key}
                        type='button'
                        data-collation={c.key}
                        aria-pressed={coll === c.key}
                        onClick={() => setColl(c.key)}
                        className={cn(BTN, 'font-mono', coll === c.key ? BTN_ON : BTN_OFF)}>
                        {c.key}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div>
                    <p className='font-mono text-[0.75rem] text-muted-foreground mb-2'>
                        ORDER BY w COLLATE &quot;{coll}&quot;
                    </p>
                    <ol className='space-y-1.5' data-sorted={order.join('|')}>
                        {order.map((w, i) => (
                            <motion.li
                                key={w}
                                layout={!reduce}
                                transition={{ duration: 0.45, ease: EASE }}
                                className='flex items-center gap-3 border border-border bg-background px-3 py-1.5'>
                                <span className='font-mono text-[0.6875rem] text-muted-foreground w-5'>{toBn(i + 1)}</span>
                                <span className='text-base text-foreground'>{w}</span>
                            </motion.li>
                        ))}
                    </ol>
                </div>
                <div className='space-y-3'>
                    <p className='text-sm leading-relaxed text-foreground/90'>
                        <span className='font-mono font-bold text-primary'>{meta.key}</span>: {meta.where}
                    </p>
                    <p
                        data-box={meta.box}
                        className={cn(
                            'inline-block border px-2 py-1 font-mono text-[0.6875rem]',
                            meta.box === 'yes' ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                        )}>
                        {BOX_NOTE[meta.box]}
                    </p>
                    <p className='text-sm leading-relaxed text-foreground/90'>{ws.lesson}</p>
                </div>
            </div>
        </Panel>
    );
}
