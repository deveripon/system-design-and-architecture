import { ArrowLeft, Rocket } from 'lucide-react';
import Link from 'next/link';
import { BorderCross } from './border-cross';
import { InfoBox } from './info-box';

interface ContentPlaceholderProps {
    title: string;
    details?: string;
    tools?: string[];
    /** Where "back" goes, the roadmap this lesson belongs to. */
    homeHref: string;
    homeLabel?: string;
    /** A finished page to look at in the meantime. */
    sample?: { href: string; label: string };
}

/**
 * Shown for a topic that exists in the curriculum but has no content file yet.
 */
export function ContentPlaceholder({
    title,
    details,
    tools,
    homeHref,
    homeLabel = 'Back to Roadmap',
    sample,
}: ContentPlaceholderProps) {
    return (
        <BorderCross>
            <section className='min-h-100 flex flex-col items-center justify-center text-center p-8 md:p-12 border border-border bg-muted/20'>
                <div className='w-20 h-20 border border-primary flex items-center justify-center mb-6 bg-primary/5'>
                    <Rocket className='w-10 h-10 text-primary' />
                </div>
                <h2 className='text-2xl md:text-3xl font-black mb-4 uppercase tracking-tighter'>
                    Content Coming Soon
                </h2>
                <p className='max-w-md text-muted-foreground leading-relaxed mb-8'>
                    <strong className='text-foreground'>{title}</strong> এর
                    জন্য Diagram, Code Example আর Quiz সহ পূর্ণ Lesson তৈরি
                    হচ্ছে। কিছুদিন পর আবার দেখো।
                </p>

                <div className='flex flex-col sm:flex-row gap-4'>
                    <Link href={homeHref}>
                        <button className='w-full px-6 py-3 border border-border text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/50 dark:hover:border-white/30 transition-all flex items-center justify-center gap-2'>
                            <ArrowLeft className='w-3 h-3' />
                            {homeLabel}
                        </button>
                    </Link>
                    {sample && (
                        <Link href={sample.href}>
                            <button className='w-full px-6 py-3 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all border border-primary'>
                                {sample.label}
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            {(details || tools) && (
                <div
                    className={
                        details && tools
                            ? 'grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60'
                            : 'opacity-60'
                    }>
                    {details && (
                        <InfoBox variant='concept' title='Learning Objectives'>
                            {details}
                        </InfoBox>
                    )}
                    {tools && (
                        <InfoBox variant='tip' title='Tools to Explore'>
                            <div className='flex flex-wrap gap-2 mt-2'>
                                {tools.map(tool => (
                                    <span
                                        key={tool}
                                        className='px-2 py-1 bg-muted border border-border text-xs font-mono'>
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </InfoBox>
                    )}
                </div>
            )}
        </BorderCross>
    );
}
