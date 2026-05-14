import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Hexagon, MapPin, Globe, Briefcase, GraduationCap, Calendar, Mail,
  Check, Edit2, LogOut, Trash2, ChevronLeft, ChevronRight, Search, 
  Settings as SettingsIcon, BarChart2, BookMarked, Grid, Lock, GitFork, Heart, ArrowUp, Plus, X,
  TrendingUp, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- STUB COMPONENTS FOR TABS ---

const RepoRow = ({ repo, isOwnProfile }) => (
  <div className="flex flex-col w-full bg-white border border-[#C8A96A]/15 rounded-[10px] p-4 mb-2 hover:border-[#C8A96A]/30 transition-colors group">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-2">
          <Hexagon className="w-3.5 h-3.5 text-[#C8A96A]" strokeWidth={2} />
          <Link to={`/projects/${repo.id}`} className="font-sans text-[15px] font-medium text-[#1A1A1A] group-hover:text-[#C8A96A] transition-colors">
            {repo.name}
          </Link>
          <span className="font-sans text-[11px] text-[#6B6860] bg-[#F5F3EF] px-2 py-0.5 rounded-full">{repo.category}</span>
        </div>
        <p className="font-sans text-[13px] text-[#6B6860] mt-1 line-clamp-1">{repo.description}</p>
      </div>
    </div>
    
    <div className="flex justify-between items-end mt-3">
      <div className="flex items-center space-x-4 font-mono text-[11px] text-[#6B6860]">
        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {repo.location}</span>
        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {repo.year}</span>
        <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-1"/> {repo.upvotes}</span>
        <span className="flex items-center"><Heart className="w-3 h-3 mr-1"/> {repo.saves}</span>
        <span className="flex items-center"><GitFork className="w-3 h-3 mr-1"/> {repo.forks}</span>
      </div>
      <div className="flex items-center space-x-3 text-[11px] font-mono">
        <span className="text-[#6B6860]">Updated {repo.updatedAt}</span>
        {repo.isPrivate ? (
          <span className="flex items-center text-[#C8A96A]"><Lock className="w-3 h-3 mr-1"/> Private</span>
        ) : repo.isFork ? (
          <span className="flex items-center text-[#6B6860]"><GitFork className="w-3 h-3 mr-1"/> forked from {repo.forkedFrom}</span>
        ) : (
          <span className="flex items-center text-[#6B6860]"><Globe className="w-3 h-3 mr-1"/> Public</span>
        )}
      </div>
    </div>

    {isOwnProfile && (
      <div className="overflow-hidden max-h-0 group-hover:max-h-[32px] transition-all duration-200 ease-out flex space-x-3 mt-0 group-hover:mt-3 pt-0 group-hover:pt-3 border-t border-transparent group-hover:border-[#C8A96A]/10">
        <button className="text-[12px] font-sans text-[#6B6860] hover:text-[#C8A96A] flex items-center"><Edit2 className="w-3 h-3 mr-1"/> Edit</button>
        <button className="text-[12px] font-sans text-[#6B6860] hover:text-[#C8A96A] flex items-center"><Lock className="w-3 h-3 mr-1"/> Toggle Visibility</button>
        <button className="text-[12px] font-sans text-[#cc4444] hover:text-[#aa2222] flex items-center"><Trash2 className="w-3 h-3 mr-1"/> Delete</button>
      </div>
    )}
  </div>
);

const RepositoriesTab = ({ isOwnProfile }) => {
  const mockRepos = [
    { id: 1, name: "The Meridian Residence", category: "Residential", description: "A brutalist approach to tropical living spaces.", location: "Mumbai, IN", year: "2025", upvotes: 284, saves: 91, forks: 34, updatedAt: "3 days ago", isPrivate: false, isFork: false },
    { id: 2, name: "Nexus Studio Complex", category: "Commercial", description: "Adaptive reuse of an abandoned warehouse into a creative hub.", location: "Pune, IN", year: "2024", upvotes: 212, saves: 64, forks: 12, updatedAt: "1 week ago", isPrivate: false, isFork: false },
    { id: 3, name: "Eco-Pod Prototypes", category: "Sustainable", description: "Modular housing units for disaster relief.", location: "Global", year: "2026", upvotes: 89, saves: 12, forks: 45, updatedAt: "2 weeks ago", isPrivate: true, isFork: false },
  ];

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6860]" />
          <input type="text" placeholder="Find a repository..." className="w-full h-9 pl-9 pr-3 rounded-md border border-[#C8A96A]/20 bg-white font-sans text-sm focus:outline-none focus:border-[#C8A96A]" />
        </div>
        <div className="flex space-x-2">
          <select className="h-9 px-3 rounded-md border border-[#C8A96A]/20 bg-white font-sans text-sm focus:outline-none">
            <option>All</option><option>Public</option><option>Private</option><option>Forked</option>
          </select>
          <select className="h-9 px-3 rounded-md border border-[#C8A96A]/20 bg-white font-sans text-sm focus:outline-none">
            <option>Newest</option><option>Oldest</option><option>Most Stars</option>
          </select>
        </div>
      </div>
      <div>
        {mockRepos.filter(r => isOwnProfile || !r.isPrivate).map(repo => (
          <RepoRow key={repo.id} repo={repo} isOwnProfile={isOwnProfile} />
        ))}
      </div>
    </div>
  );
};

const InsightsTab = () => (
  <div className="mt-6 space-y-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Views", val: "48,291", trend: "12% week", pos: true },
        { label: "Total Saves", val: "1,847", trend: "4% week", pos: true },
        { label: "Upvotes", val: "6,204", trend: "8% week", pos: true },
        { label: "Forks", val: "312", trend: "2% week", pos: true },
      ].map((stat, i) => (
        <div key={i} className="bg-white border-l-[3px] border-[#C8A96A] border-y border-r border-y-[#C8A96A]/10 border-r-[#C8A96A]/10 rounded-r-md p-4 shadow-sm">
          <div className="font-mono text-[10px] text-[#C8A96A] uppercase mb-1">{stat.label}</div>
          <div className="font-serif text-[28px] text-[#1A1A1A]">{stat.val}</div>
          <div className={`font-sans text-[12px] mt-1 flex items-center ${stat.pos ? 'text-green-600' : 'text-red-500'}`}>
            {stat.pos && <TrendingUp className="w-3 h-3 mr-1" />} {stat.trend}
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-[#C8A96A]/15 rounded-[10px] p-6">
      <h3 className="font-sans font-medium text-[#1A1A1A] mb-4">Views Over Time</h3>
      <div className="h-48 flex items-end justify-between space-x-1">
         {[...Array(30)].map((_, i) => (
           <div key={i} className="w-full bg-[#C8A96A]/20 rounded-t-sm hover:bg-[#C8A96A] transition-colors" style={{ height: `${Math.random() * 100}%` }}></div>
         ))}
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="mt-6 max-w-2xl space-y-8">
    <section>
      <h3 className="font-serif text-[18px] text-[#1A1A1A] mb-4">Personal Information</h3>
      <div className="space-y-4">
        <div className="float-label-container">
          <input type="text" defaultValue="Cinzel" className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
          <label className="float-label bg-white px-1">Full Name</label>
        </div>
        <div className="float-label-container">
          <input type="email" defaultValue="demo@archive.com" className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
          <label className="float-label bg-white px-1">Email Address</label>
        </div>
      </div>
    </section>
    
    <section>
      <h3 className="font-serif text-[18px] text-[#1A1A1A] mb-4">Privacy & Visibility</h3>
      <div className="space-y-4 bg-white p-5 rounded-[10px] border border-[#C8A96A]/15">
        {[
          { label: "Show email on profile", defaultChecked: false },
          { label: "Allow messages from anyone", defaultChecked: true },
          { label: "Show activity feed publicly", defaultChecked: true },
          { label: "Show saved projects publicly", defaultChecked: false },
        ].map((toggle, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="font-sans text-[14px] text-[#1A1A1A]">{toggle.label}</span>
            <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${toggle.defaultChecked ? 'bg-[#C8A96A]' : 'bg-[#EDEBE6]'}`}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${toggle.defaultChecked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="pt-4">
      <button className="px-6 py-2 bg-[#C8A96A] text-[#1A1A1A] rounded-md font-sans font-medium hover:bg-[#A8894A] transition-colors">Save Changes</button>
    </div>
  </div>
);

const OverviewTab = ({ isOwnProfile }) => (
  <div className="mt-6 space-y-8">
    {/* Contribution Graph */}
    <div className="bg-white border border-[#C8A96A]/20 rounded-[12px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-[16px] text-[#1A1A1A]">ACTIVITY</h3>
        <div className="font-mono text-[12px] text-[#6B6860] flex items-center space-x-2">
          <button className="hover:text-[#C8A96A] p-1"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <span>2026</span>
          <button className="hover:text-[#C8A96A] p-1"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-[3px] min-w-[700px]">
          {/* Mock 52 weeks */}
          {[...Array(52)].map((_, w) => (
            <div key={w} className="flex flex-col space-y-[3px]">
              {[...Array(7)].map((_, d) => {
                const levels = ['bg-[#EDEBE6]', 'bg-[#C8A96A]/25', 'bg-[#C8A96A]/55', 'bg-[#C8A96A]/80', 'bg-[#C8A96A]'];
                const level = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
                return (
                  <div key={d} className={`w-[10px] h-[10px] rounded-[2px] ${levels[level]} hover:ring-1 hover:ring-[#C8A96A] transition-all cursor-pointer`} title="Activity"></div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="text-[9px] font-mono text-[#6B6860]">Learn how we count contributions</div>
        <div className="flex items-center space-x-1 text-[9px] font-mono text-[#6B6860]">
          <span>Less</span>
          <div className="flex space-x-[3px]">
            {['bg-[#EDEBE6]', 'bg-[#C8A96A]/25', 'bg-[#C8A96A]/55', 'bg-[#C8A96A]/80', 'bg-[#C8A96A]'].map((bg, i) => (
              <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${bg}`}></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>

    {/* Pinned Projects */}
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-[16px] text-[#1A1A1A]">PINNED PROJECTS</h3>
        {isOwnProfile && <button className="text-[12px] font-sans text-[#6B6860] hover:text-[#C8A96A] flex items-center"><Edit2 className="w-3 h-3 mr-1"/> Edit Pins</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white border-l-[3px] border-[#C8A96A] border-y border-r border-y-[#C8A96A]/10 border-r-[#C8A96A]/10 rounded-[10px] p-4 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(200,169,106,0.15)] transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <h4 className="font-serif text-[14px] text-[#1A1A1A]">The Meridian Residence</h4>
              <span className="font-sans text-[10px] bg-[#EDEBE6] text-[#6B6860] px-2 py-0.5 rounded-full">Residential</span>
            </div>
            <p className="font-sans text-[12px] text-[#6B6860] mt-2 line-clamp-1">A brutalist approach to tropical living spaces.</p>
            <div className="flex space-x-3 mt-3 font-mono text-[10px] text-[#6B6860]">
              <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-1"/> 284</span>
              <span className="flex items-center"><Heart className="w-3 h-3 mr-1"/> 91</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


// --- MAIN PROFILE COMPONENT ---

const Profile = () => {
  const { username, tab } = useParams();
  const navigate = useNavigate();
  const [authData, setAuthData] = useState(null);
  
  // Logic to determine if it's the own profile
  const isOwnProfile = !username || username === 'me' || (authData && username === authData.handle?.replace('@',''));
  
  // Local states
  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    try {
      const localData = localStorage.getItem('archive_auth');
      if (localData) {
        setAuthData(JSON.parse(localData));
      } else if (username === 'me' || !username) {
        navigate('/login');
      }
    } catch (e) {
      console.error("Auth parsing error", e);
      navigate('/login');
    }
  }, [username, navigate]);

  // Profile Data Source
  const profileData = isOwnProfile ? {
    name: authData?.name || 'Anshul',
    handle: authData?.handle || '@anshul_arch',
    title: authData?.role || 'Principal Architect & Urbanist',
    location: 'Mumbai, India',
    bio: 'Founder of ArcHive. Passionate about modular structural systems and the future of sustainable urban density. Architecture is the hardware of society.',
    firm: 'ArcHive Studio',
    education: 'School of Planning & Architecture, 2022',
    memberSince: 'January 2026',
    website: 'anshul.archive.com',
    specializations: ['Modular Design', 'Sustainable Urbanism', 'Structural Logic', 'Digital Fabrication'],
    tools: ['Revit', 'Rhino', 'Grasshopper', 'Twinmotion'],
    stats: { projects: 42, followers: '3.4k', following: 892, upvotes: '12.5k' },
    connections: 128
  } : {
    name: 'Zaha Hadid',
    handle: '@zahahadid',
    title: 'Legendary Architect',
    location: 'London, UK',
    bio: 'Exploring the fluidity of space and form. Pushing the boundaries of structural expressionism.',
    firm: 'Zaha Hadid Architects',
    education: 'AA School of Architecture',
    memberSince: 'January 2024',
    website: 'zaha-hadid.com',
    specializations: ['Parametric', 'Deconstructivism', 'Civic Architecture'],
    tools: ['Rhino', 'Maya', 'Grasshopper'],
    stats: { projects: 142, followers: '124k', following: 12, upvotes: '890k' },
    connections: 1205
  };

  const handleLogout = () => {
    localStorage.removeItem('archive_auth');
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('archive_auth');
    // In a real app, this would call an API
    navigate('/signup');
  };

  const tabs = isOwnProfile 
    ? ['overview', 'repositories', 'saved', 'insights', 'settings']
    : ['overview', 'repositories', 'saved'];

  return (
    <div className="min-h-screen bg-[#F5F3EF] relative">
      {/* Fixed Background Hex Grid */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-5"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='110' height='190.52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M55 0L110 31.75V95.26L55 127L0 95.26V31.75L55 0ZM55 190.52L110 158.77V95.26L55 127L0 158.77V190.52Z' fill='none' stroke='%23C8A96A' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: '110px 190.52px'
        }}
      />

      {/* Hero Banner (Extended Cinematic Scale) */}
      <div className="relative w-full h-[300px] md:h-[420px] bg-[#111111] z-10" data-navbar-theme="dark">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='55' height='95.26' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M27.5 0L55 15.87V47.63L27.5 63.5L0 47.63V15.87L27.5 0ZM27.5 95.26L55 79.38V47.63L27.5 63.5L0 79.38V95.26Z' fill='none' stroke='%23C8A96A' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '55px 95.26px'
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none">
          <svg width="400" height="240" viewBox="0 0 400 240" fill="none">
             <path d="M100 240V70L200 20L300 70V240M200 20V240M100 120H300M100 180H300" stroke="#C8A96A" strokeWidth="2"/>
          </svg>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-full relative pt-[110px] md:pt-[120px]">
          <div className="font-mono text-[11px] text-[#F5F3EF]/60 tracking-wider flex items-center">
            Home <ChevronRight className="w-3 h-3 mx-2 opacity-50" /> Profile
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-20 pb-20">
        
        {/* Identity Strip */}
        <div className="-mt-[120px] md:-mt-[160px] flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#C8A96A]/20 relative z-30">
          <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-30">
            <div className="relative group">
              <div className="w-[96px] h-[96px] rounded-full bg-[#111111] border-[3px] border-[#C8A96A] shadow-[0_0_0_4px_#F5F3EF] overflow-hidden flex items-center justify-center text-[#C8A96A] text-4xl">
                {profileData.name.charAt(0)}
              </div>
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity border-[3px] border-transparent shadow-[0_0_0_4px_transparent]">
                  <Edit2 className="text-white w-6 h-6" />
                </div>
              )}
            </div>

            <div className="pb-1">
              <div className="flex items-center flex-wrap gap-3">
                <h1 className="font-serif text-[28px] text-[#F5F3EF] uppercase tracking-[0.1em] leading-tight flex items-center">
                  {profileData.name}
                  <Hexagon className="w-[16px] h-[16px] ml-3 text-[#C8A96A] fill-[#C8A96A]" />
                </h1>
                {isOwnProfile ? (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#111111]/40 backdrop-blur-sm border border-[#C8A96A] text-[#F5F3EF] md:text-[#F5F3EF] rounded-md font-sans text-[12px] hover:bg-[#C8A96A]/20 transition-colors flex items-center">
                      <Edit2 className="w-3 h-3 mr-1.5" /> Edit Profile
                    </button>
                    <button className="px-3 py-1 bg-[#111111]/40 backdrop-blur-sm border border-white/20 text-[#F5F3EF] rounded-md font-sans text-[12px] hover:bg-white/10 transition-colors flex items-center">
                      <Edit2 className="w-3 h-3 mr-1.5" /> Edit Banner
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-4 py-1.5 rounded-md font-sans text-[13px] transition-all flex items-center ${isFollowing ? 'border border-[#C8A96A] text-[#F5F3EF]' : 'bg-[#C8A96A] text-[#1A1A1A] hover:bg-[#A8894A]'}`}
                    >
                      {isFollowing ? <><Check className="w-3.5 h-3.5 mr-1"/> Following</> : 'Follow'}
                    </button>
                    <button className="px-4 py-1.5 border border-[#F5F3EF]/20 text-[#F5F3EF] rounded-md font-sans text-[13px] hover:border-[#F5F3EF] transition-colors">
                      Message
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-5 mt-3">
                <span className="font-mono text-[13px] text-[#C8A96A] font-medium">{profileData.handle}</span>
                <span className="font-sans text-[14px] text-[#F5F3EF]/80 flex items-center">
                  {profileData.title}
                </span>
                <span className="font-sans text-[14px] text-[#F5F3EF]/80 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {profileData.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end mt-4 md:mt-0 gap-3">
            <div className="flex space-x-2">
               {[<Globe key="1"/>, <span key="2" className="font-bold">in</span>, <span key="3" className="font-bold">X</span>].map((icon, i) => (
                 <button key={i} className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[#C8A96A] border border-[#C8A96A]/30 hover:bg-[#C8A96A] hover:text-[#1A1A1A] transition-colors">
                   {typeof icon === 'string' ? icon : React.cloneElement(icon, { className: 'w-3.5 h-3.5' })}
                 </button>
               ))}
               {isOwnProfile && <button className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[#C8A96A] border border-dashed border-[#C8A96A]/50 hover:bg-[#C8A96A]/10 transition-colors"><Plus className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Projects', val: profileData.stats.projects },
                { label: 'Followers', val: profileData.stats.followers },
                { label: 'Following', val: profileData.stats.following },
                { label: 'Upvotes', val: profileData.stats.upvotes },
              ].map(stat => (
                <div key={stat.label} className="bg-[#1A1A1A]/40 backdrop-blur-sm border border-[#C8A96A]/20 px-3 py-1.5 rounded-md flex items-baseline gap-1.5 cursor-pointer hover:bg-[#C8A96A]/10 transition-colors">
                  <span className="font-mono text-[13px] text-[#F5F3EF] font-bold">{stat.val}</span>
                  <span className="font-mono text-[11px] text-[#C8A96A]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col md:flex-row mt-16 md:mt-24 gap-10">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[300px] shrink-0 space-y-6">
            <div className="sticky top-[88px] space-y-6">
              
              {/* Bio Card */}
              <div className="bg-white border border-[#C8A96A]/20 rounded-[12px] p-5 shadow-sm group">
                <h3 className="font-mono text-[10px] text-[#C8A96A] tracking-[0.15em] mb-3">ABOUT</h3>
                <p className="font-sans text-[14px] text-[#1A1A1A] leading-relaxed mb-5 relative">
                  {profileData.bio}
                  {isOwnProfile && <Edit2 className="absolute -right-2 -top-2 w-3.5 h-3.5 text-[#C8A96A] opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />}
                </p>
                <div className="space-y-3 font-sans text-[13px] text-[#1A1A1A]">
                  <div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-[#6B6860] shrink-0" /> {profileData.firm}</div>
                  <div className="flex items-center gap-3"><GraduationCap className="w-4 h-4 text-[#6B6860] shrink-0" /> {profileData.education}</div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-[#6B6860] shrink-0" /> Member since {profileData.memberSince}</div>
                  {isOwnProfile && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#6B6860] shrink-0" /> {authData?.email || 'demo@archive.com'}</div>}
                  <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-[#6B6860] shrink-0" /> <a href="#" className="text-[#C8A96A] hover:underline">{profileData.website}</a></div>
                </div>

                <div className="mt-6">
                  <h3 className="font-mono text-[10px] text-[#C8A96A] tracking-[0.15em] mb-3">SPECIALIZATIONS</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specializations.map(s => (
                      <span key={s} className="px-2.5 py-1 border border-[#C8A96A]/30 rounded-full font-sans text-[12px] text-[#1A1A1A]">{s}</span>
                    ))}
                    {isOwnProfile && <span className="px-2.5 py-1 border border-dashed border-[#C8A96A] rounded-full font-sans text-[12px] text-[#C8A96A] cursor-pointer hover:bg-[#C8A96A]/10">+ Add</span>}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-mono text-[10px] text-[#C8A96A] tracking-[0.15em] mb-3">TOOLS</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.tools.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-[#F5F3EF] rounded-md font-sans text-[12px] text-[#6B6860]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connections Card */}
              <div className="bg-white border border-[#C8A96A]/20 rounded-[12px] p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-mono text-[10px] text-[#C8A96A] tracking-[0.15em]">CONNECTIONS</h3>
                  <span className="font-mono text-[11px] text-[#6B6860]">{profileData.connections} total</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-[#EDEBE6] rounded-full border border-[#C8A96A]/20 cursor-pointer hover:border-[#C8A96A] transition-colors"></div>
                  ))}
                </div>
                {isOwnProfile && (
                  <div className="mt-4 pt-3 border-t border-[#C8A96A]/10 text-center">
                    <a href="#" className="font-sans text-[12px] text-[#C8A96A] hover:underline">2 pending requests</a>
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              {isOwnProfile && (
                <div className="space-y-2 mt-8">
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full h-10 border border-[#C8A96A]/20 rounded-md flex items-center px-4 text-[#6B6860] font-sans text-[13px] hover:bg-[#C8A96A]/10 hover:text-[#C8A96A] transition-all"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full h-10 border border-[#cc4444]/20 rounded-md flex items-center px-4 text-[#cc4444] font-sans text-[13px] hover:bg-[#cc4444]/10 hover:border-[#cc4444]/40 transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 min-w-0">
            {/* Tab Bar */}
            <div className="sticky top-[70px] z-30 bg-[#F5F3EF]/90 backdrop-blur-md border-b border-[#C8A96A]/15 h-[48px] flex items-end px-2 overflow-x-auto no-scrollbar">
              <div className="flex space-x-8">
                {tabs.map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-3 font-sans text-[14px] capitalize relative whitespace-nowrap transition-colors ${activeTab === t ? 'text-[#1A1A1A] font-medium' : 'text-[#6B6860] hover:text-[#1A1A1A]'}`}
                  >
                    {t}
                    {activeTab === t && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A96A]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && <OverviewTab isOwnProfile={isOwnProfile} />}
                  {activeTab === 'repositories' && <RepositoriesTab isOwnProfile={isOwnProfile} />}
                  {activeTab === 'saved' && <div>Saved Tab Content...</div>}
                  {activeTab === 'insights' && isOwnProfile && <InsightsTab />}
                  {activeTab === 'settings' && isOwnProfile && <SettingsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirm Toast */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-[#1A1A1A] text-white p-4 rounded-[10px] shadow-lg z-50 flex items-center space-x-4 border border-[#C8A96A]/30"
          >
            <span className="font-sans text-[14px]">Are you sure?</span>
            <div className="flex space-x-2">
              <button onClick={handleLogout} className="px-3 py-1.5 bg-[#cc4444] rounded-md font-sans text-[12px] hover:bg-[#aa2222]">Log Out</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="px-3 py-1.5 border border-white/20 rounded-md font-sans text-[12px] hover:bg-white/10">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[16px] p-8 border border-[#cc4444]/30 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#cc4444]/10 flex items-center justify-center mb-6">
                  <Trash2 className="w-8 h-8 text-[#cc4444]" />
                </div>
                <h2 className="font-serif text-[24px] text-[#1A1A1A] mb-3">Delete Account?</h2>
                <p className="font-sans text-[14px] text-[#6B6860] mb-8 leading-relaxed">
                  This action is permanent and cannot be undone. All your repositories, designs, and contributions will be lost forever.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full py-3 bg-[#cc4444] text-white rounded-md font-serif font-medium text-[16px] hover:bg-[#aa2222] transition-colors"
                  >
                    Yes, Delete My Account
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full py-3 border border-[#C8A96A]/20 text-[#1A1A1A] rounded-md font-sans text-[15px] hover:bg-[#F5F3EF] transition-colors"
                  >
                    Keep My Account
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
