import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Info,
  Star,
  Search,
  Sparkles,
  Zap,
  Layers,
  Activity
} from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';
import { SeriesRecommendation } from '../types';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const episodeOrSeasonLabel = (item: SeriesRecommendation | null) => {
  if (!item) return '';
  if (item.episode_count) return `${item.episode_count} Episodes`;
  if (item.number_of_episodes) return `${item.number_of_episodes} Episodes`;
  return `${item.total_seasons || 1} Seasons`;
};

const SUGGESTION_CHIPS = [
  'Dark fantasy anime',
  'Romantic anime',
  'Action shounen',
  'Slice of life anime',
  'Psychological thriller anime'
];

const Anime: React.FC = () => {
  const {
    animeRecommendations,
    loading,
    error,
    generateAnimeRecs,
    animeSearchQuery,
    setAnimeSearchQuery,
    resetAnimeDiscovery,
    setError
  } = useNavrasa();
  const navigate = useNavigate();

  useEffect(() => {
    resetAnimeDiscovery();
    setError(null);
  }, [resetAnimeDiscovery, setError]);

  const isInitialState = (!animeRecommendations || animeRecommendations.length === 0) && !loading && !error;
  const hasResults = animeRecommendations && animeRecommendations.length > 0;
  const heroAnime = hasResults ? (animeRecommendations[0] as SeriesRecommendation) : null;
  const gridAnime = hasResults ? animeRecommendations.slice(1) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Returning Series':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Ended':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'In Production':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-bg-card text-text-hint border-border';
    }
  };

  return (
    <div className="flex flex-col bg-bg-primary min-h-screen transition-colors duration-300">
      <section
        className={clsx(
          'relative w-full overflow-hidden transition-all duration-700',
          isInitialState
            ? 'h-screen min-h-[520px] md:min-h-[600px] flex items-center justify-center'
            : 'min-h-[520px] md:h-[600px]'
        )}
      >
        {heroAnime && (
          <div className="absolute inset-0">
            <img
              src={heroAnime.poster}
              alt=""
              className="w-full h-full object-cover animate-ken-burns opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-transparent to-transparent" />
          </div>
        )}

        {isInitialState && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-red/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] animate-pulse" />
          </div>
        )}

        <div
          className={clsx(
            'relative z-10 w-full px-4 md:px-10 flex flex-col',
            isInitialState ? 'items-center text-center' : 'h-full pt-10 md:pt-20 justify-center'
          )}
        >
          {isInitialState && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center mb-10"
            >
              <div className="flex items-center gap-3 md:gap-4 text-3xl md:text-6xl font-black mb-6">
                <Zap className="text-accent-red" size={44} />
                <div>
                  <span className="text-text-primary">Navrasa</span>
                  <span className="text-accent-red ml-1">Anime</span>
                </div>
              </div>
              <p className="text-lg md:text-2xl text-text-muted font-light tracking-wide italic">
                Japanese animation, AI-curated picks
              </p>
            </motion.div>
          )}

          {!isInitialState && heroAnime && (
            <div className="grid grid-cols-12 gap-6 md:gap-12 items-end">
              <div className="col-span-12 lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-accent-red/20 border border-accent-red/40 text-accent-red text-[11px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
                      Top Anime Match
                    </span>
                    <span className="text-text-muted text-sm font-bold tracking-tight italic line-clamp-1">
                      Results for "{animeSearchQuery || 'Discovery'}"
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-6xl font-serif font-bold text-text-primary leading-tight drop-shadow-xl">
                    {heroAnime.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold">
                    <span className="flex items-center gap-2 px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-lg border border-accent-gold/20">
                      <Star size={16} fill="currentColor" /> {heroAnime.rating}
                    </span>
                    <span className="px-3 py-1 bg-bg-card border border-border rounded-lg text-text-primary flex items-center gap-2">
                      <Layers size={14} className="text-accent-red" />
                      {episodeOrSeasonLabel(heroAnime)}
                    </span>
                    <span
                      className={clsx(
                        'px-3 py-1 rounded-lg border flex items-center gap-2',
                        getStatusColor(heroAnime.status)
                      )}
                    >
                      <Activity size={14} />
                      {heroAnime.status || 'Active'}
                    </span>
                    <span className="text-text-muted">{heroAnime.year}</span>
                    <span className="text-text-muted">{heroAnime.genres?.join(', ')}</span>
                  </div>

                  <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl line-clamp-3 italic">
                    {heroAnime.overview}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2 md:pt-4">
                    {heroAnime.has_trailer && (
                      <button
                        onClick={() => window.open(heroAnime.trailer_url, '_blank')}
                        className="h-12 md:h-14 px-6 md:px-8 bg-accent-red rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all"
                      >
                        <Play size={20} fill="white" /> Watch Trailer
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/anime/${heroAnime.id}`)}
                      className="h-12 md:h-14 px-6 md:px-8 glass rounded-2xl font-bold text-text-primary flex items-center justify-center gap-3 hover:translate-y-0.5 transition-all"
                    >
                      <Info size={20} /> Anime Details
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="col-span-12 lg:col-span-5 pb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-5 md:p-8 relative overflow-hidden group border border-accent-red/20"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={64} className="text-accent-red" />
                  </div>
                  <h4 className="text-accent-red font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={14} /> Why We Recommend
                  </h4>
                  <p className="text-text-primary text-[15px] leading-relaxed italic font-medium">
                    "{heroAnime.match_reason}"
                  </p>
                </motion.div>
              </div>
            </div>
          )}

          <div
            className={clsx(
              'relative w-full max-w-2xl group transition-all duration-500',
              isInitialState ? 'mt-4' : 'mt-8 self-start'
            )}
          >
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search
                className={clsx('w-6 h-6 transition-colors', animeSearchQuery ? 'text-accent-red' : 'text-text-hint')}
              />
            </div>
            <input
              type="text"
              value={animeSearchQuery}
              onChange={(e) => setAnimeSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateAnimeRecs()}
              placeholder="Search anime... e.g. dark fantasy anime, attack on titan style"
              className="w-full h-14 md:h-18 bg-bg-card border border-border rounded-2xl pl-12 md:pl-16 pr-4 md:pr-32 text-base md:text-lg text-text-primary outline-none focus:border-accent-red/50 focus:bg-bg-glass focus:shadow-[0_0_40px_rgba(229,9,20,0.1)] transition-all placeholder:text-text-hint"
            />
            <button
              onClick={() => generateAnimeRecs()}
              disabled={loading || !animeSearchQuery.trim()}
              className="mt-3 md:mt-0 md:absolute right-3 md:top-1/2 md:-translate-y-1/2 h-11 md:h-12 w-full md:w-auto px-6 md:px-8 bg-accent-red rounded-xl text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              Search
            </button>
          </div>

          {isInitialState && (
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              {SUGGESTION_CHIPS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setAnimeSearchQuery(tag);
                    generateAnimeRecs(tag);
                  }}
                  className="px-5 py-2.5 glass text-sm font-bold text-text-muted hover:text-text-primary hover:border-accent-red transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-text-primary flex items-center gap-3">
              ⚡ <span className="italic">Anime</span> Discovery
            </h2>
            <p className="text-sm text-text-muted font-medium">AI anime matches from your searches</p>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-accent-red">
              <div className="w-5 h-5 border-2 border-accent-red/20 border-t-accent-red rounded-full animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest">AI Synthesis Active</span>
            </div>
          )}

          {!loading && !error && (
            <span className="px-4 py-1.5 glass text-[11px] font-black text-accent-red rounded-lg border border-accent-red/20 uppercase tracking-widest">
              Anime Webhook Connected
            </span>
          )}
        </div>

        {error && (
          <div className="py-20 flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-[3rem] mb-12">
            <Activity size={48} className="text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h3>
            <p className="text-text-muted mb-6">{error}</p>
            <button
              onClick={() => generateAnimeRecs()}
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:brightness-110"
            >
              Retry Search
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {gridAnime?.map((item, idx) => (
              <MovieCard key={item.id || idx} item={item} idx={idx} />
            ))}
          </AnimatePresence>

          {loading && (!animeRecommendations || animeRecommendations.length === 0) &&
            [...Array(12)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-[24px] bg-bg-card border border-border animate-pulse overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-text-primary/5 to-transparent -translate-x-full animate-shimmer" />
              </div>
            ))}
        </div>

        {!loading && !error && (!animeRecommendations || animeRecommendations.length === 0) && !isInitialState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 border border-border rounded-[3rem] bg-bg-surface/50"
          >
            <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center mb-6 text-accent-red shadow-inner">
              <Search size={36} />
            </div>
            <h3 className="text-3xl font-serif text-text-primary font-bold italic mb-3">No anime found.</h3>
            <p className="text-text-muted text-lg max-w-md text-center font-medium">
              Try a different search or broaden your request.
            </p>
            <button
              onClick={() => setAnimeSearchQuery('')}
              className="mt-6 text-accent-red font-black text-xs uppercase tracking-widest border-b border-accent-red/30 pb-1"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {!loading && !error && isInitialState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 bg-bg-surface/50 border border-border rounded-[3rem]"
          >
            <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center mb-6 text-accent-red shadow-inner">
              <Zap size={36} />
            </div>
            <h3 className="text-3xl font-serif text-text-primary font-bold italic mb-3">Discover your next anime</h3>
            <p className="text-text-muted text-lg max-w-md text-center font-medium">
              Search by vibe, studio style, or titles you love — we will match you with series worth watching.
            </p>
          </motion.div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `
        }}
      />
    </div>
  );
};

export default Anime;
