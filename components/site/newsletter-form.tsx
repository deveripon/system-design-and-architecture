"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * The subscribe box. There is no mailing backend yet, so this validates the
 * address in the browser and acknowledges locally. It never sends the address
 * anywhere, which is why it can promise nothing more than "coming soon".
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "bad">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(EMAIL_RE.test(email.trim()) ? "ok" : "bad");
  };

  return (
    <div className="w-full">
      <form onSubmit={submit} className="flex w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="NAME@EMAIL.COM"
          aria-label="Email address"
          className="flex-1 min-w-0 border border-border bg-card px-4 py-3 font-mono text-[12px] tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 border border-l-0 border-border bg-primary px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Subscribe
        </button>
      </form>
      <p
        className={cn(
          "mt-2 font-mono text-[10px] tracking-wider min-h-[14px]",
          state === "ok" && "text-foreground",
          state === "bad" && "text-destructive",
          state === "idle" && "text-transparent select-none",
        )}
        aria-live="polite"
      >
        {state === "ok" && "ধন্যবাদ, Newsletter খুব শীঘ্রই আসছে।"}
        {state === "bad" && "একটা সঠিক Email দিন।"}
        {state === "idle" && "."}
      </p>
    </div>
  );
}
