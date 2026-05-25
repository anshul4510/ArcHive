import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration) => {
    const id = ++toastIdCounter;
    setToasts((currentToasts) => {
      // Keep only up to 4 toasts active, remove oldest if needed
      const newToasts = [...currentToasts, { id, type, message, duration }];
      if (newToasts.length > 4) {
        return newToasts.slice(newToasts.length - 4);
      }
      return newToasts;
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur = 4000) => addToast('success', msg, dur),
    error: (msg, dur = 5000) => addToast('error', msg, dur),
    info: (msg, dur = 4000) => addToast('info', msg, dur),
    warning: (msg, dur = 4000) => addToast('warning', msg, dur),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <ToastContainer toasts={toasts} removeToast={removeToast} />,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <i className="ti-circle-check text-green-500 text-lg leading-none" />;
      case 'error':
        return <i className="ti-alert-circle text-red-500 text-lg leading-none" />;
      case 'info':
        return <i className="ti-info-circle text-[#C8A96A] text-lg leading-none" />;
      case 'warning':
        return <i className="ti-alert-triangle text-amber-500 text-lg leading-none" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: '110%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '110%', transition: { duration: 0.2 } }}
      className="relative pointer-events-auto bg-white border-[0.5px] border-[#C8A96A]/40 rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.10)] p-[12px_16px] w-[320px] overflow-hidden flex items-start gap-3"
    >
      <div className="mt-[2px] shrink-0">{getIcon(toast.type)}</div>
      
      <div className="flex-1 font-sans text-[13px] text-[#1A1A1A] leading-snug break-words">
        {toast.message}
      </div>
      
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 -mt-1"
        aria-label="Close"
      >
        <span className="text-lg leading-none">&times;</span>
      </button>

      {/* Countdown bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-[2px] bg-[#C8A96A]"
      />
    </motion.div>
  );
}
