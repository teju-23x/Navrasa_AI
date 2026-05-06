import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ShareType = 'movie' | 'series' | 'anime';

const safeGetSession = () => {
  try {
    return localStorage.getItem('navrasa_session');
  } catch {
    return null;
  }
};

const SharePage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title') || '';
  const year = params.get('year') || '';
  const typeParam = params.get('type') || 'movie';
  const type: ShareType = typeParam === 'series' || typeParam === 'anime' || typeParam === 'movie' ? typeParam : 'movie';

  const navigate = useNavigate();

  const [isAuthed, setIsAuthed] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    setIsAuthed(!!safeGetSession());
  }, []);

  const targetPath = useMemo(() => {
    return type === 'series' ? '/series' : type === 'anime' ? '/anime' : '/';
  }, [type]);

  const handleDiscover = () => {
    navigate(targetPath, {
      state: { autoSearchTitle: title, autoSearchType: type, shareYear: year },
      replace: true
    });
  };

  useEffect(() => {
    if (!isAuthed) return;
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    handleDiscover();
  }, [isAuthed, handleDiscover]);

  if (isAuthed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 32
        }}
      >
        <div style={{ fontSize: 14, color: '#888', marginBottom: 8, fontWeight: 600 }}>
          Discovering on Navarasa AI...
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#E50914', marginBottom: 32 }}>✦ Navarasa AI</div>
      </div>
    );
  }

  const typeLabel = type === 'series' ? 'TV Series' : type === 'anime' ? 'Anime' : 'Movie';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: 32
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 8, fontWeight: 600 }}>Your friend shared this with you</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#E50914', marginBottom: 32 }}>✦ Navarasa AI</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>{title}</div>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 40, fontWeight: 600 }}>
        {year} • {typeLabel}
      </div>
      <button
        onClick={handleDiscover}
        style={{
          background: '#E50914',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          padding: '14px 32px',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        Find similar on Navarasa AI
      </button>
    </div>
  );
};

export default SharePage;

