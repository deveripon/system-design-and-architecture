/**
 * Settings for the in-browser PostgreSQL that the SQL track's lessons run.
 * The sample database file is the single source of the Island Tours data: the
 * playground loads it, and lessons link to it for readers to load locally.
 */
export const SAMPLE_DATABASE_PATH = '/sql/island-tours.sql';

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

/** Rows drawn per result. A query can return more; the rest are counted, not drawn. */
export const PLAYGROUND_MAX_ROWS = 200;
