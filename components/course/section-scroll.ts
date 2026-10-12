/**
 * Where a lesson section stops when it is jumped to (outline panel, search, a
 * `#anchor` link). Each section sits inside a `BorderCross` padded `p-4
 * md:p-10`, so the margin equals that padding: the frame's top rule lands at
 * the top of the screen and nothing of the block above peeks in. Below `lg`
 * the fixed mobile bar (`h-14`) is added on top.
 */
export const SECTION_SCROLL_MARGIN = 'scroll-mt-18 md:scroll-mt-24 lg:scroll-mt-10';
