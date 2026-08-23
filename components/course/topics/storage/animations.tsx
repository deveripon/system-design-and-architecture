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
/* 1. The same four reads, on a disk that moves and one that does not         */
/* ------------------------------------------------------------------------- */

/** Where the four wanted pieces sit on the platter, in track numbers. */
const TRACKS = [2, 7, 1, 6];
const HDD_MS = 9.5;
const SSD_MS = 0.12;

export function SeekRaceLab() {
    const reduce = useReducedMotion();
    const [done, setDone] = useState(0);
    const [playing, setPlaying] = useState(false);

    const finished = done >= TRACKS.length;
    // Derived, not stored. Reaching the end stops the run on its own, so the
    // effect never has to reach back and flip state.
    const running = playing && !finished;

    // Step wraps around, autoplay stops at the end.
    const step = useCallback(
        () => setDone(d => (d >= TRACKS.length ? 0 : d + 1)),
        []
    );
    const advance = useCallback(
        () => setDone(d => Math.min(d + 1, TRACKS.length)),
        []
    );

    useEffect(() => {
        if (!running) return;
        const id = setTimeout(advance, 1100);
        return () => clearTimeout(id);
    }, [running, done, advance]);

    const armTrack = done === 0 ? 0 : TRACKS[done - 1];
    const angle = -60 + armTrack * 9;

    return (
        <Panel
            label='Animation story'
            title='একই চারটা পড়া, দুই রকম Disk'
            footer='HDD এর হাতটা প্রতিবার নতুন জায়গায় যেতে হয়, আর সেই নড়াচড়াটাই সময় খায়। SSD এর কিছু নড়ে না, তাই চারটা পড়া প্রায় একসাথেই শেষ হয়ে যায়।'>
            <div className='flex flex-wrap items-center gap-2 mb-8'>
                <button
                    onClick={() => {
                        if (finished) setDone(0);
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
                        setPlaying(false);
                        setDone(0);
                    }}
                    aria-label='Reset'
                    className='inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <RotateCcw className='w-3 h-3' />
                </button>
                <span className='ml-auto font-mono text-[10px] text-muted-foreground tabular-nums'>
                    {toBn(done)} / {toBn(TRACKS.length)} পড়া শেষ
                </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* the platter */}
                <div className='border border-border bg-background p-4'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3'>
                        HDD
                    </span>
                    <div className='relative mx-auto w-44 h-44'>
                        <motion.div
                            animate={reduce ? {} : { rotate: running ? 360 : 0 }}
                            transition={{
                                duration: 1.6,
                                ease: 'linear',
                                repeat: running ? Infinity : 0,
                            }}
                            className='absolute inset-0 border border-border rounded-full'>
                            <span className='absolute left-1/2 top-1 w-1.5 h-1.5 -translate-x-1/2 bg-primary rounded-full' />
                        </motion.div>
                        <div className='absolute inset-8 border border-border/60 rounded-full' />
                        <div className='absolute inset-16 border border-border/40 rounded-full' />
                        <div className='absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/60 rounded-full' />

                        {/* the arm */}
                        <motion.div
                            animate={{ rotate: angle }}
                            transition={{ duration: reduce ? 0 : 0.75, ease: EASE }}
                            style={{ transformOrigin: '92% 50%' }}
                            className='absolute left-0 right-0 top-1/2 h-0.5 bg-primary'>
                            <span className='absolute left-2 -top-1 w-2 h-2 bg-primary rounded-full' />
                        </motion.div>
                    </div>
                    <p className='mt-4 text-center font-mono text-lg font-bold text-primary tabular-nums'>
                        {(done * HDD_MS).toFixed(1)} ms
                    </p>
                </div>

                {/* the flash grid */}
                <div className='border border-border bg-background p-4'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3'>
                        SSD
                    </span>
                    <div className='grid grid-cols-4 gap-1.5'>
                        {Array.from({ length: 16 }).map((_, i) => {
                            const wanted = TRACKS.includes(i);
                            const read = wanted && TRACKS.indexOf(i) < done;
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: read ? 1 : wanted ? 0.55 : 0.2,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        'h-9 border',
                                        read
                                            ? 'border-primary bg-primary/25'
                                            : 'border-border'
                                    )}
                                />
                            );
                        })}
                    </div>
                    <p className='mt-4 text-center font-mono text-lg font-bold text-primary tabular-nums'>
                        {(done * SSD_MS).toFixed(2)} ms
                    </p>
                </div>
            </div>

            {finished && (
                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className='mt-6 border-l-2 border-primary pl-4 text-sm leading-relaxed'>
                    চারটা ছড়ানো পড়ায় HDD নিল{' '}
                    <strong>{(TRACKS.length * HDD_MS).toFixed(1)} ms</strong>, আর
                    SSD নিল{' '}
                    <strong>{(TRACKS.length * SSD_MS).toFixed(2)} ms</strong>।
                    একটা Page লোড করতে যদি এমন হাজারটা পড়া লাগে, তাহলে তফাতটা
                    সেকেন্ডের হিসাবে চলে আসে।
                </motion.p>
            )}
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Walking a path down to the blocks                                      */
/* ------------------------------------------------------------------------- */

const LOOKUP = [
    {
        title: '/ থেকে শুরু',
        detail: 'Filesystem জানে root ফোল্ডারের inode নম্বর, তাই যাত্রা এখান থেকেই শুরু হয়।',
        show: '/',
    },
    {
        title: 'var খুঁজে বের করা',
        detail: 'root এর তালিকায় var নামটা খুঁজে তার inode নম্বর পাওয়া গেল।',
        show: '/var',
    },
    {
        title: 'www খুঁজে বের করা',
        detail: 'var এর তালিকায় www আছে কিনা দেখা হলো। প্রতিটা ধাপে একবার Disk এ যেতে হয়।',
        show: '/var/www',
    },
    {
        title: 'tours খুঁজে বের করা',
        detail: 'আরেক ধাপ নিচে। পথ যত লম্বা, তত বেশি ধাপ।',
        show: '/var/www/tours',
    },
    {
        title: 'logo.png এর inode',
        detail: 'অবশেষে ফাইলটার inode পাওয়া গেল। এখানে লেখা আছে সাইজ, মালিক আর Block তালিকা।',
        show: '/var/www/tours/logo.png',
    },
    {
        title: 'Block থেকে ডেটা',
        detail: 'inode এর তালিকা ধরে Block গুলো পড়া হলো। এবার আসল ছবিটা হাতে এলো।',
        show: 'Block 1204, 1211, 1218, 1225',
    },
];

export function FileLookupLab() {
    const reduce = useReducedMotion();
    const [i, setI] = useState(0);
    const step = LOOKUP[i];

    return (
        <Panel
            label='Try it'
            title='একটা ফাইল খুঁজে পাওয়ার পথ'
            footer='খেয়াল করুন, পথের প্রতিটা অংশের জন্য আলাদা একটা খোঁজ লাগে। এই কারণেই খুব গভীরে লুকানো ফাইল পড়া তুলনামূলক ধীর, আর এই কারণেই Filesystem এই খোঁজগুলো RAM এ Cache করে রাখে।'>
            <div className='flex flex-wrap items-center gap-2 mb-6'>
                {LOOKUP.map((s, idx) => (
                    <button
                        key={s.title}
                        onClick={() => setI(idx)}
                        className={cn(
                            'w-8 h-8 border font-mono text-[11px] tabular-nums transition-colors',
                            idx === i
                                ? 'border-primary bg-primary/10 text-primary'
                                : idx < i
                                  ? 'border-border text-muted-foreground'
                                  : 'border-border text-muted-foreground/50'
                        )}>
                        {toBn(idx + 1)}
                    </button>
                ))}
                <button
                    onClick={() => setI(v => (v + 1) % LOOKUP.length)}
                    className='ml-auto inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors'>
                    <SkipForward className='w-3 h-3' />
                    পরের ধাপ
                </button>
            </div>

            <div className='border border-border bg-background p-5'>
                <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3'>
                    এখন কোথায়
                </span>
                <motion.p
                    key={step.show}
                    initial={reduce ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className='font-mono text-base md:text-lg text-primary break-all'>
                    {step.show}
                </motion.p>
            </div>

            <div className='mt-5 border-l-2 border-primary pl-4'>
                <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}>
                    <p className='text-base font-bold leading-snug'>{step.title}</p>
                    <p className='text-sm text-muted-foreground leading-relaxed mt-2'>
                        {step.detail}
                    </p>
                </motion.div>
            </div>
        </Panel>
    );
}
