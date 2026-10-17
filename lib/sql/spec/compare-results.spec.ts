import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compareResults, normalizeCell, type ResultShape } from '../compare-results.ts';

const expected: ResultShape = {
    columns: ['title', 'price_bdt'],
    rows: [
        ['Ratargul Swamp Boat Day', '3500.00'],
        ['Sylhet Tea Garden Tour', '7800.00'],
    ],
};

describe('compareResults', () => {
    it('matches the same rows even when the columns are named differently', () => {
        const actual = { columns: ['name', 'price'], rows: expected.rows };
        assert.deepEqual(compareResults(actual, expected, true), { match: true });
    });

    it('ignores row order unless the task asks for it', () => {
        const actual = { columns: expected.columns, rows: [...expected.rows].reverse() };
        assert.deepEqual(compareResults(actual, expected, false), { match: true });
        assert.equal(compareResults(actual, expected, true).match, false);
        assert.deepEqual(compareResults(actual, expected, true), {
            match: false,
            reason: 'order',
            actualRows: 2,
            expectedRows: 2,
            actualColumns: 2,
            expectedColumns: 2,
        });
    });

    it('reports no result when the query returned no table', () => {
        assert.deepEqual(compareResults(null, expected, false), {
            match: false,
            reason: 'no-result',
            actualRows: 0,
            expectedRows: 2,
            actualColumns: 0,
            expectedColumns: 2,
        });
    });

    it('checks the column count before anything else', () => {
        const actual = { columns: ['title'], rows: [['x'], ['y']] };
        const verdict = compareResults(actual, expected, false);
        assert.equal(verdict.match === false && verdict.reason, 'column-count');
    });

    it('reports a different number of rows', () => {
        const actual = { columns: expected.columns, rows: expected.rows.slice(0, 1) };
        const verdict = compareResults(actual, expected, false);
        assert.equal(verdict.match === false && verdict.reason, 'row-count');
        assert.equal(verdict.match === false && verdict.actualRows, 1);
    });

    it('reports wrong values when the shape is right', () => {
        const actual = {
            columns: expected.columns,
            rows: [expected.rows[0], ['Sylhet Tea Garden Tour', '7900.00']],
        };
        const verdict = compareResults(actual, expected, false);
        assert.equal(verdict.match === false && verdict.reason, 'values');
    });

    it('counts duplicate rows, so two copies of one row are not two different rows', () => {
        const actual = { columns: expected.columns, rows: [expected.rows[0], expected.rows[0]] };
        const verdict = compareResults(actual, expected, false);
        assert.equal(verdict.match === false && verdict.reason, 'values');
    });

    it('matches two empty results', () => {
        const empty = { columns: ['title'], rows: [] };
        assert.deepEqual(compareResults(empty, empty, true), { match: true });
    });
});

describe('normalizeCell', () => {
    it('drops trailing zeros so equal numbers print the same', () => {
        assert.equal(normalizeCell('45000.000'), '45000');
        assert.equal(normalizeCell('45000.0000'), '45000');
        assert.equal(normalizeCell('12.50'), '12.5');
        assert.equal(normalizeCell('3500'), '3500');
        assert.equal(normalizeCell('-0.00'), '0');
        assert.equal(normalizeCell('007'), '7');
    });

    it('leaves anything that is not a plain decimal alone', () => {
        assert.equal(normalizeCell('+8801000000101'), '+8801000000101');
        assert.equal(normalizeCell('2026-11-01'), '2026-11-01');
        assert.equal(normalizeCell('1e3'), '1e3');
        assert.equal(normalizeCell('NULL'), 'NULL');
        assert.equal(normalizeCell(''), '');
    });

    it('lets compareResults accept the same amount at a different scale', () => {
        const expected = { columns: ['total'], rows: [['45000.0000']] };
        const actual = { columns: ['total'], rows: [['45000.000']] };
        assert.deepEqual(compareResults(actual, expected, true), { match: true });
    });
});

