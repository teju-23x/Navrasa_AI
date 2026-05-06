import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Tv, 
  Zap,
  Sun, 
  Moon,
  Library,
  Camera, 
  Film as FilmIcon, 
  Clapperboard, 
  Ticket, 
  Star, 
  Monitor, 
  Trophy,
  Armchair,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { Link, useLocation } from 'react-router-dom';

const CINEMA_ICONS = [
  <Camera size={20} />,
  <FilmIcon size={20} />,
  <Clapperboard size={20} />,
  <Ticket size={20} />,
  <Star size={20} />,
  <Monitor size={20} />,
  <Trophy size={20} />,
  <Armchair size={20} />,
];

const ABSTRACT_GRADIENTS = [
  'from-accent-red to-accent-purple',
  'from-accent-purple to-red-500',
  'from-red-500 to-green-500',
  'from-green-500 to-yellow-500',
  'from-yellow-500 to-accent-red',
  'from-pink-500 to-accent-red',
  'from-indigo-500 to-purple-500',
  'from-orange-500 to-yellow-500',
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [activeLibraryTab, setActiveLibraryTab] = useState<'history' | 'watchlist'>('history');
  const [activeTypeTab, setActiveTypeTab] = useState<'movie' | 'series'>('movie');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') !== 'light';
    } catch (error) {
      console.error('Failed to read theme from localStorage', error);
      return true;
    }
  });
  
  const { 
    watchedMovies, 
    watchedSeries, 
    watchlistMovies, 
    watchlistSeries,
    userProfile,
    removeLibraryItem,
    clearLibrary,
    wishlistMovies,
    wishlistSeries,
    wishlistAnime
  } = useNavrasa();
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const wishlistTotal = wishlistMovies.length + wishlistSeries.length + wishlistAnime.length;
  const navItems = [
    { icon: <Film size={20} />, label: 'Movies', path: '/' },
    { icon: <Tv size={20} />, label: 'TV Series', path: '/series' },
    { icon: <Zap size={18} />, label: 'Anime', path: '/anime' },
    { icon: <Library size={20} />, label: `Wishlist (${wishlistTotal})`, path: '/wishlist' },
    { icon: <Library size={20} />, label: 'Import Cinema', path: '/library' },
  ];

  const getLibraryItems = () => {
    if (activeLibraryTab === 'history') {
      return activeTypeTab === 'movie' ? watchedMovies : watchedSeries;
    }
    return activeTypeTab === 'movie' ? wishlistMovies : wishlistSeries;
  };

  const currentItems = getLibraryItems();
  const activeCategory = activeLibraryTab === 'history' ? 'watched' : 'watchlist';

  return (
    <aside
      className={clsx(
        "w-[240px] fixed h-screen border-r border-border bg-bg-surface z-40 md:z-20 flex flex-col transition-all duration-300",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute top-3 right-3 md:hidden h-8 w-8 rounded-full glass flex items-center justify-center text-text-primary hover:text-accent-red transition-colors"
      >
        <X size={16} />
      </button>
      {/* Top Logo */}
      <Link to="/" onClick={onClose} className="p-6 border-b border-border block hover:bg-bg-card transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-accent-red text-xl">✦</span>
          <span className="font-bold text-lg text-text-primary">Navrasa <span className="text-accent-red">AI</span></span>
        </div>
        <div className="text-[11px] text-text-muted uppercase tracking-[0.2em] mt-1 font-medium">AI Cinema Guide</div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 py-8 space-y-1 custom-scrollbar flex flex-col">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/' && location.pathname === '') ||
            (item.path === '/series' && location.pathname.startsWith('/series')) ||
            (item.path === '/anime' && location.pathname.startsWith('/anime'));
          return (
            <Link 
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={clsx(
                "w-full h-12 px-5 flex items-center gap-[14px] rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-accent-red/10 border-l-[3px] border-accent-red text-text-primary" 
                  : "text-text-muted hover:bg-bg-card hover:text-text-primary hover:translate-x-1"
              )}
            >
              <span className={clsx("transition-colors", isActive ? "text-accent-red" : "text-text-muted group-hover:text-text-primary")}>
                {item.icon}
              </span>
              <span className={clsx("text-sm transition-all", isActive ? "font-bold" : "font-medium")}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* My Library Section */}
        <div className="mt-8 pt-8 border-t border-border flex-1 flex flex-col">
          <label className="px-5 text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
            <Library size={12} />
            My Library
          </label>
          
          {/* Main Library Tabs */}
          <div className="px-5 mb-4">
             <div className="flex gap-4 text-[13px] border-b border-border">
                {(['history', 'watchlist'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveLibraryTab(tab)}
                    className={clsx(
                      "pb-2 transition-all relative font-medium capitalize", 
                      activeLibraryTab === tab ? "text-text-primary" : "text-text-muted"
                    )}
                  >
                    {tab}
                    {activeLibraryTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-red" />}
                  </button>
                ))}
             </div>
          </div>

          {/* Type Sub-tabs */}
          <div className="px-5 mb-4 flex gap-2">
             {(['movie', 'series'] as const).map(type => (
               <button
                key={type}
                onClick={() => setActiveTypeTab(type)}
                className={clsx(
                  "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all",
                  activeTypeTab === type 
                    ? "bg-bg-card text-accent-red border border-accent-red/20" 
                    : "text-text-hint hover:text-text-primary border border-transparent"
                )}
               >
                 {type}s
               </button>
             ))}
          </div>

          {/* Library List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar min-h-[200px]">
            <div className="flex items-center justify-between px-3 py-2">
              <button className="text-[10px] text-text-hint hover:text-text-primary uppercase tracking-wider" onClick={() => clearLibrary(activeTypeTab, activeCategory)}>Clear All</button>
            </div>
            {currentItems.length > 0 ? (
              currentItems.map((item, i) => (
                <div 
                  key={`${item.title}-${i}`}
                  className="group px-3 py-2.5 rounded-xl hover:bg-bg-card transition-all flex items-center justify-between cursor-default"
                >
                  <div className="overflow-hidden">
                    <div className="text-[13px] font-bold text-text-primary truncate">{item.title}</div>
                    <div className="text-[10px] text-text-hint font-medium">{item.year}</div>
                  </div>
                  <button onClick={() => removeLibraryItem(activeTypeTab, activeCategory, item.title)} className="text-text-hint opacity-0 group-hover:opacity-100 transition-all">✕</button>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <div className="text-[11px] text-text-hint italic font-medium">No items found</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Sidebar */}
      <div className="p-6 border-t border-border bg-bg-surface">
        <div className="flex items-center justify-between mb-6">
           <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full h-10 glass rounded-full relative flex items-center px-1 group overflow-hidden"
           >
              <div 
                className={clsx(
                  "absolute h-8 w-8 rounded-full transition-all duration-500 flex items-center justify-center z-10",
                  isDarkMode ? "bg-accent-red left-1 shadow-[0_0_12px_rgba(229,9,20,0.4)]" : "bg-accent-gold right-1 shadow-[0_0_12px_rgba(245,197,24,0.4)]"
                )}
              >
                {isDarkMode ? <Moon size={14} className="text-white" /> : <Sun size={14} className="text-stone-900" />}
              </div>
              <div className="flex justify-between w-full px-3 text-[10px] font-bold text-text-hint uppercase tracking-tighter">
                <span className={clsx("transition-opacity", isDarkMode ? "opacity-100" : "opacity-0")}>Dark</span>
                <span className={clsx("transition-opacity", !isDarkMode ? "opacity-100" : "opacity-0")}>Light</span>
              </div>
           </button>
        </div>
        
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 cursor-pointer group hover:bg-bg-card/50 p-2 -m-2 rounded-xl transition-all"
        >
          <div className="w-10 h-10 rounded-full border-2 border-accent-red bg-bg-card p-0.5 shadow-lg overflow-hidden flex items-center justify-center">
             {userProfile.avatarType === 'abstract' ? (
                <div className={clsx("w-full h-full rounded-full bg-gradient-to-br", ABSTRACT_GRADIENTS[userProfile.avatarIndex])} />
             ) : (
                <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center text-accent-red">
                  {CINEMA_ICONS[userProfile.avatarIndex]}
                </div>
             )}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-text-primary leading-tight truncate group-hover:text-accent-red transition-colors">{userProfile.name}</div>
            <div className="text-[11px] text-text-muted font-medium">Cinephile</div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
