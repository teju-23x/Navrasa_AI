import React, { useEffect, useRef, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import MovieCard from '../components/MovieCard';

const languageTabs = [
  { label: 'Malayalam', code: 'ml' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Telugu', code: 'te' },
  { label: 'Korean', code: 'ko' },
  { label: 'English', code: 'en' },
  { label: 'All', code: 'all' }
];

const Home: React.FC = () => {
  const { recommendations, loading, generateRecs, searchQuery, setSearchQuery, resetMovieDiscovery, setError } = useNavrasa();
  const [activeLang, setActiveLang] = useState('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickChips = ['Gritty crime thrillers', 'Classic romantic comedy', 'Sci-fi visuals', '90s action', 'Korean drama'];

  useEffect(() => {
    resetMovieDiscovery();
    setError(null);
  }, [resetMovieDiscovery, setError]);

  return (
    <div className="min-h-screen">
      <section className="px-4 md:px-10 pt-10 md:pt-16 pb-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-3xl md:text-5xl font-black tracking-tight">
            <span className="text-accent-red">Navrasa</span> <span className="text-text-primary">AI</span>
          </div>
          <p className="mt-3 text-text-muted text-base md:text-lg">Discover your next favourite film</p>
        </div>
      </section>

      <div className="px-4 md:px-10 pb-10">
        <div className="relative w-full max-w-2xl group mx-auto">
          <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none"><Search className="w-5 h-5 md:w-6 md:h-6 text-text-hint" /></div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateRecs()}
            placeholder="What do you want to watch tonight?"
            className="w-full h-14 md:h-16 glass rounded-2xl pl-12 md:pl-16 pr-4 md:pr-32 text-sm md:text-base"
          />
          <button onClick={generateRecs} disabled={loading || !searchQuery.trim()} className="mt-3 md:mt-0 md:absolute right-3 md:top-1/2 md:-translate-y-1/2 h-11 w-full md:w-auto px-6 bg-accent-red rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2">
            <Sparkles size={16} />
            Search
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 justify-center">
          {languageTabs.map((tab) => (
            <button
              key={tab.code}
              onClick={() => {
                setActiveLang(tab.code);
                if (tab.code === 'all') {
                  setSearchQuery('');
                } else {
                  setSearchQuery(`${tab.label.toLowerCase()} `);
                }
                searchInputRef.current?.focus();
              }}
              className={`px-4 py-2 rounded-full border ${activeLang === tab.code ? 'bg-accent-red/20 border-accent-red text-white' : 'glass text-text-muted'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSearchQuery(chip);
                searchInputRef.current?.focus();
              }}
              className="px-3 py-1.5 text-sm rounded-full border border-border text-text-muted hover:text-text-primary hover:border-accent-red"
            >
              {chip}
            </button>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8 mt-10">
            {recommendations.filter((r) => r.type !== 'song').map((rec, idx) => (
              <MovieCard key={rec.id} item={rec} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
