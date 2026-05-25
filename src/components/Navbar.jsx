import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Hexagon, User, Layout, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarDisplay from './AvatarDisplay';
import { useToast } from './ToastContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const { isAuthenticated, loading, displayName, username, avatarUrl, signOut } = useAuth();
  const { toast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolled(scrollPos > 50);
      
      // Dynamic viewport-based theme detection
      const themeSections = document.querySelectorAll('[data-navbar-theme]');
      let activeTheme = 'dark'; // Default to dark (light text)
      
      themeSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Detect section under the navbar (40px from top)
        if (rect.top <= 40 && rect.bottom >= 40) {
          activeTheme = section.getAttribute('data-navbar-theme');
        }
      });
      
      setIsDarkBg(activeTheme === 'dark');
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run immediately to set initial state
    handleScroll();
    
    // Safety check for dynamic layout shifts and initial render
    const timer = setTimeout(handleScroll, 100);
    const intervalId = setInterval(handleScroll, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Repository', path: '/repository' },
    { name: 'Studio', path: '/studio' },
    { name: 'About', path: '/about' },
  ];

  // Theme-based styling (High contrast)
  const textColor = isDarkBg ? 'text-white' : 'text-[#0E0E0C]'; 
  const logoColor = isDarkBg ? 'text-white' : 'text-[#0E0E0C]'; 
  const iconColor = 'text-accent-gold'; 
  const sublogoColor = isDarkBg ? 'text-accent-gold' : 'text-[#0E0E0C]/60';
  
  const navBg = scrolled 
    ? (isDarkBg ? 'bg-[#0E0E0C]/95 backdrop-blur-[20px] shadow-soft' : 'bg-white/95 backdrop-blur-[20px] shadow-soft') 
    : 'bg-transparent';
  
  const btnBg = 'bg-accent-gold text-[#0E0E0C] hover:bg-accent-gold-dim';

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Sign out failed.');
    } else {
      setDropdownOpen(false);
      navigate('/login');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-6'
        } ${navBg}`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo Group */}
          <Link to="/" className="flex flex-col group relative">
            <div className="flex items-center">
              <span className={`font-serif text-3xl font-bold tracking-wide flex items-center transition-colors duration-500 ${logoColor}`}>
                <Hexagon className={`w-8 h-8 mr-1 group-hover:scale-110 transition-all duration-500 ${iconColor}`} strokeWidth={1.5} />
                rcHive
              </span>
            </div>
            <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ml-9 mt-0.5 transition-colors duration-500 ${sublogoColor}`}>
              Global Architecture Repository &middot; Est. 2026
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-sans transition-colors duration-500 group ${textColor} ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] transition-all duration-500 ${
                      isDarkBg ? 'bg-accent-gold' : 'bg-bg-dark'
                    } ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  ></span>
                </Link>
              );
            })}
            {loading ? (
              <div className="w-[120px] h-[32px] rounded-full bg-white/10 relative overflow-hidden flex-shrink-0 border border-transparent">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8A96A]/30 to-transparent w-[200%]"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent hover:border-accent-gold/30 transition-colors"
                >
                  <AvatarDisplay avatarUrl={avatarUrl} displayName={displayName} username={username} size={32} />
                  <span className={`font-sans text-[13px] font-medium ${textColor}`}>
                    {username && `@${username}`}
                  </span>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-[190px] bg-white border border-accent-gold rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden z-50 flex flex-col py-1"
                    >
                      <div className="px-4 py-2 flex items-center border-b border-border-light mb-1 pointer-events-none">
                        <AvatarDisplay avatarUrl={avatarUrl} displayName={displayName} username={username} size={24} />
                        <span className="ml-2 font-sans text-[13px] font-medium text-text-primary truncate">{displayName}</span>
                      </div>
                      <Link to={`/profile/${username || 'me'}`} onClick={() => setDropdownOpen(false)} className="h-9 px-4 flex items-center font-sans text-[13px] text-text-primary hover:bg-accent-gold/10 transition-colors">
                        <User className="w-3.5 h-3.5 mr-2.5 text-accent-gold" /> My Profile
                      </Link>
                      <Link to="/studio" onClick={() => setDropdownOpen(false)} className="h-9 px-4 flex items-center font-sans text-[13px] text-text-primary hover:bg-accent-gold/10 transition-colors">
                        <Layout className="w-3.5 h-3.5 mr-2.5 text-accent-gold" /> Studio
                      </Link>
                      <Link to="/profile/me/settings" onClick={() => setDropdownOpen(false)} className="h-9 px-4 flex items-center font-sans text-[13px] text-text-primary hover:bg-accent-gold/10 transition-colors">
                        <Settings className="w-3.5 h-3.5 mr-2.5 text-accent-gold" /> Settings
                      </Link>
                      <div className="h-[1px] bg-border-light my-1" />
                      <button onClick={handleLogout} className="h-9 px-4 flex items-center font-sans text-[13px] text-error hover:bg-error/10 transition-colors w-full text-left">
                        <LogOut className="w-3.5 h-3.5 mr-2.5" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login"
                className={`px-6 py-2.5 rounded-buttons font-sans font-medium text-sm transition-all duration-500 transform hover:scale-105 shadow-soft ${btnBg}`}
              >
                Login / Sign Up
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden transition-colors duration-500 ${textColor} hover:text-accent-gold`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-bg-dark flex flex-col justify-center items-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}></div>
            
            <button
              className="absolute top-8 right-6 text-bg-primary hover:text-accent-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-10 h-10" />
            </button>

            <div className="flex flex-col space-y-8 text-center relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="font-serif text-4xl text-bg-primary hover:text-accent-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link 
                  to={isAuthenticated ? `/profile/${username}` : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-8 bg-accent-gold text-bg-dark px-8 py-3 rounded-buttons font-sans font-medium text-lg mx-auto inline-block"
                >
                  {isAuthenticated ? displayName : 'Login / Sign Up'}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
