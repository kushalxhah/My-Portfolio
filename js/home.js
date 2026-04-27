// ===== LOADER =====
const loaderEl = document.getElementById('loader');
const loaderNum = document.getElementById('loaderNum');
const loaderBar = document.getElementById('loaderBar');

const isReload    = performance.getEntriesByType('navigation')[0]?.type === 'reload';
const fromRefresh = sessionStorage.getItem('redirectLoader') === '1';
sessionStorage.removeItem('redirectLoader');
if (isReload || fromRefresh) sessionStorage.removeItem('loaderPlayed');

if (!sessionStorage.getItem('loaderPlayed') || isReload || fromRefresh) {
  document.body.classList.add('first-load');
  loaderEl.style.display = 'flex';
  let n = 0;
  const iv = setInterval(() => {
    n += Math.floor(Math.random() * 4) + 1;
    if (n > 100) n = 100;
    loaderNum.textContent = String(n).padStart(3, '0');
    loaderBar.style.width = n + '%';
    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loaderEl.classList.add('out');
        loaderEl.addEventListener('animationend', () => {
          loaderEl.style.display = 'none';
          sessionStorage.setItem('loaderPlayed', '1');
        }, { once: true });
      }, 200);
    }
  }, 20);
}

// ===== NEBULA PARTICLE BACKGROUND =====
(function () {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  // Layer 1 — large slow background stars
  const bgCount = 400;
  const bgPos = new Float32Array(bgCount * 3);
  for (let i = 0; i < bgCount; i++) {
    bgPos[i*3]   = (Math.random() - 0.5) * 30;
    bgPos[i*3+1] = (Math.random() - 0.5) * 30;
    bgPos[i*3+2] = (Math.random() - 0.5) * 15 - 5;
  }
  const bgGeo = new THREE.BufferGeometry();
  bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
  scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.018, transparent: true, opacity: 0.25,
    blending: THREE.AdditiveBlending, depthWrite: false
  })));

  // Layer 2 — mid particles (warm beige)
  const midCount = 600;
  const midPos = new Float32Array(midCount * 3);
  const midVel = [];
  for (let i = 0; i < midCount; i++) {
    midPos[i*3]   = (Math.random() - 0.5) * 20;
    midPos[i*3+1] = (Math.random() - 0.5) * 20;
    midPos[i*3+2] = (Math.random() - 0.5) * 10;
    midVel.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
    });
  }
  const midGeo = new THREE.BufferGeometry();
  midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
  const midPoints = new THREE.Points(midGeo, new THREE.PointsMaterial({
    color: 0xc8b8a2, size: 0.04, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  scene.add(midPoints);

  // Layer 3 — close bright accent particles (purple)
  const fgCount = 150;
  const fgPos = new Float32Array(fgCount * 3);
  const fgVel = [];
  for (let i = 0; i < fgCount; i++) {
    fgPos[i*3]   = (Math.random() - 0.5) * 12;
    fgPos[i*3+1] = (Math.random() - 0.5) * 12;
    fgPos[i*3+2] = (Math.random() - 0.5) * 4;
    fgVel.push({
      x: (Math.random() - 0.5) * 0.012,
      y: (Math.random() - 0.5) * 0.012,
    });
  }
  const fgGeo = new THREE.BufferGeometry();
  fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPos, 3));
  const fgPoints = new THREE.Points(fgGeo, new THREE.PointsMaterial({
    color: 0xa78bfa, size: 0.06, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  scene.add(fgPoints);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Animate mid layer
    const mp = midGeo.attributes.position.array;
    for (let i = 0; i < midCount; i++) {
      mp[i*3]   += midVel[i].x;
      mp[i*3+1] += midVel[i].y;
      if (Math.abs(mp[i*3]) > 10)   midVel[i].x *= -1;
      if (Math.abs(mp[i*3+1]) > 10) midVel[i].y *= -1;
    }
    midGeo.attributes.position.needsUpdate = true;

    // Animate fg layer
    const fp = fgGeo.attributes.position.array;
    for (let i = 0; i < fgCount; i++) {
      fp[i*3]   += fgVel[i].x;
      fp[i*3+1] += fgVel[i].y;
      if (Math.abs(fp[i*3]) > 6)   fgVel[i].x *= -1;
      if (Math.abs(fp[i*3+1]) > 6) fgVel[i].y *= -1;
    }
    fgGeo.attributes.position.needsUpdate = true;

    // Parallax rotation on each layer
    midPoints.rotation.y = t * 0.03;
    midPoints.rotation.x = t * 0.01;
    fgPoints.rotation.y = -t * 0.05;
    fgPoints.rotation.z = t * 0.02;

    renderer.render(scene, camera);
  })();
})();
