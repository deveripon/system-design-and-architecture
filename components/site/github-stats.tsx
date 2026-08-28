import { GitFork, Star } from "lucide-react";
import { GithubIcon } from "./brand-icons";

/**
 * The repo link with live star and fork counts. Rendered on the server and
 * cached for an hour, so it never blocks the header on a cold request and never
 * hits GitHub's rate limit from the browser. If the call fails for any reason
 * the link still renders, just without the numbers.
 */

const OWNER_REPO = "Deveripon/system-design-and-architecture";
const REPO_URL = `https://github.com/${OWNER_REPO}`;

async function getStats(): Promise<{ stars: number; forks: number } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      stars: Number(data.stargazers_count ?? 0),
      forks: Number(data.forks_count ?? 0),
    };
  } catch {
    return null;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub repository"
      className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] font-bold text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
    >
      {children}
    </a>
  );
}

export function GithubStatsFallback() {
  return (
    <Shell>
      <GithubIcon className="w-4 h-4" />
      <span className="hidden sm:inline">GitHub</span>
    </Shell>
  );
}

export async function GithubStats() {
  const stats = await getStats();
  if (!stats) return <GithubStatsFallback />;
  return (
    <Shell>
      <GithubIcon className="w-4 h-4" />
      <span className="inline-flex items-center gap-1 tabular-nums">
        <Star className="w-3.5 h-3.5" />
        {stats.stars}
      </span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <GitFork className="w-3.5 h-3.5" />
        {stats.forks}
      </span>
    </Shell>
  );
}
