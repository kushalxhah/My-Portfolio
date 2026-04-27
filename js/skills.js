// ===== SKILLS PAGE — NEURAL NETWORK (OPTIMISED) =====
(function () {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(1); // fixed to 1 — biggest perf win
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 22);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.08));
  const pl1 = new THREE.PointLight(0xc8b8a2, 4, 50);
  pl1.position.set(8, 8, 10); scene.add(pl1);
  const pl2 = new THREE.PointLight(0xa78bfa, 3, 45);
  pl2.position.set(-8, -6, 8); scene.add(pl2);

  // ---- Nodes (reduced to 50) ----
  const nodeCount = 50;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.12, 5, 5); // low-poly sphere

  for (let i = 0; i < nodeCount; i++) {
    const color = Math.random() > 0.5 ? 0xc8b8a2 : 0xa78bfa;
    const mat = new THREE.MeshBasicMaterial({ color }); // MeshBasic — no lighting calc
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 34,
      (Math.random() - 0.5) * 16 - 2
    );
    scene.add(mesh);
    nodes.push({
      mesh,
      basePos: mesh.position.clone(),
      floatSpeed:  0.15 + Math.random() * 0.2,
      floatAmp:    0.2  + Math.random() * 0.3,
      floatOffset: Math.random() * Math.PI * 2,
      pulseOffset: Math.random() * Math.PI * 2,
    });
  }

  // ---- Static connection lines (not rebuilt every frame) ----
  // Use a single BufferGeometry with all line segments — much faster
  const maxDist = 9;
  const linePositions = [];
  const connections = []; // store pairs for pulse travel

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].basePos.distanceTo(nodes[j].basePos) < maxDist) {
        linePositions.push(
          nodes[i].basePos.x, nodes[i].basePos.y, nodes[i].basePos.z,
          nodes[j].basePos.x, nodes[j].basePos.y, nodes[j].basePos.z
        );
        connections.push([i, j]);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  const linePosAttr = new THREE.BufferAttribute(new Float32Array(linePositions), 3);
  linePosAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute('position', linePosAttr);
  scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: 0xc8b8a2, transparent: true, opacity: 0.07,
  })));

  // ---- Pulses (just 15, simple spheres) ----
  const pulseGeo = new THREE.SphereGeometry(0.07, 4, 4);
  const pulses = connections.slice(0, 15).map(([i, j]) => {
    const mesh = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({
      color: 0xf0ede8, transparent: true, opacity: 0.9,
    }));
    scene.add(mesh);
    return { mesh, i, j, t: Math.random() };
  });

  // ---- Background particles ----
  const pCount = 300;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 60;
    pPos[i*3+1] = (Math.random() - 0.5) * 44;
    pPos[i*3+2] = (Math.random() - 0.5) * 20 - 6;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xc8b8a2, size: 0.03, transparent: true, opacity: 0.3,
  })));

  // Mouse
  let tRX = 0, tRY = 0;
  document.addEventListener('mousemove', e => {
    tRY = ((e.clientX / window.innerWidth) - 0.5) * 1.4;
    tRX = ((e.clientY / window.innerHeight) - 0.5) * 0.9;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  let frame = 0;
  (function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = clock.getElapsedTime();

    // Update nodes every frame but only update lines every 3 frames
    nodes.forEach((n, idx) => {
      n.mesh.position.y = n.basePos.y + Math.sin(t * n.floatSpeed + n.floatOffset) * n.floatAmp;
      n.mesh.position.x = n.basePos.x + Math.cos(t * n.floatSpeed * 0.7 + n.floatOffset) * n.floatAmp * 0.4;
      // Pulse scale every other frame
      if (frame % 2 === 0) {
        const s = 1 + Math.sin(t * 1.5 + n.pulseOffset) * 0.3;
        n.mesh.scale.setScalar(s);
      }
    });

    // Update line positions every 3 frames
    if (frame % 3 === 0) {
      const arr = linePosAttr.array;
      let ptr = 0;
      connections.forEach(([i, j]) => {
        const a = nodes[i].mesh.position;
        const b = nodes[j].mesh.position;
        arr[ptr++] = a.x; arr[ptr++] = a.y; arr[ptr++] = a.z;
        arr[ptr++] = b.x; arr[ptr++] = b.y; arr[ptr++] = b.z;
      });
      linePosAttr.needsUpdate = true;
    }

    // Move pulses
    pulses.forEach(p => {
      p.t = (p.t + 0.005) % 1;
      const a = nodes[p.i].mesh.position;
      const b = nodes[p.j].mesh.position;
      p.mesh.position.lerpVectors(a, b, p.t);
      p.mesh.material.opacity = Math.sin(p.t * Math.PI) * 0.85;
    });

    // Camera drift
    camera.position.x += (tRY * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (-tRX * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();
})();
