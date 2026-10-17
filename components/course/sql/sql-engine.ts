'use client';

import {
    PGLITE_MODULE_URL,
    PLAYGROUND_TIME_ZONE,
    SAMPLE_DATABASE_PATH,
} from '@/lib/sql/playground-config';
import type { PGlite } from '@electric-sql/pglite';

type PGliteModule = typeof import('@electric-sql/pglite');

/**
 * One PostgreSQL per page, shared by every playground on it, so a table one
 * box creates is there for the next box, exactly like one psql session.
 * PGlite (about 16 MB of WebAssembly) is only fetched when the first query
 * runs, never on page load.
 */
let engine: Promise<PGlite> | null = null;
let seed: Promise<string> | null = null;

function loadSeed() {
    if (!seed) {
        seed = fetch(SAMPLE_DATABASE_PATH)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Sample database responded ${res.status}`);
                }
                return res.text();
            })
            .catch(error => {
                seed = null;
                throw error;
            });
    }
    return seed;
}

async function start() {
    const [{ PGlite }, sql] = await Promise.all([
        // Served as plain files from public/, see PGLITE_MODULE_URL.
        import(
            /* webpackIgnore: true */ /* turbopackIgnore: true */ PGLITE_MODULE_URL
        ) as Promise<PGliteModule>,
        loadSeed(),
    ]);
    const db = await PGlite.create();
    await db.exec(`SET TimeZone = '${PLAYGROUND_TIME_ZONE}'`);
    await db.exec(sql);
    return db;
}

export function getEngine() {
    if (!engine) {
        engine = start().catch(error => {
            engine = null;
            throw error;
        });
    }
    return engine;
}

/** Throws the current database away and starts a fresh copy of the sample data. */
export async function resetEngine() {
    const old = engine;
    engine = null;
    if (old) {
        try {
            await (await old).close();
        } catch {
            // A database that failed to start has nothing to close.
        }
    }
    return getEngine();
}
