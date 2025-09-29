// page.js: Exports Home page component of CES website

// NavBar + Search Bar w/ Filter for genre ?

// Currently Running movies
// Coming Soon movies 
// Retrieves movies dynamically from database
// Hard coded show times for each movie

// Embed trailer here or on dynamic movie page

// Return Home component
"use client";
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import Movie from './components/Movie';

export default function Home() {
  const [allMovies, setAllMovies] = useState([]);
  // For  Search bar function
  const [search, setSearch] = useState('');
  // For filtering by genre
  const [genre, setGenre] = useState('');
  // Testing using dummy genres
  const genres = ['A', 'B', 'C'];
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
  }; // handleSearch
  const handleGenre = (genre) => {
    setGenre(genre);
  }; // handleGenre
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true; 
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const url = `/api/movies`; 
        const res = await fetch(url);
        const data = await res.json();
       
         const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.movies) ? data.movies : [];

      if (alive) setAllMovies(arr);
      } catch (error) {
        if (alive) setError(error.message || 'Failed to fetch movies:');
      } finally {
        if (alive) setLoading(false);
      }
    }
  
    fetchMovies();
    return () => { alive = false; };
  }, []);
  
  const filteredMovies = allMovies.filter(movie => {
    const matchesTitle = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre === '' || movie.genre === genre;
    return matchesTitle && matchesGenre;
  });
  // Determing Currently Running & Coming Soon movies
  const runOrSoon = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = allMovies.filter(movie => {
      const showDate = new Date(movie.showDate);
      showDate.setHours(0, 0, 0, 0);
      return showDate <= today;
    }); // current

    const comingSoon = allMovies.filter(movie => {
      const showDate = new Date(movie.showDate);
      showDate.setHours(0, 0, 0, 0);
      return showDate > today;
    }); // comingSoon

    return { current, comingSoon };
  }; // runOrSoon

  const { current, comingSoon } = runOrSoon();

  return( 
    <div className= "min-h-screen">
        <SearchBar onSearch={handleSearch} onGenreFilter={handleGenre} genres={genres} />
      <div className="container mx-auto px-8 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-archivo)' }}>CURRENTLY RUNNING</h2>
          {current.length === 0 ? (<p className="text-gray-600 text-center py-8">No currently running movies available.</p>) : (
            <div className="overflow-x-auto">
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {current.map((movie) => (<Movie key={movie._id} movie={movie} />))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-archivo)' }}>COMING SOON</h2>
          {comingSoon.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No upcoming movies available.</p>) : (
              <div className="overflow-x-auto">
                <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                  {comingSoon.map((movie) => (<Movie key={movie._id} movie={movie} />))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  ); // return
} // page