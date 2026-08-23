import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { BorderCross } from './border-cross';

interface TopicInfo {
    id: string;
    title: string;
}

interface TopicNavigationProps {
    prev: TopicInfo | null;
    next: TopicInfo | null;
    /** Route prefix for the sibling pages, e.g. `/topic` or `/devops/topic`. */
    basePath?: string;
    /** What a sibling is called — "Topic" for the course, "Lesson" for the track. */
    label?: string;
}

export function TopicNavigation({
    prev,
    next,
    basePath = '/topic',
    label = 'Topic',
}: TopicNavigationProps) {
    return (
        <BorderCross>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 md:mt-16'>
                {prev ? (
                    <Link
                        href={`${basePath}/${prev.id}`}
                        className='flex flex-col items-start p-5 md:p-6 bg-muted/5 hover:bg-muted/20 transition-all group'>
                        <span className='font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 flex items-center gap-2'>
                            <ChevronLeft className='w-3 h-3 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform' />
                            Previous {label}
                        </span>
                        <h3 className='text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-1'>
                            {prev.title}
                        </h3>
                    </Link>
                ) : (
                    <div className='hidden sm:block' /> // Empty placeholder to keep grid alignment
                )}

                {next ? (
                    <Link
                        href={`${basePath}/${next.id}`}
                        className='flex flex-col items-end text-right p-5 md:p-6 bg-muted/5 hover:bg-muted/20 transition-all group'>
                        <span className='font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 flex items-center gap-2'>
                            Next {label}
                            <ChevronRight className='w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform' />
                        </span>
                        <h3 className='text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-1'>
                            {next.title}
                        </h3>
                    </Link>
                ) : (
                    <div className='hidden sm:block' /> // Empty placeholder to keep grid alignment
                )}
            </div>
        </BorderCross>
    );
}

