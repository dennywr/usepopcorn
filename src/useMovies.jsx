import { useState, useEffect } from 'react';

const KEY = 'c9e9cd73';

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovie() {
        try {
          setIsLoading(true);
          setError('');

          const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });
          if (!res.ok) throw new Error('Failed to fetch data');

          const data = await res.json();
          if (data.Response === 'False') throw new Error('Movie of your input query is undefined!');

          setMovies(data.Search);
          console.log(data.Search);
          setError('');
        } catch (err) {
          console.error(err.message);
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }
      // handleCloseMovie();
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoading };
}
