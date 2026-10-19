import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { absoluteUrl, parseSiteUrl } from '../site-url.ts';

describe('parseSiteUrl', () => {
    it('keeps only the origin, with or without a trailing slash', () => {
        assert.equal(parseSiteUrl('https://example.com/').href, 'https://example.com/');
        assert.equal(parseSiteUrl('https://example.com').href, 'https://example.com/');
        assert.equal(parseSiteUrl('  https://example.com/  ').href, 'https://example.com/');
    });

    it('serves a bare host name over https', () => {
        assert.equal(parseSiteUrl('example.com').href, 'https://example.com/');
    });

    it('accepts plain http for a local server', () => {
        assert.equal(parseSiteUrl('http://localhost:3000').href, 'http://localhost:3000/');
    });

    it('refuses a missing or empty value instead of guessing an address', () => {
        assert.throws(() => parseSiteUrl(undefined), /NEXT_PUBLIC_SITE_URL is not set/);
        assert.throws(() => parseSiteUrl(''), /NEXT_PUBLIC_SITE_URL is not set/);
        assert.throws(() => parseSiteUrl('   '), /NEXT_PUBLIC_SITE_URL is not set/);
    });

    it('refuses a value with a path, query or fragment', () => {
        assert.throws(() => parseSiteUrl('https://example.com/docs'), /address only/);
        assert.throws(() => parseSiteUrl('https://example.com/?ref=x'), /address only/);
        assert.throws(() => parseSiteUrl('https://example.com/#top'), /address only/);
    });

    it('refuses a scheme other than http or https', () => {
        assert.throws(() => parseSiteUrl('ftp://example.com'), /http or https/);
    });

    it('refuses a value that is not an address at all', () => {
        assert.throws(() => parseSiteUrl('https://exa mple.com'), /not a valid address/);
    });
});

describe('absoluteUrl', () => {
    const base = parseSiteUrl('https://example.com/');

    it('joins a path with exactly one slash between them', () => {
        assert.equal(absoluteUrl('/sql/topic/insert', base), 'https://example.com/sql/topic/insert');
        assert.equal(absoluteUrl('/sitemap.xml', base), 'https://example.com/sitemap.xml');
    });

    it('gives the home page as the bare origin with its slash', () => {
        assert.equal(absoluteUrl('/', base), 'https://example.com/');
    });

    it('does not double the slash even when the address was written with one', () => {
        const withSlash = parseSiteUrl('https://example.com/');
        assert.ok(!absoluteUrl('/devops/project', withSlash).includes('.com//'));
    });
});

describe('reading NEXT_PUBLIC_SITE_URL', () => {
    it('happens only in lib/site-url.ts, so no file can slip in its own fallback address', async () => {
        const { readdir, readFile } = await import('node:fs/promises');
        const { join, relative } = await import('node:path');
        const root = join(import.meta.dirname, '..', '..');

        async function sourceFiles(dir: string): Promise<string[]> {
            const entries = await readdir(dir, { withFileTypes: true });
            const nested = await Promise.all(
                entries.map(entry => {
                    const path = join(dir, entry.name);
                    if (entry.isDirectory()) return entry.name === 'spec' ? [] : sourceFiles(path);
                    return /\.(ts|tsx|mjs|js)$/.test(entry.name) ? [path] : [];
                })
            );
            return nested.flat();
        }

        const files = (await Promise.all(['app', 'components', 'lib', 'content'].map(dir => sourceFiles(join(root, dir))))).flat();
        const readers: string[] = [];
        for (const file of files) {
            if ((await readFile(file, 'utf8')).includes('NEXT_PUBLIC_SITE_URL')) readers.push(relative(root, file));
        }
        assert.deepEqual(readers, ['lib/site-url.ts']);
    });
});
