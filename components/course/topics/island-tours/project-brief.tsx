'use client';

import { Collapse } from '@/components/motion/collapse';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STACK = [
    'Next.js',
    'NestJS',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Caddy',
    'Cloudflare',
    'Vercel',
];

/**
 * Island Tours comes up in most lessons, so a student may meet it for the first
 * time anywhere in the track. This gives them the one line they need, plus a way
 * to see the whole picture, without repeating the introduction in every lesson.
 */
export function IslandToursBrief() {
    const [open, setOpen] = useState(false);

    return (
        <div className='my-8 border border-border bg-muted/20'>
            <button
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className='w-full flex items-start gap-4 p-5 text-left group'>
                <span className='w-9 h-9 border border-border bg-background flex items-center justify-center shrink-0'>
                    <Compass className='w-4 h-4 text-primary' />
                </span>
                <span className='flex-1 min-w-0'>
                    <span className='block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-1.5'>
                        Project Context
                    </span>
                    <span className='block text-sm font-bold mb-1'>
                        Island Tours কী?
                    </span>
                    <span className='block text-sm text-muted-foreground leading-relaxed'>
                        একটা সত্যিকারের ট্যুর বুকিং অ্যাপ, যেটা এখন Production-এ
                        চলছে। পুরো ট্র্যাকে এটাকেই উদাহরণ হিসেবে ব্যবহার করা হয়।
                    </span>
                </span>
                <ChevronDown
                    className={cn(
                        'w-4 h-4 shrink-0 mt-1 text-muted-foreground group-hover:text-foreground transition-transform',
                        open && 'rotate-180'
                    )}
                />
            </button>

            <Collapse open={open}>
                <div className='px-5 pb-5 pt-1 md:pl-18 space-y-4'>
                    <p className='text-sm text-muted-foreground leading-relaxed'>
                        ইউজার সাইটে ঢুকে ট্যুর খোঁজে, একটা ট্যুর বেছে নেয়, তারিখ
                        দিয়ে বুক করে আর পেমেন্ট করে। পেছনে Frontend চলে Vercel-এ,
                        API চলে একটা VPS-এর ভেতর Docker-এ, আর Data থাকে
                        PostgreSQL-এ।
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {STACK.map(item => (
                            <span
                                key={item}
                                className='px-2.5 py-1 border border-border bg-card font-mono text-[10px] uppercase tracking-wider text-muted-foreground'>
                                {item}
                            </span>
                        ))}
                    </div>
                    <Link
                        href='/devops/project'
                        className='inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors'>
                        পুরো আর্কিটেকচার আর নিজের ভার্সন বানানোর প্ল্যান
                        <ArrowRight className='w-3 h-3' />
                    </Link>
                </div>
            </Collapse>
        </div>
    );
}
