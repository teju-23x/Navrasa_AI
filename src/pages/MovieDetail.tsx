import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  Play, 
  Clock, 
  Globe, 
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';
import { Recommendation, StreamingPlatform } from '../types';

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recommendations, watchedMovies, loading: contextLoading, wishlistMovies, toggleWishlist } = useNavrasa();
  const [scrollY, setScrollY] = useState(0);

  // Find the movie in recommendations or history
  const allMovies = [
    ...(recommendations || []), 
    ...(watchedMovies || []).map(m => ({
      id: m.title.toLowerCase().replace(/\s+/g, '-'),
      title: m.title,
      year: m.year?.toString() || 'N/A',
      rating: m.rating || 0,
      poster: m.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
      genres: [],
      overview: "Movie details are synchronized from your collection.",
      match_reason: "This is part of your curated history.",
      streaming: [],
      has_trailer: false,
      type: 'movie' as const
    }))
  ];

  const movie = allMovies.find(m => m.id === id) as Recommendation | undefined;
  const inWishlist = (wishlistMovies || []).some((entry) => entry.title === movie?.title);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-20">
         <div className="w-16 h-16 border-4 border-accent-red/20 border-t-accent-red rounded-full animate-spin mb-8" />
         <p className="text-text-muted font-serif italic text-xl">Synchronizing cinematic data...</p>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-20 text-center">
       <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center mb-6 text-accent-red">
          <Star size={36} />
       </div>
       <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">Movie Not Found</h2>
       <p className="text-text-muted mb-8 italic">We couldn't locate the data for this cinematic selection.</p>
       <button 
        onClick={() => navigate(-1)}
        className="h-12 px-8 bg-accent-red text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
       >
         Back to Results
       </button>
    </div>
  );

  const displayRating = (rating: number | undefined) => {
    if (rating === undefined || rating === 0) return "N/A";
    return rating.toFixed(1);
  };

  // Only show streaming if it exists and has TMDB logos
  const validStreaming = (movie?.streaming || []).filter((s): s is StreamingPlatform => 
    typeof s !== 'string' && !!s?.logo && s?.logo?.startsWith('https://image.tmdb.org')
  );

  return (
    <div className="relative animate-fade-in bg-bg-primary min-h-screen transition-colors duration-300">
      {/* Hero Banner Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Backdrop Image with Parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <img 
            src={movie?.poster} 
            alt={movie?.title} 
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 20%' }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/50 via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-10 h-12 px-6 glass rounded-full flex items-center gap-3 text-text-primary font-bold hover:border-accent-red transition-all z-20"
        >
          <ArrowLeft size={18} />
          Back to Explorations
        </button>

        {/* Hero Bottom Content */}
        <div className="absolute bottom-12 left-10 max-w-[900px] z-10 px-6">
          <div className="flex flex-wrap gap-2.5 mb-8">
             {movie?.genres?.map(g => (
               <span key={g} className="bg-accent-red/20 border border-accent-red/40 text-accent-red text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">{g}</span>
             ))}
             <span className="glass px-4 py-1.5 rounded-xl text-xs font-black text-text-muted border border-border uppercase tracking-widest">{movie?.year || 'N/A'}</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[80px] font-serif font-bold text-text-primary leading-[1] drop-shadow-2xl mb-6 italic"
          >
            {movie?.title}
          </motion.h1>

          <div className="flex items-center gap-6 text-[17px] font-bold text-text-muted">
             <span className="flex items-center gap-2 text-accent-gold px-3 py-1 bg-accent-gold/10 rounded-lg border border-accent-gold/20">
               <Star size={20} fill="currentColor" /> {displayRating(movie?.rating)}
             </span>
             <span className="text-text-hint">•</span>
             <span className="text-text-primary/80">{movie?.year || 'N/A'}</span>
             <span className="text-text-hint">•</span>
             <span className="text-text-primary/80">Premium Quality</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-12 px-10 py-16">
        
        {/* Left Column (65%) */}
        <div className="col-span-12 lg:col-span-7 space-y-12">
          
          {/* Why Recommended Card */}
          {movie?.match_reason && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-bg-card border border-accent-red/20 rounded-[32px] p-12 overflow-hidden shadow-xl"
            >
               <div className="absolute top-[-20px] left-[-20px] text-[160px] font-serif italic text-accent-red/5 pointer-events-none group-hover:text-accent-red/10 transition-colors">"</div>
               
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center">
                    <Star size={20} className="text-accent-red" />
                  </div>
                  <span className="text-lg font-black text-accent-red uppercase tracking-widest">The Navrasa AI Analysis</span>
               </div>

               <p className="text-[26px] font-serif italic text-text-primary leading-[1.6] px-2 relative z-10 font-medium">
                  "{movie.match_reason}"
               </p>
            </motion.div>
          )}

          {/* Cast Section */}
          {movie?.cast && movie.cast.length > 0 && (
            <section className="bg-bg-surface border border-border rounded-[32px] p-10 shadow-sm">
               <div className="flex items-center gap-3 mb-8 text-text-primary text-xl font-bold">
                  <span className="w-8 h-8 rounded-full bg-accent-red/10 flex items-center justify-center text-accent-red text-sm font-black">
                    ★
                  </span>
                  THE CAST
               </div>
               
               <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4 scroll-smooth">
                 {movie.cast.map((actor, idx) => (
                   <button key={idx} onClick={() => navigate(`/person/${encodeURIComponent(actor.name)}?context=movie`)} className="glass text-left flex-shrink-0 w-[120px] overflow-hidden group">
                     <div className="w-full aspect-[2/3] bg-bg-card border-b border-border overflow-hidden flex items-center justify-center">
                       {actor.photo ? (
                         <img src={actor.photo} alt={actor.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#0D1F35] flex items-center justify-center text-text-primary font-black text-xl">
                           {actor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                         </div>
                       )}
                     </div>
                     <div className="p-2">
                       <div className="text-[12px] font-bold text-white leading-tight truncate">{actor.name}</div>
                       <div className="text-[11px] text-text-muted mt-1 truncate">{actor.character}</div>
                     </div>
                   </button>
                 ))}
               </div>
            </section>
          )}

          {/* About This Movie */}
          {movie?.overview && (
            <section className="bg-bg-surface border border-border rounded-[32px] p-10 shadow-sm">
               <div className="flex items-center gap-3 mb-8 text-text-primary text-xl font-bold">
                  <Layers size={22} className="text-accent-red" />
                  Narrative Overview
               </div>
               <p className="text-[17px] text-text-muted leading-[1.8] font-medium italic">
                  {movie.overview}
               </p>
            </section>
          )}

          {/* Trailer Section */}
          {movie?.has_trailer && movie?.trailer_url && (
            <section className="space-y-8">
               <div className="flex items-center gap-3 text-text-primary text-xl font-bold">
                  <Play size={22} className="text-accent-red" />
                  Cinematic Trailer
               </div>
               
               <div className="relative aspect-video rounded-[32px] overflow-hidden group cursor-pointer shadow-2xl border border-border">
                  <img src={movie?.poster} alt="" className="w-full h-full object-cover blur-[8px] opacity-40 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-bg-primary/20 group-hover:bg-bg-primary/10 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                     <div 
                       onClick={() => movie.trailer_url && window.open(movie.trailer_url, '_blank')}
                       className="w-20 h-20 rounded-full bg-accent-red flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group-hover:shadow-accent-red/40"
                     >
                        <Play size={32} fill="white" className="ml-1.5" />
                     </div>
                     <span className="text-[14px] font-black text-text-primary tracking-[0.3em] uppercase drop-shadow-md">Playback Synchronized</span>
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* Right Column (35%) */}
        <div className="col-span-12 lg:col-span-5 space-y-10">
          
          {/* Details Card */}
          <div className="bg-bg-surface border border-border rounded-[32px] p-10 space-y-10 shadow-xl sticky top-24">
             <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-serif font-bold text-text-primary italic mb-6">Technical Specifications</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">⭐ AI Rating</span>
                     <div className="flex items-center gap-2">
                        <span className="font-black text-text-primary text-lg">{displayRating(movie?.rating)}/10</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">📅 Release Year</span>
                     <span className="text-text-primary font-bold">{movie?.year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">🌐 Language</span>
                     <span className="text-text-primary font-bold">
                       {(() => {
                         const langMap: Record<string, string> = { ta: 'Tamil', hi: 'Hindi', en: 'English', ko: 'Korean', ml: 'Malayalam', te: 'Telugu' };
                         return langMap[movie?.original_language || ''] || movie?.language || 'N/A';
                       })()}
                     </span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                     <span className="text-text-muted text-[15px] font-bold">⏱ Duration</span>
                     <span className="text-text-primary font-bold">
                       {movie?.runtime ? `${movie.runtime} min` : 'N/A'}
                     </span>
                  </div>
                </div>
             </div>

             {/* Streaming Platforms */}
             {validStreaming.length > 0 && (
               <div className="pt-6 border-t border-border">
                  <div className="text-text-primary font-bold flex items-center gap-3 mb-8 text-lg">
                     <Globe size={22} className="text-accent-red" />
                     Streaming Availability
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {validStreaming.map((s, i) => (
                       <div key={i} className="h-14 px-6 rounded-2xl bg-bg-card border border-border flex items-center gap-4 group cursor-pointer hover:border-accent-red/40 hover:-translate-y-1 transition-all overflow-hidden">
                          <img src={s.logo} alt={s.name} className="w-8 h-8 object-contain" />
                          <span className="text-text-primary text-[15px] font-black group-hover:text-accent-red transition-colors truncate">{s.name}</span>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             <button 
                onClick={() => movie?.has_trailer && movie?.trailer_url && window.open(movie.trailer_url, '_blank')}
                className="w-full h-16 bg-accent-red rounded-2xl font-black text-white text-[14px] tracking-[2px] uppercase shadow-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                disabled={!movie?.has_trailer}
             >
                WATCH TRAILER
             </button>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(movie, 'movie');
                }}
                className={clsx(
                  "w-full h-14 rounded-full font-black text-sm transition-all border inline-flex items-center justify-center gap-2",
                  inWishlist
                    ? "bg-accent-red text-white border-accent-red"
                    : "bg-transparent text-accent-red border-accent-red hover:bg-accent-red/10"
                )}
             >
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
