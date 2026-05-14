import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, ArrowUp, Share, MessageSquare, 
  Download, Hexagon, FileText, Layout, FileImage, 
  MoreHorizontal, ChevronLeft, ChevronRight, X,
  MapPin, Eye, Calendar, Layers, User, Clock, ArrowRight, ChevronDown, Flag, ExternalLink
} from 'lucide-react';
import { mockProjects } from '../data/mockProjects';
import HexPattern from '../components/HexPattern';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Modals state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const found = mockProjects.find(p => p.id === id) || mockProjects[0];
      setProject(found);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center pt-20">
        <Hexagon className="w-16 h-16 text-accent-gold animate-pulse opacity-50" strokeWidth={1} />
      </div>
    );
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  return (
    <div className="relative min-h-screen bg-bg-primary pt-24 pb-24" data-navbar-theme="light">
      {/* Background Grid */}
      <HexPattern dark={false} />

      <div className="container max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row relative z-10">
        
        {/* =========================================
            LEFT SIDEBAR (Sticky on Desktop)
            ========================================= */}
        <aside className="w-full lg:w-[320px] shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-[104px] lg:self-start">
          <div className="bg-white border border-border-gold rounded-cards p-6 shadow-soft">
            
            {/* SECTION A: Author Card */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-[72px] h-[72px] rounded-full border-2 border-accent-gold p-0.5 mb-3">
                <img src={project.author.avatar} alt={project.author.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h2 className="font-serif text-[17px] text-text-primary flex items-center justify-center">
                {project.author.name}
                {project.author.verified && <Hexagon className="w-3.5 h-3.5 ml-1.5 text-accent-gold fill-current" />}
              </h2>
              <p className="font-mono text-[12px] text-accent-gold-dim mt-0.5 mb-1">@{project.author.handle}</p>
              <p className="font-sans text-[13px] text-text-muted mb-3">{project.author.role}</p>
              
              <div className="flex justify-center space-x-4 font-mono text-[11px] text-text-muted mb-4 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-text-primary font-medium">{project.author.stats.projects}</span>
                  <span>Projects</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-text-primary font-medium">{project.author.stats.followers}</span>
                  <span>Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-text-primary font-medium">{project.author.stats.following}</span>
                  <span>Following</span>
                </div>
              </div>

              <div className="w-full space-y-2">
                <button className="w-full py-2 bg-accent-gold text-bg-dark rounded-buttons font-sans text-sm font-medium hover:shadow-gold-glow transition-all">
                  Follow
                </button>
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 border border-border-gold rounded-buttons font-sans text-sm text-text-primary hover:bg-surface transition-all">
                    Message
                  </button>
                  <button 
                    onClick={() => navigate(`/profile/${project.author.handle}`)}
                    className="flex-1 py-2 font-sans text-sm text-text-muted hover:text-accent-gold transition-all flex items-center justify-center group"
                  >
                    Profile <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-border-gold my-6 opacity-40" />

            {/* SECTION B: Project Stats */}
            <div className="mb-6">
              <h3 className="font-mono text-[10px] text-accent-gold tracking-[0.1em] mb-4 uppercase">Project Stats</h3>
              <div className="space-y-3 font-mono text-[11px] text-text-muted">
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-2" /> Upvotes</span>
                  <span>{project.stats.upvotes}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Heart className="w-3 h-3 mr-2" /> Saves</span>
                  <span>{project.stats.saves}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Eye className="w-3 h-3 mr-2" /> Views</span>
                  <span>{project.stats.views}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Hexagon className="w-3 h-3 mr-2" /> Forks</span>
                  <span>{project.stats.forks}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-2" /> Published</span>
                  <span>{project.createdAt}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Layers className="w-3 h-3 mr-2" /> Area</span>
                  <span>{project.area}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-2" /> Location</span>
                  <span className="text-right truncate max-w-[120px]" title={project.location}>{project.location}</span>
                </div>
              </div>
            </div>

            {/* SECTION C: License & Visibility */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-[13px] text-text-muted">License:</span>
                <span className="font-mono text-[11px] text-text-primary">CC BY-NC</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-[13px] text-text-muted">Visibility:</span>
                <span className="font-mono text-[11px] text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded">Public</span>
              </div>
              <button 
                onClick={() => setShowDownloadModal(true)}
                className="w-full flex items-center justify-center py-2 border border-accent-gold text-accent-gold rounded-buttons font-sans text-sm hover:bg-accent-gold hover:text-bg-dark transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Files
              </button>
            </div>

            {/* SECTION D: Tags */}
            <div className="mb-6">
              <h3 className="font-mono text-[10px] text-accent-gold tracking-[0.1em] mb-3 uppercase">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-surface text-text-muted font-mono text-[10px] rounded hover:border-accent-gold hover:text-accent-gold border border-transparent transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* SECTION E: Related Designs */}
            <div>
              <h3 className="font-mono text-[10px] text-accent-gold tracking-[0.1em] mb-3 uppercase">Related Designs</h3>
              <div className="space-y-3">
                {mockProjects.slice(1, 4).map(rp => (
                  <Link key={rp.id} to={`/projects/${rp.id}`} className="flex items-center space-x-3 group">
                    <img src={rp.image} alt={rp.title} className="w-[60px] h-[40px] object-cover rounded" />
                    <div>
                      <h4 className="font-serif text-[13px] text-text-primary group-hover:text-accent-gold transition-colors line-clamp-1">{rp.title}</h4>
                      <p className="font-mono text-[10px] text-text-muted">{rp.author.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="border-border-gold my-4 opacity-40" />
            <div className="flex justify-between font-sans text-[11px] text-text-muted">
              <button className="hover:text-red-500 transition-colors flex items-center"><Flag className="w-3.5 h-3.5 mr-1.5" /> Report Project</button>
              <button className="hover:text-text-primary transition-colors flex items-center">Share <ExternalLink className="w-3.5 h-3.5 ml-1.5" /></button>
            </div>
          </div>
        </aside>

        {/* =========================================
            MAIN CONTENT
            ========================================= */}
        <main className="flex-1 lg:ml-10 max-w-[900px] w-full">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex justify-between items-center mb-6">
            <nav className="font-mono text-[11px] text-text-muted uppercase tracking-wider">
              <Link to="/" className="hover:text-accent-gold transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <Link to="/projects" className="hover:text-accent-gold transition-colors">Projects</Link>
              <span className="mx-2">›</span>
              <span className="text-accent-gold">{project.category}</span>
            </nav>
            <button onClick={() => navigate('/projects')} className="font-sans text-sm text-text-muted hover:text-accent-gold transition-colors flex items-center group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Feed
            </button>
          </div>

          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full aspect-[16/9] relative rounded-cards overflow-hidden mb-8 group bg-bg-dark"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImageIndex}
                src={project.images[activeImageIndex]}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
                alt={`${project.title} - view ${activeImageIndex + 1}`}
              />
            </AnimatePresence>
            
            {project.images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent-gold transition-all backdrop-blur-sm">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent-gold transition-all backdrop-blur-sm">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[11px] text-white">
                  {activeImageIndex + 1} / {project.images.length}
                </div>
              </>
            )}
          </motion.div>

          {/* Title & Metadata */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-bg-dark text-accent-gold text-[10px] font-mono px-2.5 py-1 rounded">
                {project.category}
              </span>
              <button 
                onClick={() => setUpvoted(!upvoted)}
                className={`flex items-center px-3 py-1 border rounded-full font-sans text-xs transition-all ${upvoted ? 'bg-accent-gold text-bg-dark border-accent-gold' : 'border-accent-gold text-accent-gold hover:bg-accent-gold/10'}`}
              >
                <ArrowUp className="w-3 h-3 mr-1.5" /> 
                {upvoted ? 'Upvoted' : 'Upvote'} ({upvoted ? project.stats.upvotes + 1 : project.stats.upvotes})
              </button>
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-text-muted mb-8">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> {project.location}</span>
              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> {project.year}</span>
              <span className="flex items-center"><Layers className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> {project.area}</span>
              <span className="flex items-center"><Hexagon className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> Structural</span>
              <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> Solo Project</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowSaveModal(!showSaveModal)}
                  className={`flex items-center px-5 py-2.5 rounded-buttons font-sans text-sm font-medium transition-all ${saved ? 'bg-accent-gold text-bg-dark' : 'bg-surface border border-border-gold text-text-primary hover:border-accent-gold'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                  {saved ? 'Saved' : 'Save to Collection'}
                  <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-60" />
                </button>
                {showSaveModal && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-border-gold rounded-cards shadow-elevated z-50 p-2">
                    <div className="p-2 font-sans text-sm hover:bg-surface rounded cursor-pointer" onClick={() => {setSaved(true); setShowSaveModal(false);}}>My Saves</div>
                    <div className="p-2 font-sans text-sm hover:bg-surface rounded cursor-pointer" onClick={() => {setSaved(true); setShowSaveModal(false);}}>Inspiration Board</div>
                    <hr className="my-1 border-border-gold" />
                    <div className="p-2 font-sans text-sm text-accent-gold hover:bg-surface rounded cursor-pointer">+ Create New Collection</div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowForkModal(true)}
                className="flex items-center px-5 py-2.5 rounded-buttons font-sans text-sm font-medium bg-bg-dark text-accent-gold hover:shadow-gold-glow transition-all"
              >
                <Hexagon className="w-4 h-4 mr-2" />
                Fork This Design
              </button>
              
              <button className="flex items-center px-4 py-2.5 rounded-buttons font-sans text-sm font-medium border border-border-gold hover:border-accent-gold transition-all text-text-primary">
                <Share className="w-4 h-4 mr-2" /> Share
              </button>
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-mono text-[12px] text-accent-gold tracking-[0.1em] mb-4 uppercase">Overview</h3>
            <div className="font-sans text-[15px] text-text-primary leading-[1.8] space-y-4">
              <p>{project.description}</p>
              <p>The structural grid is based on a modular hexagonal system, allowing for efficient load distribution and flexible interior planning. Passive cooling strategies are integrated deeply into the building massing.</p>
            </div>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Design Philosophy', text: 'Biophilic integration prioritizing human well-being and natural light.' },
              { title: 'Structural Approach', text: 'Diagrid exoskeleton with a reinforced concrete core.' },
              { title: 'Materials Used', text: 'Cross-laminated timber (CLT), recycled steel, low-e glass.' }
            ].map(item => (
              <div key={item.title} className="bg-white p-5 rounded-cards border border-border-gold border-t-4 border-t-accent-gold shadow-sm">
                <h4 className="font-serif text-lg text-text-primary mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Files */}
          <div className="mb-16">
            <h3 className="font-mono text-[12px] text-accent-gold tracking-[0.1em] uppercase mb-6">Project Files</h3>
            <div className="bg-white border border-border-gold rounded-cards overflow-hidden">
              {[
                { name: 'Floor_Plans_L1-5.pdf', size: '4.2 MB', icon: FileText },
                { name: 'Structural_3D.dwg', size: '12.8 MB', icon: Layout },
                { name: 'Final_Render.png', size: '8.4 MB', icon: FileImage },
              ].map((file, i) => {
                const IconComponent = file.icon;
                return (
                <div key={i} className="flex items-center justify-between p-4 border-b border-border-gold last:border-0 hover:bg-surface transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-bg-primary rounded flex items-center justify-center text-accent-gold">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="font-sans">
                      <p className="text-sm text-text-primary font-medium">{file.name}</p>
                      <p className="text-[10px] text-text-muted">{file.size}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 font-sans text-xs bg-bg-primary border border-border-gold rounded hover:border-accent-gold opacity-0 group-hover:opacity-100 transition-all">
                    Download
                  </button>
                </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-[480px] bg-white rounded-modals shadow-elevated p-6 border border-border-gold"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl text-text-primary">Download Files</h2>
                <button onClick={() => setShowDownloadModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
              </div>
              <div className="space-y-3 mb-8">
                {['Documents.pdf', 'Models.zip', 'Assets.zip'].map((f, i) => (
                  <label key={i} className="flex items-center space-x-3 p-3 border border-border-gold rounded cursor-pointer hover:bg-surface">
                    <input type="checkbox" className="accent-accent-gold" defaultChecked />
                    <span className="font-sans text-sm text-text-primary">{f}</span>
                  </label>
                ))}
              </div>
              <button className="w-full py-3 bg-accent-gold text-bg-dark font-sans font-medium rounded-buttons">Download Selected</button>
            </motion.div>
          </motion.div>
        )}

        {showForkModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-[420px] bg-bg-dark border border-accent-gold rounded-modals p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full border border-accent-gold flex items-center justify-center mx-auto mb-6">
                <Hexagon className="w-8 h-8 text-accent-gold" />
              </div>
              <h2 className="font-serif text-2xl text-white mb-4">Fork '{project.title}'?</h2>
              <p className="font-sans text-sm text-[#9B9790] mb-8">This creates an editable copy in your profile.</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowForkModal(false)} className="flex-1 py-3 border border-border-gold text-white rounded-buttons">Cancel</button>
                <button className="flex-1 py-3 bg-accent-gold text-bg-dark font-sans font-medium rounded-buttons">Fork Project</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
