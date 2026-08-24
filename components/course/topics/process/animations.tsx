'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
                <span className='font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary'>
                    {label}
                </span>
                <span className='font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground'>
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

/* ------------------------------------------------------------------------- */
/* 1. Two threads, one seat, and what a Lock changes                         */
/* ------------------------------------------------------------------------- */

type Frame = {
    a: string | null;
    b: string | null;
    seats: number;
    booked: number;
    note: string;
};

const UNSAFE: Frame[] = [
    { a: 'seat পড়ল: ১', b: null, seats: 1, booked: 0, note: 'Thread A দেখল একটা Seat খালি আছে।' },
    { a: null, b: 'seat পড়ল: ১', seats: 1, booked: 0, note: 'ঠিক তখনই Thread B ও দেখল একটা Seat খালি। A এখনো কিছু লেখেনি।' },
    { a: 'লিখল: ০', b: null, seats: 0, booked: 1, note: 'A বুকিং লিখে Seat শূন্য করে দিল।' },
    { a: null, b: 'লিখল: ০', seats: 0, booked: 2, note: 'B ও তাই করল, কারণ সে পুরনো সংখ্যাটা ধরে বসে ছিল।' },
    { a: null, b: null, seats: 0, booked: 2, note: 'একটা Seat, অথচ দুইটা Booking। কেউ ভুল কোড লেখেনি।' },
];

const SAFE: Frame[] = [
    { a: 'Lock নিল', b: null, seats: 1, booked: 0, note: 'Thread A আগে Lock নিল। এখন এই Seat টা তার হাতে।' },
    { a: 'seat পড়ল: ১', b: 'Lock এর অপেক্ষায়', seats: 1, booked: 0, note: 'B ও কাজ শুরু করতে চায়, কিন্তু Lock খালি না হওয়া পর্যন্ত তাকে দাঁড়িয়ে থাকতে হবে।' },
    { a: 'লিখল: ০, Lock ছাড়ল', b: 'Lock এর অপেক্ষায়', seats: 0, booked: 1, note: 'A কাজ শেষ করে Lock ছেড়ে দিল।' },
    { a: null, b: 'seat পড়ল: ০', seats: 0, booked: 1, note: 'এবার B পড়ল, আর এবার সে আসল সংখ্যাটাই পেল।' },
    { a: null, b: 'Booking বাতিল', seats: 0, booked: 1, note: 'Seat নেই দেখে B ভদ্রভাবে না বলে দিল। এটাই সঠিক ফল।' },
];

export function RaceConditionLab() {
    const reduce = useReducedMotion();
    const [safe, setSafe] = useState(false);
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(false);

    const frames = safe ? SAFE : UNSAFE;
    const finished = i >= frames.length - 1;
    const running = playing && !finished;

    const step = useCallback(
        () => setI(v => (v >= frames.length - 1 ? 0 : v + 1)),
        [frames.length]
    );
    const advance = useCallback(
        () => setI(v => Math.min(v + 1, frames.length - 1)),
        [frames.length]
    );

    useEffect(() => {
        if (!running) return;
        const id = setTimeout(advance, 1600);
        return () => clearTimeout(id);
    }, [running, i, advance]);

    const frame = frames[i];
    const broken = !safe && frame.booked > 1;

    return (
        <Panel
            label='Animation story'
            title='শেষ Seat টা দুইজনকে বিক্রি হলো কীভাবে'
            footer='Lock দিলে ফল সঠিক হয়, কিন্তু B কে দাঁড়িয়ে থাকতে হয়। এই অপেক্ষাটাই Lock এর দাম। তাই Lock যত ছোট জায়গায় রাখা যায় তত ভালো, আর যত বেশি Thread একই Lock এর জন্য লাইনে দাঁড়ায়, তত ধীর হয়।'>
            <div className='flex flex-wrap items-center gap-2 mb-8'>
                <button
                    onClick={() => {
                        if (finished) setI(0);
                        setPlaying(p => !p);
                    }}
                    className='inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors'>
                    {running ? <Pause className='w-3 h-3' /> : <Play className='w-3 h-3' />}
                    {running ? 'Pause' : finished ? 'আবার' : 'Play'}
                </button>
                <button
                    onClick={() => {
                        setPlaying(false);
                        step();
                    }}
                    className='inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <SkipForward className='w-3 h-3' />
                    Step
                </button>
                <button
                    onClick={() => {
                        setSafe(s => !s);
                        setI(0);
                        setPlaying(false);
                    }}
                    className={cn(
                        'px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors',
                        safe
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-muted-foreground hover:text-foreground'
                    )}>
                    {safe ? 'Lock আছে' : 'Lock নেই'}
                </button>
                <button
                    onClick={() => {
                        setPlaying(false);
                        setI(0);
                    }}
                    aria-label='Reset'
                    className='inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <RotateCcw className='w-3 h-3' />
                </button>
            </div>

            <div className='space-y-2'>
                {(['a', 'b'] as const).map(key => {
                    const text = frame[key];
                    const waiting = text?.includes('অপেক্ষা');
                    return (
                        <div
                            key={key}
                            className={cn(
                                'flex items-center gap-4 px-4 py-3 border transition-colors duration-200',
                                text
                                    ? waiting
                                        ? 'border-border bg-muted/30'
                                        : 'border-primary bg-primary/10'
                                    : 'border-border bg-background'
                            )}>
                            <span className='font-mono text-xs font-bold w-24 text-muted-foreground'>
                                Thread {key.toUpperCase()}
                            </span>
                            <motion.span
                                key={`${safe}-${i}-${key}`}
                                initial={reduce || !text ? false : { opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className={cn(
                                    'text-sm',
                                    text ? 'text-foreground' : 'text-muted-foreground/40'
                                )}>
                                {text ?? 'বসে আছে'}
                            </motion.span>
                        </div>
                    );
                })}
            </div>

            <div className='mt-6 grid grid-cols-2 gap-px bg-border border border-border'>
                <div className='bg-card px-4 py-3'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                        Database এ Seat
                    </span>
                    <span className='block text-xl font-bold tabular-nums'>
                        {toBn(frame.seats)}
                    </span>
                </div>
                <div className='bg-card px-4 py-3'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                        মোট Booking
                    </span>
                    <span
                        className={cn(
                            'block text-xl font-bold tabular-nums',
                            broken ? 'text-red-700 dark:text-red-400' : 'text-primary'
                        )}>
                        {toBn(frame.booked)}
                    </span>
                </div>
            </div>

            <div className='mt-5 border-l-2 border-primary pl-4 min-h-12'>
                <motion.p
                    key={`${safe}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className='text-sm leading-relaxed'>
                    {frame.note}
                </motion.p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Which technique helps, and when                                        */
/* ------------------------------------------------------------------------- */

type Seg = { start: number; len: number; wait?: boolean };
type Lane = { name: string; segs: Seg[] };
type Scenario = {
    key: string;
    title: string;
    badge: string;
    isConcurrency?: boolean;
    isParallelism?: boolean;
    requests: Lane[];
    workers: Lane[];
    total: number;
};

/**
 * Three schedules for the same three requests, built from the work and wait
 * each request needs. The numbers are what make the point: concurrency only
 * pays off when there is waiting to overlap.
 */
function buildScenarios(work: number, wait: number): Scenario[] {
    const ids = [0, 1, 2];
    const label = (i: number) => `Request ${toBn(i + 1)}`;

    // one thread, nothing overlaps
    const seqStart = (i: number) => i * (work + wait);
    const sequential: Scenario = {
        key: 'sequential',
        title: 'একটার পর একটা',
        badge: 'কোনোটাই নয়',
        requests: ids.map(i => ({
            name: label(i),
            segs: [
                { start: seqStart(i), len: work },
                { start: seqStart(i) + work, len: wait, wait: true },
            ],
        })),
        workers: [
            {
                name: 'Thread ১',
                segs: ids.map(i => ({ start: seqStart(i), len: work })),
            },
        ],
        total: 3 * (work + wait),
    };

    // one thread, waits overlap
    const concurrent: Scenario = {
        key: 'concurrent',
        title: 'এক Thread, অপেক্ষা ওভারল্যাপ',
        badge: 'CONCURRENCY',
        isConcurrency: true,
        requests: ids.map(i => ({
            name: label(i),
            segs: [
                { start: i * work, len: work },
                { start: (i + 1) * work, len: wait, wait: true },
            ],
        })),
        workers: [
            {
                name: 'Thread ১',
                segs: ids.map(i => ({ start: i * work, len: work })),
            },
        ],
        total: 3 * work + wait,
    };

    // two cores, work really happens at the same time
    const coreOf = (i: number) => i % 2;
    const slotOf = (i: number) => Math.floor(i / 2) * work;
    const parallel: Scenario = {
        key: 'parallel',
        title: 'দুইটা Core',
        badge: 'PARALLELISM',
        isParallelism: true,
        requests: ids.map(i => ({
            name: label(i),
            segs: [
                { start: slotOf(i), len: work },
                { start: slotOf(i) + work, len: wait, wait: true },
            ],
        })),
        workers: [0, 1].map(c => ({
            name: `Core ${toBn(c + 1)}`,
            segs: ids
                .filter(i => coreOf(i) === c)
                .map(i => ({ start: slotOf(i), len: work })),
        })),
        total: 2 * work + wait,
    };

    return [sequential, concurrent, parallel];
}

const WORK_TYPES = {
    io: {
        label: 'অপেক্ষার কাজ',
        hint: 'Database এর উত্তরের অপেক্ষা',
        work: 1,
        wait: 3,
        verdict:
            'সময়ের বেশিরভাগটাই অপেক্ষা, তাই Concurrency এখানেই সবচেয়ে বড় লাফ দেয়। Core বাড়িয়ে এর চেয়ে খুব বেশি কিছু পাওয়া যায় না, কারণ CPU তো এমনিতেই খালি বসে ছিল।',
    },
    cpu: {
        label: 'CPU এর কাজ',
        hint: 'ছবি Resize করা',
        work: 3,
        wait: 0,
        verdict:
            'এখানে অপেক্ষা বলে কিছু নেই, তাই Concurrency এক ফোঁটাও সাহায্য করল না। এক Thread যতবার খুশি হাত বদলাক, কাজের পরিমাণ একই থাকে। এই জায়গায় Parallelism ছাড়া উপায় নেই।',
    },
} as const;

export function ConcurrencyVsParallelismLab() {
    const reduce = useReducedMotion();
    const [type, setType] = useState<keyof typeof WORK_TYPES>('io');

    const cfg = WORK_TYPES[type];
    const scenarios = buildScenarios(cfg.work, cfg.wait);
    const scale = 100 / Math.max(...scenarios.map(s => s.total));

    return (
        <Panel
            label='Try it'
            title='কোন কৌশল কখন কাজে লাগে'
            footer='একই তিনটা Request, একই কাজ, শুধু সাজানোর ধরন আলাদা। মনে রাখার কথাটা হলো, Concurrency অপেক্ষা কাজে লাগায় আর Parallelism হাত বাড়ায়। যেখানে অপেক্ষা নেই, সেখানে Concurrency কিছুই দিতে পারে না।'>
            <div className='flex flex-wrap items-center gap-2 mb-8'>
                {(Object.keys(WORK_TYPES) as (keyof typeof WORK_TYPES)[]).map(k => (
                    <button
                        key={k}
                        onClick={() => setType(k)}
                        className={cn(
                            'px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors',
                            k === type
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                        )}>
                        {WORK_TYPES[k].label}
                    </button>
                ))}
                <span className='ml-auto font-mono text-[10px] text-muted-foreground'>
                    {cfg.hint}
                </span>
            </div>

            <div className='space-y-4'>
                {scenarios.map(sc => (
                    <div
                        key={sc.key}
                        className={cn(
                            'border p-4',
                            sc.isConcurrency || sc.isParallelism
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-border bg-background'
                        )}>
                        <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4'>
                            <span
                                className={cn(
                                    'font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1',
                                    sc.isConcurrency || sc.isParallelism
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                )}>
                                {sc.badge}
                            </span>
                            <span className='text-sm font-bold'>{sc.title}</span>
                            <motion.span
                                key={`${type}-${sc.key}`}
                                initial={reduce ? false : { opacity: 0.4 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className='ml-auto font-mono text-sm font-bold text-primary tabular-nums'>
                                মোট {toBn(sc.total)} একক
                            </motion.span>
                        </div>

                        {/* what each request experiences */}
                        {sc.requests.map(lane => (
                            <div key={lane.name} className='flex items-center gap-3 mb-1.5'>
                                <span className='font-mono text-[10px] text-muted-foreground w-20 shrink-0'>
                                    {lane.name}
                                </span>
                                <div className='flex-1 h-6 bg-muted/20 border border-border relative'>
                                    {lane.segs.map((seg, i) =>
                                        seg.len > 0 ? (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    left: `${seg.start * scale}%`,
                                                    width: `${seg.len * scale}%`,
                                                }}
                                                transition={{
                                                    duration: reduce ? 0 : 0.45,
                                                    ease: EASE,
                                                }}
                                                className={cn(
                                                    'absolute inset-y-0',
                                                    seg.wait
                                                        ? 'bg-muted-foreground/15 border border-dashed border-border'
                                                        : 'bg-primary/70'
                                                )}
                                            />
                                        ) : null
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* who is actually busy */}
                        <div className='mt-3 pt-3 border-t border-border/60'>
                            {sc.workers.map(lane => (
                                <div key={lane.name} className='flex items-center gap-3 mb-1.5'>
                                    <span className='font-mono text-[10px] font-bold text-foreground/80 w-20 shrink-0'>
                                        {lane.name}
                                    </span>
                                    <div className='flex-1 h-6 bg-muted/20 border border-border relative'>
                                        {lane.segs.map((seg, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    left: `${seg.start * scale}%`,
                                                    width: `${seg.len * scale}%`,
                                                }}
                                                transition={{
                                                    duration: reduce ? 0 : 0.45,
                                                    ease: EASE,
                                                }}
                                                className='absolute inset-y-0 bg-primary'
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground'>
                <span className='flex items-center gap-2'>
                    <span className='w-4 h-3 bg-primary/70' />
                    Request এর কাজ চলছে
                </span>
                <span className='flex items-center gap-2'>
                    <span className='w-4 h-3 bg-muted-foreground/15 border border-dashed border-border' />
                    অপেক্ষা
                </span>
                <span className='flex items-center gap-2'>
                    <span className='w-4 h-3 bg-primary' />
                    Thread বা Core ব্যস্ত
                </span>
            </div>

            <motion.p
                key={type}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='mt-5 border-l-2 border-primary pl-4 text-sm leading-relaxed'>
                {cfg.verdict}
            </motion.p>
        </Panel>
    );
}
