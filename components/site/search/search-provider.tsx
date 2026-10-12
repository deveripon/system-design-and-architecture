"use client";

import { SEARCH_INDEX_PATH } from "@/lib/search/constants";
import { prepareEntries, type PreparedEntry } from "@/lib/search/search";
import type { SearchIndex } from "@/lib/search/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CommandPalette } from "./command-palette";

export interface IndexState {
  status: "idle" | "loading" | "ready" | "error";
  entries: PreparedEntry[];
}

interface SearchContextValue {
  openSearch: () => void;
  /** Starts fetching the index, so it is there by the time the panel opens. */
  preload: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch() {
  const value = useContext(SearchContext);
  if (!value) throw new Error("useSearch must be used inside SearchProvider");
  return value;
}

// One fetch per page load, shared by every caller. A failed fetch is forgotten
// so the next attempt really retries.
let indexRequest: Promise<PreparedEntry[]> | null = null;

function loadIndex() {
  if (!indexRequest) {
    indexRequest = fetch(SEARCH_INDEX_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`Search index responded ${res.status}`);
        return res.json() as Promise<SearchIndex>;
      })
      .then((index) => prepareEntries(index.entries))
      .catch((error) => {
        indexRequest = null;
        throw error;
      });
  }
  return indexRequest;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/**
 * Owns the site search: the keyboard shortcuts, the lazily fetched index and
 * the panel itself. Mounted once in the root layout so every route has it.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<IndexState>({ status: "idle", entries: [] });

  const preload = useCallback(() => {
    setIndex((prev) =>
      prev.status === "ready" ? prev : { status: "loading", entries: [] },
    );
    loadIndex().then(
      (entries) => setIndex({ status: "ready", entries }),
      () => setIndex({ status: "error", entries: [] }),
    );
  }, []);

  const openSearch = useCallback(() => {
    preload();
    setOpen(true);
  }, [preload]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && key === "k") {
        event.preventDefault();
        preload();
        setOpen((value) => !value);
        return;
      }
      const bare = !event.metaKey && !event.ctrlKey && !event.altKey;
      if (key === "/" && bare && !isTypingTarget(event.target)) {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch, preload]);

  const value = useMemo(() => ({ openSearch, preload }), [openSearch, preload]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} index={index} onRetry={preload} />
    </SearchContext.Provider>
  );
}
