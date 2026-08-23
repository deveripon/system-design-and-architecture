import { CheckCircle2 } from "lucide-react";
import { SubHeader } from "./sub-header";

interface AssignmentProps {
  title: string;
  time: string;
  difficulty: string;
  tasks: React.ReactNode[];
  deliverables: React.ReactNode[];
}

export function Assignment({ title, time, difficulty, tasks = [], deliverables = [] }: AssignmentProps) {
  return (
    <section className="my-12 md:my-24 border border-border bg-card overflow-hidden">
      <div className="p-6 md:p-10 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <SubHeader index="005" title="Practical Task" />
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">{title}</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-px bg-border border border-border shrink-0 w-full md:w-fit">
          <div className="px-6 py-3 bg-background flex flex-col gap-1 flex-1">
            <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Estimated Time</span>
            <span className="text-xs font-bold uppercase tracking-tight">{time}</span>
          </div>
          <div className="px-6 py-3 bg-background flex flex-col gap-1 flex-1">
            <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Difficulty</span>
            <span className="text-xs font-bold uppercase tracking-tight">{difficulty}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-6 md:p-10 space-y-8 border-b md:border-b-0 md:border-r border-border">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary">Required Tasks</h3>
          <ul className="space-y-6">
            {tasks.map((task, idx) => (
              <li key={idx} className="flex gap-4 md:gap-6 group">
                <span className="text-lg md:text-xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors leading-none">0{idx + 1}</span>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">{task}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 md:p-10 space-y-8 bg-muted/5">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary">Deliverables</h3>
          <div className="space-y-4">
            {deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 border border-border bg-card group hover:border-primary/50 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors shrink-0" />
                <span className="text-sm font-bold uppercase tracking-tight text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-border">
            <p className="text-[10px] md:text-[11px] font-mono text-muted-foreground leading-relaxed italic">
              Submit your work as a GitHub repository link or a PDF document.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
