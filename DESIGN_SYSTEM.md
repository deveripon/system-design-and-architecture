# System Design Mastery - UI & Aesthetics Guide

This document serves as the source of truth for the project's design system, styling rules, and UI philosophy. Any future development, component creation, or AI code generation **must strictly adhere** to these rules to preserve the established aesthetic.

## 1. Core Philosophy
The platform utilizes a **"Blueprint-Inspired" Technical Design Language**. 
It is built to feel like high-end engineering software rather than a standard web app.
- **Minimalist & Raw**: No excessive shadows, no soft gradients, no rounded corners.
- **High-Fidelity**: Pixel-perfect alignments, thin lines, and monospace accents.
- **Zero-Radius**: Everything is completely sharp (`rounded-none`, `--radius: 0px`). Do not use `rounded-sm`, `rounded-md`, or any border radius.

## 2. Typography
We use a three-font system defined in `app/layout.tsx`:
1. **Headings** (`font-heading`): *Fraunces* – Used for massive, impactful titles (often combined with `italic` for specific words to create a high-end editorial feel).
2. **Technical & Accents** (`font-mono`): *JetBrains Mono* – The backbone of the technical aesthetic. Used for subheadings, indexes (e.g., `001`), labels, metadata, and buttons. Always pair with `uppercase` and heavy tracking (e.g., `tracking-[0.2em]` or `tracking-widest`).
3. **Body & Bengali Text** (`font-sans`): *Noto Sans Bengali* – Clean readability for paragraphs and course content.

## 3. Colors & Theming (Light/Dark Mode)
The app supports both Light and Dark modes via `next-themes` and a custom `.dark` class implementation in `globals.css`. The palette is **warm** — a clay/orange primary on an ivory or near-black warm ground. Never reintroduce the old electric-blue accent.

Every colour is a token in `globals.css`. Use `text-primary`, `bg-card`, `border-border` etc.; do not hardcode hex values or Tailwind palette shades for chrome.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--background` | `#faf9f5` ivory | `#12110e` warm near-black | page ground |
| `--foreground` | `#1a1915` | `#f0efe9` | body text |
| `--card` | `#ffffff` | `#1a1915` | cards, panels |
| `--muted` / `--muted-foreground` | `#f4f2ec` / `#5c5a52` | `#171612` / `#b5b1a6` | sidebar, secondary text |
| `--primary` | `#b3441e` burnt clay | `#e08a5e` warm orange | accents, active states, square dots, primary buttons |
| `--accent` | `#4d6b1f` deep olive | `#b8d96a` lime | the second accent — badges, success, "tip" boxes |
| `--border` / `--grid-line` | `#d8d7d2` | `#2b2a25` | **all** hairlines and the blueprint grid |

- **Contrast**: every text token pair clears WCAG AA (primary 5.4:1 light / 7.3:1 dark; accent 5.9:1 / 10:1). If you add a colour, check it in **both** themes before using it for text.
- **Grid lines are neutral grey and 1px** — never tinted with the primary colour. The page background grid uses `var(--grid-line)` at a 48px pitch, kept faint (`opacity-30 dark:opacity-20`) so it reads as paper texture rather than a table.
- **Palette shades in content**: a `-400` shade is dark-mode only. Always pair it — `text-emerald-700 dark:text-emerald-400` — otherwise the light theme is unreadable.
- **Hover States**: subtle background shifts, never solid fills: `hover:bg-primary/5 dark:hover:bg-white/2`. A bare `hover:bg-white/2` is invisible in light mode.

## 4. Key Architectural Components
### The "Cross-Border" Grid System
The signature UI element is the infinite blueprint grid.
- All major layout sections should be wrapped in the `<BorderCross>` component.
- This component generates a subtle box with plus-signs (`+`) at the corners and infinite vertical lines that bleed off the screen, mimicking architectural draft paper.

### SubHeaders
Never manually build a section header. Always use the `<SubHeader>` component.
- **Format**: A tiny primary-colored square dot `■`, followed by an index `00X`, followed by the title.
- **Styling**: `text-[10px] font-mono font-bold uppercase tracking-[0.2em]`.

## 5. Component Styling Rules
- **Buttons / Links**: Avoid default Shadcn button styles (which include rings and background fills). Instead, use "Ghost" styles.
  - Buttons should have a thin border (`border-border` or `border-primary/20 dark:border-white/10`).
  - Text should be `font-mono text-[10px] uppercase tracking-[0.25em]`.
  - On hover, do not fill the button; instead, transition the text color to full brightness (`text-foreground`) and slightly increase border opacity (`hover:border-primary/50 dark:hover:border-white/30`).
  - Animate icons inside buttons on hover (e.g., `group-hover:translate-x-0.5`).
- **Cards (Topic Cards / Info Boxes)**: 
  - Sharp borders (`border-r border-b border-border`).
  - Background is `bg-card` or `bg-muted/5`.
  - Content should have generous padding (`p-8` or `p-12`).

## 6. Micro-Interactions & Backgrounds
- **Hover Animations**: Keep them strictly utilitarian. Use Tailwind's `transition-all duration-200` for simple hover states.
- **Complex UI Animations (Framer Motion)**: For mounting/unmounting elements (like accordions) or programmatically controlling the scroll position, ALWAYS use `framer-motion`.
  - **Easing Standard**: All Framer Motion animations must utilize the custom architectural easing curve: `ease: [0.16, 1, 0.3, 1]`. This mimics a high-tension spring, providing a premium, physically grounded snap.
  - **Accordions**: Use `<AnimatePresence initial={false}>` and `<motion.div>` animating `height: 0` to `height: 'auto'`.
- **Hero Background**: The hero section uses `animate-stars` and `animate-stars-slow` (defined in `globals.css`) to create an upward-floating particle effect.
- **Grid Patterns**: The global page background uses a CSS `linear-gradient` to draw a `40px` by `40px` grid using `var(--primary)` at very low opacity (`opacity-[0.05] dark:opacity-[0.03]`).

## 7. Global CSS Overrides
- **Scrollbar**: A custom, ultra-thin (`4px`) scrollbar is defined at the bottom of `globals.css`. It uses sharp edges (`border-radius: 0px`) and the primary color for the thumb.
- **Button Reset**: All native buttons have browser outlines and focus rings completely removed (`outline: none; box-shadow: none;`) and `cursor: pointer` explicitly enforced globally.

## 8. Responsive Rules
- **Desktop width**: a topic/lesson container is centred (`mx-auto`) and grows with the viewport:
  `md:max-w-3xl lg:max-w-5xl xl:max-w-[80rem] 2xl:max-w-[90rem]`. Never leave the content
  left-aligned with a fixed cap — on a wide screen all the slack collects on the right.
- **Grids** step up rather than stopping at two columns: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
  (or `xl:grid-cols-4` for a 4/8-item flow). Build them as `border-t border-l` on the container plus
  `border-r border-b` on each child, so the borders stay correct at any column count. Avoid
  `even:border-r-0` parity tricks — they break the moment a full-width row is inserted.
- **No horizontal overflow** at any width. Check `document.body.scrollWidth` against
  `documentElement.clientWidth` after a layout change.

---
**Checklist for adding new UI:**
- [ ] Is `border-radius` set to 0?
- [ ] Are headings utilizing `font-mono uppercase tracking-[0.2em]` where appropriate?
- [ ] Is it wrapped in `<BorderCross>` if it's a major section?
- [ ] Does it support both Light and Dark mode using `dark:` variants?
- [ ] Are colours coming from tokens (`primary`, `accent`, `border`) rather than hardcoded hexes?
- [ ] Does it use the extra width at `xl`/`2xl` instead of leaving a dead gutter?
- [ ] Are interactive elements using subtle micro-animations (e.g. `translate-x-0.5`) rather than aggressive color fills?
- [ ] Are complex animations (accordions, scroll jumps) utilizing Framer Motion with the standard `ease: [0.16, 1, 0.3, 1]`?
