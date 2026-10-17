import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { splitStatements } from '../split-statements.ts';

describe('splitStatements', () => {
    it('splits on semicolons and trims each statement', () => {
        assert.deepEqual(splitStatements('SELECT 1;  SELECT 2 ;\nSELECT 3'), [
            'SELECT 1',
            'SELECT 2',
            'SELECT 3',
        ]);
    });

    it('keeps a semicolon inside a string, with doubled quotes as an escape', () => {
        assert.deepEqual(
            splitStatements("SELECT 'a;b', 'it''s; fine'; SELECT 2"),
            ["SELECT 'a;b', 'it''s; fine'", 'SELECT 2']
        );
    });

    it('keeps a semicolon inside a quoted identifier', () => {
        assert.deepEqual(splitStatements('SELECT 1 AS "x;y"; SELECT 2'), [
            'SELECT 1 AS "x;y"',
            'SELECT 2',
        ]);
    });

    it('keeps a function body in dollar quotes whole, tagged or not', () => {
        const fn = 'CREATE FUNCTION f() RETURNS int AS $$ SELECT 1; $$ LANGUAGE sql';
        const tagged = 'DO $body$ BEGIN PERFORM 1; END $body$';
        assert.deepEqual(splitStatements(`${fn}; ${tagged}; SELECT 3`), [
            fn,
            tagged,
            'SELECT 3',
        ]);
    });

    it('ignores semicolons in comments and drops comment-only pieces', () => {
        assert.deepEqual(
            splitStatements('-- first; not a split\nSELECT 1; /* two; */ SELECT 2;\n-- trailing note'),
            ['-- first; not a split\nSELECT 1', '/* two; */ SELECT 2']
        );
    });

    it('treats a lone dollar sign as an ordinary character', () => {
        assert.deepEqual(splitStatements('SELECT $1; SELECT 2'), ['SELECT $1', 'SELECT 2']);
    });

    it('returns nothing for blank input or empty statements', () => {
        assert.deepEqual(splitStatements(''), []);
        assert.deepEqual(splitStatements(' ;; \n ; '), []);
    });

    it('keeps the rest of the script when a quote is never closed', () => {
        assert.deepEqual(splitStatements("SELECT 'open; SELECT 2"), ["SELECT 'open; SELECT 2"]);
    });
});
