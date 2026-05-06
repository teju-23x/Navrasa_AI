import React from 'react';
import { useNavrasa } from '../context/NavrasaContext';
import { Film, Heart, Play, X } from 'lucide-react';
import { clsx } from 'clsx';
import { LibraryEntry } from '../types';

const Wishlist: React.FC = () => {
  const { wishlistMovies, wishlistSeries, wishlistAnime, toggleWishlist } = useNavrasa();
  const [selectedItem, setSelectedItem] = React.useState<
    (LibraryEntry & { type: 'movie' | 'series' | 'anime' }) | null
  >(null);
  const items = [
    ...(wishlistMovies || []).map((item) => ({ ...item, type: 'movie' as const })),
    ...(wishlistSeries || []).map((item) => ({ ...item, type: 'series' as const })),
    ...(wishlistAnime || []).map((item) => ({ ...item, type: 'anime' as const }))
  ].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  return (
    <div className="p-10">
      <h1 className="text-4xl font-serif font-bold mb-8 text-text-primary">Wishlist</h1>
      {items.length === 0 ? (
        <div className="glass p-8 text-text-muted">
          No items in your wishlist yet. Heart a movie, series, or anime to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8">
          {items.map((item, idx) => (
            <button
              key={`${item.type}-${item.title}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className={clsx(
                "relative aspect-[2/3] rounded-[24px] overflow-hidden border border-border hover:scale-[1.03] transition-all text-left",
                item.poster ? "bg-bg-card" : "bg-gradient-to-br from-bg-surface via-bg-card to-bg-primary"
              )}
            >
              {item.poster ? (
                <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full w-full p-5 flex flex-col items-center justify-center gap-3">
                  <Film size={32} className="text-text-muted" />
                  <span className="text-center text-text-primary font-bold line-clamp-3">{item.title}</span>
                  <span className="text-xs text-text-muted">{item.year || 'Unknown Year'}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-sm font-bold text-white line-clamp-2">{item.title}</div>
                <div className="text-xs text-white/80 mt-1">{item.year || 'Unknown Year'}</div>
                {item.rating && item.rating !== 0 ? (
                  <span className="inline-block text-xs text-accent-gold font-bold mt-1">⭐ {Number(item.rating).toFixed(1)}</span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-bg-surface border border-border rounded-3xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 rounded-full border border-border hover:border-accent-red">
              <X size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                {selectedItem.poster ? (
                  <img src={selectedItem.poster} alt={selectedItem.title} className="rounded-2xl w-full h-auto object-cover" />
                ) : (
                  <div className="rounded-2xl min-h-[320px] bg-gradient-to-br from-bg-card to-bg-primary border border-border flex items-center justify-center p-6 text-center">
                    <div>
                      <Film size={36} className="mx-auto mb-3 text-text-muted" />
                      <div className="text-text-primary font-bold">{selectedItem.title}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-5">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-text-primary">{selectedItem.title}</h2>
                  <p className="text-text-muted mt-1">
                    {selectedItem.year || 'Unknown Year'} •{' '}
                    {selectedItem.type === 'anime'
                      ? 'Anime'
                      : selectedItem.type === 'series'
                        ? 'Series'
                        : 'Movie'}
                  </p>
                </div>
                {selectedItem.overview ? <p className="text-text-muted leading-relaxed">{selectedItem.overview}</p> : null}
                {selectedItem.match_reason ? <p className="italic text-text-primary/90">"{selectedItem.match_reason}"</p> : null}
                {selectedItem.streaming && selectedItem.streaming.length > 0 ? (
                  <div className="streaming-section">
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Available on</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {selectedItem.streaming.map((platform, i) => {
                        const name = typeof platform === 'string' ? platform : platform.name;
                        const logo = typeof platform === 'string' ? undefined : platform.logo;
                        return (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              background: 'rgba(255,255,255,0.08)',
                              borderRadius: 6,
                              padding: '4px 8px'
                            }}
                          >
                            {logo ? (
                              <img src={logo} alt={name} style={{ width: 20, height: 20, borderRadius: 4 }} />
                            ) : null}
                            <span style={{ fontSize: 12, color: '#fff' }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Streaming availability not available</p>
                )}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(selectedItem, selectedItem.type);
                      setSelectedItem(null);
                    }}
                    className="h-11 px-6 rounded-full bg-accent-red text-white font-bold inline-flex items-center gap-2 hover:brightness-110 transition-all"
                  >
                    <Heart size={16} fill="currentColor" /> Remove from Wishlist
                  </button>
                  {selectedItem.has_trailer && selectedItem.trailer_url ? (
                    <button
                      onClick={() => window.open(selectedItem.trailer_url, '_blank')}
                      className="h-11 px-6 rounded-full border border-border text-text-primary font-bold inline-flex items-center gap-2 hover:border-accent-red transition-all"
                    >
                      <Play size={16} /> Watch Trailer
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
