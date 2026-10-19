import { absoluteUrl, siteUrl } from '@/lib/site-url';
import type { MetadataRoute } from 'next';


export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        sitemap: absoluteUrl('/sitemap.xml'),
        host: siteUrl().origin,
    };
}

