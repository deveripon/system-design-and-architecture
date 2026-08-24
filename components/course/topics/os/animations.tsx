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
/* 1. The scheduler handing one core around                                  */
/* ------------------------------------------------------------------------- */

const PROCS = [
    { name: 'API', note: 'Request এর উত্তর দিচ্ছে' },
    { name: 'Browser', note: 'Page আঁকছে' },
    { name: 'Backup', note: 'ফাইল কপি করছে' },
];
/** Which process holds the core in each slice, and what it is doing. */
const SLICES = [
    { p: 0, note: 'API একটা Request নিল, কিন্তু Database এর উত্তরের অপেক্ষায় থেমে গেল।' },
    { p: 1, note: 'Kernel সাথে সাথে Core টা Browser কে দিয়ে দিল, খালি বসিয়ে রাখল না।' },
    { p: 2, note: 'Browser এর সময় শেষ। এবার Backup তার টুকরো পেল।' },
    { p: 0, note: 'Database এর উত্তর এসে গেছে, তাই API আবার Core পেল।' },
    { p: 1, note: 'আবার Browser। এভাবেই চক্র চলতে থাকে।' },
    { p: 2, note: 'সেকেন্ডে এমন শত শত বার হয়, তাই সব একসাথে চলছে মনে হয়।' },
];

export function SchedulerLab() {
    const reduce = useReducedMotion();
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(false);

    const finished = i >= SLICES.length - 1;
    const running = playing && !finished;

    const step = useCallback(
        () => setI(v => (v >= SLICES.length - 1 ? 0 : v + 1)),
        []
    );
    const advance = useCallback(
        () => setI(v => Math.min(v + 1, SLICES.length - 1)),
        []
    );

    useEffect(() => {
        if (!running) return;
        const id = setTimeout(advance, 1500);
        return () => clearTimeout(id);
    }, [running, i, advance]);

    const active = SLICES[i].p;

    return (
        <Panel
            label='Animation story'
            title='Kernel এক Core তিনজনকে ভাগ করে দিচ্ছে'
            footer='Kernel কখনো Core খালি বসিয়ে রাখে না। একটা Process অপেক্ষায় গেলে সাথে সাথে অন্যজন সুযোগ পায়। এই কারণেই একটা ধীর Database Query চললেও সার্ভার পুরো থেমে যায় না।'>
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
                        setPlaying(false);
                        setI(0);
                    }}
                    aria-label='Reset'
                    className='inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <RotateCcw className='w-3 h-3' />
                </button>
                <span className='ml-auto font-mono text-[10px] text-muted-foreground tabular-nums'>
                    Slice {toBn(i + 1)} / {toBn(SLICES.length)}
                </span>
            </div>

            {/* who holds the core */}
            <div className='space-y-2'>
                {PROCS.map((proc, idx) => {
                    const holding = idx === active;
                    return (
                        <div
                            key={proc.name}
                            className={cn(
                                'flex items-center gap-4 px-4 py-3 border transition-colors duration-200',
                                holding
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-background'
                            )}>
                            <span
                                className={cn(
                                    'font-mono text-xs font-bold w-20',
                                    holding ? 'text-primary' : 'text-muted-foreground'
                                )}>
                                {proc.name}
                            </span>
                            <span className='flex-1 text-xs text-muted-foreground'>
                                {proc.note}
                            </span>
                            {holding ? (
                                <motion.span
                                    layoutId={reduce ? undefined : 'core-chip'}
                                    className='px-3 py-1 bg-primary text-primary-foreground font-mono text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap'>
                                    CORE
                                </motion.span>
                            ) : (
                                <span className='px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap'>
                                    অপেক্ষায়
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className='mt-6 border-l-2 border-primary pl-4 min-h-12'>
                <motion.p
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className='text-sm leading-relaxed'>
                    {SLICES[i].note}
                </motion.p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Following one System Call all the way down and back                    */
/* ------------------------------------------------------------------------- */

const ACTIONS = {
    file: {
        label: 'একটা ফাইল Save করুন',
        call: 'write()',
        steps: [
            { where: 'USER SPACE', text: 'আপনার কোড fs.writeFile ডাকল। এখান থেকে Disk ছোঁয়ার কোনো উপায় নেই।' },
            { where: 'SYSCALL', text: 'write() System Call এর মাধ্যমে অনুরোধটা Kernel এ গেল। CPU এখন Kernel Mode এ।' },
            { where: 'KERNEL', text: 'Kernel দেখল আপনার এই ফাইলে লেখার অনুমতি আছে কিনা।' },
            { where: 'KERNEL', text: 'ডেটা Page Cache এ বসল, আর Disk Driver কে কাজ বুঝিয়ে দেওয়া হলো।' },
            { where: 'HARDWARE', text: 'Driver SSD কে আসল Write এর নির্দেশ পাঠাল।' },
            { where: 'USER SPACE', text: 'Kernel উত্তর ফেরত দিল, আর আপনার কোড পরের লাইনে গেল।' },
        ],
    },
    network: {
        label: 'একটা Request পাঠান',
        call: 'send()',
        steps: [
            { where: 'USER SPACE', text: 'আপনার কোড fetch ডাকল। Network Card এর নাগাল এখান থেকে পাওয়া যায় না।' },
            { where: 'SYSCALL', text: 'socket আর send() System Call দিয়ে অনুরোধ Kernel এ গেল।' },
            { where: 'KERNEL', text: 'Kernel ডেটাকে TCP Segment এ ভরল, তারপর IP Packet বানাল।' },
            { where: 'KERNEL', text: 'Routing দেখে ঠিক করল Packet টা কোন পথে যাবে।' },
            { where: 'HARDWARE', text: 'Network Card Packet টা তারের উপর ছেড়ে দিল।' },
            { where: 'USER SPACE', text: 'উত্তর ফিরলে Kernel আপনার কোডকে জানাল। Module 04 এ এই পথটাই বিস্তারিত দেখব।' },
        ],
    },
};

const LAYERS = ['USER SPACE', 'SYSCALL', 'KERNEL', 'HARDWARE'];

export function SyscallLab() {
    const reduce = useReducedMotion();
    const [action, setAction] = useState<keyof typeof ACTIONS>('file');
    const [i, setI] = useState(0);

    const current = ACTIONS[action];
    const step = current.steps[i];

    return (
        <Panel
            label='Try it'
            title='একটা System Call এর পুরো পথ'
            footer='আপনার কোড নিজে কখনো Disk বা Network Card ছোঁয় না। প্রতিবারই Kernel কে অনুরোধ করতে হয়, আর Kernel আগে অনুমতি যাচাই করে। এই নিয়মটাই একটা Process কে অন্যটার ক্ষতি করা থেকে আটকায়।'>
            <div className='flex flex-wrap items-center gap-2 mb-6'>
                {(Object.keys(ACTIONS) as (keyof typeof ACTIONS)[]).map(key => (
                    <button
                        key={key}
                        onClick={() => {
                            setAction(key);
                            setI(0);
                        }}
                        className={cn(
                            'px-4 py-2 border font-mono text-[10px] uppercase tracking-[0.12em] transition-colors',
                            key === action
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                        )}>
                        {ACTIONS[key].label}
                    </button>
                ))}
                <button
                    onClick={() => setI(v => (v + 1) % current.steps.length)}
                    className='ml-auto inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors'>
                    <SkipForward className='w-3 h-3' />
                    পরের ধাপ
                </button>
            </div>

            <div className='space-y-1.5'>
                {LAYERS.map(layer => {
                    const here = step.where === layer;
                    return (
                        <div
                            key={layer}
                            className={cn(
                                'flex items-center gap-4 px-4 py-3 border transition-colors duration-200',
                                here
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-background'
                            )}>
                            <span
                                className={cn(
                                    'font-mono text-[10px] font-bold uppercase tracking-[0.15em] w-28',
                                    here ? 'text-primary' : 'text-muted-foreground/60'
                                )}>
                                {layer}
                            </span>
                            {here && (
                                <motion.span
                                    layoutId={reduce ? undefined : 'syscall-dot'}
                                    className='w-2 h-2 bg-primary shrink-0'
                                />
                            )}
                            {layer === 'SYSCALL' && (
                                <span className='ml-auto font-mono text-[10px] text-muted-foreground'>
                                    {current.call}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className='mt-6 flex items-start gap-4'>
                <span className='font-mono text-[10px] text-muted-foreground tabular-nums pt-1 shrink-0'>
                    {toBn(i + 1)} / {toBn(current.steps.length)}
                </span>
                <motion.p
                    key={`${action}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className='text-sm leading-relaxed border-l-2 border-primary pl-4'>
                    {step.text}
                </motion.p>
            </div>
        </Panel>
    );
}
