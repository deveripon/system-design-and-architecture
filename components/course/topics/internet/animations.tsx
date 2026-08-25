"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function Panel({
  label,
  title,
  children,
  footer,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <figure className="my-10 border border-border bg-card">
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </span>
      </figcaption>
      <div className="p-5 md:p-8">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
          {footer}
        </div>
      )}
    </figure>
  );
}

function Controls({
  running,
  finished,
  onPlay,
  onStep,
  onReset,
  extra,
}: {
  running: boolean;
  finished: boolean;
  onPlay: () => void;
  onStep: () => void;
  onReset: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <button
        onClick={onPlay}
        className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
      >
        {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        {running ? "Pause" : finished ? "আবার" : "Play"}
      </button>
      <button
        onClick={onStep}
        className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <SkipForward className="w-3 h-3" />
        Step
      </button>
      {extra}
      <button
        onClick={onReset}
        aria-label="Reset"
        className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. দুইটা কম্পিউটার থেকে Internet                                            */
/* ------------------------------------------------------------------------- */

type Node = { id: string; x: number; y: number; label: string; big?: boolean };
type Edge = [string, string];

type Scene = {
  title: string;
  nodes: Node[];
  edges: Edge[];
  /** Ids drawn with the accent, the thing this step adds. */
  fresh: string[];
  note: string;
};

const SCENES: Scene[] = [
  {
    title: "দুইটা কম্পিউটার, একটা তার",
    nodes: [
      { id: "a", x: 260, y: 120, label: "Laptop" },
      { id: "b", x: 440, y: 120, label: "Laptop" },
    ],
    edges: [["a", "b"]],
    fresh: ["a", "b"],
    note: "দুইটা কম্পিউটারের মাঝে একটা তার লাগিয়ে দিলে একজন অন্যজনকে ফাইল পাঠাতে পারে। এই সবচেয়ে ছোট জিনিসটাকেই বলে Network। আপাতত পুরো পৃথিবীতে এই দুইজন ছাড়া কেউ নেই।",
  },
  {
    title: "আপনার বাসা: একটা Router, পাঁচটা যন্ত্র",
    nodes: [
      { id: "r1", x: 350, y: 120, label: "Router", big: true },
      { id: "a", x: 230, y: 50, label: "Laptop" },
      { id: "b", x: 470, y: 50, label: "Laptop" },
      { id: "c", x: 230, y: 190, label: "Phone" },
      { id: "d", x: 470, y: 190, label: "TV" },
    ],
    edges: [
      ["r1", "a"],
      ["r1", "b"],
      ["r1", "c"],
      ["r1", "d"],
    ],
    fresh: ["r1", "c", "d"],
    note: "পাঁচটা যন্ত্র হলে প্রত্যেকের সাথে প্রত্যেকের তার টানা যায় না, দশটা তার লাগত। তাই মাঝখানে একটা বাক্স বসে, যার নাম Router, আর সবাই ওই বাক্সে জোড়া লাগে। আপনার বাসার Wi-Fi ঠিক এই ছবিটা, শুধু তারের বদলে বাতাস।",
  },
  {
    title: "দুইটা বাসা, মাঝখানে একটা কোম্পানি",
    nodes: [
      { id: "isp", x: 350, y: 120, label: "ISP", big: true },
      { id: "r1", x: 170, y: 120, label: "Router", big: true },
      { id: "r2", x: 530, y: 120, label: "Router", big: true },
      { id: "a", x: 90, y: 60, label: "Laptop" },
      { id: "c", x: 90, y: 180, label: "Phone" },
      { id: "e", x: 610, y: 60, label: "Laptop" },
      { id: "f", x: 610, y: 180, label: "PC" },
    ],
    edges: [
      ["isp", "r1"],
      ["isp", "r2"],
      ["r1", "a"],
      ["r1", "c"],
      ["r2", "e"],
      ["r2", "f"],
    ],
    fresh: ["isp", "r2", "e", "f"],
    note: "আপনার বাসার Router আর প্রতিবেশীর Router নিজেরা নিজেরা জোড়া লাগে না। দুইজনই একটা কোম্পানির তারে জোড়া লাগে, যেমন Link3 বা GP, আর ওই কোম্পানিকে বলে ISP। এখন দুইটা আলাদা নেটওয়ার্ক একটা তৃতীয় নেটওয়ার্কের মধ্য দিয়ে কথা বলছে। এটাই প্রথম Inter Network।",
  },
  {
    title: "ISP গুলোও একে অন্যের সাথে জোড়া লাগে",
    nodes: [
      { id: "isp", x: 230, y: 120, label: "GP", big: true },
      { id: "isp2", x: 470, y: 120, label: "Singtel", big: true },
      { id: "r1", x: 110, y: 60, label: "Router", big: true },
      { id: "r2", x: 110, y: 180, label: "Router", big: true },
      { id: "dc", x: 590, y: 60, label: "Datacenter", big: true },
      { id: "r4", x: 590, y: 180, label: "Router", big: true },
    ],
    edges: [
      ["isp", "isp2"],
      ["isp", "r1"],
      ["isp", "r2"],
      ["isp2", "dc"],
      ["isp2", "r4"],
    ],
    fresh: ["isp2", "dc", "r4"],
    note: "বাংলাদেশের GP আর Singapore এর Singtel, দুইটা আলাদা কোম্পানি, দুইটা আলাদা দেশ। তবু তাদের মাঝে একটা তার আছে, সমুদ্রের নিচ দিয়ে। এখন GP এর কোনো গ্রাহক Singtel এর কোনো Datacenter এর সাথে কথা বলতে পারে। কেউ কাউকে টাকা দিয়ে কেনেনি, শুধু জোড়া লাগাতে রাজি হয়েছে।",
  },
  {
    title: "এভাবেই লক্ষ লক্ষ নেটওয়ার্ক, একটাও কেন্দ্র নেই",
    nodes: [
      { id: "n1", x: 120, y: 70, label: "GP", big: true },
      { id: "n2", x: 120, y: 170, label: "Link3", big: true },
      { id: "n3", x: 290, y: 40, label: "Airtel", big: true },
      { id: "n4", x: 290, y: 200, label: "BTCL", big: true },
      { id: "n5", x: 410, y: 120, label: "Singtel", big: true },
      { id: "n6", x: 560, y: 50, label: "AWS", big: true },
      { id: "n7", x: 560, y: 190, label: "Cloudflare", big: true },
      { id: "n8", x: 640, y: 120, label: "NTT", big: true },
    ],
    edges: [
      ["n1", "n2"],
      ["n1", "n3"],
      ["n2", "n4"],
      ["n3", "n5"],
      ["n4", "n5"],
      ["n1", "n5"],
      ["n5", "n6"],
      ["n5", "n7"],
      ["n6", "n8"],
      ["n7", "n8"],
      ["n3", "n6"],
    ],
    fresh: ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"],
    note: "এটাই Internet। হাজার হাজার ISP, Datacenter আর বড় কোম্পানির নেটওয়ার্ক, সবাই কোথাও না কোথাও একে অন্যের সাথে জোড়া লাগানো। কোনো একটা বাক্স নেই যেটাকে Internet বলা যায়, কোনো একটা কোম্পানি নেই যে এর মালিক। আছে শুধু জোড়া, আর একটা সাধারণ নিয়ম যেটাতে সবাই রাজি।",
  },
];

export function GrowingNetworkLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= SCENES.length - 1;
  const running = playing && !finished;
  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, SCENES.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 3600);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const scene = SCENES[i];
  const byId = Object.fromEntries(scene.nodes.map((n) => [n.id, n]));

  return (
    <Panel
      label="Animation story"
      title="দুইটা কম্পিউটার থেকে Internet, পাঁচ ধাপে"
      footer="খেয়াল করুন, কোনো ধাপেই কেউ Internet বানাচ্ছে না। প্রতিবার শুধু একটা নেটওয়ার্ক আরেকটার সাথে জোড়া লাগছে। শেষের ছবিটা কারো নকশা নয়, এটা কয়েক দশক ধরে জোড়া লাগতে লাগতে হয়ে গেছে।"
    >
      <Controls
        running={running}
        finished={finished}
        onPlay={() => {
          if (finished) setI(0);
          setPlaying((p) => !p);
        }}
        onStep={() => {
          setPlaying(false);
          setI((v) => (v >= SCENES.length - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
      />

      <div className="flex flex-wrap gap-1.5 mb-4">
        {SCENES.map((s, idx) => (
          <div
            key={s.title}
            className={cn(
              "px-3 py-1.5 border font-mono text-[9px] uppercase tracking-[0.1em] transition-colors duration-200",
              idx === i
                ? "border-primary bg-primary/10 text-primary"
                : idx < i
                  ? "border-border text-muted-foreground"
                  : "border-dashed border-border/60 text-muted-foreground/35",
            )}
          >
            {toBn(idx + 1)}
          </div>
        ))}
      </div>

      <div className="border border-border bg-background">
        <div className="px-5 py-3 border-b border-border bg-muted/20 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          {scene.title}
        </div>
        <div className="overflow-x-auto p-4">
          <svg
            viewBox="0 0 700 240"
            style={{ minWidth: 560, height: 240 }}
            className="w-full text-muted-foreground"
            role="img"
            aria-label={scene.title}
          >
            {scene.edges.map(([a, b]) => {
              const na = byId[a],
                nb = byId[b];
              const fresh = scene.fresh.includes(a) || scene.fresh.includes(b);
              return (
                <motion.line
                  key={`${i}-${a}-${b}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={fresh ? "var(--primary)" : "currentColor"}
                  strokeOpacity={fresh ? 0.9 : 0.35}
                  strokeWidth={1.4}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              );
            })}
            {scene.nodes.map((n) => {
              const fresh = scene.fresh.includes(n.id);
              const w = n.big ? 84 : 64;
              const h = n.big ? 34 : 26;
              return (
                <motion.g
                  key={`${i}-${n.id}`}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: EASE,
                    delay: fresh ? 0.15 : 0,
                  }}
                >
                  <rect
                    x={n.x - w / 2}
                    y={n.y - h / 2}
                    width={w}
                    height={h}
                    fill={fresh ? "var(--primary)" : "transparent"}
                    fillOpacity={fresh ? 0.12 : 0}
                    stroke={fresh ? "var(--primary)" : "currentColor"}
                    strokeOpacity={fresh ? 1 : 0.45}
                    strokeWidth={1.2}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fontFamily="var(--font-mono), monospace"
                    fontSize={n.big ? 11 : 9}
                    fontWeight={n.big ? 700 : 400}
                    fill={fresh ? "var(--primary)" : "currentColor"}
                  >
                    {n.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      <motion.p
        key={`note-${i}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mt-6 text-sm text-muted-foreground leading-relaxed"
      >
        {scene.note}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কেন্দ্র থাকলে কী হয়, না থাকলে কী হয়                                     */
/* ------------------------------------------------------------------------- */

type MeshNode = { id: string; x: number; y: number; label: string };

const MESH_NODES: MeshNode[] = [
  { id: "you", x: 40, y: 120, label: "আপনি" },
  { id: "a", x: 150, y: 50, label: "GP" },
  { id: "b", x: 150, y: 190, label: "Link3" },
  { id: "c", x: 270, y: 120, label: "BTCL" },
  { id: "d", x: 270, y: 30, label: "Airtel" },
  { id: "e", x: 270, y: 210, label: "Summit" },
  { id: "f", x: 400, y: 60, label: "Singtel" },
  { id: "g", x: 400, y: 180, label: "Tata" },
  { id: "h", x: 520, y: 120, label: "NTT" },
  { id: "tours", x: 630, y: 120, label: "Tours" },
];

const MESH_EDGES: Edge[] = [
  ["you", "a"],
  ["you", "b"],
  ["a", "c"],
  ["a", "d"],
  ["b", "c"],
  ["b", "e"],
  ["c", "f"],
  ["c", "g"],
  ["d", "f"],
  ["e", "g"],
  ["f", "h"],
  ["g", "h"],
  ["d", "h"],
  ["h", "tours"],
  ["f", "tours"],
];

const STAR_NODES: MeshNode[] = [
  { id: "you", x: 40, y: 120, label: "আপনি" },
  { id: "a", x: 190, y: 40, label: "GP" },
  { id: "b", x: 190, y: 200, label: "Link3" },
  { id: "hub", x: 335, y: 120, label: "কেন্দ্র" },
  { id: "f", x: 480, y: 40, label: "Singtel" },
  { id: "g", x: 480, y: 200, label: "Tata" },
  { id: "tours", x: 630, y: 120, label: "Tours" },
];

const STAR_EDGES: Edge[] = [
  ["you", "a"],
  ["you", "b"],
  ["a", "hub"],
  ["b", "hub"],
  ["hub", "f"],
  ["hub", "g"],
  ["f", "tours"],
  ["g", "tours"],
];

/** Shortest path avoiding cut nodes. Plain BFS, nothing clever. */
function findPath(
  nodes: MeshNode[],
  edges: Edge[],
  cut: Set<string>,
): string[] | null {
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  const prev: Record<string, string | null> = { you: null };
  const queue = ["you"];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === "tours") break;
    for (const nx of adj[cur]) {
      if (cut.has(nx) || nx in prev) continue;
      prev[nx] = cur;
      queue.push(nx);
    }
  }
  if (!("tours" in prev)) return null;
  const path: string[] = [];
  let cur: string | null = "tours";
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }
  return path;
}

function NetworkBoard({
  nodes,
  edges,
  cut,
  onToggle,
}: {
  nodes: MeshNode[];
  edges: Edge[];
  cut: Set<string>;
  onToggle: (id: string) => void;
}) {
  const path = useMemo(() => findPath(nodes, edges, cut), [nodes, edges, cut]);
  const onPath = (a: string, b: string) => {
    if (!path) return false;
    const ia = path.indexOf(a),
      ib = path.indexOf(b);
    return ia >= 0 && ib >= 0 && Math.abs(ia - ib) === 1;
  };
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 680 240"
          style={{ minWidth: 540, height: 240 }}
          className="w-full text-muted-foreground select-none"
          role="img"
          aria-label="নেটওয়ার্কের ছবি, বাক্সে চাপলে কাটা যায়"
        >
          {edges.map(([a, b]) => {
            const dead = cut.has(a) || cut.has(b);
            const hot = onPath(a, b);
            return (
              <line
                key={`${a}-${b}`}
                x1={byId[a].x}
                y1={byId[a].y}
                x2={byId[b].x}
                y2={byId[b].y}
                stroke={hot ? "var(--primary)" : "currentColor"}
                strokeOpacity={dead ? 0.12 : hot ? 1 : 0.35}
                strokeWidth={hot ? 2.6 : 1.2}
                strokeDasharray={dead ? "3 4" : undefined}
                className="transition-all duration-300"
              />
            );
          })}
          {nodes.map((n) => {
            const fixed = n.id === "you" || n.id === "tours";
            const dead = cut.has(n.id);
            const hot = !!path?.includes(n.id);
            return (
              <g
                key={n.id}
                onClick={() => !fixed && onToggle(n.id)}
                role={fixed ? undefined : "button"}
                aria-label={
                  fixed
                    ? n.label
                    : `${n.label} ${dead ? "জোড়া লাগান" : "কাটুন"}`
                }
                data-node={n.id}
                data-cut={dead ? "true" : "false"}
                style={{ cursor: fixed ? "default" : "pointer" }}
              >
                <rect
                  x={n.x - 36}
                  y={n.y - 15}
                  width={72}
                  height={30}
                  fill={hot || fixed ? "var(--primary)" : "transparent"}
                  fillOpacity={dead ? 0 : hot || fixed ? 0.12 : 0}
                  stroke={
                    dead
                      ? "currentColor"
                      : hot || fixed
                        ? "var(--primary)"
                        : "currentColor"
                  }
                  strokeOpacity={dead ? 0.25 : hot || fixed ? 1 : 0.5}
                  strokeWidth={1.2}
                  strokeDasharray={dead ? "3 3" : undefined}
                  className="transition-all duration-300"
                />
                {dead && (
                  <line
                    x1={n.x - 36}
                    y1={n.y - 15}
                    x2={n.x + 36}
                    y2={n.y + 15}
                    stroke="currentColor"
                    strokeOpacity={0.4}
                    strokeWidth={1}
                  />
                )}
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  fontFamily={
                    fixed
                      ? "var(--font-sans), sans-serif"
                      : "var(--font-mono), monospace"
                  }
                  fontSize={10}
                  fontWeight={hot || fixed ? 700 : 400}
                  fill={
                    dead
                      ? "currentColor"
                      : hot || fixed
                        ? "var(--primary)"
                        : "currentColor"
                  }
                  fillOpacity={dead ? 0.35 : 1}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div
        data-status={path ? "connected" : "broken"}
        className={cn(
          "mt-3 px-4 py-2 border font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300",
          path
            ? "border-accent/50 bg-accent/10 text-accent"
            : "border-primary bg-primary/10 text-primary",
        )}
      >
        {path
          ? `কাটা ${toBn(cut.size)} টা, তবু পথ আছে, ${toBn(path.length - 1)} ধাপে`
          : `কাটা ${toBn(cut.size)} টা, আর যাওয়া যায় না`}
      </div>
    </div>
  );
}

export function NoCenterLab() {
  const [meshCut, setMeshCut] = useState<Set<string>>(new Set());
  const [starCut, setStarCut] = useState<Set<string>>(new Set());

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<Set<string>>>) =>
    (id: string) =>
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

  return (
    <Panel
      label="Interactive"
      title="বাক্সে চেপে কাটুন, দেখুন কথা বন্ধ হয় কিনা"
      footer="ডান পাশের নেটওয়ার্কে একটা বাক্স কাটলেই সব শেষ, কারণ সব রাস্তা ওই একটা জায়গা দিয়ে যায়। বাম পাশে আপনাকে অনেকগুলো কাটতে হবে, কারণ একটা রাস্তা বন্ধ হলে বার্তা নিজেই অন্য রাস্তা খুঁজে নেয়। Internet ইচ্ছে করেই বাম পাশের মতো বানানো। ১৯৬০ এর দশকে যাঁরা এর নকশা করেছিলেন, তাঁদের ভয় ছিল যুদ্ধে একটা শহর উড়ে গেলে বাকি সবার যোগাযোগ যেন না থামে। সেই ভয় থেকেই এই আকার।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border p-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              কেন্দ্র নেই
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              Internet এভাবেই বানানো
            </span>
          </div>
          <NetworkBoard
            nodes={MESH_NODES}
            edges={MESH_EDGES}
            cut={meshCut}
            onToggle={toggle(setMeshCut)}
          />
        </div>
        <div className="border border-border p-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
              কেন্দ্র আছে
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              একটা কোম্পানি সব চালালে যেমন হতো
            </span>
          </div>
          <NetworkBoard
            nodes={STAR_NODES}
            edges={STAR_EDGES}
            cut={starCut}
            onToggle={toggle(setStarCut)}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            setMeshCut(new Set());
            setStarCut(new Set());
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          সব জোড়া লাগান
        </button>
        <span className="text-xs text-muted-foreground">
          মাঝের যেকোনো বাক্সে চাপুন। আপনি আর Tours বাক্স কাটা যায় না।
        </span>
      </div>
    </Panel>
  );
}
