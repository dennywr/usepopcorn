import { useEffect } from 'react';
import { useState } from 'react';
import StarRating from './components/StarRating';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = 'c9e9cd73';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [movieId, setMovieId] = useState(null);

  const tempQuery = '';

  function handleClickMovie(id) {
    setMovieId((movieId) => (id === movieId ? null : id));
  }

  function handleCloseMovie() {
    setMovieId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
      handleCloseMovie();
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onClickMovie={handleClickMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {movieId ? (
            <MovieDetail selectedId={movieId} onCloseMovie={handleCloseMovie} watched={watched} onAddWatched={handleAddWatched} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>⛔</span>
      {message}
    </div>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onClickMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onClickMovie={onClickMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onClickMovie }) {
  return (
    <li onClick={() => onClickMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetail({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { Title: title, Poster: poster, Plot: plot, Year: year, Runtime: runtime, imdbRating, Released: released, Actors: actors, Director: director, Genre: genre } = movie;

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  function handleAdd() {
    const newWatchMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating,
      runtime: Number(runtime.split(' ').at(0)),
      userRating: userRating,
    };

    onAddWatched(newWatchMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === 'Escape') {
          onCloseMovie();
          console.log('close');
        }
      }
      document.addEventListener('keydown', callback);
      return function () {
        document.removeEventListener('keydown', callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovie() {
        setIsLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovie();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = 'usePopcorn';
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched ? (
                <p>You rated with movie {watchedUserRating}</p>
              ) : (
                <>
                  <StarRating maxRating={10} color="yellow" onSetRating={setUserRating} size={21} />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add Watch
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDeleteWatched={onDeleteWatched} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
