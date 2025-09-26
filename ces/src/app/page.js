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
  
/*
  // SAMPLE MOVIES for TESTING - DELETE 
  const sampleMovies = [
    {
      _id: '1',
      title: 'The Dark Knight',
      posterUrl: 'https://via.placeholder.com/300x450/333333/ffffff?text=The+Dark+Knight',
      rating: 'PG-13',
      genre: 'Action',
      showtimes: ['2:00 PM', '5:00 PM', '8:00 PM'],
      showDate: new Date('2024-01-15') // Past date - Currently Running
    },
    {
      _id: '2',
      title: 'Inception',
      posterUrl: 'https://via.placeholder.com/300x450/444444/ffffff?text=Inception',
      rating: 'PG-13',
      genre: 'Sci-Fi',
      showtimes: ['3:00 PM', '6:00 PM', '9:00 PM'],
      showDate: new Date('2024-01-10') // Past date - Currently Running
    },]
*/
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Currently Running</h2>
          {current.length === 0 ? (<p className="text-gray-600 text-center py-8">No currently running movies available.</p>) : (
            <div className="overflow-x-auto">
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {current.map((movie) => (<Movie key={movie._id} movie={movie} />))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Coming Soon</h2>
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