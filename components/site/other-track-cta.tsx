"use client";

import { ArrowUpRight, Network, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The last cell of the footer social row points at the track you are NOT on:
 * "DevOps Track" while browsing System Design, "System Design" while on the
 * DevOps pages. It needs the current path, so it is the one client island in an
 * otherwise server-rendered footer.
 */
export function OtherTrackCta() {
  const pathname = usePathname();
  const onDevops = pathname.startsWith("/devops");
  const track = onDevops
    ? { label: "System Design", href: "/", Icon: Workflow }
    : { label: "DevOps Track", href: "/devops", Icon: Network };

  return (
    <Link
      href={track.href}
      className="group flex items-center justify-between gap-4 px-5 py-6 border-r border-b border-border hover:bg-muted transition-colors"
    >
      <span className="flex items-center gap-3">
        <track.Icon className="w-4 h-4 text-foreground" />
        <span className="font-mono text-[12px] font-bold text-foreground">
          {track.label}
        </span>
      </span>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}
