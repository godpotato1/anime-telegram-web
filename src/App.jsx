import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    supabase
      .from('anime')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setAnimeList(data);
      });
  }, []);

  return (
    <div>
      <h1>📺 لیست انیمه‌ها</h1>
      <ul>
        {animeList.map((anime) => (
          <li key={anime.id}>
            <h3>{anime.title}</h3>
            <p>{anime.description}</p>
            <a href={anime.link} target="_blank">مشاهده</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
