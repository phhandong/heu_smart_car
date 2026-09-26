/* ================================================================
 * fx.js · 「赛道与速度」视觉体系（全站共享，无依赖）
 *  - Hero 画布赛道：发光贝塞尔环线 + 拖尾光点赛车 + 速度粒子
 *  - odometer：[data-count] 进入视口滚动计数
 *  - tilt：.tilt 卡片指针透视倾斜 + 眩光
 *  - spot：.spot 卡片光标追光
 *  - magnet：.btn-primary 磁吸
 *  - 视差：[data-parallax] 滚动位移
 *  - stagger：.rv 入场自动编排
 *  - 顶栏滚动态 / hero 滚动指示器隐藏
 * 全部尊重 prefers-reduced-motion。
 * ================================================================ */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Hero 画布赛道 ---------------- */
  function initTrackCanvas() {
    var cv = document.getElementById('trackCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pts = [];           // 赛道控制点（归一化）
    var car = { t: 0, speed: 0.00045 };
    var trail = [];
    var sparks = [];

    function resize() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* 一条环绕 hero 的闭合赛道（归一化坐标） */
    var CTRL = [
      [0.06, 0.62], [0.16, 0.30], [0.34, 0.20], [0.52, 0.34],
      [0.66, 0.55], [0.82, 0.62], [0.94, 0.42], [0.86, 0.20],
      [0.66, 0.12], [0.46, 0.16], [0.28, 0.42], [0.14, 0.72], [0.24, 0.86], [0.52, 0.84], [0.74, 0.80]
    ];

    function catmull(p0, p1, p2, p3, t) {
      var t2 = t * t, t3 = t2 * t;
      return [
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      ];
    }
    function pointAt(u) {
      var n = CTRL.length;
      var f = u * n, i = Math.floor(f), t = f - i;
      var p0 = CTRL[(i - 1 + n) % n], p1 = CTRL[i % n], p2 = CTRL[(i + 1) % n], p3 = CTRL[(i + 2) % n];
      var q = catmull(p0, p1, p2, p3, t);
      return [q[0] * W, q[1] * H];
    }

    function drawTrack() {
      ctx.clearRect(0, 0, W, H);
      /* 赛道底线 */
      ctx.beginPath();
      for (var i = 0; i <= 240; i++) {
        var p = pointAt(i / 240);
        i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(93,158,255,.30)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([7, 9]);
      ctx.lineDashOffset = -performance.now() * 0.02;
      ctx.stroke();
      ctx.setLineDash([]);
      /* 内侧发光线 */
      ctx.strokeStyle = 'rgba(79,214,255,.12)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    function frame(now) {
      drawTrack();
      car.t = (car.t + car.speed * 16.7) % 1;
      var p = pointAt(car.t);
      trail.push(p);
      if (trail.length > 26) trail.shift();
      /* 拖尾 */
      for (var i = 1; i < trail.length; i++) {
        var a = i / trail.length;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1][0], trail[i - 1][1]);
        ctx.lineTo(trail[i][0], trail[i][1]);
        ctx.strokeStyle = 'rgba(79,214,255,' + (a * 0.55).toFixed(3) + ')';
        ctx.lineWidth = a * 3.2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      /* 车灯光点 */
      var g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 16);
      g.addColorStop(0, 'rgba(220,245,255,.95)');
      g.addColorStop(0.35, 'rgba(79,214,255,.55)');
      g.addColorStop(1, 'rgba(79,214,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p[0], p[1], 16, 0, 7); ctx.fill();
      ctx.fillStyle = '#eaffff';
      ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, 7); ctx.fill();
      /* 速度粒子 */
      if (Math.random() < 0.5) sparks.push({ x: p[0], y: p[1], vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6, life: 1 });
      for (var s = sparks.length - 1; s >= 0; s--) {
        var sp = sparks[s];
        sp.x += sp.vx; sp.y += sp.vy; sp.life -= 0.03;
        if (sp.life <= 0) { sparks.splice(s, 1); continue; }
        ctx.fillStyle = 'rgba(148,220,255,' + (sp.life * 0.5).toFixed(3) + ')';
        ctx.fillRect(sp.x, sp.y, 1.6, 1.6);
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    if (REDUCED) { drawTrack(); return; }
    requestAnimationFrame(frame);
  }

  /* ---------------- odometer 计数 ---------------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (REDUCED) { el.textContent = target + suffix; return; }
        var t0 = null, DUR = 1400;
        function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min((ts - t0) / DUR, 1);
          var ease = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- tilt + spot ---------------- */
  function initPointerFx() {
    if (REDUCED) return;
    var nodes = document.querySelectorAll('.tilt, .spot');
    nodes.forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        var x = ev.clientX - r.left, y = ev.clientY - r.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        if (el.classList.contains('tilt')) {
          var rx = ((y / r.height) - 0.5) * -7;
          var ry = ((x / r.width) - 0.5) * 9;
          el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
        }
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------------- 磁吸按钮 ---------------- */
  function initMagnet() {
    if (REDUCED) return;
    document.querySelectorAll('.btn-primary, .top-cta').forEach(function (b) {
      b.addEventListener('pointermove', function (ev) {
        var r = b.getBoundingClientRect();
        var dx = (ev.clientX - (r.left + r.width / 2)) * 0.18;
        var dy = (ev.clientY - (r.top + r.height / 2)) * 0.3;
        b.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------------- 视差 ---------------- */
  function initParallax() {
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length || REDUCED) return;
    var tick = false;
    function apply() {
      var y = window.scrollY;
      els.forEach(function (el) {
        var k = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = 'translate(' + (el.classList.contains('bg-year') ? '-50%' : '0') + ',' + (y * k).toFixed(1) + 'px)';
      });
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame.apply(null, [apply]); }
    }, { passive: true });
  }

  /* ---------------- stagger 入场编排 ---------------- */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (box) {
      Array.prototype.forEach.call(box.children, function (child, i) {
        child.style.transitionDelay = (i * 90) + 'ms';
      });
    });
  }

  /* ---------------- 顶栏滚动态 + 滚动指示器 ---------------- */
  function initScrollState() {
    var bar = document.querySelector('.topbar');
    var ind = document.querySelector('.scroll-hint');
    var tick = false;
    function apply() {
      var y = window.scrollY;
      if (bar) bar.classList.toggle('scrolled', y > 40);
      if (ind) ind.classList.toggle('gone', y > 200);
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------------- hero 文案入场 ---------------- */
  function initHeroEnter() {
    var hero = document.querySelector('.hero, .page-head');
    if (!hero) return;
    hero.classList.add('entered');
  }

  /* ---------------- 滚动驱动 3D（进度依赖用户滑动） ---------------- */
  function initScroll3D() {
    /* 顶部滚动进度条 */
    var bar = document.createElement('div');
    bar.id = 'scrollProg';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var s3d = document.querySelectorAll('[data-s3d]');
    var heroInner = document.querySelector('.hero .hero-inner');
    var cars = document.querySelectorAll('.track-divider .td-car');
    cars.forEach(function (c) { c.style.animation = 'none'; });
    if (REDUCED) { bar.style.display = 'none'; return; }

    var tick = false;
    function apply() {
      var y = window.scrollY;
      var vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      /* 元素级 3D 翻开：p=0 刚进视口 → p=1 到达阅读位 */
      s3d.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.72)));
        el.style.setProperty('--p', p.toFixed(3));
      });
      /* hero 滚出 3D */
      if (heroInner) {
        var hp = Math.min(1, y / (vh * 0.85));
        heroInner.style.setProperty('--hp', hp.toFixed(3));
      }
      /* 分隔线小车跟随滚动行驶 */
      cars.forEach(function (car) {
        var sec = car.parentElement;
        var r = sec.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        car.style.left = (-6 + p * 108) + '%';
      });
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(apply); }
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (!tick) { tick = true; requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTrackCanvas();
    initCounters();
    initPointerFx();
    initMagnet();
    initParallax();
    initStagger();
    initScrollState();
    initHeroEnter();
    initScroll3D();
  });
})();
