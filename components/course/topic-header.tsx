import { BorderCross } from "./border-cross";
import { SubHeader } from "./sub-header";

interface TopicHeaderProps {
  phase: string;
  topicNum: string;
  title: string;
  time: string;
  level: string;
  type: string;
}

export function TopicHeader({
  phase,
  topicNum,
  title,
  time,
  level,
  type
}: TopicHeaderProps) {
  return (
    <BorderCross className="py-8 px-4 md:py-12 md:px-10 mb-10 md:mb-16 bg-muted/5">
      <div className="flex flex-col gap-4 md:gap-6">
        <SubHeader index={topicNum} title={phase} />
        
        <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[1.05] break-words hyphens-auto">
          {title}
        </h1>

        <div className="flex flex-col sm:flex-row flex-wrap gap-px bg-border border border-border mt-2 md:mt-4 w-full sm:w-fit">
          <Badge label="Duration" value={time} />
          <Badge label="Level" value={level} />
          <Badge label="Focus" value={type} />
        </div>
      </div>
    </BorderCross>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 md:px-6 py-2 md:py-3 bg-card flex-1 sm:min-w-[140px]">
      <span className="text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">{value}</span>
    </div>
  );
}

