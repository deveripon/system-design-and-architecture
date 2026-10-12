"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useSearch } from "./search-provider";

const subscribe = () => () => {};

/** The shortcut as the reader's keyboard labels it. Ctrl until hydrated. */
export function useShortcutLabel() {
  const isApple = useSyncExternalStore(
    subscribe,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false,
  );
  return isApple ? "⌘K" : "Ctrl K";
}

/**
 * Opens the command palette.
 * `bar` is a full width field look for the sidebar, `icon` a square button for
 * tight top bars, `responsive` is the icon on phones and the bar from md up.
 */
export function SearchTrigger({
  variant = "bar",
  className,
}: {
  variant?: "bar" | "icon" | "responsive";
  className?: string;
}) {
  const { openSearch, preload } = useSearch();
  const shortcut = useShortcutLabel();
  const wide = variant === "bar";
  const responsive = variant === "responsive";

  return (
    <button
      type="button"
      onClick={openSearch}
      onPointerEnter={preload}
      onFocus={preload}
      aria-label="Search the site"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "group flex items-center border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
        wide && "w-full h-9 gap-2.5 px-3 bg-background",
        variant === "icon" && "w-9 h-9 justify-center",
        responsive && "w-9 h-9 justify-center md:w-56 md:justify-start md:gap-2.5 md:px-3",
        className,
      )}
    >
      <Search className="w-4 h-4 shrink-0" />
      {variant !== "icon" && (
        <>
          <span className={cn("flex-1 text-left text-[0.75rem] truncate", responsive && "hidden md:block")}>
            Search lessons, topics...
          </span>
          <kbd
            className={cn(
              "shrink-0 border border-border px-1.5 py-0.5 font-mono text-[0.625rem] leading-none text-muted-foreground/80",
              responsive && "hidden md:block",
            )}
          >
            {shortcut}
          </kbd>
        </>
      )}
    </button>
  );
}
