/* ================================================================
 * 培训中心逻辑（v0.4 拆页版）
 * 页面模式由 <body data-track="sw|hw|hub"> 决定：
 *  - hub：只渲染全站统计与讲义中心（training.html）；
 *  - sw / hw：渲染该赛道的路线/日程/资源库（+sw 的考核与术语）。
 * 数据来自 data/training-data.js（TRACKS / DOCS / GLOSSARY / EXAMS）。
 * 交互：分类筛选 / 搜索 / 学习打卡（localStorage，键=赛道:稳定ID）。
 * 设计要点（继承旧版修复）：
 *  - 筛选与搜索用 hide 类切换显隐，不重建 DOM → 锚点始终有效；
 *  - 打卡切换只更新当前卡片与进度文本，不整页重渲染 → 焦点不丢失；
 *  - 按钮文案随资源类型；统计排除「占位」条目。
 * ================================================================ */
(function () {
  'use strict';

  var ICONS = {
    book:    '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
    thermo:  '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
    pcb:     '<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8" cy="9" r="1.7"/><circle cx="15.5" cy="14.8" r="1.7"/><path d="M8 10.7v3.6h5.5M15.5 13V8.2h-4.2"/>',
    cpu:     '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1.5v3M15 1.5v3M9 19.5v3M15 19.5v3M20.5 9h3M20.5 15h3M.5 9h3M.5 15h3"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    flag:    '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    video:   '<rect x="2" y="6.5" width="13" height="11" rx="2"/><path d="M15 10.5l7-3.5v10l-7-3.5"/>',
    tool:    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    git:     '<circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="8" r="2.4"/><path d="M6 8.4v7.2M8.4 6.6c4 .3 7.2 1 9.2 2.6M18 10.4c0 4-3 6.4-8 6.9"/>',
    trophy:  '<path d="M8 21h8M12 17v4M17 5h3v3a5 5 0 0 1-5 5M7 5H4v3a5 5 0 0 0 5 5M7 3h10v8a5 5 0 0 1-10 0z"/>',
    chat:    '<path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.7A8 8 0 1 1 21 12z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>',
    spark:   '<path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7z"/><path d="M19 15l.9 2.6L22 18.5l-2.1.9L19 22l-.9-2.6L16 18.5l2.1-.9z"/>',
    doc:     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>'
  };
  function svg(p) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }

  var $ = function (s) { return document.querySelector(s); };
  var isPlaceholder = function (u) { return u.indexOf('search.bilibili.com') > -1; };
  function platform(u, type) {
    if (type === 'site') return '网站 / 工具';
    if (u.indexOf('b23.tv') > -1 || u.indexOf('bilibili.com') > -1) return 'B站视频';
    if (u.indexOf('douyin.com') > -1) return '抖音视频';
    if (/\.pdf($|\?)/i.test(u)) return 'PDF 资料';
    return '在线资源';
  }
  function goLabel(type) {
    return type === 'site' ? '访问网站' : type === 'doc' ? '查看资料' : '观看视频';
  }

  var TRACK = document.body.getAttribute('data-track') || 'hub';

  /* ---- 打卡存储：键 = 赛道:稳定ID ---- */
  var store = {
    key: 'jhzf_site_done_v1',
    get: function () { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
    set: function (a) { localStorage.setItem(this.key, JSON.stringify(a)); }
  };
  var done = new Set(store.get());
  var state = { cat: 'all', q: '' };

  /* ---- 顶部统计（排除占位条目） ---- */
  function renderGlobalStats() {
    var el = $('#globalStats');
    if (!el) return;
    var total = 0, real = 0;
    ['sw', 'hw'].forEach(function (k) {
      TRACKS[k].cats.forEach(function (c) {
        c.items.forEach(function (it) { total++; if (!isPlaceholder(it.url)) real++; });
      });
    });
    el.innerHTML =
      '<div><b>2</b><span>培训赛道</span></div>' +
      '<div><b>' + real + '</b><span>精选资源（另有 ' + (total - real) + ' 条占位待补）</span></div>' +
      '<div><b>' + DOCS.length + '</b><span>培训讲义</span></div>';
  }

  /* ---- 学习路线 ---- */
  function renderRoadmap() {
    var box = $('#roadmap');
    if (!box) return;
    var t = TRACKS[TRACK];
    var steps = t.roadmap.map(function (s) {
      var inner = '<span class="num">' + s.num + '</span><b>' + s.title + '</b><span>' + s.sub + '</span>';
      return '<li>' + (s.anchor ? '<a href="#' + s.anchor + '">' + inner + '</a>' : '<div class="step">' + inner + '</div>') + '</li>';
    }).join('');
    var cta = t.raceCta ?
      '<a class="quick-card tilt" href="' + (t.raceCta.href || '#' + t.raceCta.anchor) + '" style="--ac:#ff5c5c;margin-top:16px">' +
      '<b>🏁 ' + t.raceCta.title + '</b><span>' + t.raceCta.sub + '</span></a>' : '';
    box.innerHTML =
      '<div class="sec-head"><h2><small>LEARNING PATH</small>' + t.name + ' · 学习路线</h2>' +
      '<p class="tip">' + (t.id === 'hw'
        ? '前三步练好硬件基本功，第四步帮你找到自己的方向；「仪器与工具」是全程支线。'
        : '五次培训层层递进，每次培训后都有考核任务；配套资源在下方资源库。') + '</p></div>' +
      '<ol class="steps ' + (t.roadmapCols || '') + '">' + steps + '</ol>' + cta;
  }

  /* ---- 培训日程 ---- */
  function renderSchedule() {
    var box = $('#schedule');
    if (!box) return;
    var t = TRACKS[TRACK];
    var rows = t.schedule.map(function (s) {
      return '<tr>' +
        '<td><b>' + s.name + '</b></td>' +
        '<td>' + s.topic + '</td>' +
        '<td>' + s.date + '</td>' +
        '<td>' + (s.doc ? '<a class="doc-link" href="' + s.doc + '" target="_blank" rel="noopener">讲义 PDF ↗</a>' : '—') + '</td>' +
        '<td>' + (s.exam || '—') + '</td>' +
        '<td>' + s.owner + '</td>' +
        '<td><span class="tag-status ' + s.status + '">' + s.statusText + '</span></td>' +
        '</tr>';
    }).join('');
    box.innerHTML =
      '<div class="sec-head"><h2><small>SCHEDULE</small>培训日程与考核</h2>' +
      '<p class="tip">具体时间以招新 QQ 群通知为准；考核在一次培训周期内随时可找学长验收。</p></div>' +
      '<div class="sched-wrap"><table class="sched"><thead><tr>' +
      '<th>场次</th><th>主题</th><th>时间</th><th>讲义</th><th>考核</th><th>负责人</th><th>状态</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  /* ---- 讲义中心（按容器存在与否渲染） ---- */
  function renderDocs() {
    var box = $('#docs');
    if (!box) return;
    box.innerHTML = DOCS.map(function (d) {
      var tname = TRACKS[d.track].name;
      return '<article class="doc-card rv">' +
        '<span class="dc-ico">' + svg(ICONS.doc) + '</span>' +
        '<b>' + d.name + '</b>' +
        '<span>' + d.desc + '</span>' +
        '<span style="color:#7cc4ff;font-size:12px">' + tname + ' · ' + d.meta + '</span>' +
        '<span class="doc-actions">' +
        '<a class="view" href="' + d.file + '" target="_blank" rel="noopener">在线预览</a>' +
        '<a class="dl" href="' + d.file + '" download="' + d.name + '.pdf">下载</a>' +
        '</span></article>';
    }).join('');
    observeRv(box);
  }

  /* ---- 资源卡片墙 ---- */
  function cardHTML(cat, item, trackId) {
    var key = trackId + ':' + item.id;
    var isDone = done.has(key);
    var ph = isPlaceholder(item.url);
    return '<article class="vcard rv' + (isDone ? ' done' : '') + '" data-key="' + key + '" data-search="' +
      (item.t + item.d + (item.tags || []).join() + cat.name).toLowerCase().replace(/"/g, '&quot;') + '"' +
      ' style="--ac:' + cat.color + ';--ac-soft:' + cat.soft + ';--ac-bd:' + cat.bd + ';--ac-sh:' + cat.sh + '">' +
      '<div class="v-top"><span class="v-ico">' + svg(ICONS[cat.icon] || ICONS.book) + '</span>' +
      '<span class="v-plat">' + platform(item.url, item.type) + '</span></div>' +
      '<h3 class="vt">' + item.t + (ph ? '<span class="flag">占位</span>' : '') + '</h3>' +
      '<p class="vd">' + item.d + '</p>' +
      '<div class="v-tags">' + (item.tags || []).map(function (x) { return '<span># ' + x + '</span>'; }).join('') + '</div>' +
      '<div class="v-foot">' +
      '<a class="btn-go" href="' + item.url + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z"/></svg>' + goLabel(item.type) + '</a>' +
      '<button class="btn-done" data-key="' + key + '" title="标记为已学" aria-label="标记为已学" aria-pressed="' + isDone + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      '</button></div></article>';
  }

  function renderSections() {
    var box = $('#sections');
    if (!box) return;
    var t = TRACKS[TRACK];
    box.innerHTML = t.cats.filter(function (c) { return !c.scope; }).map(function (cat) {
      return '<section class="cat-section' + (cat.featured ? ' featured' : '') + '" id="cat-' + cat.id + '" data-cat="' + cat.id + '"' +
        ' style="--ac:' + cat.color + ';--ac-soft:' + cat.soft + ';--ac-bd:' + cat.bd + ';--ac-sh:' + cat.sh + '">' +
        '<div class="cat-head"><span class="ico-box">' + svg(ICONS[cat.icon] || ICONS.book) + '</span>' +
        '<h3>' + cat.name + '<small>' + cat.en + '</small></h3>' +
        (cat.featured ? '<span class="race-badge"><i></i>竞赛专场</span>' : '') +
        '<span class="prog" data-prog="' + cat.id + '"></span>' +
        '<p class="cat-desc">' + cat.desc + '</p></div>' +
        '<div class="grid">' + cat.items.map(function (it) { return cardHTML(cat, it, t.id); }).join('') + '</div>' +
        '</section>';
    }).join('');
    observeRv(box);
  }

  function renderChips() {
    var box = $('#chips');
    if (!box) return;
    var t = TRACKS[TRACK];
    box.innerHTML = '<button class="chip on" data-cat="all"><i></i>全部</button>' +
      t.cats.filter(function (c) { return !c.scope; }).map(function (c) {
        return '<button class="chip" data-cat="' + c.id + '" style="--c:' + c.color + '"><i></i>' + c.name + '</button>';
      }).join('');
  }

  /* ---- 筛选：只切换显隐，不重建 DOM ---- */
  function applyFilter() {
    var q = state.q.trim().toLowerCase();
    var t = TRACKS[TRACK];
    var visible = 0;
    document.querySelectorAll('#sections .cat-section').forEach(function (sec) {
      var catId = sec.dataset.cat;
      var shown = 0;
      sec.querySelectorAll('.vcard').forEach(function (card) {
        var okCat = (state.cat === 'all' || state.cat === catId);
        var okQ = !q || card.dataset.search.indexOf(q) > -1;
        var show = okCat && okQ;
        card.classList.toggle('hide', !show);
        if (show) shown++;
      });
      sec.classList.toggle('hide', shown === 0);
      visible += shown;
      var cat = t.cats.filter(function (c) { return c.id === catId; })[0];
      var dn = cat.items.filter(function (it) { return done.has(t.id + ':' + it.id); }).length;
      var prog = sec.querySelector('.prog');
      if (prog) prog.textContent = '已学 ' + dn + '/' + cat.items.length;
    });
    var count = $('#count');
    if (count) count.textContent = '共 ' + visible + ' 个资源';
    var empty = $('#empty');
    if (empty) empty.hidden = visible > 0;
    var tp = $('#trackProg');
    if (tp) tp.textContent = trackProgressText();
  }

  function trackProgressText() {
    var t = TRACKS[TRACK];
    var total = 0, dn = 0;
    t.cats.forEach(function (c) {
      c.items.forEach(function (it) { total++; if (done.has(t.id + ':' + it.id)) dn++; });
    });
    return t.name + '进度：已学 ' + dn + '/' + total;
  }

  /* ---- 术语速查（软件页） ---- */
  function renderGloss() {
    var box = $('#glossGrid');
    if (!box) return;
    box.innerHTML = GLOSSARY.map(function (g) {
      return '<div class="gloss-item" data-search="' + (g.t + g.d).toLowerCase() + '"><b>' + g.t + '</b><p>' + g.d + '</p></div>';
    }).join('');
    var input = $('#glossSearch');
    function applyGloss() {
      var q = input.value.trim().toLowerCase();
      var n = 0;
      box.querySelectorAll('.gloss-item').forEach(function (el) {
        var show = !q || el.dataset.search.indexOf(q) > -1;
        el.classList.toggle('hide', !show);
        if (show) n++;
      });
      $('#glossCount').textContent = q ? ('匹配 ' + n + ' / ' + GLOSSARY.length + ' 条') : ('共 ' + GLOSSARY.length + ' 条');
    }
    input.addEventListener('input', applyGloss);
    applyGloss();
  }

  /* ---- 考核专区（软件页） ---- */
  function renderExams() {
    var box = $('#examGrid');
    if (!box) return;
    box.innerHTML = EXAMS.map(function (e) {
      return '<article class="exam-card tilt">' +
        '<span class="ex-session">' + e.session + '</span>' +
        '<h3>' + e.title + '</h3>' +
        '<ul>' + e.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
        (e.bonus ? '<p class="ex-bonus">★ ' + e.bonus + '</p>' : '') +
        '<div class="ex-meta"><span>负责人：' + e.owner + '</span><span>' + e.period + '</span><span>周期内随时找学长验收</span></div>' +
        '<p class="ex-ref">' + e.ref + '</p>' +
        '</article>';
    }).join('');
  }

  /* ---- 入场动画观察 ---- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    });
  }, { threshold: .08 });
  function observeRv(root) {
    root.querySelectorAll('.rv:not(.in)').forEach(function (el) { io.observe(el); });
  }

  /* ---- 事件绑定 ---- */
  var chips = $('#chips');
  if (chips) {
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      chips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
      b.classList.add('on');
      state.cat = b.dataset.cat;
      applyFilter();
    });
  }
  var q = $('#q');
  if (q) {
    q.addEventListener('input', function (e) { state.q = e.target.value; applyFilter(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
    });
  }
  var sections = $('#sections');
  if (sections) {
    /* 打卡：只更新单卡，不整页重渲染 */
    sections.addEventListener('click', function (e) {
      var b = e.target.closest('.btn-done');
      if (!b) return;
      var key = b.dataset.key;
      var card = b.closest('.vcard');
      if (done.has(key)) { done.delete(key); } else { done.add(key); }
      store.set(Array.from(done));
      card.classList.toggle('done', done.has(key));
      b.setAttribute('aria-pressed', done.has(key) ? 'true' : 'false');
      applyFilter();
    });
  }

  /* ---- 启动 ---- */
  renderGlobalStats();
  renderDocs();
  if (TRACK !== 'hub') {
    renderRoadmap();
    renderSchedule();
    renderGloss();
    renderExams();
    renderChips();
    renderSections();
    applyFilter();
    if (location.hash) {
      var el = document.querySelector(location.hash);
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
  }
})();
