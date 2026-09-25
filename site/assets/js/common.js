/* ================================================================
 * 全站共享交互：移动端菜单 / 灯箱 / 回到顶部 / 入场动画
 * ================================================================ */
(function () {
  'use strict';

  /* ---- 移动端汉堡菜单 ---- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- 灯箱：任何 [data-lightbox] 图片点击放大 ---- */
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', '图片放大预览');
  box.innerHTML = '<img alt="">';
  document.body.appendChild(box);
  var boxImg = box.querySelector('img');

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lightbox]');
    if (t) {
      boxImg.src = t.getAttribute('data-lightbox') || t.src;
      boxImg.alt = t.alt || '放大预览';
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      return;
    }
    if (box.classList.contains('open')) {
      box.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) {
      box.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ---- 回到顶部 ---- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 620);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- 入场动画（.rv 元素进入视口时显现） ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
})();
