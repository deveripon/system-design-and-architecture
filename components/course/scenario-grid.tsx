import { SubHeader } from "./sub-header";

interface ScenarioCardProps {
  title: string;
  description: string;
}

export function ScenarioCard({ title, description }: ScenarioCardProps) {
  return (
    <div className="p-8 border-r border-b border-border bg-card/50 hover:bg-primary/5 dark:hover:bg-white/2 transition-colors group">
      <SubHeader index="CASE" title={title} className="text-[9px] mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

export function ScenarioGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-t border-l border-border my-12">
      {children}
    </div>
  );
}
