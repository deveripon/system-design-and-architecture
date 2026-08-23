import { cn } from "@/lib/utils";
import React from "react";

/**
 * Common Section Title with consistent heading font
 */
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-heading", className)}>
      {children}
    </span>
  );
}

/**
 * Standard content paragraph with proper spacing and typography
 */
export function ContentParagraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-muted-foreground leading-relaxed text-lg", className)}>
      {children}
    </p>
  );
}

/**
 * A grid for displaying features, cards, or case studies
 */
export function FeatureGrid({ children, className, cols = 2 }: { children: React.ReactNode; className?: string; cols?: 1 | 2 | 3 }) {
  const colClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={cn("my-10 md:my-16 border-t border-l border-border grid", colClass, className)}>
      {children}
    </div>
  );
}

/**
 * Individual feature card for use within a FeatureGrid
 */
export function FeatureCard({ title, children, iconColor = "primary", className }: { title: string; children: React.ReactNode; iconColor?: "primary" | "blue" | "emerald" | "purple"; className?: string }) {
  const colorClass = iconColor === "primary" ? "bg-primary" : iconColor === "blue" ? "bg-primary" : iconColor === "emerald" ? "bg-accent" : "bg-teal-600";
  return (
    <div className={cn("p-6 md:p-10 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors group", className)}>
      <div className="flex flex-col gap-6 md:gap-8">
        <h4 className="font-bold flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]">
          <span className={cn("w-1.5 h-1.5 rounded-full", colorClass)} />
          {title}
        </h4>
        <div className="space-y-3 md:space-y-4">
          <div className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Specialized grid for comparison or pros/cons
 */
export function ProConGrid({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mt-8", className)}>
            {children}
        </div>
    );
}

/**
 * Individual item for ProConGrid
 */
export function ProConItem({ title, badge, children, isLast = false, type = "positive" }: { title: string; badge: string; children: React.ReactNode; isLast?: boolean; type?: "positive" | "negative" }) {
    const badgeColor = type === "positive" ? "text-accent" : "text-red-700 dark:text-red-400";
    const dotColor = type === "positive" ? "bg-accent" : "bg-red-600 dark:bg-red-500";
    
    return (
        <div className={cn("p-8 bg-card/30", !isLast && "border-b md:border-b-0 md:border-r border-border")}>
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]">
                <span className={cn("w-1.5 h-1.5", dotColor)} />
                {title} <span className={badgeColor}>{badge}</span>
            </h4>
            <div className="text-sm text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    );
}

/**
 * Subtle heading for internal concepts
 */
export function ConceptHeading({ children, className, color = "blue" }: { children: React.ReactNode; className?: string; color?: "blue" | "emerald" | "purple" | "primary" }) {
    const textColor = color === "blue" ? "text-primary" : color === "emerald" ? "text-accent" : color === "purple" ? "text-teal-700 dark:text-teal-300" : "text-primary";
    return (
        <h3 className={cn("text-xs font-mono font-bold uppercase  mb-10 mt-20", textColor, className)}>
            {children}
        </h3>
    );
}

/**
 * Text with the theme's signature gradient
 */
export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn("italic bg-linear-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent", className)}>
            {children}
        </span>
    );
}

import Image from 'next/image';

/**
 * High-end image container for content
 */
export function ContentImage({ 
    src, 
    alt, 
    caption, 
    width = 1408, 
    height = 768, 
    aspectRatio = "aspect-video",
    maxWidth = "max-w-4xl"
}: { 
    src: string; 
    alt: string; 
    caption?: string; 
    width?: number; 
    height?: number;
    aspectRatio?: string;
    maxWidth?: string;
}) {
    return (
        <div className={cn("my-12 mx-auto border border-border bg-card p-2 rounded-2xl overflow-hidden shadow-2xl group", maxWidth)}>
            <div className={cn("relative overflow-hidden rounded-xl", aspectRatio)}>
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className='w-full h-full object-cover transition-transform duration-700'
                />
                {caption && (
                    <div className='absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                        <p className='text-sm text-white/90 font-medium'>
                            {caption}
                        </p>
                    </div>
                )}
            </div>
    
        </div>
    );
}

/**
 * Standard bullet list for content
 */
export function ContentList({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <ul className={cn("space-y-4 my-10", className)}>
            {children}
        </ul>
    );
}

/**
 * Individual item for ContentList
 */
export function ListItem({ children, icon = "✓", iconColor = "text-primary", className }: { children: React.ReactNode; icon?: string | React.ReactNode; iconColor?: string; className?: string }) {
    return (
        <li className={cn("flex gap-4 text-muted-foreground text-lg leading-relaxed", className)}>
            <span className={cn("shrink-0 font-bold", iconColor)}>{icon}</span>
            <span>{children}</span>
        </li>
    );
}
