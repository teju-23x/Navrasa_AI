import React from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const saveSession = (name: string) => {
    try {
      localStorage.setItem('navrasa_session', JSON.stringify({ name, timestamp: Date.now() }));
    } catch (error) {
      console.error('Failed to persist session', error);
    }
  };

  const gradients = [
    'linear-gradient(135deg, #E50914, #7C3AED)',
    'linear-gradient(135deg, #1DB954, #0D0D1A)',
    'linear-gradient(135deg, #F5C518, #E50914)',
    'linear-gradient(135deg, #7C3AED, #1DB954)',
  ];

  const columnSpeeds = ['18s', '24s', '20s', '28s', '22s', '16s'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const displayName = String(formData.get('email') || '').trim();
    const userName = displayName || 'Guest Viewer';
    saveSession(userName);
    localStorage.setItem('user_name', userName);
    navigate('/');
  };

  const handleGuestLogin = () => {
    saveSession('Guest Viewer');
    localStorage.setItem('user_name', 'Guest Viewer');
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-primary font-sans transition-colors duration-500">
      {/* Background Poster Mosaic */}
      <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-20">
        {columnSpeeds.map((speed, colIdx) => (
          <div 
            key={colIdx} 
            className="flex flex-col gap-4 animate-scroll-up"
            style={{ 
              animationDuration: speed,
              marginTop: colIdx % 2 === 0 ? '-100px' : '0px'
            }}
          >
            {[...Array(20)].map((_, rowIdx) => (
              <div 
                key={rowIdx}
                className="w-full aspect-[2/3] rounded-xl"
                style={{ background: gradients[(colIdx + rowIdx) % gradients.length] }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Overlay & Vignette */}
      <div className="absolute inset-0 bg-bg-primary/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,var(--app-bg-primary)_100%)] opacity-90 pointer-events-none" />

      {/* Center Glass Card */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[460px] bg-bg-surface/90 backdrop-blur-[32px] border border-border rounded-[32px] p-[60px_52px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative z-10"
        >
          {/* Logo Row */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 text-3xl font-black">
              <span className="text-accent-red">✦</span>
              <span className="text-text-primary">Navrasa</span>
              <span className="text-accent-red">AI</span>
            </div>
            <div className="text-[13px] text-text-muted mt-2 uppercase tracking-[0.3em] font-bold">Cinema Guide</div>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-4xl font-serif font-bold text-text-primary mb-3">Welcome Back</h2>
            <p className="text-[15px] text-text-muted font-medium italic">Discover your next favorite match</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
               <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-hint group-focus-within:text-accent-red transition-colors" />
               <input 
                type="text" 
                name="email"
                placeholder="Display Name"
                required
                className="w-full h-15 bg-bg-card border border-border rounded-2xl pl-16 pr-6 text-[15px] text-text-primary focus:border-accent-red focus:bg-white/5 transition-all outline-none placeholder:text-text-hint font-medium"
              />
            </div>

             <button 
               type="submit"
               className="w-full h-16 mt-4 bg-accent-red rounded-2xl text-[15px] font-black text-white tracking-[2px] shadow-xl hover:scale-[1.02] active:scale-98 transition-all glass hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]"
             >
               ENTER NAVRASA
             </button>
             
             <div className="mt-4 text-center">
               <button 
                 type="button"
                 onClick={handleGuestLogin}
                 className="text-[13px] text-text-muted hover:text-accent-red font-bold transition-all outline-none uppercase tracking-wide"
               >
                 Continue as Guest →
               </button>
             </div>
           </form>

          <div className="relative mt-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <span className="relative px-5 bg-bg-surface text-[11px] text-text-hint uppercase tracking-widest font-black italic">Alpha Mode Active</span>
          </div>

        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollUp {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .animate-scroll-up {
          animation: scrollUp linear infinite;
        }
      `}} />
    </div>
  );
};

export default Login;
