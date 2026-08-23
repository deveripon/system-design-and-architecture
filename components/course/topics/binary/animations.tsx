'use client';

import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;
const PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

/** Shared chrome for a visual explainer block. */
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
/* 1. Eight switches the reader can flip, the whole idea of a byte, by hand  */
/* ------------------------------------------------------------------------- */

const PRESETS: { label: string; value: number }[] = [
    { label: 'A', value: 65 },
    { label: 'a', value: 97 },
    { label: '0', value: 48 },
    { label: 'সব বন্ধ', value: 0 },
    { label: 'সব চালু', value: 255 },
];

export function BitSwitchLab() {
    const [bits, setBits] = useState<number[]>([0, 1, 0, 0, 0, 0, 0, 1]); // 'A'

    const value = useMemo(
        () => bits.reduce((sum, bit, i) => sum + bit * PLACE_VALUES[i], 0),
        [bits]
    );

    const toggle = (index: number) =>
        setBits(prev => prev.map((b, i) => (i === index ? (b ? 0 : 1) : b)));

    const load = (n: number) =>
        setBits(PLACE_VALUES.map(p => (n & p ? 1 : 0)));

    const printable = value >= 32 && value <= 126;

    return (
        <Panel
            label='Try it'
            title='৮টা সুইচ মিলে একটা Byte'
            footer='প্রতিটা সুইচ একটা Bit। উপরের সংখ্যাটা হলো ওই সুইচটার দাম। যে সুইচগুলো চালু, তাদের দাম যোগ করলেই Byte-এর মান।'>
            <div className='flex flex-wrap gap-2 mb-8'>
                {PRESETS.map(p => (
                    <button
                        key={p.label}
                        onClick={() => load(p.value)}
                        className='px-3 py-1.5 border border-border bg-muted/20 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors'>
                        {p.label}
                    </button>
                ))}
            </div>

            <div className='flex gap-1.5 sm:gap-2 justify-center flex-wrap'>
                {bits.map((bit, i) => (
                    <div key={i} className='flex flex-col items-center gap-2'>
                        <span className='font-mono text-[9px] text-muted-foreground/70 tabular-nums'>
                            {PLACE_VALUES[i]}
                        </span>
                        <button
                            onClick={() => toggle(i)}
                            aria-label={`Bit ${8 - i}, মান ${PLACE_VALUES[i]}, এখন ${bit}`}
                            aria-pressed={bit === 1}
                            className={cn(
                                'w-9 h-14 sm:w-11 sm:h-16 border flex items-center justify-center font-mono text-lg sm:text-xl font-bold transition-colors',
                                bit
                                    ? 'border-primary bg-primary/15 text-primary'
                                    : 'border-border bg-background text-muted-foreground/50 hover:border-primary/40'
                            )}>
                            {bit}
                        </button>
                        <span
                            className={cn(
                                'h-1 w-full transition-colors',
                                bit ? 'bg-primary' : 'bg-border'
                            )}
                        />
                    </div>
                ))}
            </div>

            <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border'>
                <Readout label='Binary' value={bits.join('')} mono />
                <Readout label='Decimal' value={toBn(value)} />
                <Readout
                    label='Hex'
                    value={value.toString(16).toUpperCase().padStart(2, '0')}
                    mono
                />
                <Readout
                    label='Character'
                    value={printable ? String.fromCharCode(value) : ','}
                    hint={printable ? undefined : 'দেখা যায় না'}
                />
            </div>
        </Panel>
    );
}

function Readout({
    label,
    value,
    mono,
    hint,
}: {
    label: string;
    value: string;
    mono?: boolean;
    hint?: string;
}) {
    return (
        <div className='bg-card px-4 py-3'>
            <span className='block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5'>
                {label}
            </span>
            <motion.span
                key={value}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    'block text-xl font-bold text-primary break-all',
                    mono && 'font-mono text-base'
                )}>
                {value}
            </motion.span>
            {hint && (
                <span className='block text-[10px] text-muted-foreground mt-1'>
                    {hint}
                </span>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. The animation story: one keypress becoming electricity                  */
/* ------------------------------------------------------------------------- */

const STORY = [
    {
        caption: 'আপনি Keyboard-এ A চাপলে।',
        detail: 'Keyboard শুধু জানে কোন Key চাপা হয়েছে। এখনো কোনো অক্ষর নেই।',
    },
    {
        caption: 'কম্পিউটার Character Table-এ দেখে: A মানে ৬৫।',
        detail: 'প্রতিটা অক্ষরের একটা নম্বর আগেই ঠিক করা আছে। এই তালিকার নাম ASCII।',
    },
    {
        caption: '৬৫-কে ৮টা সুইচে সাজায়: 01000001',
        detail: '৬৪ + ১ = ৬৫। তাই ওই দুইটা সুইচ চালু, বাকি ছয়টা বন্ধ।',
    },
    {
        caption: 'সুইচগুলো হয়ে যায় বিদ্যুতের চালু-বন্ধ।',
        detail: 'চালু মানে বিদ্যুৎ আছে, বন্ধ মানে নেই। কম্পিউটার আসলে এটাই বোঝে।',
    },
    {
        caption: 'অন্য প্রান্তে উল্টো হিসাব করে আবার A দেখায়।',
        detail: 'একই তালিকা দুই দিকেই আছে, তাই কেউ ভুল বোঝে না।',
    },
];

const BITS_OF_A = [0, 1, 0, 0, 0, 0, 0, 1];

export function KeypressToBitsStory() {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);

    const next = useCallback(
        () => setStep(s => (s + 1) % STORY.length),
        []
    );

    useEffect(() => {
        if (!playing) return;
        const t = setTimeout(next, 2600);
        return () => clearTimeout(t);
    }, [playing, step, next]);

    const active = step >= 2;
    const wired = step >= 3;

    return (
        <Panel
            label='Animation story'
            title='একটা Keypress কীভাবে বিদ্যুৎ হয়'
            footer='নিজের গতিতে দেখুন। Play চাপলে নিজে চলবে, Step চাপলে এক ধাপ করে এগোবেন।'>
            <div className='flex items-center gap-2 mb-8'>
                <button
                    onClick={() => setPlaying(p => !p)}
                    className='inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors'>
                    {playing ? (
                        <Pause className='w-3 h-3' />
                    ) : (
                        <Play className='w-3 h-3' />
                    )}
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
                        setStep(0);
                    }}
                    aria-label='Reset'
                    className='inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
                    <RotateCcw className='w-3 h-3' />
                </button>
                <span className='ml-auto font-mono text-[10px] text-muted-foreground tabular-nums'>
                    {toBn(step + 1)} / {toBn(STORY.length)}
                </span>
            </div>

            {/* the stage, plain CSS transitions so the visual state is always
                a direct function of `step`, never of an animation callback */}
            <div className='border border-border bg-background p-5 md:p-8 space-y-8'>
                <div className='flex items-center justify-center gap-4 md:gap-8 flex-wrap'>
                    {/* key */}
                    <div
                        className={cn(
                            'w-16 h-16 border flex items-center justify-center font-heading text-3xl font-black transition-all duration-300',
                            step === 0
                                ? 'border-primary text-primary bg-primary/10 scale-105'
                                : 'border-border text-muted-foreground'
                        )}>
                        A
                    </div>

                    <Arrow lit={step >= 1} />

                    {/* code point */}
                    <div
                        className={cn(
                            'px-5 py-4 border font-mono text-2xl font-bold tabular-nums transition-colors duration-300',
                            step >= 1
                                ? 'border-primary text-primary bg-primary/10'
                                : 'border-border text-muted-foreground/40'
                        )}>
                        {step >= 1 ? toBn(65) : '??'}
                    </div>

                    <Arrow lit={active} />

                    {/* bits */}
                    <div className='flex gap-1'>
                        {BITS_OF_A.map((bit, i) => (
                            <span
                                key={i}
                                style={{
                                    transitionDelay: reduce
                                        ? '0ms'
                                        : `${i * 45}ms`,
                                }}
                                className={cn(
                                    'w-6 h-9 md:w-7 md:h-10 border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300',
                                    active
                                        ? 'opacity-100'
                                        : 'opacity-30 scale-95',
                                    active && bit
                                        ? 'border-primary bg-primary/15 text-primary'
                                        : 'border-border text-muted-foreground'
                                )}>
                                {active ? bit : '·'}
                            </span>
                        ))}
                    </div>
                </div>

                {/* the wire */}
                <div className='space-y-2'>
                    <span className='font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground'>
                        Wire
                    </span>
                    <div className='flex items-end gap-1 h-12 border-b border-border'>
                        {BITS_OF_A.map((bit, i) => (
                            <div
                                key={i}
                                style={{
                                    height: wired && bit ? '100%' : '18%',
                                    opacity: wired ? 1 : 0.35,
                                    transitionDelay: reduce
                                        ? '0ms'
                                        : `${i * 55}ms`,
                                }}
                                className={cn(
                                    'flex-1 transition-all',
                                    reduce ? 'duration-0' : 'duration-300',
                                    wired && bit ? 'bg-primary' : 'bg-border'
                                )}
                            />
                        ))}
                    </div>
                    <div className='flex justify-between font-mono text-[9px] text-muted-foreground'>
                        <span>বিদ্যুৎ আছে = ১</span>
                        <span>বিদ্যুৎ নেই = ০</span>
                    </div>
                </div>
            </div>

            {/* caption, keyed so React swaps the node; it animates in on its
                own, with no exit animation to wait for */}
            <div className='mt-6 min-h-24'>
                <motion.div
                    key={step}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                    className='border-l-2 border-primary pl-4'>
                    <p className='text-base font-bold leading-snug'>
                        {STORY[step].caption}
                    </p>
                    <p className='text-sm text-muted-foreground leading-relaxed mt-2'>
                        {STORY[step].detail}
                    </p>
                </motion.div>
            </div>
        </Panel>
    );
}

function Arrow({ lit }: { lit: boolean }) {
    return (
        <div className='flex items-center gap-1'>
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    className={cn(
                        'w-1.5 h-1.5 transition-colors',
                        lit ? 'bg-primary' : 'bg-border'
                    )}
                />
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Scale: from one bit to a gigabyte, with things you can picture          */
/* ------------------------------------------------------------------------- */

const SCALE = [
    { unit: '১ Bit', bytes: 0.125, real: 'একটা হ্যাঁ বা না' },
    { unit: '১ Byte', bytes: 1, real: 'একটা ইংরেজি অক্ষর, যেমন A' },
    { unit: '৩ Byte', bytes: 3, real: 'একটা বাংলা অক্ষর অ (UTF-8)' },
    { unit: '১৬০ Byte', bytes: 160, real: 'একটা পুরো SMS' },
    { unit: '১ KB', bytes: 1024, real: 'ছোট একটা JSON Response' },
    { unit: '২ MB', bytes: 2 * 1024 * 1024, real: 'ফোনে তোলা একটা ছবি' },
    { unit: '১ GB', bytes: 1024 ** 3, real: 'প্রায় ৩ ঘণ্টার HD ভিডিও' },
];

export function ByteScaleVisual() {
    const reduce = useReducedMotion();
    const max = Math.log10(SCALE[SCALE.length - 1].bytes + 1);

    return (
        <Panel
            label='Scale'
            title='এক Bit থেকে এক Gigabyte'
            footer='বারগুলো log scale-এ আঁকা, নাহলে ১ Byte-এর বার চোখে দেখাই যেত না। মনে রাখার জন্য ডান পাশের উদাহরণগুলো কাজে দেবে।'>
            <div className='space-y-3'>
                {SCALE.map((row, i) => {
                    const width = Math.max(
                        3,
                        (Math.log10(row.bytes + 1) / max) * 100
                    );
                    return (
                        <div
                            key={row.unit}
                            className='grid grid-cols-[5.5rem_1fr] md:grid-cols-[7rem_1fr_11rem] gap-3 items-center'>
                            <span className='font-mono text-[11px] font-bold uppercase tracking-wide text-primary'>
                                {row.unit}
                            </span>
                            <div className='h-4 bg-muted/40 border border-border overflow-hidden'>
                                <motion.div
                                    initial={reduce ? false : { width: 0 }}
                                    whileInView={{ width: `${width}%` }}
                                    viewport={{ once: true, amount: 0.6 }}
                                    transition={{
                                        duration: reduce ? 0 : 0.7,
                                        delay: reduce ? 0 : i * 0.08,
                                        ease: EASE,
                                    }}
                                    className='h-full bg-primary/70'
                                />
                            </div>
                            <span className='col-span-2 md:col-span-1 text-xs text-muted-foreground leading-snug'>
                                {row.real}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
