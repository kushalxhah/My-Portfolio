import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Skills.css'

export default function Skills({ navigateTo }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    renderer.setPixelRatio(1) // fixed to 1 for performance
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200)
    camera.position.set(0, 0, 22)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.08))
    const pl1 = new THREE.PointLight(0xc8b8a2, 4, 50)
    pl1.position.set(8, 8, 10)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0xa78bfa, 3, 45)
    pl2.position.set(-8, -6, 8)
    scene.add(pl2)

    // Nodes
    const nodeCount = 50
    const nodes = []
    const nodeGeo = new THREE.SphereGeometry(0.12, 5, 5)

    for (let i = 0; i < nodeCount; i++) {
      const color = Math.random() > 0.5 ? 0xc8b8a2 : 0xa78bfa
      const mat = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(nodeGeo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 34,
        (Math.random() - 0.5) * 16 - 2
      )
      scene.add(mesh)
      nodes.push({
        mesh,
        basePos: mesh.position.clone(),
        floatSpeed: 0.15 + Math.random() * 0.2,
        floatAmp: 0.2 + Math.random() * 0.3,
        floatOffset: Math.random() * Math.PI * 2,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    // Connections
    const maxDist = 9
    const linePositions = []
    const connections = []

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].basePos.distanceTo(nodes[j].basePos) < maxDist) {
          linePositions.push(
            nodes[i].basePos.x, nodes[i].basePos.y, nodes[i].basePos.z,
            nodes[j].basePos.x, nodes[j].basePos.y, nodes[j].basePos.z
          )
          connections.push([i, j])
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    const linePosAttr = new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    linePosAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', linePosAttr)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc8b8a2,
      transparent: true,
      opacity: 0.07,
    })
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineSegments)

    // Pulses
    const pulseGeo = new THREE.SphereGeometry(0.07, 4, 4)
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xf0ede8,
      transparent: true,
      opacity: 0.9,
    })
    const pulses = connections.slice(0, 15).map(([i, j]) => {
      const mesh = new THREE.Mesh(pulseGeo, pulseMat)
      scene.add(mesh)
      return { mesh, i, j, t: Math.random() }
    })

    // Particles
    const pCount = 300
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 60
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 44
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 6
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xc8b8a2,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
    })
    const points = new THREE.Points(pGeo, pMat)
    scene.add(points)

    // Mouse drift
    let tRX = 0, tRY = 0
    const handleMouseMove = (e) => {
      tRY = (e.clientX / window.innerWidth - 0.5) * 1.4
      tRX = (e.clientY / window.innerHeight - 0.5) * 0.9
    }
    document.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    const clock = new THREE.Clock()
    let frame = 0
    let animationId

    function animate() {
      animationId = requestAnimationFrame(animate)
      frame++
      const t = clock.getElapsedTime()

      // Update nodes
      nodes.forEach((n) => {
        n.mesh.position.y = n.basePos.y + Math.sin(t * n.floatSpeed + n.floatOffset) * n.floatAmp
        n.mesh.position.x = n.basePos.x + Math.cos(t * n.floatSpeed * 0.7 + n.floatOffset) * n.floatAmp * 0.4
        if (frame % 2 === 0) {
          const s = 1 + Math.sin(t * 1.5 + n.pulseOffset) * 0.3
          n.mesh.scale.setScalar(s)
        }
      })

      // Update lines
      if (frame % 3 === 0) {
        const arr = linePosAttr.array
        let ptr = 0
        connections.forEach(([i, j]) => {
          const a = nodes[i].mesh.position
          const b = nodes[j].mesh.position
          arr[ptr++] = a.x
          arr[ptr++] = a.y
          arr[ptr++] = a.z
          arr[ptr++] = b.x
          arr[ptr++] = b.y
          arr[ptr++] = b.z
        })
        linePosAttr.needsUpdate = true
      }

      // Move pulses
      pulses.forEach((p) => {
        p.t = (p.t + 0.005) % 1
        const a = nodes[p.i].mesh.position
        const b = nodes[p.j].mesh.position
        p.mesh.position.lerpVectors(a, b, p.t)
        p.mesh.material.opacity = Math.sin(p.t * Math.PI) * 0.85
      })

      // Camera drift
      camera.position.x += (tRY * 1.5 - camera.position.x) * 0.04
      camera.position.y += (-tRX * 1.0 - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      nodeGeo.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      pulseGeo.dispose()
      pulseMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="page-skills">
      <canvas ref={canvasRef} id="webgl" />
      <main className="skills-main">
        <h1 className="page-title">
          <span className="title-line"><span className="title-inner">MY</span></span>
          <span className="title-line"><span className="title-inner title-stroke">SKILLS</span></span>
        </h1>

        <div className="skills-section">
          <div className="skills-group">
            <div className="skills-group-left">
              <span className="skills-group-num">01</span>
              <p className="skills-category">Languages</p>
            </div>
            <div className="skills-grid">
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java"/><span className="skill-name">Java</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python"/><span className="skill-name">Python</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript"/><span className="skill-name">JavaScript</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="DBMS"/><span className="skill-name">DBMS</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5"/><span className="skill-name">HTML5</span></div>
            </div>
          </div>

          <div className="skills-group">
            <div className="skills-group-left">
              <span className="skills-group-num">02</span>
              <p className="skills-category">Frameworks</p>
            </div>
            <div className="skills-grid">
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap"/><span className="skill-name">Bootstrap</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind"/><span className="skill-name">Tailwind</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" alt="Pandas"/><span className="skill-name">Pandas</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" alt="NumPy"/><span className="skill-name">NumPy</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg" alt="Streamlit"/><span className="skill-name">Streamlit</span></div>
            </div>
          </div>

          <div className="skills-group">
            <div className="skills-group-left">
              <span className="skills-group-num">03</span>
              <p className="skills-category">Tools</p>
            </div>
            <div className="skills-grid">
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={{ filter: 'invert(1)' }}/><span className="skill-name">GitHub</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" alt="Vercel" style={{ filter: 'invert(1)' }}/><span className="skill-name">Vercel</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code"/><span className="skill-name">VS Code</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" alt="Jupyter"/><span className="skill-name">Jupyter</span></div>
              <div className="skill-card"><img src="https://kiro.dev/favicon.ico" alt="Kiro"/><span className="skill-name">Kiro</span></div>
              <div className="skill-card"><img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/canva-icon.svg" alt="Canva"/><span className="skill-name">Canva</span></div>
              <div className="skill-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg" alt="Streamlit Cloud"/><span className="skill-name">Streamlit Cloud</span></div>
            </div>
          </div>
        </div>

        <div className="page-footer-nav">
          <a onClick={() => navigateTo('about')} className="pfn-prev">← About Me</a>
          <a onClick={() => navigateTo('projects')} className="pfn-next">Projects →</a>
        </div>
      </main>
    </div>
  )
}
