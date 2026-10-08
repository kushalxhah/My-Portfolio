import React, { useEffect, useRef, useState } from 'react'
import './About.css'

export default function About({ navigateTo }) {
  const canvasRef = useRef(null)
  const [roleText, setRoleText] = useState('')

  useEffect(() => {
    // ===== ORBIT BG =====
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const systems = [
      { x: 0.25, y: 0.35 },
      { x: 0.75, y: 0.65 },
      { x: 0.55, y: 0.2 },
      { x: 0.15, y: 0.75 },
      { x: 0.85, y: 0.3 },
    ]

    const orbiters = []
    systems.forEach((s) => {
      const count = 3 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        orbiters.push({
          cx: s.x,
          cy: s.y,
          radius: 40 + i * 35,
          angle: Math.random() * Math.PI * 2,
          speed: (0.003 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
          dotR: 1.2 + Math.random() * 1.2,
          color: i % 2 === 0 ? '200,184,162' : '167,139,250',
          trailLen: 40 + Math.floor(Math.random() * 40),
          trail: [],
        })
      }
    })

    let animationId
    function draw() {
      animationId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)

      // Draw orbit rings
      systems.forEach((s) => {
        for (let r = 40; r <= 180; r += 35) {
          ctx.beginPath()
          ctx.arc(s.cx * W, s.cy * H, r, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(200,184,162,0.04)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      // Update and draw orbiters
      orbiters.forEach((o) => {
        o.angle += o.speed
        const x = o.cx * W + Math.cos(o.angle) * o.radius
        const y = o.cy * H + Math.sin(o.angle) * o.radius

        // Trail
        o.trail.push({ x, y })
        if (o.trail.length > o.trailLen) o.trail.shift()

        for (let i = 1; i < o.trail.length; i++) {
          const alpha = (i / o.trail.length) * 0.25
          ctx.beginPath()
          ctx.moveTo(o.trail[i - 1].x, o.trail[i - 1].y)
          ctx.lineTo(o.trail[i].x, o.trail[i].y)
          ctx.strokeStyle = `rgba(${o.color},${alpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        // Dot
        ctx.beginPath()
        ctx.arc(x, y, o.dotR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${o.color},0.9)`
        ctx.fill()
      })
    }
    draw()

    // ===== TYPEWRITER EFFECT =====
    const aboutRoles = ['Web Developer', 'Python Developer', 'UI Designer', 'Problem Solver']
    let ari = 0
    let aci = 0
    let adeleting = false
    let timerId

    function aboutType() {
      const word = aboutRoles[ari]
      if (!adeleting) {
        setRoleText(word.slice(0, ++aci))
        if (aci === word.length) {
          adeleting = true
          timerId = setTimeout(aboutType, 1400)
          return
        }
        timerId = setTimeout(aboutType, 90)
      } else {
        setRoleText(word.slice(0, --aci))
        if (aci === 0) {
          adeleting = false
          ari = (ari + 1) % aboutRoles.length
        }
        timerId = setTimeout(aboutType, 40)
      }
    }
    const startTimer = setTimeout(aboutType, 600)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      clearTimeout(startTimer)
      clearTimeout(timerId)
    }
  }, [])

  return (
    <div className="page-about">
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <main className="about-main">
        <h1 className="about-hero-title">
          <span className="about-line"><span className="about-inner">ABOUT</span></span>
          <span className="about-line"><span className="about-inner about-stroke">ME</span></span>
        </h1>

        <div className="about-identity">
          <div className="avatar">
            <img src="assets/avatar.jpg" alt="Kushal Shah" className="avatar-img" />
            <div className="avatar-ring"></div>
          </div>
          <div className="about-identity-text">
            <h2 className="about-name">Kushal Shah</h2>
            <p className="about-role">
              <span>{roleText}</span>
              <span className="about-cursor">|</span>
            </p>
            <p className="about-bio">
              I am a passionate IT field developer with practical knowledge of Python and web development, gained through
              academic learning and project work, aiming to build efficient and user-friendly applications.
            </p>
          </div>
        </div>

        <div className="about-section">
          <div className="about-section-label">
            <h3 className="section-title">EDUCATION</h3>
          </div>
          <div className="about-section-body">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-head">
                    <span className="timeline-degree">SSC — 10th Grade</span>
                    <span class="timeline-badge">98.46%</span>
                  </div>
                  <span className="timeline-org">Ultra Vision Academy School &nbsp;·&nbsp; Gujarat Board</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-head">
                    <span className="timeline-degree">HSC — 12th Grade</span>
                    <span className="timeline-badge">78%</span>
                  </div>
                  <span className="timeline-org">Ultra Vision Academy School &nbsp;·&nbsp; Gujarat Board</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-head">
                    <span className="timeline-degree">Bachelor of Engineering</span>
                    <span className="timeline-badge">6.8+</span>
                  </div>
                  <span className="timeline-org">Lok Jagruti University &nbsp;·&nbsp; 2024 – 2028</span>
                  <ul className="timeline-points">
                    <li>Building Strong Foundations</li>
                    <li>Developing real-world Projects</li>
                    <li>Actively Improving problem-solving skills</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer-nav">
          <a onClick={() => navigateTo('home')} className="pfn-prev">← Home</a>
          <a onClick={() => navigateTo('skills')} className="pfn-next">Skills →</a>
        </div>
      </main>
    </div>
  )
}
