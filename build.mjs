// Offline build: esbuild bundles React + TS, Tailwind v4 compiles from scanned class candidates,
// and both are inlined into dist/index.html (a single self-contained page).
import { build } from 'esbuild';
import { compile } from 'tailwindcss';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const nm = path.join(root, 'node_modules');
const prod = !process.argv.includes('--dev');

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|css|html)$/.test(e.name)) out.push(p);
  }
  return out;
}

// 1. CSS
const files = await walk(path.join(root, 'src'));
const candidates = new Set();
for (const f of files) {
  const txt = await fs.readFile(f, 'utf8');
  for (const m of txt.matchAll(/[^\s"'`{}<>;]+/g)) candidates.add(m[0]);
}
const entryCss = await fs.readFile(path.join(root, 'src/styles.css'), 'utf8');
const compiler = await compile(entryCss, {
  base: root,
  async loadStylesheet(id, base) {
    let p;
    if (id === 'tailwindcss') p = path.join(nm, 'tailwindcss/index.css');
    else if (id.startsWith('tailwindcss/')) p = path.join(nm, id.endsWith('.css') ? id : id + '.css');
    else p = path.resolve(base, id);
    return { path: p, base: path.dirname(p), content: await fs.readFile(p, 'utf8') };
  },
});
const css = compiler.build([...candidates]);

// 2. JS
const res = await build({
  entryPoints: [path.join(root, 'src/main.tsx')],
  bundle: true,
  write: false,
  format: 'iife',
  target: 'es2020',
  minify: prod,
  jsx: 'automatic',
  nodePaths: [nm],
  // Imagery is imported from src/assets and emitted next to the page as dist/assets/*, not inlined
  loader: { '.jpg': 'file', '.webp': 'file' },
  outdir: path.join(root, 'dist'),
  assetNames: 'assets/[name]-[hash]',
  define: { 'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development') },
  logLevel: 'warning',
});
const jsOut = res.outputFiles.find((f) => f.path.endsWith('.js'));
const js = jsOut.text.replace(/<\/script/gi, '<\\/script');
await fs.rm(path.join(root, 'dist/assets'), { recursive: true, force: true });
for (const f of res.outputFiles) {
  if (f === jsOut) continue;
  await fs.mkdir(path.dirname(f.path), { recursive: true });
  await fs.writeFile(f.path, f.contents);
}

// 3. HTML shell
const shell = await fs.readFile(path.join(root, 'src/index.html'), 'utf8');
const html = shell
  .replace('/*__CSS__*/', () => css)
  .replace('/*__JS__*/', () => js);
await fs.mkdir(path.join(root, 'dist'), { recursive: true });
await fs.writeFile(path.join(root, 'dist/index.html'), html);
console.log(`dist/index.html  ${(html.length / 1024).toFixed(0)} KB  (css ${(css.length / 1024).toFixed(0)} KB, js ${(js.length / 1024).toFixed(0)} KB)`);
