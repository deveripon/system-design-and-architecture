'use client';

import { EASE } from '@/components/motion/reveal';
import { motion, useReducedMotion } from 'framer-motion';
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
    /** What a sibling is called: Topic for the course, Lesson for the track. */
    label?: string;
}

export function TopicNavigation({
    prev,
    next,
    basePath = '/topic',
    label = 'Topic',
}: TopicNavigationProps) {
    const reduce = useReducedMotion();
    const lift = reduce ? undefined : { y: -3 };
    const press = reduce ? undefined : { scale: 0.99 };
    const spring = { duration: 0.25, ease: EASE };

    return (
        <BorderCross>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 md:mt-16'>
                {prev ? (
                    <motion.div whileHover={lift} whileTap={press} transition={spring}>
                        <Link
                            href={`${basePath}/${prev.id}`}
                            className='group flex flex-col items-start p-5 md:p-6 bg-muted/5 border border-transparent hover:border-border hover:bg-muted/20 transition-colors h-full'>
                            <span className='font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 flex items-center gap-2'>
                                <ChevronLeft className='w-3 h-3 md:w-4 md:h-4 text-primary transition-transform duration-300 group-hover:-translate-x-1' />
                                Previous {label}
                            </span>
                            <h3 className='text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2'>
                                {prev.title}
                            </h3>
                        </Link>
                    </motion.div>
                ) : (
                    <div className='hidden sm:block' />
                )}

                {next ? (
                    <motion.div whileHover={lift} whileTap={press} transition={spring}>
                        <Link
                            href={`${basePath}/${next.id}`}
                            className='group flex flex-col items-end text-right p-5 md:p-6 bg-muted/5 border border-transparent hover:border-border hover:bg-muted/20 transition-colors h-full'>
                            <span className='font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 flex items-center gap-2'>
                                Next {label}
                                <ChevronRight className='w-3 h-3 md:w-4 md:h-4 text-primary transition-transform duration-300 group-hover:translate-x-1' />
                            </span>
                            <h3 className='text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2'>
                                {next.title}
                            </h3>
                        </Link>
                    </motion.div>
                ) : (
                    <div className='hidden sm:block' />
                )}
            </div>
        </BorderCross>
    );
}
