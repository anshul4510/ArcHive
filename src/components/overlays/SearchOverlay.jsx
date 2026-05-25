import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUi } from '../../context/UiContext';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_RESULTS = {
  projects: [
    { id: '1', title: 'The Glass Pavilion', type: 'PROJECT' },
    { id: '2', title: 'Brutalist Concrete Villa', type: 'PROJECT' }
  ],
  'case studies': [
    { id: 'sustainable-high-rise', title: 'Sustainable High-Rise Cooling', type: 'CASE STUDY' }
  ],
  journals: [
    { id: 'future-of-parametric', title: 'The Future of Parametric Design', type: 'JOURNAL' }
  ]
};

const TRENDING = ['parametric', 'sustainable', 'villa', 'mumbai', 'concrete', 'adaptive reuse'];

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [prevIsSearchOpen, setPrevIsSearchOpen] = useState(isSearchOpen);

  if (isSearchOpen !== prevIsSearchOpen) {
    setPrevIsSearchOpen(isSearchOpen);
    if (isSearchOpen) {
      const stored = localStorage.getItem('archive_recent_searches');
      if (stored) setRecent(JSON.parse(stored));
    } else {
      setQuery('');
      setResults(null);
    }
  }

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (isSearchOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSearchOpen, closeSearch]);

  // Global shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleGlobalShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // The shortcut toggling logic can also be in UiContext or App level
        // Assuming we are just letting UiContext handle the open state somewhere else,
        // or we handle it here if we inject SearchOverlay always at root.
      }
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    return () => window.removeEventListener('keydown', handleGlobalShortcut);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults(null);
        return;
      }
      
      const q = query.toLowerCase();
      const filtered = {};
      Object.keys(MOCK_RESULTS).forEach(section => {
        const matches = MOCK_RESULTS[section].filter(item => item.title.toLowerCase().includes(q));
        if (matches.length > 0) filtered[section] = matches;
      });
      setResults(Object.keys(filtered).length > 0 ? filtered : {});
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    const newRecent = [item.title, ...recent.filter(r => r !== item.title)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('archive_recent_searches', JSON.stringify(newRecent));
    
    closeSearch();
    if (item.type === 'PROJECT') navigate(`/projects/${item.id}`);
    if (item.type === 'CASE STUDY') navigate(`/repository/case-studies/${item.id}`);
    if (item.type === 'JOURNAL') navigate(`/repository/journals/${item.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const newRecent = [query, ...recent.filter(r => r !== query)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('archive_recent_searches', JSON.stringify(newRecent));
    closeSearch();
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-24 px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0E0E0C]/90 backdrop-blur-xl"
            onClick={closeSearch}
          />
          
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-[640px] bg-bg-dark border border-accent-gold/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-border-light p-4">
              <Search className="w-6 h-6 text-accent-gold mr-4 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, case studies, users..."
                className="flex-1 bg-transparent border-none text-[20px] text-white placeholder-text-muted focus:outline-none focus:ring-0"
              />
              <button type="button" onClick={closeSearch} className="ml-4 p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto">
              {results === null ? (
                <div className="p-6">
                  {recent.length > 0 && (
                    <div className="mb-8">
                      <h3 className="flex items-center gap-2 font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-4">
                        <Clock className="w-3 h-3" /> Recent Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r, i) => (
                          <button key={i} onClick={() => setQuery(r)} className="px-3 py-1.5 rounded-full border border-border-light text-text-muted hover:text-accent-gold hover:border-accent-gold transition-colors text-[13px] font-sans">
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="flex items-center gap-2 font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-4">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((t, i) => (
                        <button key={i} onClick={() => setQuery(t)} className="px-3 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-bg-dark transition-colors text-[13px] font-sans">
                          #{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : Object.keys(results).length === 0 ? (
                <div className="p-12 text-center text-text-muted font-sans text-[15px]">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {Object.keys(results).map(section => (
                    <div key={section}>
                      <h3 className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-3 px-2">
                        {section}
                      </h3>
                      <div className="space-y-1">
                        {results[section].map((item, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between group transition-colors focus:outline-none focus:bg-white/5"
                          >
                            <span className="font-sans text-[15px] text-white group-hover:text-accent-gold transition-colors">
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-text-muted mt-1 sm:mt-0">
                              {item.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white/5 p-3 text-center border-t border-border-light font-mono text-[10px] text-text-muted">
              Use <kbd className="px-1.5 py-0.5 rounded border border-border-light bg-bg-dark">↑</kbd> <kbd className="px-1.5 py-0.5 rounded border border-border-light bg-bg-dark">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 rounded border border-border-light bg-bg-dark">Enter</kbd> to select
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
