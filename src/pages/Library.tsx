import React, { useRef } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';

type Section = 'watched' | 'watchlist';
type ItemType = 'movie' | 'series';

const parseEntries = (rows: any[], type: ItemType, isWatchlist: boolean) =>
  rows
    .map((row) => ({
      title: (row.title || row.Title || row.Name || '').toString().trim(),
      year: Number.parseInt((row.year || row.Year || '').toString(), 10) || new Date().getFullYear(),
      rating: Number.parseFloat((row.rating || row.Rating || '').toString()) || undefined,
      type,
      isWatchlist,
      addedAt: new Date().toISOString(),
      source: 'imported' as const,
    }))
    .filter((entry) => entry.title);

const Library: React.FC = () => {
  const {
    watchedMovies,
    watchedSeries,
    wishlistMovies,
    wishlistSeries,
    removeLibraryItem,
    clearLibrary,
    importLibrary,
  } = useNavrasa();

  const watchedMovieInputRef = useRef<HTMLInputElement>(null);
  const watchedSeriesInputRef = useRef<HTMLInputElement>(null);
  const wishlistMovieInputRef = useRef<HTMLInputElement>(null);
  const wishlistSeriesInputRef = useRef<HTMLInputElement>(null);

  const readAndReplace = (section: Section, type: ItemType, file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        importLibrary(type, section, result.data as any[]);
      },
      error: () => {
        importLibrary(type, section, []);
      },
    });
  };

  const renderTypeList = (
    section: Section,
    type: ItemType,
    title: string,
    items: { title: string; year: number }[],
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-accent-red text-white text-xs font-bold"
          >
            Upload New
          </button>
          <button
            type="button"
            onClick={() => clearLibrary(type, section)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold hover:border-accent-red"
          >
            Clear All
          </button>
        </div>
      </div>

      <label className="border-2 border-dashed border-border rounded-xl p-6 text-center block cursor-pointer hover:border-accent-red transition-colors mb-3">
        <UploadCloud className="mx-auto mb-2 text-accent-red" size={22} />
        <div className="text-sm text-text-primary font-semibold">Drag and drop CSV or click to upload</div>
        <div className="text-xs text-text-muted mt-1">Supported: title, year, rating (or Name/Year/Rating)</div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readAndReplace(section, type, file);
            e.currentTarget.value = '';
          }}
        />
      </label>

      <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="text-xs text-text-hint italic">No imported items</div>
        ) : (
          items.map((item, idx) => (
            <div key={`${item.title}-${idx}`} className="flex justify-between items-center rounded-lg bg-bg-card px-3 py-2">
              <div className="truncate text-sm text-text-primary">
                {item.title} <span className="text-text-muted">({item.year})</span>
              </div>
              <button
                type="button"
                onClick={() => removeLibraryItem(type, section, item.title)}
                className="ml-3 text-text-muted hover:text-accent-red"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Library Import</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent-red">Watched</h2>
          {renderTypeList('watched', 'movie', 'Movies', watchedMovies, watchedMovieInputRef)}
          {renderTypeList('watched', 'series', 'Series', watchedSeries, watchedSeriesInputRef)}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent-red">Wishlist</h2>
          {renderTypeList('watchlist', 'movie', 'Movies', wishlistMovies, wishlistMovieInputRef)}
          {renderTypeList('watchlist', 'series', 'Series', wishlistSeries, wishlistSeriesInputRef)}
        </section>
      </div>
    </div>
  );
};

export default Library;
