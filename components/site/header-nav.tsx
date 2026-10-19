"use client";

import { TRACKS, trackForPath, type TrackId } from "@/lib/tracks";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "./brand-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const REPO_URL = "https://github.com/Deveripon/system-design-and-architecture";

/** A track link is lit on every page of that track, its lessons included. */
function useIsActive() {
  const current = trackForPath(usePathname())?.id;
  return (id: TrackId) => id === current;
}

/** Inline track links, shown from the medium breakpoint up. */
export function HeaderNav() {
  const isActive = useIsActive();
  return (
    <nav className="hidden md:flex items-center gap-1">
      {TRACKS.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={cn(
            "px-3 py-2 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] transition-colors",
            isActive(t.id)
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

/** Hamburger plus a full-width dropdown, shown below the medium breakpoint. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
        aria-expanded={open}
        className="w-9 h-9 flex items-center justify-center border border-border hover:border-primary/50 transition-colors"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-20 z-40 bg-background/40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-20 z-50 border-b border-border bg-background">
            <nav className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 py-2">
              {TRACKS.map((t) => (
                <Link
                  key={t.id}
                  href={t.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-2 py-3 border-b border-border/60 font-mono text-[0.75rem] font-bold uppercase tracking-[0.12em] transition-colors",
                    isActive(t.id)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </Link>
              ))}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-3 font-mono text-[0.75rem] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
