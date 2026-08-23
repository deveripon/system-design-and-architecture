'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './reveal';

/**
 * A page level fade. This lives in a leaf `template.tsx`, never at the root:
 * a root template remounts every layout below it on navigation, which would
 * tear down the sidebar and its open module on every lesson change.
 */
export function PageFade({ children }: { children: React.ReactNode }) {
    const reduce = useReducedMotion();

    if (reduce) return <>{children}</>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: EASE }}>
            {children}
        </motion.div>
    );
}
