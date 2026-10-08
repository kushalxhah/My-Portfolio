import React from 'react';
import './ServicesGrid.css';

export default function ServicesGrid() {
  const services = [
    {
      id: '01',
      title: 'Full-Stack Web Development',
      subtitle: 'React.js · Python · Express · MySQL',
      desc: 'Building responsive, scalable web applications with clean architecture, robust backend APIs, and intuitive user interfaces.',
      color: 'purple',
      headerBg: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', // Premium dark purple to indigo
      mainIconBg: 'rgba(167, 139, 250, 0.15)',
      mainIconBorder: 'rgba(167, 139, 250, 0.4)',
      bullets: [
        'Interactive SPA Frontends',
        'Robust RESTful Backend APIs',
        'Database Optimization & Relations'
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
          <line x1="7" y1="8" x2="14" y2="8"></line>
          <line x1="7" y1="12" x2="17" y2="12"></line>
          <line x1="7" y1="16" x2="12" y2="16"></line>
        </svg>
      )
    },
    {
      id: '02',
      title: 'Frontend Engineering',
      subtitle: 'React.js · CSS · Glassmorphism',
      desc: 'Crafting pixel-perfect, high-performance web UIs with smooth animations, dark modes, and dynamic user interactions.',
      color: 'cyan',
      headerBg: 'linear-gradient(135deg, #083344 0%, #06b6d4 100%)', // Premium deep cyan to bright cyan
      mainIconBg: 'rgba(56, 189, 248, 0.15)',
      mainIconBorder: 'rgba(56, 189, 248, 0.4)',
      bullets: [
        'Pixel-Perfect Responsive Designs',
        'Micro-Animations & Interactivity',
        'State Management & Performance'
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      )
    },
    {
      id: '03',
      title: 'Backend Systems',
      subtitle: 'Python · MySQL · REST APIs · SQL',
      desc: 'Designing efficient database schemas, implementing secure authentication flows, and writing reliable server-side application business logic.',
      color: 'emerald',
      headerBg: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', // Premium deep green to emerald
      mainIconBg: 'rgba(52, 211, 153, 0.15)',
      mainIconBorder: 'rgba(52, 211, 153, 0.4)',
      bullets: [
        'Schema Design & Data Integrity',
        'Secure Auth & Session Handling',
        'Fast Routing & Server Architectures'
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="services-section-wrapper">
      <div className="services-grid-container">
        {services.map((srv) => (
          <div key={srv.id} className={`service-experience-card srv-accent-${srv.color}`}>
            
            {/* CARD HEADER: Colored band with Service Title */}
            <div className="service-card-header" style={{ background: srv.headerBg }}>
              <span className="service-header-title">{srv.title}</span>
            </div>

            {/* OVERLAPPING LOGO BADGE (ON THE LEFT SIDE OF THE HEADER BOUNDARY LINE) */}
            <div className="service-logo-badge-container">
              <div className="service-logo-badge" style={{ backgroundColor: '#12131a', borderColor: '#12131a' }}>
                <div className="service-icon-wrapper" style={{ backgroundColor: srv.mainIconBg, border: `1px solid ${srv.mainIconBorder}` }}>
                  {srv.icon}
                </div>
              </div>
            </div>

            {/* CARD BODY */}
            <div className="service-card-body">
              <p className="service-body-desc">{srv.desc}</p>
              
              {/* EXPERIENCE BULLET POINTS */}
              <ul className="service-bullets-list">
                {srv.bullets.map((bullet, idx) => (
                  <li key={idx} className="service-bullet-item">
                    <span className="bullet-dot"></span>
                    <span className="bullet-text">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
