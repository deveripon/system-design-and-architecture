'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

/** The project's easing curve, used for interactions. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** A long gentle ease for reveals. Nothing snappy, nothing that lands hard. */
const REVEAL_EASE = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Reveals start well before the block reaches the fold, so scrolling never
 * catches one mid animation.
 *
 * `amount: 'some'` is deliberate. A fraction like 0.15 means "15% of the
 * element", and a lesson section can be several thousand pixels tall, so 15%
 * of it never fits on screen and the reveal would never fire.
 */
const VIEWPORT = {
    once: true,
    amount: 'some' as const,
    // Roughly a screen ahead of the fold, in px rather than a percentage so
    // there is no doubt about how the browser resolves it. By the time a block
    // is actually on screen its fade has already finished.
    margin: '0px 0px 900px 0px',
};

/**
 * Fades a block in as it approaches the viewport, once.
 *
 * Opacity only, on purpose. These wrap sections built with `BorderCross`, whose
 * rules stretch 100vw to either side; animating a transform on the ancestor
 * forces those to re-rasterise every frame and the lines visibly shimmer.
 */
export function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();

    if (reduce) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            style={{ willChange: 'opacity' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay, ease: REVEAL_EASE }}>
            {children}
        </motion.div>
    );
}

const groupVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/**
 * Children carry a small lift as well as the fade. Safe here: these are cards
 * and list items, not sections with bleeding rules.
 */
const childVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    shown: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: REVEAL_EASE },
    },
};

export function RevealGroup({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const reduce = useReducedMotion();

    if (reduce) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            variants={groupVariants}
            initial='hidden'
            whileInView='shown'
            viewport={VIEWPORT}>
            {children}
        </motion.div>
    );
}

export function RevealChild({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const reduce = useReducedMotion();

    if (reduce) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            style={{ willChange: 'opacity, transform' }}
            variants={childVariants}>
            {children}
        </motion.div>
    );
}

