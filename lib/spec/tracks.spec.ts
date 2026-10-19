import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { nextTrack, TRACK_HOME, TRACKS, trackForPath } from '../tracks.ts';

describe('TRACKS', () => {
    it('puts DevOps first, then SQL, then System Design', () => {
        assert.deepEqual(
            TRACKS.map(track => track.id),
            ['devops', 'sql', 'system-design']
        );
    });

    it('gives the home page to DevOps and every track its own landing', () => {
        assert.deepEqual(TRACK_HOME, {
            devops: '/',
            sql: '/sql',
            'system-design': '/system-design',
        });
    });
});

describe('trackForPath', () => {
    const cases: [string, string | undefined][] = [
        ['/', 'devops'],
        ['/devops', 'devops'],
        ['/devops/topic/dns-overview', 'devops'],
        ['/devops/project', 'devops'],
        ['/devops/reference/ascii-table', 'devops'],
        ['/sql', 'sql'],
        ['/sql/topic/insert', 'sql'],
        ['/sql/database', 'sql'],
        ['/system-design', 'system-design'],
        ['/topic/scalability', 'system-design'],
    ];

    for (const [pathname, expected] of cases) {
        it(`maps ${pathname} to ${expected}`, () => {
            assert.equal(trackForPath(pathname)?.id, expected);
        });
    }

    it('does not treat a path that only starts with the same letters as part of a track', () => {
        assert.equal(trackForPath('/sqlite'), undefined);
        assert.equal(trackForPath('/devopsy'), undefined);
        assert.equal(trackForPath('/topics'), undefined);
    });

    it('leaves pages outside every track unmatched', () => {
        assert.equal(trackForPath('/search-index.json'), undefined);
        assert.equal(trackForPath('/sitemap.xml'), undefined);
    });
});

describe('nextTrack', () => {
    it('walks the tracks in order and wraps back to the first', () => {
        assert.equal(nextTrack('devops').id, 'sql');
        assert.equal(nextTrack('sql').id, 'system-design');
        assert.equal(nextTrack('system-design').id, 'devops');
    });
});
