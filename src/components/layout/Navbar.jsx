import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logos/joltcab-icon.png" 
              alt="JoltCab" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-black">JoltCab</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-700 hover:text-black transition-colors">
              Services
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-black transition-colors">
              About
            </Link>
            <Link to="/safety" className="text-gray-700 hover:text-black transition-colors">
              Safety
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-black transition-colors">
              Log in
            </Link>
            <Link 
              to="/register" 
              className="bg-joltcab-400 text-black px-6 py-2 rounded-lg hover:bg-joltcab-500 transition-colors font-semibold"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/services" className="text-gray-700 hover:text-black transition-colors">
                Services
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-black transition-colors">
                About
              </Link>
              <Link to="/safety" className="text-gray-700 hover:text-black transition-colors">
                Safety
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-black transition-colors">
                Log in
              </Link>
              <Link 
                to="/register" 
                className="bg-joltcab-400 text-black px-6 py-2 rounded-lg hover:bg-joltcab-500 transition-colors text-center font-semibold"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
