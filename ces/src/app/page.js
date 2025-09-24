// page.js: Exports Home page component of CES website

// NavBar + Search Bar w/ Filter for genre ?

// Currently Running movies
// Coming Soon movies 
// Retrieves movies dynamically from database
// Hard coded show times for each movie

// Embed trailer here or on dynamic movie page

// Return Home component
"use client";
import { useState } from 'react';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';

export default function Home() {
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
  return( 
    <div className= "min-h-screen bg-green-500">
        <NavBar />
        <SearchBar onSearch={handleSearch} onGenreFilter={handleGenre} genres={genres} />
    </div>
  ); // return
} // page