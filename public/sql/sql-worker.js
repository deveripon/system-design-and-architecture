// Runs the SQL track's in-browser PostgreSQL (PGlite) off the main thread.
//
// A query that never ends (an endless recursive CTE, a huge cross join) would
// freeze the whole page if PGlite ran on the main thread, because WebAssembly
// cannot be interrupted and PGlite ignores statement_timeout. In a worker the
// page stays responsive, and the page can end the worker when a query runs too
// long. Everything this file needs (where PGlite lives, the sample data, the
// time zone, which types to keep as text) arrives in the "init" message, so
// the values live in one place: lib/sql/playground-config.ts.

let db = null;
let parsers = {};

const fail = (id, error) =>
    self.postMessage({
        id,
        ok: false,
        error: {
            message: error && error.message ? error.message : String(error),
            detail: error && error.detail,
            hint: error && error.hint,
            position: error && error.position,
            code: error && error.code,
        },
    });

self.onmessage = async event => {
    const { id, type } = event.data;
    try {
        if (type === 'init') {
            const { moduleUrl, seedSql, timeZone, rawTypes } = event.data;
            const { PGlite } = await import(moduleUrl);
            db = await PGlite.create();
            await db.query('SELECT set_config($1, $2, false)', ['TimeZone', timeZone]);
            await db.exec(seedSql);
            parsers = Object.fromEntries(rawTypes.map(oid => [oid, value => value]));
            self.postMessage({ id, ok: true });
            return;
        }
        if (type === 'query') {
            const result = await db.query(event.data.sql, [], { rowMode: 'array', parsers });
            self.postMessage({
                id,
                ok: true,
                result: {
                    rows: result.rows,
                    fields: result.fields,
                    command: result.command,
                    rowCount: result.rowCount,
                    affectedRows: result.affectedRows,
                },
            });
            return;
        }
        fail(id, new Error(`Unknown message type: ${type}`));
    } catch (error) {
        fail(id, error);
    }
};
