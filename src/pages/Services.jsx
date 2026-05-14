import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, BookOpen, Layers, Monitor, Target, Link as LinkIcon, Database, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import HexPattern from '../components/HexPattern';

const Services = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroTextY = useTransform(scrollY, [0, 1000], [0, 200]);

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

  const services = [
    {
      title: "Architectural Design",
      desc: "End-to-end building design from brief to blueprint.",
      bullets: ["Site analysis reports", "Concept design renders", "Construction drawings"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 21v-4a2 2 0 012-2h4M3 21v-8a2 2 0 012-2h4M21 21v-4a2 2 0 00-2-2h-4M21 21v-8a2 2 0 00-2-2h-4M9 15h6M9 9h6m-3-6v6" />
        </svg>
      )
    },
    {
      title: "Interior Architecture",
      desc: "Spatial planning and material specification for interiors.",
      bullets: ["Material palettes", "Lighting layouts", "Custom joinery detail"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 21h8m-4-6v6m-4-6h8m-8-4h8" />
        </svg>
      )
    },
    {
      title: "Urban & Master Planning",
      desc: "Large-scale site planning and community design strategy.",
      bullets: ["Zoning analysis", "Circulation flow", "Density mapping"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 4a1 1 0 011-1h4a1 1 0 011 1v10a1 1 0 01-1 1h-4a1 1 0 01-1-1V9z" />
        </svg>
      )
    },
    {
      title: "Digital Repository Access",
      desc: "Unlimited access to the ArcHive project library and tools.",
      bullets: ["Version control", "Private branching", "Asset storage"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Structural Review",
      desc: "Peer-reviewed technical assessment by licensed engineers.",
      bullets: ["Load analysis", "Code compliance", "Material efficiency"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2zM9 9h6m-6 4h6m-6 4h6" />
        </svg>
      )
    },
    {
      title: "Portfolio Studio",
      desc: "Curated digital portfolio building with ArcHive branding.",
      bullets: ["Custom domains", "Project curation", "Analytics dashboard"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const steps = [
    { title: "Discovery", desc: "Brief submission, site analysis, requirements mapping." },
    { title: "Concept Design", desc: "Ideation, moodboards, initial spatial concepts presented." },
    { title: "Development", desc: "Detailed drawings, 3D modeling, material palette." },
    { title: "Review & Refinement", desc: "Client feedback loop, peer review, technical compliance." },
    { title: "Delivery", desc: "Final documentation, handover package, platform upload." }
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* ── SECTION 1: SERVICES HERO ── */}
      <section data-navbar-theme="dark" className="relative h-screen w-full overflow-hidden bg-bg-dark flex items-center">
        {/* Hex Grid Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HexPattern dark={true} opacity={0.1} />
        </div>
        
        {/* Architectural Elevation SVG (Background) */}
        <motion.div 
          style={{ y: parallaxY }} 
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none z-0 overflow-hidden hidden md:block"
        >
          <svg width="100%" height="150%" viewBox="0 0 800 1200" fill="none" className="absolute right-0 opacity-5" stroke="#C8A96A" strokeWidth="1.5">
            <path d="M100 1200V200h600v1000M200 200V50h400v150M250 50V0h300v50M300 0v-50h200v50M200 300h400M200 400h400M200 500h400M200 600h400M200 700h400M200 800h400M200 900h400M200 1000h400M200 1100h400M350 200v1000M450 200v1000M100 600H0M800 600h100M100 800H0M800 800h100M150 200l50-150M650 200l-50-150"/>
          </svg>
        </motion.div>

        <div className="relative z-20 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            style={{ y: heroTextY }}
            className="max-w-2xl"
          >
            <motion.p variants={fadeUp} className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-4">
              OUR SERVICES
            </motion.p>
            
            <motion.h1 variants={fadeUp} className="font-serif text-[clamp(40px,6vw,64px)] leading-[1.05] text-white mb-6">
              Where Vision<br />Meets Structure.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="font-sans text-[16px] text-[#9B9790] leading-[1.7] max-w-[440px] mb-10">
              From bespoke architectural consultations to a living digital platform for the world's design community — ArcHive is the complete ecosystem for modern architects.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#what-we-offer" className="group bg-accent-gold text-bg-dark px-8 py-4 rounded-buttons font-sans font-medium hover:bg-accent-gold-dim transition-all duration-300 flex items-center shadow-gold-glow w-full sm:w-auto justify-center">
                Explore Services
                <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
              </a>
              <Link to="/contact" className="group border border-white/20 text-white px-8 py-4 rounded-buttons font-sans font-medium hover:border-accent-gold hover:text-accent-gold transition-all duration-300 flex items-center w-full sm:w-auto justify-center">
                Book Consultation
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-accent-gold opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: WHAT WE OFFER ── */}
      <section id="what-we-offer" data-navbar-theme="light" className="py-[100px] bg-bg-primary relative">
        <HexPattern dark={false} />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-3">WHAT WE OFFER</p>
            <h2 className="font-serif text-[32px] md:text-[40px] text-text-primary mb-3">Services Built for Every Stage of Design</h2>
            <p className="font-sans text-text-muted text-[15px]">From concept to completion, for individuals and studios.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border border-[#C8A96A]/20 rounded-[12px] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)] hover:border-[#C8A96A]/50 overflow-hidden cursor-pointer"
              >
                {/* Hex Watermark Hover */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="absolute -bottom-4 -right-4 w-20 h-20 text-accent-gold opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300" strokeWidth="1">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>

                <div className="w-14 h-14 rounded-[8px] bg-[#C8A96A]/[0.08] border border-[#C8A96A]/20 flex items-center justify-center mb-5 group-hover:bg-[#C8A96A]/[0.12] transition-colors">
                  {service.icon}
                </div>
                
                <h3 className="font-serif text-[18px] text-[#1A1A1A] mb-3">{service.title}</h3>
                <p className="font-sans text-[14px] text-[#6B6860] leading-[1.7] mb-5 h-16">
                  {service.desc}
                </p>
                
                <ul className="space-y-2 mb-8 h-20">
                  {service.bullets.map((bullet, idx) => (
                    <li key={idx} className="font-mono text-[12px] text-[#6B6860] flex items-start">
                      <span className="text-accent-gold mr-2 mt-0.5">•</span> {bullet}
                    </li>
                  ))}
                </ul>
                
                <div className="font-sans font-medium text-[13px] text-accent-gold flex items-center group/link">
                  Learn More <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1.5 transition-transform duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ── */}
      <section data-navbar-theme="dark" className="py-[100px] bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.92' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z' fill='none' stroke='%23C8A96A' stroke-width='1' stroke-opacity='0.08'/%3E%3C/svg%3E")`, backgroundSize: '60px 103.92px' }}></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-3">HOW IT WORKS</p>
            <h2 className="font-serif text-[32px] md:text-[40px] text-white mb-3">A Precision Process, Every Time.</h2>
            <p className="font-sans text-[#9B9790] text-[15px]">Whether you're a solo architect or a 50-person firm.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-[1px] border-t border-dashed border-[#C8A96A]/40 z-0">
              <motion.div 
                className="absolute top-[-1px] left-0 h-[1px] bg-accent-gold"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between space-y-12 md:space-y-0 relative z-10">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  className="flex-1 px-4 text-center relative group"
                >
                  <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <span className="absolute font-serif text-[64px] text-[#C8A96A]/10 font-bold leading-none select-none">
                      0{i + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#111] border border-[#C8A96A] flex items-center justify-center relative z-10 group-hover:bg-[#C8A96A] transition-colors duration-300">
                      <div className="w-2 h-2 rounded-full bg-[#C8A96A] group-hover:bg-[#111]"></div>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-[18px] text-white mb-3">{step.title}</h3>
                  <p className="font-sans text-[13px] text-[#9B9790] leading-[1.6]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY ARCHIVE ── */}
      <section data-navbar-theme="light" className="py-[100px] bg-bg-primary relative overflow-hidden">
        <HexPattern dark={false} />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-[55%] relative h-[600px] rounded-[12px] overflow-hidden"
            >
              <img src="/meridian.png" alt="Architecture" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Floating Stat Card */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-[#C8A96A]/30 p-4 rounded-[8px] shadow-elevated">
                <p className="font-serif text-[14px] text-[#1A1A1A]">
                  <span className="font-bold">4,832</span> Projects · <span className="font-bold">1,204</span> Architects · <span className="font-bold">50+</span> Countries
                </p>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="w-full lg:w-[45%]"
            >
              <div className="mb-10">
                <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-3">WHY ARCHIVE</p>
                <h2 className="font-serif text-[32px] md:text-[40px] text-text-primary leading-[1.1]">Not Just a Platform.<br/>A Professional Community.</h2>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Open Architecture Knowledge", desc: "Every project, journal, and case study is searchable, forkable, and buildable-upon by the community." },
                  { title: "Verified Professionals", desc: "Peer review and verification badges ensure quality and trust across every collaboration." },
                  { title: "Integrated Workflow Tools", desc: "From upload to review to delivery — ArcHive is the single workspace for modern architecture teams." },
                  { title: "Inspired by Open Source", desc: "Fork, credit, collaborate. Architecture evolves faster when knowledge is shared, not siloed." }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex group">
                    <div className="relative mr-6 w-8 flex flex-col items-center">
                      <span className="font-serif text-[28px] text-accent-gold leading-none">0{i + 1}</span>
                      <div className="absolute top-[32px] bottom-[-32px] w-[3px] bg-[#C8A96A]/20">
                        <div className="w-full bg-accent-gold h-0 group-hover:h-full transition-all duration-500"></div>
                      </div>
                    </div>
                    <div className="pb-4">
                      <h3 className="font-serif text-[16px] text-[#1A1A1A] mb-2">{item.title}</h3>
                      <p className="font-sans text-[13px] text-[#6B6860] leading-[1.6]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: PLATFORM FEATURES SHOWCASE ── */}
      <section data-navbar-theme="dark" className="py-[80px] bg-[#0E0E0C] relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-[32px] text-white mb-3">Explore the Platform</h2>
            <p className="font-sans text-[#9B9790] text-[15px]">Built for how architects actually work.</p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Large Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-white/[0.04] border border-[#C8A96A]/15 rounded-[12px] p-6 hover:border-[#C8A96A]/40 transition-colors group"
            >
              <Database className="w-6 h-6 text-accent-gold mb-4" />
              <h3 className="font-sans font-medium text-[18px] text-white mb-2">Project Repository</h3>
              <p className="font-sans text-[13px] text-[#9B9790] leading-[1.6] max-w-sm">
                A centralized, version-controlled hub for all your architectural assets. Search, filter, and preview DWGs, RVT files, and high-res renders directly in the browser.
              </p>
            </motion.div>

            {/* Medium Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.04] border border-[#C8A96A]/15 rounded-[12px] p-6 hover:border-[#C8A96A]/40 transition-colors"
            >
              <Layers className="w-6 h-6 text-accent-gold mb-4" />
              <h3 className="font-sans font-medium text-[15px] text-white mb-2">Version History</h3>
              <p className="font-sans text-[12px] text-[#9B9790] leading-[1.6]">
                Never lose a design iteration again. Track changes visually across files.
              </p>
            </motion.div>

            {/* Medium Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.04] border border-[#C8A96A]/15 rounded-[12px] p-6 hover:border-[#C8A96A]/40 transition-colors"
            >
              <Target className="w-6 h-6 text-accent-gold mb-4" />
              <h3 className="font-sans font-medium text-[15px] text-white mb-2">Peer Reviews</h3>
              <p className="font-sans text-[12px] text-[#9B9790] leading-[1.6]">
                In-line commenting and markup tools for structural and aesthetic feedback.
              </p>
            </motion.div>

            {/* Medium Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.04] border border-[#C8A96A]/15 rounded-[12px] p-6 hover:border-[#C8A96A]/40 transition-colors"
            >
              <Monitor className="w-6 h-6 text-accent-gold mb-4" />
              <h3 className="font-sans font-medium text-[15px] text-white mb-2">Contribution Graph</h3>
              <p className="font-sans text-[12px] text-[#9B9790] leading-[1.6]">
                Visualize your daily design activity and showcase your consistency.
              </p>
            </motion.div>

            {/* Small Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/[0.04] border border-[#C8A96A]/15 rounded-[12px] p-6 hover:border-[#C8A96A]/40 transition-colors"
            >
              <LinkIcon className="w-6 h-6 text-accent-gold mb-4" />
              <h3 className="font-sans font-medium text-[15px] text-white mb-2">Fork & Collaborate</h3>
              <p className="font-sans text-[12px] text-[#9B9790] leading-[1.6]">
                Branch off public projects to experiment with new design concepts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CONSULTATION CTA ── */}
      <section data-navbar-theme="dark" className="relative py-[120px] overflow-hidden bg-[#111]">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: useTransform(scrollY, [2000, 4000], [0, 150]) }} 
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0E0E0C_100%)] z-10"></div>
          <img src="/about.png" alt="Studio" className="w-full h-full object-cover" />
        </motion.div>

        {/* Hex Grid Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <HexPattern dark={true} opacity={0.12} />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-4">GET STARTED</p>
            <h2 className="font-serif text-[32px] md:text-[48px] text-white mb-4">Ready to Build Something Extraordinary?</h2>
            <p className="font-sans text-[16px] text-[#9B9790] mb-10 max-w-xl mx-auto">
              Book a free 30-minute consultation with our team.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact" className="w-full sm:w-auto bg-accent-gold text-bg-dark px-10 py-4 rounded-buttons font-sans font-medium text-[16px] hover:bg-accent-gold-dim transition-all duration-300 flex items-center justify-center shadow-gold-glow">
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/projects" className="w-full sm:w-auto border border-white/20 text-white px-10 py-4 rounded-buttons font-sans font-medium text-[16px] hover:border-accent-gold hover:text-accent-gold transition-all duration-300 flex items-center justify-center">
                Browse Projects
              </Link>
            </div>

            <p className="font-mono text-[11px] text-[#9B9790] mt-8">
              <Check className="w-3 h-3 inline mr-1 text-accent-gold" /> No commitment required · Response within 24h
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Services;
