# 济海追风 Wiki 维护说明

网站首页保留硬件学习导航，Wiki 由 `content/wiki/` 内的 Markdown 文档生成。`recruitment`、`hardware`、`lab` 分别对应招新进度、硬件公告和实验室须知。

## 本地预览与发布

1. 安装 Node.js，运行 `npm ci`。
2. 运行 `npm run build`，静态网站输出到 `dist/`。
3. 用静态服务器预览 `dist/`，例如 `npx serve dist`。直接双击 HTML 文件无法正确测试以 `/` 开头的链接。
4. 提交 Markdown 修改并推送到连接 Vercel 的分支。Vercel 使用 `vercel.json` 中的构建命令和 `dist` 输出目录；先看预览部署，再按现有流程发布到正式环境。

## 更新内容

复制 [`content/wiki/_template.md`](content/wiki/_template.md) 到对应栏目，文件名使用英文小写字母、数字和短横线，例如 `training-update.md`。页面地址由栏目和文件名决定；发布后不要随意改名，以免旧链接失效。

每篇文档必须填写 `title`（标题）、`summary`（摘要）、`updated`（实际更新日期，`YYYY-MM-DD`）和 `order`（栏目内顺序）；`pinned` 是可选布尔值。招新主文档固定为 `content/wiki/recruitment/status.md`，其中 `stage` 同时显示在 Wiki 首页状态栏和正文的 `{{stage}}` 位置。更新招新进度时，还应核对正文中的下一步安排、时间地点及报名方式。

修改旧公告时更新 `updated`。过期公告可以保留原地址，在正文顶部注明“已结束”或“已作废”及替代信息。最近更新按日期取前五篇；新文档会自动进入栏目列表。

`npm run build` 会检查必要元数据、重复地址、站内页面链接及文内锚点。未知的时间、地点、联系人和规则写“待公布”，不要使用未经确认的信息。
