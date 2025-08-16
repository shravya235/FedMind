'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-purple-300">
              FedMind
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/prediction" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
              Prediction
            </Link>
            <Link href="/compare" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
              Compare Models
            </Link>
            <Link href="/metrics" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
              Metrics
            </Link>
            <Link href="/documentation" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
              Documentation
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
              <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen.toString()}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="text-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link href="/prediction" className="text-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Prediction
              </Link>
              <Link href="/compare" className="text-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Compare Models
              </Link>
              <Link href="/metrics" className="text-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Metrics
              </Link>
              <Link href="/documentation" className="text-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Documentation
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
