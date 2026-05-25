import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AvatarDisplay from '../components/AvatarDisplay';
import { getUserProjects, createProject, updateProject } from '../lib/projects';
import { supabase } from '../lib/supabase';
import { 
  Hexagon, Search, Plus, Folder, Clock, Star, GitBranch, GitCommit, FileText, 
  GitCompare, GitFork, Eye, MessageSquare, Settings, HelpCircle, LayoutGrid,
  ChevronDown, ChevronRight, X, File as FileIcon, Image as ImageIcon, Box, 
  Upload, MoreHorizontal, Share, Download, Copy, ChevronLeft, Trash2, 
  ArrowRight, LayoutList, Lock, PenTool, Edit3, LockOpen, AlignLeft,
  AlignCenter, AlignRight, FileDown, Edit, ArrowUp, ArrowDown, Users, MapPin, Check,
  Building2, Ruler, BookOpen, Package, Link2
} from 'lucide-react';

const TYPE_COLORS = {
  'Project': { icon: <Building2 className="w-3 h-3" />, color: '#C8A96A', bg: 'rgba(200,169,106,0.1)', border: 'rgba(200,169,106,0.3)' },
  'Case Study': { icon: <Ruler className="w-3 h-3" />, color: '#38b4b4', bg: 'rgba(56,180,180,0.1)', border: 'rgba(56,180,180,0.3)' },
  'Journal': { icon: <BookOpen className="w-3 h-3" />, color: '#c8a03c', bg: 'rgba(200,160,60,0.1)', border: 'rgba(200,160,60,0.3)' },
  'Resource': { icon: <Package className="w-3 h-3" />, color: '#3882dc', bg: 'rgba(56,130,220,0.1)', border: 'rgba(56,130,220,0.3)' },
  'Reference': { icon: <Link2 className="w-3 h-3" />, color: '#888888', bg: 'rgba(136,136,136,0.1)', border: 'rgba(136,136,136,0.3)' }
};

// --- MOCK DATA ---

const FILE_GROUPS = [
  { name: 'Cover Image', files: [{ name: 'hero-render.jpg', type: 'image', size: '4.2 MB' }] },
  { name: 'Floor Plans', files: [{ name: 'ground-floor.dwg', type: 'cad', size: '12.1 MB' }, { name: 'first-floor.dwg', type: 'cad', size: '11.5 MB' }, { name: 'site-plan.pdf', type: 'pdf', size: '1.2 MB' }] },
  { name: 'Elevations', files: [{ name: 'north-elevation.dwg', type: 'cad', size: '8.4 MB' }, { name: 'south-elevation.dwg', type: 'cad', size: '9.1 MB' }] },
  { name: 'Renders', files: [{ name: 'interior-view-1.jpg', type: 'image', size: '5.1 MB' }, { name: 'interior-view-2.jpg', type: 'image', size: '4.8 MB' }, { name: 'lobby.webp', type: 'image', size: '2.2 MB' }] },
  { name: 'Documents', files: [{ name: 'specifications.pdf', type: 'pdf', size: '2.4 MB' }] }
];

const HISTORY = [
  { version: 'v1.2.0', date: 'Dec 14, 2024', msg: 'Added section elevations', author: '@anshul_arch', filesCount: 3, current: true },
  { version: 'v1.1.0', date: 'Dec 11, 2024', msg: 'Updated floor plans', author: '@anshul_arch', filesCount: 2, current: false },
  { version: 'v1.0.0', date: 'Dec 01, 2024', msg: 'Initial commit', author: '@anshul_arch', filesCount: 15, current: false }
];

// --- COMPONENTS ---

const Dashboard = () => {
  const { firebaseUser, displayName, username: authUsername, avatarUrl } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All Repositories');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseUser?.uid) {
      getUserProjects(firebaseUser.uid)
        .then(({ data }) => {
          if (data) {
            setRepos(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [firebaseUser?.uid]);

  // Sidebar count calculations
  const allCount = repos.length;
  const draftCount = repos.filter(r => r.status?.toLowerCase() === 'draft').length;
  const publishedCount = repos.filter(r => r.status?.toLowerCase() === 'published').length;
  const privateCount = repos.filter(r => r.visibility?.toLowerCase() === 'private').length;
  const forkedCount = repos.filter(r => r.is_fork).length;
  const collabCount = 0;
  const starredCount = 0;

  const projectCount = repos.filter(r => r.content_type?.toLowerCase() === 'project').length;
  const caseStudyCount = repos.filter(r => r.content_type?.toLowerCase() === 'case_study').length;
  const journalCount = repos.filter(r => r.content_type?.toLowerCase() === 'journal').length;
  const resourceCount = repos.filter(r => r.content_type?.toLowerCase() === 'resource').length;
  const referenceCount = repos.filter(r => r.content_type?.toLowerCase() === 'reference').length;

  const filteredRepos = repos.filter(repo => {
    const status = repo.status?.toLowerCase();
    const visibility = repo.visibility?.toLowerCase();
    const contentType = repo.content_type?.toLowerCase();

    if (activeFilter === 'All Repositories') return true;
    if (activeFilter === 'Drafts') return status === 'draft';
    if (activeFilter === 'Published') return status === 'published';
    if (activeFilter === 'Private') return visibility === 'private';
    if (activeFilter === 'Forked') return !!repo.is_fork;
    if (activeFilter === 'Collaborations') return false;
    if (activeFilter === 'Starred') return false;
    
    if (activeFilter === 'Project') return contentType === 'project';
    if (activeFilter === 'Case Study') return contentType === 'case_study';
    if (activeFilter === 'Journal') return contentType === 'journal';
    if (activeFilter === 'Resource') return contentType === 'resource';
    if (activeFilter === 'Reference') return contentType === 'reference';

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F3EF] relative text-[#1A1A1A] flex flex-col">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}></div>
      
      {/* TOOLBAR */}
      <div className="h-[64px] bg-white border-b border-[#C8A96A]/10 px-10 flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Hexagon className="w-5 h-5 text-[#C8A96A]" strokeWidth={2} />
          <h2 className="font-serif text-[18px] text-[#1A1A1A] tracking-tight">{displayName || authUsername}'s Workspace</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="w-3.5 h-3.5 text-[#C8A96A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              className="w-[280px] h-9 pl-9 pr-4 bg-[#F5F3EF]/50 border border-[#C8A96A]/15 rounded-[4px] focus:border-[#C8A96A] outline-none font-sans text-[13px] transition-all"
            />
          </div>
          
          <button onClick={() => navigate('/studio/new')} className="bg-[#C8A96A] text-white font-sans text-[12px] font-bold px-5 h-9 rounded-[4px] hover:brightness-110 transition-all flex items-center gap-2 shadow-sm uppercase tracking-wider">
            <Plus className="w-4 h-4" /> New Repository
          </button>
          
          <div onClick={() => navigate('/profile/me')} className="flex items-center gap-2 cursor-pointer group ml-4 border-l border-[#C8A96A]/20 pl-6">
            <AvatarDisplay size={28} avatarUrl={avatarUrl} displayName={displayName} username={authUsername} />
            <span className="font-mono text-[12px] text-gray-500 group-hover:text-[#C8A96A] transition-colors">@{authUsername}</span>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="h-[56px] bg-[#C8A96A]/[0.04] border-b border-[#C8A96A]/10 px-10 flex items-center gap-10 shrink-0 relative z-10">
        <div className="font-mono text-[12px] text-[#1A1A1A] flex items-center gap-2"><Hexagon className="w-3 h-3 text-[#C8A96A]" /> {allCount} Repositories</div>
        <div className="text-gray-300">&middot;</div>
        <div className="font-mono text-[12px] text-[#1A1A1A] flex items-center gap-2"><Hexagon className="w-3 h-3 text-[#C8A96A]" /> {draftCount} Drafts</div>
        <div className="text-gray-300">&middot;</div>
        <div className="font-mono text-[12px] text-gray-500 flex items-center gap-2"><Hexagon className="w-3 h-3 text-gray-400" /> Last active: Today</div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* LEFT SIDEBAR */}
        <div className="w-[260px] bg-white border-r border-[#C8A96A]/15 py-5 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
          <div className="px-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">Navigation</div>
          <div className="flex flex-col">
            {[
              { label: 'All Repositories', icon: <Hexagon className="w-4 h-4" />, count: allCount },
              { label: 'Drafts', icon: <Edit3 className="w-4 h-4" />, count: draftCount },
              { label: 'Published', icon: <ArrowRight className="w-4 h-4 -rotate-45" />, count: publishedCount },
              { label: 'Private', icon: <Lock className="w-4 h-4" />, count: privateCount },
              { label: 'Forked', icon: <GitFork className="w-4 h-4" />, count: forkedCount },
              { label: 'Collaborations', icon: <Users className="w-4 h-4" />, count: collabCount },
              { label: 'Starred', icon: <Star className="w-4 h-4" />, count: starredCount },
              { label: 'Archived', icon: <Trash2 className="w-4 h-4" /> }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => setActiveFilter(item.label)}
                className={`flex items-center px-5 h-10 cursor-pointer transition-colors group ${activeFilter === item.label ? 'bg-[#C8A96A]/[0.08] border-l-[3px] border-[#C8A96A] text-[#1A1A1A] font-medium' : 'text-gray-600 hover:bg-[#C8A96A]/[0.05] border-l-[3px] border-transparent'}`}
              >
                <div className={`mr-3 ${activeFilter === item.label ? 'text-[#C8A96A]' : 'text-gray-400 group-hover:text-[#C8A96A]'}`}>{item.icon}</div>
                <span className="font-sans text-[13px]">{item.label}</span>
                {typeof item.count === 'number' && (
                  <div className="ml-auto bg-[#C8A96A]/15 text-[#C8A96A] font-mono text-[10px] h-[18px] px-1.5 rounded-sm flex items-center">
                    {item.count}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="my-4 mx-5 h-[0.5px] bg-[#C8A96A]/40"></div>

          <div className="px-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 mt-2">By Type</div>
          <div className="flex flex-col">
            {[
              { label: 'Projects', filter: 'Project', icon: <Building2 className="w-4 h-4" />, count: projectCount },
              { label: 'Case Studies', filter: 'Case Study', icon: <Ruler className="w-4 h-4" />, count: caseStudyCount },
              { label: 'Journals', filter: 'Journal', icon: <BookOpen className="w-4 h-4" />, count: journalCount },
              { label: 'Resources', filter: 'Resource', icon: <Package className="w-4 h-4" />, count: resourceCount },
              { label: 'References', filter: 'Reference', icon: <Link2 className="w-4 h-4" />, count: referenceCount }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => setActiveFilter(item.filter)}
                className={`flex items-center px-5 h-10 cursor-pointer transition-colors group ${activeFilter === item.filter ? 'bg-[#C8A96A]/[0.08] border-l-[3px] border-[#C8A96A] text-[#1A1A1A] font-medium' : 'text-gray-600 hover:bg-[#C8A96A]/[0.05] border-l-[3px] border-transparent'}`}
              >
                <div className={`mr-3 ${activeFilter === item.filter ? 'text-[#C8A96A]' : 'text-gray-400 group-hover:text-[#C8A96A]'}`}>{item.icon}</div>
                <span className="font-sans text-[13px]">{item.label}</span>
                {typeof item.count === 'number' && (
                  <div className="ml-auto bg-[#C8A96A]/15 text-[#C8A96A] font-mono text-[10px] h-[18px] px-1.5 rounded-sm flex items-center">
                    {item.count}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="my-4 mx-5 h-[0.5px] bg-[#C8A96A]/40"></div>

          <div className="px-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 mt-2">Recent</div>
          <div className="flex flex-col px-3 gap-1">
            {repos.length === 0 ? (
              <div className="px-2 py-1.5 font-sans text-[12px] text-gray-400 italic">No recent activity</div>
            ) : (
              repos.slice(0, 4).map((repo, i) => (
                <Link to={`/studio/${repo.id}`} key={i} className="flex flex-col px-2 py-1.5 rounded hover:bg-[#C8A96A]/[0.05] group">
                  <div className="flex items-center gap-1.5">
                    <Hexagon className="w-3 h-3 text-gray-400 group-hover:text-[#C8A96A]" />
                    <span className="font-sans text-[12px] text-gray-700 truncate group-hover:text-[#C8A96A] transition-colors">{repo.repo_name || repo.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-400 pl-[18px]">{new Date(repo.updated_at || repo.created_at).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-7 lg:p-8 overflow-y-auto">
          {/* TOOLBAR */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <h2 className="font-serif text-[22px] text-[#1A1A1A]">{activeFilter}</h2>
              <p className="font-sans text-[12px] text-gray-500">{filteredRepos.length} items found</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-[#C8A96A]/20 rounded-[6px] p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-[4px] transition-colors ${viewMode === 'grid' ? 'bg-[#C8A96A] text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-[4px] transition-colors ${viewMode === 'list' ? 'bg-[#C8A96A] text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
              <select className="h-8 border border-[#C8A96A]/20 bg-white rounded-[6px] px-2 font-sans text-[13px] text-gray-700 outline-none">
                <option>Newest</option>
                <option>Oldest</option>
                <option>Most recent</option>
                <option>A-Z</option>
              </select>
              <select className="h-8 border border-[#C8A96A]/20 bg-white rounded-[6px] px-2 font-sans text-[13px] text-gray-700 outline-none">
                <option>All</option>
                <option>Draft</option>
                <option>Published</option>
                <option>Private</option>
              </select>
            </div>
          </div>

          {/* CARDS GRID */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Hexagon className="w-12 h-12 text-[#C8A96A] animate-spin mb-4" />
              <p className="font-sans text-[14px] text-gray-500">Loading repositories...</p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-[#C8A96A]/10 flex items-center justify-center mb-6">
                <Hexagon className="w-10 h-10 text-[#C8A96A]" />
              </div>
              <h3 className="font-serif text-[24px] text-[#1A1A1A] mb-3">Your workspace is empty</h3>
              <p className="font-sans text-[14px] text-gray-500 max-w-[400px] mx-auto mb-8">
                Start building your architectural portfolio by creating your first repository.
              </p>
              <button onClick={() => navigate('/studio/new')} className="w-[300px] h-[180px] border-2 border-dashed border-[#C8A96A]/30 rounded-[12px] flex flex-col items-center justify-center text-gray-400 hover:border-[#C8A96A] hover:text-[#C8A96A] hover:bg-[#C8A96A]/[0.02] transition-all group">
                <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-sans text-[14px] font-medium">Create New Repository</span>
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
              {filteredRepos.map(repo => {
                const displayType = repo.content_type === 'case_study' ? 'Case Study' :
                                    repo.content_type === 'journal' ? 'Journal' :
                                    repo.content_type === 'resource' ? 'Resource' :
                                    repo.content_type === 'reference' ? 'Reference' : 'Project';
                const displayStatus = repo.status === 'published' ? 'Published' : 'Draft';
                return (
                  <div onClick={() => navigate(`/studio/${repo.id}`)} key={repo.id} className="bg-white border border-[#C8A96A]/20 rounded-[12px] p-5 cursor-pointer group hover:-translate-y-1 hover:border-[#C8A96A]/45 hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition-all duration-200 relative overflow-hidden flex flex-col">
                    <Hexagon className="absolute -bottom-6 -right-6 w-[120px] h-[120px] text-[#C8A96A]/5 transition-transform group-hover:scale-110 pointer-events-none" />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <Hexagon className="w-5 h-5 text-[#C8A96A]" />
                        {displayType && TYPE_COLORS[displayType] && (
                          <div className="px-2 py-0.5 rounded-[4px] flex items-center gap-1.5 border font-mono text-[9px] uppercase tracking-wider" 
                               style={{ backgroundColor: TYPE_COLORS[displayType].bg, borderColor: TYPE_COLORS[displayType].border, color: TYPE_COLORS[displayType].color }}>
                            {TYPE_COLORS[displayType].icon} {displayType}
                          </div>
                        )}
                      </div>
                      <div className={`px-2.5 py-0.5 rounded-full border font-sans text-[11px] font-medium tracking-wide flex items-center ${
                        displayStatus === 'Published' ? 'bg-[#4A9A4A]/10 text-[#4A9A4A] border-[#4A9A4A]/30' :
                        displayStatus === 'Draft' ? 'bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30' :
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {displayStatus}
                      </div>
                    </div>

                    <h3 className="font-serif text-[16px] text-[#1A1A1A] mt-2.5 relative z-10 group-hover:text-[#C8A96A] transition-colors">{repo.title}</h3>
                    <p className="font-sans text-[13px] text-gray-500 mt-1 line-clamp-2 relative z-10">
                      {repo.description || `Main repository for ${repo.title.toLowerCase()}. Contains all active documents, models, and presentation assets.`}
                    </p>

                    <div className="font-mono text-[11px] text-gray-400 mt-2.5 flex items-center gap-2 relative z-10">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last edited: {new Date(repo.updated_at || repo.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-[#C8A96A]/15 flex items-center justify-between relative z-10">
                      <span className="font-sans text-[11px] text-gray-400">{repo.visibility === 'private' ? 'Private' : 'Public'} Repository</span>
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-colors"><ArrowRight className="w-4 h-4 -rotate-45" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};



const Wizard = () => {
  const { username: authUsername, displayName, avatarUrl, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [repoType, setRepoType] = useState(() => {
    const t = location.state?.type;
    if (t === 'casestudy') return 'Case Study';
    if (t === 'journal') return 'Journal';
    if (t === 'resource') return 'Resource';
    return 'Project';
  });
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Controlled fields
  const [repoName, setRepoName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Residential');
  const [projectYear, setProjectYear] = useState(2026);
  const [visibility, setVisibility] = useState('public');
  const [allowForks, setAllowForks] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [markdown, setMarkdown] = useState('# Project Overview\n\nEnter your markdown documentation here...');

  useEffect(() => {
    if (location.state?.type) {
      setTimeout(() => setStep(1), 300);
    }
  }, [location.state]);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Map content type display values to database lowercase/snake_case
    const contentTypeMap = {
      'Project': 'project',
      'Case Study': 'case_study',
      'Journal': 'journal',
      'Resource': 'resource',
      'Reference': 'reference'
    };

    const cleanRepoName = repoName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
                          title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
                          'untitled-repository';

    const projectData = {
      repoName: cleanRepoName,
      title: title || 'Untitled Repository',
      description: description || '',
      contentType: contentTypeMap[repoType] || 'project',
      category: category,
      projectYear: parseInt(projectYear) || 2026,
      visibility: visibility,
      allowForks: allowForks,
      allowComments: allowComments
    };

    try {
      const { data, error } = await createProject(firebaseUser.uid, projectData);
      if (error) {
        console.error(error);
        setIsPublishing(false);
        alert('Failed to publish project: ' + error);
      } else if (data) {
        // Redirect to newly created workspace
        setTimeout(() => {
          navigate(`/studio/${data.id}`);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsPublishing(false);
      alert('Error: ' + err.message);
    }
  };

  const stepsList = [
    { num: 0, label: 'Repository Type', icon: <Box className="w-4 h-4" /> },
    { num: 1, label: 'Basic Details', icon: <Hexagon className="w-4 h-4" /> },
    { num: 2, label: 'Media Upload', icon: <ImageIcon className="w-4 h-4" /> },
    { num: 3, label: 'Documentation', icon: <FileText className="w-4 h-4" /> },
    { num: 4, label: 'Publish', icon: <ArrowUp className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-[80px] bg-[#F5F3EF] flex items-center justify-center p-6 relative" data-navbar-theme="light">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}></div>
      
      {isPublishing ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-10 bg-white border border-[#C8A96A] rounded-[16px] shadow-xl relative z-10">
          <Hexagon className="w-16 h-16 text-[#C8A96A] animate-spin mb-6" />
          <h2 className="font-serif text-[24px] text-[#1A1A1A]">Publishing Repository...</h2>
          <p className="font-sans text-[14px] text-gray-500 mt-2">Setting up your workspace and finalizing assets.</p>
        </motion.div>
      ) : (
        <div className="w-full max-w-[900px] h-[650px] bg-white border border-[#C8A96A]/20 rounded-[16px] shadow-xl relative z-10 flex overflow-hidden">
          
          {/* Left Sidebar Steps */}
          <div className="w-[240px] bg-[#FAFAF8] border-r border-[#C8A96A]/15 flex flex-col shrink-0 p-6">
            <h3 className="font-serif text-[18px] text-[#1A1A1A] mb-8">New Repository</h3>
            <div className="flex flex-col relative space-y-6">
              <div className="absolute left-4 top-4 bottom-8 w-[1px] bg-gray-200"></div>
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} className="flex items-start gap-4 relative z-10">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center bg-white transition-colors ${isActive ? 'border-[#C8A96A] text-[#C8A96A]' : isPassed ? 'border-green-500 text-green-500' : 'border-gray-200 text-gray-400'}`}>
                      {isPassed ? <Check className="w-4 h-4" /> : s.icon}
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className={`font-sans text-[13px] font-medium ${isActive ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>{s.label}</span>
                      <span className="font-mono text-[10px] text-gray-400 mt-0.5">Step {s.num.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
              {/* STEP 0: Type Selection */}
              {step === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                  <div className="mb-2">
                    <h2 className="font-serif text-[28px] text-[#1A1A1A]">Repository Type</h2>
                    <p className="font-sans text-[14px] text-gray-500 mt-1">Choose the architectural format for this repository. This determines the editor blocks and public layout.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(TYPE_COLORS).map(([type, data]) => (
                      <div 
                        key={type}
                        onClick={() => setRepoType(type)}
                        className={`p-4 border rounded-[8px] cursor-pointer transition-all flex items-start gap-4 ${repoType === type ? 'bg-[#C8A96A]/[0.08] border-[#C8A96A]' : 'bg-white border-gray-200 hover:border-[#C8A96A]/50'}`}
                      >
                        <div className="w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0" style={{ backgroundColor: data.bg, color: data.color }}>
                          {React.cloneElement(data.icon, { className: 'w-5 h-5' })}
                        </div>
                        <div>
                          <h3 className="font-serif text-[16px] text-[#1A1A1A] mb-1">{type}</h3>
                          <p className="font-sans text-[13px] text-gray-500">
                            {type === 'Project' && 'Standard architectural project with full documentation and timeline.'}
                            {type === 'Case Study' && 'In-depth analysis of a specific architectural problem and solution.'}
                            {type === 'Journal' && 'Editorial content, articles, or research papers for publication.'}
                            {type === 'Resource' && 'Downloadable assets, BIM families, or design templates.'}
                            {type === 'Reference' && 'External links, reading lists, or curated code specifications.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Details */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                  <div className="mb-2">
                    <h2 className="font-serif text-[28px] text-[#1A1A1A]">Basic Details</h2>
                    <p className="font-sans text-[14px] text-gray-500 mt-1">Set up your project's identity.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Repository Name *</label>
                    <input type="text" value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder="the-meridian-residence" className="h-11 border border-gray-300 rounded-[6px] px-3 font-mono text-[14px] text-[#1A1A1A] outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
                    <span className="font-mono text-[11px] text-[#C8A96A] mt-1">archive.com/@{authUsername || 'username'}/{repoName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'repository-name'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Display Title *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Meridian Residence" className="h-11 border border-gray-300 rounded-[6px] px-3 font-serif text-[16px] text-[#1A1A1A] outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Short Description *</label>
                    <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief overview shown on project card..." className="border border-gray-300 rounded-[6px] p-3 font-sans text-[14px] text-[#1A1A1A] outline-none resize-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Category *</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 border border-gray-300 rounded-[6px] px-3 font-sans text-[14px] text-[#1A1A1A] outline-none bg-white focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]">
                        <option>Residential</option><option>Commercial</option><option>Urban Planning</option><option>Interior</option><option>Landscape</option><option>Heritage</option><option>Mixed-Use</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Project Year</label>
                      <input type="number" value={projectYear} onChange={(e) => setProjectYear(e.target.value)} placeholder="2026" className="h-11 border border-gray-300 rounded-[6px] px-3 font-sans text-[14px] text-[#1A1A1A] outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Media */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 h-full">
                  <div className="mb-2">
                    <h2 className="font-serif text-[28px] text-[#1A1A1A]">Media Upload</h2>
                    <p className="font-sans text-[14px] text-gray-500 mt-1">Upload images, renders, and DWG files.</p>
                  </div>

                  <div className="border-2 border-dashed border-[#C8A96A]/40 bg-[#C8A96A]/[0.02] rounded-[12px] flex-1 flex flex-col items-center justify-center gap-3 hover:border-[#C8A96A] hover:bg-[#C8A96A]/[0.05] transition-all cursor-pointer group min-h-[200px]">
                    <Upload className="w-12 h-12 text-[#C8A96A] group-hover:-translate-y-1 transition-transform" />
                    <span className="font-serif text-[18px] text-[#1A1A1A]">Drag & drop files here</span>
                    <span className="font-sans text-[13px] text-gray-500">or click to browse</span>
                    <span className="font-mono text-[10px] text-gray-400 mt-2 bg-white px-2 py-1 rounded">Supports: JPG, PNG, PDF, DWG, RVT, MP4 (Max 50MB)</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Uploaded Files (0)</span>
                    <div className="h-20 border border-gray-200 rounded-[8px] flex items-center justify-center bg-gray-50 text-gray-400 font-sans text-[12px]">
                      No files uploaded yet.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Documentation */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 h-full">
                  <div className="mb-2">
                    <h2 className="font-serif text-[28px] text-[#1A1A1A]">Documentation</h2>
                    <p className="font-sans text-[14px] text-gray-500 mt-1">Draft your project's README using Markdown.</p>
                  </div>

                  <div className="flex-1 flex flex-col border border-gray-200 rounded-[8px] overflow-hidden">
                    <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-600"><strong className="font-serif">B</strong></button>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-600"><em className="font-serif">I</em></button>
                      <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-600 font-mono text-[12px]">{'</>'}</button>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-600"><ImageIcon className="w-3.5 h-3.5" /></button>
                    </div>
                    <textarea 
                      className="flex-1 p-4 font-mono text-[13px] text-[#1A1A1A] outline-none resize-none"
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                    ></textarea>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Publish */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                  <div className="mb-4">
                    <h2 className="font-serif text-[28px] text-[#1A1A1A]">Review & Publish</h2>
                    <p className="font-sans text-[14px] text-gray-500 mt-1">Finalize repository settings before making it live.</p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-6 mb-4 flex gap-6">
                    <div className="w-[120px] h-[120px] bg-gray-200 rounded-[8px] flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="font-mono text-[10px]">No Cover</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-serif text-[20px] text-[#1A1A1A] mb-1">{title || 'Untitled Repository'}</h3>
                      <p className="font-sans text-[13px] text-gray-500 line-clamp-2">{description || 'No description provided.'}</p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <AvatarDisplay avatarUrl={avatarUrl} displayName={displayName} username={authUsername} size={28} />
                        <span className="font-sans text-[13px] font-medium text-[#1A1A1A]">{displayName}</span>
                        <span className="font-mono text-[11px] text-gray-400">@{authUsername}</span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded font-sans text-[11px] text-gray-600">{category}</span>
                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded font-sans text-[11px] text-gray-600">{projectYear}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#C8A96A]">Visibility</span>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="vis" className="accent-[#C8A96A] w-4 h-4" checked={visibility === 'public'} onChange={() => setVisibility('public')} />
                        <span className="font-sans text-[14px] text-[#1A1A1A]">Public (Community)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="vis" className="accent-[#C8A96A] w-4 h-4" checked={visibility === 'private'} onChange={() => setVisibility('private')} />
                        <span className="font-sans text-[14px] text-[#1A1A1A]">Private (Only me)</span>
                      </label>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#C8A96A]">Permissions</span>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="accent-[#C8A96A] rounded w-4 h-4" checked={allowForks} onChange={(e) => setAllowForks(e.target.checked)} />
                        <span className="font-sans text-[14px] text-[#1A1A1A]">Allow forks</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="accent-[#C8A96A] rounded w-4 h-4" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} />
                        <span className="font-sans text-[14px] text-[#1A1A1A]">Allow comments</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="h-[80px] border-t border-gray-200 px-10 flex items-center justify-between shrink-0">
              <button 
                onClick={() => step > 0 ? setStep(step - 1) : navigate('/studio')} 
                className="font-sans text-[14px] text-gray-500 hover:text-[#1A1A1A] transition-colors font-medium"
              >
                {step > 0 ? '← Back' : 'Cancel'}
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={() => setStep(step + 1)} 
                  className="bg-[#1A1A1A] text-white font-sans text-[14px] font-bold px-8 h-11 rounded-[6px] hover:bg-[#C8A96A] transition-colors flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handlePublish} 
                  className="bg-[#C8A96A] text-white font-serif text-[16px] font-bold px-8 h-11 rounded-[6px] hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(200,169,106,0.3)] flex items-center gap-2"
                >
                  <Hexagon className="w-4 h-4" /> Publish to Studio
                </button>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

const Workspace = () => {
  const { username: authUsername, firebaseUser } = useAuth();
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable fields in state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [projectYear, setProjectYear] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [markdown, setMarkdown] = useState('');

  const [activeTab, setActiveTab] = useState('files');
  const [inspectorTab, setInspectorTab] = useState('Page');
  const [viewMode, setViewMode] = useState('edit');
  const rightPanelOpen = true;
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  useEffect(() => {
    if (repoId && firebaseUser?.uid) {
      const fetchProjectData = async () => {
        try {
          await supabase.rpc('set_firebase_uid', { uid: firebaseUser.uid });
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', repoId)
            .single();

          if (data) {
            setProject(data);
            setTitle(data.title || '');
            setDescription(data.description || '');
            setCategory(data.category || 'Residential');
            setProjectYear(data.project_year || 2026);
            setVisibility(data.visibility || 'public');
            setMarkdown(data.readme_markdown || '# Project Overview\n\nEnter your markdown documentation here...');
          } else {
            console.error(error);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProjectData();
    }
  }, [repoId, firebaseUser?.uid]);

  const handleCommit = async () => {
    if (!repoId || !firebaseUser?.uid) return;
    setIsCommitting(true);
    try {
      const updates = {
        title,
        description,
        category,
        project_year: parseInt(projectYear) || 2026,
        visibility,
        readme_markdown: markdown
      };
      
      const { data, error } = await updateProject(firebaseUser.uid, repoId, updates);

      if (error) {
        alert('Failed to save changes: ' + error);
      } else if (data) {
        setProject(data);
        setCommitModalOpen(false);
        setCommitMessage('');
        alert('Changes committed successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving changes: ' + err.message);
    } finally {
      setIsCommitting(false);
    }
  };

  const typeMap = {
    'project': 'Project',
    'case_study': 'Case Study',
    'journal': 'Journal',
    'resource': 'Resource',
    'reference': 'Reference'
  };
  const type = typeMap[project?.content_type] || 'Project';
  const repo = { name: project?.repo_name || '', title: project?.title || '' };

  // Background for workspace
  const workspaceBg = {
    backgroundColor: '#F7F6F3',
    backgroundImage: `repeating-linear-gradient(rgba(200,169,106,0.04) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(200,169,106,0.04) 1px, transparent 1px)`,
    backgroundSize: '32px 32px'
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] bg-[#F7F6F3] flex flex-col items-center justify-center">
        <Hexagon className="w-12 h-12 text-[#C8A96A] animate-spin mb-4" />
        <p className="font-sans text-[14px] text-gray-500">Loading workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-[calc(100vh-80px)] bg-[#F7F6F3] flex flex-col items-center justify-center p-6 text-center">
        <h3 className="font-serif text-[24px] text-[#1A1A1A] mb-2">Workspace Not Found</h3>
        <p className="font-sans text-[14px] text-gray-500 mb-6">The repository you are trying to access does not exist or you do not have permission to view it.</p>
        <button onClick={() => navigate('/studio')} className="bg-[#C8A96A] text-white font-sans text-[13px] font-bold px-6 h-9 rounded">Back to Studio</button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F7F6F3] flex flex-col overflow-auto lg:overflow-hidden relative text-[#1A1A1A]">
      
      {/* STUDIO TOOLBAR */}
      <div className="h-[48px] bg-white border-b border-[#C8A96A]/10 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/studio" className="font-mono text-[10px] text-gray-400 hover:text-[#C8A96A] flex items-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-3 h-3" /> Dashboard</Link>
          <div className="w-[1px] h-3 bg-gray-200"></div>
          <div className="font-mono text-[11px] flex items-center gap-2 tracking-wide">
            {TYPE_COLORS[type] && (
              <span className="flex items-center gap-1 uppercase" style={{ color: TYPE_COLORS[type].color }}>
                {TYPE_COLORS[type].icon} {type}
              </span>
            )}
            <span className="text-gray-300">/</span>
            <span className="text-[#1A1A1A] font-bold">{repo.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 bg-[#C8A96A]/[0.08] border border-[#C8A96A]/25 rounded-[6px] px-3 h-8 font-mono text-[11px] text-[#1A1A1A] hover:bg-[#C8A96A]/[0.12] transition-colors">
            <Hexagon className="w-3 h-3 text-[#C8A96A]" fill="currentColor" fillOpacity="0.3" />
            v1.2.0 &mdash; main
            <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
          </button>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-600">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            Unsaved changes
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} className="h-8 px-4 font-sans text-[13px] font-medium text-gray-500 border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> {viewMode === 'edit' ? 'Preview' : 'Edit'}
          </button>
          <button onClick={() => setCommitModalOpen(true)} className="h-8 px-4 bg-[#C8A96A] text-white font-sans text-[13px] font-bold rounded-[6px] hover:brightness-110 transition-colors flex items-center gap-1.5">
            <ArrowUp className="w-3.5 h-3.5" /> Commit Changes
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* IDE LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* PANEL A: LEFT SIDEBAR */}
        <div className="w-[240px] bg-[#FAFAF8] border-r border-[#C8A96A]/15 flex flex-col shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          {/* TABS */}
          <div className="flex h-10 border-b border-gray-200 shrink-0">
            <button onClick={() => setActiveTab('files')} className={`flex-1 flex items-center justify-center border-b-2 transition-colors ${activeTab === 'files' ? 'border-[#C8A96A] text-[#C8A96A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Folder className="w-4 h-4" /></button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#C8A96A] text-[#C8A96A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Clock className="w-4 h-4" /></button>
            <button onClick={() => setActiveTab('collab')} className={`flex-1 flex items-center justify-center border-b-2 transition-colors ${activeTab === 'collab' ? 'border-[#C8A96A] text-[#C8A96A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Users className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'files' && (
              <div className="flex flex-col py-2">
                {FILE_GROUPS.map((group, i) => (
                  <div key={i} className="flex flex-col mb-1">
                    <button className="flex items-center justify-between h-8 px-3.5 hover:bg-[#C8A96A]/[0.06] transition-colors group">
                      <div className="flex items-center gap-1.5">
                        <ChevronDown className="w-3.5 h-3.5 text-[#C8A96A]" />
                        <span className="font-mono text-[11px] uppercase text-gray-500 font-medium">{group.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#C8A96A]/70">{group.files.length}</span>
                    </button>
                    <div className="flex flex-col pb-1">
                      {group.files.map((f, j) => (
                        <div key={j} className="flex items-center h-[30px] pl-8 pr-3.5 hover:bg-[#C8A96A]/[0.06] cursor-pointer group/file border-l-2 border-transparent">
                          {f.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />}
                          {f.type === 'cad' && <Box className="w-3.5 h-3.5 text-amber-500 mr-2 shrink-0" />}
                          {f.type === 'pdf' && <FileIcon className="w-3.5 h-3.5 text-red-400 mr-2 shrink-0" />}
                          <span className="font-mono text-[12px] text-gray-700 truncate group-hover/file:text-[#C8A96A]">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'history' && (
              <div className="flex flex-col p-4 relative">
                <div className="absolute left-[27px] top-8 bottom-0 w-[0.5px] border-l border-dashed border-[#C8A96A]"></div>
                {HISTORY.map((h, i) => (
                  <div key={i} className={`flex items-start gap-4 p-3 rounded-[8px] relative z-10 transition-colors cursor-pointer mb-2 ${h.current ? 'border-l-2 border-[#C8A96A] bg-[#C8A96A]/5' : 'hover:bg-[#C8A96A]/5 border-l-2 border-transparent'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full border border-[#C8A96A] flex-shrink-0 mt-1 bg-white ${h.current ? 'bg-[#C8A96A]' : ''}`}></div>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#C8A96A]">{h.version}</span>
                        <span className="font-mono text-[10px] text-gray-400">{h.date}</span>
                      </div>
                      <span className="font-sans text-[13px] text-[#1A1A1A] mt-1">{h.msg}</span>
                      <div className="font-sans text-[12px] text-gray-500 mt-1">@{authUsername || 'username'} &middot; {h.filesCount} files</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {activeTab === 'files' && (
            <div className="p-4 border-t border-gray-200 shrink-0">
              <button className="w-full h-9 flex items-center justify-center gap-2 border border-dashed border-[#C8A96A]/60 text-[#C8A96A] font-sans text-[13px] font-medium rounded-[6px] hover:bg-[#C8A96A]/10 transition-colors">
                <Plus className="w-4 h-4" /> Add Files
              </button>
            </div>
          )}
        </div>

        {/* PANEL B: MAIN EDITOR AREA */}
        <div className="flex-1 flex flex-col relative z-0" style={workspaceBg}>
          <div className="h-[42px] bg-white border-b border-[#C8A96A]/10 px-5 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span className="text-gray-400">Overview</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-[#C8A96A]">{type} Page</span>
            </div>
            <div className="flex items-center bg-gray-100 p-0.5 rounded-full">
              <button 
                onClick={() => setViewMode('edit')}
                className={`px-3 h-7 rounded-full transition-all font-sans text-[12px] font-medium flex items-center gap-1.5 ${viewMode === 'edit' ? 'bg-[#C8A96A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-3 h-7 rounded-full transition-all font-sans text-[12px] font-medium flex items-center gap-1.5 ${viewMode === 'preview' ? 'bg-[#C8A96A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                👁 Preview
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll p-10 flex justify-center custom-scrollbar">
            <div className="w-full max-w-[800px] flex flex-col gap-6 pb-20 bg-white p-8 rounded-[12px] border border-gray-100 shadow-sm h-fit">
              {viewMode === 'edit' ? (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Display Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="h-11 border border-gray-200 rounded-[6px] px-3 font-serif text-[18px] outline-none focus:border-[#C8A96A]" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Description</label>
                    <textarea 
                      rows="3" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className="border border-gray-200 rounded-[6px] p-3 font-sans text-[14px] outline-none resize-none focus:border-[#C8A96A]" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Documentation (Markdown)</label>
                    <textarea 
                      rows="12" 
                      value={markdown} 
                      onChange={(e) => setMarkdown(e.target.value)} 
                      className="border border-gray-200 rounded-[6px] p-4 font-mono text-[13px] outline-none resize-none focus:border-[#C8A96A]" 
                    />
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <h1 className="font-serif text-[36px] text-[#1A1A1A] leading-tight mb-2">{title || project.title}</h1>
                  <p className="font-sans text-[16px] text-gray-500 italic mb-6">{description || project.description}</p>
                  <div className="h-[1px] bg-gray-200 my-6"></div>
                  <div className="font-mono text-[13px] text-gray-700 whitespace-pre-wrap">
                    {markdown || '# No documentation provided yet.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL C: RIGHT INSPECTOR */}
        {rightPanelOpen && (
          <div className="w-[280px] bg-white border-l border-[#C8A96A]/15 flex flex-col shrink-0 z-10 shadow-[-2px_0_10px_rgba(0,0,0,0.02)]">
            <div className="flex h-10 border-b border-gray-200 shrink-0">
              {['Page', 'Settings'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setInspectorTab(tab)}
                  className={`flex-1 font-sans text-[12px] font-medium border-b-2 transition-all ${inspectorTab === tab ? 'border-[#C8A96A] text-[#1A1A1A]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {inspectorTab === 'Page' && (
                <div className="flex flex-col gap-6">
                  {/* Type Lock Info */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-[8px]">
                    <div className="flex items-center gap-2 mb-2 text-[#1A1A1A]">
                      <Lock className="w-4 h-4" />
                      <span className="font-serif text-[15px]">Type Lock Active</span>
                    </div>
                    <p className="font-sans text-[12px] text-gray-500 leading-relaxed">
                      This repository is permanently locked as a <strong>{type}</strong>. 
                      This prevents breaking routing changes for public URLs post-publication.
                    </p>
                  </div>

                  {/* Type-adaptive metadata */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Repository Metadata</h4>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[12px] text-gray-600">Category</label>
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="w-full h-8 border border-gray-200 rounded px-2 font-sans text-[13px] outline-none bg-white"
                      >
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Urban Planning</option>
                        <option>Interior</option>
                        <option>Landscape</option>
                        <option>Heritage</option>
                        <option>Mixed-Use</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[12px] text-gray-600">Project Year</label>
                      <input 
                        type="number" 
                        value={projectYear} 
                        onChange={(e) => setProjectYear(e.target.value)} 
                        className="w-full h-8 border border-gray-200 rounded px-2 font-sans text-[13px] outline-none" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {inspectorTab === 'Settings' && (
                <div className="flex flex-col gap-4">
                  <h4 className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Visibility</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 font-sans text-[13px] text-gray-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="vis-editor" 
                        checked={visibility === 'public'} 
                        onChange={() => setVisibility('public')} 
                        className="accent-[#C8A96A]" 
                      />
                      Public (Community)
                    </label>
                    <label className="flex items-center gap-2 font-sans text-[13px] text-gray-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="vis-editor" 
                        checked={visibility === 'private'} 
                        onChange={() => setVisibility('private')} 
                        className="accent-[#C8A96A]" 
                      />
                      Private (Only me)
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* COMMIT MODAL */}
      <AnimatePresence>
        {commitModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[520px] bg-white rounded-[16px] shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="font-serif text-[20px] text-[#1A1A1A]">Commit Changes</h2>
                <p className="font-sans text-[14px] text-gray-500 mt-1 mb-6">Save a snapshot of your current project state.</p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex flex-col gap-2 font-mono text-[12px]">
                    <div className="flex items-center gap-2"><Plus className="w-3.5 h-3.5 text-green-500" /> <span className="text-gray-700">hero-render.jpg added</span></div>
                    <div className="flex items-center gap-2"><PenTool className="w-3.5 h-3.5 text-amber-500" /> <span className="text-gray-700">Project Page modified</span></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Commit Message</label>
                  <textarea 
                    rows="3" 
                    value={commitMessage} 
                    onChange={(e) => setCommitMessage(e.target.value)} 
                    placeholder="Describe what you changed..." 
                    className="border border-gray-300 rounded-[6px] p-3 font-sans text-[14px] outline-none resize-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" 
                  />
                </div>

                <button 
                  onClick={handleCommit} 
                  disabled={isCommitting} 
                  className="w-full h-12 bg-[#C8A96A] text-white font-serif text-[16px] font-bold rounded-[6px] hover:brightness-110 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isCommitting ? <Hexagon className="w-4 h-4 animate-spin" /> : <Hexagon className="w-4 h-4" />} Commit & Save
                </button>
                <div className="text-center mt-4">
                  <button onClick={() => setCommitModalOpen(false)} className="font-sans text-[14px] text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};


const GoldenLock = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0E0E0C] flex flex-col items-center justify-start pt-[160px] px-6 text-center" data-navbar-theme="dark">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[360px] w-full relative z-10"
      >
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-[#C8A96A]/15 blur-[40px] rounded-full"></div>
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotateY: [0, 10, -10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="w-24 h-24 rounded-full border border-[#C8A96A]/20 flex items-center justify-center bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(200,169,106,0.1)]">
              <Lock className="w-10 h-10 text-[#C8A96A]" strokeWidth={1} />
            </div>
          </motion.div>
        </div>
        
        <span className="font-mono text-[10px] text-[#C8A96A] tracking-[0.3em] uppercase mb-2 block opacity-80">Access Restricted</span>
        <h1 className="font-serif text-3xl text-white mb-4 leading-tight uppercase tracking-widest">Studio Locked</h1>
        
        <p className="font-sans text-gray-400 mb-8 leading-relaxed text-[14px]">
          The ArcHive Studio is a professional workspace reserved for verified architects. 
          Please authenticate to access your drafting tools.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="w-full h-12 bg-[#C8A96A] text-black font-serif font-bold text-[14px] rounded-[2px] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(200,169,106,0.1)] group uppercase"
          >
            Authenticate Session <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full h-12 border border-[#C8A96A]/10 text-gray-500 font-sans text-[11px] rounded-[2px] hover:text-[#C8A96A] hover:border-[#C8A96A]/30 transition-all uppercase tracking-[0.2em]"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Studio() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <Hexagon className="w-12 h-12 text-[#C8A96A] animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <GoldenLock />;
  }

  return (
    <div className="min-h-screen overflow-y-scroll overflow-x-hidden pt-[80px]" data-navbar-theme="light">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<Wizard />} />
        <Route path="/:repoId/*" element={<Workspace />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
