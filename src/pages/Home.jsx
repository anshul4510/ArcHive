import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronDown, ArrowRight, Layers, Home as HomeIcon, Map, Grid, Columns, Hexagon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HexBackground from '../components/HexBackground';
import { useUi } from '../context/UiContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const { openConsultation } = useUi();
  const { currentUser, displayName } = useAuth();

  // Framer Motion variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* ── SECTION 1: HERO ── */}
      <section data-navbar-theme="dark" className="relative h-screen w-full overflow-hidden bg-bg-dark">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <div className="absolute inset-0 bg-bg-dark/60 z-10"></div>
          {/* Left-to-right gradient mask for text legibility (lightened) */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/40 via-bg-dark/10 to-transparent z-10"></div>
          <img 
            src="/hero.png" 
            alt="Monumental Architecture" 
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
        
        <HexBackground opacity={0.15} density={8} />

        {/* Dust Particles Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-20 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center pt-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-4xl"
          >
            {/* Terminology eyebrow removed here as it's now in the Navbar logo */}
            
            <motion.h1 variants={fadeUp} className="font-serif text-[clamp(48px,8vw,90px)] leading-[1.05] tracking-[-0.03em] text-surface mb-4">
              Designing Spaces<br />
              <span className="text-bg-primary text-shadow-glow">That Define Tomorrow</span>
            </motion.h1>
            
            {currentUser && (
              <p className="font-sans text-[16px] text-white/65 mb-6">
                Welcome back, {displayName}.
              </p>
            )}

            <motion.p variants={fadeUp} className="font-editorial text-[clamp(24px,3vw,32px)] leading-[1.3] text-accent-gold italic mb-12 max-w-2xl">
              Where structural precision meets human experience.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {currentUser ? (
                <>
                  <Link to="/projects" className="group bg-accent-gold text-bg-dark px-8 py-4 rounded-buttons font-sans font-medium hover:bg-accent-gold-dim transition-all duration-300 flex items-center shadow-gold-glow">
                    Continue to Projects
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/studio" className="group border border-surface text-surface px-8 py-4 rounded-buttons font-sans font-medium hover:bg-accent-gold hover:text-bg-dark hover:border-accent-gold transition-all duration-300">
                    Open Studio
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/projects" className="group bg-accent-gold text-bg-dark px-8 py-4 rounded-buttons font-sans font-medium hover:bg-accent-gold-dim transition-all duration-300 flex items-center shadow-gold-glow">
                    View Projects
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button onClick={openConsultation} className="group border border-surface text-surface px-8 py-4 rounded-buttons font-sans font-medium hover:bg-accent-gold hover:text-bg-dark hover:border-accent-gold transition-all duration-300">
                    Contact Us
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group">
          <p className="font-mono text-[10px] text-surface uppercase tracking-[0.3em] mb-4">
            Scroll to explore
          </p>
          <div className="w-[1px] h-12 bg-surface/30 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-accent-gold"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ABOUT ── */}
      <section id="about-section" data-navbar-theme="light" className="py-24 lg:py-32 bg-bg-primary relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Image Col */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative h-[600px] w-full"
            >
              <div className="absolute -inset-4 border border-accent-gold/40 z-0">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-gold -mt-[1px] -ml-[1px]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-gold -mb-[1px] -mr-[1px]"></div>
              </div>
              <img src="/about.png" alt="ArcHive Studio" className="w-full h-full object-cover z-10 relative" />
              <div className="absolute -bottom-8 -right-8 bg-bg-dark text-accent-gold p-8 z-20 shadow-elevated">
                <p className="font-serif text-5xl mb-2">Est.</p>
                <p className="font-mono text-xl tracking-widest">2026</p>
              </div>
            </motion.div>
            
            {/* Text Col */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="lg:col-span-7"
            >
              <motion.p variants={fadeUp} className="font-mono text-sm tracking-[0.2em] text-text-muted uppercase mb-4">
                THE COLLECTIVE VAULT
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl lg:text-5xl leading-[1.1] text-text-primary mb-8">
                Where Visionary Structures Are Preserved
              </motion.h2>
              <motion.p variants={fadeUp} className="font-sans text-lg text-text-muted leading-[1.7] mb-8 max-w-2xl">
                ArcHive is the world's premier digital repository for architectural innovation. We don't just build; we curate a living index of spaces—from the sharp angles of contemporary brutalism to the fluid lines of organic modernism. Our mission is to provide an open-source spirit for structural visionaries.
              </motion.p>
              
              <motion.div variants={fadeUp} className="w-10 h-[2px] bg-accent-gold mb-12"></motion.div>
              
              {/* Stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-8 mb-12 border-t border-b border-border-gold py-8">
                {[
                  { value: '0', label: 'Blueprints' },
                  { value: '0', label: 'Contributors' },
                  { value: '0', label: 'Countries' }
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="font-serif text-3xl lg:text-4xl text-bg-dark mb-2">{stat.value}</p>
                    <p className="font-mono text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
              
              <motion.div variants={fadeUp}>
                <Link to="/about" className="inline-flex items-center font-sans font-medium text-text-primary group relative">
                  Explore the Repository
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-text-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SERVICES ── */}
      <section data-navbar-theme="dark" className="py-24 lg:py-32 bg-[#111] relative overflow-hidden">
        {/* Horizontal thin hex chain decoration */}
        <div className="absolute top-0 left-0 w-full h-4 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'17.32\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 8.66L22.5 4.33L37.5 4.33L45 8.66L37.5 12.99L22.5 12.99Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat-x' }}></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-sm tracking-[0.2em] text-accent-gold uppercase mb-4">OUR EXPERTISE</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-bg-primary">Disciplines of Design</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: 'Residential Design', category: 'Residential', icon: <HomeIcon strokeWidth={1} className="w-8 h-8" />, desc: 'Bespoke homes blending high structural integrity with deep personal comfort.' },
              { title: 'Commercial Architecture', category: 'Commercial', icon: <Layers strokeWidth={1} className="w-8 h-8" />, desc: 'Innovative workspaces and retail environments engineered for performance.' },
              { title: 'Urban Planning', category: 'Urban Planning', icon: <Map strokeWidth={1} className="w-8 h-8" />, desc: 'Large-scale structural integrations designed for community and flow.' },
              { title: 'Interior Design', category: 'Interior', icon: <Grid strokeWidth={1} className="w-8 h-8" />, desc: 'Refined interior spaces highlighting materiality and light.' },
              { title: 'Landscape Architecture', category: 'Landscape', icon: <Columns strokeWidth={1} className="w-8 h-8" />, desc: 'Harmonizing built environments with organic natural surroundings.' },
              { title: 'Heritage Restoration', category: 'Heritage', icon: <Hexagon strokeWidth={1} className="w-8 h-8" />, desc: 'Preserving historical integrity while adapting for modern utility.' }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/[0.03] border border-border-gold p-8 rounded-cards hover:-translate-y-2 transition-all duration-300 hover:shadow-gold-glow overflow-hidden backdrop-blur-md cursor-pointer"
                onClick={() => navigate('/projects', { state: { category: service.category } })}
              >
                {/* Hex watermark on hover */}
                <Hexagon className="absolute -bottom-8 -right-8 w-40 h-40 text-accent-gold opacity-0 group-hover:opacity-5 transition-opacity duration-500" strokeWidth={0.5} />
                
                <div className="text-accent-gold mb-6">{service.icon}</div>
                <h3 className="font-serif text-2xl text-bg-primary mb-4">{service.title}</h3>
                <p className="font-sans text-text-muted mb-8 line-clamp-2">{service.desc}</p>
                
                <div className="inline-flex items-center text-sm font-sans font-medium text-surface group/link">
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform text-accent-gold" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FEATURED PROJECT ── */}
      <section data-navbar-theme="dark" className="relative h-[100vh] w-full overflow-hidden bg-bg-dark">
        {/* Animated background image */}
        <motion.div 
          style={{ 
            scale: useTransform(scrollY, [2000, 3500], [1, 1.15]),
            y: useTransform(scrollY, [2000, 3500], [0, 100])
          }} 
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-transparent to-bg-dark z-10"></div>
          <img src="/meridian.png" alt="The Meridian Tower" className="w-full h-full object-cover opacity-70" />
        </motion.div>

        <div className="relative z-20 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <p className="font-mono text-sm tracking-[0.4em] text-accent-gold uppercase mb-8">FEATURED PROJECT</p>
            <h2 className="font-serif text-[clamp(40px,7vw,90px)] leading-tight text-surface mb-12 max-w-5xl mx-auto">
              The Meridian Tower<br />
              <span className="text-bg-primary/60 italic font-light">— Dubai, UAE</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link to="/repository/case-studies/meridian" className="bg-surface text-bg-dark px-12 py-5 rounded-buttons font-sans font-medium hover:bg-accent-gold transition-all duration-300 text-lg shadow-elevated">
                View Case Study
              </Link>
              <div className="flex items-center space-x-4 text-surface/60 font-mono text-xs uppercase tracking-widest">
                <span className="w-12 h-[1px] bg-surface/30"></span>
                <span>Structural Glass & Concrete</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
