import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Overlay({ isOpen, onClose, children, maxWidth = '600px' }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#0E0E0C]/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', exit: { duration: 0.2, ease: 'easeIn' } }}
            className="relative bg-white border border-accent-gold/25 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.3)] max-h-[88vh] overflow-y-auto w-[calc(100%-32px)]"
            style={{ maxWidth }}
          >
            {/* Custom scrollbar via generic css class (e.g. .custom-scrollbar) applied to card or globally */}
            <button
              onClick={onClose}
              className="absolute top-[18px] right-[20px] w-8 h-8 rounded-full bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-text-primary hover:bg-accent-gold/20 hover:border-accent-gold transition-colors z-10"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
            <div className="w-full">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
