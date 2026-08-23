import { ArrowRight, Table2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Points at the full ASCII table. The lesson only needs a handful of codes, so
 * the whole table lives on its own page and every mention links there.
 */
export function AsciiTableLink({
    variant = 'full',
}: {
    variant?: 'full' | 'compact';
}) {
    if (variant === 'compact') {
        return (
            <Link
                href='/devops/reference/ascii-table'
                className='group my-8 flex items-center gap-4 p-4 border border-border bg-muted/20 hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                <Table2 className='w-4 h-4 text-primary shrink-0' />
                <span className='flex-1 text-sm text-muted-foreground'>
                    কোন অক্ষরের কোড কত, পুরো তালিকাটা এক জায়গায় দেখো।
                </span>
                <ArrowRight className='w-3.5 h-3.5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform' />
            </Link>
        );
    }

    return (
        <Link
            href='/devops/reference/ascii-table'
            className='group my-10 flex flex-col md:flex-row md:items-center gap-5 p-6 md:p-8 border border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
            <span className='w-12 h-12 border border-border bg-background flex items-center justify-center shrink-0'>
                <Table2 className='w-5 h-5 text-primary' />
            </span>
            <span className='flex-1'>
                <span className='block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-2'>
                    Reference
                </span>
                <span className='block text-lg font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors'>
                    পুরো ASCII টেবিল
                </span>
                <span className='block text-sm text-muted-foreground leading-relaxed max-w-2xl'>
                    ১২৮টা কোডের প্রতিটার Decimal, Hex, Binary আর অক্ষর একসাথে।
                    সার্চ করে যেকোনো অক্ষর খুঁজে নিতে পারবে, আর Control Code
                    গুলো কী কাজ করে সেটাও লেখা আছে।
                </span>
            </span>
            <ArrowRight className='w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform' />
        </Link>
    );
}
