import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const output = path.join(process.cwd(), 'dist');
const pages = [];
async function collect(directory = '') {
  for (const entry of await readdir(path.join(output, directory), { withFileTypes: true })) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) await collect(relative);
    else if (entry.name.endsWith('.html')) pages.push(relative);
  }
}
await collect();
const context = vm.createContext({});
vm.runInContext(await readFile('site/data/training-data.js', 'utf8'), context);
const dynamicIds = new Map(['sw', 'hw'].map(track => [`training-${track}.html`, new Set(context.TRACKS[track].cats.filter(c => !c.scope).map(c => `cat-${c.id}`))]));
dynamicIds.set('showcase.html', new Set(context.TRACKS.hw.cats.filter(c => c.scope === 'showcase').map(c => `cat-${c.id}`)));
dynamicIds.set('legacy-nav/index.html', new Set(['basics', 'solder', 'pcb', 'tools', 'growth', 'race', 'live'].map(x => `cat-${x}`)));
const cache = new Map();
const getHTML = async file => {
  if (!cache.has(file)) cache.set(file, await readFile(path.join(output, file), 'utf8'));
  return cache.get(file);
};
let checked = 0;
async function validateLink(relative, href) {
  href = href.replaceAll('&amp;', '&');
  if (!href || /^(https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(href) || href === '#' || href.includes('${')) return;
  const target = new URL(href, `https://site.invalid/${relative}`);
  if (target.origin !== 'https://site.invalid') return;
  // Old track query links are supported by training.html's redirect.
  if (target.pathname.endsWith('/training.html') && /^(sw|hw)$/.test(target.searchParams.get('track'))) target.pathname = `/training-${target.searchParams.get('track')}.html`;
  const targetFile = decodeURIComponent(target.pathname.slice(1)) + (target.pathname.endsWith('/') ? 'index.html' : '');
  if (targetFile.split('/').includes('..')) throw Error(`Invalid local path: ${href}`);
  const exists = await stat(path.join(output, targetFile)).catch(() => null);
  if (!exists?.isFile()) throw Error(`Broken resource in ${relative}: ${href}`);
  if (target.hash && targetFile.endsWith('.html')) {
    const id = decodeURIComponent(target.hash.slice(1));
    const html = await getHTML(targetFile);
    if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`) && !dynamicIds.get(targetFile)?.has(id)) throw Error(`Broken anchor in ${relative}: ${href}`);
  }
  checked++;
}
for (const relative of pages) {
  const html = await getHTML(relative);
  for (const match of html.matchAll(/\b(?:href|src|poster|data-lightbox)\s*=\s*["']([^"']+)["']/g)) await validateLink(relative, match[1]);
}
// Also check URLs whose anchors and cards only exist after training.js renders.
const trainingLinks = [];
function scan(value) {
  if (Array.isArray(value)) return value.forEach(scan);
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (['url', 'href', 'u', 'file', 'pdf', 'rec'].includes(key) && typeof item === 'string') trainingLinks.push(item);
    else scan(item);
  }
}
for (const key of ['TRACKS', 'DOCS', 'CURRENT']) scan(context[key]);
for (const href of trainingLinks) await validateLink('training.html', href);
console.log(`Validated ${checked} local links/resources across ${pages.length} HTML pages and training data.`);
