import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Grid, List, Columns, Heart, ArrowUp, X, Hexagon, Filter, MapPin, Eye, Calendar, ArrowRight } from 'lucide-react';
import HexPattern from '../components/HexPattern';
import { mockProjects } from '../data/mockProjects';

const categories = ['All', 'Residential', 'Commercial', 'Urban Planning', 'Interior', 'Landscape', 'Heritage', 'Mixed-Use'];
const sortOptions = ['Top Rated', 'Newest First', 'Oldest First', 'Trending', 'Most Saved', 'Recently Updated'];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('Top Rated');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, compact
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      let result = mockProjects;
      if (activeCategory !== 'All') {
        result = result.filter(p => p.category === activeCategory);
      }
      if (searchQuery) {
        result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      }
      setFilteredProjects(result);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen bg-bg-primary pb-24" data-navbar-theme="light">
      <HexPattern dark={false} />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] bg-bg-dark overflow-hidden flex items-center pt-20" data-navbar-theme="dark">
        {/* Animated dark hex grid + subtle right blueprint overlay */}
        <div className="absolute inset-0 z-0">
          <HexPattern dark={true} />
          {/* Faint wireframe blueprint */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] mix-blend-screen pointer-events-none" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex justify-between items-center w-full">
          {/* Left Side */}
          <div className="max-w-xl">
            <nav className="font-mono text-[11px] text-accent-gold mb-4 uppercase tracking-wider">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <span>Projects</span>
            </nav>
            <h1 className="font-serif text-5xl text-white mb-3">Explore Designs</h1>
            <p className="font-sans text-[15px] text-[#9B9790] mb-5">
              Browse, fork, and get inspired by the world's architectural community.
            </p>
            <div className="flex space-x-6 font-mono text-[12px] text-accent-gold-dim">
              <span className="flex items-center"><Hexagon className="w-3 h-3 mr-2" strokeWidth={1}/> 4,832 Projects</span>
              <span className="flex items-center"><Hexagon className="w-3 h-3 mr-2" strokeWidth={1}/> 1,204 Authors</span>
              <span className="flex items-center"><Hexagon className="w-3 h-3 mr-2" strokeWidth={1}/> 29K Saves</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:block w-96 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-accent-gold opacity-70 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-transparent focus:border-accent-gold rounded-full py-4 pl-12 pr-6 text-white placeholder-white/40 font-sans text-sm outline-none transition-all duration-300"
              placeholder="Search projects, architects, styles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Toolbar - Sticky */}
      <div className="sticky top-[72px] z-40 bg-bg-primary border-b border-border-gold">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          
          {/* Left: Filter Tabs */}
          <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth pr-4">
            <div className="flex space-x-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-sans transition-all duration-200 ${
                    activeCategory === cat 
                      ? 'bg-accent-gold text-bg-dark font-medium' 
                      : 'text-text-muted hover:bg-accent-gold/10'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-[11px] left-0 right-0 h-0.5 bg-accent-gold" 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort + View Controls */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center space-x-2 text-sm font-sans text-text-primary hover:text-accent-gold transition-colors"
              >
                <span>{activeSort}</span>
                <ChevronDown className="w-4 h-4 text-accent-gold" />
              </button>
              
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-border-gold rounded-cards shadow-elevated overflow-hidden z-50"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setActiveSort(opt); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-sans hover:bg-surface transition-colors ${
                          activeSort === opt ? 'text-accent-gold bg-accent-gold/5' : 'text-text-primary'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex bg-surface p-1 rounded-buttons border border-border-gold">
              {[
                { id: 'grid', icon: Grid },
                { id: 'list', icon: List },
                { id: 'compact', icon: Columns }
              ].map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === id ? 'bg-accent-gold text-bg-dark shadow-sm' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <Link 
              to="/projects/upload"
              className="bg-accent-gold text-bg-dark px-5 py-2 rounded-buttons text-sm font-medium font-sans hover:shadow-gold-glow transition-all flex items-center group overflow-hidden relative"
            >
              <span className="relative z-10">+ Upload Design</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeCategory !== 'All' || searchQuery) && (
        <div className="container mx-auto px-6 py-4 flex flex-wrap gap-3 items-center z-10 relative">
          {activeCategory !== 'All' && (
            <div className="flex items-center px-3 py-1 border border-accent-gold text-accent-gold font-sans text-xs rounded-full">
              {activeCategory}
              <button onClick={() => setActiveCategory('All')} className="ml-2 hover:text-bg-dark hover:bg-accent-gold rounded-full transition-colors"><X className="w-3 h-3" /></button>
            </div>
          )}
          {searchQuery && (
            <div className="flex items-center px-3 py-1 border border-accent-gold text-accent-gold font-sans text-xs rounded-full">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-bg-dark hover:bg-accent-gold rounded-full transition-colors"><X className="w-3 h-3" /></button>
            </div>
          )}
          <button 
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="text-xs font-sans text-text-muted hover:text-accent-gold underline decoration-accent-gold/30 underline-offset-4"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        
        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-cards border border-border-gold overflow-hidden h-[420px] relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-accent-gold/10 to-transparent z-10" />
                <div className="h-[220px] bg-surface" />
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-surface" />
                    <div className="h-3 w-24 bg-surface rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-surface rounded" />
                  <div className="h-4 w-full bg-surface rounded" />
                  <div className="h-4 w-5/6 bg-surface rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Hexagon className="w-20 h-20 text-accent-gold mb-6 animate-pulse opacity-50" strokeWidth={1} />
            <h2 className="font-serif text-2xl text-text-primary mb-2">No designs found</h2>
            <p className="font-sans text-text-muted mb-6">Try a different category or search term.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-6 py-2 border border-accent-gold text-accent-gold rounded-buttons hover:bg-accent-gold hover:text-bg-dark transition-all font-sans text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          // Grid
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={
              viewMode === 'list' ? 'flex flex-col space-y-4' : 
              viewMode === 'compact' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 
              'columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5'
            }
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} viewMode={viewMode} navigate={navigate} variants={cardVariants} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="mt-20 flex flex-col items-center justify-center opacity-60">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent-gold to-transparent mb-4" />
            <p className="font-mono text-xs text-text-muted uppercase tracking-widest">You've seen everything for now.</p>
          </div>
        )}

      </div>
    </div>
  );
};

const ProjectCard = ({ project, viewMode, navigate, variants }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [upvotes, setUpvotes] = useState(project.stats.upvotes);

  const handleUpvote = (e) => {
    e.stopPropagation();
    setUpvoted(!upvoted);
    setUpvotes(prev => upvoted ? prev - 1 : prev + 1);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  if (viewMode === 'list') {
    return (
      <motion.div 
        layout
        variants={variants}
        onClick={() => navigate(`/projects/${project.id}`)}
        className="group flex flex-col sm:flex-row bg-white rounded-cards border border-border-gold overflow-hidden hover:shadow-elevated hover:border-accent-gold/40 transition-all cursor-pointer h-auto sm:h-32"
      >
        <div className="w-full sm:w-48 h-48 sm:h-full relative overflow-hidden shrink-0">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 left-2 bg-bg-dark text-accent-gold text-[10px] font-mono px-2 py-1 rounded">
            {project.category}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-text-primary line-clamp-1">{project.title}</h3>
            <p className="font-sans text-[13px] text-text-muted line-clamp-1 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <img src={project.author.avatar} alt="" className="w-6 h-6 rounded-full" />
              <span className="font-sans text-[13px] font-medium">{project.author.name}</span>
            </div>
            <div className="flex items-center space-x-4 font-mono text-[11px] text-accent-gold-dim">
              <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-1"/>{upvotes}</span>
              <span className="flex items-center"><Heart className="w-3 h-3 mr-1"/>{project.stats.saves}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'compact') {
    return (
      <motion.div 
        layout
        variants={variants}
        onClick={() => navigate(`/projects/${project.id}`)}
        className="group bg-white rounded-cards border border-border-gold overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all cursor-pointer break-inside-avoid"
      >
        <div className="aspect-square relative overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-3">
          <h3 className="font-serif text-[15px] text-text-primary line-clamp-1">{project.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <img src={project.author.avatar} alt="" className="w-5 h-5 rounded-full" />
            <span className="font-mono text-[10px] text-accent-gold flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" />{upvotes}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid/Masonry View (Default)
  return (
    <motion.div
      layout
      variants={variants}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group bg-white rounded-cards border border-border-gold overflow-hidden hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-300 cursor-pointer break-inside-avoid relative"
    >
      {/* Hover Watermark */}
      <Hexagon className="absolute top-2 right-2 w-16 h-16 text-accent-gold opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none z-0" strokeWidth={0.5} />

      {/* Top - Image Area */}
      <div className="h-[220px] relative overflow-hidden z-10">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end p-4">
          <span className="text-white font-sans text-sm font-medium flex items-center">
            View Project <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 bg-bg-dark text-accent-gold text-[10px] font-mono px-2.5 py-1 rounded">
          {project.category}
        </div>

        {/* Actions (Hover) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleSave}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${saved ? 'bg-accent-gold text-bg-dark' : 'bg-black/50 text-white hover:bg-black/70'}`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleUpvote}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${upvoted ? 'bg-accent-gold text-bg-dark' : 'bg-black/50 text-white hover:bg-black/70'}`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle - Content Area */}
      <div className="p-4 relative z-10 bg-white">
        {/* Row 1 - Author */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <img src={project.author.avatar} alt={project.author.name} className="w-8 h-8 rounded-full" />
            <span className="font-sans text-[13px] font-medium text-text-primary flex items-center">
              {project.author.name}
              {project.author.verified && <Hexagon className="w-3 h-3 ml-1 text-accent-gold fill-current" />}
            </span>
          </div>
          <span className="font-mono text-[11px] text-text-muted">{project.createdAt}</span>
        </div>

        {/* Row 2 & 3 - Title & Desc */}
        <h3 className="font-serif text-[17px] text-text-primary line-clamp-2 mt-2 mb-1">{project.title}</h3>
        <p className="font-sans text-[13px] text-text-muted line-clamp-2 mb-3 leading-relaxed">
          {project.description}
        </p>

        {/* Row 4 - Tags */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-surface text-text-muted font-mono text-[10px] rounded hover:border-accent-gold hover:text-accent-gold border border-transparent transition-colors whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>

        {/* Row 5 - Metadata Strip */}
        <div className="flex items-center justify-between font-mono text-[11px] text-text-muted border-t border-surface pt-3">
          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {project.location}</span>
          <span>{project.area} · {project.year}</span>
        </div>
      </div>

      {/* Bottom - Stats & CTA */}
      <div className="px-4 py-3 bg-[#FAFAF8] border-t border-border-gold flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4 font-mono text-[11px] text-accent-gold-dim">
          <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-1" /> {upvotes}</span>
          <span className="flex items-center"><Heart className="w-3 h-3 mr-1" /> {project.stats.saves}</span>
          <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {project.stats.views}</span>
        </div>
        <Link 
          to={`/projects/${project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-1.5 border border-accent-gold text-accent-gold rounded font-sans text-[11px] font-medium hover:bg-accent-gold hover:text-bg-dark transition-all duration-300 flex items-center group"
        >
          View Project
          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default Projects;
