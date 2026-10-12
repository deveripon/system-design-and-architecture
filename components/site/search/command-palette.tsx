"use client";

import {
  SEARCH_GROUP_LIMITS,
  SEARCH_RECENTS_KEY,
  SEARCH_RECENTS_LIMIT,
} from "@/lib/search/constants";
import { groupHits, searchEntries } from "@/lib/search/search";
import type { SearchEntry, SearchKind } from "@/lib/search/types";
import { cn } from "@/lib/utils";
import {
  Compass,
  CornerDownLeft,
  FileText,
  Hash,
  History,
  Layers,
  LoaderCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useMemo, useState } from "react";
import type { IndexState } from "./search-provider";

const KIND_ICON: Record<SearchKind, typeof Search> = {
  page: Compass,
  lesson: FileText,
  module: Layers,
  section: Hash,
};

const KIND_HEADING: Record<SearchKind, string> = {
  page: "Pages",
  lesson: "Lessons",
  module: "Modules",
  section: "Inside lessons",
};

const KINDS = Object.keys(KIND_ICON);
const LISTBOX_ID = "site-search-results";
const optionId = (index: number) => `site-search-option-${index}`;

interface ResultGroup {
  id: string;
  heading: string;
  items: SearchEntry[];
  /** Matches before the group limit, when there were more than shown. */
  total?: number;
  recent?: boolean;
}

function isStoredEntry(value: unknown): value is SearchEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.title === "string" &&
    typeof entry.href === "string" &&
    // Only in-site paths are ever stored, so anything else is not ours.
    /^\/(?!\/)/.test(entry.href) &&
    typeof entry.kind === "string" &&
    KINDS.includes(entry.kind)
  );
}

// Storage can be blocked or hold something stale, and search works without it.
function readRecents(): SearchEntry[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SEARCH_RECENTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isStoredEntry).slice(0, SEARCH_RECENTS_LIMIT) : [];
  } catch {
    return [];
  }
}

function saveRecent(entry: SearchEntry) {
  try {
    const { kind, title, label, context, href, comingSoon } = entry;
    const next = [
      { kind, title, label, context, href, comingSoon },
      ...readRecents().filter((item) => item.href !== href),
    ].slice(0, SEARCH_RECENTS_LIMIT);
    localStorage.setItem(SEARCH_RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Nothing to do: the result still opens.
  }
}

function subline(entry: SearchEntry) {
  if (entry.kind === "section") return [entry.context, entry.label].filter(Boolean).join(" › ");
  return entry.context;
}

function PaletteBody({
  index,
  onRetry,
  onClose,
}: {
  index: IndexState;
  onRetry: () => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  // The body only mounts when the panel opens, so this reads fresh each time.
  const [recents] = useState(readRecents);
  const searching = query.trim().length > 0;

  const groups = useMemo<ResultGroup[]>(() => {
    if (searching) {
      return groupHits(searchEntries(index.entries, query), SEARCH_GROUP_LIMITS).map((group) => ({
        id: group.kind,
        heading: KIND_HEADING[group.kind],
        items: group.hits.map((hit) => hit.entry),
        total: group.total > group.hits.length ? group.total : undefined,
      }));
    }
    const pages = index.entries.filter((item) => item.entry.kind === "page").map((item) => item.entry);
    return [
      { id: "recent", heading: "Recent", items: recents, recent: true },
      { id: "page", heading: KIND_HEADING.page, items: pages },
    ].filter((group) => group.items.length > 0);
  }, [searching, query, index.entries, recents]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  // Where each group starts in the flat list the arrow keys walk.
  const offsets = useMemo(
    () => groups.map((_, i) => groups.slice(0, i).reduce((sum, group) => sum + group.items.length, 0)),
    [groups],
  );
  const current = flat[Math.min(active, flat.length - 1)];
  const activeIndex = current ? flat.indexOf(current) : -1;

  useEffect(() => {
    if (activeIndex >= 0) {
      document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const choose = (entry: SearchEntry) => {
    saveRecent(entry);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (flat.length === 0) return;
    const last = flat.length - 1;
    const move = (next: number) => {
      event.preventDefault();
      setActive(next);
    };
    if (event.key === "ArrowDown") move(activeIndex >= last ? 0 : activeIndex + 1);
    else if (event.key === "ArrowUp") move(activeIndex <= 0 ? last : activeIndex - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(last);
    else if (event.key === "Enter" && current && !event.nativeEvent.isComposing) {
      event.preventDefault();
      choose(current);
      router.push(current.href);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border px-4">
        {index.status === "loading" ? (
          <LoaderCircle className="w-4 h-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
        )}
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={LISTBOX_ID}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          aria-label="Search lessons, topics and pages"
          placeholder="Search lessons, topics, commands..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          // 16px keeps iOS from zooming the page when the field takes focus.
          className="h-14 flex-1 min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 outline-none"
        />
        <kbd className="shrink-0 border border-border px-1.5 py-1 font-mono text-[0.625rem] leading-none text-muted-foreground">
          ESC
        </kbd>
      </div>

      <div
        id={LISTBOX_ID}
        role="listbox"
        aria-label="Search results"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-2"
      >
        {index.status === "error" && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            <p className="mb-4">The search index could not be loaded.</p>
            <button
              type="button"
              onClick={onRetry}
              className="border border-border px-3 py-1.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-foreground hover:border-primary/50"
            >
              Try again
            </button>
          </div>
        )}

        {index.status === "loading" && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">Loading the index...</p>
        )}

        {index.status === "ready" && searching && flat.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            <p className="text-foreground mb-1">Nothing matches that.</p>
            <p>Try a shorter word, or the English term, for example DNS, handshake or subnet.</p>
          </div>
        )}

        {groups.map((group, groupIndex) => (
          <div key={group.id} role="group" aria-label={group.heading} className="pb-2">
            <div className="flex items-baseline justify-between px-4 pt-3 pb-1.5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              <span>{group.heading}</span>
              {group.total && (
                <span className="tracking-[0.12em]">
                  {group.items.length} of {group.total}
                </span>
              )}
            </div>
            {group.items.map((entry, entryIndex) => {
              const itemIndex = offsets[groupIndex] + entryIndex;
              const isActive = itemIndex === activeIndex;
              const Icon = group.recent ? History : KIND_ICON[entry.kind];
              const second = subline(entry);
              return (
                <Link
                  key={`${group.id}:${entry.href}`}
                  id={optionId(itemIndex)}
                  href={entry.href}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  onClick={() => choose(entry)}
                  onMouseMove={() => setActive(itemIndex)}
                  className={cn(
                    "flex items-start gap-3 border-l-2 px-4 py-2.5 transition-colors",
                    isActive ? "border-primary bg-primary/10" : "border-transparent",
                  )}
                >
                  <Icon
                    className={cn("w-4 h-4 shrink-0 mt-0.5", isActive ? "text-primary" : "text-muted-foreground")}
                  />
                  <span className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "block truncate text-sm font-medium leading-snug",
                        isActive ? "text-primary" : "text-foreground",
                      )}
                    >
                      {entry.title}
                    </span>
                    {second && (
                      <span className="mt-0.5 block truncate font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted-foreground">
                        {second}
                      </span>
                    )}
                    {entry.description && (
                      <span className="mt-1 block truncate text-[0.75rem] leading-snug text-muted-foreground">
                        {entry.description}
                      </span>
                    )}
                  </span>
                  {entry.comingSoon && (
                    <span className="shrink-0 mt-0.5 border border-border px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                  <CornerDownLeft
                    className={cn("w-3.5 h-3.5 shrink-0 mt-1 text-primary", isActive ? "opacity-100" : "opacity-0")}
                  />
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-4 border-t border-border bg-muted/30 px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
        <span>↑↓ Move</span>
        <span>↵ Open</span>
        <span>Esc Close</span>
        <span className="ml-auto normal-case tracking-normal">
          {index.status === "ready" && `${index.entries.length} places to jump to`}
        </span>
      </div>
    </>
  );
}

/**
 * The site wide search panel: one field, grouped results, keyboard first.
 * Opened from `SearchProvider`, which owns the shortcut and the index.
 */
export function CommandPalette({
  open,
  onOpenChange,
  index,
  onRetry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: IndexState;
  onRetry: () => void;
}) {
  return (
    // No exit animation on purpose: Radix keeps a closing dialog mounted, with
    // the page scroll locked, until its animation ends, and the jump to a
    // section anchor must not wait behind that.
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-3 sm:top-[10vh] z-[101] mx-auto flex max-h-[70dvh] w-[calc(100%-1.5rem)] max-w-2xl flex-col border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
        >
          <Dialog.Title className="sr-only">Search the site</Dialog.Title>
          <PaletteBody index={index} onRetry={onRetry} onClose={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
