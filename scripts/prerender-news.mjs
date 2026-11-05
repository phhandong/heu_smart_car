// 新闻数据同时用于浏览器和静态 HTML；构建时同步无 JS 阅读内容。
import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
const context = vm.createContext({});
vm.runInContext(await readFile('site/data/news-data.js', 'utf8'), context);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
for (const [file, id, count] of [['index.html', 'newsMini', 3], ['news.html', 'newsList', context.NEWS.length]]) {
  const destination = `dist/${file}`;
  let html = await readFile(destination, 'utf8');
  const cards = context.NEWS.slice(0, count).map(n => {
    const body = `<span class="ni-date">${escape(n.date)}</span><div class="ni-body"><b>${escape(n.t)}<span class="ni-tag">${escape(n.tag)}</span></b><p>${escape(n.d)}</p></div>`;
    return id === 'newsMini'
      ? `<a class="news-item tilt" href="${escape(n.link || 'news.html')}">${body}</a>`
      : `<article class="news-item rv in">${body}${n.link ? `<a class="ni-link" href="${escape(n.link)}">${escape(n.linkText || '查看')} →</a>` : ''}</article>`;
  }).join('\n');
  const pattern = /<!-- NEWS:START -->[\s\S]*?<!-- NEWS:END -->/;
  if (!pattern.test(html)) throw Error(`Missing news markers: ${file}`);
  html = html.replace(pattern, () => `<!-- NEWS:START -->\n${cards}\n<!-- NEWS:END -->`);
  html = html.replace(/(<p class="last-update" id="lastUpdate">)[\s\S]*?(<\/p>)/, `$1最近更新：${context.NEWS[0].date} · 更早动态见官方号与群公告$2`);
  await writeFile(destination, html);
}
console.log('News prerendered from news-data.js.');
