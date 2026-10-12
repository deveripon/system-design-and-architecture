import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    groupHits,
    prepareEntries,
    searchEntries,
    withinOneEdit,
} from '../search.ts';
import type { SearchEntry } from '../types.ts';

const ENTRIES: SearchEntry[] = [
    { kind: 'page', title: 'DevOps Track', href: '/devops' },
    {
        kind: 'module',
        title: 'DNS',
        context: 'DevOps · Module 04',
        href: '/devops/topic/dns-overview',
    },
    {
        kind: 'lesson',
        title: 'TCP Three-Way Handshake',
        context: 'DevOps · TCP/IP',
        description: 'SYN, SYN-ACK, ACK কীভাবে Connection খোলে',
        href: '/devops/topic/three-way-handshake',
    },
    {
        kind: 'lesson',
        title: 'DNS Records',
        context: 'DevOps · DNS',
        href: '/devops/topic/dns-records',
    },
    {
        kind: 'lesson',
        title: 'DNS over HTTPS',
        context: 'DevOps · DNS',
        href: '/devops/topic/dns-over-https',
        comingSoon: true,
    },
    {
        kind: 'section',
        title: 'দুটো সারি, একটা দরজা',
        label: 'Two Queues',
        context: 'TCP Three-Way Handshake',
        keywords: 'backlog somaxconn syncookies',
        href: '/devops/topic/three-way-handshake#queues',
    },
];

const prepared = prepareEntries(ENTRIES);
const hrefs = (query: string) =>
    searchEntries(prepared, query).map(hit => hit.entry.href);

describe('searchEntries', () => {
    it('returns nothing for an empty or punctuation only query', () => {
        assert.deepEqual(searchEntries(prepared, ''), []);
        assert.deepEqual(searchEntries(prepared, '  / '), []);
    });

    it('requires every word of the query to match the same entry', () => {
        assert.deepEqual(hrefs('dns records'), ['/devops/topic/dns-records']);
        assert.deepEqual(hrefs('dns handshake'), []);
    });

    it('ranks the module named exactly like the query first, then written before unwritten lessons', () => {
        assert.deepEqual(hrefs('dns'), [
            '/devops/topic/dns-overview',
            '/devops/topic/dns-records',
            '/devops/topic/dns-over-https',
        ]);
    });

    it('puts an exact title match first whatever its kind', () => {
        const entries: SearchEntry[] = [
            { kind: 'lesson', title: 'DNS Records', href: '/a' },
            { kind: 'section', title: 'DNS', href: '/b' },
        ];
        const hits = searchEntries(prepareEntries(entries), 'dns');
        assert.equal(hits[0].entry.href, '/b');
    });

    it('finds a section by a term that only appears in its body keywords', () => {
        assert.deepEqual(hrefs('somaxconn'), [
            '/devops/topic/three-way-handshake#queues',
        ]);
    });

    it('matches the English label and the Bengali title of a section', () => {
        assert.deepEqual(hrefs('queues'), [
            '/devops/topic/three-way-handshake#queues',
        ]);
        assert.deepEqual(hrefs('দরজা'), [
            '/devops/topic/three-way-handshake#queues',
        ]);
    });

    it('matches the description and the context at a lower score than a title', () => {
        const hits = searchEntries(prepared, 'tcp');
        assert.equal(hits[0].entry.href, '/devops/topic/three-way-handshake');
        assert.ok(hits[0].score > hits[1].score);
        assert.equal(
            hits[1].entry.href,
            '/devops/topic/three-way-handshake#queues'
        );
    });

    it('forgives one wrong letter in a long Latin word of the title', () => {
        assert.deepEqual(hrefs('handshke'), [
            '/devops/topic/three-way-handshake',
        ]);
        assert.deepEqual(hrefs('hxndshxke'), []);
    });

    it('lets a single letter match only the start of a word', () => {
        const entries: SearchEntry[] = [
            { kind: 'lesson', title: 'Nginx', href: '/n' },
            { kind: 'lesson', title: 'Kafka', href: '/k' },
        ];
        const found = searchEntries(prepareEntries(entries), 'k');
        assert.deepEqual(found.map(hit => hit.entry.href), ['/k']);
    });

    it('keeps index order between equal scores', () => {
        const entries: SearchEntry[] = [
            { kind: 'lesson', title: 'HTTP Basics', href: '/1' },
            { kind: 'lesson', title: 'HTTP Headers', href: '/2' },
        ];
        const found = searchEntries(prepareEntries(entries), 'http');
        assert.deepEqual(found.map(hit => hit.entry.href), ['/1', '/2']);
    });
});

describe('withinOneEdit', () => {
    it('accepts one replaced, missing or extra letter', () => {
        assert.equal(withinOneEdit('cache', 'cache'), true);
        assert.equal(withinOneEdit('cache', 'cashe'), true);
        assert.equal(withinOneEdit('cache', 'cach'), true);
        assert.equal(withinOneEdit('cache', 'caches'), true);
    });

    it('rejects two edits or a length gap of two', () => {
        assert.equal(withinOneEdit('cache', 'kashe'), false);
        assert.equal(withinOneEdit('cache', 'cac'), false);
    });
});

describe('groupHits', () => {
    const limits = { page: 1, lesson: 1, module: 1, section: 1 };

    it('groups in a fixed order, cuts to the limit and keeps the full count', () => {
        const groups = groupHits(searchEntries(prepared, 'dns'), limits);
        assert.deepEqual(
            groups.map(g => [g.kind, g.hits.length, g.total]),
            [
                ['lesson', 1, 2],
                ['module', 1, 1],
            ]
        );
        assert.equal(groups[0].hits[0].entry.href, '/devops/topic/dns-records');
    });

    it('leaves out kinds with no hit', () => {
        assert.deepEqual(groupHits([], limits), []);
    });
});
