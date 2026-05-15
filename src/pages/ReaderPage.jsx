import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share, BookmarkPlus, 
  Printer, Hexagon, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import HexPattern from '../components/HexPattern';
import { useUi } from '../context/UiContext';

// MOCK DATA for Reader
const mockContent = {
  title: "The Meridian Tower: Structural Innovations in Desert Climates",
  author: { name: "Anshul Sharma", role: "Lead Architect", avatar: "https://i.pravatar.cc/150?u=1" },
  date: "Dec 12, 2026",
  readTime: "12 min read",
  category: "Case Study",
  image: "/meridian.png",
  stats: { views: "12.4k", saves: "3.2k", upvotes: "1.1k" },
  tags: ["High-rise", "Sustainable", "Concrete"],
  content: `
    <h2>Introduction</h2>
    <p>The Meridian Tower represents a paradigm shift in how we approach high-rise construction in extreme desert environments. Rather than fighting the climate with brute-force HVAC systems, the tower's very structure acts as a passive cooling mechanism.</p>
    
    <h2>The Diagrid Exoskeleton</h2>
    <p>Traditional high-rises rely on a central concrete core. We inverted this model. By moving the structural load to an external steel diagrid, we achieved two critical goals:</p>
    <ul>
      <li><strong>Thermal Massing:</strong> The deep structural members shade the high-performance glazing, reducing solar heat gain by 40%.</li>
      <li><strong>Interior Flexibility:</strong> The absence of internal columns allows for completely modular floor plates, ensuring the building can adapt to different uses over its 100-year lifespan.</li>
    </ul>

    <blockquote>"Architecture in the desert should not try to conquer the sun, but dance with it." - Anshul Sharma</blockquote>

    <h2>Material Intelligence</h2>
    <p>We utilized a proprietary geopolymer concrete mix that incorporates local desert sand and industrial fly ash. This reduced the embodied carbon of the superstructure by nearly 60% compared to traditional Portland cement, while offering superior thermal resistance.</p>

    <h2>Wind and Ventilation</h2>
    <p>The tower's aerodynamic profile was sculpted using parametric fluid dynamics to channel prevailing winds. Integrated micro-turbines capture this accelerated airflow, providing 15% of the building's baseline energy needs. More importantly, automated louvers allow for natural cross-ventilation during the temperate winter months.</p>

    <h2>Conclusion</h2>
    <p>The Meridian Tower is not just a building; it is a proof-of-concept for the future of urban density in arid regions. By integrating structural engineering, materials science, and passive design, we have created a blueprint for sustainable desert architecture.</p>
  `
};

const ReaderPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);

  const { openAuthPrompt, addToast } = useUi();
  const isLoggedIn = !!localStorage.getItem('archive_auth');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    // Simulate fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id, location.pathname]);

  const handleAction = (actionType) => {
    if (!isLoggedIn) {
      openAuthPrompt(`Sign in to ${actionType}`, `Create your ArcHive account to ${actionType} articles.`);
      return;
    }
    
    if (actionType === 'upvote') {
      setUpvoted(!upvoted);
    } else if (actionType === 'save') {
      setSaved(!saved);
      if (!saved) addToast('Saved to collection', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <Hexagon className="w-16 h-16 text-accent-gold animate-pulse opacity-50" strokeWidth={1} />
      </div>
    );
  }

  // Determine type based on URL
  const isJournal = location.pathname.includes('journals');
  const typeLabel = isJournal ? 'Journal Article' : 'Case Study';
  const backLink = isJournal ? '/repository' : '/repository';

  return (
    <div className="bg-bg-primary min-h-screen pb-32" data-navbar-theme="light">
      
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent-gold z-50 origin-left"
        style={{ scaleX }}
      />

      <HexPattern dark={false} opacity={0.3} />

      {/* Reader Header */}
      <header className="pt-32 pb-12 relative z-10">
        <div className="max-w-[800px] mx-auto px-6">
          
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigate(backLink)} className="font-mono text-[11px] text-[#6B6860] hover:text-accent-gold uppercase tracking-widest flex items-center transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Repository
            </button>
            <span className="font-mono text-[10px] bg-accent-gold/10 text-accent-gold px-2 py-1 rounded">
              {typeLabel}
            </span>
          </div>

          <h1 className="font-serif text-[40px] md:text-[52px] text-[#1A1A1A] leading-[1.1] mb-6">
            {mockContent.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C8A96A]/20 pb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src={mockContent.author.avatar} alt={mockContent.author.name} className="w-12 h-12 rounded-full border border-[#C8A96A]/30" />
              <div>
                <p className="font-sans text-[15px] font-medium text-[#1A1A1A]">{mockContent.author.name}</p>
                <div className="font-mono text-[11px] text-[#6B6860] mt-0.5">
                  {mockContent.date} · {mockContent.readTime}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white border border-[#C8A96A]/30 rounded-full px-4 py-1.5 shadow-sm">
                <button 
                  onClick={() => handleAction('upvote')} 
                  className={`transition-colors ${upvoted ? 'text-accent-gold' : 'text-[#6B6860] hover:text-accent-gold'}`}
                >
                  <Heart className={`w-4 h-4 ${upvoted ? 'fill-current' : ''}`} />
                </button>
                <span className="font-mono text-[12px] font-medium text-[#1A1A1A]">{mockContent.stats.upvotes}</span>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={() => handleAction('save')} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${saved ? 'bg-accent-gold border-accent-gold text-bg-dark' : 'bg-white border-[#C8A96A]/30 text-[#6B6860] hover:border-accent-gold hover:text-accent-gold'}`}>
                  <BookmarkPlus className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#C8A96A]/30 text-[#6B6860] hover:border-accent-gold hover:text-accent-gold transition-colors" title="Share">
                  <Share className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#C8A96A]/30 text-[#6B6860] hover:border-accent-gold hover:text-accent-gold transition-colors" title="Print">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-[1000px] mx-auto px-6 mb-12 relative z-10">
        <div className="aspect-[21/9] rounded-[12px] overflow-hidden bg-[#111]">
          <img src={mockContent.image} alt={mockContent.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[700px] mx-auto px-6 relative z-10">
        


        {/* Article Body */}
        <article 
          className="prose prose-lg max-w-none font-sans text-[#1A1A1A] leading-[1.9] 
          prose-headings:font-serif prose-headings:text-[#1A1A1A] prose-headings:font-normal prose-headings:mt-10 prose-headings:mb-4
          prose-h2:text-[28px] prose-h3:text-[22px]
          prose-p:text-[17px] prose-p:text-[#333] prose-p:mb-6
          prose-a:text-accent-gold prose-a:no-underline hover:prose-a:underline
          prose-blockquote:font-editorial prose-blockquote:italic prose-blockquote:text-[22px] prose-blockquote:text-accent-gold prose-blockquote:border-l-4 prose-blockquote:border-accent-gold prose-blockquote:pl-6 prose-blockquote:my-10
          prose-li:text-[17px] prose-li:text-[#333]
          "
          dangerouslySetInnerHTML={{ __html: mockContent.content }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-[#C8A96A]/20">
          <div className="flex flex-wrap gap-2 mb-8">
            {mockContent.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#F5F3EF] border border-[#C8A96A]/20 text-[#6B6860] font-mono text-[11px] rounded uppercase hover:border-accent-gold transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-[#C8A96A]/30 rounded-[12px] p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <img src={mockContent.author.avatar} alt={mockContent.author.name} className="w-14 h-14 rounded-full border-2 border-accent-gold" />
              <div>
                <p className="font-mono text-[10px] text-accent-gold tracking-[0.1em] uppercase mb-1">Written By</p>
                <p className="font-serif text-[20px] text-[#1A1A1A]">{mockContent.author.name}</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-[#111] text-accent-gold rounded font-sans text-[13px] font-medium hover:bg-accent-gold hover:text-[#111] transition-colors">
              Follow Author
            </button>
          </div>
        </footer>

        {/* Read Next */}
        <div className="mt-16">
          <h3 className="font-mono text-[12px] text-accent-gold tracking-[0.1em] uppercase mb-6 text-center">Read Next</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mock Read Next Cards */}
            <Link to="/repository" className="group bg-white rounded-[12px] border border-[#C8A96A]/20 overflow-hidden hover:-translate-y-1 hover:shadow-elevated transition-all flex flex-col">
              <div className="aspect-[16/9] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="next" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-serif text-[18px] text-[#1A1A1A] mb-2 leading-snug group-hover:text-accent-gold transition-colors">The Death of the Open Plan Office</h4>
                <p className="font-mono text-[10px] text-[#6B6860] mt-auto">Oct 12, 2026 · 6 min read</p>
              </div>
            </Link>
            <Link to="/repository" className="group bg-white rounded-[12px] border border-[#C8A96A]/20 overflow-hidden hover:-translate-y-1 hover:shadow-elevated transition-all flex flex-col">
              <div className="aspect-[16/9] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1584985449746-81da16327b87?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="next" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-serif text-[18px] text-[#1A1A1A] mb-2 leading-snug group-hover:text-accent-gold transition-colors">Material Futures: Mycelium as Concrete</h4>
                <p className="font-mono text-[10px] text-[#6B6860] mt-auto">Oct 08, 2026 · 10 min read</p>
              </div>
            </Link>
          </div>
        </div>

      </main>

      {/* Mobile Sticky Actions */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#C8A96A]/20 p-4 z-40 flex justify-around items-center">
        <button onClick={() => handleAction('upvote')} className={`flex items-center space-x-2 font-sans text-sm ${upvoted ? 'text-accent-gold' : 'text-[#6B6860]'}`}>
          <Heart className={`w-5 h-5 ${upvoted ? 'fill-current' : ''}`} />
          <span>{upvoted ? 'Upvoted' : 'Upvote'}</span>
        </button>
        <div className="w-[1px] h-6 bg-[#C8A96A]/30"></div>
        <button onClick={() => handleAction('save')} className={`flex items-center space-x-2 font-sans text-sm ${saved ? 'text-accent-gold' : 'text-[#6B6860]'}`}>
          <BookmarkPlus className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
        <div className="w-[1px] h-6 bg-[#C8A96A]/30"></div>
        <button className="flex items-center space-x-2 font-sans text-sm text-[#6B6860]">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

    </div>
  );
};

export default ReaderPage;
