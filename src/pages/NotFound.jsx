import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HexPattern from '../components/HexPattern';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden text-center px-6">
      <HexPattern dark={false} opacity={0.15} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Hexagon className="w-16 h-16 text-accent-gold opacity-50" strokeWidth={1} />
        </div>
        
        <h1 className="font-serif text-6xl md:text-8xl text-text-primary mb-2">404</h1>
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4">Page Not Found</h2>
        <p className="font-sans text-text-muted text-lg mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-border-gold text-text-primary rounded-buttons hover:border-accent-gold transition-all font-sans"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-accent-gold text-bg-dark rounded-buttons hover:shadow-gold-glow transition-all font-sans"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
