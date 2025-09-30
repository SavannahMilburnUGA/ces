// SearchBar.js: Exports Search Bar component to search for movies by title & includes filtering movies by genre
import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onGenreFilter, genres = [] }) => {
    // Use React use state for searching & filtering 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    // Handle searching by title 
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    }; // handleSearch

    // Handle filtering by genre
    const handleGenre = (e) => {
        const value = e.target.value;
        setSelectedGenre(value);
        onGenreFilter(value);
    }; // handleGenre

    // Handle clearing search
    const clearSearch = () => {
        setSearchTerm('');
        setSelectedGenre('');
        onSearch('');
        onGenreFilter('');
    }; // clearSearch

    return (
    <div className="py-4 px-4 border-b" style={{ backgroundColor: '#0B090A', borderColor: '#B1A7A6' }}>
        <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="pl-32">
                    <h1 className="text-2xl font-bold" style={{ color: '#E5383B', fontFamily: 'var(--font-archivo)' }}>
                        FIND YOUR MOVIE. BOOK YOUR SEAT. ENJOY.
                    </h1>
                </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative">
                    <input type="text"placeholder="Search movies..."value={searchTerm} onChange={handleSearch} className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-[#B1A7A6]"
                    style={{ backgroundColor: '#161A1D', color: '#F5F3F4', borderColor: '#B1A7A6' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#E5383B'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#B1A7A6'}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" style={{ color: '#B1A7A6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                </div>
        
            <select value={selectedGenre} onChange={handleGenre} className="w-full sm:w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ backgroundColor: '#161A1D', color: '#F5F3F4', borderColor: '#B1A7A6' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#E5383B'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#B1A7A6'}
                >
                <option value="">All Genres</option>
                {genres.map((genre, index) => (<option key={index} value={genre}>{genre}</option>))}
            </select>

            {(searchTerm || selectedGenre) && (<button onClick={clearSearch} className="px-4 py-2 text-sm rounded-lg transition duration-200"
                    style={{ backgroundColor: '#BA181B', color: '#F5F3F4' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5383B'}
                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#BA181B'}
                >
                Clear
            </button>)}
                </div>
            </div>
        </div>
    </div>);};

export default SearchBar;