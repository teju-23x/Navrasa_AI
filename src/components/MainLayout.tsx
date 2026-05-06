import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PreferencePanel from './PreferencePanel';
import { useNavrasa } from '../context/NavrasaContext';
import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, error } = useNavrasa();
  const location = useLocation();

  // Hide player on detail pages
  const isDetailPage = location.pathname.startsWith('/series/') || location.pathname.startsWith('/movie/');
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-accent-red selection:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen relative">
        <TopBar onOpenPrefs={() => setIsPrefsOpen(true)} onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 pb-10">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Outlet key={location.pathname} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Preference Panel */}
        <PreferencePanel isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />

        {/* Full Screen Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg-primary/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center"
            >
               <div className="relative flex items-center justify-center mb-8">
                  <div 
                    className="absolute w-[280px] h-[280px] rounded-full border-[2px] border-transparent border-t-[#E50914] border-r-[#E50914]/20 animate-spin" 
                    style={{ animationDuration: '1.2s' }}
                  />
                  <div className="flex items-center gap-3 text-4xl font-black relative z-10">
                    <span className="text-[#E50914]">✦</span>
                    <span className="text-text-primary tracking-wide">Navrasa</span>
                    <span className="text-[#E50914]">AI</span>
                  </div>
               </div>
               <p className="text-text-muted text-xl italic font-serif tracking-wide text-center mt-6">
                 Analyzing your taste profile...
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Toast */}
        <AnimatePresence>
           {error && <ErrorToast message={error} />}
        </AnimatePresence>
      </div>
      {isSidebarOpen && (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};



const ErrorToast: React.FC<{ message: string }> = ({ message }) => {
   const { setError } = useNavrasa();
   return (
    <motion.div 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      className="fixed top-4 right-3 md:top-8 md:right-8 w-[calc(100%-1.5rem)] md:w-[400px] bg-bg-surface border border-accent-red/20 border-l-[6px] border-l-accent-red rounded-2xl p-5 md:p-6 pr-12 md:pr-14 shadow-[0_24px_48px_rgba(0,0,0,0.12)] z-[110]"
    >
       <div className="flex flex-col gap-1">
          <div className="text-accent-red text-xs font-black uppercase tracking-widest">System Error</div>
          <div className="text-text-primary text-[15px] font-bold leading-relaxed">{message}</div>
       </div>
       <button onClick={() => setError(null)} className="absolute top-6 right-6 text-text-hint hover:text-text-primary transition-colors text-xl font-light">✕</button>
    </motion.div>
   );
}
export default MainLayout;
