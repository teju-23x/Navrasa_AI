import React from 'react';
import { motion } from 'motion/react';
import { Star, Play, ChevronRight, Heart } from 'lucide-react';
import { Recommendation, SeriesRecommendation, StreamingPlatform } from '../types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';

interface MovieCardProps {
  item: Recommendation | SeriesRecommendation;
  idx: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, idx }) => {
  const navigate = useNavigate();
  const { wishlistMovies, wishlistSeries, wishlistAnime, toggleWishlist } = useNavrasa();

  const displayRating = (rating: number | undefined) => {
    if (rating === undefined || rating === 0) return "N/A";
    return rating.toFixed(1);
  };

  const isSeriesLike = (item: Recommendation | SeriesRecommendation): item is SeriesRecommendation => {
    return item.type === 'series' || item.type === 'anime';
  };

  // Only show streaming if it exists, has items, and each item has a logo starting with TMDB URL
  const validStreaming = (item.streaming || []).filter((s): s is StreamingPlatform => 
    typeof s !== 'string' && !!s.logo && s.logo.startsWith('https://image.tmdb.org')
  );
  const wished = isSeriesLike(item)
    ? (item.type === 'anime' ? wishlistAnime : wishlistSeries).some((entry) => entry.title === item.title)
    : wishlistMovies.some((entry) => entry.title === item.title);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: idx * 0.04 }}
      className="group relative aspect-[2/3] rounded-[24px] overflow-hidden cursor-pointer hover:scale-[1.05] hover:z-20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-all duration-500 bg-bg-card border border-border"
      onClick={() => {
        if (item.type === 'anime') navigate(`/anime/${item.id}`);
        else if (item.type === 'series') navigate(`/series/${item.id}`);
        else navigate(`/movie/${item.id}`);
      }}
    >
       {/* Poster Layer */}
       <img 
         src={item.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000"} 
         alt={item.title} 
         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
       />
       
       {/* Gradient Overlay */}
       <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
       
       {/* Status/Type Badge */}
       <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWishlist(
                item,
                item.type === 'anime' ? 'anime' : isSeriesLike(item) ? 'series' : 'movie'
              );
            }}
            className={clsx(
              "w-9 h-9 rounded-full border flex items-center justify-center transition-all relative z-10",
              wished ? "bg-accent-red text-white border-accent-red animate-[heartPop_150ms_ease]" : "bg-black/30 text-white border-white/40 hover:bg-black/50"
            )}
          >
            <Heart size={15} fill={wished ? "currentColor" : "none"} />
          </button>
          <div className="glass bg-bg-surface/80 text-accent-gold px-2.5 py-1 rounded-xl text-[13px] font-black flex items-center gap-1.5 shadow-xl border border-accent-gold/20">
             <Star size={12} fill="currentColor" /> {displayRating(item.rating)}
          </div>
          {isSeriesLike(item) && item.status && (
            <div className={clsx(
              "px-2.5 py-1 rounded-xl text-[10px] font-black border shadow-xl uppercase tracking-wider",
              item.status === 'Returning Series' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
              item.status === 'Ended' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
              'bg-bg-card text-text-hint border-border'
            )}>
              {item.status}
            </div>
          )}
       </div>

       {/* Streaming Badges - Only if valid and has logos */}
       {validStreaming.length > 0 && (
         <div className="absolute top-4 left-4 flex gap-1.5 translate-y-[-40px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            {validStreaming.map((s, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md p-1 border border-white/20 shadow-lg" title={s.name}>
                 <img src={s.logo} alt={s.name} className="w-full h-full object-contain" />
              </div>
            ))}
         </div>
       )}

       {/* Content Layer */}
       <div className="absolute inset-x-0 bottom-0 p-5">
          <h4 className="text-[17px] font-bold text-text-primary line-clamp-2 leading-tight mb-2 group-hover:text-accent-red transition-colors">{item.title}</h4>
          <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
             <span className="text-accent-gold flex items-center gap-1">⭐ {displayRating(item.rating)}</span>
             <span>•</span>
             <span>{item.year}</span>
             {isSeriesLike(item) && (
               <>
                 <span>•</span>
                 <span>
                   {item.episode_count || item.number_of_episodes
                     ? `${item.episode_count || item.number_of_episodes} Episodes`
                     : `${item.total_seasons || 1} Seasons`}
                 </span>
               </>
             )}
          </div>
          
          {/* Match Reason (Reveal on Hover) */}
          <div className="max-h-0 overflow-hidden group-hover:max-h-[140px] transition-all duration-700 ease-in-out">
             <p className="mt-4 text-[12px] italic text-text-muted leading-relaxed line-clamp-3 font-medium">
                {item.match_reason}
             </p>
             <div className="mt-5 flex justify-between items-center">
                {item.has_trailer && item.trailer_url ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); window.open(item.trailer_url, '_blank'); }}
                    className="h-9 px-4 bg-accent-red rounded-xl text-[11px] font-black text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                     <Play size={12} fill="white" /> TRAILER
                  </button>
                ) : <div />}
                <span className="text-[11px] font-black text-accent-red uppercase tracking-widest flex items-center gap-1.5 group/link hover:gap-2 transition-all">
                  Details <ChevronRight size={14} />
                </span>
              </div>
          </div>
       </div>
    </motion.div>
  );
};

export default MovieCard;
