/* ================================================================
 * showcase.js · 成果页渲染「竞赛速览 / 比赛实录」板块
 * 数据源：data/training-data.js 中 scope='showcase' 的分类
 * （竞赛认知内容归成果页，培训中心只保留学习资源）
 * ================================================================ */
(function () {
  'use strict';
  var ICONS = {
    flag:  '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    video: '<rect x="2" y="6.5" width="13" height="11" rx="2"/><path d="M15 10.5l7-3.5v10l-7-3.5"/>'
  };
  function svg(p) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }
  var isPlaceholder = function (u) { return u.indexOf('search.bilibili.com') > -1; };
  function platform(u) {
    if (u.indexOf('b23.tv') > -1 || u.indexOf('bilibili.com') > -1) return 'B站视频';
    if (u.indexOf('douyin.com') > -1) return '抖音视频';
    return '在线资源';
  }

  function cardHTML(cat, item) {
    return '<article class="vcard rv tilt" style="--ac:' + cat.color + ';--ac-soft:' + cat.soft + ';--ac-bd:' + cat.bd + ';--ac-sh:' + cat.sh + '">' +
      '<div class="v-top"><span class="v-ico">' + svg(ICONS[cat.icon] || ICONS.flag) + '</span>' +
      '<span class="v-plat">' + platform(item.url) + '</span></div>' +
      '<h3 class="vt">' + item.t + (isPlaceholder(item.url) ? '<span class="flag">占位</span>' : '') + '</h3>' +
      '<p class="vd">' + item.d + '</p>' +
      '<div class="v-tags">' + (item.tags || []).map(function (x) { return '<span># ' + x + '</span>'; }).join('') + '</div>' +
      '<div class="v-foot"><a class="btn-go" href="' + item.url + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z"/></svg>观看视频</a></div>' +
      '</article>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.getElementById('showcaseCats');
    if (!box || typeof TRACKS === 'undefined') return;
    var cats = TRACKS.hw.cats.filter(function (c) { return c.scope === 'showcase'; });
    box.innerHTML = cats.map(function (cat) {
      return '<section class="cat-section' + (cat.featured ? ' featured' : '') + '" id="cat-' + cat.id + '"' +
        ' style="--ac:' + cat.color + ';--ac-soft:' + cat.soft + ';--ac-bd:' + cat.bd + ';--ac-sh:' + cat.sh + '">' +
        '<div class="cat-head"><span class="ico-box">' + svg(ICONS[cat.icon] || ICONS.flag) + '</span>' +
        '<h3>' + cat.name + '<small>' + cat.en + '</small></h3>' +
        '<span class="race-badge"><i></i>' + (cat.id === 'race' ? '看懂比赛' : '赛场第一视角') + '</span>' +
        '<span class="prog">' + cat.items.length + ' 条资源</span>' +
        '<p class="cat-desc">' + cat.desc + '</p></div>' +
        '<div class="grid">' + cat.items.map(function (it) { return cardHTML(cat, it); }).join('') + '</div>' +
        '</section>';
    }).join('');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: .08 });
    box.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
    /* 板块由 JS 后渲染，浏览器原生锚点跳转会落空：手动补偿滚动 */
    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 80);
    }
  });
})();
