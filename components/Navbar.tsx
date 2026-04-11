'use client';

import Link from 'next/link';
import { Hexagon, Search, Scan, Aperture } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start px-6 py-6 pointer-events-none">
      {/* Left Section */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <Link href="/" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5 hover:scale-105 transition-transform">
          <Hexagon size={24} className="fill-black text-black" />
        </Link>
        <div className="h-12 bg-white rounded-full flex items-center px-2 shadow-sm border border-black/5">
          <Link href="#explore" className="px-4 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Explore
          </Link>
          <Link href="#careers" className="px-4 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Careers
          </Link>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex items-center h-12 bg-white rounded-full shadow-sm border border-black/5 w-[480px] px-4 pointer-events-auto">
        <Search size={18} className="text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search Cosmos..." 
          className="flex-1 bg-transparent outline-none text-sm text-black placeholder:text-gray-400"
        />
        <div className="flex items-center gap-3 text-gray-400">
          <Scan size={18} className="hover:text-black cursor-pointer transition-colors" />
          <Aperture size={18} className="hover:text-black cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 pointer-events-auto">
        {user ? (
          <>
            <Link href="/profile" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Profile
            </Link>
            <button onClick={logout} className="h-12 px-6 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors shadow-sm">
              Log out
            </button>
          </>
        ) : (
          <>
            <button onClick={login} className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Login
            </button>
            <Link href="/book" className="h-12 px-6 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors shadow-sm">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
