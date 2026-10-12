import React, { useState, useEffect, useRef } from 'react'
import ProjectCard from './components/ProjectCard.jsx'
import SplitText from './components/SplitText.jsx'
import CodeEditorMockup from './components/CodeEditorMockup.jsx'
import Animated3DBackground from './components/Animated3DBackground.jsx'
import InteractiveSkills from './components/InteractiveSkills.jsx'

import MagicBentoContact from './components/MagicBentoContact.jsx'
import ServicesGrid from './components/ServicesGrid.jsx'
import SocialConnect from './components/SocialConnect.jsx'
import { useRoleCycler } from './hooks/useRoleCycler.js'
import brtsPortalImage from './assets/brts_portal.png'
import joyspoonImg from './assets/joyspoon_mukhvas.png'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [copiedText, setCopiedText] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const { displayText: roleDisplayText, phase: rolePhase } = useRoleCycler()
  const [activeCategory, setActiveCategory] = useState(0)

  const skillCategories = ['Languages', 'Frameworks', 'Tools']
  
  const skillsData = {
    0: {
      title: 'Languages',
      items: ['Java', 'Python', 'JavaScript', 'SQL (MySQL)', 'HTML5 / CSS3'],
      logos: [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg'
      ]
    },
    1: {
      title: 'Frameworks',
      items: ['React.js', 'Tailwind CSS', 'Bootstrap', 'Streamlit', 'NumPy', 'Pandas'],
      logos: [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
      ]
    },
    2: {
      title: 'Tools',
      items: ['Git & GitHub', 'Vercel', 'VS Code', 'Jupyter', 'Canva'],
      logos: [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg'
      ]
    }
  }

  const homeRef = useRef(null)
  const servicesRef = useRef(null)
  const projectsRef = useRef(null)
  const skillsRef = useRef(null)
  const educationRef = useRef(null)
  const contactRef = useRef(null)

  // Force scroll to top on page refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  // Section Intersection Observer (Scroll Spy)
  useEffect(() => {
    const sections = [
      { id: 'home', ref: homeRef },
      { id: 'services', ref: servicesRef },
      { id: 'projects', ref: projectsRef },
      { id: 'skills', ref: skillsRef },
      { id: 'education', ref: educationRef },
      { id: 'contact', ref: contactRef }
    ]

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section')
          setActiveSection(sectionId)
        }
      })
    }, observerOptions)

    sections.forEach((s) => {
      if (s.ref.current) {
        observer.observe(s.ref.current)
      }
    })

    return () => {
      sections.forEach((s) => {
        if (s.ref.current) {
          observer.unobserve(s.ref.current)
        }
      })
    }
  }, [])

  // Staggered Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, { threshold: 0.08 })

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const handleNavClick = (sectionId) => {
    const el = document.getElementById(sectionId)
    if (el) {
      const offset = 90
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(`Copied ${label}!`)
      setTimeout(() => setCopiedText(''), 2000)
    })
  }

  const projectsData = [
    {
      num: '01',
      type: 'web',
      typeName: 'E-Commerce Showcase',
      title: 'Joyspoon',
      desc: 'A digital showcase for Joyspoon, a premium Indian Mukhvas & mouth freshener brand, featuring interactive product catalog grids, sleek micro-interactions, and order inquiry flows.',
      tech: 'HTML5 · CSS3 · JavaScript',
      link: 'https://joyspoon-sooty.vercel.app/',
      image: joyspoonImg,
      fallbackImage: joyspoonImg
    },
    {
      num: '02',
      type: 'portal',
      typeName: 'Full Stack Portal',
      title: 'BRTS Portal',
      desc: 'A Bus Rapid Transit System management tool streamlining route planning, timing displays, and schedule operations for users.',
      tech: 'Streamlit · Python · MySQL · CSS',
      link: 'https://brts-app-7yiwjohpqoar3mu8j5pzie.streamlit.app/',
      image: brtsPortalImage,
      fallbackImage: brtsPortalImage
    }
  ]
  const filteredProjects = projectsData.filter(
    (p) => projectFilter === 'all' || p.type === projectFilter
  )

  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current
    if (diffX > 50) {
      setActiveProjectIdx((prev) => (prev + 1) % filteredProjects.length)
    } else if (diffX < -50) {
      setActiveProjectIdx((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length)
    }
  }

  const getSkillLogos = (skillName) => {
    const devicon = (path) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;
    switch (skillName) {
      case 'Java':
        return [devicon('java/java-original.svg')];
      case 'Python':
        return [devicon('python/python-original.svg')];
      case 'JavaScript':
        return [devicon('javascript/javascript-original.svg')];
      case 'SQL (MySQL)':
        return [devicon('mysql/mysql-original.svg')];
      case 'HTML5 / CSS3':
        return [
          devicon('html5/html5-original.svg'),
          devicon('css3/css3-original.svg')
        ];
      case 'React.js':
        return [devicon('react/react-original.svg')];
      case 'Tailwind CSS':
        return [devicon('tailwindcss/tailwindcss-original.svg')];
      case 'Bootstrap':
        return [devicon('bootstrap/bootstrap-original.svg')];
      case 'Streamlit':
        return [devicon('python/python-original.svg')];
      case 'NumPy':
        return [devicon('numpy/numpy-original.svg')];
      case 'Pandas':
        return [devicon('pandas/pandas-original.svg')];
      case 'Git & GitHub':
        return [
          devicon('git/git-original.svg'),
          devicon('github/github-original.svg')
        ];
      case 'Vercel':
        return [devicon('vercel/vercel-original.svg')];
      case 'VS Code':
        return [devicon('vscode/vscode-original.svg')];
      case 'Jupyter':
        return [devicon('jupyter/jupyter-original.svg')];
      case 'Canva':
        return [devicon('canva/canva-original.svg')];
      default:
        return [devicon('github/github-original.svg')];
    }
  };

  return (
    <>
      {/* Floating Glassmorphic Bottom Dock Navbar (Global) */}
      <header className="nav-header-wrapper">
        <nav className="nav-header">
          <ul className="nav-tabs">
            <li 
              className={`nav-tab ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
              data-tooltip="About Me"
            >
              <span className="nav-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
            </li>
            <li 
              className={`nav-tab ${activeSection === 'services' ? 'active' : ''}`}
              onClick={() => handleNavClick('services')}
              data-tooltip="My Services"
            >
              <span className="nav-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </span>
            </li>
            <li 
              className={`nav-tab ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => handleNavClick('projects')}
              data-tooltip="My Projects"
            >
              <span className="nav-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              </span>
            </li>
            <li 
              className={`nav-tab ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => handleNavClick('skills')}
              data-tooltip="Technical Skills"
            >
              <span className="nav-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
              </span>
            </li>

            <li 
              className={`nav-tab ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
              data-tooltip="Let's Connect"
            >
              <span className="nav-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </span>
            </li>
          </ul>
        </nav>
      </header>


      {copiedText && (
        <div className="copied-toast-banner">
          <svg className="toast-success-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>{copiedText}</span>
        </div>
      )}

      {/* Main Layout content */}
      <div className="portfolio-layout">
        <Animated3DBackground />

        {/* SECTION: HOME/HERO (Split Layout with VS Code mockup on the right) */}
        <section id="home" data-section="home" ref={homeRef} className="section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="hero-container reveal-on-scroll" style={{ position: 'relative', zIndex: 5 }}>
            <div className="hero-content">
              <h1 className="hero-title">
                <SplitText
                  text="Kushal Shah"
                  delay={100}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                  tag="span"
                />
              </h1>
              <p className="hero-desc">
                I am a{' '}
                <strong>
                  <span className="hero-typing-text">
                    {roleDisplayText}
                  </span>
                  <span className="hero-typing-cursor" aria-hidden="true">
                    {rolePhase !== 'pausing' ? '|' : <span style={{opacity:0}}>|</span>}
                  </span>
                </strong>
                <br /><br />
                Currently pursuing my <strong style={{ color: '#ffffff', fontWeight: 600 }}>B.E. in Information Technology</strong> at <strong style={{ color: '#ffffff', fontWeight: 600 }}>Lok Jagruti University</strong> (2024 – 2028), focusing on building clean, robust, and highly functional web applications.
              </p>
            </div>

            <div className="hero-avatar-area">
              <CodeEditorMockup roleText={roleDisplayText} />
            </div>
          </div>
        </section>

        {/* SECTION: SERVICES & OPEN TO WORK */}
        <section id="services" data-section="services" ref={servicesRef} className="section-dark">
          <div className="section-wrapper reveal-on-scroll">
            <h2 className="section-title">My Services</h2>
            <ServicesGrid 
              onContactClick={() => handleNavClick('contact')} 
              onCopyEmail={() => copyToClipboard('kushalkshah1606@gmail.com', 'Email Address')}
            />
          </div>
        </section>

        {/* SECTION: PROJECTS */}
        <section id="projects" data-section="projects" ref={projectsRef} className="section-dark">
          <div className="section-wrapper reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <h2 className="section-title">My Projects</h2>
            {/* Desktop / Laptop Grid Layout */}
            <div className="projects-grid">
              {filteredProjects.map((p) => (
                <ProjectCard
                  key={p.num}
                  num={p.num}
                  title={p.title}
                  typeName={p.typeName}
                  desc={p.desc}
                  tech={p.tech}
                  link={p.link}
                  image={p.image}
                  fallbackImage={p.fallbackImage}
                  badge={p.badge}
                  type={p.type}
                />
              ))}
            </div>

            {/* Mobile Swipeable Stack Deck Layout */}
            <div 
              className="projects-mobile-stack"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {filteredProjects.map((p, idx) => {
                const positionClass = idx === activeProjectIdx ? 'active-card' : 'stacked-card';
                return (
                  <div 
                    key={p.num} 
                    className={`project-stack-item ${positionClass}`}
                    onClick={(e) => {
                      if (idx !== activeProjectIdx) {
                        e.preventDefault();
                        setActiveProjectIdx(idx);
                      }
                    }}
                  >
                    <ProjectCard
                      num={p.num}
                      title={p.title}
                      typeName={p.typeName}
                      desc={p.desc}
                      tech={p.tech}
                      link={p.link}
                      image={p.image}
                      fallbackImage={p.fallbackImage}
                      badge={p.badge}
                      type={p.type}
                    />
                  </div>
                );
              })}


            </div>
          </div>
        </section>

        {/* SECTION: SKILLS */}
        <section id="skills" data-section="skills" ref={skillsRef} className="section-dark">
          <div className="section-wrapper reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <h2 className="section-title">Technical Skills</h2>

            <InteractiveSkills />
          </div>
        </section>

        <section id="contact" data-section="contact" ref={contactRef} className="section-light">
          <div className="section-wrapper reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <h2 className="section-title">Let's Connect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* DEDICATED SOCIAL ICONS CONNECT SECTION */}
              <SocialConnect onCopyEmail={copyToClipboard} />

              {/* BENTO FORM */}
              <MagicBentoContact onCopy={copyToClipboard} />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
