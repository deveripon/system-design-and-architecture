'use client';

import { Collapse } from '@/components/motion/collapse';
import { ISLAND_TOURS_TABLES } from '@/lib/sql/island-tours-schema';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown, Database } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * The SQL track's counterpart of `IslandToursBrief`: every example runs on the
 * same sample database, so a lesson gives the one line of context and links to
 * the page that shows the whole schema, instead of introducing it again.
 */
export function IslandToursDatabaseBrief() {
    const [open, setOpen] = useState(false);

    return (
        <div className='my-8 border border-border bg-muted/20'>
            <button
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className='w-full flex items-start gap-4 p-5 text-left group'>
                <span className='w-9 h-9 border border-border bg-background flex items-center justify-center shrink-0'>
                    <Database className='w-4 h-4 text-primary' />
                </span>
                <span className='flex-1 min-w-0'>
                    <span className='block font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary mb-1.5'>
                        Sample Database
                    </span>
                    <span className='block text-sm font-bold mb-1'>
                        Island Tours Database কী?
                    </span>
                    <span className='block text-sm text-muted-foreground leading-relaxed'>
                        একটা ট্যুর বুকিং ব্যবসার ছোট কিন্তু সম্পূর্ণ Database।
                        পুরো ট্র্যাকের প্রতিটা উদাহরণ এই Data তেই চলে।
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
                        Customer একটা Tour এর নির্দিষ্ট তারিখে (Departure) সিট
                        বুক করেন, টাকা দেন (Payment), আর ঘুরে এসে Review লেখেন।
                        প্রতিটা Tour একটা Destination এ যায়, আর একজন Guide
                        নিয়ে যান।
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {ISLAND_TOURS_TABLES.map(table => (
                            <span
                                key={table.name}
                                className='px-2.5 py-1 border border-border bg-card font-mono text-[0.625rem] tracking-wider text-muted-foreground'>
                                {table.name}
                            </span>
                        ))}
                    </div>
                    <Link
                        href='/sql/database'
                        className='inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors'>
                        সব Table, Column আর সম্পর্ক এক পাতায়
                        <ArrowRight className='w-3 h-3' />
                    </Link>
                </div>
            </Collapse>
        </div>
    );
}
