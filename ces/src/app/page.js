
"use client";
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import Movie from './components/Movie';

export default function Home() {
  const [allMovies, setAllMovies] = useState([]);
  // For Search bar function
  const [search, setSearch] = useState('');
  // For filtering by genre
  const [genre, setGenre] = useState('');
  // Get genres from all movies in database 
  const genres = [...new Set(allMovies.map(movie => movie.genre))].filter(Boolean).sort();
  // Handle search from user input in search bar
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
  }; // handleSearch
  // Handle filtering by genre from user input in dropdown genre filter
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
       
      let arr = [];

    if (Array.isArray(data)) {
      arr = data;
    } else if (Array.isArray(data?.movies)) {
      arr = data.movies;
    } else if (typeof data === "object" && data !== null) {
   
      arr = Object.values(data);
    }

    if (alive) setAllMovies(arr);
      } catch (error) {
        if (alive) setError(error.message || 'Failed to fetch movies:');
      } finally {
        if (alive) setLoading(false);
      }
    } // fetchMovies
  
    fetchMovies();
    return () => { alive = false; };
  }, []); // useEffect
  
  const filteredMovies = allMovies.filter(movie => {
    const matchesTitle = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre === '' || movie.genre === genre;
    return matchesTitle && matchesGenre;
  }); // filteredMovies
  
  // Determing Currently Running & Coming Soon movies
  const runOrSoon = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = filteredMovies.filter(movie => {
      const showDate = new Date(movie.showDate);
      showDate.setHours(0, 0, 0, 0);
      return showDate <= today;
    }); // current

    const comingSoon = filteredMovies.filter(movie => {
      const showDate = new Date(movie.showDate);
      showDate.setHours(0, 0, 0, 0);
      return showDate > today;
    }); // comingSoon

    return { current, comingSoon };
  }; // runOrSoon

  const { current, comingSoon } = runOrSoon();

  // Display loading message while waiting for movies to render & load 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl" style={{ color: '#FFFFFF' }}>Loading movies...</p>
      </div>
    ); // return
  } // if 

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