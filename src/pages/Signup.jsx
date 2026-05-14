import React, { useState, useEffect } from 'react';
import { Hexagon, Eye, EyeOff, Check, User, Building2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('archive_auth')) {
      navigate('/projects');
    }
  }, [navigate]);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', terms: false,
    handle: '', title: '', experience: '', studio: '', location: '', url: '',
    interests: [], software: [], accountType: '', heardFrom: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setDirection(1);
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    // Mock save to localStorage
    const mockAuth = {
      name: formData.name || "Architect",
      handle: formData.handle || "@new_user",
      email: formData.email,
      avatar: null,
      role: formData.title || "Architect"
    };
    localStorage.setItem("archive_auth", JSON.stringify(mockAuth));

    setTimeout(() => {
      navigate('/projects');
    }, 2500);
  };

  const stepVariants = {
    initial: (dir) => ({ x: dir * 40, opacity: 0 }),
    active: { x: 0, opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } },
    exit: (dir) => ({ x: dir * -40, opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } })
  };

  const isStep1Valid = formData.name && formData.email && formData.password && formData.confirmPassword === formData.password && formData.terms;
  const isStep2Valid = formData.handle && formData.title && formData.location;
  const isStep3Valid = formData.interests.length >= 2 && formData.accountType;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 relative px-10">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 border-t-[0.5px] border-dashed border-[#C8A96A] z-0"></div>
      
      {[1, 2, 3].map((s, idx) => (
        <React.Fragment key={s}>
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-6 h-6 flex items-center justify-center transition-all duration-300 ${step === s ? 'scale-125' : ''}`}>
              <Hexagon className={`w-full h-full transition-colors ${step >= s ? 'text-[#C8A96A] fill-[#C8A96A]' : 'text-[#C8A96A]/30'}`} strokeWidth={step === s ? 1.5 : 1} />
              {step === s && (
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full border border-[#C8A96A]" />
              )}
            </div>
            <span className={`absolute top-8 font-sans text-[10px] uppercase tracking-wider ${step >= s ? 'text-[#C8A96A]' : 'text-[#6B6860]'}`}>
              {s === 1 ? 'Account' : s === 2 ? 'Profile' : 'Studio'}
            </span>
          </div>
          {idx < 2 && <div className="flex-1"></div>}
        </React.Fragment>
      ))}
    </div>
  );

  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return { label: '', color: 'bg-transparent', fill: 0 };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500', fill: 1 };
    if (pass.length < 10) return { label: 'Fair', color: 'bg-yellow-500', fill: 2 };
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return { label: 'Very Strong', color: 'bg-green-500', fill: 4 };
    return { label: 'Strong', color: 'bg-green-400', fill: 3 };
  };
  const passStr = getPasswordStrength(formData.password);

  if (isSuccess) {
    return (
      <div className="w-full max-w-[520px] bg-[#141311]/85 backdrop-blur-[24px] rounded-[16px] p-12 mx-auto border-[0.5px] border-[#C8A96A]/25 shadow-[0_32px_80px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
        {/* Confetti */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 text-[#C8A96A] animate-fall" style={{ left: `${Math.random() * 100}%`, top: '-20px', animationDelay: `${Math.random() * 1}s` }}>
            <Hexagon className="w-full h-full fill-current" />
          </div>
        ))}
        <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} className="flex justify-center mb-6">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        </motion.div>
        <h2 className="font-serif text-[26px] text-[#C8A96A] mb-2">Welcome to ArcHive, {formData.name.split(' ')[0] || 'Architect'}!</h2>
        <p className="font-sans text-[14px] text-[#F5F3EF]">Your account is ready.</p>
        <div className="w-full h-1 bg-[#1A1A1A] mt-8 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} className="h-full bg-[#C8A96A]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="w-full max-w-[520px] w-[calc(100%-32px)] bg-[#141311]/85 backdrop-blur-[24px] rounded-[16px] md:p-10 p-[28px_20px] mx-auto overflow-hidden"
      style={{
        border: '0.5px solid rgba(200,169,106,0.25)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,169,106,0.1)'
      }}
    >
      {renderStepIndicator()}

      <div className="relative mt-8">
        <AnimatePresence mode="wait" custom={direction}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={stepVariants} initial="initial" animate="active" exit="exit" className="space-y-5">
              <div className="text-center mb-6">
                <h1 className="font-serif text-[24px] text-[#F5F3EF]">Create Your Account</h1>
                <p className="font-sans text-[13px] text-[#6B6860]">Join the architectural community</p>
              </div>

              <button className="w-full h-[46px] rounded-[8px] bg-white/5 border border-white/15 flex items-center justify-center space-x-2 font-sans font-medium text-[14px] text-[#F5F3EF] hover:bg-white/10 hover:border-white/25 transition-all duration-200">
                 <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-[#C8A96A]/20"></div>
                <span className="px-3 font-mono text-[11px] text-[#6B6860]">or sign up with email</span>
                <div className="flex-1 border-t border-[#C8A96A]/20"></div>
              </div>

              <div className="float-label-container mt-2">
                <input type="text" value={formData.name} onChange={e => updateForm('name', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all" required />
                <label className="float-label bg-transparent px-1">Full Name <span className="text-[#C8A96A] font-mono">*</span></label>
              </div>

              <div className="float-label-container relative">
                <input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all pr-10" required />
                <label className="float-label bg-transparent px-1">Email Address <span className="text-[#C8A96A] font-mono">*</span></label>
                {formData.email.includes('@') && <Check className="absolute right-3 top-[14px] w-5 h-5 text-green-500" />}
              </div>

              <div className="float-label-container relative">
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => updateForm('password', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all pr-10" required />
                <label className="float-label bg-transparent px-1">Password <span className="text-[#C8A96A] font-mono">*</span></label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[14px] text-[#6B6860] hover:text-[#C8A96A]">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.password && (
                  <div className="absolute -bottom-5 left-0 w-full flex items-center justify-between px-1">
                    <div className="flex space-x-1 w-24">
                      {[...Array(4)].map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i < passStr.fill ? passStr.color : 'bg-white/10'}`} />)}
                    </div>
                    <span className="font-mono text-[10px] text-[#9B9790]">{passStr.label}</span>
                  </div>
                )}
              </div>

              <div className="float-label-container relative mt-6">
                <input type="password" value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all pr-10" required />
                <label className="float-label bg-transparent px-1">Confirm Password <span className="text-[#C8A96A] font-mono">*</span></label>
                {formData.confirmPassword && (formData.confirmPassword === formData.password ? 
                  <span className="absolute right-3 top-[14px] text-green-500 font-sans text-[12px] flex items-center"><Check className="w-4 h-4 mr-1"/> Matches</span> : 
                  <span className="absolute right-3 top-[14px] text-red-500 font-sans text-[12px] flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> Mismatch
                  </span>)}
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <button type="button" onClick={() => updateForm('terms', !formData.terms)} className={`mt-0.5 w-4 h-4 rounded-[2px] flex items-center justify-center transition-colors shrink-0 ${formData.terms ? 'bg-[#C8A96A]' : 'border-[0.5px] border-[#C8A96A]/35'}`}>
                  {formData.terms && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className="font-sans text-[13px] text-[#9B9790]">
                  I agree to the <a href="#" className="text-[#C8A96A] hover:underline">Terms of Service</a> and <a href="#" className="text-[#C8A96A] hover:underline">Privacy Policy</a>
                </span>
              </div>

              <button onClick={handleNext} disabled={!isStep1Valid} className="w-full h-[48px] mt-4 rounded-[8px] bg-[#C8A96A] text-[#1A1A1A] font-serif font-medium text-[15px] disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#A8894A] transition-all flex items-center justify-center space-x-2">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-center mt-4">
                <Link to="/login" className="font-sans text-[13px] text-[#6B6860] hover:text-[#C8A96A]">Already have an account? Sign In</Link>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={stepVariants} initial="initial" animate="active" exit="exit" className="space-y-5">
              <div className="text-center mb-6">
                <h1 className="font-serif text-[20px] text-[#F5F3EF]">Your Professional Identity</h1>
              </div>

              <div className="float-label-container relative">
                <span className="absolute left-[14px] top-[13px] font-mono text-[14px] text-[#6B6860]">@</span>
                <input type="text" value={formData.handle} onChange={e => updateForm('handle', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] pl-[30px] pr-[14px] font-mono text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all" required />
                <label className="float-label bg-transparent px-1 left-[28px] peer-focus:left-[14px]">Username / Handle <span className="text-[#C8A96A] font-mono">*</span></label>
                {formData.handle.length > 2 && <span className="absolute right-3 top-[14px] text-green-500 font-sans text-[12px] flex items-center"><Check className="w-4 h-4 mr-1"/> Available</span>}
              </div>

              <div className="float-label-container">
                <select value={formData.title} onChange={e => updateForm('title', e.target.value)} className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[10px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all appearance-none" required>
                  <option value="" disabled hidden></option>
                  {['Architect', 'Interior Designer', 'Urban Planner', 'Landscape Architect', 'Structural Engineer', 'Civil Engineer', 'Architecture Student', 'Other'].map(opt => <option key={opt} value={opt} className="bg-[#141311]">{opt}</option>)}
                </select>
                <label className={`absolute left-[14px] transition-all ${formData.title ? '-top-2 scale-[0.82] text-[#C8A96A] bg-[#141311] px-1' : 'top-[14px] text-[#6B6860] pointer-events-none'}`}>Professional Title <span className="text-[#C8A96A] font-mono">*</span></label>
              </div>

              <div>
                <label className="block font-sans text-[12px] text-[#9B9790] mb-2 px-1">Years of Experience</label>
                <div className="flex space-x-2 bg-white/5 p-1 rounded-[8px] border border-[#C8A96A]/10">
                  {['0–2', '3–5', '6–10', '10+'].map(exp => (
                    <button key={exp} type="button" onClick={() => updateForm('experience', exp)} className={`flex-1 py-1.5 rounded-[6px] font-sans text-[13px] transition-colors ${formData.experience === exp ? 'bg-[#C8A96A] text-[#1A1A1A] font-medium' : 'text-[#6B6860] hover:text-[#F5F3EF]'}`}>
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="float-label-container">
                <input type="text" value={formData.studio} onChange={e => updateForm('studio', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all" />
                <label className="float-label bg-transparent px-1">Current Organization / Studio <span className="font-mono text-[10px] text-[#6B6860] ml-1">(Optional)</span></label>
              </div>

              <div className="flex space-x-4">
                <div className="float-label-container flex-[2]">
                  <input type="text" value={formData.location} onChange={e => updateForm('location', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all" required />
                  <label className="float-label bg-transparent px-1">Country/City <span className="text-[#C8A96A] font-mono">*</span></label>
                </div>
              </div>

              <div className="float-label-container">
                <input type="url" value={formData.url} onChange={e => updateForm('url', e.target.value)} placeholder=" " className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] transition-all" />
                <label className="float-label bg-transparent px-1">Portfolio / Website URL</label>
              </div>

              <div className="flex space-x-4 pt-2">
                <button onClick={handleBack} className="px-6 h-[48px] font-sans text-[14px] text-[#6B6860] hover:text-[#F5F3EF] transition-colors flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button onClick={handleNext} disabled={!isStep2Valid} className="flex-1 h-[48px] rounded-[8px] bg-[#C8A96A] text-[#1A1A1A] font-serif font-medium text-[15px] disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#A8894A] transition-all flex items-center justify-center space-x-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={stepVariants} initial="initial" animate="active" exit="exit" className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="font-serif text-[20px] text-[#F5F3EF]">Customize Your ArcHive</h1>
                <p className="font-sans text-[13px] text-[#6B6860]">Help us personalize your feed</p>
              </div>

              <div>
                <label className="block font-sans text-[12px] text-[#9B9790] mb-3 px-1">Architecture Interests (Min 2)</label>
                <div className="flex flex-wrap gap-2 md:grid md:grid-cols-3">
                  {['Residential', 'Commercial', 'Urban Planning', 'Landscape', 'Interior', 'Heritage', 'Sustainable', 'Parametric', 'Brutalism', 'Minimalism', 'Industrial', 'Mixed-Use'].map(int => (
                    <button key={int} type="button" 
                      onClick={() => {
                        const newInts = formData.interests.includes(int) ? formData.interests.filter(i => i !== int) : [...formData.interests, int];
                        updateForm('interests', newInts);
                      }}
                      className={`px-3 py-1.5 rounded-full border-[0.5px] font-sans text-[12px] transition-all text-left md:text-center ${formData.interests.includes(int) ? 'border-[#C8A96A] bg-[#C8A96A]/10 text-[#C8A96A]' : 'border-white/10 text-[#6B6860] hover:border-white/30'}`}
                    >
                      {int}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-sans text-[12px] text-[#9B9790] mb-3 px-1">Account Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'individual', icon: <User className="w-5 h-5 text-[#C8A96A]" />, title: 'Individual', desc: 'Solo designer or student' },
                    { id: 'studio', icon: <Building2 className="w-5 h-5 text-[#C8A96A]" />, title: 'Studio/Firm', desc: 'Team or company account' }
                  ].map(type => (
                    <div key={type.id} onClick={() => updateForm('accountType', type.id)} className={`cursor-pointer border p-4 rounded-[12px] transition-all ${formData.accountType === type.id ? 'border-[#C8A96A] bg-[#C8A96A]/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                      <div className="text-xl mb-1">{type.icon}</div>
                      <div className={`font-sans text-[14px] font-medium ${formData.accountType === type.id ? 'text-[#F5F3EF]' : 'text-[#9B9790]'}`}>{type.title}</div>
                      <div className="font-sans text-[11px] text-[#6B6860] mt-1">{type.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={handleBack} className="px-6 h-[48px] font-sans text-[14px] text-[#6B6860] hover:text-[#F5F3EF] transition-colors flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button onClick={handleSubmit} disabled={!isStep3Valid} className="flex-1 h-[48px] rounded-[8px] bg-[#C8A96A] text-[#1A1A1A] font-serif font-medium text-[15px] disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#A8894A] transition-all flex items-center justify-center space-x-2">
                  <span>Create My Account</span>
                  <Hexagon className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Signup;
