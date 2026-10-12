'use client';

import type { OutlineItem } from '@/lib/lesson-outline';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { AlignLeft } from 'lucide-react';
import { Popover } from 'radix-ui';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

/** A section counts as current once its top passes this far below the top edge. */
const ACTIVE_LINE_PX = 120;

const subscribe = () => () => {};

/** The id of the section being read, following the scroll position. */
function useActiveSection(items: OutlineItem[]) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        let frame = 0;
        const measure = () => {
            frame = 0;
            let current: string | null = null;
            for (const item of items) {
                const el = document.getElementById(item.id);
                if (el && el.getBoundingClientRect().top <= ACTIVE_LINE_PX) {
                    current = item.id;
                }
            }
            setActiveId(current);
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        schedule();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, [items]);

    return activeId;
}

/** How the highlight travels between headlines: quick, with no overshoot. */
const MARKER_SPRING = { stiffness: 420, damping: 40, mass: 0.6 };

function OutlineList({
    items,
    activeId,
    onNavigate,
}: {
    items: OutlineItem[];
    activeId: string | null;
    onNavigate?: () => void;
}) {
    const listRef = useRef<HTMLOListElement>(null);
    const reduce = useReducedMotion();
    // One highlight slides between the headlines instead of each item
    // switching its own border on and off. It is driven by motion values, so
    // following the scroll never re-renders the list.
    const y = useSpring(0, MARKER_SPRING);
    const height = useSpring(0, MARKER_SPRING);
    const opacity = useSpring(0, MARKER_SPRING);
    const placed = useRef(false);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const place = () => {
            const current = list.querySelector<HTMLElement>('[aria-current]');
            if (!current) {
                opacity.set(0);
                placed.current = false;
                return;
            }
            // Appearing from nowhere, it should not fly in from the top.
            const jump = reduce || !placed.current;
            if (jump) {
                y.jump(current.offsetTop);
                height.jump(current.offsetHeight);
            } else {
                y.set(current.offsetTop);
                height.set(current.offsetHeight);
            }
            opacity.set(1);
            placed.current = true;
        };
        place();
        // Line wraps change with the width, and so does every offset.
        const observer = new ResizeObserver(place);
        observer.observe(list);
        return () => observer.disconnect();
    }, [activeId, items, reduce, y, height, opacity]);

    return (
        <ol ref={listRef} className='relative border-l border-border'>
            <motion.span
                aria-hidden
                className='pointer-events-none absolute -left-px right-0 top-0 border-l-2 border-primary bg-primary/10'
                style={{ y, height, opacity }}
            />
            {items.map(item => {
                const isActive = item.id === activeId;
                return (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={event => {
                                onNavigate?.();
                                const target = document.getElementById(item.id);
                                const plain =
                                    !event.metaKey &&
                                    !event.ctrlKey &&
                                    !event.shiftKey &&
                                    !event.altKey;
                                if (!target || !plain) return;
                                // The page scrolls smoothly by default, and a
                                // lesson is tens of screens long: gliding there
                                // takes seconds while the highlight crawls over
                                // every headline in between. A chosen headline
                                // is reached at once; only the highlight slides.
                                event.preventDefault();
                                target.scrollIntoView({
                                    behavior: 'instant',
                                    block: 'start',
                                });
                                history.replaceState(null, '', `#${item.id}`);
                            }}
                            aria-current={isActive ? 'location' : undefined}
                            className={cn(
                                'relative block py-2.5 pl-4 pr-3 transition-colors duration-300',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}>
                            <span className='flex items-baseline gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]'>
                                <span className='opacity-60 tabular-nums'>
                                    {item.index}
                                </span>
                                <span className='min-w-0 break-words'>
                                    {item.label}
                                </span>
                            </span>
                            {item.title && (
                                <span
                                    className={cn(
                                        'mt-1 block text-[0.8125rem] leading-snug line-clamp-2 transition-colors duration-300',
                                        isActive
                                            ? 'text-primary'
                                            : 'text-foreground/80'
                                    )}>
                                    {item.title}
                                </span>
                            )}
                        </a>
                    </li>
                );
            })}
        </ol>
    );
}

/**
 * "On this page": the headlines of the current lesson, with the one being read
 * highlighted. A fixed right rail from the `toc` breakpoint up, a floating button
 * with the same list below it.
 *
 * Both are portalled to the body. The lesson sits inside wrappers that animate
 * a transform on entry, and a transformed ancestor would capture `fixed`.
 */
export function LessonToc({ items }: { items: OutlineItem[] }) {
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
    const activeId = useActiveSection(items);
    const [open, setOpen] = useState(false);
    const railRef = useRef<HTMLElement>(null);

    // Keep the highlighted line in view when the rail itself has to scroll.
    useEffect(() => {
        railRef.current
            ?.querySelector('[aria-current]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [activeId]);

    if (items.length === 0) return null;

    const activeIndex = items.findIndex(item => item.id === activeId);

    return (
        <>
            {/* Tells the layout to leave room for the rail, see the topic layouts. */}
            <span data-lesson-toc hidden />
            {mounted &&
                createPortal(
                    <>
                        <aside
                            ref={railRef}
                            aria-label='On this page'
                            className='fixed right-0 top-0 bottom-0 z-30 hidden w-64 overflow-y-auto border-l border-border bg-background px-5 py-8 toc:block 2xl:w-80'
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'var(--border) transparent',
                            }}>
                            <p className='mb-4 flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-foreground'>
                                <AlignLeft className='h-3.5 w-3.5 text-primary' />
                                On this page
                            </p>
                            <OutlineList items={items} activeId={activeId} />
                        </aside>

                        <Popover.Root open={open} onOpenChange={setOpen}>
                            <Popover.Trigger
                                aria-label='On this page'
                                className='fixed bottom-4 right-4 z-40 flex h-10 items-center gap-2 border border-border bg-background/95 px-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-foreground shadow-lg backdrop-blur-sm transition-colors hover:border-primary/50 toc:hidden'>
                                <AlignLeft className='h-4 w-4 text-primary' />
                                <span className='hidden sm:inline'>
                                    On this page
                                </span>
                                <span className='tabular-nums text-muted-foreground'>
                                    {activeIndex + 1}/{items.length}
                                </span>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    side='top'
                                    align='end'
                                    sideOffset={8}
                                    collisionPadding={12}
                                    className='z-50 max-h-[min(70dvh,var(--radix-popover-content-available-height))] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain border border-border bg-background p-4 shadow-2xl outline-none toc:hidden'>
                                    <OutlineList
                                        items={items}
                                        activeId={activeId}
                                        onNavigate={() => setOpen(false)}
                                    />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    </>,
                    document.body
                )}
        </>
    );
}
