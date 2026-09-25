import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.join(process.cwd(), 'dist');
const pages = [];
async function collect(directory = '') {
  for (const entry of await readdir(path.join(output, directory), { withFileTypes: true })) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) await collect(relative);
    else if (entry.name.endsWith('.html')) pages.push(relative);
  }
}
await collect('wiki');
await collect('legacy-nav');

// Validate Wiki and hardware navigation links against the final merged site.
for (const relative of pages) {
  const html = await readFile(path.join(output, relative), 'utf8');
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    // The hardware navigation renders resource links and category IDs in JS.
    if (relative === 'legacy-nav/index.html' && href.includes('${')) continue;
    if (/^(https?:|mailto:|tel:|javascript:)/.test(href) || href === '#') continue;
    const target = new URL(href, `https://site.invalid/${relative}`);
    if (target.origin !== 'https://site.invalid') continue;
    const targetFile = decodeURIComponent(target.pathname.slice(1)) + (target.pathname.endsWith('/') ? 'index.html' : '');
    const targetHtml = targetFile === relative ? html : await readFile(path.join(output, targetFile), 'utf8').catch(() => {
      throw Error(`Broken link in ${relative}: ${href}`);
    });
    if (target.hash && !targetHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) {
      const dynamicCategory = targetFile === 'legacy-nav/index.html' && /^#cat-(basics|solder|pcb|tools|growth|race|live)$/.test(target.hash);
      if (!dynamicCategory) throw Error(`Broken anchor in ${relative}: ${href}`);
    }
  }
}
console.log(`Validated local links in ${pages.length} HTML pages.`);
