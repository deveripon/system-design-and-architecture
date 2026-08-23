'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from './reveal';

/**
 * One height animation for every collapsible in the app, so a lab, a code
 * example and an accordion all open with the same feel.
 */
export function Collapse({
    open,
    children,
    className,
    duration = 0.4,
}: {
    open: boolean;
    children: React.ReactNode;
    className?: string;
    duration?: number;
}) {
    const reduce = useReducedMotion();

    return (
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    key='content'
                    initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={
                        reduce
                            ? { opacity: 1 }
                            : { height: 'auto', opacity: 1 }
                    }
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{
                        duration: reduce ? 0 : duration,
                        ease: EASE,
                        opacity: { duration: reduce ? 0 : duration * 0.6 },
                    }}
                    className={`overflow-hidden ${className ?? ''}`}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
