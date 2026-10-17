/**
 * Settings for the in-browser PostgreSQL that the SQL track's lessons run.
 * The sample database file is the single source of the Island Tours data: the
 * playground loads it, and lessons link to it for readers to load locally.
 */
export const SAMPLE_DATABASE_PATH = '/sql/island-tours.sql';

/** The same data translated for MySQL 8.4, for readers who follow a MySQL course alongside. */
export const SAMPLE_DATABASE_MYSQL_PATH = '/sql/island-tours.mysql.sql';

/**
 * Where PGlite is served from, untouched. Bundling it breaks its internal
 * module wiring (its namespace getters get tree-shaken), so `scripts/copy-pglite.mjs`
 * copies the package's own dist files here before every dev and build, and the
 * engine imports them at runtime with the bundler told to keep its hands off.
 */
export const PGLITE_PUBLIC_DIR = '/vendor/pglite';
export const PGLITE_MODULE_URL = `${PGLITE_PUBLIC_DIR}/index.js`;

/** Island Tours runs in Bangladesh, so times print the way a local psql would. */
export const PLAYGROUND_TIME_ZONE = 'Asia/Dhaka';

/**
 * PostgreSQL extensions the in-browser database can load, as in a real server
 * the reader still runs CREATE EXTENSION first. Each is a small module plus a
 * bundle in PGlite's dist; `scripts/copy-pglite.mjs` copies exactly these.
 */
export const PLAYGROUND_EXTENSIONS = [
    'citext',
    'tablefunc',
    'pg_trgm',
    'fuzzystrmatch',
    'unaccent',
    'ltree',
] as const;

/** The worker that runs PGlite off the main thread, see public/sql/sql-worker.js. */
export const SQL_WORKER_PATH = '/sql/sql-worker.js';

/**
 * How long one statement may run before the box gives up. PGlite ignores
 * statement_timeout, so the page ends the worker instead and starts a fresh
 * copy of the sample database.
 */
export const PLAYGROUND_QUERY_TIMEOUT_MS = 10_000;

/**
 * Types PGlite would turn into JavaScript values. Keeping them as text shows
 * them exactly as psql prints them: 12500.00 not 12500, t not true, +06 kept.
 * bool, int8, int2, int4, oid, json, float4, float8, date, time, timestamp,
 * timestamptz, interval, timetz, numeric, jsonb.
 */
export const RAW_TEXT_TYPE_OIDS = [
    16, 20, 21, 23, 26, 114, 700, 701, 1082, 1083, 1114, 1184, 1186, 1266, 1700, 3802,
];

/** Rows drawn per result. A query can return more; the rest are counted, not drawn. */
export const PLAYGROUND_MAX_ROWS = 200;
