// Copies PGlite's browser files from node_modules into public/, so the SQL
// track's query boxes can load PostgreSQL unbundled. Runs before dev and build;
// the copy is ignored by git and always matches the installed version.
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGLITE_PUBLIC_DIR, PLAYGROUND_EXTENSIONS } from '../lib/sql/playground-config.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const source = dirname(require.resolve('@electric-sql/pglite'));
const target = join(root, 'public', PGLITE_PUBLIC_DIR);

// Only the runtime: the ES modules, the WebAssembly and the data bundle. The
// optional extension archives and source maps stay behind.
const wanted = name => /\.(js|wasm|data)$/.test(name);

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const files = (await readdir(source, { withFileTypes: true }))
    .filter(entry => entry.isFile() && wanted(entry.name))
    .map(entry => entry.name);
if (!files.includes('index.js') || !files.includes('pglite.wasm')) {
    throw new Error(`PGlite files not found in ${source}`);
}
await Promise.all(files.map(name => copyFile(join(source, name), join(target, name))));

// The extensions the query boxes may load: each is contrib/<name>.js, which
// imports a shared chunk with a relative path, plus <name>.tar.gz beside it.
await mkdir(join(target, 'contrib'), { recursive: true });
await Promise.all(
    PLAYGROUND_EXTENSIONS.flatMap(name => [
        copyFile(join(source, 'contrib', `${name}.js`), join(target, 'contrib', `${name}.js`)),
        copyFile(join(source, `${name}.tar.gz`), join(target, `${name}.tar.gz`)),
    ])
);
console.log(
    `copy-pglite: ${files.length} files and ${PLAYGROUND_EXTENSIONS.length} extensions to public${PGLITE_PUBLIC_DIR}`
);
