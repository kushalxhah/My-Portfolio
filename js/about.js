// ===== ABOUT PAGE — ORBIT BG =====
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

  const systems = [
    { x: 0.25, y: 0.35 },
    { x: 0.75, y: 0.65 },
    { x: 0.55, y: 0.2  },
    { x: 0.15, y: 0.75 },
    { x: 0.85, y: 0.3  },
  ];

  const orbiters = [];
  systems.forEach(s => {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      orbiters.push({
        cx: s.x, cy: s.y,
        radius: 40 + i * 35,
        angle: Math.random() * Math.PI * 2,
        speed: (0.003 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
        dotR: 1.2 + Math.random() * 1.2,
        color: i % 2 === 0 ? '200,184,162' : '167,139,250',
        trailLen: 40 + Math.floor(Math.random() * 40),
        trail: [],
      });
    }
  });

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // Draw orbit rings
    systems.forEach(s => {
      for (let r = 40; r <= 180; r += 35) {
        ctx.beginPath();
        ctx.arc(s.cx * W, s.cy * H, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(200,184,162,0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    // Update and draw orbiters
    orbiters.forEach(o => {
      o.angle += o.speed;
      const x = o.cx * W + Math.cos(o.angle) * o.radius;
      const y = o.cy * H + Math.sin(o.angle) * o.radius;

      // Trail
      o.trail.push({ x, y });
      if (o.trail.length > o.trailLen) o.trail.shift();

      for (let i = 1; i < o.trail.length; i++) {
        const alpha = (i / o.trail.length) * 0.25;
        ctx.beginPath();
        ctx.moveTo(o.trail[i - 1].x, o.trail[i - 1].y);
        ctx.lineTo(o.trail[i].x, o.trail[i].y);
        ctx.strokeStyle = `rgba(${o.color},${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, o.dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${o.color},0.9)`;
      ctx.fill();
    });
  }

  draw();
})();
