import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hexagon, Search, Plus, Folder, Clock, Star, GitBranch, GitCommit, FileText, 
  GitCompare, GitFork, Eye, MessageSquare, Settings, HelpCircle, LayoutGrid,
  ChevronDown, ChevronRight, X, File as FileIcon, Image as ImageIcon, Box, 
  Upload, MoreHorizontal, Share, Download, Copy, ChevronLeft, Trash2, 
  ArrowRight, LayoutList, Lock, PenTool, Edit3, LockOpen, AlignLeft,
  AlignCenter, AlignRight, FileDown, Edit, ArrowUp, ArrowDown, Users, MapPin
} from 'lucide-react';

// --- MOCK DATA ---
const REPOS = [
  { id: '1', name: 'the-meridian-residence', title: 'The Meridian Residence', visibility: 'Public', status: 'Published', type: 'Residential', typeIcon: '⬡', lastEdit: '2d ago', commits: 3, collaborators: 2, files: { pdf: 4, img: 12, dwg: 2 } },
  { id: '2', name: 'kochi-cultural-centre', title: 'Kochi Cultural Centre', visibility: 'Private', status: 'Draft', type: 'Commercial', typeIcon: 'lock', lastEdit: '1w ago', commits: 12, collaborators: 0, files: { pdf: 2, img: 5, dwg: 1 } },
  { id: '3', name: 'villa-nova-parametric', title: 'Villa Nova Facade', visibility: 'Public', status: 'Published', type: 'Research', typeIcon: 'fork', lastEdit: '3h ago', commits: 45, collaborators: 4, files: { pdf: 0, img: 8, dwg: 4 } }
];

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
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All Repositories');
  
  const filteredRepos = REPOS.filter(repo => {
    if (activeFilter === 'All Repositories') return true;
    if (activeFilter === 'Drafts') return repo.status === 'Draft';
    if (activeFilter === 'Published') return repo.status === 'Published';
    if (activeFilter === 'Private') return repo.visibility === 'Private';
    return true;
  });
  
  return (
    <div className="min-h-screen bg-[#F5F3EF] relative text-[#1A1A1A] flex flex-col">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}></div>
      
      {/* TOOLBAR */}
      <div className="h-[64px] bg-white border-b border-[#C8A96A]/10 px-10 flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Hexagon className="w-5 h-5 text-[#C8A96A]" strokeWidth={2} />
          <h2 className="font-serif text-[18px] text-[#1A1A1A] tracking-tight">Personal Workspace</h2>
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
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="h-[56px] bg-[#C8A96A]/[0.04] border-b border-[#C8A96A]/10 px-10 flex items-center gap-10 shrink-0 relative z-10">
        <div className="font-mono text-[12px] text-[#1A1A1A] flex items-center gap-2"><Hexagon className="w-3 h-3 text-[#C8A96A]" /> 28 Repositories</div>
        <div className="text-gray-300">&middot;</div>
        <div className="font-mono text-[12px] text-[#1A1A1A] flex items-center gap-2"><Hexagon className="w-3 h-3 text-[#C8A96A]" /> 4 Drafts</div>
        <div className="text-gray-300">&middot;</div>
        <div className="font-mono text-[12px] text-[#1A1A1A] flex items-center gap-2"><Hexagon className="w-3 h-3 text-[#C8A96A]" /> 6 Collaborations</div>
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
              { label: 'All Repositories', icon: <Hexagon className="w-4 h-4" />, count: 28, active: true },
              { label: 'Drafts', icon: <Edit3 className="w-4 h-4" />, count: 4 },
              { label: 'Published', icon: <ArrowRight className="w-4 h-4 -rotate-45" />, count: 18 },
              { label: 'Private', icon: <Lock className="w-4 h-4" />, count: 6 },
              { label: 'Forked', icon: <GitFork className="w-4 h-4" />, count: 3 },
              { label: 'Collaborations', icon: <Users className="w-4 h-4" />, count: 6 },
              { label: 'Starred', icon: <Star className="w-4 h-4" />, count: 12 },
              { label: 'Archived', icon: <Trash2 className="w-4 h-4" /> }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => setActiveFilter(item.label)}
                className={`flex items-center px-5 h-10 cursor-pointer transition-colors group ${activeFilter === item.label ? 'bg-[#C8A96A]/[0.08] border-l-[3px] border-[#C8A96A] text-[#1A1A1A] font-medium' : 'text-gray-600 hover:bg-[#C8A96A]/[0.05] border-l-[3px] border-transparent'}`}
              >
                <div className={`mr-3 ${activeFilter === item.label ? 'text-[#C8A96A]' : 'text-gray-400 group-hover:text-[#C8A96A]'}`}>{item.icon}</div>
                <span className="font-sans text-[13px]">{item.label}</span>
                {item.count && (
                  <div className="ml-auto bg-[#C8A96A]/15 text-[#C8A96A] font-mono text-[10px] h-[18px] px-1.5 rounded-sm flex items-center">
                    {item.count}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="my-4 mx-5 h-[0.5px] bg-[#C8A96A]/40"></div>

          <div className="px-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 mt-2">Quick Actions</div>
          <div className="flex flex-col px-3">
            {[
              { label: 'Upload Files', icon: <Upload className="w-3.5 h-3.5" /> },
              { label: 'Templates', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
              { label: 'Documentation', icon: <FileText className="w-3.5 h-3.5" /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center px-2 h-8 text-gray-500 hover:text-[#1A1A1A] cursor-pointer transition-colors font-sans text-[13px] gap-2">
                {item.icon} {item.label}
              </div>
            ))}
          </div>

          <div className="my-4 mx-5 h-[0.5px] bg-[#C8A96A]/40"></div>

          <div className="px-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 mt-2">Recent</div>
          <div className="flex flex-col px-3 gap-1">
            {REPOS.slice(0, 4).map((repo, i) => (
              <Link to={`/studio/${repo.id}`} key={i} className="flex flex-col px-2 py-1.5 rounded hover:bg-[#C8A96A]/[0.05] group">
                <div className="flex items-center gap-1.5">
                  <Hexagon className="w-3 h-3 text-gray-400 group-hover:text-[#C8A96A]" />
                  <span className="font-sans text-[12px] text-gray-700 truncate group-hover:text-[#C8A96A] transition-colors">{repo.name}</span>
                </div>
                <span className="font-mono text-[10px] text-gray-400 pl-[18px]">2h ago</span>
              </Link>
            ))}
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
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
            {filteredRepos.map(repo => (
              <div onClick={() => navigate(`/studio/${repo.id}`)} key={repo.id} className="bg-white border border-[#C8A96A]/20 rounded-[12px] p-5 cursor-pointer group hover:-translate-y-1 hover:border-[#C8A96A]/45 hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition-all duration-200 relative overflow-hidden flex flex-col">
                <Hexagon className="absolute -bottom-6 -right-6 w-[120px] h-[120px] text-[#C8A96A]/5 transition-transform group-hover:scale-110 pointer-events-none" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {repo.typeIcon === '⬡' && <Hexagon className="w-5 h-5 text-[#C8A96A]" />}
                    {repo.typeIcon === 'lock' && <Lock className="w-4 h-4 text-gray-400" />}
                    {repo.typeIcon === 'fork' && <GitFork className="w-4 h-4 text-[#C8A96A]/70" />}
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full border font-sans text-[11px] font-medium tracking-wide flex items-center ${
                    repo.status === 'Published' ? 'bg-[#4A9A4A]/10 text-[#4A9A4A] border-[#4A9A4A]/30' :
                    repo.status === 'Draft' ? 'bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30' :
                    'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {repo.status}
                  </div>
                </div>

                <h3 className="font-serif text-[16px] text-[#1A1A1A] mt-2.5 relative z-10 group-hover:text-[#C8A96A] transition-colors">{repo.title}</h3>
                <p className="font-sans text-[13px] text-gray-500 mt-1 line-clamp-2 relative z-10">
                  Main repository for {repo.title.toLowerCase()}. Contains all active documents, models, and presentation assets.
                </p>

                <div className="font-mono text-[11px] text-gray-400 mt-2.5 flex items-center gap-2 relative z-10">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {repo.type}</span> &middot;
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last edited: {repo.lastEdit}</span> &middot;
                  <span className="flex items-center gap-1"><GitCommit className="w-3 h-3" /> {repo.commits} commits</span>
                </div>

                <div className="flex gap-2 mt-3 relative z-10">
                  {repo.files.pdf > 0 && <span className="bg-red-500/10 border border-red-500/30 text-red-600 font-mono text-[10px] px-2 py-0.5 rounded-full">PDF &times;{repo.files.pdf}</span>}
                  {repo.files.img > 0 && <span className="bg-blue-500/10 border border-blue-500/30 text-blue-600 font-mono text-[10px] px-2 py-0.5 rounded-full">IMG &times;{repo.files.img}</span>}
                  {repo.files.dwg > 0 && <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 font-mono text-[10px] px-2 py-0.5 rounded-full">DWG &times;{repo.files.dwg}</span>}
                </div>

                <div className="mt-auto pt-3 border-t border-[#C8A96A]/15 flex items-center justify-between relative z-10">
                  <div className="flex items-center">
                    {repo.collaborators > 0 ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white -ml-1 first:ml-0 relative z-[3]"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="c1" /></div>
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white -ml-1.5 relative z-[2]"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="c2" /></div>
                        <span className="font-sans text-[11px] text-gray-400 ml-2">You + {repo.collaborators} others</span>
                      </div>
                    ) : (
                      <span className="font-sans text-[11px] text-gray-400">Personal Repository</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-colors"><ArrowRight className="w-4 h-4 -rotate-45" /></button>
                    <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};



const Wizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-screen pt-[80px] bg-[#F5F3EF] flex flex-col items-center justify-center p-6 relative" data-navbar-theme="light">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z\' fill=\'none\' stroke=\'%23C8A96A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}></div>
      
      <div className="w-full max-w-[720px] bg-white border border-[#C8A96A] rounded-[16px] shadow-xl relative z-10 flex flex-col">
        {/* Stepper Header */}
        <div className="flex items-center justify-center gap-4 pt-10 pb-6">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full border ${step >= 1 ? 'border-[#C8A96A] bg-[#C8A96A]/10 text-[#C8A96A]' : 'border-gray-300 text-gray-400'} flex items-center justify-center`}>
              <Hexagon className="w-4 h-4" fill={step >= 1 ? "currentColor" : "none"} fillOpacity={0.2} />
            </div>
            <span className={`font-sans text-[11px] ${step >= 1 ? 'text-[#C8A96A]' : 'text-gray-400'}`}>Details</span>
          </div>
          <div className={`w-16 border-t border-dashed ${step >= 2 ? 'border-[#C8A96A]' : 'border-gray-300'} -mt-4`}></div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full border ${step >= 2 ? 'border-[#C8A96A] bg-[#C8A96A]/10 text-[#C8A96A]' : 'border-gray-300 text-gray-400'} flex items-center justify-center`}>
              <Hexagon className="w-4 h-4" fill={step >= 2 ? "currentColor" : "none"} fillOpacity={0.2} />
            </div>
            <span className={`font-sans text-[11px] ${step >= 2 ? 'text-[#C8A96A]' : 'text-gray-400'}`}>Upload</span>
          </div>
          <div className={`w-16 border-t border-dashed ${step >= 3 ? 'border-[#C8A96A]' : 'border-gray-300'} -mt-4`}></div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full border ${step >= 3 ? 'border-[#C8A96A] bg-[#C8A96A]/10 text-[#C8A96A]' : 'border-gray-300 text-gray-400'} flex items-center justify-center`}>
              <Hexagon className="w-4 h-4" fill={step >= 3 ? "currentColor" : "none"} fillOpacity={0.2} />
            </div>
            <span className={`font-sans text-[11px] ${step >= 3 ? 'text-[#C8A96A]' : 'text-gray-400'}`}>Publish</span>
          </div>
        </div>

        <div className="p-10 pt-4 flex-1">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              <div className="text-center mb-4">
                <h2 className="font-serif text-[24px] text-[#1A1A1A]">Create a New Repository</h2>
                <p className="font-sans text-[14px] text-gray-500 mt-1">Set up your project's identity before uploading files.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Repository Name *</label>
                <input type="text" placeholder="the-meridian-residence" className="h-11 border border-gray-300 rounded-[6px] px-3 font-mono text-[14px] text-[#1A1A1A] outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
                <span className="font-mono text-[11px] text-[#C8A96A] mt-1">archive.com/@anshul_arch/the-meridian-residence</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Display Title *</label>
                <input type="text" placeholder="The Meridian Residence" className="h-11 border border-gray-300 rounded-[6px] px-3 font-serif text-[16px] text-[#1A1A1A] outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Short Description *</label>
                <textarea rows="3" placeholder="Brief overview shown on project card..." className="border border-gray-300 rounded-[6px] p-3 font-sans text-[14px] text-[#1A1A1A] outline-none resize-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Category *</label>
                  <select className="h-11 border border-gray-300 rounded-[6px] px-3 font-sans text-[14px] text-[#1A1A1A] outline-none bg-white">
                    <option>Residential</option><option>Commercial</option><option>Urban Planning</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Project Year</label>
                  <input type="number" placeholder="2024" className="h-11 border border-gray-300 rounded-[6px] px-3 font-sans text-[14px] text-[#1A1A1A] outline-none" />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button onClick={() => navigate('/studio')} className="font-sans text-[14px] text-gray-500 hover:text-[#1A1A1A] transition-colors">Cancel</button>
                <button onClick={() => setStep(2)} className="bg-[#C8A96A] text-white font-sans text-[14px] font-bold px-6 h-11 rounded-[6px] hover:brightness-110 transition-all flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <h2 className="font-serif text-[24px] text-[#1A1A1A]">Upload Your Project Files</h2>
                <p className="font-sans text-[14px] text-gray-500 mt-1">Add everything you want to display on your project page.</p>
              </div>

              <div className="border-2 border-dashed border-[#C8A96A]/40 bg-[#C8A96A]/[0.03] rounded-[12px] h-[180px] flex flex-col items-center justify-center gap-2 hover:border-[#C8A96A] hover:bg-[#C8A96A]/[0.07] transition-all cursor-pointer group">
                <Upload className="w-10 h-10 text-[#C8A96A] group-hover:-translate-y-1 transition-transform" />
                <span className="font-serif text-[16px] text-[#1A1A1A]">Drag & drop files here</span>
                <span className="font-sans text-[13px] text-gray-500">or click to browse</span>
                <span className="font-mono text-[10px] text-gray-400 mt-2">Supports: JPG, PNG, PDF, DWG, RVT, MP4 (Max 50MB)</span>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button onClick={() => setStep(1)} className="font-sans text-[14px] text-gray-500 hover:text-[#1A1A1A] transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="bg-[#C8A96A] text-white font-sans text-[14px] font-bold px-6 h-11 rounded-[6px] hover:brightness-110 transition-all flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <h2 className="font-serif text-[24px] text-[#1A1A1A]">Review & Publish</h2>
              </div>
              
              <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-2 border-r border-gray-100 pr-8">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">How it appears</span>
                  <div className="bg-white border border-gray-200 rounded-[12px] overflow-hidden shadow-sm">
                    <div className="h-[120px] bg-gray-200 flex items-center justify-center text-gray-400">Cover Image</div>
                    <div className="p-4">
                      <div className="font-serif text-[16px] text-[#1A1A1A] mb-1">The Meridian Residence</div>
                      <div className="font-sans text-[12px] text-gray-500 line-clamp-2">Brief overview shown on project card...</div>
                      <div className="mt-3 flex gap-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded font-sans text-[10px]">Residential</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#C8A96A] text-[12px] font-sans hover:underline self-start mt-2">✎ Go back and edit</button>
                </div>
                
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">Publish Options</span>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="publish" className="accent-[#C8A96A] w-4 h-4" defaultChecked />
                      <span className="font-sans text-[14px] text-[#1A1A1A]">Publish Now</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="publish" className="accent-[#C8A96A] w-4 h-4" />
                      <span className="font-sans text-[14px] text-[#1A1A1A]">Save as Draft</span>
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">Settings</span>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="accent-[#C8A96A] rounded w-4 h-4" defaultChecked />
                      <span className="font-sans text-[14px] text-[#1A1A1A]">Allow comments</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="accent-[#C8A96A] rounded w-4 h-4" defaultChecked />
                      <span className="font-sans text-[14px] text-[#1A1A1A]">Allow forks</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="accent-[#C8A96A] rounded w-4 h-4" />
                      <span className="font-sans text-[14px] text-[#1A1A1A]">Allow downloads</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <button onClick={() => navigate('/studio/1')} className="w-full bg-[#C8A96A] text-white font-serif text-[16px] font-bold h-12 rounded-[6px] hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <Hexagon className="w-4 h-4" /> Publish Repository
                </button>
                <button onClick={() => navigate('/studio')} className="w-full text-gray-500 font-sans text-[14px] h-10 hover:bg-gray-50 rounded-[6px] transition-colors">
                  Save as Draft
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const Workspace = () => {
  const { repoId } = useParams();
  const [activeTab, setActiveTab] = useState('files');
  const [inspectorTab, setInspectorTab] = useState('Block');
  const [viewMode, setViewMode] = useState('edit');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [commitModalOpen, setCommitModalOpen] = useState(false);

  // Background for workspace
  const workspaceBg = {
    backgroundColor: '#F7F6F3',
    backgroundImage: `repeating-linear-gradient(rgba(200,169,106,0.04) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(200,169,106,0.04) 1px, transparent 1px)`,
    backgroundSize: '32px 32px'
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F7F6F3] flex flex-col overflow-auto lg:overflow-hidden relative text-[#1A1A1A]">
      
      {/* STUDIO TOOLBAR */}
      <div className="h-[48px] bg-white border-b border-[#C8A96A]/10 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/studio" className="font-mono text-[10px] text-gray-400 hover:text-[#C8A96A] flex items-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-3 h-3" /> Dashboard</Link>
          <div className="w-[1px] h-3 bg-gray-200"></div>
          <div className="font-mono text-[11px] flex items-center gap-1.5 uppercase tracking-wide">
            <span className="text-gray-400">Project</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#C8A96A] font-bold">the-meridian-residence</span>
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
          <button className="h-8 px-4 font-sans text-[13px] font-medium text-gray-500 border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Preview
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
                      <div className="font-sans text-[12px] text-gray-500 mt-1">{h.author} &middot; {h.filesCount} files</div>
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
              <span className="text-[#C8A96A]">Project Page</span>
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
            <div className="w-full max-w-[800px] flex flex-col gap-6 pb-20">
              
              {/* Dummy Canvas Blocks */}
              <div className="group relative" onClick={() => setSelectedBlock('text1')}>
                <div className={`absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab p-1 text-gray-400`}>⠿</div>
                <div className={`p-4 transition-all ${selectedBlock === 'text1' ? 'ring-2 ring-blue-400 rounded-md bg-white shadow-sm' : 'border border-transparent'}`}>
                  <h1 className="font-serif text-[42px] text-[#1A1A1A] leading-tight">The Meridian Residence</h1>
                  <p className="font-sans text-[18px] text-gray-600 mt-4 leading-relaxed">A contemporary exploration of light and monolithic forms, situated on the edge of the coastal cliffs.</p>
                </div>
              </div>

              <div className="relative my-2 h-0.5 w-full bg-transparent flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute w-full h-[1px] bg-[#C8A96A]"></div>
                <button className="w-6 h-6 rounded-full bg-[#C8A96A] text-white flex items-center justify-center relative z-10"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="group relative" onClick={() => setSelectedBlock('img1')}>
                <div className={`absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab p-1 text-gray-400`}>⠿</div>
                <div className={`transition-all ${selectedBlock === 'img1' ? 'ring-2 ring-blue-400 rounded-md p-1 bg-white shadow-sm' : ''}`}>
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" className="w-full h-[400px] object-cover rounded-md" alt="hero" />
                  <p className="font-sans text-[13px] text-gray-500 italic mt-2 text-center">View from the south cliff edge, sunset.</p>
                </div>
              </div>

              <div className="group relative" onClick={() => setSelectedBlock('quote1')}>
                <div className={`absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab p-1 text-gray-400`}>⠿</div>
                <div className={`transition-all ${selectedBlock === 'quote1' ? 'ring-2 ring-blue-400 rounded-md p-1 shadow-sm bg-white' : ''}`}>
                  <div className="bg-[#C8A96A]/[0.04] border-l-[4px] border-[#C8A96A] p-8 my-6">
                    <p className="font-serif text-[24px] italic text-[#1A1A1A]">"Architecture should speak of its time and place, but yearn for timelessness."</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* PANEL C: RIGHT INSPECTOR */}
        {rightPanelOpen && (
          <div className="w-[280px] bg-white border-l border-[#C8A96A]/15 flex flex-col shrink-0 z-10 shadow-[-2px_0_10px_rgba(0,0,0,0.02)]">
            <div className="flex h-10 border-b border-gray-200 shrink-0">
              {['Block', 'Page', 'Settings'].map(tab => (
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
              {!selectedBlock && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <LayoutGrid className="w-8 h-8 opacity-50" />
                  <p className="font-sans text-[13px] text-center">Select a block on the canvas to edit its properties.</p>
                </div>
              )}
              {selectedBlock === 'text1' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 block">Text Style</label>
                    <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded p-1 bg-gray-50">
                      <button className="h-7 bg-white shadow-sm rounded text-sm font-serif">H1</button>
                      <button className="h-7 rounded text-sm font-serif text-gray-500 hover:bg-gray-200">H2</button>
                      <button className="h-7 rounded text-sm font-serif text-gray-500 hover:bg-gray-200">H3</button>
                      <button className="h-7 rounded text-sm font-sans text-gray-500 hover:bg-gray-200">¶</button>
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 block">Alignment</label>
                    <div className="flex gap-1 border border-gray-200 rounded p-1 bg-gray-50">
                      <button className="flex-1 flex justify-center items-center h-7 bg-white shadow-sm rounded"><AlignLeft className="w-4 h-4" /></button>
                      <button className="flex-1 flex justify-center items-center h-7 rounded text-gray-500 hover:bg-gray-200"><AlignCenter className="w-4 h-4" /></button>
                      <button className="flex-1 flex justify-center items-center h-7 rounded text-gray-500 hover:bg-gray-200"><AlignRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              )}
              {selectedBlock === 'img1' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 block">Image Size</label>
                    <select className="w-full h-8 border border-gray-200 rounded px-2 font-sans text-[13px] outline-none">
                      <option>Full Width</option><option>80% Centered</option><option>50% Left</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2 block">Caption</label>
                    <input type="text" defaultValue="View from the south cliff edge, sunset." className="w-full h-8 border border-gray-200 rounded px-2 font-sans text-[13px] outline-none focus:border-[#C8A96A]" />
                  </div>
                  <div className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#C8A96A]" defaultChecked />
                    <span className="font-sans text-[13px] text-gray-700">Rounded corners</span>
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
                  <label className="font-sans text-[13px] font-medium text-[#1A1A1A]">Commit Message *</label>
                  <textarea rows="3" placeholder="Describe what you changed..." className="border border-gray-300 rounded-[6px] p-3 font-sans text-[14px] outline-none resize-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]" />
                </div>

                <div className="flex flex-col gap-3 mb-8">
                  <label className="font-mono text-[11px] text-[#C8A96A] uppercase tracking-wider">Version</label>
                  <div className="flex gap-3">
                    <div className="flex-1 border-2 border-[#C8A96A] bg-[#C8A96A]/5 rounded-lg p-3 cursor-pointer">
                      <div className="font-sans text-[14px] font-medium text-[#1A1A1A]">Patch</div>
                      <div className="font-mono text-[11px] text-gray-500 mt-1">1.2.1</div>
                    </div>
                    <div className="flex-1 border border-gray-200 hover:border-[#C8A96A]/50 rounded-lg p-3 cursor-pointer">
                      <div className="font-sans text-[14px] font-medium text-[#1A1A1A]">Minor</div>
                      <div className="font-mono text-[11px] text-gray-500 mt-1">1.3.0</div>
                    </div>
                    <div className="flex-1 border border-gray-200 hover:border-[#C8A96A]/50 rounded-lg p-3 cursor-pointer">
                      <div className="font-sans text-[14px] font-medium text-[#1A1A1A]">Major</div>
                      <div className="font-mono text-[11px] text-gray-500 mt-1">2.0.0</div>
                    </div>
                  </div>
                  <div className="font-mono text-[13px] text-gray-500 mt-1 text-center">New version will be: v1.2.1</div>
                </div>

                <button onClick={() => setCommitModalOpen(false)} className="w-full h-12 bg-[#C8A96A] text-white font-serif text-[16px] font-bold rounded-[6px] hover:brightness-110 flex items-center justify-center gap-2 transition-all">
                  <Hexagon className="w-4 h-4" /> Commit & Save
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      const auth = localStorage.getItem('archive_auth');
      setIsLoggedIn(!!auth);
      setChecking(false);
    };
    
    checkStatus();
    // Listen for storage changes
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <Hexagon className="w-12 h-12 text-[#C8A96A] animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
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
