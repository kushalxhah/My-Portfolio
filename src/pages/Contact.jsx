import React, { useEffect, useRef, useState } from 'react'
import './Contact.css'

export default function Contact({ navigateTo }) {
  const canvasRef = useRef(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
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

    // Diagonal thin lines
    const LINE_COUNT = 18
    const lines = Array.from({ length: LINE_COUNT }, (_, i) => ({
      offset: (i / LINE_COUNT) * W * 2,
      speed: 0.12 + Math.random() * 0.1,
      opacity: 0.03 + Math.random() * 0.04,
      color: i % 3 === 0 ? '167,139,250' : '200,184,162',
    }))

    // Floating dots
    const DOT_COUNT = 55
    const dots = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: 0.2 + Math.random() * 0.4,
      color: Math.random() > 0.6 ? '167,139,250' : '200,184,162',
    }))

    function drawCornerAccent() {
      const grad = ctx.createRadialGradient(W, H, 0, W, H, W * 0.7)
      grad.addColorStop(0, 'rgba(167,139,250,0.06)')
      grad.addColorStop(0.5, 'rgba(167,139,250,0.02)')
      grad.addColorStop(1, 'rgba(167,139,250,0)')
      ctx.beginPath()
      ctx.arc(W, H, W * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Top-left accent
      const grad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.5)
      grad2.addColorStop(0, 'rgba(200,184,162,0.05)')
      grad2.addColorStop(0.5, 'rgba(200,184,162,0.015)')
      grad2.addColorStop(1, 'rgba(200,184,162,0)')
      ctx.beginPath()
      ctx.arc(0, 0, W * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = grad2
      ctx.fill()
    }

    let animationId
    function draw() {
      animationId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)

      drawCornerAccent()

      // Diagonal moving lines
      lines.forEach((l) => {
        l.offset -= l.speed
        if (l.offset < -W) l.offset = W * 2

        ctx.save()
        ctx.translate(l.offset, 0)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-H, H)
        ctx.strokeStyle = `rgba(${l.color},${l.opacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()
      })

      // Dots
      dots.forEach((d) => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = W
        if (d.x > W) d.x = 0
        if (d.y < 0) d.y = H
        if (d.y > H) d.y = 0

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.color},${d.opacity})`
        ctx.fill()
      })
    }
    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(`Copied ${label}!`)
      setTimeout(() => setCopyStatus(''), 2000)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      e.target.reset()
    }, 3000)
  }

  return (
    <div className="page-contact">
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <main className="contact-main">
        <h1 className="page-title">
          <span className="title-line"><span className="title-inner">LET'S</span></span>
          <span className="title-line"><span className="title-inner title-stroke">CONNECT</span></span>
        </h1>

        {copyStatus && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: 'var(--accent)',
            color: 'var(--bg)',
            padding: '12px 24px',
            borderRadius: '4px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.75rem',
            zIndex: 9999,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
          }}>
            {copyStatus}
          </div>
        )}

        <div className="contact-list">
          <div className="contact-row contact-row-static" onClick={() => copyToClipboard('+91 9558326324', 'Phone')}>
            <div className="cr-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <div className="cr-info">
              <span className="cr-label">Phone</span>
              <span className="cr-value">+91 9558326324</span>
            </div>
          </div>

          <div className="contact-row contact-row-static" onClick={() => copyToClipboard('kushalkshah1606@gmail.com', 'Email')}>
            <div className="cr-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="cr-info">
              <span className="cr-label">Email</span>
              <span className="cr-value">kushalkshah1606@gmail.com</span>
            </div>
          </div>

          <div className="contact-row contact-row-static" onClick={() => copyToClipboard('linkedin.com/in/kushal-shah-7282b6307', 'LinkedIn')}>
            <div className="cr-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div className="cr-info">
              <span className="cr-label">LinkedIn</span>
              <span className="cr-value">linkedin.com/in/kushal-shah-7282b6307</span>
            </div>
          </div>

          <a href="resume.pdf" target="_blank" rel="noopener noreferrer" className="contact-row resume-row">
            <div className="cr-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9,15 12,18 15,15"/></svg>
            </div>
            <div className="cr-info">
              <span className="cr-label">Resume</span>
              <span className="cr-value">Download CV</span>
            </div>
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="cf-label">Send me a message</div>
          <div className="cf-row">
            <div className="cf-field">
              <label className="cf-field-label">Your Name</label>
              <input type="text" className="cf-input" placeholder="John Doe" required />
            </div>
            <div className="cf-field">
              <label className="cf-field-label">Your Email</label>
              <input type="email" className="cf-input" placeholder="john@example.com" required />
            </div>
          </div>
          <div className="cf-field">
            <label className="cf-field-label">Message</label>
            <textarea className="cf-input cf-textarea" placeholder="Hello, I would like to build..." required></textarea>
          </div>
          <button type="submit" className="cf-btn">
            <span>{formSubmitted ? 'Message Sent!' : 'Send Message'}</span>
          </button>
        </form>

        <div className="page-footer-nav">
          <a onClick={() => navigateTo('projects')} className="pfn-prev">← Projects</a>
          <a onClick={() => navigateTo('home')} className="pfn-next">Back to Home →</a>
        </div>
      </main>
    </div>
  )
}
