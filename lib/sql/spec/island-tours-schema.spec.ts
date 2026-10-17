import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { ISLAND_TOURS_TABLES } from '../island-tours-schema.ts';
import {
    SAMPLE_DATABASE_MYSQL_PATH,
    SAMPLE_DATABASE_PATH,
} from '../playground-config.ts';

const readPublic = (path: string) =>
    readFileSync(new URL(`../../../public${path}`, import.meta.url), 'utf8');
const sqlFile = readPublic(SAMPLE_DATABASE_PATH);
const mysqlFile = readPublic(SAMPLE_DATABASE_MYSQL_PATH);

/** Table name to its column lines, in order, read from the CREATE TABLE statements. */
function tablesInSql(file = sqlFile): Map<string, string[]> {
    const tables = new Map<string, string[]>();
    for (const match of file.matchAll(/CREATE TABLE (\w+) \(\n([\s\S]*?)\n\);/g)) {
        const lines = match[2]
            .split('\n')
            .map(line => line.trim().replace(/,$/, ''))
            .filter(Boolean);
        tables.set(match[1], lines);
    }
    return tables;
}

describe('Island Tours schema description', () => {
    const inSql = tablesInSql();

    it('names the same tables as the sample database file', () => {
        assert.deepEqual(
            [...inSql.keys()].sort(),
            ISLAND_TOURS_TABLES.map(t => t.name).sort()
        );
    });

    for (const table of ISLAND_TOURS_TABLES) {
        it(`matches the columns, types and keys of ${table.name}`, () => {
            const lines = inSql.get(table.name) ?? [];
            assert.deepEqual(
                lines.map(line => line.split(/\s+/)[0]),
                table.columns.map(c => c.name)
            );
            table.columns.forEach((column, i) => {
                const definition = lines[i].replace(/^\w+\s+/, '');
                assert.ok(
                    definition.startsWith(column.type),
                    `${table.name}.${column.name}: "${definition}" does not start with "${column.type}"`
                );
                assert.equal(
                    definition.includes('PRIMARY KEY'),
                    column.key === 'PK',
                    `${table.name}.${column.name} primary key`
                );
                const reference = definition.match(/REFERENCES (\w+)/)?.[1];
                assert.equal(reference, column.references, `${table.name}.${column.name} reference`);
                if (column.key === 'UNIQUE FK') assert.ok(definition.includes('UNIQUE'));
            });
        });
    }

    it('has the same tables, columns and foreign keys in the MySQL version', () => {
        const inMysql = tablesInSql(mysqlFile);
        for (const table of ISLAND_TOURS_TABLES) {
            const lines = inMysql.get(table.name) ?? [];
            const columns = lines.filter(line => !line.startsWith('FOREIGN KEY'));
            assert.deepEqual(
                columns.map(line => line.split(/\s+/)[0]),
                table.columns.map(c => c.name),
                table.name
            );
            const foreignKeys = lines
                .filter(line => line.startsWith('FOREIGN KEY'))
                .map(line => line.match(/FOREIGN KEY \((\w+)\) REFERENCES (\w+)/)!.slice(1).join('->'));
            assert.deepEqual(
                foreignKeys,
                table.columns.filter(c => c.references).map(c => `${c.name}->${c.references}`),
                `${table.name} foreign keys`
            );
        }
    });

    it('holds the same rows in both versions, apart from the time zone suffix', () => {
        const rows = (file: string) =>
            file.slice(file.indexOf('INSERT INTO')).replace(/\+06'/g, "'");
        assert.equal(rows(mysqlFile), rows(sqlFile));
    });

    it('only points foreign keys at tables that exist', () => {
        const names = new Set(ISLAND_TOURS_TABLES.map(t => t.name));
        for (const table of ISLAND_TOURS_TABLES) {
            for (const column of table.columns) {
                if (column.references) assert.ok(names.has(column.references), column.references);
            }
        }
    });
});
