// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';
import {
  Home as HomeIcon,
  Heart,
  User,
  Search as SearchIcon,
  Eye,
  Film,
  LogIn
} from 'lucide-react';

// =======================
// کامپوننت ورود با تلگرام
// =======================
function TelegramLogin({ onLogin }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?15';
    script.setAttribute('data-telegram-login', 'PotatoAnime_bot'); // نام کاربری ربات شما
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', '');
    script.setAttribute('data-request-access', 'write');
    window.onTelegramAuth = user => onLogin(user);
    document.getElementById('telegram-login').appendChild(script);
    return () => { delete window.onTelegramAuth; };
  }, [onLogin]);

  return <div id="telegram-login" className="telegram-login-wrapper" />;
}

// =======================
// هوک مدیریت علاقه‌مندی‌ها
// =======================
function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const data = localStorage.getItem('favorites');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  const toggleFavorite = anime => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === anime.id);
      if (exists) return prev.filter(f => f.id !== anime.id);
      return [...prev, anime];
    });
  };
  return { favorites, toggleFavorite };
}

// =======================
// صفحه اصلی (Home)
// =======================
function Home() {
  const [animes, setAnimes] = useState([]);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    supabase
      .from('PotatoAnime')
      .select('*')
      .then(({ data, error }) => !error && setAnimes(data));
  }, []);

  const sections = [
    { key: 'newest', title: 'جدیدترین' },
    { key: 'recommended', title: 'پیشنهاد' },
    { key: 'popular', title: 'پربازدید' }
  ];

  const renderSection = key => {
    let list = [...animes];
    if (key === 'popular') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      list = list.filter(a => a.section === key);
    }
    return (
      <div className="card-grid">
        {list.map(item => (
          <div key={item.id} className="card-wrapper">
            <Link to={`/anime/${item.link}`} className="card">
              <div className="card-image-wrapper">
                <img src={item.image_url} alt={item.title} />
                <div className="card-overlay">
                  <span className="overlay-item">
                    <Eye size={16} /> {item.views || 0}
                  </span>
                  <span className="overlay-item">
                    <Film size={16} /> {item.episodes_count || 0}
                  </span>
                </div>
              </div>
              <h3>{item.title}</h3>
            </Link>
            <button
              className={
                favorites.find(f => f.id === item.id) ? 'fav-btn active' : 'fav-btn'
              }
              onClick={() => toggleFavorite(item)}
            >
              ❤️
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🍠 Potato Anime</h1>
      {sections.map(sec => (
        <section key={sec.key}>
          <h2>{sec.title}</h2>
          {renderSection(sec.key)}
        </section>
      ))}
    </div>
  );
}

// =======================
// صفحه جستجو (Search)
// =======================
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async e => {
    e.preventDefault();
    const { data } = await supabase
      .from('PotatoAnime')
      .select('*')
      .ilike('title', `%${query}%`);
    setResults(data || []);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">جستجو</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="عنوان انیمه..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>
      <div className="card-grid">
        {results.map(item => (
          <Link key={item.id} to={`/anime/${item.link}`} className="card">
            <img src={item.image_url} alt={item.title} />
            <h3>{item.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

// =======================
// صفحه علاقه‌مندی‌ها (Favorites)
// =======================
function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  return (
    <div className="app-container">
      <h1 className="app-title">علاقه‌مندی‌ها</h1>
      {favorites.length === 0 ? (
        <p>هیچ انیمه‌ای به علاقه‌مندی اضافه نشده.</p>
      ) : (
        <div className="card-grid">
          {favorites.map(item => (
            <div key={item.id} className="card-wrapper">
              <Link to={`/anime/${item.link}`} className="card">
                <img src={item.image_url} alt={item.title} />
                <h3>{item.title}</h3>
              </Link>
              <button
                className="fav-btn active"
                onClick={() => toggleFavorite(item)}
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =======================
// صفحه پروفایل (Placeholder)
// =======================
function Profile({ user }) {
  return (
    <div className="app-container">
      <h1 className="app-title">پروفایل</h1>
      <p>سلام، {user.first_name}!</p>
      <img src={user.photo_url} alt={user.username} style={{ borderRadius: 50 }} />
    </div>
  );
}

// =======================
// جزئیات انیمه (AnimeDetail)
// =======================
function AnimeDetail() {
  const { link } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [tab, setTab] = useState('info');

  useEffect(() => {
    supabase
      .from('anime')
      .select('*, genres')
      .eq('link', link)
      .single()
      .then(({ data }) => setAnime(data));

    // بعد از آنکه anime بارگذاری شد:
    if (anime && anime.id) {
      supabase
        .from('episodes')
        .select('*')
        .eq('anime_id', anime.id)
        .order('episode_number', { ascending: true })
        .then(({ data }) => setEpisodes(data));
    }
  }, [link, anime?.id]);

  if (!anime) return <p className="app-container">Loading...</p>;

  return (
    <div className="app-container anime-detail">
      <div className="detail-header">
        <img
          src={anime.image_url}
          alt={anime.title}
          className="detail-image"
        />
        <div className="detail-info">
          <h1 className="detail-title">{anime.title}</h1>
          <p className="detail-meta">
            <span>تاریخ انتشار: {anime.release_date}</span> |{' '}
            <span>امتیاز: {anime.rating}</span> |{' '}
            <span>ژانرها: {anime.genres.join(', ')}</span> |{' '}
            <span>تعداد قسمت: {episodes.length}</span>
          </p>
        </div>
      </div>
      <div className="tabs">
        <button
          className={tab === 'info' ? 'tab active' : 'tab'}
          onClick={() => setTab('info')}
        >
          مشخصات
        </button>
        <button
          className={tab === 'download' ? 'tab active' : 'tab'}
          onClick={() => setTab('download')}
        >
          دانلود
        </button>
      </div>
      {tab === 'info' && (
        <div className="info-section">
          <p className="description">{anime.description}</p>
        </div>
      )}
      {tab === 'download' && (
        <ul className="episode-list">
          {episodes.map(ep => (
            <li key={ep.id} className="episode-item">
              <span>قسمت {ep.episode_number}:</span>
              <a
                href={ep.video_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                دانلود
              </a>
            </li>
          ))}
        </ul>
      )}
      <Link to="/" className="back-link">
        ← بازگشت
      </Link>
    </div>
  );
}

// =======================
// App اصلی با روتینگ و منوی فیکس
// =======================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // پس از ورود تلگرام، ذخیره کاربر
  const handleTelegramAuth = async user => {
    const { id: telegram_id, username, first_name, last_name, photo_url } = user;
    const { data, error } = await supabase
      .from('users')
      .upsert(
        { telegram_id, username, first_name, last_name, photo_url },
        { onConflict: 'telegram_id' }
      );
    if (!error) setCurrentUser(data[0]);
  };

  return (
    <Router>
      {!currentUser ? (
        <div className="app-container">
          <h1 className="app-title">ورود با تلگرام</h1>
          <TelegramLogin onLogin={handleTelegramAuth} />
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile user={currentUser} />} />
            <Route path="/anime/:link" element={<AnimeDetail />} />
          </Routes>
          <footer className="bottom-menu">
            <Link to="/" className="menu-item">
              <HomeIcon size={20} />
              <span>خانه</span>
            </Link>
            <Link to="/search" className="menu-item">
              <SearchIcon size={20} />
              <span>جستجو</span>
            </Link>
            <Link to="/favorites" className="menu-item">
              <Heart size={20} />
              <span>علاقه‌مندی‌ها</span>
            </Link>
            <Link to="/profile" className="menu-item">
              <User size={20} />
              <span>پروفایل</span>
            </Link>
          </footer>
        </>
      )}
    </Router>
);
}
