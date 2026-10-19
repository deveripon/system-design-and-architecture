/**
 * The public address of the site, read from NEXT_PUBLIC_SITE_URL. There is no
 * fallback address: a wrong one in canonical links and the sitemap fails
 * silently, so a missing or malformed value stops the build instead.
 */
export function parseSiteUrl(raw: string | undefined): URL {
    const value = raw?.trim();
    if (!value) {
        throw new Error(
            'NEXT_PUBLIC_SITE_URL is not set. Set it to the public address of the site, such as https://example.com.'
        );
    }

    // A bare host name is served over https.
    const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
        ? value
        : `https://${value}`;

    let url: URL;
    try {
        url = new URL(withScheme);
    } catch {
        throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid address: ${value}`);
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw new Error(`NEXT_PUBLIC_SITE_URL must use http or https: ${value}`);
    }
    if (url.pathname !== '/' || url.search || url.hash) {
        throw new Error(
            `NEXT_PUBLIC_SITE_URL must be the site's address only, without a path, query or fragment: ${value}`
        );
    }
    return new URL(url.origin);
}

/** The site's address, checked on first use. */
export function siteUrl(): URL {
    return parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

/** An absolute URL on this site, for a path such as /sql/topic/insert. */
export function absoluteUrl(path: string, base: URL = siteUrl()): string {
    return new URL(path, base).href;
}
