'use client';

import { ASCII_ROWS, searchAscii, type AsciiRow } from '@/lib/ascii-table';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const EXAMPLES = ['A', 'a', '0', '65', '41', '10'];

/**
 * The full ASCII table with a search box. Reused by the reference page and by
 * any lesson that needs to point at a specific code.
 */
export function AsciiTable() {
    const [query, setQuery] = useState('');
    const [showControl, setShowControl] = useState(true);

    const rows = useMemo(() => {
        const found = searchAscii(query);
        return showControl ? found : found.filter(r => !r.control);
    }, [query, showControl]);

    const printableCount = ASCII_ROWS.filter(r => !r.control).length;

    return (
        <div className='my-8'>
            {/* controls */}
            <div className='flex flex-col md:flex-row md:items-center gap-4 mb-6'>
                <div className='relative flex-1'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder='অক্ষর, সংখ্যা, Hex বা নাম লিখে খুঁজুন'
                        aria-label='ASCII টেবিলে খুঁজুন'
                        className='w-full pl-11 pr-11 py-3 bg-card border border-border text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/70'
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            aria-label='Clear'
                            className='absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'>
                            <X className='w-4 h-4' />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowControl(v => !v)}
                    className={cn(
                        'px-4 py-3 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors whitespace-nowrap',
                        showControl
                            ? 'border-primary/50 bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:text-foreground'
                    )}>
                    Control Codes {showControl ? 'দেখাচ্ছে' : 'লুকানো'}
                </button>
            </div>

            {/* quick jumps */}
            <div className='flex flex-wrap items-center gap-2 mb-6'>
                <span className='font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mr-1'>
                    চটপট দেখুন
                </span>
                {EXAMPLES.map(ex => (
                    <button
                        key={ex}
                        onClick={() => setQuery(ex)}
                        className='px-3 py-1.5 border border-border bg-muted/20 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors'>
                        {ex}
                    </button>
                ))}
            </div>

            {/* table */}
            <div className='border border-border overflow-x-auto'>
                <table className='w-full min-w-[640px] text-left border-collapse'>
                    <thead>
                        <tr className='bg-muted/40'>
                            <Th>Dec</Th>
                            <Th>Hex</Th>
                            <Th>Binary</Th>
                            <Th>Char</Th>
                            <Th>কী জিনিস</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <Row key={row.dec} row={row} />
                        ))}
                    </tbody>
                </table>

                {rows.length === 0 && (
                    <p className='p-8 text-center text-sm text-muted-foreground'>
                        কিছু পাওয়া গেল না। ASCII-তে মাত্র ১২৮টা কোড আছে, তাই
                        বাংলা অক্ষর বা ইমোজি এখানে নেই। সেগুলো Unicode-এ থাকে।
                    </p>
                )}
            </div>

            <p className='mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground'>
                দেখাচ্ছে {rows.length} / {ASCII_ROWS.length} কোড ·{' '}
                {printableCount}টা ছাপা যায়, বাকিগুলো Control
            </p>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className='px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border whitespace-nowrap'>
            {children}
        </th>
    );
}

function Row({ row }: { row: AsciiRow }) {
    return (
        <tr
            className={cn(
                'border-b border-border/60 transition-colors hover:bg-primary/5 dark:hover:bg-white/2',
                row.control ? 'bg-muted/10' : 'bg-card'
            )}>
            <td className='px-4 py-2.5 font-mono text-xs tabular-nums text-muted-foreground'>
                {row.dec}
            </td>
            <td className='px-4 py-2.5 font-mono text-xs tabular-nums text-muted-foreground'>
                {row.hex}
            </td>
            <td className='px-4 py-2.5 font-mono text-xs tabular-nums text-primary'>
                {row.binary}
            </td>
            <td className='px-4 py-2.5'>
                <span
                    className={cn(
                        'font-mono font-bold',
                        row.control
                            ? 'text-[10px] uppercase tracking-wider text-muted-foreground'
                            : 'text-base text-foreground'
                    )}>
                    {row.glyph}
                </span>
            </td>
            <td className='px-4 py-2.5 text-xs text-muted-foreground leading-relaxed'>
                {row.name && (
                    <span className='text-foreground/80'>{row.name}</span>
                )}
                {row.name && row.note && ' · '}
                {row.note}
            </td>
        </tr>
    );
}
