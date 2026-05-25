import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import HexPattern from '../components/HexPattern';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center relative overflow-hidden text-center px-6">
      <HexPattern dark={true} opacity={0.15} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Hexagon className="w-16 h-16 text-accent-gold opacity-80" strokeWidth={1} />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Coming Soon</h1>
        <p className="font-sans text-text-muted text-lg mb-8 max-w-md mx-auto">
          We're working hard to bring you this feature. Check back later!
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 border border-border-gold text-accent-gold rounded-buttons hover:bg-accent-gold hover:text-bg-dark transition-all font-sans"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
