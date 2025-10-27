// NavBar.js: Exports Navigation Bar component to efficiently navigate across each page 
"use client";
import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
  return (
    <nav style={{ backgroundColor:'#0B090A'}} className="shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt = "CES logo" width={60} height={60} className="object-contain"/>
            <Link href="/" className="text-2xl font-bold hover:opacity-90 transition" style={{ fontFamily: 'var(--font-archivo)' }}>
              CES
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                href="/" className="transition duration-200" style={{ color: '#D3D3D3' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#E5383B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#D3D3D3'}
              >
                Home
              </Link>
              <Link 
                href="/movies" className="transition duration-200" style={{ color: '#D3D3D3' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#E5383B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#D3D3D3'}
              >
                All Movies
              </Link>
              <Link 
                href="/showtimes" className="transition duration-200" style={{ color: '#D3D3D3' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#E5383B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#D3D3D3'}
              >
                By Showtimes
              </Link>
               <Link 
                href="/admin/addMovie" className="transition duration-200" style={{ color: '#D3D3D3' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#E5383B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#D3D3D3'}
              >
                Admin
              </Link>

              <Link 
                href="/login"
                className="transition duration-200 border border-[#E5383B] px-4 py-1 rounded-md"
                style={{ color: '#E5383B' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5383B';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#E5383B';
                }}
              >
                Login
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
              href="/movies" style = {{color: '#D3D3D3'}}
              className="block px-3 py-2 text-base font-medium hover:text-[#E5383B] transition"
            >
              All Movies
            </Link>
            <Link 
              href="/showtimes" style = {{color: '#D3D3D3'}}
              className="block px-3 py-2 text-base font-medium hover:text-[#E5383B] transition"
            >
              By Showtimes
            </Link>
            <Link 
                href="/admin/addMovie" style = {{color: '#D3D3D3'}}
                className="block px-3 py-2 text-base font-medium hover:text-[#E5383B] transition"
                >
                Admin
              </Link>
            <Link 
              href="/about" style = {{color: '#D3D3D3'}}
              className="block px-3 py-2 text-base font-medium hover:text-[#E5383B] transition"
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