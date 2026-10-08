import React from 'react';
import './InteractiveSkills.css';

export default function InteractiveSkills() {
  const devicon = (path) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

  const groups = [
    {
      id: 'languages',
      category: 'Languages',
      badge: 'Logic & Scripts',
      tag: 'Core Syntax',
      headerBg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Blue/Indigo
      mainIconBg: 'rgba(59, 130, 246, 0.15)',
      mainIconBorder: 'rgba(59, 130, 246, 0.4)',
      // Relatable Icon: Code Brackets < />
      mainIcon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      skills: [
        { name: 'Java', icon: devicon('java/java-original.svg') },
        { name: 'Python', icon: devicon('python/python-original.svg') },
        { name: 'Java Script', icon: devicon('javascript/javascript-original.svg') },
        { name: 'SQL', icon: devicon('mysql/mysql-original.svg') },
        { name: 'HTML5', icon: devicon('html5/html5-original.svg') },
        { name: 'CSS3', icon: devicon('css3/css3-original.svg') },
      ]
    },
    {
      id: 'frameworks',
      category: 'Frameworks',
      badge: 'UI & Structures',
      tag: 'Client-Side & Analysis',
      headerBg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)', // Deep Orange
      mainIconBg: 'rgba(234, 88, 12, 0.15)',
      mainIconBorder: 'rgba(234, 88, 12, 0.4)',
      // Relatable Icon: Structural Grid Blocks
      mainIcon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1"></rect>
          <rect x="14" y="3" width="7" height="5" rx="1"></rect>
          <rect x="14" y="12" width="7" height="9" rx="1"></rect>
          <rect x="3" y="16" width="7" height="5" rx="1"></rect>
        </svg>
      ),
      skills: [
        { name: 'React.js', icon: devicon('react/react-original.svg') },
        { name: 'Tailwind', icon: devicon('tailwindcss/tailwindcss-original.svg') },
        { name: 'Bootstrap', icon: devicon('bootstrap/bootstrap-original.svg') },
        { name: 'Streamlit', icon: devicon('streamlit/streamlit-original.svg') },
        { name: 'NumPy', icon: devicon('numpy/numpy-original.svg') },
        { name: 'Pandas', icon: devicon('pandas/pandas-original.svg') },
      ]
    },
    {
      id: 'tools',
      category: 'Tools',
      badge: 'Hubs & Editors',
      tag: 'DevOps & Custom Assets',
      headerBg: 'linear-gradient(135deg, #991b1b 0%, #f43f5e 100%)', // Red/Rose
      mainIconBg: 'rgba(244, 63, 94, 0.15)',
      mainIconBorder: 'rgba(244, 63, 94, 0.4)',
      // Relatable Icon: Wrench/Tool
      mainIcon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      skills: [
        { name: 'GitHub', icon: devicon('github/github-original.svg'), invert: true },
        { name: 'Vercel', icon: devicon('vercel/vercel-original.svg'), invert: true },
        { name: 'VS Code', icon: devicon('vscode/vscode-original.svg') },
        { name: 'Jupyter', icon: devicon('jupyter/jupyter-original.svg') },
        { name: 'Docker', icon: devicon('docker/docker-original.svg') },
        { name: 'Canva', icon: devicon('canva/canva-original.svg') },
      ]
    }
  ];

  return (
    <div className="bento-skills-section">
      <div className="bento-skills-grid-wrapper">
        {groups.map((group) => (
          <div key={group.id} className={`bento-experience-card bento-accent-${group.id}`}>
            
            {/* CARD HEADER: Colored band */}
            <div className="bento-card-header" style={{ background: group.headerBg }}>
              <span className="bento-header-title">{group.category}</span>
            </div>

            {/* OVERLAPPING LOGO BADGE (OVERLAPPING THE LEFT BORDER, HALF IN HALF OUT) */}
            <div className="bento-logo-badge-container">
              <div className="bento-logo-badge" style={{ backgroundColor: '#12131a', borderColor: '#12131a' }}>
                <div className="bento-icon-wrapper" style={{ backgroundColor: group.mainIconBg, border: `1px solid ${group.mainIconBorder}` }}>
                  {group.mainIcon}
                </div>
              </div>
            </div>

            {/* CARD BODY */}
            <div className="bento-card-body">
              {/* ATTRACTIVE SQUARE CARD GRID OF SKILLS */}
              <div className="bento-inner-skills-grid">
                {group.skills.map((skill, idx) => (
                  <div key={idx} className="bento-inner-skill-card">
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className={skill.invert ? 'invert-icon' : ''}
                    />
                    <span className="bento-inner-skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
