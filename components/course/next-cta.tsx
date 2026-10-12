import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface NextCTAProps {
  href: string;
  title: string;
}

export function NextCTA({ href, title }: NextCTAProps) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between p-6 mt-16 rounded-none border border-border bg-muted/30 hover:border-primary transition-all group"
    >
      <div>
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-muted-foreground mb-2 block">
          Next Topic
        </span>
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
      <ChevronRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-transform" />
    </Link>
  );
}
