import { buildSearchIndex } from '@/lib/search/build-index';

// Built once at build time and served as a static file. The command palette
// fetches it the first time it opens, so no page bundle carries the index.
export const dynamic = 'force-static';

export function GET() {
    return Response.json(buildSearchIndex());
}
