import { devopsCourseData } from "@/lib/devops-course-data";
import { sqlCourseData } from "@/lib/sql-course-data";
import { toBn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Sketch, SketchText } from "../../sketch";

/**
 * Shared building blocks for the overview chapter that opens every module.
 * The chapter answers the same five questions each time (why this module, what
 * it teaches, why learn it, where it helps, how it is used in real life), so
 * the visuals are shared and each module only supplies its own words.
 */

function Frame({
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
        <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
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

/* ------------------------------------------------------------------------- */
/* 1. আগের মডিউল, এই মডিউল, পরের মডিউল                                          */
/* ------------------------------------------------------------------------- */

export interface BridgeStop {
  /** Small mono line above the box, for example "Module 04". */
  tag: string;
  title: string;
  /** Up to three short Bengali lines under the box. Keep each under 30 characters. */
  lines: string[];
}

export function ModuleBridgeDiagram({
  label,
  caption,
  before,
  current,
  after,
}: {
  label: string;
  caption: React.ReactNode;
  /** Omit for the first module of the track. */
  before?: BridgeStop;
  current: BridgeStop;
  after: BridgeStop;
}) {
  const stops = [before, current, after];
  const w = 220;
  const gap = 60;
  const startX = (840 - (3 * w + 2 * gap)) / 2;
  return (
    <Sketch label={label} height={250} minWidth={840} viewBox="0 0 840 250" caption={caption}>
      <defs>
        <marker
          id="overview-bridge-arrow"
          markerWidth={8}
          markerHeight={8}
          refX={7}
          refY={3.5}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
        </marker>
      </defs>
      {stops.map((stop, i) => {
        const x = startX + i * (w + gap);
        const here = i === 1;
        if (!stop) {
          return (
            <g key="start">
              <rect
                x={x}
                y={62}
                width={w}
                height={62}
                fill="transparent"
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <SketchText x={x + w / 2} y={98} size={10} body opacity={0.7}>
                এখান থেকেই শুরু
              </SketchText>
              <line
                x1={x + w + 4}
                y1={93}
                x2={x + w + gap - 4}
                y2={93}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#overview-bridge-arrow)"
              />
            </g>
          );
        }
        return (
          <g key={stop.tag}>
            <SketchText x={x + w / 2} y={48} size={9} bold accent={here} opacity={here ? 1 : 0.55}>
              {stop.tag}
            </SketchText>
            <rect
              x={x}
              y={62}
              width={w}
              height={62}
              fill={here ? "var(--primary)" : "currentColor"}
              fillOpacity={here ? 0.1 : 0.04}
              stroke={here ? "var(--primary)" : "currentColor"}
              strokeOpacity={here ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={98} size={11} bold accent={here}>
              {stop.title}
            </SketchText>
            {stop.lines.slice(0, 3).map((line, n) => (
              <SketchText
                key={line}
                x={x + w / 2}
                y={150 + n * 20}
                size={9.5}
                body
                opacity={here ? 1 : 0.75}
                accent={here}
              >
                {line}
              </SketchText>
            ))}
            {i < 2 && (
              <line
                x1={x + w + 4}
                y1={93}
                x2={x + w + gap - 4}
                y2={93}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#overview-bridge-arrow)"
              />
            )}
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এই মডিউলের লেসনগুলো, কোনটা কোন প্রশ্নের উত্তর                              */
/* ------------------------------------------------------------------------- */

/** The tracks an overview chapter can belong to, and where their lessons live. */
const TRACKS = {
  devops: { modules: devopsCourseData, basePath: "/devops/topic" },
  sql: { modules: sqlCourseData, basePath: "/sql/topic" },
} as const;

export function ModuleRoadmap({
  moduleId,
  questions,
  footer,
  track = "devops",
}: {
  moduleId: string;
  /** Lesson id to the one question that lesson answers, in Bengali. */
  questions: Record<string, string>;
  footer?: React.ReactNode;
  /** Which track the module belongs to. */
  track?: keyof typeof TRACKS;
}) {
  const { modules, basePath } = TRACKS[track];
  const section = modules.find((m) => m.id === moduleId);
  if (!section) return null;
  // The overview chapter itself is not a stop on its own map.
  const lessons = section.topics.filter((t) => t.id !== `${moduleId}-overview`);

  return (
    <Frame label="Roadmap" title={`${section.title}, ${toBn(lessons.length)}টা লেসন`} footer={footer}>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lessons.map((lesson, i) => (
          <li key={lesson.id}>
            <Link
              href={`${basePath}/${lesson.id}`}
              className="group flex h-full items-start gap-4 border border-border bg-background p-4 transition-colors hover:border-primary/50"
            >
              <span className="font-mono text-[0.6875rem] font-bold text-primary pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-foreground break-words">{lesson.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </span>
                {questions[lesson.id] && (
                  <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {questions[lesson.id]}
                  </span>
                )}
                {lesson.time && (
                  <span className="mt-2 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground/70">
                    {lesson.time}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. মডিউলের আগে আর পরে                                                       */
/* ------------------------------------------------------------------------- */

export function BeforeAfterSplit({
  before,
  after,
  footer,
}: {
  before: string[];
  after: string[];
  footer?: React.ReactNode;
}) {
  const columns = [
    { title: "এই মডিউলের আগে", items: before, strong: false },
    { title: "এই মডিউলের পরে", items: after, strong: true },
  ];
  return (
    <Frame label="Before and After" title="আপনি যা পারতেন না, আর যা পারবেন" footer={footer}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map((col) => (
          <div
            key={col.title}
            className={
              col.strong ? "border border-primary/50 bg-primary/5 p-4" : "border border-border bg-background p-4"
            }
          >
            <div
              className={
                col.strong
                  ? "font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-3"
                  : "font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3"
              }
            >
              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  <span className={col.strong ? "text-primary" : "text-muted-foreground/60"}>
                    {col.strong ? "✓" : "?"}
                  </span>
                  <span className={col.strong ? "text-foreground" : undefined}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Frame>
  );
}
