import { cn } from "@/lib/utils";

/**
 * The wordmark, theme aware. Two SVGs ship in the markup and CSS shows exactly
 * one: the black artwork on a light theme, the white artwork on a dark theme.
 * next-themes stamps `.dark` on <html> before paint, so there is no flash and
 * no client JS needed here. Height is driven by `className` (e.g. `h-8`); the
 * width follows the artwork ratio.
 */

const BASE = "/black-white";

export function Logo({
  className,
  variant = "horizontal",
  alt = "Devripon",
}: {
  className?: string;
  variant?: "horizontal" | "stacked" | "wordmark" | "monogram";
  alt?: string;
}) {
  const light = `${BASE}/${variant}/devripon-${variant}-black-white-light.svg`;
  const dark = `${BASE}/${variant}/devripon-${variant}-black-white-dark.svg`;
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light}
        alt={alt}
        className="h-full w-auto block dark:hidden"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark}
        alt={alt}
        className="h-full w-auto hidden dark:block"
        draggable={false}
      />
    </span>
  );
}
