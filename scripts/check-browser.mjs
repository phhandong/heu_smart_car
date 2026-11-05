// Optional local QA: npm run check:browser (requires Playwright + Chromium).
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim(), 'playwright'))); }
const root = path.resolve('dist');
const evidence = process.env.SITE_QA_DIR;
if (evidence) await mkdir(evidence, { recursive: true });
const pages = [];
async function collect(dir = '') {
  for (const item of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const relative = path.posix.join(dir, item.name);
    if (item.isDirectory()) await collect(relative);
    else if (item.name.endsWith('.html')) pages.push(relative);
  }
}
await collect();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf' };
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try { const bytes = await readFile(file); res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' }).end(bytes); }
  catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = process.env.SITE_PREVIEW_URL || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const report = { viewports: [], localLinks: 0, externalLinks: [], checks: [] };
const external = new Set();
try {
  for (const width of [1440, 768, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const ids = new Map();
    const links = [];
    for (const relative of pages) {
      await page.goto(`${origin}/${relative}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const dom = await page.evaluate(() => ({
        ids: [...document.querySelectorAll('[id]')].map(el => el.id),
        links: [...document.querySelectorAll('[href],[src],[poster],[data-lightbox]')].flatMap(el => ['href','src','poster','data-lightbox'].map(k => el.getAttribute(k)).filter(Boolean)),
        overflow: document.documentElement.scrollWidth > innerWidth + 1
      }));
      ids.set(relative, new Set(dom.ids));
      for (const href of dom.links) links.push([relative, href]);
      if (!relative.startsWith('assets/') && !relative.startsWith('legacy-nav/')) {
        assert.equal(dom.overflow, false, `Horizontal overflow: ${relative} @${width}`);
      }
      if (evidence && ['training-sw.html', 'training.html', 'honors.html', 'index.html'].includes(relative) && width !== 768) {
        // Reveal the sections as a reader scrolls before capturing the full page.
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 20)); } scrollTo(0,0); });
        await page.screenshot({ path: path.join(evidence, `${relative}-${width}.png`) });
        if (relative === 'training-sw.html') { await page.evaluate(() => window.scrollTo({top: document.getElementById('exam-plan').getBoundingClientRect().top + scrollY - 120, behavior: 'instant'})); await page.waitForTimeout(100); await page.screenshot({path:path.join(evidence, `exam-plan-${width}.png`)}); }
      }
    }
    for (const [relative, href] of links) {
      if (/^(data:|mailto:|tel:|javascript:|blob:)/i.test(href) || href.includes('${')) continue;
      const url = new URL(href, `${origin}/${relative}`);
      if (url.origin !== origin) { external.add(url.href); continue; }
      if (url.pathname === '/training.html' && /^(sw|hw)$/.test(url.searchParams.get('track'))) url.pathname = `/training-${url.searchParams.get('track')}.html`;
      const file = decodeURIComponent(url.pathname.slice(1)) + (url.pathname.endsWith('/') ? 'index.html' : '');
      assert.ok((await stat(path.join(root, file)).catch(() => null))?.isFile(), `Broken rendered link: ${relative} → ${href}`);
      if (url.hash && file.endsWith('.html')) assert.ok(ids.get(file)?.has(decodeURIComponent(url.hash.slice(1))), `Missing rendered anchor: ${relative} → ${href}`);
      report.localLinks++;
    }
    assert.deepEqual(errors, [], `Browser errors @${width}`);
    report.viewports.push({ width, pages: pages.length, errors: 0 });
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}/training-sw.html`);
  const plan = await page.locator('#examPlan').innerText();
  for (const text of ['61#2162', '11 月 9 日起', '此前不进行验收', '最多尝试 3 次', '暂记所在', '代码复查通过后确认', '个人面试', '11.7 V']) assert.ok(plan.includes(text), `Missing current rule: ${text}`);
  assert.ok(!plan.includes('61#2155') && !plan.includes('本次考核没有面试'));
  await page.locator('#menuBtn').click();
  assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'), 'true');
  await page.locator('#mobileNav a[href="training.html"]').click();
  await page.waitForURL('**/training.html');
  assert.equal(await page.locator('#docs .doc-card').count(), 7);
  assert.ok((await page.locator('#currentBar').innerText()).includes('11 月 9 日起'));
  await page.goto(`${origin}/training-sw.html`);
  const button = page.locator('.btn-done').first();
  const key = await button.getAttribute('data-key');
  await button.click();
  assert.equal(await button.getAttribute('aria-pressed'), 'true');
  await page.reload();
  assert.equal(await page.locator(`.btn-done[data-key="${key}"]`).getAttribute('aria-pressed'), 'true');
  await page.locator('#q').fill('不存在的学习资源');
  assert.equal(await page.locator('#sections .vcard:not(.hide)').count(), 0);
  await page.locator('#q').fill('');
  assert.ok(await page.locator('#sections .vcard:not(.hide)').count() > 0);
  await page.locator('.chip[data-cat="pc"]').click();
  assert.equal(await page.locator('.chip[data-cat="pc"]').getAttribute('aria-pressed'), 'true');
  await page.goto(`${origin}/training.html?track=hw#cat-basics`);
  await page.waitForURL('**/training-hw.html#cat-basics');
  assert.equal(await page.locator('#cat-basics').count(), 1);
  await context.close();
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  for (const [relative, selector, count] of [['index.html','#newsMini .news-item',3],['news.html','#newsList .news-item',11]]) {
    await staticPage.goto(`${origin}/${relative}`);
    assert.equal(await staticPage.locator(selector).count(), count);
    assert.ok((await staticPage.locator(selector).first().innerText()).includes('2026-11-05'));
  }
  await staticPage.goto(`${origin}/index.html`);
  assert.equal(await staticPage.locator('.honor-band').count(), 1);
  assert.equal(await staticPage.locator('.gallery.snap .g-item').count(), 4);
  assert.equal(await staticPage.locator('.news-grid .news-card').count(), 3);
  assert.equal(await staticPage.locator('footer .fg-brand').count(), 1);
  await noJS.close();
  report.checks.push('current exam rules', 'mobile menu', 'lecture links', 'persistent check-in', 'search and filters', 'legacy track redirect', 'news without JavaScript');
  report.externalLinks = [...external].sort();
  if (evidence) await writeFile(path.join(evidence, 'browser-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ viewports: report.viewports, localLinks: report.localLinks, externalLinks: external.size, checks: report.checks }, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
