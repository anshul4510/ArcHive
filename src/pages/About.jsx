import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Hexagon, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HexPattern from '../components/HexPattern';
import { useUi } from '../context/UiContext';

const About = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 200]);
  const bgTextX = useTransform(scrollY, [0, 1500], [0, -300]);
  const rotateHex = useTransform(scrollY, [0, 1000], [0, 90]);
  const { openConsultation } = useUi();

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

  const team = [
    { name: "Anshul Patel", role: "Founder & Software Developer", location: "Ahmedabad, India", bio: "Leading the digital infrastructure of ArcHive. Bridging the gap between code and design.", img: "https://i.pravatar.cc/150?u=anshul", isPlaceholder: false },
    { name: "Shaurya Patel", role: "Lead Architect", location: "Ahmedabad, India", bio: "Curating the physical logic of the repository. Expert in architectural precision.", img: "https://i.pravatar.cc/150?u=shaurya", isPlaceholder: false }
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      
      {/* ── SECTION 1: ABOUT HERO ── */}
      <section data-navbar-theme="dark" className="relative h-screen w-full overflow-hidden bg-[#0E0E0C] flex flex-col items-center justify-center pt-20">
        <HexPattern dark={true} opacity={0.1} />
        
        {/* Faint blueprint background */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="white" strokeWidth="2"/>
            <line x1="100" y1="400" x2="700" y2="400" stroke="white" strokeWidth="2"/>
            <line x1="400" y1="100" x2="400" y2="700" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        {/* Rotating hex accent */}
        <motion.div style={{ rotate: rotateHex }} className="absolute bottom-[-100px] right-[-100px] pointer-events-none opacity-[0.15]">
          <Hexagon className="w-[400px] h-[400px] text-accent-gold" strokeWidth={0.5} />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ y: heroY }} className="max-w-[700px] relative">
            
            {/* Decorative Quote Mark */}
            <span className="absolute top-[-40px] left-[-20px] font-serif text-[120px] text-accent-gold opacity-[0.08] leading-none select-none">"</span>

            <motion.p variants={fadeUp} className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-6">
              OUR STORY
            </motion.p>
            
            <motion.h1 variants={fadeUp} className="font-serif text-[clamp(40px,10vw,72px)] text-white leading-[1.1] mb-8 relative z-10">
              Architecture Lives<br />When It's Shared.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="font-sans text-[17px] text-[#9B9790] leading-[1.8]">
              ArcHive was born from a simple frustration — the world's most beautiful buildings exist in scattered hard drives and closed office servers. We built the platform that was missing: an open, living archive of architectural thought.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <Hexagon className="w-5 h-5 text-accent-gold mb-2" strokeWidth={1.5} />
            <div className="w-[1px] h-10 bg-gradient-to-b from-accent-gold to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: WHO WE ARE ── */}
      <section data-navbar-theme="light" className="py-[100px] bg-bg-primary relative overflow-hidden">
        <HexPattern dark={false} opacity={0.4} />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left: Stacked Images */}
            <div className="w-full lg:w-1/2 relative h-[500px] sm:h-[600px] order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, x: -30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                className="absolute top-12 right-0 w-[80%] h-[75%] rounded-[8px] overflow-hidden shadow-elevated z-10"
              >
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Studio Workspace" className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-gold m-2"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30, y: -30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 w-[75%] h-[70%] rounded-[8px] overflow-hidden shadow-soft z-20 border border-white/50"
              >
                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80" alt="Architectural Model" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent-gold m-2"></div>
              </motion.div>

              {/* Floating Stat Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-[-20px] right-4 bg-white/90 backdrop-blur-md border border-accent-gold/40 p-5 rounded-[8px] shadow-elevated z-30"
              >
                <p className="font-serif text-[15px] text-[#1A1A1A]">
                  Founded 2026 <span className="text-accent-gold mx-2">·</span> Ahmedabad, India
                </p>
              </motion.div>
            </div>

            {/* Right: Text Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="w-full lg:w-1/2 order-1 lg:order-2"
            >
              <motion.p variants={fadeUp} className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-4">WHO WE ARE</motion.p>
              
              <motion.div variants={fadeUp} className="w-[40px] h-[2px] bg-accent-gold mb-6"></motion.div>
              
              <motion.h2 variants={fadeUp} className="font-serif text-[36px] text-[#1A1A1A] leading-[1.15] mb-8">
                A Studio Obsessed with Architecture
              </motion.h2>

              <div className="space-y-5 font-sans text-[15px] text-[#6B6860] leading-[1.8] mb-10">
                <motion.p variants={fadeUp}>
                  We are a hybrid team of licensed architects, software engineers, and digital product designers. We speak the language of load-bearing walls as fluently as we speak React.
                </motion.p>
                <motion.p variants={fadeUp}>
                  ArcHive was built to solve our own problem. We were tired of losing incredible design references to dead hard drives, and frustrated that architectural knowledge was hoarded within private firms rather than shared globally.
                </motion.p>
                <motion.p variants={fadeUp}>
                  By borrowing the open-source philosophy of the software world, we aim to accelerate architectural innovation. When we share our blueprints, everyone builds better.
                </motion.p>
              </div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
                {["Precision", "Transparency", "Community"].map(val => (
                  <div key={val} className="flex items-center space-x-2">
                    <Hexagon className="w-4 h-4 text-accent-gold" />
                    <span className="font-mono text-[12px] text-[#1A1A1A] uppercase tracking-wider">{val}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: OUR VISION ── */}
      <section data-navbar-theme="dark" className="py-[120px] bg-[#111111] relative overflow-hidden">
        {/* Large Background Text */}
        <motion.div 
          style={{ x: bgTextX }}
          className="absolute top-[10%] left-0 pointer-events-none whitespace-nowrap z-0"
        >
          <span className="font-serif text-[200px] text-white opacity-[0.02] tracking-widest select-none">
            VISION VISION VISION
          </span>
        </motion.div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left */}
            <div className="w-full lg:w-[40%]">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-4">OUR VISION</p>
                <h2 className="font-serif text-[36px] md:text-[44px] text-white leading-[1.1] max-w-sm">
                  An Open Archive of Every Building Ever Designed.
                </h2>
              </motion.div>
            </div>

            {/* Right: Vision Cards */}
            <div className="w-full lg:w-[60%] space-y-6">
              {[
                { title: "Universal Access", desc: "Architecture knowledge should be accessible to every student, practitioner, and curious mind — not locked in $300 textbooks or closed databases." },
                { title: "Living Collaboration", desc: "Buildings evolve. So should their documentation. ArcHive enables architects to fork, update, and build upon each other's work in real time." },
                { title: "From Local to Global", desc: "A studio in Mumbai should be able to inspire a student in Helsinki. ArcHive dissolves the geographic gatekeeping of architectural knowledge." }
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/[0.03] backdrop-blur-md border border-[#C8A96A]/20 p-6 md:p-8 rounded-[12px] relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-gold group-hover:w-[6px] transition-all duration-300"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    <span className="font-serif text-[32px] text-accent-gold leading-none opacity-80">0{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-[18px] text-white mb-3">{card.title}</h3>
                      <p className="font-sans text-[13px] text-[#9B9790] leading-[1.7]">{card.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY ARCHIVE ── */}
      <section data-navbar-theme="light" className="py-[100px] bg-bg-primary relative">
        <HexPattern dark={false} />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-3">WHY ARCHIVE</p>
            <h2 className="font-serif text-[32px] md:text-[40px] text-text-primary">The Platform Architecture Was Missing.</h2>
          </motion.div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {[
              { prob: "Projects scattered across hard drives and PDFs", sol: "Every project versioned, tagged, and searchable" },
              { prob: "No way to collaborate or build on others' work", sol: "Fork, credit, remix — architecture goes open source" },
              { prob: "Knowledge gatekept by firms and expensive courses", sol: "Free case studies, journals, resources for everyone" }
            ].map((row, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col lg:flex-row items-center rounded-[12px] overflow-hidden border border-[#C8A96A]/20 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}
              >
                {/* Problem */}
                <div className="w-full lg:w-[45%] p-8 lg:p-10 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#C8A96A]/20 relative">
                  <span className="inline-block bg-red-100 text-red-800 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full mb-4">Before ArcHive</span>
                  <h3 className="font-serif text-[20px] text-[#1A1A1A] mb-3">{row.prob}</h3>
                  <p className="font-sans text-[14px] text-[#6B6860] leading-relaxed">The traditional architectural workflow is isolated, leading to duplicated effort and lost knowledge.</p>
                </div>

                {/* Connector */}
                <div className="w-full lg:w-[10%] flex justify-center items-center py-4 lg:py-0 relative">
                   <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#C8A96A]/30"></div>
                   <Hexagon className="w-8 h-8 text-accent-gold fill-bg-primary relative z-10 rotate-90 lg:rotate-0" strokeWidth={1} />
                </div>

                {/* Solution */}
                <div className="w-full lg:w-[45%] p-8 lg:p-10 text-center lg:text-left">
                  <span className="inline-block bg-accent-gold/20 text-[#8A713D] font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full mb-4">With ArcHive</span>
                  <h3 className="font-serif text-[20px] text-[#1A1A1A] mb-3">{row.sol}</h3>
                  <p className="font-sans text-[14px] text-[#1A1A1A] leading-relaxed">A connected ecosystem where finding a detail, sharing a concept, and building together is seamless.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: TEAM / STUDIO ── */}
      <section data-navbar-theme="dark" className="py-[100px] bg-[#0E0E0C] relative overflow-hidden">
        <HexPattern dark={true} opacity={0.15} />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-3">THE TEAM</p>
            <h2 className="font-serif text-[32px] md:text-[40px] text-white mb-3">Built by Architects, for Architects.</h2>
            <p className="font-sans text-[#9B9790] text-[15px]">A small, obsessive team of designers and builders.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white/[0.04] border ${member.isPlaceholder ? 'border-dashed border-[#C8A96A]/40' : 'border-[#C8A96A]/20'} rounded-[12px] p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A96A]/50 hover:shadow-[0_0_32px_rgba(200,169,106,0.1)] group flex flex-col`}
              >
                {member.isPlaceholder ? (
                  <>
                    <div className="w-[80px] h-[80px] rounded-full border border-dashed border-accent-gold mx-auto mb-4 flex items-center justify-center bg-accent-gold/5 group-hover:scale-[1.04] transition-transform duration-300">
                      <Hexagon className="w-8 h-8 text-accent-gold" strokeWidth={1} />
                    </div>
                    <h3 className="font-serif text-[17px] text-white mb-1">We're Hiring</h3>
                    <p className="font-sans text-[13px] text-accent-gold mb-3">{member.role}</p>
                    <p className="font-mono text-[11px] text-[#9B9790] mb-4">We're building this together →</p>
                    <button onClick={openConsultation} className="mt-auto w-full py-2 px-4 border border-accent-gold text-accent-gold rounded text-[13px] font-sans hover:bg-accent-gold hover:text-[#111] transition-colors">
                      Book Consultation
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-[80px] h-[80px] rounded-full border-[2px] border-accent-gold mx-auto mb-4 overflow-hidden group-hover:scale-[1.04] transition-transform duration-300">
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-serif text-[17px] text-white mt-3 mb-1">{member.name}</h3>
                    <p className="font-sans text-[13px] text-accent-gold mb-2">{member.role}</p>
                    <p className="font-mono text-[11px] text-[#9B9790] mb-3 px-2 line-clamp-1">{member.location}</p>
                    <p className="font-sans text-[12px] text-[#9B9790] line-clamp-2 my-2 h-9">{member.bio}</p>
                    
                    <div className="flex justify-center space-x-3 mt-auto pt-4">
                      <a href="#" className="text-[#6B6860] hover:text-accent-gold transition-colors"><Globe className="w-5 h-5" /></a>
                      <a href="#" className="text-[#6B6860] hover:text-accent-gold transition-colors"><ArrowUpRight className="w-5 h-5" /></a>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Studio Philosophy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-[#111] border border-[#C8A96A]/20 border-l-[4px] border-l-accent-gold rounded-[8px] p-8 md:p-10 shadow-elevated"
          >
            <blockquote className="font-editorial italic text-[24px] md:text-[30px] text-accent-gold leading-relaxed mb-6">
              "ArcHive is not just a product. It is the library every architecture school should have built — and never did."
            </blockquote>
            <p className="font-sans text-[15px] text-[#9B9790]">
              — Founding Team, ArcHive
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 6: FINAL CTA ── */}
      <section data-navbar-theme="light" className="py-[120px] bg-bg-primary relative overflow-hidden">
        {/* Large Hex Accents */}
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Hexagon className="w-[300px] h-[300px] text-accent-gold" strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Hexagon className="w-[400px] h-[400px] text-accent-gold" strokeWidth={1} />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-[640px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-4">JOIN THE COMMUNITY</p>
            <h2 className="font-serif text-[40px] md:text-[48px] text-[#1A1A1A] leading-tight mb-6">Your Work Belongs Here.</h2>
            <p className="font-sans text-[16px] text-[#6B6860] leading-[1.8] mb-10">
              Whether you're a student uploading your first project, a firm archiving decades of work, or a researcher building on the open canon — ArcHive is yours.
            </p>

            <div className="flex flex-col items-center">
              <Link to="/signup" className="w-[320px] h-[54px] bg-accent-gold text-bg-dark rounded-buttons font-serif text-[16px] font-medium hover:bg-[#111] hover:text-accent-gold transition-colors duration-250 flex items-center justify-center group shadow-gold-glow mb-4">
                Create Your ArcHive <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="font-mono text-[11px] text-[#9B9790] mb-10">Free forever · No credit card required</p>

              {/* Social Proof */}
              <div className="flex flex-col items-center">
                <div className="flex -space-x-2 mb-3">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" className="w-8 h-8 rounded-full border-2 border-bg-primary" />
                  ))}
                </div>
                <p className="font-mono text-[12px] text-[#6B6860]">+ 4,832 architects already here</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
