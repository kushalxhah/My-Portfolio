// ===== GRAIN =====
(function () {
  const canvas = document.getElementById('grain');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  function draw() {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // Throttle grain to ~12fps so it doesn't flicker
    setTimeout(() => requestAnimationFrame(draw), 80);
  }
  draw();
})();

// ===== CURSOR — CROSSHAIR =====
const cursor = document.getElementById('cursor');
const dot    = document.getElementById('cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function loop() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  dot.style.left    = cx + 'px';
  dot.style.top     = cy + 'px';
  requestAnimationFrame(loop);
})();
})();

document.querySelectorAll('a, button, .proj-card, .contact-row').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
});

// ===== PAGE TRANSITIONS — fade out → navigate → fade in =====
const overlay = document.getElementById('page-transition');

function navigateTo(href) {
  overlay.style.transition = 'opacity 0.3s ease';
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'all';
  setTimeout(() => { window.location.href = href; }, 320);
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (!href || href === '#' || href === current) return;
    e.preventDefault();
    navigateTo(href);
  });
});

// On new page load — overlay starts transparent, fades in from black then out
window.addEventListener('DOMContentLoaded', () => {
  overlay.style.transition = 'none';
  overlay.style.opacity = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.4s ease';
      overlay.style.opacity = '0';
    });
  });
});

// ===== REVEAL =====
function initReveal() {
  const els = document.querySelectorAll('.proj-card, .contact-row, .skill-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('on');
          if (entry.target.classList.contains('skill-fill')) {
            entry.target.classList.add('animate');
          }
        }, i * 100);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);
