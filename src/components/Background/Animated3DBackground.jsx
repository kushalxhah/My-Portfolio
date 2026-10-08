import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ─── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // fully transparent — body bg shows through
    mount.appendChild(renderer.domElement);

    // ─── Scene / Camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 350;

    // ─── Particle setup ───────────────────────────────────────────────────────
    const COUNT  = 500;
    const SPREAD = 700;

    const positions  = new Float32Array(COUNT * 3);
    const colors     = new Float32Array(COUNT * 3);
    const sizes      = new Float32Array(COUNT);
    const velocities = [];

    const white     = new THREE.Color(0xffffff);
    const blueWhite = new THREE.Color(0xddeeff);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5;

      const col = Math.random() < 0.88 ? white : blueWhite;
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Larger points closer to camera, smaller far away
      const depth = Math.abs(positions[i * 3 + 2]) / (SPREAD * 0.5);
      sizes[i] = (1 - depth * 0.6) * (Math.random() * 2.5 + 1.2);

      velocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.06,
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    // ─── Glow sprite texture ──────────────────────────────────────────────────
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext('2d');
    const grad  = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.25,'rgba(255,255,255,0.8)');
    grad.addColorStop(0.6, 'rgba(200,220,255,0.25)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
      size:            3.0,
      map:             sprite,
      vertexColors:    true,
      sizeAttenuation: true,
      transparent:     true,
      opacity:         0,       // fade in from 0
      depthWrite:      false,
      blending:        THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ─── Constellation lines ──────────────────────────────────────────────────
    const LINE_CHECK = 180;           // only compare first N particles
    const LINE_DIST  = 75;
    const maxPairs   = (LINE_CHECK * (LINE_CHECK - 1)) / 2;
    const linePos    = new Float32Array(maxPairs * 6);
    const lineGeo    = new THREE.BufferGeometry();
    const lineBuf    = new THREE.BufferAttribute(linePos, 3);
    lineBuf.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', lineBuf);
    lineGeo.setDrawRange(0, 0);

    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color:       0xffffff,
      transparent: true,
      opacity:     0.08,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    }));
    scene.add(lines);

    // ─── Mouse ────────────────────────────────────────────────────────────────
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMouse = (e) => {
      tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ─── Tab pause ────────────────────────────────────────────────────────────
    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    // ─── Fade in ──────────────────────────────────────────────────────────────
    const fadeStart = performance.now();
    const FADE_MS   = 1500;

    // ─── Loop ─────────────────────────────────────────────────────────────────
    let raf;
    let frame = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (paused) return;
      frame++;

      // Fade in
      const t = Math.min((performance.now() - fadeStart) / FADE_MS, 1);
      mat.opacity = t * t * (3 - 2 * t); // smoothstep

      // Smooth mouse
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      // Global rotation (swirl)
      points.rotation.y += 0.0015;
      points.rotation.z += 0.0005;

      // Mouse parallax on camera
      camera.position.x = mx * 18;
      camera.position.y = -my * 12;
      camera.lookAt(scene.position);

      // Update particle positions
      const pos = geo.attributes.position.array;
      const H = SPREAD / 2;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        // Toroidal wrap
        if (pos[i * 3]     >  H) pos[i * 3]     = -H;
        if (pos[i * 3]     < -H) pos[i * 3]     =  H;
        if (pos[i * 3 + 1] >  H) pos[i * 3 + 1] = -H;
        if (pos[i * 3 + 1] < -H) pos[i * 3 + 1] =  H;
        if (pos[i * 3 + 2] >  H * 0.5) pos[i * 3 + 2] = -H * 0.5;
        if (pos[i * 3 + 2] < -H * 0.5) pos[i * 3 + 2] =  H * 0.5;
      }
      geo.attributes.position.needsUpdate = true;

      // Constellation lines — update every 2 frames
      if (frame % 2 === 0) {
        const lp  = lineGeo.attributes.position.array;
        let   idx = 0;
        for (let i = 0; i < LINE_CHECK; i++) {
          for (let j = i + 1; j < LINE_CHECK; j++) {
            const ax = pos[i*3], ay = pos[i*3+1], az = pos[i*3+2];
            const bx = pos[j*3], by = pos[j*3+1], bz = pos[j*3+2];
            const d  = Math.sqrt((ax-bx)**2 + (ay-by)**2 + (az-bz)**2);
            if (d < LINE_DIST) {
              lp[idx++] = ax; lp[idx++] = ay; lp[idx++] = az;
              lp[idx++] = bx; lp[idx++] = by; lp[idx++] = bz;
            }
          }
        }
        for (let k = idx; k < lp.length; k++) lp[k] = 0;
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.setDrawRange(0, idx / 3);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      lineGeo.dispose();
      sprite.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        -1,         // truly behind ALL content
        pointerEvents: 'none',
      }}
    />
  );
}
