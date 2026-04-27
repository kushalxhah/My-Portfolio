// ===== PROJECTS PAGE — FLOATING CUBES CONSTELLATION =====
(function () {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const pl1 = new THREE.PointLight(0xc8b8a2, 5, 25);
  pl1.position.set(5, 4, 4); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x4444ff, 3, 20);
  pl2.position.set(-5, -3, 3); scene.add(pl2);
  const pl3 = new THREE.PointLight(0xa78bfa, 2, 15);
  pl3.position.set(0, 5, -3); scene.add(pl3);

  const cubes = [];
  const cubeCount = 28;

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x0e0e1a, metalness: 0.95, roughness: 0.05 }),
    new THREE.MeshBasicMaterial({ color: 0xc8b8a2, wireframe: true, transparent: true, opacity: 0.15 }),
    new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.1 }),
  ];

  for (let i = 0; i < cubeCount; i++) {
    const size = 0.12 + Math.random() * 0.45;
    const geo = Math.random() > 0.4
      ? new THREE.BoxGeometry(size, size, size)
      : new THREE.OctahedronGeometry(size * 0.7);

    const mat = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6 - 1
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const speed = {
      rx: (Math.random() - 0.5) * 0.012,
      ry: (Math.random() - 0.5) * 0.015,
      rz: (Math.random() - 0.5) * 0.008,
      floatSpeed: 0.3 + Math.random() * 0.5,
      floatAmp: 0.08 + Math.random() * 0.15,
      floatOffset: Math.random() * Math.PI * 2,
    };

    scene.add(mesh);
    cubes.push({ mesh, speed, baseY: mesh.position.y });
  }

  // Connecting lines between nearby cubes
  const lineMat = new THREE.LineBasicMaterial({ color: 0x333355, transparent: true, opacity: 0.2 });
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const dist = cubes[i].mesh.position.distanceTo(cubes[j].mesh.position);
      if (dist < 3.5) {
        const points = [cubes[i].mesh.position.clone(), cubes[j].mesh.position.clone()];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        scene.add(new THREE.Line(lineGeo, lineMat));
      }
    }
  }

  // Mouse
  let tRX = 0, tRY = 0;
  document.addEventListener('mousemove', e => {
    tRY = ((e.clientX / window.innerWidth) - 0.5) * 0.5;
    tRX = ((e.clientY / window.innerHeight) - 0.5) * 0.3;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    cubes.forEach(({ mesh, speed, baseY }) => {
      mesh.rotation.x += speed.rx;
      mesh.rotation.y += speed.ry;
      mesh.rotation.z += speed.rz;
      mesh.position.y = baseY + Math.sin(t * speed.floatSpeed + speed.floatOffset) * speed.floatAmp;
    });

    // Subtle camera drift with mouse
    camera.position.x += (tRY * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (-tRX * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    pl1.intensity = 5 + Math.sin(t * 1.1) * 1.2;
    pl2.intensity = 3 + Math.cos(t * 0.8) * 0.8;

    renderer.render(scene, camera);
  }
  animate();
})();
