import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Hexagon, MapPin, Globe, Briefcase, GraduationCap, Calendar, Mail,
  Check, Edit2, LogOut, Trash2, ChevronLeft, ChevronRight, Search, Lock, GitFork, Heart, ArrowUp, Plus,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { updateProfile } from 'firebase/auth';
import AvatarDisplay from '../components/AvatarDisplay';
import { useToast } from '../components/ToastContext';
import { getConnections } from '../lib/profile';
import { getProfileProjects } from '../lib/projects';

// --- STUB COMPONENTS FOR TABS ---

const RepoRow = ({ repo, isOwnProfile, username }) => (
  <div className="flex flex-col w-full bg-white border border-[#C8A96A]/15 rounded-[10px] p-4 mb-2 hover:border-[#C8A96A]/30 transition-colors group">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-2">
          <Hexagon className="w-3.5 h-3.5 text-[#C8A96A]" strokeWidth={2} />
          <Link to={`/projects/${username}/${repo.repo_name || repo.name}`} className="font-sans text-[15px] font-medium text-[#1A1A1A] group-hover:text-[#C8A96A] transition-colors">
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

const RepositoriesTab = ({ isOwnProfile, projects = [], loading = false, username }) => {
  const [search, setSearch] = React.useState('');
  const [visibilityFilter, setVisibilityFilter] = React.useState('All');
  const [sortOrder, setSortOrder] = React.useState('Newest');

  if (loading) {
    return <div className="py-12 text-center font-sans text-sm text-[#6B6860]">Loading projects...</div>;
  }

  const filtered = projects.filter(repo => {
    const matchesSearch = (repo.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (repo.repo_name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (repo.description || '').toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (visibilityFilter === 'Public') return repo.visibility === 'public';
    if (visibilityFilter === 'Private') return repo.visibility === 'private';
    if (visibilityFilter === 'Forked') return !!repo.is_fork;

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'Newest') return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
    if (sortOrder === 'Oldest') return new Date(a.updated_at || a.created_at) - new Date(b.updated_at || b.created_at);
    if (sortOrder === 'Most Stars') return (b.upvotes_count || 0) - (a.upvotes_count || 0);
    return 0;
  });

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6860]" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a repository..." 
            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#C8A96A]/20 bg-white font-sans text-sm focus:outline-none focus:border-[#C8A96A]" 
          />
        </div>
        <div className="flex space-x-2">
          <select 
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-[#C8A96A]/20 bg-white font-sans text-sm focus:outline-none"
          >
            <option>All</option>
            <option>Public</option>
            {isOwnProfile && <option>Private</option>}
            <option>Forked</option>
          </select>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-9 px-3 rounded-md border border-[#C8A96A]/20 bg-white font-sans text-sm focus:outline-none"
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Most Stars</option>
          </select>
        </div>
      </div>
      <div>
        {sorted.map(repo => {
          const normalizedRepo = {
            id: repo.id,
            name: repo.title || repo.repo_name,
            repo_name: repo.repo_name,
            category: repo.category || 'Architecture',
            description: repo.description || 'No description provided.',
            location: `${repo.location_city || ''}${repo.location_city && repo.location_country ? ', ' : ''}${repo.location_country || ''}` || 'Unknown Location',
            year: repo.project_year || 'N/A',
            upvotes: repo.upvote_count || repo.upvotes_count || 0,
            saves: repo.save_count || repo.saves_count || 0,
            forks: repo.fork_count || repo.forks_count || 0,
            updatedAt: new Date(repo.updated_at || repo.created_at).toLocaleDateString(),
            isPrivate: repo.visibility === 'private',
            isFork: repo.is_fork,
            forkedFrom: repo.forked_from
          };
          return (
            <RepoRow key={repo.id} repo={normalizedRepo} isOwnProfile={isOwnProfile} username={username} />
          );
        })}
        {sorted.length === 0 && (
          <div className="py-12 text-center font-sans text-sm text-[#6B6860]">
            No repositories found.
          </div>
        )}
      </div>
    </div>
  );
};

const InsightsTab = () => (
  <div className="mt-6 space-y-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Views", val: "0", trend: "0% week", pos: true },
        { label: "Total Saves", val: "0", trend: "0% week", pos: true },
        { label: "Upvotes", val: "0", trend: "0% week", pos: true },
        { label: "Forks", val: "0", trend: "0% week", pos: true },
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
           <div key={i} className="w-full bg-[#C8A96A]/20 rounded-t-sm hover:bg-[#C8A96A] transition-colors" style={{ height: `0%` }}></div>
         ))}
      </div>
    </div>
  </div>
);

const SettingsTab = () => {
  const { 
    supabaseUser, firebaseUser, refreshProfile, 
    displayName, username: authUsername, bio, 
    userTitle, organization, locationCity, locationCountry, 
    yearsExp, websiteUrl, education, 
    updateProfileFields 
  } = useAuth();
  const { toast } = useToast();

  const [toggles, setToggles] = React.useState({
    show_email: supabaseUser?.show_email ?? false,
    allow_messages: supabaseUser?.allow_messages ?? true,
    show_activity: supabaseUser?.show_activity ?? true,
    show_saves: supabaseUser?.show_saves ?? false,
  });

  const [formData, setFormData] = React.useState({
    displayName: displayName || '',
    email: firebaseUser?.email || '',
    username: authUsername || '',
    bio: bio || '',
    title: userTitle || '',
    organization: organization || '',
    location: `${locationCity || ''}${locationCity && locationCountry ? ', ' : ''}${locationCountry || ''}`,
    yearsExp: yearsExp || '',
    websiteUrl: websiteUrl || '',
    education: education || '',
  });

  const [prevDisplayName, setPrevDisplayName] = React.useState(displayName);
  const [prevEmail, setPrevEmail] = React.useState(firebaseUser?.email);
  const [prevUsername, setPrevUsername] = React.useState(authUsername);
  const [prevBio, setPrevBio] = React.useState(bio);
  const [prevTitle, setPrevTitle] = React.useState(userTitle);
  const [prevOrganization, setPrevOrganization] = React.useState(organization);
  const [prevLocationCity, setPrevLocationCity] = React.useState(locationCity);
  const [prevLocationCountry, setPrevLocationCountry] = React.useState(locationCountry);
  const [prevYearsExp, setPrevYearsExp] = React.useState(yearsExp);
  const [prevWebsiteUrl, setPrevWebsiteUrl] = React.useState(websiteUrl);
  const [prevEducation, setPrevEducation] = React.useState(education);
  const [prevSupabaseUser, setPrevSupabaseUser] = React.useState(supabaseUser);

  if (displayName !== prevDisplayName) {
    setPrevDisplayName(displayName);
    setFormData(prev => ({ ...prev, displayName: displayName || '' }));
  }

  if (firebaseUser?.email !== prevEmail) {
    setPrevEmail(firebaseUser?.email);
    setFormData(prev => ({ ...prev, email: firebaseUser?.email || '' }));
  }

  if (authUsername !== prevUsername) {
    setPrevUsername(authUsername);
    setFormData(prev => ({ ...prev, username: authUsername || '' }));
  }

  if (bio !== prevBio) {
    setPrevBio(bio);
    setFormData(prev => ({ ...prev, bio: bio || '' }));
  }

  if (userTitle !== prevTitle) {
    setPrevTitle(userTitle);
    setFormData(prev => ({ ...prev, title: userTitle || '' }));
  }

  if (organization !== prevOrganization) {
    setPrevOrganization(organization);
    setFormData(prev => ({ ...prev, organization: organization || '' }));
  }

  if (locationCity !== prevLocationCity || locationCountry !== prevLocationCountry) {
    setPrevLocationCity(locationCity);
    setPrevLocationCountry(locationCountry);
    setFormData(prev => ({ ...prev, location: `${locationCity || ''}${locationCity && locationCountry ? ', ' : ''}${locationCountry || ''}` }));
  }

  if (yearsExp !== prevYearsExp) {
    setPrevYearsExp(yearsExp);
    setFormData(prev => ({ ...prev, yearsExp: yearsExp || '' }));
  }

  if (websiteUrl !== prevWebsiteUrl) {
    setPrevWebsiteUrl(websiteUrl);
    setFormData(prev => ({ ...prev, websiteUrl: websiteUrl || '' }));
  }

  if (education !== prevEducation) {
    setPrevEducation(education);
    setFormData(prev => ({ ...prev, education: education || '' }));
  }

  if (supabaseUser !== prevSupabaseUser) {
    setPrevSupabaseUser(supabaseUser);
    if (supabaseUser) {
      setToggles({
        show_email: supabaseUser.show_email ?? false,
        allow_messages: supabaseUser.allow_messages ?? true,
        show_activity: supabaseUser.show_activity ?? true,
        show_saves: supabaseUser.show_saves ?? false,
      });
    }
  }

  const handleToggle = async (key) => {
    const newVal = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: newVal }));
    if (firebaseUser?.uid) {
      try {
        const { error } = await updateProfileFields({ [key]: newVal });
        if (error) {
          toast.error(error);
          setToggles(prev => ({ ...prev, [key]: !newVal }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async () => {
    if (!firebaseUser?.uid) return;
    try {
      const locCity = formData.location.split(',')[0]?.trim() || formData.location;
      const locCountry = formData.location.split(',')[1]?.trim() || '';

      const { error } = await updateProfileFields({
        display_name: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        title: formData.title,
        organization: formData.organization,
        location_city: locCity,
        location_country: locCountry,
        years_exp: formData.yearsExp,
        website_url: formData.websiteUrl,
        education: formData.education,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Profile updated.');
    } catch (err) {
      console.error(err);
      toast.error('Error saving profile changes.');
    }
  };

  return (
    <div className="mt-6 max-w-2xl space-y-8">
      <section>
        <h3 className="font-serif text-[18px] text-[#1A1A1A] mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="float-label-container">
              <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
              <label className="float-label bg-white px-1">Full Name</label>
            </div>
            <div className="float-label-container">
              <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
              <label className="float-label bg-white px-1">Username / Handle</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="float-label-container">
              <select value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[10px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A] appearance-none">
                <option value="" disabled hidden></option>
                {['Architect', 'Interior Designer', 'Urban Planner', 'Landscape Architect', 'Structural Engineer', 'Civil Engineer', 'Architecture Student', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <label className={`absolute left-[14px] transition-all ${formData.title ? '-top-2 scale-[0.82] text-[#C8A96A] bg-white px-1' : 'top-[14px] text-[#6B6860] pointer-events-none'}`}>Professional Title</label>
            </div>
            <div className="float-label-container">
              <select value={formData.yearsExp} onChange={e => setFormData({...formData, yearsExp: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[10px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A] appearance-none">
                <option value="" disabled hidden></option>
                {['0–2', '3–5', '6–10', '10+'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <label className={`absolute left-[14px] transition-all ${formData.yearsExp ? '-top-2 scale-[0.82] text-[#C8A96A] bg-white px-1' : 'top-[14px] text-[#6B6860] pointer-events-none'}`}>Years of Experience</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="float-label-container">
              <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
              <label className="float-label bg-white px-1">Current Organization / Studio</label>
            </div>
            <div className="float-label-container">
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
              <label className="float-label bg-white px-1">Country/City</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="float-label-container">
              <input type="text" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
              <label className="float-label bg-white px-1">Education</label>
            </div>
            <div className="float-label-container">
              <input type="url" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="float-input w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A]" placeholder=" " />
              <label className="float-label bg-white px-1">Portfolio / Website URL</label>
            </div>
          </div>

          <div className="float-label-container">
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="float-input w-full h-[100px] py-3 bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A] resize-none" placeholder=" " />
            <label className="float-label bg-white px-1">Bio / About</label>
          </div>

          <div className="float-label-container">
            <input type="email" value={formData.email} disabled className="float-input w-full h-[46px] bg-gray-50 border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A] text-gray-500" placeholder=" " />
            <label className="float-label bg-white px-1">Email Address</label>
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="font-serif text-[18px] text-[#1A1A1A] mb-4">Privacy & Visibility</h3>
        <div className="space-y-4 bg-white p-5 rounded-[10px] border border-[#C8A96A]/15">
          {[
            { key: 'show_email', label: "Show email on profile" },
            { key: 'allow_messages', label: "Allow messages from anyone" },
            { key: 'show_activity', label: "Show activity feed publicly" },
            { key: 'show_saves', label: "Show saved projects publicly" },
          ].map((toggle, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="font-sans text-[14px] text-[#1A1A1A]">{toggle.label}</span>
              <div onClick={() => handleToggle(toggle.key)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${toggles[toggle.key] ? 'bg-[#C8A96A]' : 'bg-[#EDEBE6]'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${toggles[toggle.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4">
        <button onClick={handleSave} className="px-6 py-2 bg-[#C8A96A] text-[#1A1A1A] rounded-md font-sans text-[14px] font-medium hover:bg-[#A8894A] transition-colors">Save Changes</button>
      </div>
    </div>
  );
};

const OverviewTab = ({ isOwnProfile, activityMap = {} }) => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDayOfWeek)); // Saturday of current week
  
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 364 + 1); // 364 days ago

  return (
    <div className="mt-6 space-y-8">
      {/* Contribution Graph */}
      <div className="bg-white border border-[#C8A96A]/20 rounded-[12px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-[16px] text-[#1A1A1A]">ACTIVITY</h3>
          <div className="font-mono text-[12px] text-[#6B6860] flex items-center space-x-2">
            <button className="hover:text-[#C8A96A] p-1"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <span>{today.getFullYear()}</span>
            <button className="hover:text-[#C8A96A] p-1"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-[3px] min-w-[700px]">
            {[...Array(52)].map((_, w) => (
              <div key={w} className="flex flex-col space-y-[3px]">
                {[...Array(7)].map((_, d) => {
                  const cellDate = new Date(startDate);
                  cellDate.setDate(startDate.getDate() + (w * 7 + d));
                  const dateStr = cellDate.toISOString().split('T')[0];
                  const count = activityMap[dateStr] || 0;
                  
                  const levels = ['bg-[#EDEBE6]', 'bg-[#C8A96A]/25', 'bg-[#C8A96A]/55', 'bg-[#C8A96A]/80', 'bg-[#C8A96A]'];
                  const level = count === 0 ? 0 : Math.min(4, count);
                  
                  const formattedDate = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const tooltip = `${count} contribution${count === 1 ? '' : 's'} on ${formattedDate}`;

                  return (
                    <div 
                      key={d} 
                      className={`w-[10px] h-[10px] rounded-[2px] ${levels[level]} hover:ring-1 hover:ring-[#C8A96A] transition-all cursor-pointer`} 
                      title={tooltip}
                    />
                  );
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
          {/* No pinned projects yet */}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PROFILE COMPONENT ---

const Profile = () => {
  const { username, tab } = useParams();
  const navigate = useNavigate();
  const { 
    firebaseUser, supabaseUser, signOut, 
    displayName, username: authUsername, avatarUrl, bannerUrl, userTitle, 
    locationCity, locationCountry, bio, organization, education, 
    websiteUrl, linkedinUrl, isVerified, memberSince, 
    specializations, tools, interests, followerCount, followingCount, repoCount,
    incrementFollowing, decrementFollowing, refreshProfile,
    deleteAccount, reauthenticate, signInGoogle, authProvider
  } = useAuth();
  const { toast } = useToast();
  
  // Logic to determine if it's the own profile
  const isOwnProfile = !username || username === 'me' || username === authUsername;
  
  // Local states
  const [activeTab, setActiveTab] = React.useState(tab || 'overview');
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [reauthPassword, setReauthPassword] = React.useState('');
  const [showReauth, setShowReauth] = React.useState(false);
  const [reauthError, setReauthError] = React.useState(null);

  const [prevTab, setPrevTab] = React.useState(tab);

  if (tab !== prevTab) {
    setPrevTab(tab);
    if (tab) {
      setActiveTab(tab);
    }
  }

  const [profileData, setProfileData] = React.useState(null);
  const [loadingProfile, setLoadingProfile] = React.useState(true);

  // New dynamic states for projects, connections, activities
  const [projects, setProjects] = React.useState([]);
  const [loadingProjects, setLoadingProjects] = React.useState(true);
  const [connections, setConnections] = React.useState([]);
  const [activityMap, setActivityMap] = React.useState({});

  React.useEffect(() => {
    async function fetchUser() {
      if (isOwnProfile) {
        setProfileData({
          id: supabaseUser?.id,
          name: displayName,
          handle: authUsername,
          avatarUrl,
          bannerUrl,
          title: userTitle,
          locationCity,
          locationCountry,
          bio,
          firm: organization,
          education,
          memberSince,
          website: websiteUrl,
          linkedin: linkedinUrl,
          specializations,
          tools,
          stats: { projects: repoCount, followers: followerCount, following: followingCount, upvotes: 0 },
          isVerified,
          showEmail: supabaseUser?.show_email,
        });
        setLoadingProfile(false);
      } else {
        setLoadingProfile(true);
        const { data } = await supabase.from('users').select(`*, user_specializations(tag), user_tools(tool)`).eq('username', username).single();
        if (data) {
           const { data: stats } = await supabase.from('user_stats').select('follower_count, following_count').eq('id', data.id).single();
           setProfileData({
              id: data.id,
              name: data.display_name,
              handle: data.username,
              avatarUrl: data.avatar_url,
              bannerUrl: data.banner_url,
              title: data.title,
              locationCity: data.location_city,
              locationCountry: data.location_country,
              bio: data.bio,
              firm: data.organization,
              education: data.education,
              memberSince: data.member_since,
              website: data.website_url,
              linkedin: data.linkedin_url,
              specializations: data.user_specializations?.map(s => s.tag) || [],
              tools: data.user_tools?.map(t => t.tool) || [],
              stats: { projects: 0, followers: stats?.follower_count || 0, following: stats?.following_count || 0, upvotes: 0 },
              isVerified: data.is_verified,
              showEmail: data.show_email
           });
        } else {
           navigate('/not-found');
        }
        setLoadingProfile(false);
      }
    }
    fetchUser();
  }, [isOwnProfile, username, displayName, authUsername, avatarUrl, bannerUrl, userTitle, locationCity, locationCountry, bio, organization, education, memberSince, websiteUrl, linkedinUrl, specializations, tools, followerCount, followingCount, repoCount, supabaseUser, navigate, isVerified]);

  React.useEffect(() => {
    if (!profileData?.id) return;
    async function loadStatsAndActivities() {
      const { data: connData } = await getConnections(profileData.id);
      if (connData) {
        setConnections(connData);
      }
      
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      const { data: actData } = await supabase
        .from('activities')
        .select('created_at')
        .eq('user_id', profileData.id)
        .gte('created_at', oneYearAgo.toISOString());
      
      if (actData) {
        const map = {};
        actData.forEach(act => {
          const dateStr = new Date(act.created_at).toISOString().split('T')[0];
          map[dateStr] = (map[dateStr] || 0) + 1;
        });
        setActivityMap(map);
      }
    }
    loadStatsAndActivities();
  }, [profileData?.id]);

  React.useEffect(() => {
    if (!profileData?.handle) return;
    async function loadProjects() {
      setLoadingProjects(true);
      let data = [];
      if (isOwnProfile && firebaseUser) {
        const { data: res } = await supabase
          .from('projects')
          .select('*')
          .eq('author_id', profileData.id);
        if (res) data = res;
      } else {
        const { data: res } = await getProfileProjects(profileData.handle);
        if (res) data = res;
      }
      setProjects(data);
      setLoadingProjects(false);
    }
    loadProjects();
  }, [profileData?.handle, isOwnProfile, firebaseUser, profileData?.id]);

  React.useEffect(() => {
    if (!firebaseUser && (username === 'me' || !username)) {
      navigate('/login');
    }
  }, [firebaseUser, username, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    setReauthError(null);
    
    const res = await deleteAccount();
    if (res && res.error) {
      setIsDeleting(false);
      if (res.error === 'REQUIRES_RECENT_LOGIN') {
        setShowReauth(true);
      } else {
        setDeleteError(res.error);
        toast.error(res.error);
      }
    } else {
      setIsDeleting(false);
      toast.success('Account successfully deleted.');
      navigate('/signup');
    }
  };

  const handleReauthenticateAndDelete = async () => {
    setIsDeleting(true);
    setReauthError(null);
    setDeleteError(null);
    
    try {
      if (authProvider === 'email') {
        if (!reauthPassword) {
          setReauthError('Password is required.');
          setIsDeleting(false);
          return;
        }
        const reauthRes = await reauthenticate(reauthPassword);
        if (reauthRes && reauthRes.error) {
          setReauthError(reauthRes.error);
          setIsDeleting(false);
          return;
        }
      } else if (authProvider === 'google') {
        const reauthRes = await signInGoogle();
        if (reauthRes && reauthRes.error) {
          setReauthError(reauthRes.error);
          setIsDeleting(false);
          return;
        }
      }

      // Retry delete
      const res = await deleteAccount();
      if (res && res.error) {
        setDeleteError(res.error);
        toast.error(res.error);
      } else {
        toast.success('Account successfully deleted.');
        setShowDeleteConfirm(false);
        setShowReauth(false);
        navigate('/signup');
      }
    } catch (err) {
      console.error(err);
      setReauthError('An error occurred during reauthentication.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFollowToggle = async () => {
    if (isFollowing) {
      decrementFollowing();
      setIsFollowing(false);
    } else {
      incrementFollowing();
      setIsFollowing(true);
      toast.info(`You are now following @${profileData?.handle}.`);
    }
  };

  if (loadingProfile || !profileData) {
    return <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center font-sans text-[#6B6860]">Loading profile...</div>;
  }

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
      <div className="relative w-full h-[300px] md:h-[420px] bg-[#111111] z-10" data-navbar-theme="dark" style={profileData.bannerUrl ? { backgroundImage: `url(${profileData.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        {!profileData.bannerUrl && (
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='55' height='95.26' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M27.5 0L55 15.87V47.63L27.5 63.5L0 47.63V15.87L27.5 0ZM27.5 95.26L55 79.38V47.63L27.5 63.5L0 79.38V95.26Z' fill='none' stroke='%23C8A96A' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '55px 95.26px'
            }}
          />
        )}
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
                <AvatarDisplay avatarUrl={profileData.avatarUrl} displayName={profileData.name} username={profileData.handle} size={96} />
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
                  {profileData.isVerified && <Check className="w-[16px] h-[16px] ml-3 text-[#C8A96A]" strokeWidth={3} />}
                </h1>
                {isOwnProfile ? (
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab('settings')} className="px-3 py-1 bg-[#111111]/40 backdrop-blur-sm border border-[#C8A96A] text-[#F5F3EF] md:text-[#F5F3EF] rounded-md font-sans text-[12px] hover:bg-[#C8A96A]/20 transition-colors flex items-center">
                      <Edit2 className="w-3 h-3 mr-1.5" /> Edit Profile
                    </button>
                    <button className="px-3 py-1 bg-[#111111]/40 backdrop-blur-sm border border-white/20 text-[#F5F3EF] rounded-md font-sans text-[12px] hover:bg-white/10 transition-colors flex items-center">
                      <Edit2 className="w-3 h-3 mr-1.5" /> Edit Banner
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleFollowToggle}
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
                <span className="font-mono text-[13px] text-[#C8A96A] font-medium">@{profileData.handle}</span>
                {profileData.title && (
                  <span className="font-sans text-[14px] text-[#F5F3EF]/80 flex items-center">
                    {profileData.title}
                  </span>
                )}
                {(profileData.locationCity || profileData.locationCountry) && (
                  <span className="font-sans text-[14px] text-[#F5F3EF]/80 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {profileData.locationCity}{profileData.locationCity && profileData.locationCountry ? ', ' : ''}{profileData.locationCountry}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end mt-4 md:mt-0 gap-3">
            <div className="flex space-x-2">
               {profileData.website && (
                <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[#C8A96A] border border-[#C8A96A]/30 hover:bg-[#C8A96A] hover:text-[#1A1A1A] transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
              {profileData.linkedin && (
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[#C8A96A] border border-[#C8A96A]/30 hover:bg-[#C8A96A] hover:text-[#1A1A1A] transition-colors">
                  <span className="font-bold text-[11px]">in</span>
                </a>
              )}
              {profileData.twitter && (
                <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[#C8A96A] border border-[#C8A96A]/30 hover:bg-[#C8A96A] hover:text-[#1A1A1A] transition-colors">
                  <span className="font-bold text-[11px]">X</span>
                </a>
              )}
               {isOwnProfile && <button className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[#C8A96A] border border-dashed border-[#C8A96A]/50 hover:bg-[#C8A96A]/10 transition-colors"><Plus className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Projects', val: projects.length },
                { label: 'Followers', val: profileData.stats.followers },
                { label: 'Following', val: profileData.stats.following },
                { label: 'Upvotes', val: projects.reduce((sum, p) => sum + (p.upvote_count || p.upvotes_count || 0), 0) },
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
                  {isOwnProfile && (
                    <Edit2 
                      onClick={() => setActiveTab('settings')}
                      className="absolute -right-2 -top-2 w-3.5 h-3.5 text-[#C8A96A] opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" 
                    />
                  )}
                </p>
                <div className="space-y-3 font-sans text-[13px] text-[#1A1A1A]">
                  <div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-[#6B6860] shrink-0" /> {profileData.firm}</div>
                  <div className="flex items-center gap-3"><GraduationCap className="w-4 h-4 text-[#6B6860] shrink-0" /> {profileData.education}</div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-[#6B6860] shrink-0" /> Member since {profileData.memberSince ? (() => { const yr = new Date(profileData.memberSince).getFullYear(); return isNaN(yr) ? profileData.memberSince : yr; })() : 'N/A'}</div>
                  {isOwnProfile && firebaseUser?.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#6B6860] shrink-0" /> {firebaseUser.email}</div>}
                  <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-[#6B6860] shrink-0" /> <a href={profileData.website || "#"} target="_blank" rel="noopener noreferrer" className="text-[#C8A96A] hover:underline">{profileData.website}</a></div>
                </div>

                <div className="mt-6">
                  <h3 className="font-mono text-[10px] text-[#C8A96A] tracking-[0.15em] mb-3">SPECIALIZATIONS</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specializations.map(s => (
                      <span key={s} className="px-2.5 py-1 border border-[#C8A96A]/30 rounded-full font-sans text-[12px] text-[#1A1A1A]">{s}</span>
                    ))}
                    {isOwnProfile && <span onClick={() => setActiveTab('settings')} className="px-2.5 py-1 border border-dashed border-[#C8A96A] rounded-full font-sans text-[12px] text-[#C8A96A] cursor-pointer hover:bg-[#C8A96A]/10">+ Add</span>}
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
                  <span className="font-mono text-[11px] text-[#6B6860]">{connections.length} total</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {connections.slice(0, 6).map((conn) => (
                    <Link 
                      key={conn.id} 
                      to={`/profile/${conn.username}`}
                      title={`@${conn.username}`}
                      className="aspect-square rounded-full overflow-hidden border border-[#C8A96A]/20 cursor-pointer hover:border-[#C8A96A] transition-colors flex items-center justify-center bg-[#EDEBE6]"
                    >
                      <AvatarDisplay avatarUrl={conn.avatar_url} displayName={conn.display_name} username={conn.username} size={48} />
                    </Link>
                  ))}
                  {connections.length === 0 && (
                    <div className="col-span-3 py-4 text-center font-sans text-[12px] text-[#6B6860]">
                      No connections yet
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <div className="mt-4 pt-3 border-t border-[#C8A96A]/10 text-center">
                    <span className="font-sans text-[12px] text-[#6B6860]">0 pending requests</span>
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
                  {activeTab === 'overview' && <OverviewTab isOwnProfile={isOwnProfile} activityMap={activityMap} />}
                  {activeTab === 'repositories' && <RepositoriesTab isOwnProfile={isOwnProfile} projects={projects} loading={loadingProjects} username={profileData?.handle} />}
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
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${showReauth ? 'bg-[#C8A96A]/10' : 'bg-[#cc4444]/10'}`}>
                  {showReauth ? (
                    <Lock className={`w-8 h-8 text-[#C8A96A]`} />
                  ) : (
                    <Trash2 className="w-8 h-8 text-[#cc4444]" />
                  )}
                </div>
                
                <h2 className="font-serif text-[24px] text-[#1A1A1A] mb-3">
                  {showReauth ? 'Verify Identity' : 'Delete Account?'}
                </h2>
                
                <p className="font-sans text-[14px] text-[#6B6860] mb-6 leading-relaxed">
                  {showReauth 
                    ? 'For security reasons, please reauthenticate to confirm ownership before permanent account deletion.' 
                    : 'This action is permanent and cannot be undone. All your repositories, designs, and contributions will be lost forever.'}
                </p>

                {deleteError && (
                  <div className="w-full text-left bg-[#cc4444]/10 border border-[#cc4444]/20 rounded-md p-3 mb-4 text-[#cc4444] font-sans text-[12px]">
                    {deleteError}
                  </div>
                )}

                {showReauth && authProvider === 'email' && (
                  <div className="w-full text-left mb-6">
                    <label className="block text-sans text-[12px] font-medium text-[#6B6860] mb-1.5">Confirm Password</label>
                    <input 
                      type="password" 
                      value={reauthPassword}
                      onChange={e => setReauthPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-[46px] bg-white border border-[#C8A96A]/20 rounded-[8px] px-[14px] font-sans text-[14px] focus:outline-none focus:border-[#C8A96A] text-[#1A1A1A]"
                      disabled={isDeleting}
                    />
                    {reauthError && (
                      <p className="text-[#cc4444] text-[12px] font-sans mt-2">{reauthError}</p>
                    )}
                  </div>
                )}

                {showReauth && authProvider === 'google' && reauthError && (
                  <div className="w-full text-left bg-[#cc4444]/10 border border-[#cc4444]/20 rounded-md p-3 mb-4 text-[#cc4444] font-sans text-[12px]">
                    {reauthError}
                  </div>
                )}

                <div className="flex flex-col w-full gap-3">
                  {showReauth ? (
                    <>
                      {authProvider === 'email' ? (
                        <button 
                          onClick={handleReauthenticateAndDelete}
                          disabled={isDeleting}
                          className="w-full py-3 bg-[#cc4444] text-white rounded-md font-serif font-medium text-[16px] hover:bg-[#aa2222] transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? 'Deleting...' : 'Verify & Delete Account'}
                        </button>
                      ) : (
                        <button 
                          onClick={handleReauthenticateAndDelete}
                          disabled={isDeleting}
                          className="w-full py-3 bg-[#C8A96A] text-[#1A1A1A] rounded-md font-sans font-medium text-[16px] hover:bg-[#A8894A] transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? 'Deleting...' : 'Reauthenticate with Google'}
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setShowReauth(false);
                          setReauthPassword('');
                          setReauthError(null);
                          setDeleteError(null);
                        }}
                        disabled={isDeleting}
                        className="w-full py-3 border border-[#C8A96A]/20 text-[#1A1A1A] rounded-md font-sans text-[15px] hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="w-full py-3 bg-[#cc4444] text-white rounded-md font-serif font-medium text-[16px] hover:bg-[#aa2222] transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                        className="w-full py-3 border border-[#C8A96A]/20 text-[#1A1A1A] rounded-md font-sans text-[15px] hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                      >
                        Keep My Account
                      </button>
                    </>
                  )}
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
