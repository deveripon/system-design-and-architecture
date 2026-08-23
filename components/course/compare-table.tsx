import React from "react";
import { cn } from "@/lib/utils";

interface CompareTableProps {
  headers: React.ReactNode[];
  rows: (string | React.ReactNode)[][];
}

export function CompareTable({ headers = [], rows = [] }: CompareTableProps) {
  return (
    <div className="my-8 overflow-hidden rounded-none border border-border">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="group hover:bg-primary/5 dark:hover:bg-white/2 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td 
                    key={cellIdx} 
                    className={cn(
                      "px-6 py-4 text-muted-foreground leading-relaxed",
                      cellIdx === 0 && "font-mono text-xs text-foreground font-medium"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
