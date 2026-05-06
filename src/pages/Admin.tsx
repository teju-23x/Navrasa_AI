import React, { useMemo, useState } from 'react';
import { runWebhookTest } from '../services/geminiService';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';

const mostKey = (obj: Record<string, number> = {}) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { watchedMovies, watchedSeries, watchlistMovies, watchlistSeries, removeLibraryItem } = useNavrasa();
  const [query, setQuery] = useState('trending today');
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [response, setResponse] = useState('');

  const stats = useMemo(() => {
    try {
      const raw = localStorage.getItem('navrasa_search_stats');
      return raw ? JSON.parse(raw) : { totalSearches: 0, genre: {}, language: {} };
    } catch (error) {
      console.error('Failed to read search stats', error);
      return { totalSearches: 0, genre: {}, language: {} };
    }
  }, []);
  const cache = useMemo(() => {
    try {
      const raw = localStorage.getItem('navrasa_api_cache');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Failed to read cache', error);
      return [];
    }
  }, []);
  const recentCache = [...cache].slice(-5).reverse();
  const libraryItems = [
    ...watchedMovies.map((item) => ({ ...item, category: 'watched' as const })),
    ...watchedSeries.map((item) => ({ ...item, category: 'watched' as const })),
    ...watchlistMovies.map((item) => ({ ...item, category: 'watchlist' as const })),
    ...watchlistSeries.map((item) => ({ ...item, category: 'watchlist' as const })),
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="glass p-5">
        <h2 className="font-bold mb-3">Stats</h2>
        <p>Total searches: {stats.totalSearches || 0}</p>
        <p>Most searched genre: {mostKey(stats.genre)}</p>
        <p>Most searched language: {mostKey(stats.language)}</p>
      </div>
      <div className="glass p-5">
        <h2 className="font-bold mb-3">Cache Viewer (last 5)</h2>
        <div className="space-y-2">
          {recentCache.map((entry: any, idx: number) => (
            <pre key={idx} className="text-xs overflow-auto bg-bg-primary/50 p-2 rounded">
              {entry.timestamp} - {entry.endpoint}
            </pre>
          ))}
        </div>
      </div>
      <div className="glass p-5">
        <h2 className="font-bold mb-3">Library Manager</h2>
        {libraryItems.slice(0, 80).map((item, idx) => (
          <div key={`${item.title}-${idx}`} className="flex justify-between py-1">
            <span>{item.title}</span>
            <button
              onClick={() =>
                removeLibraryItem(item.type as 'movie' | 'series', item.category, item.title)
              }
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div className="glass p-5">
        <h2 className="font-bold mb-3">Preferences Reset</h2>
        <button className="px-4 py-2 bg-accent-red rounded-lg text-white" onClick={() => { localStorage.clear(); window.location.reload(); }}>
          Reset app state
        </button>
      </div>
      <div className="glass p-5">
        <h2 className="font-bold mb-3">Webhook Tester</h2>
        <div className="flex gap-2 mb-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="bg-bg-card px-3 py-2 rounded border border-border flex-1" />
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="bg-bg-card px-3 py-2 rounded border border-border">
            <option value="movie">movie</option>
            <option value="series">series</option>
          </select>
          <button className="px-4 py-2 bg-accent-red text-white rounded" onClick={async () => setResponse(JSON.stringify(await runWebhookTest(query, type), null, 2))}>Send</button>
        </div>
        <pre className="text-xs bg-bg-primary/50 p-3 rounded overflow-auto max-h-80">{response}</pre>
      </div>
      <button
        className="px-5 py-2 rounded-lg border border-accent-red text-accent-red font-semibold hover:bg-accent-red/10"
        onClick={() => {
          try {
            localStorage.removeItem('navrasa_session');
          } catch (error) {
            console.error('Failed to clear session', error);
          }
          navigate('/login');
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Admin;
