/* ================================================================
 * 培训中心 · 资源数据（内容与代码分离，日常维护只改这个文件）
 *
 * 维护指南：
 *  1. 每条资源一个对象：{ id, t 标题, d 一句话说明, url, tags, type }
 *     - id 必须稳定且唯一（B站用 BV 号、抖音用 dy+视频ID、网站用域名slug），
 *       学习打卡记录以 id 为键，切勿复用或随意改动；
 *     - type: 'video' 视频 | 'site' 网站/工具 | 'doc' 文档资料；
 *     - url 暂用 B站搜索页的条目会自动带「占位」角标，替换为真实地址后角标消失。
 *  2. 新增分类：在对应赛道的 cats 里加对象（id/name/en/icon/color 系/desc/items），
 *     icon 名见 assets/js/training.js 的 ICONS 表。
 *  3. 日程与讲义：改 SCHEDULE / DOCS 数组即可，日期确定后替换「以群通知为准」。
 * ================================================================ */

var TRACKS = {
  hw: {
    id: 'hw', name: '硬件赛道', en: 'HARDWARE', accent: '#4fd6ff',
    tagline: '元器件 → 焊接 → PCB → 找方向：动手做出第一块自己的板子',
    stats: { sessions: '第 1–2 次已发讲义' },
    roadmap: [
      { num: '01', title: '认识元器件', sub: '电路基础 · 万用表', anchor: 'cat-basics' },
      { num: '02', title: '练好焊接', sub: '烙铁 · 直插 · 贴片', anchor: 'cat-solder' },
      { num: '03', title: '画出你的板子', sub: '立创EDA · 打板下单', anchor: 'cat-pcb' },
      { num: '04', title: '找到你的方向', sub: '学习思维 · 赛道选择', anchor: 'cat-growth' }
    ],
    roadmapCols: 'cols4',
    raceCta: { href: 'showcase.html#race', title: '想跑智能车？直通竞赛专区', sub: '赛规解析 · 组别介绍 · 往届国赛视频 —— 先看懂比赛，再决定怎么上车' },
    schedule: [
      { name: '硬件第一次培训', topic: '硬件入门与工具使用（详见讲义）', date: '以群通知为准', doc: 'assets/docs/hw-training-1.pdf', owner: '硬件培训负责人', status: 'done', statusText: '讲义已发布' },
      { name: '第二次培训', topic: '进阶内容（详见讲义）', date: '以群通知为准', doc: 'assets/docs/hw-training-2.pdf', owner: '硬件培训负责人', status: 'done', statusText: '讲义已发布' }
    ],
    cats: [
      {
        id: 'basics', name: '入门基础', en: 'BASICS', icon: 'book',
        color: '#4fd6ff', soft: 'rgba(79,214,255,.12)', bd: 'rgba(79,214,255,.45)', sh: 'rgba(79,214,255,.25)',
        desc: '一切的地基：看懂电路、认全元器件、建立数模电路的直觉。原理暂时看不懂没关系，先混个脸熟，动手时自然会明白。',
        items: [
          { id: 'BV1aa411g76U', t: '电子电路入门没你想的那么简（复）单（杂）', d: '用最直白的方式打破「电路很难」的恐惧——先把入门的全貌看一遍，再往下走。', url: 'https://www.bilibili.com/video/BV1aa411g76U', tags: ['电路基础', '零基础'], type: 'video' },
          { id: 'BV1xv4y137LL', t: '【0基础】这些常用元器件，你都认识吗', d: '电阻、电容、二极管……从零开始电子 DIY 第一课，认全你以后天天打交道的元器件。', url: 'https://www.bilibili.com/video/BV1xv4y137LL', tags: ['元器件', '第一课'], type: 'video' },
          { id: 'BV12Z421x72o', t: '极速入门数模电路 P01：开箱认识元器件', d: '配合面包板开箱实操，边看边搭——极速入门系列的第一步。', url: 'https://www.bilibili.com/video/BV12Z421x72o', tags: ['面包板', '实操'], type: 'video' },
          { id: 'BV1LZ421x75m', t: '极速入门数模电路 P02：如何看懂电路图', d: '电路图怎么看、原理图怎么画——从符号到连接关系，一次讲清。', url: 'https://www.bilibili.com/video/BV1LZ421x75m', tags: ['电路图', '原理图'], type: 'video' },
          { id: 'BV1P5e3zGErT', t: '二极管管压降为啥是 0.7V？一个视频讲清 PN 结', d: '工科男孙老师出品：PN 结原理讲得透亮，模电启蒙的首选。', url: 'https://www.bilibili.com/video/BV1P5e3zGErT', tags: ['模电', 'PN结'], type: 'video' },
          { id: 'BV1Hb4BzwE8W', t: '实际的 PN 结长啥样？二极管是如何制造出来的', d: '从原理到实物：看看芯片里的二极管到底长什么样。', url: 'https://www.bilibili.com/video/BV1Hb4BzwE8W', tags: ['半导体', '器件'], type: 'video' },
          { id: 'BV112whefE8f', t: '电容种类那么多！都有什么区别？怎么选？', d: '陶瓷、铝电解、钽电容……选型不再靠感觉。', url: 'https://www.bilibili.com/video/BV112whefE8f', tags: ['电容', '选型'], type: 'video' },
          { id: 'BV12Te86UESM', t: '电路中 0 欧姆电阻有啥用', d: '超形象动画讲透一个新手必问的小问题——顺便理解电路设计的惯用手法。', url: 'https://www.bilibili.com/video/BV12Te86UESM', tags: ['元器件', '进阶'], type: 'video' },
          { id: 'BV1yNNY62EQK', t: '80 分钟入门模拟电路！手把手设计 555 波形电路', d: '嘉立创EDA官方出品：以 555 电路为例把模电入门走一遍。', url: 'https://www.bilibili.com/video/BV1yNNY62EQK', tags: ['模电', '实战'], type: 'video' },
          { id: 'BV1Rj2LBSEq4', t: 'MOS 管发热的隐藏元凶：一个视频讲清米勒平台', d: '工科男孙老师硬核讲解——驱动 MOS 管之前必须懂的一课。', url: 'https://www.bilibili.com/video/BV1Rj2LBSEq4', tags: ['MOS管', '进阶'], type: 'video' }
        ]
      },
      {
        id: 'solder', name: '焊接工艺', en: 'SOLDERING', icon: 'thermo',
        color: '#ff9f43', soft: 'rgba(255,159,67,.12)', bd: 'rgba(255,159,67,.45)', sh: 'rgba(255,159,67,.25)',
        desc: '烙铁是硬件人的第一件兵器：从直插到贴片，练出可靠又漂亮的焊点。记住安全第一，先看规范再上电。',
        items: [
          { id: 'dy7653105325239672185', t: '★社团自制 | 超详细贴片元件焊接教程', d: '济海追风抖音出品：社团学长学姐亲自示范的贴片焊接全流程，跟着社团标准练。', url: 'https://www.douyin.com/video/7653105325239672185', tags: ['社团自制', '贴片'], type: 'video' },
          { id: 'BV1yv41167ky', t: '工具 | 如何使用电烙铁？基础焊接、接线、接件', d: '烙铁持法、给锡时机、接线接件的标准手法——焊前第一课。', url: 'https://www.bilibili.com/video/BV1yv41167ky', tags: ['烙铁', '入门'], type: 'video' },
          { id: 'BV1STqpBqEa5', t: '《焊武帝养成攻略》零基础三分钟精通焊接', d: '低成本快速上手：焊点成型的过程逐帧讲解，新手最容易出成果的一集。', url: 'https://www.bilibili.com/video/BV1STqpBqEa5', tags: ['实操', '速成'], type: 'video' },
          { id: 'BV1wA411q7P2', t: '【电子学会】焊接注意事项', d: '安全规范、常见坏习惯与事故预防——动手之前必看。', url: 'https://www.bilibili.com/video/BV1wA411q7P2', tags: ['安全', '必读'], type: 'video' },
          { id: 'BV15J4119759', t: '一分钟教你热风枪使用规范【硬禾一分钟】', d: '热风枪温度、风量与距离的口诀——拆焊贴片元件的必备技能。', url: 'https://www.bilibili.com/video/BV15J4119759', tags: ['热风枪', '规范'], type: 'video' }
        ]
      },
      {
        id: 'pcb', name: 'PCB 设计', en: 'PCB DESIGN', icon: 'pcb',
        color: '#3f8cff', soft: 'rgba(63,140,255,.13)', bd: 'rgba(63,140,255,.5)', sh: 'rgba(63,140,255,.3)',
        desc: '从屏幕上的一张原理图，到手里摸得着的真实电路板：布局布线的实用技巧，一块模块一块模块地学。',
        items: [
          { id: 'dy7656749166488025338', t: '★社团自制 | 硬件小科普：嘉立创盲埋孔', d: '济海追风抖音出品：智能车板上真的会用到的盲埋孔工艺，社团实战经验。', url: 'https://www.douyin.com/video/7656749166488025338', tags: ['社团自制', '工艺'], type: 'video' },
          { id: 'ph-lceda-intro', t: '立创 EDA 专业版快速上手', d: '工程创建、界面与常用快捷键——社团打板统一使用立创 EDA。', url: 'https://search.bilibili.com/all?keyword=立创EDA专业版入门教程', tags: ['立创EDA', '工具'], type: 'video' },
          { id: 'BV1eUh76HEWn', t: '15 分钟学透 LDO 模块设计（6 个布局布线技巧）', d: '以 LDO 电源模块为例，把布局布线的通用套路一次讲透。', url: 'https://www.bilibili.com/video/BV1eUh76HEWn', tags: ['电源', '布局布线'], type: 'video' },
          { id: 'BV1m6ht6qELt', t: '20 分钟学透 DCDC 模块设计（12 个布局布线技巧）', d: 'DCDC 电源的布局要点更多——功率环、散热、滤波，一集全讲。', url: 'https://www.bilibili.com/video/BV1m6ht6qELt', tags: ['电源', '进阶'], type: 'video' },
          { id: 'BV145hi6tEry', t: '18 分钟手把手设计晶振模块（含布局布线技巧）', d: '晶振这种「娇气」模块怎么摆、怎么走线——单片机板子的关键一课。', url: 'https://www.bilibili.com/video/BV145hi6tEry', tags: ['晶振', '模块'], type: 'video' },
          { id: 'BV12kht6KE8W', t: '20 分钟手把手设计 SD 卡模块（含阻抗计算）', d: '嘉立创EDA官方出品：SD 卡模块 + 阻抗计算，接口类模块的代表作。', url: 'https://www.bilibili.com/video/BV12kht6KE8W', tags: ['接口', '阻抗'], type: 'video' },
          { id: 'BV1G34y1n7Eq', t: '一个实验搞明白 PCB 走线应该画多宽', d: '走线宽度与电流的关系，用实验说话——以后走线不再靠猜。', url: 'https://www.bilibili.com/video/BV1G34y1n7Eq', tags: ['走线', '实验'], type: 'video' },
          { id: 'BV13A411v7Nu', t: '开关电源 PCB 布局 5 大技巧', d: '开关电源布局的五大铁律，避免板子「能跑但发热」。', url: 'https://www.bilibili.com/video/BV13A411v7Nu', tags: ['开关电源', '布局'], type: 'video' },
          { id: 'BV13C6HYsECR', t: '高速 PCB 并不神秘！一起画一块带 DDR4 的开发板', d: '工科男孙老师带画 DDR4 开发板——想挑战高速板的同学看这里。', url: 'https://www.bilibili.com/video/BV13C6HYsECR', tags: ['高速板', 'DDR4'], type: 'video' },
          { id: 'ph-jlc-order', t: '生成 Gerber 与嘉立创下单', d: 'DRC 检查、导出 Gerber、嘉立创打板与选型的完整流程演示。', url: 'https://search.bilibili.com/all?keyword=嘉立创打板下单流程教程', tags: ['打板', '流程'], type: 'video' }
        ]
      },
      {
        id: 'tools', name: '仪器与工具', en: 'INSTRUMENTS', icon: 'tool',
        color: '#94a3b8', soft: 'rgba(148,163,184,.12)', bd: 'rgba(148,163,184,.45)', sh: 'rgba(148,163,184,.28)',
        desc: '实验室的支线技能，但全程都用得上：万用表、示波器、总线与协议，还有进实验室前必看的安全规范。',
        items: [
          { id: 'BV1mu411L7UJ', t: '万用表不会用？老师傅教你每个档的测量方法', d: '电压、电流、电阻、通断每个档怎么用——0 基础也能快速学会。', url: 'https://www.bilibili.com/video/BV1mu411L7UJ', tags: ['万用表', '必会'], type: 'video' },
          { id: 'BV1K44y147LK', t: '示波器那么重要，你确定不进来看看？', d: '为什么要用示波器、怎么开始用——调试电路的「眼睛」入门。', url: 'https://www.bilibili.com/video/BV1K44y147LK', tags: ['示波器', '入门'], type: 'video' },
          { id: 'BV1wwtz6pE9q', t: '为什么做控制要学这么多总线？它们有什么区别', d: '工科男孙老师：UART/CAN/SPI 等总线的区别与选用——做控制系统绕不开的一课。', url: 'https://www.bilibili.com/video/BV1wwtz6pE9q', tags: ['总线', '控制'], type: 'video' },
          { id: 'BV1Swgf6GEaJ', t: '每个硬件协议 10 分钟简单解释', d: 'UART、I2C、SPI 等常见协议的直观对比——抓波形、调通信前先看它。', url: 'https://www.bilibili.com/video/BV1Swgf6GEaJ', tags: ['通信协议', '调试'], type: 'video' },
          { id: 'BV15TuP64EsW', t: '16 通道 200MHz 成本 40 元：开源逻辑分析仪', d: '嘉立创EDA官方开源项目——自己做一个逻辑分析仪，顺便学会用它。', url: 'https://www.bilibili.com/video/BV15TuP64EsW', tags: ['逻辑分析仪', '开源'], type: 'video' },
          { id: 'ph-lab-safety', t: '实验室安全规范', d: '用电安全、烙铁摆放与应急处置——进入实验室前必看。', url: 'https://search.bilibili.com/all?keyword=电子实验室 安全用电规范', tags: ['安全', '必读'], type: 'video' }
        ]
      },
      {
        id: 'growth', name: '学习思维与成长', en: 'GROWTH', icon: 'compass',
        color: '#34d399', soft: 'rgba(52,211,153,.12)', bd: 'rgba(52,211,153,.5)', sh: 'rgba(52,211,153,.3)',
        desc: '比多看十个视频更重要的事：怎么自学、怎么选方向——以及跟着开源项目动手，把技能串起来。',
        items: [
          { id: 'BV1r9Lh6hEEQ', t: '★社团自制 | 沉浸式体验济海追风硬件的一天', d: '社团B站官方号出品的 Vlog：看看学长学姐在实验室的一天是怎么过的。', url: 'https://www.bilibili.com/video/BV1r9Lh6hEEQ', tags: ['社团自制', '实验室日常'], type: 'video' },
          { id: 'BV1k3411W7qx', t: '新手如何入门硬件：一本正经的电子电路入门', d: '硬件学习路线的全景地图：先学什么、后学什么、坑在哪里。', url: 'https://www.bilibili.com/video/BV1k3411W7qx', tags: ['学习路线', '必读'], type: 'video' },
          { id: 'BV1n34y1k7Y8', t: 'C 语言程序设计基础入门（千锋新版）', d: '硬件迟早要写代码——C 语言是单片机和智能车开发的通用语言。', url: 'https://www.bilibili.com/video/BV1n34y1k7Y8', tags: ['C语言', '编程'], type: 'video' },
          { id: 'BV1th411z7sn', t: 'STM32 入门教程 2023 版（细致讲解）', d: '进阶方向之一：主流单片机系统的入门系列，配最小系统板食用更佳。', url: 'https://www.bilibili.com/video/BV1th411z7sn', tags: ['STM32', '进阶'], type: 'video' },
          { id: 'BV1mnuMzVEvB', t: 'PID 算法还是 AI 模型？搞清机器狗行走的秘密', d: '工科男孙老师：控制算法的思维入门——智能车速控背后的东西。', url: 'https://www.bilibili.com/video/BV1mnuMzVEvB', tags: ['PID', '控制思维'], type: 'video' },
          { id: 'BV1D4876kETB', t: '用一块免费 PCB 做了个 140W 快充（已开源）', d: '嘉立创EDA官方实战项目：从原理图到成品——完整走一遍 PCB 项目流程。', url: 'https://www.bilibili.com/video/BV1D4876kETB', tags: ['开源项目', '实战'], type: 'video' },
          { id: 'BV1hEdBY6EPM', t: '【开源】墨水屏桌面备忘录', d: '照着一个完整开源项目做一遍：原理图、固件、外壳全流程——进步最快的路径。', url: 'https://www.bilibili.com/video/BV1hEdBY6EPM', tags: ['开源项目', '实战'], type: 'video' },
          { id: 'ph-datasheet', t: '手把手教你读数据手册', d: '芯片手册几十页从哪看起：参数表、典型应用电路、时序图——工程师的「说明书阅读法」。', url: 'https://search.bilibili.com/all?keyword=数据手册 datasheet 阅读教程', tags: ['Datasheet', '核心技能'], type: 'video' }
        ]
      },
      {
        id: 'race', name: '智能车竞赛专区', en: 'SMART CAR RACE', icon: 'flag', featured: true, scope: 'showcase',
        color: '#ff5c5c', soft: 'rgba(255,92,92,.1)', bd: 'rgba(255,92,92,.5)', sh: 'rgba(255,92,92,.3)',
        desc: '济海追风的主战场：全国大学生智能汽车竞赛。先看懂赛规和组别，再看技术方案——想要实录请移步下方专区。',
        items: [
          { id: 'BV1S5Q6BdEiL', t: '★社团自制 | 开箱测评：智能车选手值得尝试的轻量 3D 打印耗材', d: '社团B站官方号出品：实车验证的耗材推荐，做车壳结构件前先看。', url: 'https://www.bilibili.com/video/BV1S5Q6BdEiL', tags: ['社团自制', '测评'], type: 'video' },
          { id: 'ph-race-rules', t: '赛事总览与赛规解读', d: '全国大学生智能汽车竞赛怎么玩：报名流程、赛程节点、规则要点与晋级机制一次讲清。', url: 'https://search.bilibili.com/all?keyword=全国大学生智能汽车竞赛 规则解读', tags: ['赛规', '必读'], type: 'video' },
          { id: 'ph-race-groups', t: '组别全解析：摄像头 · 电磁 · 智能视觉', d: '各组别的任务、技术门槛和难度差异，帮你选到最适合自己的组别。', url: 'https://search.bilibili.com/all?keyword=智能汽车竞赛 组别介绍', tags: ['组别', '选组'], type: 'video' },
          { id: 'ph-race-nationals', t: '往届国赛现场 · 高光比赛视频', d: '发车、超车、冲刺！看看全国顶尖车队的现场表现，先感受一下比赛的氛围。', url: 'https://search.bilibili.com/all?keyword=全国大学生智能汽车竞赛 国赛现场', tags: ['比赛视频', '氛围感'], type: 'video' },
          { id: 'BV1Ki4y127kK', t: '智能车电磁寻迹相关知识讲解', d: '电磁组的原理核心：传感器排布、信号处理与循迹算法思路。', url: 'https://www.bilibili.com/video/BV1Ki4y127kK', tags: ['电磁组', '循迹'], type: 'video' },
          { id: 'BV14s23BZEhb', t: '20 届智能车缩微电磁组代码分享', d: '往届参赛队的真实代码——看看一辆能跑的电磁车程序长什么样。', url: 'https://www.bilibili.com/video/BV14s23BZEhb', tags: ['电磁组', '代码'], type: 'video' },
          { id: 'BV1B2421M7f6', t: '了解无刷直流电动机：无刷电机 & 电调 & PWM', d: '车模动力的底层原理：无刷电机怎么转起来、电调怎么驱动。', url: 'https://www.bilibili.com/video/BV1B2421M7f6', tags: ['电机', '驱动'], type: 'video' },
          { id: 'BV1FyvaBjE9q', t: 'FOC 控制最核心的两个公式？只不过是力的合成', d: '工科男孙老师：FOC 的物理直觉——电控进阶的敲门砖。', url: 'https://www.bilibili.com/video/BV1FyvaBjE9q', tags: ['FOC', '电控'], type: 'video' },
          { id: 'BV1YJ4m1J7tn', t: '新手入门向：无感无刷驱动方案分享', d: '进阶驱动方案直播切片——想深入电调设计的同学看这里。', url: 'https://www.bilibili.com/video/BV1YJ4m1J7tn', tags: ['驱动', '进阶'], type: 'video' },
          { id: 'ph-tech-report', t: '技术报告撰写与答辩准备', d: '比赛不只比谁跑得快：技术报告的结构、图表规范和现场答辩技巧。', url: 'https://search.bilibili.com/all?keyword=智能汽车竞赛 技术报告 答辩', tags: ['报告', '答辩'], type: 'video' }
        ]
      },
      {
        id: 'live', name: '济海追风比赛实录', en: 'RACE RECORDS', icon: 'video', featured: true, scope: 'showcase',
        color: '#fbbf24', soft: 'rgba(251,191,36,.1)', bd: 'rgba(251,191,36,.5)', sh: 'rgba(251,191,36,.3)',
        desc: '来自社团抖音号「HEU济海追风」的赛场第一视角：发车、冲线、领奖——各战队在东北赛区与全国总决赛上的真实记录。（抖音网页版可能提示登录，手机端打开体验更佳）',
        items: [
          { id: 'dy7677174780085697381', t: '第21届国赛 · 六队 飞檐走壁 全国一等奖比赛实录', d: '哈尔滨工程大学济海追风六队在全国总决赛的完整实录——全国一等奖的现场。', url: 'https://www.douyin.com/video/7677174780085697381', tags: ['国赛', '一等奖'], type: 'video' },
          { id: 'dy7668270591556120165', t: '东北赛区 · 一队 飞跃雷区 冠军实录', d: '飞跃雷区组东北冠军的发车实录——这支队伍最终拿下全国亚军。', url: 'https://www.douyin.com/video/7668270591556120165', tags: ['东北赛区', '冠军'], type: 'video' },
          { id: 'dy7668603429891399781', t: '东北赛区 · 六队 飞檐走壁 亚军决赛实录', d: '飞檐走壁组决赛现场——爬壁、过弯、冲刺的完整记录。', url: 'https://www.douyin.com/video/7668603429891399781', tags: ['东北赛区', '决赛'], type: 'video' },
          { id: 'dy7668656043853402851', t: '东北赛区 · 二队 轮腿穿越 亚军科目一实录', d: '轮腿穿越组科目一：越障与稳定性的考验。', url: 'https://www.douyin.com/video/7668656043853402851', tags: ['轮腿穿越', '科目一'], type: 'video' },
          { id: 'dy7668605438448351333', t: '东北赛区 · 二队 轮腿穿越 亚军科目三实录', d: '轮腿穿越组科目三：速度与通过性的比拼。', url: 'https://www.douyin.com/video/7668605438448351333', tags: ['轮腿穿越', '科目三'], type: 'video' },
          { id: 'dy7668651831132583397', t: '东北赛区 · 八队 卡丁快跑 冠军科目三实录', d: '卡丁快跑组东北冠军——看看「跑得最快」的车什么水平。', url: 'https://www.douyin.com/video/7668651831132583397', tags: ['卡丁快跑', '冠军'], type: 'video' },
          { id: 'dy7655179194687238577', t: '沉浸式体验智能车 er 的备赛心路历程', d: '从实验室到赛场：备赛日常与嘉立创 SMT 打样的真实记录。', url: 'https://www.douyin.com/video/7655179194687238577', tags: ['备赛', '日常'], type: 'video' },
          { id: 'dy7633011996925215080', t: '电调暴力测试', d: '社团实验室名场面：电调极限测试——硬件人的浪漫。', url: 'https://www.douyin.com/video/7633011996925215080', tags: ['实验室', '测试'], type: 'video' },
          { id: 'dy7621940095381518457', t: '实验室爆改 P 房说是', d: '车队维修区（P House）爆改记录——比赛幕后同样精彩。', url: 'https://www.douyin.com/video/7621940095381518457', tags: ['幕后', 'P房'], type: 'video' }
        ]
      }
    ]
  },

  sw: {
    id: 'sw', name: '软件赛道', en: 'SOFTWARE', accent: '#34d399',
    tagline: 'CH32V307 + MounRiver II：五次培训，从点灯到图像识别',
    stats: { sessions: '共 5 次培训 · 每次含考核' },
    roadmap: [
      { num: 'S1', title: '嵌入式软件开发入门', sub: 'C 语言 · 逐飞库 · GPIO / PWM / 中断' },
      { num: 'S2', title: '持久化菜单与简单阻塞按键', sub: 'Flash 存储 · 菜单系统 · 按键交互' },
      { num: 'S3', title: '惯性测量单元与姿态解算', sub: 'IMU 读取 · 滤波 · 姿态解算' },
      { num: 'S4', title: '电机闭环控制', sub: '编码器 · PID · 闭环调速' },
      { num: 'S5', title: '嵌入式数字图像处理入门', sub: '摄像头 · 图像采集与处理' }
    ],
    roadmapCols: '',
    raceCta: null,
    schedule: [
      { name: '第一次培训', topic: '嵌入式软件开发入门', date: '以群通知为准', doc: 'assets/docs/sw-training-1.pdf', owner: '李政熙', status: 'done', statusText: '讲义已发布', exam: '呼吸灯（基础）/ 呼吸闪烁交替（提高）· 考核周期 1 周' },
      { name: '第二次培训', topic: '持久化菜单与简单阻塞按键', date: '以群通知为准', doc: null, owner: '待公布', status: 'wait', statusText: '待开始', exam: '现场演示验收 · 考核周期 1 周' },
      { name: '第三次培训', topic: '惯性测量单元与姿态解算', date: '以群通知为准', doc: null, owner: '待公布', status: 'wait', statusText: '待开始', exam: '现场演示验收 · 考核周期 1 周' },
      { name: '第四次培训', topic: '电机闭环控制', date: '以群通知为准', doc: null, owner: '待公布', status: 'wait', statusText: '待开始', exam: '现场演示验收 · 考核周期 1 周' },
      { name: '第五次培训', topic: '嵌入式数字图像处理入门', date: '以群通知为准', doc: null, owner: '待公布', status: 'wait', statusText: '待开始', exam: '现场演示验收 · 考核周期 2 周' }
    ],
    cats: [
      {
        id: 'pc', name: '电脑使用入门', en: 'COMPUTER BASICS', icon: 'cpu',
        color: '#94a3b8', soft: 'rgba(148,163,184,.12)', bd: 'rgba(148,163,184,.45)', sh: 'rgba(148,163,184,.28)',
        desc: '不少同学是上大学才第一次真正接触电脑，这很正常——先把电脑用顺手，再谈写代码。',
        items: [
          { id: 'b23-xveUC5c', t: 'Win11 开荒指南（新电脑怎么设置）', d: '新买的笔记本怎么做初始设置、装软件、避开常见坑。', url: 'https://b23.tv/xveUC5c', tags: ['Win11', '新电脑'], type: 'video' },
          { id: 'b23-SZe9C20', t: 'Windows 系统 0 基础教程（从开关机学起）', d: '完全没接触过电脑也能看懂。', url: 'https://b23.tv/SZe9C20', tags: ['Windows', '零基础'], type: 'video' },
          { id: 'av301526650', t: '【准大一电脑小白】七天入门电脑基础知识', d: '专为准大学生做的系列教程。', url: 'https://www.bilibili.com/video/av301526650', tags: ['系列课', '零基础'], type: 'video' }
        ]
      },
      {
        id: 'course', name: '课程与教程', en: 'COURSES', icon: 'book',
        color: '#4fd6ff', soft: 'rgba(79,214,255,.12)', bd: 'rgba(79,214,255,.45)', sh: 'rgba(79,214,255,.25)',
        desc: '系统学 C 语言与计算机基础的主干教程：图文速查打基础，视频课成体系，配合培训进度食用。',
        items: [
          { id: 'runoob', t: '菜鸟教程', d: 'C 语言等各语言的语法速查，中文、免费、上手快。', url: 'https://www.runoob.com/', tags: ['C语言', '速查'], type: 'site' },
          { id: 'liaoxuefeng', t: '廖雪峰的官方网站', d: 'Python、Git、JavaScript 等经典中文教程。', url: 'https://www.liaoxuefeng.com/', tags: ['Git', 'Python'], type: 'site' },
          { id: 'icourse163', t: '中国大学 MOOC', d: '名校的系统课程。', url: 'https://www.icourse163.org/', tags: ['系统课程'], type: 'site' },
          { id: 'BV1mP4y187SM', t: '智能车制作开题导论', d: '系列课：通过它简单了解智能车制作的全貌。', url: 'https://www.bilibili.com/video/BV1mP4y187SM', tags: ['智能车', '导论'], type: 'video' },
          { id: 'BV1Xa4y1k7LU', t: '黑马程序员 C 语言零基础入门到精通', d: 'C 语言全套视频教程，零基础可看。', url: 'https://www.bilibili.com/video/BV1Xa4y1k7LU', tags: ['C语言', '全套'], type: 'video' }
        ]
      },
      {
        id: 'toolchain', name: '工程工具与进阶路线', en: 'TOOLCHAIN', icon: 'git',
        color: '#a78bfa', soft: 'rgba(167,139,250,.12)', bd: 'rgba(167,139,250,.5)', sh: 'rgba(167,139,250,.3)',
        desc: '代码放哪、路线怎么走：托管平台与系统化自学地图，做之前先看看有没有现成轮子。',
        items: [
          { id: 'github', t: 'GitHub', d: '全球最大的开源平台，看别人的代码、找现成的方案。', url: 'https://github.com/', tags: ['开源', '仓库'], type: 'site' },
          { id: 'gitee', t: 'Gitee', d: '国内的代码托管平台，访问更快。实验室公共仓库也在这里。', url: 'https://gitee.com/', tags: ['国内', '仓库'], type: 'site' },
          { id: 'lab-repo', t: '济海追风实验室公共仓库（Gitee）', d: '社团 19/20/21 届各组别的工程代码归档，入队后可参考学习。', url: 'https://gitee.com/WL2002/ji_hai_zhui_feng', tags: ['社团仓库', '参考代码'], type: 'site' },
          { id: 'csdiy', t: '计算机自学指南（CSDIY）', d: '系统化的计算机自学路线图，开源、持续更新。', url: 'https://csdiy.wiki/', tags: ['自学路线', '开源'], type: 'site' },
          { id: 'missing-semester', t: '计算机教育中缺失的一课', d: 'MIT 经典课程中文版：命令行、Git、编辑器、脚本——学校不教但必备。', url: 'https://missing-semester-cn.github.io/', tags: ['MIT', '工程技能'], type: 'site' }
        ]
      },
      {
        id: 'oj', name: '刷题与算法', en: 'PRACTICE', icon: 'trophy',
        color: '#fbbf24', soft: 'rgba(251,191,36,.12)', bd: 'rgba(251,191,36,.5)', sh: 'rgba(251,191,36,.3)',
        desc: '学完语法后的练兵场：把「会写」练成「写得好」。',
        items: [
          { id: 'luogu', t: '洛谷', d: '算法竞赛入门刷题。', url: 'https://www.luogu.com.cn/', tags: ['算法', '入门'], type: 'site' },
          { id: 'leetcode', t: 'LeetCode', d: '算法与面试刷题。', url: 'https://leetcode.cn/', tags: ['算法', '面试'], type: 'site' }
        ]
      },
      {
        id: 'community', name: '问答与社区', en: 'COMMUNITY', icon: 'chat',
        color: '#f472b6', soft: 'rgba(244,114,182,.12)', bd: 'rgba(244,114,182,.5)', sh: 'rgba(244,114,182,.3)',
        desc: '卡住了去哪里问：遇到问题、报错、查不到资料，这些社区都搜得到前人踩过的坑。',
        items: [
          { id: 'csdn', t: 'CSDN', d: '中文技术博客，遇到具体问题优先搜这里。', url: 'https://www.csdn.net/', tags: ['博客', '中文'], type: 'site' },
          { id: 'stackoverflow', t: 'Stack Overflow', d: '全球最大的编程问答社区（英文）。', url: 'https://stackoverflow.com/', tags: ['问答', '英文'], type: 'site' },
          { id: 'juejin', t: '稀土掘金', d: '中文技术社区，文章质量不错。', url: 'https://juejin.cn/', tags: ['社区', '中文'], type: 'site' },
          { id: 'bilibili', t: 'B站', d: '搜「CH32V307」「智能车」「C 语言」，有大量视频教程。', url: 'https://www.bilibili.com/', tags: ['视频', '搜索'], type: 'site' },
          { id: 'zhihu', t: '知乎', d: '深度经验分享和踩坑总结。', url: 'https://www.zhihu.com/', tags: ['经验', '问答'], type: 'site' }
        ]
      },
      {
        id: 'ai', name: 'AI 工具', en: 'AI TOOLS', icon: 'spark',
        color: '#ff9f43', soft: 'rgba(255,159,67,.12)', bd: 'rgba(255,159,67,.45)', sh: 'rgba(255,159,67,.25)',
        desc: '把 AI 当成随时可问、不知疲倦的助教——但记住培训第一讲反复强调的：带着判断力去用。',
        items: [
          { id: 'chatgpt', t: 'ChatGPT', d: 'OpenAI 的对话助手。', url: 'https://chatgpt.com/', tags: ['AI 助手'], type: 'site' },
          { id: 'claude', t: 'Claude', d: 'Anthropic 的对话助手，长文与代码能力强。', url: 'https://claude.ai/', tags: ['AI 助手'], type: 'site' },
          { id: 'gemini', t: 'Gemini', d: 'Google 的对话助手。', url: 'https://gemini.google.com/', tags: ['AI 助手'], type: 'site' },
          { id: 'deepseek', t: 'DeepSeek', d: '深度求索，国产开源系对话助手。', url: 'https://chat.deepseek.com/', tags: ['AI 助手', '国产'], type: 'site' },
          { id: 'glm', t: 'GLM（智谱清言）', d: '智谱 AI 的对话助手。', url: 'https://chatglm.cn/', tags: ['AI 助手', '国产'], type: 'site' },
          { id: 'kimi', t: 'Kimi', d: '月之暗面出品，长文本处理能力突出。', url: 'https://kimi.moonshot.cn/', tags: ['AI 助手', '国产'], type: 'site' },
          { id: 'yiyan', t: '文心一言', d: '百度的对话助手。', url: 'https://yiyan.baidu.com/', tags: ['AI 助手', '国产'], type: 'site' },
          { id: 'tongyi', t: '通义千问', d: '阿里的对话助手。', url: 'https://tongyi.aliyun.com/', tags: ['AI 助手', '国产'], type: 'site' },
          { id: 'doubao', t: '豆包', d: '字节的对话助手。', url: 'https://www.doubao.com/', tags: ['AI 助手', '国产'], type: 'site' },
          { id: 'arena-leaderboard', t: '大模型 Agent 榜单', d: '想比较各模型当下的实力、选一个顺手的，参考这个榜单。', url: 'https://arena.ai/leaderboard/agent', tags: ['榜单', '选型'], type: 'site' },
          { id: 'smart-questions', t: '提问的智慧（中文翻译版）', d: '想让提问更高效，读一遍这篇经典——学会怎么问，AI 和人都更愿意帮你。', url: 'https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way', tags: ['提问方法', '必读'], type: 'site' }
        ]
      }
    ]
  }
};

/* 讲义中心（两条赛道共用） */
var DOCS = [
  {
    id: 'sw-training-1', track: 'sw', name: '软件第一次培训讲义',
    file: 'assets/docs/sw-training-1.pdf',
    desc: '嵌入式软件开发入门：AI 时代为什么学编程、C 语言入门、逐飞 CH32V307 库、GPIO / PWM / 中断，与呼吸灯考核任务。',
    meta: 'PDF · 24 页'
  },
  {
    id: 'hw-training-1', track: 'hw', name: '硬件第一次培训讲义（2026）',
    file: 'assets/docs/hw-training-1.pdf',
    desc: '硬件赛道第一次培训讲义，由培训 PPT 转换而来。',
    meta: 'PDF · 由 PPTX 转换'
  },
  {
    id: 'hw-training-2', track: 'hw', name: '济海追风第二次培训讲义',
    file: 'assets/docs/hw-training-2.pdf',
    desc: '第二次培训讲义，由培训 PPT 转换而来。',
    meta: 'PDF · 由 PPTX 转换'
  }
];

/* 术语速查（取自软件第一次培训讲义名词解释，维护时按需增补） */
var GLOSSARY = [
  { t: '嵌入式系统', d: '藏在设备内部、专门干一件事的计算机：功能专一、软硬件可裁剪，对功耗/体积/成本/实时性有严格约束。' },
  { t: '单片机（MCU）', d: '一块芯片里集成了 CPU、内存和外设，是智能车的「大脑」。' },
  { t: '开发板 / 核心板', d: '把单片机做成方便插线、烧程序的板子。' },
  { t: '烧录', d: '把编译好的程序「灌」进单片机。' },
  { t: '固件', d: '编译的产物，也就是要烧进芯片的那个文件。' },
  { t: '外设', d: '芯片上除 CPU 之外的功能模块，比如 GPIO、串口、定时器。' },
  { t: '寄存器', d: '单片机里「一个地址对应一个开关」的东西，软件控制硬件全靠它。' },
  { t: '使能时钟', d: '外设默认处于「断电」状态，要先打开它的时钟开关，它才会开始工作。' },
  { t: '引脚复用（AFIO）', d: '同一个引脚可以承担多种功能，按需要切换成 GPIO、串口或定时器的引脚。' },
  { t: 'GPIO', d: '通用输入输出口，软件可以直接控制引脚的电平高低。' },
  { t: '引脚 / 电平', d: '引脚是芯片伸出来的「脚」；电平就是它上面的电压高低，用高电平（1）和低电平（0）表示。' },
  { t: '推挽输出 / 上拉、下拉输入', d: 'GPIO 的几种工作模式——推挽输出能主动把引脚拉高或拉低；上拉/下拉输入在引脚没接信号时给它一个确定的默认电平。' },
  { t: '阻塞延时', d: '让 CPU 原地空等指定时间，这期间它什么别的活都干不了。' },
  { t: 'PWM（脉宽调制）', d: '让引脚高频快速开关，用高电平所占的比例来等效出不同的平均电压 / 亮度。' },
  { t: '占空比 / 频率 / 周期', d: '占空比是一个周期里高电平所占的比例；频率是每秒完成的周期数；周期是一个完整波形的时间长度。' },
  { t: '硬件 PWM / 定时器', d: '由定时器这个外设自动产生 PWM 波形，不占用 CPU 的时间。' },
  { t: '中断 / 中断服务函数', d: '有事发生时「打断」主循环去处理的机制；被跳转去执行的那段代码，就叫中断服务函数。' },
  { t: '上升沿 / 下降沿 / 双边沿', d: '引脚电平「由低变高 / 由高变低 / 任意变化」的那一刻，用作中断的触发条件。' },
  { t: 'SDK', d: '芯片厂商提供的官方底层代码库。' },
  { t: 'IDE（集成开发环境）', d: '写代码 + 编译 + 烧录，都在同一个软件里完成。我们用 MounRiver Studio 2（山河）。' },
  { t: '编译器 / 调试器', d: 'IDE 里的两个部件——编译器把代码翻译成芯片能执行的形式，调试器让你能单步运行、查看变量的值。' },
  { t: '工程 / 项目（.wvproj）', d: '一整套代码的集合。.wvproj 是 MounRiver 的工程文件，双击它就能打开整个工程。' },
  { t: '重新编译', d: '把全部文件重新编一遍，确保都是最新的（只编译改过的文件叫「编译」）。' },
  { t: '总头文件 zf_common_headfile.h', d: '逐飞把库里所有头文件汇总成的唯一入口，只 #include 它一个就能用全库。' },
  { t: '驱动 / 封装 / 分层', d: '驱动是直接操作硬件的代码；封装是把复杂的底层操作包成好用的函数；分层是把它们按「底层 → 上层」组织起来。' },
  { t: '引脚编号（E2、A8…）', d: '引脚的「名字」——字母代表引脚组，数字是组内编号，具体见工程里的《智能车推荐引脚分配》。' },
  { t: '传感器 / 控制器 / 执行器', d: '智能车的「感知 / 思考 / 动作」三段结构——把物理量变成电信号、算出控制量、再驱动机械动作。' }
];

/* 考核专区（随培训进度增补；口径以讲义与群通知为准） */
var EXAMS = [
  {
    session: '软件 · 第一次培训', title: '基础任务：呼吸灯',
    points: [
      'LED 周期性往复变化：从亮到暗、从暗到亮；',
      '变化过程没有可感知的跳变或频闪；',
      '呼吸周期不作硬性规定，自己调到自然即可。'
    ],
    bonus: '用定时器硬件 PWM 实现者，验收时予以加分肯定。',
    ref: '例程：E01_gpio_demo（软件方式）/ E04_pwm_demo（硬件 PWM）',
    owner: '李政熙', period: '考核周期 1 周', status: 'open'
  },
  {
    session: '软件 · 第一次培训', title: '提高任务：呼吸与闪烁交替',
    points: [
      '一个呼吸周期后接一个闪烁周期，交替循环；',
      '闪烁每 0.5 秒切换一次亮暗，一轮「亮→暗」×3 共 3 秒；',
      '考察点：程序运行状态的描述与切换组织能力。'
    ],
    bonus: null,
    ref: '例程：E01_gpio_demo（闪烁）＋ E04_pwm_demo（呼吸）组合',
    owner: '李政熙', period: '考核周期 1 周', status: 'open'
  }
];
