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
/* 2. Waiting one after another, or waiting together                         */
/* ------------------------------------------------------------------------- */

const REQUESTS = [
    { name: 'Request ১', work: 1, wait: 3 },
    { name: 'Request ২', work: 1, wait: 3 },
    { name: 'Request ৩', work: 1, wait: 3 },
];

export function BlockingVsAsyncLab() {
    const reduce = useReducedMotion();
    const [async_, setAsync] = useState(true);

    // Blocking: everything queues up. Async: the waits overlap.
    const total = async_
        ? REQUESTS.reduce((sum, r) => sum + r.work, 0) + 3
        : REQUESTS.reduce((sum, r) => sum + r.work + r.wait, 0);

    const rows = REQUESTS.map((r, i) => {
        const start = async_ ? i * r.work : i * (r.work + r.wait);
        return { ...r, start };
    });
    const scale = 100 / Math.max(total, 1);

    return (
        <Panel
            label='Try it'
            title='একই তিনটা Request, দুই রকম সার্ভার'
            footer='কাজের পরিমাণ দুইটাতেই সমান। তফাতটা শুধু অপেক্ষার সময়টা কাজে লাগানো হলো কিনা তাতে। Node.js ঠিক এই কারণেই এক Thread দিয়ে হাজারটা Connection সামলাতে পারে।'>
            <div className='flex flex-wrap items-center gap-2 mb-8'>
                <button
                    onClick={() => setAsync(false)}
                    className={cn(
                        'px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors',
                        !async_
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:text-foreground'
                    )}>
                    Blocking
                </button>
                <button
                    onClick={() => setAsync(true)}
                    className={cn(
                        'px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors',
                        async_
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:text-foreground'
                    )}>
                    Non blocking
                </button>
                <span className='ml-auto font-mono text-[10px] text-muted-foreground'>
                    এক Thread, তিনটা Request
                </span>
            </div>

            <div className='space-y-3'>
                {rows.map(r => (
                    <div key={r.name} className='flex items-center gap-3'>
                        <span className='font-mono text-[10px] text-muted-foreground w-20 shrink-0'>
                            {r.name}
                        </span>
                        <div className='flex-1 h-8 bg-muted/30 border border-border relative overflow-hidden'>
                            <motion.div
                                animate={{
                                    left: `${r.start * scale}%`,
                                    width: `${r.work * scale}%`,
                                }}
                                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                                className='absolute inset-y-0 bg-primary/70 border-r border-primary'
                            />
                            <motion.div
                                animate={{
                                    left: `${(r.start + r.work) * scale}%`,
                                    width: `${r.wait * scale}%`,
                                }}
                                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                                className='absolute inset-y-0 bg-muted-foreground/15 border border-dashed border-border'
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground'>
                <span className='flex items-center gap-2'>
                    <span className='w-4 h-3 bg-primary/70' />
                    CPU সত্যিই কাজ করছে
                </span>
                <span className='flex items-center gap-2'>
                    <span className='w-4 h-3 bg-muted-foreground/15 border border-dashed border-border' />
                    Database এর উত্তরের অপেক্ষা
                </span>
                <span className='ml-auto font-mono text-sm text-primary font-bold'>
                    মোট: {toBn(total)} একক সময়
                </span>
            </div>

            <p className='mt-5 text-sm text-muted-foreground leading-relaxed'>
                {async_
                    ? 'অপেক্ষার সময় Thread টা খালি বসে নেই, সে পরের Request ধরছে। তাই তিনটা অপেক্ষা একসাথে চলছে।'
                    : 'একটা Request অপেক্ষায় থাকলে Thread ও দাঁড়িয়ে থাকছে। তিনজনের অপেক্ষা একটার পর একটা যোগ হচ্ছে।'}
            </p>
        </Panel>
    );
}
