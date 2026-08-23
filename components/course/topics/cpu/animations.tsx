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
/* 1. The cycle, slow enough to watch                                        */
/* ------------------------------------------------------------------------- */

const PROGRAM = [
    { text: 'LOAD 5', explain: 'Memory থেকে ৫ এনে Register-এ রাখা' },
    { text: 'ADD 3', explain: 'Register-এর মানের সাথে ৩ যোগ করা' },
    { text: 'STORE', explain: 'ফলটা Memory-তে লিখে রাখা' },
];
const STAGES = ['FETCH', 'DECODE', 'EXECUTE', 'STORE'] as const;
const SPEEDS = [
    { label: 'ধীর', ms: 1100 },
    { label: 'স্বাভাবিক', ms: 550 },
    { label: 'দ্রুত', ms: 220 },
];

export function ClockCycleLab() {
    const reduce = useReducedMotion();
    const [tick, setTick] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    const total = PROGRAM.length * STAGES.length;
    const step = useCallback(() => setTick(t => (t + 1) % total), [total]);

    useEffect(() => {
        if (!playing) return;
        const id = setTimeout(step, SPEEDS[speed].ms);
        return () => clearTimeout(id);
    }, [playing, tick, speed, step]);

    const pc = Math.floor(tick / STAGES.length);
    const stage = tick % STAGES.length;
    const instruction = PROGRAM[pc];

    // register value after however many instructions have finished
    const done = pc + (stage === 3 ? 1 : 0);
    const register = done === 0 ? 0 : done === 1 ? 5 : 8;

    return (
        <Panel
            label='Animation story'
            title='একটা Instruction চলতে দেখুন'
            footer='আসল CPU এই চক্রটা সেকেন্ডে কোটি কোটি বার ঘোরায়। এখানে ধীর করে দেখানো হয়েছে, তাই প্রতিটা ধাপ আলাদা করে বোঝা যায়।'>
            <div className='flex flex-wrap items-center gap-2 mb-8'>
                <button
                    onClick={() => setPlaying(p => !p)}
                    className='inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors'>
                    {playing ? <Pause className='w-3 h-3' /> : <Play className='w-3 h-3' />}
                    {playing ? 'Pause' : 'Play'}
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
                        setPlaying(false);
                        setTick(0);
                    }}
                    aria-label='Reset'
                    className='inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <RotateCcw className='w-3 h-3' />
                </button>
                <div className='flex ml-auto border border-border'>
                    {SPEEDS.map((s, i) => (
                        <button
                            key={s.label}
                            onClick={() => setSpeed(i)}
                            className={cn(
                                'px-3 py-2 text-[10px] font-mono uppercase tracking-[0.12em] transition-colors',
                                i === speed
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}>
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6'>
                {/* the program */}
                <div className='border border-border bg-background'>
                    <span className='block px-4 py-2 border-b border-border font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground'>
                        Program
                    </span>
                    <div className='p-3 space-y-1'>
                        {PROGRAM.map((ins, i) => (
                            <div
                                key={ins.text}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 border transition-colors duration-200',
                                    i === pc
                                        ? 'border-primary bg-primary/10'
                                        : 'border-transparent'
                                )}>
                                <span className='font-mono text-[10px] text-muted-foreground tabular-nums'>
                                    {toBn(i)}
                                </span>
                                <span
                                    className={cn(
                                        'font-mono text-sm',
                                        i === pc ? 'text-primary font-bold' : 'text-muted-foreground'
                                    )}>
                                    {ins.text}
                                </span>
                                {i === pc && (
                                    <span className='ml-auto font-mono text-[9px] uppercase tracking-[0.15em] text-primary'>
                                        PC
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* the four stages */}
                <div className='space-y-4'>
                    <div className='grid grid-cols-4 gap-px bg-border border border-border'>
                        {STAGES.map((s, i) => (
                            <div
                                key={s}
                                className={cn(
                                    'px-2 py-3 text-center transition-colors duration-200',
                                    i === stage
                                        ? 'bg-primary/15 text-primary'
                                        : 'bg-card text-muted-foreground/60'
                                )}>
                                <span className='block font-mono text-[9px] font-bold tracking-[0.1em]'>
                                    {s}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className='border border-border bg-background p-4 min-h-20'>
                        <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2'>
                            এখন কী হচ্ছে
                        </span>
                        <motion.p
                            key={tick}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className='text-sm leading-relaxed'>
                            {stage === 0 && `${instruction.text} Instruction টা Memory থেকে আনা হচ্ছে।`}
                            {stage === 1 && `CPU বুঝছে ${instruction.text} মানে কী: ${instruction.explain}।`}
                            {stage === 2 && `কাজটা করা হচ্ছে: ${instruction.explain}।`}
                            {stage === 3 && 'ফলটা রেখে দেওয়া হলো, এবার পরের Instruction।'}
                        </motion.p>
                    </div>

                    <div className='grid grid-cols-2 gap-px bg-border border border-border'>
                        <div className='bg-card px-4 py-3'>
                            <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                                Register A
                            </span>
                            <motion.span
                                key={register}
                                initial={reduce ? false : { opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                className='block text-xl font-bold text-primary tabular-nums'>
                                {toBn(register)}
                            </motion.span>
                        </div>
                        <div className='bg-card px-4 py-3'>
                            <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                                Cycle
                            </span>
                            <span className='block text-xl font-bold tabular-nums'>
                                {toBn(tick + 1)} / {toBn(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. What waiting actually costs                                            */
/* ------------------------------------------------------------------------- */

const LEVELS = [
    { name: 'Register', real: '০.৩ ন্যানোসেকেন্ড', human: '১ সেকেন্ড', bar: 4, note: 'CPU এর নিজের হাতের মধ্যে।' },
    { name: 'L1 Cache', real: '১ ন্যানোসেকেন্ড', human: '৩ সেকেন্ড', bar: 10, note: 'পাশের ড্রয়ার, হাত বাড়ালেই পাওয়া যায়।' },
    { name: 'RAM', real: '১০০ ন্যানোসেকেন্ড', human: '৫ মিনিট', bar: 34, note: 'ঘরের অন্য কোণে রাখা ফাইল।' },
    { name: 'SSD', real: '১৫০ মাইক্রোসেকেন্ড', human: '৬ দিন', bar: 68, note: 'অন্য শহর থেকে কুরিয়ারে আনা।' },
    { name: 'Internet', real: '১৫০ মিলিসেকেন্ড', human: '৫ বছর', bar: 100, note: 'অন্য মহাদেশ থেকে জাহাজে আনা।' },
];

export function LatencyScaleLab() {
    const reduce = useReducedMotion();
    const [picked, setPicked] = useState(2);
    const level = LEVELS[picked];

    return (
        <Panel
            label='Try it'
            title='অপেক্ষার আসল দাম'
            footer='সংখ্যাগুলো আনুমানিক এবং হার্ডওয়্যার অনুযায়ী বদলায়। আসল কথাটা হলো ব্যবধানটা: Register আর Internet এর তফাত কয়েক গুণ নয়, কয়েক কোটি গুণ।'>
            <div className='flex flex-wrap gap-2 mb-8'>
                {LEVELS.map((l, i) => (
                    <button
                        key={l.name}
                        onClick={() => setPicked(i)}
                        className={cn(
                            'px-3 py-2 border font-mono text-[10px] uppercase tracking-[0.12em] transition-colors',
                            i === picked
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                        )}>
                        {l.name}
                    </button>
                ))}
            </div>

            <div className='space-y-5'>
                <div className='h-6 bg-muted/40 border border-border overflow-hidden'>
                    <motion.div
                        animate={{ width: `${level.bar}%` }}
                        transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
                        className='h-full bg-primary/70'
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border'>
                    <div className='bg-card px-4 py-4'>
                        <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5'>
                            আসল সময়
                        </span>
                        <span className='block text-lg font-bold'>{level.real}</span>
                    </div>
                    <div className='bg-card px-4 py-4'>
                        <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5'>
                            CPU এর এক ধাপ যদি ১ সেকেন্ড হতো
                        </span>
                        <motion.span
                            key={level.human}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className='block text-lg font-bold text-primary'>
                            {level.human}
                        </motion.span>
                    </div>
                </div>

                <p className='text-sm text-muted-foreground leading-relaxed'>
                    {level.note}
                </p>
            </div>
        </Panel>
    );
}
