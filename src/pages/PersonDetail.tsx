import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getPersonDetails } from '../services/geminiService';

const PersonDetail: React.FC = () => {
  const { name = '' } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const context = (searchParams.get('context') as 'movie' | 'series') || 'movie';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getPersonDetails(decodeURIComponent(name), context);
        setData(response);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name, context]);

  const items = useMemo(() => {
    const movies = (data?.movies || []).map((m: any) => ({ ...m, type: 'movie' }));
    const series = (data?.series || []).map((s: any) => ({ ...s, type: 'series' }));
    return [...movies, ...series];
  }, [data]);

  const bio = data?.biography || data?.overview || `No biography available for ${decodeURIComponent(name)}.`;

  return (
    <div className="p-10">
      <button className="glass px-4 py-2 mb-6" onClick={() => navigate(-1)}>Back</button>
      {loading ? (
        <div className="glass p-10">Loading person details...</div>
      ) : (
        <>
          <div className="glass p-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            <img src={data?.photo || items[0]?.poster || ''} className="w-full h-[360px] object-cover rounded-xl bg-bg-card" />
            <div>
              <h1 className="text-5xl font-serif font-bold text-text-primary mb-4">{decodeURIComponent(name)}</h1>
              <p className="text-text-muted mb-2">Birthday: {data?.birthday || 'N/A'}</p>
              <p className="text-text-muted mb-4">Known for: {data?.known_for_department || 'Acting'}</p>
              <p className="text-text-primary leading-7">{expanded ? bio : `${bio}`.slice(0, 280)}{!expanded && bio.length > 280 ? '...' : ''}</p>
              {bio.length > 280 && <button className="text-accent-red mt-3" onClick={() => setExpanded((v) => !v)}>{expanded ? 'Read less' : 'Read more'}</button>}
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-10 mb-6">Filmography</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {items.map((item: any, idx: number) => (
              <div key={`${item.title}-${idx}`} className="glass text-left overflow-hidden cursor-default">
                <img src={item.poster || ''} className="w-full aspect-[2/3] object-cover" />
                <div className="p-3">
                  <div className="font-bold">{item.title}</div>
                  <div className="text-xs text-text-muted">{item.year} • {item.rating || 'N/A'}</div>
                  <div className="text-xs text-text-hint">{item.character || 'Character N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonDetail;
