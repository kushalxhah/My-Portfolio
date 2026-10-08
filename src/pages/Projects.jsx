import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Projects.css'

export default function Projects({ navigateTo }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 8)

    scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const pl1 = new THREE.PointLight(0xc8b8a2, 5, 25)
    pl1.position.set(5, 4, 4)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0x4444ff, 3, 20)
    pl2.position.set(-5, -3, 3)
    scene.add(pl2)
    const pl3 = new THREE.PointLight(0xa78bfa, 2, 15)
    pl3.position.set(0, 5, -3)
    scene.add(pl3)

    const cubes = []
    const cubeCount = 28

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x0e0e1a, metalness: 0.95, roughness: 0.05 }),
      new THREE.MeshBasicMaterial({ color: 0xc8b8a2, wireframe: true, transparent: true, opacity: 0.15 }),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.1 }),
    ]

    for (let i = 0; i < cubeCount; i++) {
      const size = 0.12 + Math.random() * 0.45
      const geo = Math.random() > 0.4
        ? new THREE.BoxGeometry(size, size, size)
        : new THREE.OctahedronGeometry(size * 0.7)

      const mat = materials[Math.floor(Math.random() * materials.length)]
      const mesh = new THREE.Mesh(geo, mat)

      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6 - 1
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      const speed = {
        rx: (Math.random() - 0.5) * 0.012,
        ry: (Math.random() - 0.5) * 0.015,
        rz: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatAmp: 0.08 + Math.random() * 0.15,
        floatOffset: Math.random() * Math.PI * 2,
      }

      scene.add(mesh)
      cubes.push({ mesh, speed, baseY: mesh.position.y })
    }

    // Lines connecting nearby cubes
    const lines = []
    const lineMat = new THREE.LineBasicMaterial({ color: 0x333355, transparent: true, opacity: 0.2 })
    for (let i = 0; i < cubes.length; i++) {
      for (let j = i + 1; j < cubes.length; j++) {
        const dist = cubes[i].mesh.position.distanceTo(cubes[j].mesh.position)
        if (dist < 3.5) {
          const points = [cubes[i].mesh.position.clone(), cubes[j].mesh.position.clone()]
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(lineGeo, lineMat)
          scene.add(line)
          lines.push({ line, i, j })
        }
      }
    }

    // Mouse tilt
    let tRX = 0, tRY = 0
    const handleMouseMove = (e) => {
      tRY = (e.clientX / window.innerWidth - 0.5) * 0.5
      tRX = (e.clientY / window.innerHeight - 0.5) * 0.3
    }
    document.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    const clock = new THREE.Clock()
    let animationId

    function animate() {
      animationId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      cubes.forEach(({ mesh, speed, baseY }) => {
        mesh.rotation.x += speed.rx
        mesh.rotation.y += speed.ry
        mesh.rotation.z += speed.rz
        mesh.position.y = baseY + Math.sin(t * speed.floatSpeed + speed.floatOffset) * speed.floatAmp
      })

      // Update lines
      lines.forEach(({ line, i, j }) => {
        const positions = line.geometry.attributes.position.array
        const a = cubes[i].mesh.position
        const b = cubes[j].mesh.position
        positions[0] = a.x
        positions[1] = a.y
        positions[2] = a.z
        positions[3] = b.x
        positions[4] = b.y
        positions[5] = b.z
        line.geometry.attributes.position.needsUpdate = true
      })

      // Camera drift
      camera.position.x += (tRY * 1.5 - camera.position.x) * 0.05
      camera.position.y += (-tRX * 1.5 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      cubes.forEach(({ mesh }) => {
        mesh.geometry.dispose()
      })
      materials.forEach((m) => m.dispose())
      lines.forEach(({ line }) => {
        line.geometry.dispose()
      })
      lineMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="page-projects">
      <canvas ref={canvasRef} id="webgl" />
      <main className="projects-main">
        <h1 className="page-title">
          <span className="title-line"><span className="title-inner">MY</span></span>
          <span className="title-line"><span className="title-inner title-stroke">PROJECTS</span></span>
        </h1>

        <div className="projects-list">
          <a href="https://joyspoon-sooty.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-card">
            <div className="proj-num">01</div>
            <div className="proj-body">
              <div className="proj-header">
                <h2>Joyspoon</h2>
                <div className="proj-tags">
                  <span>Web App</span>
                  <span>UI/UX</span>
                </div>
              </div>
              <p>A web application delivering delightful food experiences with a clean UI and smooth interactions for an engaging user journey.</p>
              <div className="proj-tech">HTML &nbsp;·&nbsp; CSS &nbsp;·&nbsp; JavaScript</div>
            </div>
            <div className="proj-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </div>
          </a>

          <a href="https://brts-app-7yiwjohpqoar3mu8j5pzie.streamlit.app/" target="_blank" rel="noopener noreferrer" className="proj-card">
            <div className="proj-num">02</div>
            <div className="proj-body">
              <div className="proj-header">
                <h2>BRTS Portal</h2>
                <div className="proj-tags">
                  <span>Portal</span>
                  <span>Full Stack</span>
                </div>
              </div>
              <p>A Bus Rapid Transit System portal streamlining public transport information, route management, and passenger experience.</p>
              <div className="proj-tech">HTML &nbsp;·&nbsp; CSS &nbsp;·&nbsp; JavaScript &nbsp;·&nbsp; Streamlit</div>
            </div>
            <div className="proj-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </div>
          </a>

          <a onClick={() => navigateTo('home')} className="proj-card" style={{ cursor: 'pointer' }}>
            <div className="proj-num">03</div>
            <div className="proj-body">
              <div className="proj-header">
                <h2>Portfolio Website</h2>
                <div className="proj-tags">
                  <span>Portfolio</span>
                  <span>UI/UX</span>
                </div>
              </div>
              <p>A personal portfolio website showcasing projects, skills, and experience with a modern dark theme, 3D backgrounds, and smooth animations.</p>
              <div className="proj-tech">React &nbsp;·&nbsp; CSS &nbsp;·&nbsp; JavaScript &nbsp;·&nbsp; Three.js</div>
            </div>
            <div className="proj-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </div>
          </a>
        </div>

        <div className="page-footer-nav">
          <a onClick={() => navigateTo('skills')} className="pfn-prev">← Skills</a>
          <a onClick={() => navigateTo('contact')} className="pfn-next">Contact →</a>
        </div>
      </main>
    </div>
  )
}
