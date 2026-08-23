/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn, toBn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useState } from 'react';

export interface RoadmapSection {
    id: string;
    title: string;
    duration: string;
    topics: any[];
}

interface RoadmapViewProps {
    sections: RoadmapSection[];
    /** Route prefix for a topic page, e.g. `/topic` or `/devops/topic`. */
    basePath: string;
    /** Label above a section title — "Phase" for the course, "Module" for the track. */
    sectionLabel?: string;
    /** Section ids expanded on first render. */
    defaultExpanded?: string[];
}

const SECTION_COLORS = [
    { accent: 'bg-primary', text: 'text-primary' },
    { accent: 'bg-accent', text: 'text-accent' },
    { accent: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { accent: 'bg-teal-600', text: 'text-teal-700 dark:text-teal-300' },
    { accent: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
];

export function RoadmapView({
    sections,
    basePath,
    sectionLabel = 'Phase',
    defaultExpanded = [],
}: RoadmapViewProps) {
    const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

    const toggle = (id: string) =>
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );

    return (
        <div className='border-t border-l border-border'>
            {sections.map((section, sectionIdx) => {
                const colors = SECTION_COLORS[sectionIdx % SECTION_COLORS.length];
                const isOpen = expanded.includes(section.id);

                return (
                    <div
                        key={section.id}
                        className='border-r border-b border-border'>
                        <div
                            onClick={() => toggle(section.id)}
                            className='flex items-center gap-3 md:gap-4 p-4 md:p-6 cursor-pointer transition-all hover:bg-primary/5 dark:hover:bg-white/2 bg-muted/20'>
                            <div className={cn('w-1 h-6 md:h-8', colors.accent)} />
                            <div className='flex flex-col min-w-0'>
                                <span
                                    className={cn(
                                        'text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em]',
                                        colors.text
                                    )}>
                                    {sectionLabel}{' '}
                                    {String(sectionIdx + 1).padStart(2, '0')}
                                </span>
                                <h2 className='text-base md:text-xl font-black uppercase tracking-tighter truncate'>
                                    {section.title}
                                </h2>
                            </div>
                            <div className='flex-1' />
                            <span className='hidden sm:block text-[10px] md:text-xs text-muted-foreground font-mono font-bold whitespace-nowrap'>
                                {toBn(section.topics.length)} লেসন
                            </span>
                            <span className='text-[10px] md:text-xs text-muted-foreground font-mono font-bold whitespace-nowrap'>
                                {section.duration}
                            </span>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 md:w-5 md:h-5 text-muted-foreground transition-transform shrink-0',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </div>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className='overflow-hidden'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 border-t border-border'>
                                        {section.topics.map((topic, idx) => {
                                            const showGroup =
                                                topic.group &&
                                                topic.group !==
                                                    section.topics[idx - 1]
                                                        ?.group;

                                            return (
                                                <Fragment key={topic.id}>
                                                    {showGroup && (
                                                        <p className='md:col-span-2 px-6 py-3 border-r border-b border-border bg-muted/40 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground'>
                                                            {topic.group}
                                                        </p>
                                                    )}
                                                    <TopicCard
                                                        topic={topic}
                                                        basePath={basePath}
                                                    />
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

function TopicCard({ topic, basePath }: { topic: any; basePath: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMore = Boolean(topic.details || topic.tools || topic.useCases);
    const Icon = topic.icon;

    return (
        <div className='relative group bg-card p-6 md:p-8 transition-all duration-200 border-r border-b border-border hover:bg-primary/5 dark:hover:bg-muted/10'>
            <div className='flex flex-col sm:flex-row items-start gap-4 md:gap-6'>
                {Icon && (
                    <div className='w-10 h-10 md:w-12 md:h-12 border border-border flex items-center justify-center bg-background shrink-0'>
                        <Icon className='w-5 h-5 md:w-6 md:h-6 text-primary' />
                    </div>
                )}
                <div className='flex-1 space-y-2 md:space-y-3'>
                    <div className='flex flex-wrap items-center gap-2 md:gap-3'>
                        <h3 className='font-black text-base md:text-lg uppercase tracking-tight leading-none group-hover:text-primary transition-colors'>
                            {topic.title}
                        </h3>
                        {topic.tag && (
                            <span className='text-[8px] md:text-[9px] font-mono font-bold px-2 py-0.5 border border-border text-muted-foreground uppercase'>
                                {topic.tag}
                            </span>
                        )}
                    </div>
                    <p className='text-xs md:text-sm text-muted-foreground leading-relaxed font-medium'>
                        {topic.summary}
                    </p>
                </div>
            </div>

            <div className='flex items-center justify-between gap-4 mt-6 md:mt-8'>
                {hasMore ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className='text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'>
                        {isExpanded ? '[-] Less' : '[+] More'}
                    </button>
                ) : (
                    <span className='text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground/60'>
                        {topic.time}
                    </span>
                )}

                <Link
                    href={`${basePath}/${topic.id}`}
                    className='group/btn inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 border border-primary/20 dark:border-white/10 text-[9px] md:text-[10px] font-mono font-black uppercase tracking-[0.2em] md:tracking-[0.25em] text-foreground/70 hover:text-foreground hover:border-primary/50 dark:hover:border-white/30 transition-all duration-200'>
                    Learn Deeply
                    <ArrowRight className='w-3 h-3 text-primary group-hover/btn:translate-x-0.5 transition-transform duration-200' />
                </Link>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className='overflow-hidden'>
                        <div className='mt-8 pt-8 border-t border-border space-y-8'>
                            {topic.details && (
                                <div className='space-y-3'>
                                    <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary'>
                                        Learning Objectives
                                    </h4>
                                    <div className='p-4 border border-border bg-background text-sm text-muted-foreground leading-relaxed italic'>
                                        &quot;{topic.details}&quot;
                                    </div>
                                </div>
                            )}

                            {topic.tools && (
                                <div className='space-y-4'>
                                    <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary'>
                                        Tech Stack
                                    </h4>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {topic.tools.map((tool: string) => (
                                            <div
                                                key={tool}
                                                className='px-3 py-2 border border-border bg-muted/5 text-[11px] text-foreground font-mono font-bold uppercase'>
                                                {tool}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {topic.useCases && (
                                <div className='space-y-4'>
                                    <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary'>
                                        Real-world Scenarios
                                    </h4>
                                    <div className='space-y-2'>
                                        {topic.useCases.map(
                                            (useCase: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className='flex items-start gap-4 p-3 border border-border text-xs text-muted-foreground leading-relaxed bg-muted/5'>
                                                    <span className='text-primary font-mono font-bold'>
                                                        0{idx + 1}
                                                    </span>
                                                    {useCase}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
