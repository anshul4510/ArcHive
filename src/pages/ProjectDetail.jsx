import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, ArrowUp, Share,
  Download, Hexagon, FileText, Layout, FileImage, 
  ChevronLeft, ChevronRight, X,
  MapPin, Eye, Calendar, Layers, User, Clock, ArrowRight, ChevronDown, Flag, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../context/UiContext';
import HexPattern from '../components/HexPattern';
import { getProject, toggleUpvote, toggleSave, forkProject, recordView, getComments, addComment } from '../lib/projects';

const ProjectDetail = () => {
  const { repoName, username } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(0);
  
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  
  const { openAuthPrompt, addToast } = useUi();
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser;

  // Modals state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isForking, setIsForking] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      
      const { data, error } = await getProject({
        repoName,
        username,
        firebaseUid: currentUser?.uid || null
      });

      if (error || !data) {
        navigate('/404', { replace: true });
        return;
      }

      setProject(data);
      setUpvoted(data.viewer_has_upvoted);
      setSaved(data.viewer_has_saved);
      setUpvotesCount(data.upvote_count);

      // Record view
      recordView(data.id, currentUser?.uid || null);

      // Fetch comments
      const { data: commentsData } = await getComments(data.id, currentUser?.uid || null);
      if (commentsData) {
        setComments(commentsData);
      }
      
      setLoading(false);
    };

    fetchProjectData();
  }, [repoName, username, currentUser, navigate]);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center pt-20">
        <Hexagon className="w-16 h-16 text-accent-gold animate-pulse opacity-50" strokeWidth={1} />
      </div>
    );
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % (project.files?.filter(f => !f.is_cover).length || 1));
  };

  const handlePrevImage = () => {
    const len = project.files?.filter(f => !f.is_cover).length || 1;
    setActiveImageIndex((prev) => (prev === 0 ? len - 1 : prev - 1));
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
                <img src={project.author?.avatar_url || `https://ui-avatars.com/api/?name=${project.author?.username}`} alt={project.author?.display_name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h2 className="font-serif text-[17px] text-text-primary flex items-center justify-center">
                {project.author?.display_name || project.author?.username}
                {project.author?.is_verified && <Hexagon className="w-3.5 h-3.5 ml-1.5 text-accent-gold fill-current" />}
              </h2>
              <p className="font-mono text-[12px] text-accent-gold-dim mt-0.5 mb-1">@{project.author?.username}</p>
              <p className="font-sans text-[13px] text-text-muted mb-3">{project.author?.title || 'Architect'}</p>
              
              <div className="flex justify-center space-x-4 font-mono text-[11px] text-text-muted mb-4 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-text-primary font-medium">{project.author?.project_count || 0}</span>
                  <span>Projects</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-text-primary font-medium">{project.author?.follower_count || 0}</span>
                  <span>Followers</span>
                </div>
              </div>

              <div className="w-full space-y-2">
                <button className="w-full py-2 bg-accent-gold text-bg-dark rounded-buttons font-sans text-sm font-medium hover:shadow-gold-glow transition-all">
                  {project.viewer_follows_author ? 'Following' : 'Follow'}
                </button>
                <div className="flex space-x-2">
                  {project.viewer_is_author && (
                    <button onClick={() => navigate(`/studio/${project.id}`)} className="flex-1 py-2 border border-border-gold rounded-buttons font-sans text-sm text-text-primary hover:bg-surface transition-all">
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={() => navigate(`/profile/${project.author?.username}`)}
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
                  <span>{upvotesCount}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Heart className="w-3 h-3 mr-2" /> Saves</span>
                  <span>{project.save_count}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Eye className="w-3 h-3 mr-2" /> Views</span>
                  <span>{project.view_count}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Hexagon className="w-3 h-3 mr-2" /> Forks</span>
                  <span>{project.fork_count}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-2" /> Published</span>
                  <span>{new Date(project.published_at || project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><Layers className="w-3 h-3 mr-2" /> Area</span>
                  <span>{project.area_value} {project.area_unit}</span>
                </div>
                <div className="flex justify-between items-center hover:text-text-primary transition-colors">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-2" /> Location</span>
                  <span className="text-right truncate max-w-[120px]" title={`${project.location_city}, ${project.location_country}`}>{`${project.location_city || ''}, ${project.location_country || ''}`.replace(/^, | , $/g, '')}</span>
                </div>
              </div>
            </div>

            {/* SECTION C: License & Visibility */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-[13px] text-text-muted">License:</span>
                <span className="font-mono text-[11px] text-text-primary">{project.license || 'CC BY-NC'}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-[13px] text-text-muted">Visibility:</span>
                <span className="font-mono text-[11px] text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded capitalize">{project.visibility}</span>
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
                {[].map(rp => (
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
            <nav className="font-mono text-[11px] text-text-muted uppercase tracking-wider flex items-center">
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
                src={project.files?.filter(f => !f.is_cover)?.[activeImageIndex]?.file_url || project.cover_image_url || '/meridian.png'}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
                alt={`${project.title} - view ${activeImageIndex + 1}`}
              />
            </AnimatePresence>
            
            {(project.files?.filter(f => !f.is_cover).length || 0) > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent-gold transition-all backdrop-blur-sm">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent-gold transition-all backdrop-blur-sm">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[11px] text-white">
                  {activeImageIndex + 1} / {project.files?.filter(f => !f.is_cover).length || 1}
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
                onClick={async () => {
                  if (!isLoggedIn) {
                    openAuthPrompt('Sign in to upvote', 'Create your ArcHive account to upvote projects.');
                    return;
                  }
                  
                  // Optimistic
                  const newVal = !upvoted;
                  setUpvoted(newVal);
                  setUpvotesCount(prev => newVal ? prev + 1 : prev - 1);
                  
                  const { data, error } = await toggleUpvote(currentUser.uid, project.id);
                  if (error) {
                    setUpvoted(!newVal);
                    setUpvotesCount(prev => !newVal ? prev + 1 : prev - 1);
                    addToast('Failed to upvote', 'error');
                  } else if (data) {
                    setUpvotesCount(data.new_count);
                  }
                }}
                className={`flex items-center px-3 py-1 border rounded-full font-sans text-xs transition-all ${upvoted ? 'bg-accent-gold text-bg-dark border-accent-gold' : 'border-accent-gold text-accent-gold hover:bg-accent-gold/10'}`}
              >
                <ArrowUp className="w-3 h-3 mr-1.5" /> 
                {upvoted ? 'Upvoted' : 'Upvote'} ({upvotesCount})
              </button>
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-text-muted mb-8">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> {project.location_city || ''}, {project.location_country || ''}</span>
              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> {project.project_year}</span>
              <span className="flex items-center"><Layers className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> {project.area_value} {project.area_unit}</span>
              <span className="flex items-center"><Hexagon className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> Structural</span>
              <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1.5 text-accent-gold" /> Solo Project</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      openAuthPrompt('Sign in to save', 'Create your ArcHive account to save projects to collections.');
                      return;
                    }
                    setShowSaveModal(!showSaveModal);
                  }}
                  className={`flex items-center px-5 py-2.5 rounded-buttons font-sans text-sm font-medium transition-all ${saved ? 'bg-accent-gold text-bg-dark' : 'bg-surface border border-border-gold text-text-primary hover:border-accent-gold'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                  {saved ? 'Saved' : 'Save to Collection'}
                  <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-60" />
                </button>
                {showSaveModal && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-border-gold rounded-cards shadow-elevated z-50 p-2">
                    <div className="p-2 font-sans text-sm hover:bg-surface rounded cursor-pointer" onClick={async () => {
                      setShowSaveModal(false);
                      const newVal = !saved;
                      setSaved(newVal);
                      const { error } = await toggleSave(currentUser.uid, project.id, 'My Saves');
                      if (error) { setSaved(!newVal); addToast('Failed to save project', 'error'); }
                      else addToast(newVal ? 'Saved to My Saves' : 'Removed from My Saves', newVal ? 'success' : 'info');
                    }}>{saved ? 'Remove from My Saves' : 'My Saves'}</div>
                    <div className="p-2 font-sans text-sm hover:bg-surface rounded cursor-pointer" onClick={async () => {
                      setShowSaveModal(false);
                      const newVal = !saved;
                      setSaved(newVal);
                      const { error } = await toggleSave(currentUser.uid, project.id, 'Inspiration Board');
                      if (error) { setSaved(!newVal); addToast('Failed to save project', 'error'); }
                      else addToast(newVal ? 'Saved to Inspiration Board' : 'Removed from Inspiration Board', newVal ? 'success' : 'info');
                    }}>{saved ? 'Remove from Inspiration Board' : 'Inspiration Board'}</div>
                    <hr className="my-1 border-border-gold" />
                    <div className="p-2 font-sans text-sm text-accent-gold hover:bg-surface rounded cursor-pointer" onClick={() => {
                      setShowSaveModal(false);
                      addToast('Collections feature coming soon', 'info');
                    }}>+ Create New Collection</div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => {
                  if (!isLoggedIn) {
                    openAuthPrompt('Sign in to fork', 'Create your ArcHive account to fork this project.');
                    return;
                  }
                  setShowForkModal(true);
                }}
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
              {project.files && project.files.map((file, i) => {
                const isPdf = file.file_type === 'pdf';
                const isImage = file.file_type === 'image';
                const IconComponent = isPdf ? FileText : isImage ? FileImage : Layout;
                return (
                <div key={i} className="flex items-center justify-between p-4 border-b border-border-gold last:border-0 hover:bg-surface transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-bg-primary rounded flex items-center justify-center text-accent-gold">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="font-sans">
                      <p className="text-sm text-text-primary font-medium">{file.file_name}</p>
                      <p className="text-[10px] text-text-muted">{(file.file_size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a href={file.file_url} target="_blank" rel="noreferrer" className="px-3 py-1 font-sans text-xs bg-bg-primary border border-border-gold rounded hover:border-accent-gold opacity-0 group-hover:opacity-100 transition-all flex items-center">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </a>
                    {project.allow_downloads && (
                      <a href={file.file_url} download={file.file_name} target="_blank" rel="noreferrer" className="px-3 py-1 font-sans text-xs bg-bg-primary border border-border-gold rounded hover:border-accent-gold opacity-0 group-hover:opacity-100 transition-all flex items-center">
                        <Download className="w-3 h-3 mr-1" /> Download
                      </a>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
          {/* Comments */}
          <div className="mb-16">
            <h3 className="font-mono text-[12px] text-accent-gold tracking-[0.1em] uppercase mb-6">Discussion</h3>
            
            <div className="bg-white border border-border-gold rounded-cards p-6">
              {isLoggedIn ? (
                <div className="flex space-x-4 mb-8">
                  <img src={currentUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${currentUser.email}`} alt="You" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <textarea 
                      value={newCommentBody}
                      onChange={(e) => setNewCommentBody(e.target.value)}
                      placeholder="Add to the discussion..."
                      className="w-full bg-surface border border-border-gold rounded p-3 font-sans text-sm focus:border-accent-gold outline-none resize-none min-h-[80px]"
                    />
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={async () => {
                          if (!newCommentBody.trim()) return;
                          const { data, error } = await addComment(currentUser.uid, project.id, newCommentBody);
                          if (error) {
                            addToast('Failed to post comment', 'error');
                          } else if (data) {
                            const newCommentObj = { ...data, author: { username: currentUser.email, display_name: currentUser.user_metadata?.name || currentUser.email, avatar_url: currentUser.user_metadata?.avatar_url } };
                            setComments([...comments, newCommentObj]);
                            setNewCommentBody('');
                          }
                        }}
                        className="px-4 py-2 bg-accent-gold text-bg-dark font-sans text-sm font-medium rounded hover:bg-accent-gold/90 transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-surface text-center rounded mb-8">
                  <p className="font-sans text-sm text-text-muted mb-2">Sign in to join the discussion.</p>
                  <button onClick={() => openAuthPrompt('Sign in to comment', 'Create your ArcHive account to leave comments.')} className="px-4 py-2 border border-accent-gold text-accent-gold rounded text-sm hover:bg-accent-gold hover:text-bg-dark transition-colors">Sign In</button>
                </div>
              )}

              <div className="space-y-6">
                {comments.filter(c => !c.parent_id).map(comment => (
                  <div key={comment.id} className="flex space-x-4">
                    <img src={comment.author?.avatar_url || `https://ui-avatars.com/api/?name=${comment.author?.username}`} alt={comment.author?.username} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-sans text-sm font-medium text-text-primary">{comment.author?.display_name || comment.author?.username}</span>
                        <span className="font-mono text-[10px] text-text-muted">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-sans text-sm text-text-muted leading-relaxed mb-2">{comment.body}</p>
                      <div className="flex items-center space-x-4 font-sans text-xs text-text-muted">
                        <button className="hover:text-accent-gold transition-colors flex items-center">
                          <Heart className="w-3 h-3 mr-1" /> {comment.like_count}
                        </button>
                        <button className="hover:text-text-primary transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center font-sans text-sm text-text-muted italic">No comments yet. Be the first!</p>
                )}
              </div>
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
                <button onClick={() => setShowForkModal(false)} disabled={isForking} className="flex-1 py-3 border border-border-gold text-white rounded-buttons disabled:opacity-50">Cancel</button>
                <button 
                  onClick={async () => {
                    setIsForking(true);
                    const { data, error } = await forkProject(currentUser.uid, project.id);
                    setIsForking(false);
                    setShowForkModal(false);
                    if (error) {
                      addToast(error, 'error');
                    } else if (data) {
                      addToast('Project forked successfully!', 'success');
                      navigate(`/studio/${data.new_project_id}`);
                    }
                  }}
                  disabled={isForking}
                  className="flex-1 py-3 bg-accent-gold text-bg-dark font-sans font-medium rounded-buttons disabled:opacity-50 flex justify-center items-center"
                >
                  {isForking ? <Hexagon className="w-5 h-5 animate-spin" /> : 'Fork Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
