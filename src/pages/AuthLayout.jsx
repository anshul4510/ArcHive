import React, { useEffect, useState } from 'react';
import { ArrowLeft, Hexagon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const PULSE_ANIMATIONS = [...Array(10)].map((_, i) => ({
  id: `pulse-${i}`,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 5
}));

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="relative min-h-screen bg-[#0E0E0C] text-[#F5F3EF] overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        
        {/* Layer 1: Tiled Pattern */}
        <div 
          className="absolute inset-0 opacity-8"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='110' height='190.52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M55 0L110 31.75V95.26L55 127L0 95.26V31.75L55 0ZM55 190.52L110 158.77V95.26L55 127L0 158.77V190.52Z' fill='none' stroke='%23C8A96A' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundSize: '110px 190.52px'
          }}
        />

        {/* Layer 2: Accent Cluster */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="absolute -bottom-[100px] -left-[100px] opacity-[0.15]"
          style={{ filter: 'drop-shadow(0 0 24px rgba(200,169,106,0.08))' }}
        >
          <svg width="320" height="369" viewBox="0 0 320 369" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M160 0L320 92.25V276.75L160 369L0 276.75V92.25L160 0Z" stroke="#C8A96A" strokeWidth="2"/>
          </svg>
        </motion.div>
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="absolute -top-[50px] -right-[50px] opacity-[0.12]"
          style={{ filter: 'drop-shadow(0 0 24px rgba(200,169,106,0.08))' }}
        >
          <svg width="220" height="254" viewBox="0 0 220 254" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M110 0L220 63.5V190.5L110 254L0 190.5V63.5L110 0Z" stroke="#C8A96A" strokeWidth="2"/>
          </svg>
        </motion.div>

        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="absolute top-1/2 right-[10%] opacity-[0.18]"
          style={{ filter: 'drop-shadow(0 0 24px rgba(200,169,106,0.08))' }}
        >
          <svg width="160" height="184" viewBox="0 0 160 184" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 0L160 46V138L80 184L0 138V46L80 0Z" stroke="#C8A96A" strokeWidth="2"/>
          </svg>
        </motion.div>

        {/* Layer 3: Gold Fill Cells */}
        {PULSE_ANIMATIONS.map((anim) => (
          <motion.div
            key={anim.id}
            className="absolute opacity-4 mix-blend-screen"
            style={{
              top: anim.top,
              left: anim.left,
            }}
            animate={{ opacity: [0.04, 0.1, 0.04] }}
            transition={{ 
              duration: anim.duration, 
              repeat: Infinity, 
              delay: anim.delay,
              ease: "easeInOut"
            }}
          >
            <svg width="110" height="127" viewBox="0 0 110 127" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M55 0L110 31.75V95.26L55 127L0 95.26V31.75L55 0Z" fill="#C8A96A"/>
            </svg>
          </motion.div>
        ))}

        {/* Vignette overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(14,14,12,0) 0%, rgba(14,14,12,0.65) 100%)' }} />

        {/* Architectural Detail (Login Only) */}
        {isLogin && (
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <svg width="300" height="600" viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 600V100L150 50L250 100V600M150 50V600M50 200H250M50 300H250M50 400H250M50 500H250M100 150H200" stroke="#C8A96A" strokeWidth="1"/>
                <circle cx="150" cy="150" r="20" stroke="#C8A96A" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M200 300L250 250M100 300L50 250" stroke="#C8A96A" strokeWidth="1"/>
             </svg>
          </div>
        )}
      </div>

      {/* Minimal Chrome */}
      <div className="absolute top-[28px] left-0 w-full px-10 flex justify-between items-center z-50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#C8A96A] opacity-70 hover:opacity-100 transition-opacity font-sans text-[13px] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        
        <div 
          onClick={() => navigate('/')}
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer flex items-center group"
        >
          <span className="font-serif text-[#C8A96A] text-2xl font-bold tracking-wide flex items-center">
            <Hexagon className="w-6 h-6 mr-1 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
            rcHive
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex justify-center items-center p-4">
        {children}
      </div>

    </div>
  );
};

export default AuthLayout;
