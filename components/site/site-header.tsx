import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Suspense } from "react";
import { GithubStats, GithubStatsFallback } from "./github-stats";
import { HeaderNav, MobileMenu } from "./header-nav";
import { Logo } from "./logo";

/**
 * Site chrome for the marketing pages: logo, the two tracks as navigation, and
 * the repo with live star and fork counts on the right. The lesson reader keeps
 * its own left sidebar, so this header is not used there.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 xl:px-10 h-20 md:h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/" aria-label="Devripon home" className="shrink-0">
            <Logo className="h-10 md:h-12" />
          </Link>
          <HeaderNav />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Suspense fallback={<GithubStatsFallback />}>
            <GithubStats />
          </Suspense>
          <ModeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
