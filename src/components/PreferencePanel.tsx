import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';

interface PreferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencePanel: React.FC<PreferencePanelProps> = ({ isOpen, onClose }) => {
  const { preferences, setPreferences, generateRecs } = useNavrasa();

  const sections = [
    { 
      id: 'languages', 
      label: 'Languages', 
      items: ['English', 'Tamil', 'Korean', 'Japanese', 'Spanish', 'French', 'Malayalam', 'Hindi', 'Telugu', 'Chinese'],
      color: 'text-accent-red' 
    },
    { 
      id: 'industries', 
      label: 'Industries', 
      items: ['Hollywood', 'Kollywood', 'Mollywood', 'Bollywood', 'Anime', 'K-Drama', 'European Cinema', 'Tollywood'],
      color: 'text-accent-purple' 
    },
    { 
      id: 'genres', 
      label: 'Genres', 
      items: ['Drama', 'Sci-Fi', 'Horror', 'Comedy', 'Documentary', 'Action', 'Thriller', 'Romance', 'Animation', 'Mystery'],
      color: 'text-white/60' 
    },
    { 
      id: 'moods', 
      label: 'Moods', 
      items: ['Epic', 'Intimate', 'Melancholic', 'Uplifting', 'Dark', 'Nostalgic', 'Experimental', 'Cinematic', 'Energetic', 'Relaxing'],
      color: 'text-accent-gold' 
    },
  ];

  const toggleItem = (sectionId: keyof typeof preferences, item: string) => {
    const current = preferences[sectionId] as string[];
    const next = current.includes(item) 
      ? current.filter(i => i !== item) 
      : [...current, item];
    
    setPreferences({ ...preferences, [sectionId]: next });
  };

  const handleApply = () => {
    onClose();
    generateRecs();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[420px] h-screen bg-bg-surface backdrop-blur-[24px] border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-[68px] flex items-center justify-between px-8 border-b border-border">
               <h2 className="text-xl font-serif font-bold text-text-primary italic">User Preferences</h2>
               <button onClick={onClose} className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-text-muted hover:bg-bg-card hover:text-text-primary transition-all">
                  <X size={20} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar focus:outline-none">
               {/* Content Type */}
               <section>
                  <label className="text-[11px] uppercase text-accent-red tracking-[3px] font-black mb-4 block">Content Type</label>
                  <div className="grid grid-cols-2 gap-3">
                     {['movies', 'both'].map(type => (
                        <button 
                          key={type}
                          onClick={() => setPreferences({ ...preferences, contentType: type as any })}
                          className={clsx(
                            "h-12 rounded-2xl flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-all duration-500 border",
                            preferences.contentType === type 
                              ? "bg-gradient-to-r from-accent-red to-accent-purple border-transparent text-white shadow-lg shadow-accent-red/20" 
                              : "bg-bg-card border-border text-text-muted hover:border-text-hint hover:bg-bg-glass"
                          )}
                        >
                           {type}
                        </button>
                     ))}
                  </div>
               </section>

               {/* Multi-select Sections */}
               {sections.map(section => (
                 <section key={section.id}>
                    <label className={clsx("text-[11px] uppercase tracking-[3px] font-black mb-4 block opacity-80", section.color)}>
                       {section.label}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                       {section.items.map(item => {
                         const isSelected = (preferences[section.id as keyof typeof preferences] as string[]).includes(item);
                         return (
                           <button 
                            key={item}
                            onClick={() => toggleItem(section.id as keyof typeof preferences, item)}
                            className={clsx(
                              "h-[38px] px-5 rounded-full text-[13px] font-bold transition-all duration-300 border flex items-center gap-2",
                              isSelected 
                                ? "bg-accent-red/10 border-accent-red/40 text-accent-red shadow-[0_4px_12px_rgba(229,9,20,0.1)]" 
                                : "bg-bg-card border-border text-text-muted hover:bg-bg-glass hover:border-text-hint hover:-translate-y-[1px]"
                            )}
                           >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                              {item}
                           </button>
                         );
                       })}
                    </div>
                 </section>
               ))}
            </div>

            {/* Footer / Apply Button */}
            <div className="p-8 bg-bg-surface border-t border-border">
               <button 
                onClick={handleApply}
                className="w-full h-15 bg-gradient-to-r from-accent-red to-accent-purple rounded-2xl text-[14px] font-black text-white uppercase tracking-[3px] shadow-2xl hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all outline-none"
               >
                  APPLY CHANGES
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PreferencePanel;
