"use client";

import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export interface RealLifeScenario {
  id: string;
  /** Short button label. */
  label: string;
  /** What happens at work, told as a small scene. */
  situation: string;
  /** How it goes for someone who skipped this module. */
  without: string;
  /** How it goes once the module is understood. */
  withIt: string;
  /** Titles of the lessons that give the answer. */
  lessons: string[];
}

/**
 * The overview chapter's main interactive: pick a real situation from work and
 * see how it goes with and without the module, and which lessons carry the answer.
 */
export function RealLifeLab({
  scenarios,
  footer,
}: {
  scenarios: RealLifeScenario[];
  footer?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(scenarios[0].id);
  const current = scenarios.find((s) => s.id === active) ?? scenarios[0];

  return (
    <figure className="my-10 border border-border bg-card">
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30">
        <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary">
          Interactive
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
          বাস্তবে কোথায় কাজে লাগে
        </span>
      </figcaption>
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              data-scenario={s.id}
              aria-pressed={s.id === active}
              className={cn(
                "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left",
                s.id === active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <motion.div
          key={current.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-active={current.id}
        >
          <p className="text-sm md:text-base leading-relaxed text-foreground mb-5">{current.situation}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="border border-border bg-background p-4">
              <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
                এই মডিউল না জানলে
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{current.without}</p>
            </div>
            <div className="border border-primary/50 bg-primary/5 p-4">
              <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
                এই মডিউল জানলে
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-foreground">{current.withIt}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
              উত্তর আছে এই লেসনে
            </span>
            {current.lessons.map((lesson) => (
              <span
                key={lesson}
                className="px-2 py-1 border border-border font-mono text-[0.625rem] text-muted-foreground"
              >
                {lesson}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
          {footer}
        </div>
      )}
    </figure>
  );
}
