import React, { useState, useEffect } from 'react';
import Overlay from '../Overlay';
import { Hexagon, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { useUi } from '../../context/UiContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function ConsultationOverlay() {
  const { isConsultationOpen, closeConsultation, isAuthPromptOpen, authPromptMessage, closeAuthPrompt } = useUi();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const navigate = useNavigate();

  const { currentUser, displayName } = useAuth();

  const [formData, setFormData] = useState({
    name: displayName || '',
    email: currentUser?.email || '',
    phone: '',
    service: '',
    brief: '',
    contactMode: 'email'
  });

  const [prevCurrentUser, setPrevCurrentUser] = useState(currentUser);
  const [prevDisplayName, setPrevDisplayName] = useState(displayName);

  if (currentUser !== prevCurrentUser || displayName !== prevDisplayName) {
    setPrevCurrentUser(currentUser);
    setPrevDisplayName(displayName);
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || displayName || '',
        email: prev.email || currentUser.email || ''
      }));
    }
  }

  // Handle auto-dismiss
  useEffect(() => {
    let timer;
    if (isSuccess && isConsultationOpen) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            closeConsultation();
            setIsSuccess(false);
            setTimeLeft(5);
            setFormData({ name: '', email: '', phone: '', service: '', brief: '', contactMode: 'email' });
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSuccess, isConsultationOpen, closeConsultation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service) return;
    
    setIsLoading(true);
    setTimeout(() => {
      // Save to localStorage
      const prev = JSON.parse(localStorage.getItem('archive_consultations') || '[]');
      localStorage.setItem('archive_consultations', JSON.stringify([...prev, { ...formData, date: new Date().toISOString() }]));
      
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  // If this overlay is being used for login prompt instead of normal consultation
  if (isAuthPromptOpen) {
    return (
      <Overlay isOpen={isAuthPromptOpen} onClose={closeAuthPrompt} maxWidth="500px">
        <div className="p-9 text-center">
          <Hexagon className="w-12 h-12 text-accent-gold mx-auto mb-6" strokeWidth={1} />
          <h3 className="font-serif text-2xl text-text-primary mb-3">{authPromptMessage.title || 'Sign in to ArcHive'}</h3>
          <p className="font-sans text-[15px] text-text-muted mb-8 leading-relaxed">
            {authPromptMessage.message || 'Create your ArcHive account to start publishing your architecture projects.'}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => { closeAuthPrompt(); navigate('/login'); }}
              className="w-full bg-accent-gold text-bg-dark h-12 rounded flex items-center justify-center font-sans font-medium hover:bg-accent-gold-hover transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => { closeAuthPrompt(); navigate('/signup'); }}
              className="w-full border border-accent-gold text-accent-gold h-12 rounded flex items-center justify-center font-sans font-medium hover:bg-accent-gold/5 transition-colors"
            >
              Create Account
            </button>
            <button 
              onClick={closeAuthPrompt}
              className="mt-2 text-text-muted text-sm hover:text-text-primary underline transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  const isValid = (formData.name || currentUser) && (formData.email || currentUser) && formData.service;

  return (
    <Overlay isOpen={isConsultationOpen} onClose={() => {
      closeConsultation();
      setTimeout(() => {
        setIsSuccess(false);
        setTimeLeft(5);
        setFormData({ name: '', email: '', phone: '', service: '', brief: '', contactMode: 'email' });
      }, 300);
    }} maxWidth="600px">
      <div className="p-[36px] px-[40px] relative overflow-hidden">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full min-h-[400px]">
             <motion.div
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 0.8 }}
             >
                <Hexagon className="w-16 h-16 text-accent-gold mb-6" strokeWidth={1.5} />
             </motion.div>
             <h3 className="font-serif text-[22px] text-accent-gold mb-3">Message Received!</h3>
             <p className="font-sans text-[14px] text-text-muted mb-2">
               We'll get back to you at {formData.email} within 24 hours.
             </p>
             <p className="font-sans text-[14px] text-text-muted mb-8">
               In the meantime, explore our projects.
             </p>
             <button
               onClick={() => {
                 closeConsultation();
                 navigate('/projects');
               }}
               className="bg-accent-gold text-bg-dark px-8 h-12 rounded font-sans font-medium hover:bg-accent-gold-hover transition-colors"
             >
               Browse Projects
             </button>
             
             {/* Progress bar */}
             <div className="absolute bottom-0 left-0 h-1 bg-accent-gold" style={{ width: `${(timeLeft / 5) * 100}%`, transition: 'width 1s linear' }} />
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Hexagon className="w-[28px] h-[28px] text-accent-gold mx-auto mb-4 animate-pulse" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] text-text-primary mb-2">Let's Build Something Together</h3>
              <p className="font-sans text-[13px] text-text-muted">
                Fill in your details and our team will reach out within 24 hours.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6 text-accent-gold/80 font-mono text-[11px]">
              <a href="mailto:hello@archive.com" className="flex items-center hover:text-accent-gold transition-colors">
                <Mail className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                hello@archive.com
              </a>
              <div className="w-[1px] h-3 bg-accent-gold/50" />
              <a href="tel:+919876543210" className="flex items-center hover:text-accent-gold transition-colors">
                <Phone className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                +91 98765 43210
              </a>
              <div className="w-[1px] h-3 bg-accent-gold/50" />
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                Mumbai, India
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-border-light"></div>
              <span className="font-mono text-[10px] text-text-muted uppercase">or send us a message</span>
              <div className="h-[1px] flex-1 bg-border-light"></div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!currentUser && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      id="c_name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border border-border-light rounded h-12 px-4 pt-4 pb-1 text-[14px] text-text-primary focus:border-accent-gold outline-none peer"
                      placeholder=" "
                    />
                    <label htmlFor="c_name" className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-muted transition-all peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-accent-gold peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-[10px]">
                      Full Name *
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      id="c_email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border border-border-light rounded h-12 px-4 pt-4 pb-1 text-[14px] text-text-primary focus:border-accent-gold outline-none peer"
                      placeholder=" "
                    />
                    <label htmlFor="c_email" className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-muted transition-all peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-accent-gold peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-[10px]">
                      Email Address *
                    </label>
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type="tel"
                  id="c_phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-transparent border border-border-light rounded h-12 px-4 pt-4 pb-1 text-[14px] text-text-primary focus:border-accent-gold outline-none peer"
                  placeholder=" "
                />
                <label htmlFor="c_phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-muted transition-all peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-accent-gold peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-[10px]">
                  Phone Number
                </label>
              </div>

              <div className="relative">
                <select
                  id="c_service"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className={`w-full bg-transparent border border-border-light rounded h-12 px-4 pt-4 pb-1 text-[14px] outline-none appearance-none cursor-pointer focus:border-accent-gold ${formData.service ? 'text-text-primary' : 'text-transparent'} peer`}
                >
                  <option value="" disabled className="text-text-muted">[Select a service…]</option>
                  <option value="Architectural Design" className="text-text-primary">Architectural Design</option>
                  <option value="Interior Architecture" className="text-text-primary">Interior Architecture</option>
                  <option value="Urban & Master Planning" className="text-text-primary">Urban & Master Planning</option>
                  <option value="Digital Repository Access" className="text-text-primary">Digital Repository Access</option>
                  <option value="Structural Review" className="text-text-primary">Structural Review</option>
                  <option value="Portfolio Studio" className="text-text-primary">Portfolio Studio</option>
                  <option value="General Inquiry" className="text-text-primary">General Inquiry</option>
                  <option value="Other" className="text-text-primary">Other</option>
                </select>
                <label htmlFor="c_service" className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-muted transition-all peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-accent-gold peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-[10px] pointer-events-none">
                  Service Interest *
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  ▼
                </div>
              </div>

              <div className="relative mt-2">
                <textarea
                  id="c_brief"
                  value={formData.brief}
                  onChange={(e) => setFormData({...formData, brief: e.target.value})}
                  rows={4}
                  className="w-full bg-transparent border border-border-light rounded px-4 pt-6 pb-2 text-[14px] text-text-primary focus:border-accent-gold outline-none peer resize-none"
                  placeholder="Tell us about your project, timeline, and budget range…"
                />
                <label htmlFor="c_brief" className="absolute left-4 top-3 text-[10px] text-accent-gold transition-all">
                  Project Brief
                </label>
              </div>

              <div className="mt-2">
                <span className="text-[12px] text-text-muted mb-2 block">Preferred Contact</span>
                <div className="flex gap-3">
                  {['Email', 'Phone', 'WhatsApp'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({...formData, contactMode: mode.toLowerCase()})}
                      className={`px-4 py-1.5 rounded-full border text-[13px] transition-colors ${formData.contactMode === mode.toLowerCase() ? 'border-accent-gold text-accent-gold bg-accent-gold/10' : 'border-border-light text-text-muted hover:border-accent-gold/50'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-text-muted mt-4">
                Your information is never shared. See our <a href="/privacy" target="_blank" className="text-accent-gold hover:underline">Privacy Policy</a>.
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`w-full h-12 mt-2 flex items-center justify-center gap-2 rounded font-sans font-medium transition-colors ${isValid ? 'bg-accent-gold text-bg-dark hover:bg-accent-gold-hover' : 'bg-accent-gold/20 text-text-muted cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-bg-dark" />
                ) : (
                  <>Send Message <span>→</span></>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </Overlay>
  );
}
