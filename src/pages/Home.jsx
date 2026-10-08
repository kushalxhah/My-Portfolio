import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

export default function Home({ navigateTo }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 4

    // Layer 1 — large slow background stars
    const bgCount = 400
    const bgPos = new Float32Array(bgCount * 3)
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 30
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 30
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
    }
    const bgGeo = new THREE.BufferGeometry()
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    const bgMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.018,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const bgPoints = new THREE.Points(bgGeo, bgMat)
    scene.add(bgPoints)

    // Layer 2 — mid particles (warm beige)
    const midCount = 600
    const midPos = new Float32Array(midCount * 3)
    const midVel = []
    for (let i = 0; i < midCount; i++) {
      midPos[i * 3] = (Math.random() - 0.5) * 20
      midPos[i * 3 + 1] = (Math.random() - 0.5) * 20
      midPos[i * 3 + 2] = (Math.random() - 0.5) * 10
      midVel.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
      })
    }
    const midGeo = new THREE.BufferGeometry()
    midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3))
    const midMat = new THREE.PointsMaterial({
      color: 0xc8b8a2,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const midPoints = new THREE.Points(midGeo, midMat)
    scene.add(midPoints)

    // Layer 3 — close bright accent particles (purple)
    const fgCount = 150
    const fgPos = new Float32Array(fgCount * 3)
    const fgVel = []
    for (let i = 0; i < fgCount; i++) {
      fgPos[i * 3] = (Math.random() - 0.5) * 12
      fgPos[i * 3 + 1] = (Math.random() - 0.5) * 12
      fgPos[i * 3 + 2] = (Math.random() - 0.5) * 4
      fgVel.push({
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.012,
      })
    }
    const fgGeo = new THREE.BufferGeometry()
    fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPos, 3))
    const fgMat = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const fgPoints = new THREE.Points(fgGeo, fgMat)
    scene.add(fgPoints)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    const clock = new THREE.Clock()
    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Animate mid layer
      const mp = midGeo.attributes.position.array
      for (let i = 0; i < midCount; i++) {
        mp[i * 3] += midVel[i].x
        mp[i * 3 + 1] += midVel[i].y
        if (Math.abs(mp[i * 3]) > 10) midVel[i].x *= -1
        if (Math.abs(mp[i * 3 + 1]) > 10) midVel[i].y *= -1
      }
      midGeo.attributes.position.needsUpdate = true

      // Animate fg layer
      const fp = fgGeo.attributes.position.array
      for (let i = 0; i < fgCount; i++) {
        fp[i * 3] += fgVel[i].x
        fp[i * 3 + 1] += fgVel[i].y
        if (Math.abs(fp[i * 3]) > 6) fgVel[i].x *= -1
        if (Math.abs(fp[i * 3 + 1]) > 6) fgVel[i].y *= -1
      }
      fgGeo.attributes.position.needsUpdate = true

      // Parallax rotation
      midPoints.rotation.y = t * 0.03
      midPoints.rotation.x = t * 0.01
      fgPoints.rotation.y = -t * 0.05
      fgPoints.rotation.z = t * 0.02

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      bgGeo.dispose()
      bgMat.dispose()
      midGeo.dispose()
      midMat.dispose()
      fgGeo.dispose()
      fgMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="page-home">
      <canvas ref={canvasRef} id="webgl" />
      <main className="home-main">
        <div className="home-left">
          <span className="home-tag">IT Developer & Web Creator</span>
          <h1>
            <span className="line"><span class="inner">KUSHAL</span></span>
            <span className="line"><span class="inner stroke">SHAH</span></span>
          </h1>
          <div className="home-role-line">
            <span className="home-role-bar"></span>
            <p className="hero-desc">IT Field Developer</p>
          </div>
        </div>

        <div className="home-right-strip">
          <div className="home-strip-item">
            <span className="strip-num">04<span className="status-dot"></span></span>
            <span className="strip-label">Status</span>
          </div>
          <div className="home-strip-divider"></div>
          <div className="home-strip-item" onClick={() => navigateTo('projects')} style={{ cursor: 'pointer' }}>
            <span className="strip-num">3+</span>
            <span className="strip-label">Projects</span>
          </div>
        </div>

        <div className="home-bottom-bar">
          <div className="home-loc">Gujarat, India</div>
          <div className="home-scroll" onClick={() => navigateTo('about')} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
