import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useUi } from '../../context/UiContext';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-success" />,
  info: <Info className="w-5 h-5 text-accent-gold" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  error: <XCircle className="w-5 h-5 text-error" />
};

const ToastItem = ({ toast, removeToast }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - (100 / 40), 0)); // 4s total -> 40 intervals of 100ms
    }, 100);

    const dismissTimer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, removeToast]);

  return (
    <motion.div
      initial={{ x: '120%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '120%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="relative w-[320px] bg-white border border-accent-gold/20 rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden pointer-events-auto flex flex-col"
    >
      <div className="flex items-center p-4 pr-12">
        <div className="flex-shrink-0 mr-3">
          {icons[toast.type] || icons.info}
        </div>
        <div className="font-sans text-[14px] text-text-primary leading-tight pr-2">
          {toast.message}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-bg-primary text-text-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-[3px] bg-bg-primary w-full relative">
        <div 
          className="absolute top-0 left-0 h-full bg-accent-gold transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export default function ToastContainer() {
  const { toasts, removeToast } = useUi();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
