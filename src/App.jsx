import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AuthLayout from './pages/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Repository from './pages/Repository';
import About from './pages/About';
import Studio from './pages/Studio';
import ReaderPage from './pages/ReaderPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Custom Cursor Component
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="hidden lg:flex fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] items-center justify-center mix-blend-difference"
      animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <Hexagon className="w-6 h-6 text-accent-gold opacity-80" strokeWidth={1} />
    </motion.div>
  );
};

// Loading Screen Component
const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] bg-bg-dark flex items-center justify-center"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Hexagon className="w-16 h-16 text-accent-gold" strokeWidth={1} />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-serif text-2xl text-accent-gold mt-6 tracking-widest"
        >
          ArcHive
        </motion.p>
      </div>
    </motion.div>
  );
};

import OverlayRoot from './components/overlays/OverlayRoot';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isStudioPage = location.pathname.startsWith('/studio');

  return (
    <>
      <OverlayRoot />
      <CustomCursor />
      {!isAuthPage && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
          <Route path="/profile/:username?/:tab?" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/repository/case-studies/:id" element={<ReaderPage />} />
          <Route path="/repository/journals/:id" element={<ReaderPage />} />
          <Route path="/studio/*" element={<Studio />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isAuthPage && !isStudioPage && <Footer />}
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && <AppContent />}
    </Router>
  );
}

export default App;
