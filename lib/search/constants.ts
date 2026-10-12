/**
 * Single source of truth for the site search. The index route folder under
 * `app/` has to be named after `SEARCH_INDEX_PATH`.
 */
export const SEARCH_INDEX_PATH = '/search-index.json';

/** Where the last opened results are remembered, per browser. */
export const SEARCH_RECENTS_KEY = 'site-search:recents';
export const SEARCH_RECENTS_LIMIT = 6;

/** How many results each group shows, so one kind cannot bury the others. */
export const SEARCH_GROUP_LIMITS = {
    page: 4,
    lesson: 8,
    module: 4,
    section: 10,
} as const;

/**
 * The closing sections every lesson page renders after its own sections. The
 * page, the outline and the search index all read the anchors from here. They
 * must not be reused as a section id inside a lesson: many lessons already
 * have a section called `project`, which is why the lab is not.
 */
export const LESSON_EXTRA_ANCHORS = {
    summary: { anchor: 'summary', label: 'Lesson Summary' },
    quiz: { anchor: 'mcq', label: 'Knowledge Check' },
    assignment: { anchor: 'assignment', label: 'Assignments' },
    lab: { anchor: 'practical-lab', label: 'Practical Lab' },
} as const;
