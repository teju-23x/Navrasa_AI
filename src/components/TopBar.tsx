import React from 'react';
import { Settings2, Camera, Film, Clapperboard, Ticket, Star, Monitor, Trophy, Library, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';

const CINEMA_ICONS = [
  <Camera size={18} />,
  <Film size={18} />,
  <Clapperboard size={18} />,
  <Ticket size={18} />,
  <Star size={18} />,
  <Monitor size={18} />,
  <Trophy size={18} />,
  <Library size={18} />,
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

interface TopBarProps {
  onOpenPrefs: () => void;
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenPrefs, onToggleSidebar }) => {
  const { userProfile } = useNavrasa();
  const navigate = useNavigate();

  return (
    <header className="h-[64px] md:h-[68px] sticky top-0 bg-bg-primary/80 backdrop-blur-3xl border-b border-border z-30 flex items-center px-3 md:px-10 transition-[height] duration-300">
      <button
        onClick={onToggleSidebar}
        className="md:hidden mr-2 h-10 w-10 glass rounded-full flex items-center justify-center text-text-primary hover:text-accent-red transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>
      <div className="flex-1 flex justify-center">
        {/* Search is handled in Hero per page */}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => navigate('/library')}
          className="h-10 px-3 md:px-6 glass rounded-full flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-text-primary hover:border-accent-red hover:text-accent-red transition-all group"
        >
          <span className="hidden sm:inline">Library</span>
          <span className="sm:hidden">Lib</span>
        </button>

        <button
          onClick={onOpenPrefs}
          className="h-10 px-3 md:px-6 glass rounded-full flex items-center gap-1.5 md:gap-2 text-[12px] md:text-[13px] font-bold text-text-primary hover:border-accent-red hover:text-accent-red transition-all"
        >
          <Settings2 size={16} />
          <span className="hidden sm:inline">Preferences</span>
        </button>

        <div
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full border-2 border-accent-red bg-bg-card p-0.5 shadow-lg cursor-pointer hover:scale-105 transition-transform overflow-hidden relative group flex items-center justify-center"
        >
          {userProfile.avatarType === 'abstract' ? (
            <div className={clsx("w-full h-full rounded-full bg-gradient-to-br", ABSTRACT_GRADIENTS[userProfile.avatarIndex % ABSTRACT_GRADIENTS.length] || ABSTRACT_GRADIENTS[0])} />
          ) : (
            <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center text-accent-red">
              {CINEMA_ICONS[userProfile.avatarIndex % CINEMA_ICONS.length] || CINEMA_ICONS[0]}
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
