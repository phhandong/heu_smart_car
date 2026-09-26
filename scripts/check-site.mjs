// 导航一致性守卫：整站各页的顶栏 / 移动菜单 / 页脚站内导航 href 序列必须完全一致。
// 背景：v0.3 曾出现「training 页顶栏缺 Wiki 按钮」类漂移（批量脚本未匹配带 active 类的行），
// 该检查并入构建链，页间漂移直接构建失败。
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pages = ['index.html', 'about.html', 'news.html', 'honors.html', 'showcase.html', 'recruit.html', 'training.html', 'training-sw.html', 'training-hw.html', '404.html'];
const grab = (html, re) => {
  const m = html.match(re);
  return m ? [...m[0].matchAll(/href="([^"]+)"/g)].map(x => x[1]) : null;
};
const RE_TOP = /<nav class="topnav"[\s\S]*?<\/nav>/;
const RE_MOB = /<nav class="mobile-nav"[\s\S]*?<\/nav>/;
const RE_FOOT = /<nav class="fg-col" aria-label="站内导航"[\s\S]*?<\/nav>/;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

let ref = null;
for (const p of pages) {
  const html = await readFile(path.join(root, 'dist', p), 'utf8');
  const top = grab(html, RE_TOP);
  const mob = grab(html, RE_MOB);
  const foot = grab(html, RE_FOOT); // 404 等极简页允许无页脚导航
  if (!top || !mob) throw Error(`Nav block missing (topnav/mobile-nav) in ${p}`);
  if (!ref) { ref = { page: p, top, mob, foot }; continue; }
  if (!eq(top, ref.top)) throw Error(`Topnav drift in ${p} vs ${ref.page}: ${top.join(',')} != ${ref.top.join(',')}`);
  if (!eq(mob, ref.mob)) throw Error(`Mobile nav drift in ${p} vs ${ref.page}`);
  if (foot && ref.foot && !eq(foot, ref.foot)) throw Error(`Footer nav drift in ${p} vs ${ref.page}`);
}
console.log(`Nav consistency checked across ${pages.length} pages.`);
