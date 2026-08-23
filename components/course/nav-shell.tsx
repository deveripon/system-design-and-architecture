/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModeToggle } from '../mode-toggle';

export interface NavTopic {
    id: string;
    title: string;
    icon?: any;
    group?: string;
}

export interface NavSection {
    id: string;
    title: string;
    duration?: string;
    topics: NavTopic[];
}

export interface NavProps {
    sections: NavSection[];
    /** Route prefix for a lesson, e.g. `/topic` or `/devops/topic`. */
    basePath: string;
    /** Where the wordmark links to. */
    homeHref: string;
    eyebrow: string;
    title: string;
    /** Collapse sections into accordions — worth it once a track has many lessons. */
    collapsible?: boolean;
}

/**
 * Section titles are bilingual ("Docker & Containerization — কন্টেইনারাইজেশন").
 * Uppercase + wide tracking mangles Bengali conjuncts, so the two halves are
 * rendered as separate lines with their own type treatment.
 */
function splitTitle(title: string) {
    const parts = title.split(/\s+[—–-]\s+/);
    return {
        name: parts[0].trim(),
        native: parts.slice(1).join(' — ').trim(),
    };
}

function SectionLabel({ index, title }: { index: string; title: string }) {
    const { name, native } = splitTitle(title);

    return (
        <>
            <span className='font-mono text-[10px] font-bold tabular-nums pt-px shrink-0 text-muted-foreground/60'>
                {index}
            </span>
            <span className='flex-1 min-w-0'>
                <span className='block font-mono text-[11px] font-bold uppercase tracking-[0.06em] leading-snug text-foreground/85 group-hover:text-foreground'>
                    {name}
                </span>
                {native && (
                    <span className='block text-[11px] leading-snug mt-1 text-muted-foreground'>
                        {native}
                    </span>
                )}
            </span>
        </>
    );
}

function useActiveSection(sections: NavSection[], basePath: string) {
    const pathname = usePathname();
    const activeId = useMemo(() => {
        const match = sections.find(section =>
            section.topics.some(topic => pathname === `${basePath}/${topic.id}`)
        );
        return match?.id ?? null;
    }, [sections, basePath, pathname]);

    return { pathname, activeId };
}

/**
 * The link list shared by the desktop sidebar and the mobile drawer.
 */
export function NavList({
    sections,
    basePath,
    collapsible = false,
    onNavigate,
}: Pick<NavProps, 'sections' | 'basePath' | 'collapsible'> & {
    onNavigate?: () => void;
}) {
    const { pathname, activeId } = useActiveSection(sections, basePath);
    // Only user toggles are stored; the section holding the current lesson is
    // open by default, so navigating to another module opens it on its own.
    const [overrides, setOverrides] = useState<Record<string, boolean>>({});
    const autoOpenId = activeId ?? sections[0]?.id;

    const isSectionOpen = (id: string) => overrides[id] ?? id === autoOpenId;

    const toggle = (id: string) =>
        setOverrides(prev => ({ ...prev, [id]: !isSectionOpen(id) }));

    return (
        <nav className='px-2 divide-y divide-border/60'>
            {sections.map((section, sectionIdx) => {
                const isOpen = !collapsible || isSectionOpen(section.id);

                return (
                    <div key={section.id} className='py-1'>
                        {collapsible ? (
                            <button
                                onClick={() => toggle(section.id)}
                                aria-expanded={isOpen}
                                className='w-full flex items-start gap-3 pl-3 pr-2.5 py-3 text-left transition-colors group border-l-2 border-transparent hover:bg-card'>
                                <SectionLabel
                                    index={String(sectionIdx + 1).padStart(
                                        2,
                                        '0'
                                    )}
                                    title={section.title}
                                />
                                <ChevronDown
                                    className={cn(
                                        'w-3.5 h-3.5 shrink-0 mt-px transition-transform text-muted-foreground/60 group-hover:text-foreground',
                                        isOpen && 'rotate-180'
                                    )}
                                />
                            </button>
                        ) : (
                            <div className='flex items-start gap-3 px-3 mb-3'>
                                <SectionLabel
                                    index={String(sectionIdx + 1).padStart(
                                        2,
                                        '0'
                                    )}
                                    title={section.title}
                                />
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={
                                        collapsible
                                            ? { height: 0, opacity: 0 }
                                            : false
                                    }
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className='overflow-hidden'>
                                    <div className='space-y-0.5 pb-2'>
                                        {section.topics.map((topic, idx) => {
                                            const isActive =
                                                pathname ===
                                                `${basePath}/${topic.id}`;
                                            const showGroup =
                                                topic.group &&
                                                topic.group !==
                                                    section.topics[idx - 1]
                                                        ?.group;
                                            const Icon = topic.icon;

                                            return (
                                                <div key={topic.id}>
                                                    {showGroup && (
                                                        <p className='pl-6 pr-3 pt-4 pb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70'>
                                                            {topic.group}
                                                        </p>
                                                    )}
                                                    <Link
                                                        href={`${basePath}/${topic.id}`}
                                                        onClick={onNavigate}
                                                        className={cn(
                                                            'flex items-start gap-3 pl-6 pr-3 py-2 text-[13px] leading-snug transition-all duration-200 group border-l-2',
                                                            isActive
                                                                ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                                : 'border-transparent text-muted-foreground hover:bg-card hover:text-foreground'
                                                        )}>
                                                        {Icon && (
                                                            <Icon
                                                                className={cn(
                                                                    'w-4 h-4 shrink-0 mt-px transition-colors',
                                                                    isActive
                                                                        ? 'text-primary'
                                                                        : 'text-muted-foreground group-hover:text-foreground'
                                                                )}
                                                            />
                                                        )}
                                                        <span className='line-clamp-2 pr-1'>
                                                            {topic.title}
                                                        </span>
                                                        <span className='ml-auto font-mono text-[10px] text-muted-foreground/50 group-hover:text-primary transition-colors tabular-nums mt-px'>
                                                            {String(
                                                                idx + 1
                                                            ).padStart(2, '0')}
                                                        </span>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </nav>
    );
}

/** Fixed desktop sidebar. */
export function SidebarShell({
    sections,
    basePath,
    homeHref,
    eyebrow,
    title,
    collapsible,
}: NavProps) {
    return (
        <aside
            className='fixed left-0 top-0 bottom-0 w-84 bg-muted border-r border-border py-6 overflow-y-auto sidebar-scroll z-40 hidden lg:block'
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--border) transparent',
            }}>
            <div className='px-6 pb-6 mb-6 border-b border-border'>
                <div className='flex justify-between items-start gap-2'>
                    <Link href={homeHref} className='group'>
                        <span className='font-mono text-[10px] text-primary tracking-[0.2em] uppercase block mb-1'>
                            {eyebrow}
                        </span>
                        <h1 className='font-heading text-lg font-bold leading-tight group-hover:text-primary transition-colors'>
                            {title}
                        </h1>
                    </Link>
                    <ModeToggle />
                </div>
            </div>

            <NavList
                sections={sections}
                basePath={basePath}
                collapsible={collapsible}
            />
        </aside>
    );
}

/** Mobile top bar plus slide-in drawer. */
export function MobileNavShell({
    sections,
    basePath,
    homeHref,
    eyebrow,
    title,
    collapsible,
}: NavProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll while the drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <header className='lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-background/95 backdrop-blur-sm border-b border-border'>
                <Link
                    href={homeHref}
                    onClick={() => setIsOpen(false)}
                    className='flex items-center gap-2 min-w-0'>
                    <span className='font-mono text-[10px] text-primary tracking-[0.2em] uppercase shrink-0'>
                        {eyebrow}
                    </span>
                    <span className='font-heading text-sm font-bold leading-none truncate'>
                        {title}
                    </span>
                </Link>
                <div className='flex items-center gap-3'>
                    <ModeToggle />
                    <button
                        onClick={() => setIsOpen(v => !v)}
                        className='w-9 h-9 flex items-center justify-center border border-border hover:border-primary/50 transition-colors'
                        aria-label='Toggle navigation'>
                        {isOpen ? (
                            <X className='w-4 h-4' />
                        ) : (
                            <Menu className='w-4 h-4' />
                        )}
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className='lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm'
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                duration: 0.35,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className='lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 bg-muted border-r border-border overflow-y-auto sidebar-scroll'>
                            <div className='px-6 py-5 border-b border-border flex items-start justify-between gap-2'>
                                <div className='min-w-0'>
                                    <span className='font-mono text-[10px] text-primary tracking-[0.2em] uppercase block mb-1'>
                                        {eyebrow}
                                    </span>
                                    <h1 className='font-heading text-lg font-bold leading-tight'>
                                        {title}
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className='w-8 h-8 flex items-center justify-center border border-border hover:border-primary/50 transition-colors shrink-0'
                                    aria-label='Close navigation'>
                                    <X className='w-4 h-4' />
                                </button>
                            </div>

                            <div className='py-6'>
                                <NavList
                                    sections={sections}
                                    basePath={basePath}
                                    collapsible={collapsible}
                                    onNavigate={() => setIsOpen(false)}
                                />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
