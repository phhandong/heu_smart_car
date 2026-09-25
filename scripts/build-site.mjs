// 实验室整站构建适配：把 site/（济海追风完整官网）并入 wiki 构建产物 dist/
// 布局约定：
//   /            = 实验室完整官网（site/index.html）
//   /legacy-nav/ = 原硬件学习导航单页（build-wiki 生成的根 index.html 移至此，内容仍由硬件组维护）
//   /wiki/       = 社团 Wiki（build-wiki 生成，保持不变）
// wiki 页面引用的 /assets/club-logo.png、/assets/heu-emblem.png 保留在 dist/assets/，
// legacy-nav 另持一份相对路径副本以保证其离线自洽。
// 脚本幂等：可重复运行（rename 已发生或源缺失时跳过）。
import { cp, mkdir, rename, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const site = path.join(root, 'site');

const legacy = path.join(dist, 'legacy-nav');
await mkdir(path.join(legacy, 'assets'), { recursive: true });
const rootIndex = path.join(dist, 'index.html');
if (await stat(rootIndex).then(() => true, () => false)) {
  await rename(rootIndex, path.join(legacy, 'index.html'));
}
for (const asset of (await readdir(path.join(dist, 'assets'))).filter(a => a.endsWith('.png'))) {
  const src = path.join(dist, 'assets', asset);
  const dest = path.join(legacy, 'assets', asset);
  if (await stat(dest).then(() => false, () => true)) await cp(src, dest);
}

for (const entry of await readdir(site)) {
  await cp(path.join(site, entry), path.join(dist, entry), { recursive: true, force: true });
}

console.log('Site merged: / = full lab site, /legacy-nav/ = hardware nav page, /wiki/ = wiki.');
