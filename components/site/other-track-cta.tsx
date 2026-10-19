"use client";

import { nextTrack, trackForPath, TRACKS, type TrackId } from "@/lib/tracks";
import { ArrowUpRight, Database, Network, Workflow, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CTA: Record<TrackId, { label: string; Icon: LucideIcon }> = {
  devops: { label: "DevOps Track", Icon: Network },
  sql: { label: "SQL Track", Icon: Database },
  "system-design": { label: "System Design", Icon: Workflow },
};

/**
 * The last cell of the footer social row points at the next track along from
 * the one you are on, in the site's track order, wrapping from the last back
 * to the first. It needs the current path, so it is the one client island in
 * an otherwise server-rendered footer.
 */
export function OtherTrackCta() {
  const current = trackForPath(usePathname());
  // A page outside every track points at the main track, the first one.
  const target = current ? nextTrack(current.id) : TRACKS[0];
  const track = { ...CTA[target.id], href: target.href };

  return (
    <Link
      href={track.href}
      className="group flex items-center justify-between gap-4 px-5 py-6 border-r border-b border-border hover:bg-muted transition-colors"
    >
      <span className="flex items-center gap-3">
        <track.Icon className="w-4 h-4 text-foreground" />
        <span className="font-mono text-[0.75rem] font-bold text-foreground">
          {track.label}
        </span>
      </span>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}
