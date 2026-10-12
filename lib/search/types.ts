export type SearchKind = 'page' | 'lesson' | 'module' | 'section';

export interface SearchEntry {
    kind: SearchKind;
    /** What the result is called. */
    title: string;
    /** Short English label of a section, for example "Connection Lifecycle". */
    label?: string;
    /** Where it lives: track and module for a lesson, the lesson for a section. */
    context?: string;
    /** One line of summary, shown under the title. */
    description?: string;
    href: string;
    /** Space separated terms that match but are never shown. */
    keywords?: string;
    /** The lesson is in the outline but its content is not written yet. */
    comingSoon?: boolean;
}

export interface SearchIndex {
    entries: SearchEntry[];
}
