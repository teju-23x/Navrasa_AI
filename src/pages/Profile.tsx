import React, { useMemo, useState } from 'react';
import {
  Camera,
  Film,
  Ticket,
  Star,
  Clapperboard,
  Popcorn,
  Trophy,
  Armchair,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = ['Malayalam', 'Tamil', 'Hindi', 'Telugu', 'Korean', 'English'];
const GENRES = ['Drama', 'Thriller', 'Crime', 'Romance', 'Sci-Fi', 'Action', 'Comedy', 'Horror'];

const ICONS = [
  { name: 'Camera', icon: <Camera size={18} /> },
  { name: 'Film', icon: <Film size={18} /> },
  { name: 'Ticket', icon: <Ticket size={18} /> },
  { name: 'Star', icon: <Star size={18} /> },
  { name: 'Clapperboard', icon: <Clapperboard size={18} /> },
  { name: 'Popcorn', icon: <Popcorn size={18} /> },
  { name: 'Trophy', icon: <Trophy size={18} /> },
  { name: 'Armchair', icon: <Armchair size={18} /> },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useNavrasa();
  const initialPrefs = useMemo(() => {
    try {
      const raw = localStorage.getItem('navrasa_profile');
      return raw ? JSON.parse(raw) : { language: 'English', genres: [] as string[] };
    } catch (error) {
      console.error('Failed to read profile preferences', error);
      return { language: 'English', genres: [] as string[] };
    }
  }, []);

  const [name, setName] = useState(userProfile.name || 'Guest Viewer');
  const [avatarIndex, setAvatarIndex] = useState(userProfile.avatarIndex || 0);
  const [language, setLanguage] = useState(initialPrefs.language || 'English');
  const [genrePrefs, setGenrePrefs] = useState<string[]>(initialPrefs.genres || []);

  const saveProfile = () => {
    const payload = { name, avatarIndex, avatarType: 'cinema' as const };
    updateProfile(payload);
    localStorage.setItem('navrasa_profile', JSON.stringify({ ...payload, language, genres: genrePrefs }));
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('navrasa_session');
    } catch (error) {
      console.error('Failed to clear session', error);
    }
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Profile</h1>

      <div className="glass p-6 space-y-3">
        <label className="text-sm font-semibold text-text-muted">Display Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-md h-11 bg-bg-card border border-border rounded-lg px-3 focus:border-accent-red outline-none"
        />
      </div>

      <div className="glass p-6 space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Avatar</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {ICONS.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setAvatarIndex(index)}
              className={clsx(
                'h-14 rounded-lg border flex flex-col items-center justify-center gap-1 text-xs',
                avatarIndex === index ? 'border-accent-red text-accent-red bg-accent-red/10' : 'border-border text-text-muted',
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass p-6 space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Language Preference</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={clsx(
                'px-3 py-1.5 rounded-full border text-sm',
                language === lang ? 'border-accent-red text-white bg-accent-red/20' : 'border-border text-text-muted',
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="glass p-6 space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Genre Preferences</h2>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const active = genrePrefs.includes(genre);
            return (
              <button
                key={genre}
                onClick={() =>
                  setGenrePrefs((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
                }
                className={clsx(
                  'px-3 py-1.5 rounded-full border text-sm',
                  active ? 'border-accent-red text-white bg-accent-red/20' : 'border-border text-text-muted',
                )}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={saveProfile} className="px-5 py-2 rounded-lg bg-accent-red text-white font-semibold">
        Save Profile
      </button>
      <button onClick={handleSignOut} className="px-5 py-2 rounded-lg border border-accent-red text-accent-red font-semibold hover:bg-accent-red/10">
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
