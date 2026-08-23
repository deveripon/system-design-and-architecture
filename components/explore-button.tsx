'use client';

import { animate, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

/** Gentle start, long glide, soft landing. Feels better than a pure ease-out. */
const SCROLL_EASE = [0.33, 0, 0.15, 1] as const;
/** Leave a little air above the section heading. */
const OFFSET = 24;

export function ExploreButton({ targetId = 'roadmap' }: { targetId?: string }) {
    const reduce = useReducedMotion();
    const running = useRef<{ stop: () => void } | null>(null);

    // Never leave a scroll animation running after the page changes.
    useEffect(() => () => running.current?.stop(), []);

    const scrollToTarget = () => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const to = Math.max(
            0,
            target.getBoundingClientRect().top + window.scrollY - OFFSET
        );
        const from = window.scrollY;
        const distance = Math.abs(to - from);
        if (distance < 2) return;

        running.current?.stop();

        if (reduce) {
            window.scrollTo(0, to);
            return;
        }

        // Long jumps need longer, or they feel like a teleport.
        const duration = Math.min(1.5, Math.max(0.55, distance / 1600));

        const cleanup = () => {
            window.removeEventListener('wheel', cancel, { capture: true });
            window.removeEventListener('touchstart', cancel, { capture: true });
            window.removeEventListener('keydown', cancel, { capture: true });
            running.current = null;
        };

        const controls = animate(from, to, {
            duration,
            ease: SCROLL_EASE,
            // behavior: 'instant' overrides the stylesheet's
            // scroll-behavior: smooth. Without it the browser starts its own
            // animation on every frame we set a position, and the two fight
            // each other, which is what made this feel like it stuttered.
            onUpdate: top => window.scrollTo({ top, behavior: 'instant' }),
            onComplete: cleanup,
        });

        function cancel() {
            controls.stop();
            cleanup();
        }

        // If the reader takes over mid flight, get out of their way.
        window.addEventListener('wheel', cancel, { passive: true, capture: true });
        window.addEventListener('touchstart', cancel, { passive: true, capture: true });
        window.addEventListener('keydown', cancel, { capture: true });

        running.current = { stop: cancel };
    };

    return (
        <motion.button
            onClick={scrollToTarget}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className='group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs border border-primary hover:bg-foreground hover:border-foreground hover:text-background transition-colors duration-300'>
            Explore Roadmap
            <ArrowDown className='w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5' />
        </motion.button>
    );
}
