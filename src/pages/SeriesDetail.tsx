import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  Play, 
  Clock, 
  Globe, 
  Calendar,
  Layers,
  Activity,
  Sparkles,
  Heart
} from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';
import { SeriesRecommendation, StreamingPlatform } from '../types';

const SeriesDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAnimeRoute = location.pathname.startsWith('/anime');
  const {
    tvRecommendations,
    animeRecommendations,
    watchedSeries,
    loading: contextLoading,
    wishlistSeries,
    wishlistAnime,
    toggleWishlist
  } = useNavrasa();
  const [scrollY, setScrollY] = useState(0);

  const foundInRecs = isAnimeRoute
    ? animeRecommendations?.find(s => s.id === id)
    : tvRecommendations?.find(s => s.id === id);
  const foundInWishlist = isAnimeRoute
    ? wishlistAnime?.find(s => s.id === id || s.title.toLowerCase().replace(/\s+/g, '-') === id)
    : wishlistSeries?.find(s => s.id === id || s.title.toLowerCase().replace(/\s+/g, '-') === id);
  const foundInHistory = !isAnimeRoute
    ? watchedSeries?.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === id)
    : undefined;

  const series = (foundInRecs || (foundInWishlist ? {
    id: id || foundInWishlist.id || '',
    title: foundInWishlist.title,
    year: String(foundInWishlist.year || new Date().getFullYear()),
    rating: foundInWishlist.rating || 0,
    poster: foundInWishlist.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
    genres: foundInWishlist.genres || [],
    overview: foundInWishlist.overview || 'Details from your wishlist.',
    match_reason: foundInWishlist.match_reason || 'Saved in your wishlist.',
    streaming: (foundInWishlist.streaming as StreamingPlatform[]) || [],
    has_trailer: !!foundInWishlist.has_trailer,
    trailer_url: foundInWishlist.trailer_url,
    total_seasons: foundInWishlist.total_seasons || 1,
    episode_count: foundInWishlist.episode_count,
    number_of_episodes: foundInWishlist.number_of_episodes,
    status: foundInWishlist.status || 'Returning Series',
    type: isAnimeRoute ? ('anime' as const) : ('series' as const)
  } : null) || (foundInHistory ? {
    id: id,
    title: foundInHistory.title,
    year: (foundInHistory.year || new Date().getFullYear()).toString(),
    rating: foundInHistory.rating || 0,
    poster: foundInHistory.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
    genres: [],
    overview: "Series details are synchronized from your collection.",
    match_reason: "This series is part of your curated history.",
    streaming: [],
    has_trailer: false,
    total_seasons: 1,
    status: 'Returning Series',
    type: 'series' as const
  } : null)) as SeriesRecommendation | null;
  const inWishlist = (isAnimeRoute ? wishlistAnime : wishlistSeries).some((entry) => entry.title === series?.title);
  const episodeDisplay =
    series?.episode_count ? `${series.episode_count} Episodes` :
    series?.number_of_episodes ? `${series.number_of_episodes} Episodes` :
    series?.total_seasons ? `${series.total_seasons} Season${series.total_seasons > 1 ? 's' : ''}` :
    'Ongoing';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-20">
         <div className="w-16 h-16 border-4 border-accent-red/20 border-t-accent-red rounded-full animate-spin mb-8" />
         <p className="text-text-muted font-serif italic text-xl">Analyzing series metadata...</p>
      </div>
    );
  }

  if (!series) return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-20 text-center">
       <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center mb-6 text-accent-red">
          <Activity size={36} />
       </div>
       <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">{isAnimeRoute ? 'Anime Not Found' : 'Series Not Found'}</h2>
       <p className="text-text-muted mb-8 italic">We couldn't locate the data for this selection.</p>
       <button 
        onClick={() => navigate(-1)}
        className="h-12 px-8 bg-accent-red text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
       >
         Back to Results
       </button>
    </div>
  );

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Returning Series': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Ended': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'In Production': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default: return 'bg-bg-card text-text-hint border-border';
    }
  };

  const displayRating = (rating: number | undefined) => {
    if (rating === undefined || rating === 0) return "N/A";
    return rating.toFixed(1);
  };

  const validStreaming = (series?.streaming || []).filter((s): s is StreamingPlatform => 
    typeof s !== 'string' && !!s?.logo && s?.logo?.startsWith('https://image.tmdb.org')
  );

  return (
    <div className="relative animate-fade-in bg-bg-primary min-h-screen transition-colors duration-300">
      {/* Hero Banner Section */}
      <section className="relative h-[650px] w-full overflow-hidden">
        {/* Backdrop Image with Parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <img 
            src={series?.poster} 
            alt={series?.title} 
            className="w-full h-full object-cover"
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
          Back to Results
        </button>

        {/* Hero Bottom Content */}
        <div className="absolute bottom-12 left-10 max-w-[900px] z-10 px-6">
          <div className="flex flex-wrap gap-2.5 mb-8">
             {series?.genres?.map(g => (
               <span key={g} className="bg-accent-red/20 border border-accent-red/40 text-accent-red text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">{g}</span>
             ))}
             <span className={clsx("px-4 py-1.5 rounded-xl text-xs font-black border uppercase tracking-widest", getStatusColor(series?.status))}>
               {series?.status || 'Unknown'}
             </span>
             <span className="glass px-4 py-1.5 rounded-xl text-xs font-black text-text-muted border border-border uppercase tracking-widest">
              {episodeDisplay}
             </span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[70px] font-serif font-bold text-text-primary leading-[1.1] drop-shadow-2xl mb-6 italic"
          >
            {series?.title}
          </motion.h1>

          <div className="flex items-center gap-6 text-[17px] font-bold text-text-muted">
             <span className="flex items-center gap-2 text-accent-gold px-3 py-1 bg-accent-gold/10 rounded-lg border border-accent-gold/20">
               <Star size={20} fill="currentColor" /> {displayRating(series?.rating)}
             </span>
             <span className="text-text-hint">•</span>
             <span className="text-text-primary/80">{series?.year || 'N/A'}</span>
             <span className="text-text-hint">•</span>
             <span className="text-text-primary/80">Premium TV Discovery</span>
             <span className="text-text-hint">•</span>
             <span className="flex items-center gap-2 text-accent-red">
                <Activity size={18} /> {isAnimeRoute || series?.type === 'anime' ? 'Anime' : 'Series'}
             </span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-12 px-10 py-16">
        
        {/* Left Column (65%) */}
        <div className="col-span-12 lg:col-span-7 space-y-12">
          
          {/* Why Recommended Card */}
          {series?.match_reason && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-bg-card border border-accent-red/20 rounded-[32px] p-12 overflow-hidden shadow-xl"
            >
               <div className="absolute top-[-20px] left-[-20px] text-[160px] font-serif italic text-accent-red/5 pointer-events-none">"</div>
               
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-accent-red" />
                  </div>
                  <span className="text-lg font-black text-accent-red uppercase tracking-widest">Why We Recommend</span>
               </div>

               <p className="text-[24px] font-serif italic text-text-primary leading-[1.6] px-2 relative z-10 font-medium whitespace-pre-line">
                  "{series.match_reason}"
               </p>
            </motion.div>
          )}

          {/* About This Series */}
          {series?.overview && (
            <section className="bg-bg-surface border border-border rounded-[32px] p-10 shadow-sm">
               <div className="flex items-center gap-3 mb-8 text-text-primary text-xl font-bold">
                  <Layers size={22} className="text-accent-red" />
                  {isAnimeRoute || series?.type === 'anime' ? 'Anime Overview' : 'Narrative Overview'}
               </div>
               <p className="text-[17px] text-text-muted leading-[1.8] font-medium italic">
                  {series.overview}
               </p>
            </section>
          )}

          {series?.cast && series.cast.length > 0 && (
            <section className="glass p-8">
              <h3 className="text-xl font-bold mb-5">Cast</h3>
              <div className="flex gap-4 overflow-x-auto">
                {series.cast.map((actor, idx) => (
                  <button key={idx} onClick={() => navigate(`/person/${encodeURIComponent(actor.name)}?context=series`)} className="glass text-left flex-shrink-0 w-[120px] overflow-hidden">
                    <div className="w-full aspect-[2/3] bg-bg-card border-b border-border overflow-hidden flex items-center justify-center">
                      {actor.photo ? <img src={actor.photo} alt={actor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#0D1F35] flex items-center justify-center text-text-primary font-black text-xl">{actor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>}
                    </div>
                    <div className="p-2">
                      <div className="text-[12px] font-bold truncate">{actor.name}</div>
                      <div className="text-[11px] text-text-muted truncate">{actor.character}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Trailer Section */}
          {series?.has_trailer && series?.trailer_url && (
            <section className="space-y-8">
               <div className="flex items-center gap-3 text-text-primary text-xl font-bold">
                  <Play size={22} className="text-accent-red" />
                  {isAnimeRoute || series?.type === 'anime' ? 'Anime Trailer' : 'Series Trailer'}
               </div>
               
               <div className="relative aspect-video rounded-[32px] overflow-hidden group cursor-pointer shadow-2xl border border-border">
                  <img src={series?.poster} alt="" className="w-full h-full object-cover blur-[8px] opacity-40 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-bg-primary/20 group-hover:bg-bg-primary/10 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                     <div 
                       onClick={() => window.open(series?.trailer_url || '#', '_blank')}
                       className="w-20 h-20 rounded-full bg-accent-red flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group-hover:shadow-accent-red/40"
                     >
                        <Play size={32} fill="white" className="ml-1.5" />
                     </div>
                     <span className="text-[14px] font-black text-text-primary tracking-[0.3em] uppercase drop-shadow-md">Trailer Stream Ready</span>
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
                <h3 className="text-2xl font-serif font-bold text-text-primary italic mb-6">Discovery Specs</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">⭐ AI Rating</span>
                     <span className="font-black text-text-primary text-lg">{displayRating(series?.rating)}/10</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">📅 Release Year</span>
                     <span className="text-text-primary font-bold">{series?.year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">🎬 Format</span>
                     <span className="text-text-primary font-bold">{isAnimeRoute || series?.type === 'anime' ? 'Anime' : 'TV Series'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-border">
                     <span className="text-text-muted text-[15px] font-bold">🎞 Episodes</span>
                     <span className="text-text-primary font-bold">{episodeDisplay}</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                     <span className="text-text-muted text-[15px] font-bold">📍 Status</span>
                     <span className={clsx("font-bold", series?.status === 'Ended' ? "text-red-500" : "text-green-500")}>
                        {series?.status || 'Unknown'}
                     </span>
                  </div>
                </div>
             </div>

             {/* Streaming Platforms */}
             {validStreaming.length > 0 && (
               <div className="pt-6 border-t border-border">
                  <div className="text-text-primary font-bold flex items-center gap-3 mb-8 text-lg">
                     <Globe size={22} className="text-accent-red" />
                     Availability
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {validStreaming.map((platform, i) => (
                       <div key={i} className="h-14 px-6 rounded-2xl bg-bg-card border border-border flex items-center gap-4 group cursor-pointer hover:border-accent-red/40 hover:-translate-y-1 transition-all overflow-hidden">
                          <img src={platform.logo} alt={platform.name} className="w-8 h-8 object-contain" />
                          <span className="text-text-primary text-[13px] font-black group-hover:text-accent-red transition-colors truncate">{platform.name}</span>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             <button 
                onClick={() => series?.has_trailer && series?.trailer_url && window.open(series.trailer_url, '_blank')}
                className="w-full h-16 bg-accent-red rounded-2xl font-black text-white text-[14px] tracking-[2px] uppercase shadow-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                disabled={!series?.has_trailer}
             >
                WATCH TRAILER
             </button>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (series) toggleWishlist(series, isAnimeRoute || series.type === 'anime' ? 'anime' : 'series');
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

export default SeriesDetail;
