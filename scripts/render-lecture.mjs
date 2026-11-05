// Render a self-contained lecture HTML to PDF. Playwright is a local authoring tool.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim(), 'playwright'))); }
const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw Error('Usage: node scripts/render-lecture.mjs source.html output.pdf');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(pathToFileURL(path.resolve(source)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: destination, printBackground: true, preferCSSPageSize: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  console.log(`Rendered ${destination}`);
} finally { await browser.close(); }
