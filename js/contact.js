// ===== CONTACT PAGE — PROFESSIONAL GEOMETRIC BG =====
(function () {
  const webgl = document.getElementById('webgl');
  webgl.style.display = 'none';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Diagonal thin lines — like a blueprint/technical grid
  const LINE_COUNT = 18;
  const lines = Array.from({ length: LINE_COUNT }, (_, i) => ({
    offset: (i / LINE_COUNT) * W * 2,
    speed: 0.12 + Math.random() * 0.1,
    opacity: 0.03 + Math.random() * 0.04,
    color: i % 3 === 0 ? '167,139,250' : '200,184,162',
  }));

  // Floating minimal dots
  const DOT_COUNT = 55;
  const dots = Array.from({ length: DOT_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 0.8 + Math.random() * 1.2,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    opacity: 0.2 + Math.random() * 0.4,
    color: Math.random() > 0.6 ? '167,139,250' : '200,184,162',
  }));

  // Corner accent — single large faint arc bottom-right
  function drawCornerAccent() {
    const grad = ctx.createRadialGradient(W, H, 0, W, H, W * 0.7);
    grad.addColorStop(0,   'rgba(167,139,250,0.06)');
    grad.addColorStop(0.5, 'rgba(167,139,250,0.02)');
    grad.addColorStop(1,   'rgba(167,139,250,0)');
    ctx.beginPath();
    ctx.arc(W, H, W * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Top-left accent
    const grad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.5);
    grad2.addColorStop(0,   'rgba(200,184,162,0.05)');
    grad2.addColorStop(0.5, 'rgba(200,184,162,0.015)');
    grad2.addColorStop(1,   'rgba(200,184,162,0)');
    ctx.beginPath();
    ctx.arc(0, 0, W * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = grad2;
    ctx.fill();
  }

  let t = 0;

  function draw() {
    requestAnimationFrame(draw);
    t += 0.5;
    ctx.clearRect(0, 0, W, H);

    // Corner accents
    drawCornerAccent();

    // Diagonal moving lines
    lines.forEach(l => {
      l.offset -= l.speed;
      if (l.offset < -W) l.offset = W * 2;

      ctx.save();
      ctx.translate(l.offset, 0);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-H, H);
      ctx.strokeStyle = `rgba(${l.color},${l.opacity})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    });

    // Dots
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;
      if (d.y > H) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color},${d.opacity})`;
      ctx.fill();
    });

    // Connect nearby dots with faint lines
    for (let i = 0; i < DOT_COUNT; i++) {
      for (let j = i + 1; j < DOT_COUNT; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(200,184,162,${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  draw();
})();
