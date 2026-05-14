import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, FileText, Package, Link2, 
  Heart, Eye, ArrowUp, ArrowRight, Download,
  ChevronDown, Hexagon, Filter, PenTool, UploadCloud, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HexPattern from '../components/HexPattern';

// --- MOCK DATA ---
const caseStudies = [
  { id: 1, title: "The Meridian Tower: Structural Innovations in Desert Climates", author: "Anshul Sharma", avatar: "https://i.pravatar.cc/150?u=1", date: "3 days ago", readTime: "12 min read", image: "/meridian.png", category: "Commercial", tags: ["High-rise", "Sustainable", "Concrete"], views: "12.4k", saves: "3.2k", upvotes: "1.1k" },
  { id: 2, title: "Biophilic Integration in Urban Micro-Housing", author: "Elena Rostova", avatar: "https://i.pravatar.cc/150?u=2", date: "1 week ago", readTime: "8 min read", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", category: "Residential", tags: ["Micro", "Green", "Wood"], views: "8.1k", saves: "1.4k", upvotes: "892" },
  { id: 3, title: "Adaptive Reuse of the Silo District", author: "Marcus Chen", avatar: "https://i.pravatar.cc/150?u=3", date: "2 weeks ago", readTime: "15 min read", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", category: "Heritage", tags: ["Industrial", "Steel", "Public"], views: "15.2k", saves: "4.5k", upvotes: "2.3k" }
];

const journals = [
  { id: 1, title: "The Death of the Open Plan Office", author: "Sarah Jenkins", date: "Oct 12, 2026", readTime: "6 min read", excerpt: "Why post-pandemic architecture is returning to modular, enclosed spaces for deep work and acoustic privacy.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Material Futures: Mycelium as Concrete", author: "David Okoye", date: "Oct 08, 2026", readTime: "10 min read", excerpt: "Fungi-based building materials have moved from experimental prototypes to structural realities.", image: "https://images.unsplash.com/photo-1584985449746-81da16327b87?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Parametric Urbanism in the Global South", author: "Anshul Sharma", date: "Sep 28, 2026", readTime: "14 min read", excerpt: "Using algorithmic design to solve density and circulation challenges in rapidly expanding cities.", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80" }
];

const resources = [
  { id: 1, title: "Standard Detail: Curtain Wall to Slab", author: "ArcHive Official", type: "DWG", size: "1.2 MB", downloads: "12k", date: "Jan 2026", category: "Templates" },
  { id: 2, title: "Minimalist Interior Material Palette", author: "Studio K", type: "PDF", size: "8.5 MB", downloads: "4.3k", date: "Mar 2026", category: "Reference Sheets" },
  { id: 3, title: "Parametric Facade Dynamo Script", author: "Elena Rostova", type: "RVT", size: "4.1 MB", downloads: "2.1k", date: "Apr 2026", category: "BIM Families" },
  { id: 4, title: "Comprehensive ADA Checklist 2026", author: "ArcHive Official", type: "PDF", size: "0.5 MB", downloads: "18k", date: "Feb 2026", category: "Checklists" },
  { id: 5, title: "High-Res Concrete Textures Pack", author: "Marcus Chen", type: "ZIP", size: "245 MB", downloads: "8.8k", date: "May 2026", category: "3D Assets" },
  { id: 6, title: "Residential Master Plan Template", author: "ArcHive Official", type: "DWG", size: "3.4 MB", downloads: "15k", date: "Jun 2026", category: "Templates" }
];

const accordions = [
  { title: "Building Codes & Standards", count: 14, items: ["IBC 2024 Summary", "NFPA 101 Life Safety", "Eurocode 2: Concrete Design"] },
  { title: "Material Specifications", count: 28, items: ["AISC Steel Construction", "AWC Wood Design", "ACI 318-19"] },
  { title: "Climate-Responsive Design", count: 9, items: ["Passive Solar Handbook", "ASHRAE Standard 90.1", "Natural Ventilation Guide"] },
  { title: "Accessibility Guidelines", count: 17, items: ["ADA Standards 2010", "Universal Design Principles"] },
  { title: "Heritage Restoration Standards", count: 11, items: ["Secretary of Interior's Standards", "ICOMOS Charters"] }
];

// --- TAB COMPONENTS ---

const CaseStudiesTab = () => {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  
  const filtered = caseStudies.filter(cs => {
    const matchesCat = activeCat === 'All' || cs.category === activeCat;
    const matchesSearch = cs.title.toLowerCase().includes(search.toLowerCase()) || cs.author.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      {/* Featured Case Study */}
      <div className="flex flex-col lg:flex-row bg-white rounded-[12px] overflow-hidden border border-[#C8A96A]/20 shadow-sm group cursor-pointer hover:shadow-elevated hover:border-[#C8A96A]/40 transition-all">
        <div className="w-full lg:w-[55%] h-[280px] overflow-hidden">
          <img src="/meridian.png" alt="Featured" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
        </div>
        <div className="w-full lg:w-[45%] p-8 flex flex-col justify-center relative bg-white">
          <Hexagon className="absolute bottom-[-10px] right-[-10px] w-20 h-20 text-[#C8A96A] opacity-5 pointer-events-none" strokeWidth={1} />
          <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.1em] mb-2">FEATURED CASE STUDY</p>
          <h2 className="font-serif text-[28px] text-[#1A1A1A] mb-4 leading-tight">The Meridian Tower: Structural Innovations</h2>
          <div className="flex items-center space-x-3 mb-4">
            <img src="https://i.pravatar.cc/150?u=1" alt="Author" className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-sans text-[13px] font-medium text-[#1A1A1A]">Anshul Sharma</p>
              <p className="font-sans text-[11px] text-[#6B6860]">Senior Architect</p>
            </div>
          </div>
          <p className="font-sans text-[14px] text-[#6B6860] line-clamp-2 mb-4">
            A deep dive into the diagrid exoskeleton system that allows the Meridian Tower to achieve 40% greater material efficiency while withstanding extreme desert thermal loads.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["Commercial", "Structural", "Dubai"].map(t => (
              <span key={t} className="px-2 py-1 bg-[#F5F3EF] text-[#6B6860] font-mono text-[10px] rounded-full">{t}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <p className="font-mono text-[11px] text-[#9B9790]">45 min read · Published Dec 2024 · 8.2k views</p>
            <Link to="/repository/case-studies/1" className="bg-accent-gold text-bg-dark px-4 py-2 rounded font-sans text-[13px] font-medium hover:bg-accent-gold-dim transition-colors flex items-center">
              Read Case Study <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-[8px] border border-[#C8A96A]/20">
        <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto space-x-2 mb-4 md:mb-0 pb-2 md:pb-0">
          {["All", "Residential", "Commercial", "Urban", "Landscape", "Interior", "Heritage"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition-colors ${activeCat === cat ? 'bg-accent-gold text-bg-dark' : 'text-[#6B6860] hover:bg-[#F5F3EF]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6860]" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded bg-[#F5F3EF] border-none font-sans text-[13px] focus:outline-none focus:ring-1 focus:ring-accent-gold" 
            />
          </div>
          <select className="h-9 px-3 rounded bg-[#F5F3EF] border-none font-sans text-[13px] text-[#6B6860] focus:outline-none">
            <option>Newest</option>
            <option>Most Viewed</option>
            <option>Most Saved</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cs) => (
          <motion.div layout key={cs.id} className="bg-white rounded-[12px] overflow-hidden border border-[#C8A96A]/20 hover:-translate-y-1.5 hover:shadow-elevated transition-all duration-300 group cursor-pointer flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#111]">
              <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 opacity-90 group-hover:opacity-100" />
              <div className="absolute top-3 left-3 flex space-x-2">
                <span className="bg-bg-dark text-accent-gold font-mono text-[10px] px-2 py-1 rounded">{cs.category}</span>
                <span className="bg-white/90 backdrop-blur text-[#1A1A1A] font-mono text-[10px] px-2 py-1 rounded">{cs.readTime}</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-serif text-[16px] text-[#1A1A1A] leading-snug line-clamp-2 mb-3">{cs.title}</h3>
              <div className="flex items-center space-x-2 mb-3">
                <img src={cs.avatar} alt={cs.author} className="w-5 h-5 rounded-full" />
                <p className="font-sans text-[12px] text-[#6B6860]"><span className="font-medium text-[#1A1A1A]">{cs.author}</span> · {cs.date}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                {cs.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 border border-[#C8A96A]/20 text-[#6B6860] font-mono text-[9px] rounded uppercase">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-[#C8A96A]/10 pt-3 mt-auto">
                <div className="flex space-x-3 font-mono text-[11px] text-[#6B6860]">
                  <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {cs.views}</span>
                  <span className="flex items-center"><Heart className="w-3 h-3 mr-1" /> {cs.saves}</span>
                  <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-1" /> {cs.upvotes}</span>
                </div>
                <span className="font-sans text-[12px] font-medium text-accent-gold flex items-center group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const JournalsTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col lg:flex-row gap-10">
    {/* Main Content */}
    <div className="flex-1 space-y-10">
      {/* Featured Journal */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-[12px] border border-[#C8A96A]/20">
        <div className="w-full md:w-[60%] order-2 md:order-1">
          <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.1em] mb-2">LATEST ISSUE</p>
          <h2 className="font-serif text-[32px] text-[#1A1A1A] leading-tight mb-4">{journals[0].title}</h2>
          <div className="flex items-center space-x-3 font-sans text-[13px] text-[#6B6860] mb-6">
            <span className="font-medium text-[#1A1A1A]">{journals[0].author}</span>
            <span>·</span>
            <span>{journals[0].date}</span>
            <span>·</span>
            <span>{journals[0].readTime}</span>
          </div>
          <blockquote className="font-editorial italic text-[18px] text-[#1A1A1A] border-l-2 border-accent-gold pl-4 mb-6">
            {journals[0].excerpt}
          </blockquote>
          <button className="px-5 py-2.5 bg-[#111] text-accent-gold rounded font-sans text-[13px] font-medium hover:bg-accent-gold hover:text-[#111] transition-colors">
            Read Article
          </button>
        </div>
        <div className="w-full md:w-[40%] aspect-[4/5] rounded-[8px] overflow-hidden order-1 md:order-2">
          <img src={journals[0].image} alt="Journal cover" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Article List */}
      <div className="space-y-8">
        {journals.slice(1).map((j, i) => (
          <div key={j.id} className={`flex flex-col md:flex-row gap-8 items-center group cursor-pointer pb-8 border-b border-[#C8A96A]/20 last:border-0`}>
            {/* Alternating Layout */}
            <div className={`w-full md:w-1/2 aspect-[16/9] md:aspect-[4/3] rounded-[8px] overflow-hidden ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
              <img src={j.image} alt={j.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            </div>
            <div className={`w-full md:w-1/2 ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
              <div className="flex items-center space-x-2 font-mono text-[10px] text-[#6B6860] mb-3">
                <span className="text-accent-gold">{j.author}</span>
                <span>/</span>
                <span>{j.date}</span>
                <span>/</span>
                <span>{j.readTime}</span>
              </div>
              <h3 className="font-serif text-[24px] text-[#1A1A1A] leading-tight mb-3 group-hover:text-accent-gold transition-colors">{j.title}</h3>
              <p className="font-sans text-[14px] text-[#6B6860] leading-relaxed line-clamp-3 mb-4">{j.excerpt}</p>
              <span className="font-sans text-[13px] font-medium text-[#1A1A1A] flex items-center group-hover:translate-x-1 transition-transform">
                Read Full Story <ArrowRight className="w-3.5 h-3.5 ml-1 text-accent-gold" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Sidebar */}
    <div className="w-full lg:w-[280px] shrink-0 space-y-10">
      <div>
        <h3 className="font-mono text-[11px] text-[#1A1A1A] tracking-[0.1em] border-b border-[#C8A96A]/20 pb-2 mb-4">TRENDING TOPICS</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { tag: "Sustainability", size: "text-[14px]" },
            { tag: "Parametric", size: "text-[12px]" },
            { tag: "Brutalism", size: "text-[16px]" },
            { tag: "Urban Density", size: "text-[13px]" },
            { tag: "Materials", size: "text-[18px] text-accent-gold" },
            { tag: "AI in Design", size: "text-[12px]" },
            { tag: "Heritage", size: "text-[14px]" }
          ].map(t => (
             <span key={t.tag} className={`font-sans ${t.size} text-[#6B6860] hover:text-[#1A1A1A] cursor-pointer hover:underline`}>{t.tag}</span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] text-[#1A1A1A] tracking-[0.1em] border-b border-[#C8A96A]/20 pb-2 mb-4">EDITORS' PICKS</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 group cursor-pointer">
              <div className="w-16 h-16 rounded bg-[#EDEBE6] shrink-0 overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="thumb"/>
              </div>
              <div>
                <h4 className="font-serif text-[13px] text-[#1A1A1A] line-clamp-2 leading-tight group-hover:text-accent-gold transition-colors">The Psychology of Light in Civic Spaces</h4>
                <p className="font-mono text-[10px] text-[#6B6860] mt-1">Oct 01, 2026</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const ResourcesTab = () => {
  const [activeCat, setActiveCat] = useState('All');
  
  const filtered = resources.filter(res => activeCat === 'All' || res.category === activeCat);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      {/* Mini Banner */}
      <div className="bg-[#111] rounded-[12px] p-8 text-center border border-[#C8A96A]/20 relative overflow-hidden">
        <HexPattern dark={true} opacity={0.05} />
        <div className="relative z-10">
          <h2 className="font-serif text-[24px] text-white mb-2">Free Resources for the Architecture Community</h2>
          <p className="font-sans text-[14px] text-[#9B9790]">Templates, spec sheets, BIM families, and design tools.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-[8px] border border-[#C8A96A]/20">
        <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto space-x-1">
          {["All", "Templates", "Spec Sheets", "BIM Families", "Checklists", "Reference Sheets", "3D Assets"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-[6px] font-sans text-[13px] whitespace-nowrap transition-colors ${activeCat === cat ? 'bg-surface text-[#1A1A1A] font-medium border border-[#C8A96A]/30' : 'text-[#6B6860] hover:bg-[#F5F3EF]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select className="h-9 px-3 rounded bg-white border border-[#C8A96A]/20 font-sans text-[13px] text-[#6B6860] focus:outline-none w-full md:w-auto">
          <option>All Software</option>
          <option>AutoCAD</option>
          <option>Revit</option>
          <option>SketchUp</option>
          <option>Rhino</option>
        </select>
      </div>

      {/* Stats */}
      <p className="font-mono text-[12px] text-[#6B6860] text-center tracking-wide">
        {filtered.length} resources shown · Community shared
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(res => {
          let bgTint = "bg-[#C8A96A]/10 text-accent-gold";
          if (res.type === "PDF") bgTint = "bg-red-500/10 text-red-600";
          if (res.type === "DWG") bgTint = "bg-blue-500/10 text-blue-600";
          if (res.type === "ZIP") bgTint = "bg-gray-500/10 text-gray-600";

          return (
            <div key={res.id} className="bg-white rounded-[10px] border border-[#C8A96A]/20 p-5 flex flex-col hover:-translate-y-1 hover:border-[#C8A96A]/60 hover:shadow-soft transition-all group relative">
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 text-green-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">FREE</span>
              </div>

              <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center mb-4 ${bgTint}`}>
                <span className="font-mono text-[12px] font-bold">{res.type}</span>
              </div>
              
              <h3 className="font-sans font-medium text-[14px] text-[#1A1A1A] mb-1 line-clamp-1">{res.title}</h3>
              <p className="font-sans text-[11px] text-[#6B6860] mb-3">{res.author}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                <span className="px-1.5 py-0.5 bg-[#F5F3EF] text-[#6B6860] font-mono text-[9px] rounded">{res.size}</span>
                <span className="px-1.5 py-0.5 bg-[#F5F3EF] text-[#6B6860] font-mono text-[9px] rounded">{res.downloads} dl</span>
              </div>

              <div className="mt-auto flex gap-2">
                <button className="flex-1 py-2 rounded flex items-center justify-center font-sans text-[12px] font-medium bg-[#F5F3EF] text-[#1A1A1A] hover:bg-accent-gold hover:text-[#111] transition-colors">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-[#C8A96A]/20 rounded text-[#6B6860] hover:text-accent-gold hover:border-accent-gold transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const ReferencesTab = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
      {/* Accordions */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {accordions.map((acc, i) => {
          const isActive = activeAccordion === i;
          return (
            <div key={i} className={`border rounded-[8px] overflow-hidden transition-all duration-300 ${isActive ? 'border-[#C8A96A] shadow-soft bg-white' : 'border-[#C8A96A]/20 bg-white/50 hover:bg-white'}`}>
              <button 
                onClick={() => setActiveAccordion(isActive ? -1 : i)}
                className={`w-full flex items-center justify-between p-4 focus:outline-none ${isActive ? 'border-l-[3px] border-l-accent-gold bg-accent-gold/5' : 'border-l-[3px] border-l-transparent'}`}
              >
                <span className="font-sans font-medium text-[14px] text-[#1A1A1A] flex items-center">
                  <span className={`mr-2 transition-transform ${isActive ? 'rotate-90 text-accent-gold' : 'text-[#6B6860]'}`}>▷</span>
                  {acc.title}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[11px] text-[#6B6860]">{acc.count} items</span>
                </div>
              </button>
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#C8A96A]/10">
                      {acc.items.map((item, j) => (
                        <div key={j} className="p-3 border border-[#F5F3EF] rounded flex justify-between items-center hover:border-accent-gold/50 cursor-pointer group bg-white">
                          <span className="font-sans text-[13px] text-[#1A1A1A] group-hover:text-accent-gold transition-colors">{item}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#6B6860] group-hover:text-accent-gold transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                      ))}
                      <div className="p-3 rounded flex justify-center items-center cursor-pointer group bg-[#F5F3EF] hover:bg-[#C8A96A]/10 transition-colors border border-dashed border-[#C8A96A]/30">
                         <span className="font-sans text-[12px] text-accent-gold">View all {acc.count} references</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Inspiration Board */}
      <div className="pt-8 border-t border-[#C8A96A]/20">
        <h3 className="font-mono text-[12px] text-accent-gold tracking-[0.1em] mb-6 text-center uppercase">Design Inspiration Board</h3>
        
        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {["All", "Photography", "Sketches", "Materials", "Built Works"].map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full font-sans text-[12px] border ${activeFilter === f ? 'bg-accent-gold text-bg-dark border-accent-gold' : 'bg-white text-[#6B6860] border-[#C8A96A]/30 hover:border-accent-gold'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Pinterest-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {[
            { h: 'h-64', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-48', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-80', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-56', img: 'https://images.unsplash.com/photo-1584985449746-81da16327b87?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-72', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-48', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-64', img: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=500&q=60' },
            { h: 'h-80', img: 'https://images.unsplash.com/photo-1541888049752-16e63dc366bd?auto=format&fit=crop&w=500&q=60' },
          ].map((item, i) => (
            <div key={i} className={`w-full ${item.h} relative rounded-[8px] overflow-hidden group cursor-zoom-in break-inside-avoid`}>
              <img src={item.img} alt="Inspiration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-sans text-[13px] font-medium mb-1 line-clamp-1">Concrete & Light Study</p>
                <p className="text-[#9B9790] font-mono text-[10px]">Via @anshul_arch</p>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded flex items-center justify-center text-white hover:bg-accent-gold transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};


// --- MAIN REPOSITORY COMPONENT ---

const Repository = () => {
  const [activeTab, setActiveTab] = useState('case-studies');

  const tabs = [
    { id: 'case-studies', label: 'Case Studies', icon: BookOpen, count: "2,847 items" },
    { id: 'journals', label: 'Journals', icon: FileText, count: "941 items" },
    { id: 'resources', label: 'Resources', icon: Package, count: "1,203 items" },
    { id: 'references', label: 'References', icon: Link2, count: "388 items" }
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      
      {/* ── SECTION 1: REPOSITORY HERO ── */}
      <section data-navbar-theme="dark" className="relative h-[70vh] min-h-[500px] w-full bg-[#0E0E0C] flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Hex Pattern */}
        <div className="absolute inset-0 z-0">
          <HexPattern dark={true} opacity={0.15} />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-4"
          >
            KNOWLEDGE COMMONS
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-[40px] md:text-[56px] text-white leading-[1.1] mb-6"
          >
            The Architecture Repository
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans text-[16px] text-[#9B9790] max-w-[540px] leading-[1.6] mb-10"
          >
            Case studies, journals, free resources, and design references — everything the architectural mind needs in one searchable, saveable library.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-[600px] relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-accent-gold" />
            </div>
            <input 
              type="text" 
              placeholder="Search case studies, journals, resources..." 
              className="w-full h-[52px] bg-white/[0.06] border border-[#C8A96A]/30 rounded-[10px] pl-12 pr-16 font-sans text-[15px] text-white placeholder-white/40 focus:outline-none focus:shadow-[0_0_0_3px_rgba(200,169,106,0.12)] focus:border-accent-gold transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="font-mono text-[11px] text-[#9B9790] bg-[#111] px-2 py-1 rounded border border-white/10">⌘K</span>
            </div>
          </motion.div>

          {/* Trending Tags */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-2 max-w-[700px]"
          >
            {["Brutalism", "Sustainable", "High-rise", "Parametric", "Heritage", "Minimalism", "Urban", "Interior"].map((tag, i) => (
              <button key={tag} className="px-3 py-1.5 bg-[#111] border border-white/10 rounded-full font-sans text-[12px] text-[#9B9790] hover:text-accent-gold hover:border-accent-gold transition-colors">
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Live Stats */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 font-mono text-[12px] text-[#9B9790] flex flex-wrap justify-center items-center gap-y-2"
          >
            <span className="flex items-center"><Hexagon className="w-3 h-3 mr-1.5 text-accent-gold"/> 2,847 Case Studies</span>
            <span className="mx-3 opacity-30">·</span>
            <span className="flex items-center"><Hexagon className="w-3 h-3 mr-1.5 text-accent-gold"/> 941 Journals</span>
            <span className="mx-3 opacity-30 hidden sm:inline">·</span>
            <span className="flex items-center w-full sm:w-auto justify-center mt-2 sm:mt-0"><Hexagon className="w-3 h-3 mr-1.5 text-accent-gold"/> 1,203 Resources</span>
            <span className="mx-3 opacity-30 hidden sm:inline">·</span>
            <span className="flex items-center"><Hexagon className="w-3 h-3 mr-1.5 text-accent-gold"/> 388 References</span>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: CONTENT TYPE NAVIGATION ── */}
      <section data-navbar-theme="light" className="sticky top-[72px] z-40 bg-bg-primary border-b border-[#C8A96A]/20 shadow-sm">
        <div className="container mx-auto px-0 md:px-6">
          <div className="flex w-full overflow-x-auto no-scrollbar snap-x">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[160px] h-[80px] flex flex-col items-center justify-center relative border-r border-[#C8A96A]/10 last:border-r-0 snap-center transition-colors duration-200 ${isActive ? 'bg-[#111111] text-white' : 'bg-white hover:bg-[#C8A96A]/[0.06]'}`}
                >
                  <Icon className="w-6 h-6 text-accent-gold mb-1" />
                  <span className={`font-serif text-[15px] ${isActive ? 'text-white' : 'text-[#1A1A1A]'}`}>{tab.label}</span>
                  <span className="font-mono text-[10px] text-[#9B9790] mt-0.5">{tab.count}</span>
                  
                  {isActive && (
                    <motion.div layoutId="activeRepoTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent-gold" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: TAB CONTENT ── */}
      <section className="py-12 bg-bg-primary min-h-[500px]">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'case-studies' && <CaseStudiesTab key="case-studies" />}
            {activeTab === 'journals' && <JournalsTab key="journals" />}
            {activeTab === 'resources' && <ResourcesTab key="resources" />}
            {activeTab === 'references' && <ReferencesTab key="references" />}
          </AnimatePresence>
        </div>
      </section>

      {/* ── SECTION 4: CONTRIBUTE BANNER ── */}
      <section className="py-20 bg-[#111] relative border-t border-[#C8A96A]/20 overflow-hidden">
        <HexPattern dark={true} opacity={0.1} />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h2 className="font-serif text-[32px] md:text-[40px] text-white mb-4">Share Your Knowledge with the Community</h2>
          <p className="font-sans text-[16px] text-[#9B9790] max-w-lg mx-auto mb-10">
            Submit case studies, write for the journal, or contribute free resources.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Submit Case Study", desc: "Share deep-dives into your completed projects.", icon: BookOpen },
              { title: "Write an Article", desc: "Publish essays, opinions, or research findings.", icon: PenTool },
              { title: "Upload Resource", desc: "Share CAD blocks, templates, or textures.", icon: UploadCloud }
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.04] border border-[#C8A96A]/30 rounded-[12px] p-6 flex flex-col items-center hover:bg-white/[0.08] hover:border-accent-gold transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#C8A96A]/40 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-accent-gold" />
                </div>
                <h3 className="font-sans font-medium text-[16px] text-white mb-2">{item.title}</h3>
                <p className="font-sans text-[13px] text-[#9B9790] mb-6 h-10">{item.desc}</p>
                <Link to="/repository/submit" className="w-full py-2 bg-transparent border border-accent-gold text-accent-gold rounded font-sans text-[13px] hover:bg-accent-gold hover:text-[#111] transition-colors">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Repository;
