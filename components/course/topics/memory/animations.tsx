'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
/* 1. Frames arriving and leaving, one step at a time                        */
/* ------------------------------------------------------------------------- */

type Step = { note: string; frames: { fn: string; local: string }[] };

const STEPS: Step[] = [
    { note: 'Program শুরু হলো। main() Stack এ বসল।', frames: [{ fn: 'main()', local: 'name = "Ripon"' }] },
    {
        note: 'main() ডাকল greet(). নতুন Frame উপরে জমল।',
        frames: [
            { fn: 'main()', local: 'name = "Ripon"' },
            { fn: 'greet(name)', local: 'greeting তৈরি হচ্ছে' },
        ],
    },
    {
        note: 'greet() আবার ডাকল format(). Stack এখন তিন তলা।',
        frames: [
            { fn: 'main()', local: 'name = "Ripon"' },
            { fn: 'greet(name)', local: 'greeting তৈরি হচ্ছে' },
            { fn: 'format(text)', local: 'result = "হ্যালো Ripon"' },
        ],
    },
    {
        note: 'format() শেষ। তার Frame মুছে গেল, result ও সাথে গেল।',
        frames: [
            { fn: 'main()', local: 'name = "Ripon"' },
            { fn: 'greet(name)', local: 'greeting = "হ্যালো Ripon"' },
        ],
    },
    { note: 'greet() শেষ। এখন শুধু main() বাকি।', frames: [{ fn: 'main()', local: 'name = "Ripon"' }] },
    { note: 'main() ও শেষ। Stack একদম খালি, সব জায়গা ফেরত।', frames: [] },
];

export function StackPlayLab() {
    const reduce = useReducedMotion();
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(false);

    const next = useCallback(() => setI(v => (v + 1) % STEPS.length), []);

    useEffect(() => {
        if (!playing) return;
        const id = setTimeout(next, 1800);
        return () => clearTimeout(id);
    }, [playing, i, next]);

    const step = STEPS[i];

    return (
        <Panel
            label='Animation story'
            title='Stack এ Frame জমে আর যায়'
            footer='খেয়াল করুন, শেষে Stack একদম খালি হয়ে যায়। এই পরিষ্কার করাটা কেউ হাতে করে না, ফাংশন শেষ হওয়া মাত্র নিজে থেকেই হয়। Heap এ এই সুবিধা নেই।'>
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
                        next();
                    }}
                    className='inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <SkipForward className='w-3 h-3' />
                    Step
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
                <span className='ml-auto font-mono text-[10px] text-muted-foreground tabular-nums'>
                    {toBn(i + 1)} / {toBn(STEPS.length)}
                </span>
            </div>

            <div className='border border-border bg-background p-5 flex flex-col justify-end min-h-64'>
                <AnimatePresence initial={false} mode='popLayout'>
                    {[...step.frames].reverse().map(f => (
                        <motion.div
                            key={f.fn}
                            layout
                            initial={reduce ? false : { opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                            transition={{ duration: 0.32, ease: EASE }}
                            className='mb-2 px-4 py-3 border border-primary/60 bg-primary/10'>
                            <span className='block font-mono text-xs font-bold text-primary'>
                                {f.fn}
                            </span>
                            <span className='block text-[11px] text-muted-foreground mt-1'>
                                {f.local}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {step.frames.length === 0 && (
                    <p className='text-center text-sm text-muted-foreground py-8'>
                        Stack খালি
                    </p>
                )}
            </div>

            <div className='mt-5 border-l-2 border-primary pl-4 min-h-12'>
                <motion.p
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className='text-sm leading-relaxed'>
                    {step.note}
                </motion.p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. A leak, and the one line that stops it                                 */
/* ------------------------------------------------------------------------- */

const CAPACITY = 24;

export function HeapLeakLab() {
    const reduce = useReducedMotion();
    const [used, setUsed] = useState(0);
    const [cleanup, setCleanup] = useState(false);
    const [requests, setRequests] = useState(0);
    const [crashed, setCrashed] = useState(false);

    const handle = () => {
        if (crashed) return;
        setRequests(r => r + 1);
        setUsed(u => {
            const next = cleanup ? Math.min(3, u + 1) : u + 2;
            if (next >= CAPACITY) setCrashed(true);
            return Math.min(next, CAPACITY);
        });
    };

    const reset = () => {
        setUsed(0);
        setRequests(0);
        setCrashed(false);
    };

    const pct = Math.round((used / CAPACITY) * 100);

    return (
        <Panel
            label='Try it'
            title='Memory Leak নিজে বানিয়ে দেখুন'
            footer='বাস্তবে এটা কয়েক দিন ধরে হয়। প্রতিটা Request এ অল্প একটু Memory জমে, কেউ খেয়াল করে না, তারপর একদিন ভোরে সার্ভার মরে যায়। এই কারণেই Cache এ সবসময় একটা সীমা আর মেয়াদ থাকতে হয়।'>
            <div className='flex flex-wrap items-center gap-3 mb-6'>
                <button
                    onClick={handle}
                    disabled={crashed}
                    className='px-4 py-2 border border-primary bg-primary/10 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/20 transition-colors disabled:opacity-40'>
                    একটা Request আসল
                </button>
                <button
                    onClick={() => {
                        setCleanup(c => !c);
                        reset();
                    }}
                    className={cn(
                        'px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors',
                        cleanup
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-muted-foreground hover:text-foreground'
                    )}>
                    {cleanup ? 'Cleanup আছে' : 'Cleanup নেই'}
                </button>
                <button
                    onClick={reset}
                    aria-label='Reset'
                    className='inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <RotateCcw className='w-3 h-3' />
                </button>
            </div>

            {/* the heap */}
            <div className='grid grid-cols-8 gap-1.5 mb-5'>
                {Array.from({ length: CAPACITY }).map((_, idx) => {
                    const filled = idx < used;
                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                opacity: filled ? 1 : 0.25,
                                scale: filled && !reduce ? 1 : 0.96,
                            }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className={cn(
                                'h-9 border',
                                filled
                                    ? crashed
                                        ? 'border-red-600 bg-red-600/25'
                                        : 'border-primary bg-primary/20'
                                    : 'border-border bg-background'
                            )}
                        />
                    );
                })}
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border'>
                <div className='bg-card px-4 py-3'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                        Request
                    </span>
                    <span className='block text-lg font-bold tabular-nums'>
                        {toBn(requests)}
                    </span>
                </div>
                <div className='bg-card px-4 py-3'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                        Heap ব্যবহার
                    </span>
                    <span
                        className={cn(
                            'block text-lg font-bold tabular-nums',
                            crashed ? 'text-red-700 dark:text-red-400' : 'text-primary'
                        )}>
                        {toBn(pct)}%
                    </span>
                </div>
                <div className='bg-card px-4 py-3 col-span-2 md:col-span-1'>
                    <span className='block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1'>
                        অবস্থা
                    </span>
                    <span
                        className={cn(
                            'block text-sm font-bold',
                            crashed
                                ? 'text-red-700 dark:text-red-400'
                                : cleanup
                                  ? 'text-accent'
                                  : 'text-foreground'
                        )}>
                        {crashed
                            ? 'Out of Memory, Process মরে গেল'
                            : cleanup
                              ? 'স্থির আছে'
                              : 'জমছে'}
                    </span>
                </div>
            </div>

            <p className='mt-5 text-sm text-muted-foreground leading-relaxed'>
                {crashed
                    ? 'সার্ভার আর কোনো Request নিতে পারছে না। Docker হলে Container টা মরে যেত, আর লগে দেখা যেত exit code 137।'
                    : cleanup
                      ? 'পুরনো জিনিস সরিয়ে দেওয়া হচ্ছে, তাই Request যত বাড়ুক, Memory একই জায়গায় থামে।'
                      : 'প্রতিটা Request কিছু জিনিস রেখে যাচ্ছে, আর কেউ সেগুলো সরাচ্ছে না। Cleanup চালু করে একই কাজ আবার করে দেখুন।'}
            </p>
        </Panel>
    );
}
