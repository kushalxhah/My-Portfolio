import React, { useRef, useState } from 'react';
import './ProjectCard.css';

export default function ProjectCard({ num, title, typeName, desc, tech, link, image, fallbackImage, badge, type }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [shineStyle, setShineStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const rotateX = ((y / h) - 0.5) * -8;
    const rotateY = ((x / w) - 0.5) * 8;
    const shineX = (x / w) * 100;
    const shineY = (y / h) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    });

    // Subtle neutral white specular glass reflection
    setShineStyle({
      background: `radial-gradient(circle 280px at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.08) 0%, transparent 80%)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    });
    setShineStyle({ background: 'transparent' });
  };

  return (
    <a
      ref={cardRef}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card-3d project-type-${type || 'web'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...tiltStyle, textDecoration: 'none' }}
    >
      <div className="project-card-shine" style={shineStyle} />

      {/* TOP PREVIEW IMAGE CONTAINER */}
      <div className="project-card-image-wrapper">
        <img 
          src={image} 
          alt={title} 
          className={`project-card-image ${title.toLowerCase() === 'joyspoon' ? 'joyspoon-img' : ''}`}
          onError={(e) => {
            if (fallbackImage) {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }
          }}
        />
        <div className="project-card-image-overlay"></div>

        {/* Top Bar Badges */}
        {badge && (
          <div className="project-image-top-bar">
            <span className="project-type-badge">{badge}</span>
          </div>
        )}

      </div>

      {/* CARD CONTENT */}
      <div className="project-card-content">
        <div className="project-header-row">
          <h3 className="project-card-title">{title}</h3>
        </div>

        <p className="project-card-desc">{desc}</p>

        <div className="project-card-tech">
          {tech.split('·').map((t, idx) => (
            <span key={idx} className="tech-badge">{t.trim()}</span>
          ))}
        </div>
      </div>
    </a>
  );
}
