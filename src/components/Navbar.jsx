import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Hexagon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    handleScroll();
    
    // Safety check for dynamic layout shifts
    const intervalId = setInterval(handleScroll, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Journal', path: '/journal' },
    { name: 'Contact', path: '/contact' },
  ];

  // Theme-based styling
  // isDarkBg = true -> section background is dark
  // isDarkBg = false -> section background is light (white/off-white)
  
  // If the background is light (isDarkBg=false), the user wants the navbar to turn BLACK.
  // If the background is dark (isDarkBg=true), the navbar can stay transparent or dark.
  
  // Theme-based styling
  // isDarkBg = true -> section background is dark (use light text)
  // isDarkBg = false -> section background is light (use dark text)
  
  const textColor = isDarkBg ? 'text-bg-primary' : 'text-bg-dark'; 
  const logoColor = isDarkBg ? 'text-bg-primary' : 'text-bg-dark'; 
  const iconColor = 'text-accent-gold'; // Always golden as requested
  const sublogoColor = isDarkBg ? 'text-accent-gold' : 'text-bg-dark/70';
  
  const navBg = scrolled 
    ? (isDarkBg ? 'bg-bg-dark/90 backdrop-blur-[20px] shadow-soft' : 'bg-bg-primary/90 backdrop-blur-[20px] shadow-soft') 
    : 'bg-transparent';
  
  const btnBg = isDarkBg ? 'bg-accent-gold text-bg-dark' : 'bg-bg-dark text-accent-gold';

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
              Global Architecture Repository
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
            <button className={`px-6 py-2.5 rounded-buttons font-sans font-medium text-sm transition-all duration-500 transform hover:scale-105 shadow-soft ${btnBg}`}>
              Get Consultation
            </button>
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
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-8 bg-accent-gold text-bg-dark px-8 py-3 rounded-buttons font-sans font-medium text-lg mx-auto"
              >
                Get Consultation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
