import React, { useRef, useState } from 'react';
import './MagicBentoContact.css';

export default function MagicBentoContact({ onCopy }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const errorTimeoutRef = useRef(null);

  const showError = (msg) => {
    setErrorMsg(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setErrorMsg(''), 3500);
  };

  const handleNameChange = (e) => {
    const clean = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setName(clean);
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 0 && !/^[6-9]/.test(raw)) {
      showError('Mobile number must start with 6, 7, 8, or 9.');
      return;
    }
    setPhone(raw.slice(0, 10));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Name validation
    if (!name.trim()) {
      showError('Please enter your Full Name.');
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      showError('Full Name must contain letters and spaces only.');
      return;
    }

    // Phone validation (strictly 10 digits starting with 6, 7, 8, or 9)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      showError('Please enter your 10-digit Mobile Number.');
      return;
    }
    if (!/^[6-9]/.test(cleanPhone)) {
      showError('Mobile number must start with 6, 7, 8, or 9.');
      return;
    }
    if (cleanPhone.length !== 10) {
      showError('Mobile Number must be exactly 10 digits.');
      return;
    }

    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Email validation
    if (!email.trim()) {
      showError('Please enter Your Email Address.');
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Message validation
    if (!message.trim()) {
      showError('Please enter your Message.');
      setLoading(false);
      return;
    }

    try {
      const subject = `Callback Request from ${name}`;
      const fullMessage = `Request Callback Contact Info:\nName: ${name}\nMobile: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;

      const formData = new URLSearchParams();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', fullMessage);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      const data = await response.json();
      if (response.ok) {
        setStep(3); // Success step
      } else {
        showError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      showError('Server connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setStep(1);
    setErrorMsg('');
  };

  return (
    <div className="callback-container-wrapper">
      {/* 3-COLOR AMBIENT FOG EFFECT */}
      <div className="contact-fog-ambient fog-cyan"></div>
      <div className="contact-fog-ambient fog-purple"></div>
      <div className="contact-fog-ambient fog-emerald"></div>

      <div className="callback-card">

        {/* Left Column: Info & Progress */}
        <div className="callback-left-panel">
          <div>
            {/* Rocket Badge */}
            <div className="rocket-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                <path d="M14.05 2a9 9 0 0 1 8 7.94" />
                <path d="M14.05 6a5 5 0 0 1 4 4" />
              </svg>
            </div>

            <h2 className="callback-title">Request a callback</h2>
          </div>

          {/* Progress Bar Area */}
          <div className="callback-progress-area">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: step === 1 ? '50%' : step === 2 ? '100%' : '100%' }} 
              />
            </div>
            <span className="progress-text">
              {step === 3 ? '2/2' : `${step}/2`}
            </span>
          </div>
        </div>

        {/* Right Column: Steps Form */}
        <div className="callback-right-panel">
          <div className={`flip-card-inner ${step >= 2 ? 'is-flipped' : ''}`}>
            
            {/* Front Side: Step 1 Form */}
            <div className="flip-card-front">
              <form onSubmit={handleNextStep} className="callback-form-step">
                {/* CLEAN INLINE ERROR BANNER FOR STEP 1 */}
                {errorMsg && step === 1 && (
                  <div className="callback-inline-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="callback-field-group">
                  <label className="callback-field-label">Full Name<span className="required">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    value={name}
                    onChange={handleNameChange}
                    className="callback-input"
                    required={step === 1}
                  />
                </div>
 
                <div className="callback-field-group">
                  <label className="callback-field-label">Mobile Number<span className="required">*</span></label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 9876543210" 
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    className="callback-input"
                    required={step === 1}
                  />
                </div>

                <button type="submit" className="callback-action-btn">
                  Let's get started
                </button>
              </form>
            </div>

            {/* Back Side: Step 2 Form / Success View */}
            <div className="flip-card-back">
              {step <= 2 ? (
                <form onSubmit={handleSubmit} className="callback-form-step">
                  {/* CLEAN INLINE ERROR BANNER FOR STEP 2 */}
                  {errorMsg && step === 2 && (
                    <div className="callback-inline-error">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="callback-field-group">
                    <label className="callback-field-label">Your Email Address<span className="required">*</span></label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="callback-input"
                      required={step === 2}
                    />
                  </div>

                  <div className="callback-field-group">
                    <label className="callback-field-label">Your Message<span className="required">*</span></label>
                    <textarea 
                      placeholder="Describe your project, ideas, or query..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="callback-textarea"
                      required={step === 2}
                    />
                  </div>

                  <div className="callback-btn-row">
                    <button type="button" onClick={handlePrevStep} className="callback-back-btn">
                      Back
                    </button>
                    <button type="submit" disabled={loading} className="callback-action-btn">
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="callback-success-view">
                  <div className="success-icon-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="success-title">Callback Requested!</h3>
                  <p className="success-desc">
                    Thank you, <strong>{name}</strong>. Your request has been sent. Kushal will call you back shortly on <strong>{phone}</strong>.
                  </p>
                  <button onClick={resetForm} className="callback-action-btn" style={{ marginTop: '8px' }}>
                    Request Another Callback
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
