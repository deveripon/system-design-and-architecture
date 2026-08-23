import { cn } from "@/lib/utils";

interface SubHeaderProps {
  index: string;
  title: string;
  className?: string;
}

export function SubHeader({ index, title, className }: SubHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] font-bold",
        className
      )}
    >
      {/* Square dot, inline for precise vertical centering */}
      <span className="inline-block w-[6px] h-[6px] bg-primary shrink-0" />
      <span className="text-muted-foreground/50">{index}</span>
      <span className="text-foreground">{title}</span>
    </div>
  );
}
