"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { flushSync } from "react-dom";

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const reduce = useReducedMotion();
    const ref = useRef<HTMLButtonElement>(null);
    const isDark = resolvedTheme === "dark";

    const toggle = () => {
        const next = isDark ? "light" : "dark";
        const doc = document as Document & {
            startViewTransition?: (cb: () => void) => unknown;
        };
        const btn = ref.current;

        // The new theme is revealed as a circle expanding from the toggle
        // button, so measure the button and hand the origin plus a radius large
        // enough to reach the farthest corner to the CSS keyframes. `flushSync`
        // applies the theme class inside the callback so the snapshot captures
        // the new colours. No API or reduced motion means a plain flip.
        if (reduce || typeof doc.startViewTransition !== "function" || !btn) {
            setTheme(next);
            return;
        }

        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y),
        );
        const root = document.documentElement;
        root.style.setProperty("--vt-x", `${x}px`);
        root.style.setProperty("--vt-y", `${y}px`);
        root.style.setProperty("--vt-r", `${radius}px`);

        doc.startViewTransition(() => flushSync(() => setTheme(next)));
    };

    return (
        <motion.button
            ref={ref}
            onClick={toggle}
            aria-label="Toggle theme"
            whileTap={reduce ? undefined : { scale: 0.88, rotate: -20 }}
            whileHover={reduce ? undefined : { rotate: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="relative w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
        </motion.button>
    );
}
