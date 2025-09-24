// SearchBar.js: Exports Search Bar component to search for movies by title 
// Could also include filtering by genre if it is not a separate component ? 
// SearchBar.js: Search component for movie titles with genre filter
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
    <div className="bg-gray-50 py-4 px-4 border-b border-gray-200">
        <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <div className="relative">
                    <input type="text"placeholder="Search movies..."value={searchTerm} onChange={handleSearch} className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                </div>
        
            <select value={selectedGenre} onChange={handleGenre} className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                >
                <option value="">All Genres</option>
                {genres.map((genre, index) => (<option key={index} value={genre}>{genre}</option>))}
            </select>

            {(searchTerm || selectedGenre) && (<button onClick={clearSearch} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                Clear
            </button>)}
            </div>
        </div>
    </div>);};

export default SearchBar;