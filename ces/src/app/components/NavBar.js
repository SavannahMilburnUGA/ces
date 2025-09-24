// NavBar.js: Exports Navigation Bar component to efficiently navigate across each page 
"use client";
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-red-500 hover:text-red-400 transition">
              CES
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="hover:text-red-400 transition duration-200"
              >
                Home
              </Link>
              <Link 
                href="/movies" 
                className="hover:text-red-400 transition duration-200"
              >
                All Movies
              </Link>
              <Link 
                href="/showtimes" 
                className="hover:text-red-400 transition duration-200"
              >
                By Showtimes
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/movies" 
              className="block px-3 py-2 text-base font-medium hover:text-red-400 transition"
            >
              All Movies
            </Link>
            <Link 
              href="/showtimes" 
              className="block px-3 py-2 text-base font-medium hover:text-red-400 transition"
            >
              By Showtimes
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-base font-medium hover:text-red-400 transition"
            >
               By Genre
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;