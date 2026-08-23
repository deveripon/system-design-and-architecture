"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const reduce = useReducedMotion();
    const isDark = resolvedTheme === "dark";

    return (
        <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
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
