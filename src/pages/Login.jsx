import React, { useState, useEffect } from 'react';
import { Hexagon, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('archive_auth')) {
      navigate('/projects');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'demo@archive.com' && password === 'Archive@2024') {
        localStorage.setItem("archive_auth", JSON.stringify({
          name: "Anshul",
          handle: "@anshul_arch",
          email: "demo@archive.com",
          avatar: null,
          role: "Architect"
        }));
        navigate('/projects');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <motion.div 
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="w-full max-w-[420px] bg-[#141311]/85 backdrop-blur-[24px] rounded-[16px] p-10 mx-auto"
      style={{
        border: '0.5px solid rgba(200,169,106,0.25)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,169,106,0.1)'
      }}
    >
      <div className="flex flex-col items-center mb-7">
        <motion.div
          animate={{ scale: [1.0, 1.06, 1.0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Hexagon className="w-9 h-9 text-[#C8A96A]" strokeWidth={1.5} />
        </motion.div>
        <h1 className="font-serif text-[26px] text-[#F5F3EF] mt-3">Welcome Back</h1>
        <p className="font-sans text-[13px] text-[#6B6860] mt-1">Sign in to your ArcHive account</p>
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

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-[#C8A96A]/20"></div>
        <span className="px-3 font-mono text-[11px] text-[#6B6860]">or</span>
        <div className="flex-1 border-t border-[#C8A96A]/20"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-5 relative">
        
        <div className="float-label-container mt-2">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] focus:ring-3 focus:ring-[#C8A96A]/10 transition-all duration-200"
            required
          />
          <label className="float-label bg-transparent px-1">Email Address</label>
        </div>

        <div>
          <div className="flex justify-end mb-1 absolute right-0 -top-[24px]">
             <Link to="/forgot-password" className="font-sans text-[12px] text-[#C8A96A] hover:underline">Forgot password?</Link>
          </div>
          <div className="float-label-container relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="float-input w-full h-[46px] bg-white/5 border border-[#C8A96A]/20 rounded-[8px] pl-[14px] pr-10 font-sans text-[14px] text-[#F5F3EF] focus:outline-none focus:border-[#C8A96A] focus:ring-3 focus:ring-[#C8A96A]/10 transition-all duration-200"
              required
            />
            <label className="float-label bg-transparent px-1">Password</label>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[14px] text-[#6B6860] hover:text-[#C8A96A] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button 
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded-[2px] flex items-center justify-center transition-colors duration-150 ${rememberMe ? 'bg-[#C8A96A]' : 'border-[0.5px] border-[#C8A96A]/35'}`}
          >
            {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </button>
          <span className="font-sans text-[13px] text-[#9B9790] cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>Remember me for 30 days</span>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !email || !password}
          className="w-full h-[48px] rounded-[8px] bg-[#C8A96A] text-[#1A1A1A] font-serif font-medium text-[15px] hover:bg-[#A8894A] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-[#C8A96A] disabled:hover:translate-y-0 flex items-center justify-center"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Hexagon className="w-5 h-5" />
            </motion.div>
          ) : (
            <ArrowRight className="w-5 h-5 ml-2" />
          )}
        </button>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-shake flex items-center justify-center space-x-2 w-full bg-[#dc3c3c]/10 border-[0.5px] border-[#dc3c3c]/30 rounded-full py-2 px-4 mt-3"
          >
            <span className="text-[13px] font-sans text-[#ff7070] flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-2" /> {error}
            </span>
          </motion.div>
        )}
      </form>

      <div className="mt-6 text-center">
        <span className="font-sans text-[13px] text-[#6B6860]">Don't have an account? </span>
        <Link to="/signup" className="font-sans text-[13px] font-medium text-[#C8A96A] hover:underline flex items-center justify-center mt-1">
          Create one <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      <div className="mt-4 text-center">
        <p className="font-mono text-[10px] text-[#3a3935]">Demo: demo@archive.com / Archive@2024</p>
      </div>

    </motion.div>
  );
};

export default Login;
