import { readFile, readdir, mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const root = process.cwd();
const source = path.join(root, 'content', 'wiki');
const output = path.join(root, 'dist');
const sections = [
  { id: 'recruitment', name: '招新进度', kicker: '01 / JOIN', desc: '了解当前进度，以及加入前可以做的准备。' },
  { id: 'hardware', name: '硬件公告', kicker: '02 / BUILD', desc: '培训安排、学习工具与硬件相关通知。' },
  { id: 'lab', name: '实验室须知', kicker: '03 / LAB', desc: '安全、设备使用和每日离室检查。' }
];
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
const docs = [];
const urls = new Set(['/','/wiki/']);

for (const section of sections) {
  for (const file of (await readdir(path.join(source, section.id))).filter(x => x.endsWith('.md')).sort()) {
    const slug = file.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error(`Invalid filename: ${file}`);
    const raw = await readFile(path.join(source, section.id, file), 'utf8');
    const parsed = matter(raw);
    const data = parsed.data;
    for (const key of ['title', 'summary', 'updated', 'order']) {
      if (data[key] === undefined || data[key] === '') throw Error(`Missing ${key}: ${file}`);
    }
    if (typeof data.title !== 'string' || typeof data.summary !== 'string' || !Number.isInteger(data.order)) throw Error(`Invalid metadata: ${file}`);
    if (typeof data.updated !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.updated) || Number.isNaN(Date.parse(data.updated)) || new Date(data.updated).toISOString().slice(0, 10) !== data.updated) throw Error(`Invalid updated date: ${file}`);
    if (data.pinned !== undefined && typeof data.pinned !== 'boolean') throw Error(`Invalid pinned value: ${file}`);
    const url = `/wiki/${section.id}/${slug}/`;
    if (urls.has(url)) throw Error(`Duplicate URL: ${url}`);
    urls.add(url);
    docs.push({ ...data, section, slug, url, body: parsed.content.trim() });
  }
}
if (!docs.length) throw Error('No Wiki documents found');
const status = docs.find(d => d.section.id === 'recruitment' && d.slug === 'status');
if (!status || typeof status.stage !== 'string' || !status.stage.trim()) throw Error('Recruitment status document needs a stage');

function renderDoc(doc) {
  const body = doc === status ? doc.body.replaceAll('{{stage}}', doc.stage) : doc.body;
  if (doc === status && !doc.body.includes('{{stage}}')) throw Error('Recruitment status body needs {{stage}}');
  const tokens = md.parse(body, {});
  const headings = [];
  const counts = new Map();
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type !== 'heading_open') continue;
    const label = tokens[i + 1].content;
    const base = label.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    token.attrSet('id', id);
    headings.push({ label, id, level: Number(token.tag.slice(1)) });
  }
  return { html: md.renderer.render(tokens, md.options, {}), headings };
}
const sortDocs = (a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN');
const date = value => escape(value);
const docLink = (doc, current) => `<a href="${doc.url}"${current === doc.url ? ' aria-current="page"' : ''}>${escape(doc.title)}</a>`;
const sectionLinks = (current = '') => sections.map(s => `<div class="side-group"><span>${escape(s.kicker)} · ${escape(s.name)}</span>${docs.filter(d => d.section.id === s.id).sort(sortDocs).map(d => docLink(d, current)).join('')}</div>`).join('');
function shell({ title, description, content, sidebar = '', kind = 'home' }) {
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(description)}"><title>${escape(title)} · 济海追风 Wiki</title><link rel="icon" href="/assets/heu-emblem.png"><link rel="stylesheet" href="/wiki/wiki.css"></head>
<body class="${kind}"><header class="site-head"><div class="head-inner"><a class="brand" href="/wiki/"><img src="/assets/club-logo.png" alt=""><span><strong>济海追风</strong><small>WIKI / 社团文档</small></span></a><nav aria-label="主导航"><a href="/wiki/"${kind === 'home' ? ' aria-current="page"' : ''}>Wiki 首页</a><a href="/legacy-nav/">学习导航 ↗</a></nav></div></header>
${content}
<footer class="site-foot"><span>济海追风 · 哈尔滨工程大学</span><span>内容更新以页面日期为准</span><a href="/legacy-nav/">返回硬件学习导航</a</footer></body></html>`;
}
const cards = sections.map(s => {
  const list = docs.filter(d => d.section.id === s.id).sort(sortDocs);
  return `<section class="section-card" id="${s.id}"><div class="section-mark">${escape(s.kicker)}</div><h2>${escape(s.name)}</h2><p>${escape(s.desc)}</p><div class="card-links">${list.map(d => `<a href="${d.url}"><span>${escape(d.title)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
}).join('');
const latest = [...docs].sort((a, b) => b.updated.localeCompare(a.updated) || a.order - b.order).slice(0, 5);
const home = shell({ title: '首页', description: '济海追风社团招新、硬件公告和实验室须知', content: `<main class="wiki-home"><section class="home-hero"><div class="hero-copy"><p class="eyebrow">JIHAI ZHUIFENG / OPEN HANDBOOK</p><h1>把每一步<br><em>写清楚。</em></h1><p class="lead">招新动态、硬件通知、实验室须知，都从这里找到。内容由社团维护，具体安排请以最新公告为准。</p><a class="hero-link" href="${status.url}">查看招新进度 <span aria-hidden="true">↗</span></a></div><div class="hero-orbit" aria-hidden="true"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><span>JZ / WIKI</span></div></section><section class="status-band" aria-label="招新状态"><div><span class="label">当前招新阶段</span><strong>${escape(status.stage)}</strong></div><p>${escape(status.summary)}</p><a href="${status.url}">查看详情 →</a></section><div class="section-heading"><p class="eyebrow">KNOWLEDGE MAP</p><h2>从这里开始</h2></div><div class="section-grid">${cards}</div><section class="latest"><div class="section-heading"><p class="eyebrow">RECENT UPDATES</p><h2>最近更新</h2></div><div class="latest-list">${latest.map(d => `<a href="${d.url}"><time datetime="${date(d.updated)}">${date(d.updated)}</time><span>${escape(d.title)}</span><small>${escape(d.section.name)}</small><b aria-hidden="true">↗</b></a>`).join('')}</div></section></main>` });
const pages = new Map([['wiki/index.html', home]]);
for (const doc of docs) {
  const { html, headings } = renderDoc(doc);
  const toc = headings.filter(h => h.level <= 3).map(h => `<a class="toc-${h.level}" href="#${escape(h.id)}">${escape(h.label)}</a>`).join('');
  const content = `<main class="doc-frame"><aside class="doc-sidebar"><details class="mobile-menu"><summary>浏览 Wiki 目录</summary><nav aria-label="Wiki 文档">${sectionLinks(doc.url)}</nav></details><nav class="desktop-menu" aria-label="Wiki 文档">${sectionLinks(doc.url)}</nav></aside><article class="doc-main"><div class="crumb"><a href="/wiki/">Wiki</a><span>/</span><span>${escape(doc.section.name)}</span></div><p class="eyebrow">${escape(doc.section.kicker)}</p><h1>${escape(doc.title)}</h1><p class="doc-summary">${escape(doc.summary)}</p><div class="doc-meta"><time datetime="${date(doc.updated)}">最后更新：${date(doc.updated)}</time>${doc.pinned ? '<span>置顶文档</span>' : ''}</div><div class="prose">${html}</div><div class="doc-end"><a href="/wiki/">← 返回 Wiki 首页</a><a href="/legacy-nav/">前往学习导航 ↗</a></div></article><aside class="toc"><strong>本文目录</strong><nav aria-label="本文目录">${toc || '<span>暂无小节</span>'}</nav></aside></main>`;
  pages.set(`wiki/${doc.section.id}/${doc.slug}/index.html`, shell({ title: doc.title, description: doc.summary, content, kind: 'document' }));
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyFile(path.join(root, 'index.html'), path.join(output, 'index.html'));
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const asset of ['club-logo.png', 'heu-emblem.png']) await copyFile(path.join(root, 'assets', asset), path.join(output, 'assets', asset));
await mkdir(path.join(output, 'wiki'), { recursive: true });
await copyFile(path.join(root, 'wiki', 'wiki.css'), path.join(output, 'wiki', 'wiki.css'));
for (const [relative, html] of pages) {
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html, 'utf8');
}

console.log(`Built ${docs.length} Wiki documents.`);
