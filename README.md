# 济海追风 Wiki 维护说明

网站首页为实验室官网（源文件在 `site/`），原硬件学习导航位于 `/legacy-nav/`。Wiki 由 `content/wiki/` 内的 Markdown 文档生成。`recruitment`、`hardware`、`lab` 分别对应招新进度、硬件公告和实验室须知。

## 本地预览与发布

1. 安装 Node.js，运行 `npm ci`。
2. 运行 `npm run build`，静态网站输出到 `dist/`。
3. 用静态服务器预览 `dist/`，例如 `npx serve dist`。直接双击 HTML 文件无法正确测试以 `/` 开头的链接。
4. 从最新 `origin/main` 建批次分支和独立工作树；完成检查后推送该分支，向 `main` 发起 PR，交管理者审阅合并。Vercel 使用 `vercel.json` 中的构建命令和 `dist` 输出目录；先看预览部署，再按现有流程发布到正式环境。

## 更新内容

复制 [`content/wiki/_template.md`](content/wiki/_template.md) 到对应栏目，文件名使用英文小写字母、数字和短横线，例如 `training-update.md`。页面地址由栏目和文件名决定；发布后不要随意改名，以免旧链接失效。

每篇文档必须填写 `title`（标题）、`summary`（摘要）、`updated`（实际更新日期，`YYYY-MM-DD`）和 `order`（栏目内顺序）；`pinned` 是可选布尔值。招新主文档固定为 `content/wiki/recruitment/status.md`，其中 `stage` 同时显示在 Wiki 首页状态栏和正文的 `{{stage}}` 位置。更新招新进度时，还应核对正文中的下一步安排、时间地点及报名方式。

修改旧公告时更新 `updated`。过期公告可以保留原地址，在正文顶部注明“已结束”或“已作废”及替代信息。最近更新按日期取前五篇；新文档会自动进入栏目列表。

`npm run build` 会检查必要元数据、重复地址、站内页面链接及文内锚点。未知的时间、地点、联系人和规则写“待公布”，不要使用未经确认的信息。


## 官网内容与验证

- 培训日程、讲义、当前阶段和考核安排维护 `site/data/training-data.js`；开放调试时间与验收起始日期、值班时段分别填写。渲染器从数据读取教室与规则。
- 新闻只改 `site/data/news-data.js`，按事件日期倒序排列。构建脚本为首页和动态页生成静态新闻，禁用 JavaScript 时仍能阅读。
- `npm run build` 检查整站本地链接、资源、静态与数据生成的锚点，以及十个主页面的导航一致性。
- 本机安装 Playwright 和 Chromium 后运行 `npm run check:browser`：覆盖 1440 / 768 / 390 三种屏宽、浏览器生成的链接、当前规则、搜索筛选、打卡持久化、移动菜单、旧赛道链接跳转和无 JavaScript 新闻。可用 `SITE_QA_DIR` 指定截图和报告目录，`SITE_PREVIEW_URL` 指定待验收部署地址。

## 公开讲义

第三次软件培训提供交互式 HTML 和 PDF；第四次提供公开 PDF，其排版源在 `content/lectures/`。发布副本须按公开范围移除个人信息和内部影像，教学真源由材料工作区维护。

从本机材料工作区准备公开副本后，再生成第四次 PDF（Playwright 和 Chromium 为本机排版工具，不参与 Vercel 构建）：

```sh
python3 scripts/prepare-lectures.py --source-root <材料工作区路径>
node scripts/render-lecture.mjs content/lectures/sw-training-4.html site/assets/docs/sw-training-4.pdf
```

PDF 发布前须逐页渲染检查、提取文字扫描个人信息，并确认考核页与当前通知一致。未经核实的录播保留官方号获取渠道，不填写猜测的视频地址。
