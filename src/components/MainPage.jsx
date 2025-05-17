import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AnimeCard from './AnimeCard';

export default function MainPage() {
  const [newestAnime, setNewestAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [mostViewedAnime, setMostViewedAnime] = useState([]);
  const RECOMMENDATION_SECTION = 'godpotato';

  useEffect(() => {
    supabase
      .from('Potatoanime')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(9)
      .then(({ data, error }) => !error && setNewestAnime(data));

    supabase
      .from('Potatoanime')
      .select('*')
      .eq('section', RECOMMENDATION_SECTION)
      .limit(9)
      .then(({ data, error }) => !error && setRecommendedAnime(data));

    supabase
      .from('Potatoanime')
      .select('*')
      .order('views', { ascending: false })
      .limit(9)
      .then(({ data, error }) => !error && setMostViewedAnime(data));
  }, []);

  const renderSection = (title, list) => (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(anime => (
          <AnimeCard
            key={anime.id}
            title={anime.title}
            description={anime.description}
            link={anime.link}
            image={anime.image_url}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <h1 className="text-3xl font-bold text-gray-900">Anime Explorer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {renderSection('📢 جدیدترین انیمه‌ها', newestAnime)}
        {renderSection('✨ پیشنهادات خدای سیب‌زمینی', recommendedAnime)}
        {renderSection('🔥 انیمه‌های پربازدید', mostViewedAnime)}
      </main>

      <footer className="mt-12 bg-white shadow-inner">
        <div className="max-w-7xl mx-auto py-4 px-6 text-center text-gray-500 text-sm">
          © 2025 Anime Explorer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
