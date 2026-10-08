import React from 'react';
import './SocialConnect.css';

export default function SocialConnect({ onCopyEmail }) {
  const socials = [
    {
      id: 'github',
      name: 'GitHub',
      handle: '@kushalxhah',
      url: 'https://github.com/kushalxhah',
      accentColor: '#94a3b8',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Kushal Shah',
      url: 'https://www.linkedin.com/in/kushal-shah-7282b6307/',
      accentColor: '#38bdf8',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    },
    {
      id: 'email',
      name: 'Email',
      handle: 'kushalkshah1606@gmail.com',
      action: () => onCopyEmail('kushalkshah1606@gmail.com', 'Email'),
      accentColor: '#f43f5e',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      )
    },
    {
      id: 'phone',
      name: 'Phone',
      handle: '+91 9558326324',
      action: () => onCopyEmail('+91 9558326324', 'Phone Number'),
      accentColor: '#34d399',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      )
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@kkshah006',
      url: 'https://www.instagram.com/kkshah006/',
      accentColor: '#a78bfa',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      id: 'cv',
      name: 'Download CV',
      handle: '',
      url: '/Kushal_Shah_CV.pdf',
      download: true,
      accentColor: '#a855f7',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
  ];

  return (
    <div className="social-circular-section">
      <div className="social-circular-row">
        {socials.map((item) => (
          <a
            key={item.id}
            href={item.url || '#'}
            target={item.url ? "_blank" : "_self"}
            rel="noopener noreferrer"
            download={item.download ? "Kushal_Shah_CV.pdf" : undefined}
            className="social-circle-item"
            style={{ '--item-accent': item.accentColor }}
            onClick={(e) => {
              if (item.action) {
                e.preventDefault();
                item.action();
              }
            }}
          >
            {/* Compact Dark Glass Circle */}
            <div className="circle-icon-box">
              {item.icon}
            </div>

            {/* Hover Tooltip / Label */}
            <div className="circle-hover-tooltip">
              <span className="tooltip-title">{item.name}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
