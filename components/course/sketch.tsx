/**
 * Shared frame and text helpers for sketch diagrams.
 *
 * Diagrams in this project are inline SVG, never ASCII art: labels are Bengali,
 * Bengali glyphs are not monospace-width, so box-drawing characters never line
 * up. Strokes inherit `currentColor` and accents use `var(--primary)`, so a
 * diagram works in both themes without a single hardcoded colour.
 */

export const SKETCH_MONO = 'var(--font-mono), monospace';
export const SKETCH_BODY = 'var(--font-sans), sans-serif';

export function Sketch({
    label,
    caption,
    minWidth = 640,
    height,
    viewBox,
    children,
}: {
    label: string;
    /** Sits under the drawing. Takes nodes so a caption can carry a link. */
    caption?: React.ReactNode;
    /** Below this width the frame scrolls instead of squashing the drawing. */
    minWidth?: number;
    height: number;
    viewBox: string;
    children: React.ReactNode;
}) {
    return (
        <figure className='my-10 border border-border bg-card'>
            <figcaption className='px-5 py-3 border-b border-border bg-muted/30'>
                <span className='font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary'>
                    {label}
                </span>
            </figcaption>
            <div className='overflow-x-auto p-5 md:p-8'>
                <svg
                    viewBox={viewBox}
                    style={{ minWidth, height }}
                    className='w-full text-muted-foreground'
                    role='img'
                    aria-label={label}>
                    {children}
                </svg>
            </div>
            {caption && (
                <div className='px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed'>
                    {caption}
                </div>
            )}
        </figure>
    );
}

/** A label inside a sketch. Mono by default, `body` for Bengali prose. */
export function SketchText({
    x,
    y,
    children,
    size = 11,
    anchor = 'middle',
    accent,
    bold,
    body,
    opacity,
}: {
    x: number;
    y: number;
    children: React.ReactNode;
    size?: number;
    anchor?: 'start' | 'middle' | 'end';
    accent?: boolean;
    bold?: boolean;
    body?: boolean;
    opacity?: number;
}) {
    return (
        <text
            x={x}
            y={y}
            textAnchor={anchor}
            fontFamily={body ? SKETCH_BODY : SKETCH_MONO}
            fontSize={size}
            fontWeight={bold ? 700 : 400}
            fillOpacity={opacity}
            fill={accent ? 'var(--primary)' : 'currentColor'}>
            {children}
        </text>
    );
}

/** Box with a mono title and an optional sub-label, the workhorse node. */
export function SketchBox({
    x,
    y,
    w,
    h,
    title,
    sub,
    accent,
    dashed,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
    accent?: boolean;
    dashed?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.4}
                strokeWidth='1.2'
                strokeDasharray={dashed ? '4 3' : undefined}
            />
            <SketchText
                x={x + w / 2}
                y={sub ? y + h / 2 - 2 : y + h / 2 + 4}
                size={11}
                bold
                accent={accent}>
                {title}
            </SketchText>
            {sub && (
                <SketchText
                    x={x + w / 2}
                    y={y + h / 2 + 14}
                    size={9}
                    opacity={0.7}>
                    {sub}
                </SketchText>
            )}
        </g>
    );
}
