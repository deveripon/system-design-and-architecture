/**
 * The curriculum tracks, in the order the site presents them everywhere: the
 * header, the footer, the track grid, search and the sitemap. DevOps is the
 * main track, so it owns the home page. Reordering the site means reordering
 * this list and nothing else.
 */
export const TRACKS = [
    {
        id: 'devops',
        label: 'DevOps',
        name: 'DevOps & Internet',
        href: '/',
        /** Paths under the track's home that belong to it. */
        prefixes: ['/devops'],
    },
    {
        id: 'sql',
        label: 'SQL',
        name: 'SQL & Databases',
        href: '/sql',
        prefixes: ['/sql'],
    },
    {
        id: 'system-design',
        label: 'System Design',
        name: 'System Design',
        href: '/system-design',
        // System Design lessons kept their original /topic URLs.
        prefixes: ['/system-design', '/topic'],
    },
] as const;

export type Track = (typeof TRACKS)[number];
export type TrackId = Track['id'];

/** Where each track's landing page lives. */
export const TRACK_HOME = Object.fromEntries(
    TRACKS.map(track => [track.id, track.href])
) as Record<TrackId, Track['href']>;

function underPrefix(pathname: string, prefix: string) {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** The track a page belongs to, or undefined for a page outside all of them. */
export function trackForPath(pathname: string): Track | undefined {
    return TRACKS.find(
        track =>
            pathname === track.href ||
            track.prefixes.some(prefix => underPrefix(pathname, prefix))
    );
}

/** The track after this one, wrapping from the last back to the first. */
export function nextTrack(id: TrackId): Track {
    const index = TRACKS.findIndex(track => track.id === id);
    return TRACKS[(index + 1) % TRACKS.length];
}
