import { cn } from "@/lib/utils";

/**
 * The site logo: the mark above the wordmark, one SVG for both themes. The
 * artwork is pure black, so a dark theme simply inverts it to white.
 * next-themes stamps `.dark` on <html> before paint, so there is no flash and
 * no client JS needed here. Height is driven by `className` (e.g. `h-10`); the
 * width follows the artwork ratio.
 */

const SRC = "/black-white/logo.svg";

export function Logo({
  className,
  alt = "Devripon",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SRC}
        alt={alt}
        className="h-full w-auto block dark:invert"
        draggable={false}
      />
    </span>
  );
}
