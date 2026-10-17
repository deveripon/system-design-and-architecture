'use client';

import {
    PGLITE_MODULE_URL,
    PLAYGROUND_QUERY_TIMEOUT_MS,
    PLAYGROUND_TIME_ZONE,
    RAW_TEXT_TYPE_OIDS,
    SAMPLE_DATABASE_PATH,
    SQL_WORKER_PATH,
} from '@/lib/sql/playground-config';
import type { Results } from '@electric-sql/pglite';

/** What a failed statement reports, in the shape the PostgreSQL error has. */
export interface EngineError {
    message: string;
    detail?: string;
    hint?: string;
    position?: string | number;
    code?: string;
    /** The statement ran past the time limit and the database was restarted. */
    timedOut?: boolean;
}

type Reply =
    | { id: number; ok: true; result?: Results<unknown[]> }
    | { id: number; ok: false; error: EngineError };

/**
 * One PostgreSQL per page, shared by every query box on it, so a table one box
 * creates is there for the next box, exactly like one psql session. It runs in
 * a Web Worker (public/sql/sql-worker.js) and is only started when the first
 * query runs, never on page load.
 */
export class SqlEngine {
    private nextId = 1;
    private pending = new Map<number, (reply: Reply) => void>();

    private constructor(private readonly worker: Worker) {
        worker.onmessage = (event: MessageEvent<Reply>) => {
            const settle = this.pending.get(event.data.id);
            this.pending.delete(event.data.id);
            settle?.(event.data);
        };
    }

    static async start(seedSql: string) {
        const engine = new SqlEngine(new Worker(SQL_WORKER_PATH, { type: 'module' }));
        await engine.send(
            {
                type: 'init',
                moduleUrl: new URL(PGLITE_MODULE_URL, window.location.origin).href,
                seedSql,
                timeZone: PLAYGROUND_TIME_ZONE,
                rawTypes: RAW_TEXT_TYPE_OIDS,
            },
            null
        );
        return engine;
    }

    /** Runs one statement. Rejects with an EngineError, including on timeout. */
    async query(sql: string): Promise<Results<unknown[]>> {
        const reply = await this.send({ type: 'query', sql }, PLAYGROUND_QUERY_TIMEOUT_MS);
        return reply as Results<unknown[]>;
    }

    stop() {
        this.worker.terminate();
        for (const settle of this.pending.values()) {
            settle({ id: 0, ok: false, error: { message: 'The database was restarted.' } });
        }
        this.pending.clear();
    }

    private send(message: Record<string, unknown>, timeoutMs: number | null) {
        const id = this.nextId++;
        return new Promise<Results<unknown[]> | undefined>((resolve, reject) => {
            let timer: ReturnType<typeof setTimeout> | undefined;
            this.pending.set(id, reply => {
                if (timer) clearTimeout(timer);
                if (reply.ok) resolve(reply.result);
                else reject(reply.error);
            });
            if (timeoutMs !== null) {
                timer = setTimeout(() => {
                    this.pending.delete(id);
                    // WebAssembly cannot be interrupted, so the only way to stop
                    // the statement is to end the worker and start a new one.
                    if (engine && current === this) engine = null;
                    this.stop();
                    reject({
                        message: `statement ran longer than ${timeoutMs / 1000} seconds and was stopped`,
                        timedOut: true,
                    } satisfies EngineError);
                }, timeoutMs);
            }
            this.worker.postMessage({ ...message, id });
        });
    }
}

let engine: Promise<SqlEngine> | null = null;
let current: SqlEngine | null = null;
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

export function getEngine() {
    if (!engine) {
        engine = loadSeed()
            .then(sql => SqlEngine.start(sql))
            .then(started => {
                current = started;
                return started;
            })
            .catch(error => {
                engine = null;
                throw error instanceof Error ? error : new Error((error as EngineError).message);
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
            (await old).stop();
        } catch {
            // A database that failed to start has nothing to stop.
        }
    }
    current = null;
    return getEngine();
}
