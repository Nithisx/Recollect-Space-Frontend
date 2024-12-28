import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-100 w-full shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Memory Keeper
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-lg">
            <Link
              to="/"
              className={`relative px-3 py-2 transition-colors duration-300 ${
                location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span>Home</span>
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ease-out ${
                  location.pathname === '/' ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </Link>
            <Link
              to="/myfiles"
              className={`relative px-3 py-2 transition-colors duration-300 ${
                location.pathname === '/myfiles' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span>My Files</span>
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ease-out ${
                  location.pathname === '/myfiles' ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </Link>
            <Link
              to="/aboutus"
              className={`relative px-3 py-2 transition-colors duration-300 ${
                location.pathname === '/aboutus' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span>About Us</span>
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ease-out ${
                  location.pathname === '/aboutus' ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </Link>
          </nav>

          {/* Profile Link */}
          <div className="hidden md:block">
            <Link 
              to="/auth" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50 transform hover:scale-105"
            >
              <User size={40} className="text-gray-600" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <svg
                className="h-6 w-6"
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
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-2 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg transition-colors duration-300 ${
                location.pathname === '/' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/myfiles"
              className={`block px-3 py-2 rounded-lg transition-colors duration-300 ${
                location.pathname === '/myfiles' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              My Files
            </Link>
            <Link
              to="/aboutus"
              className={`block px-3 py-2 rounded-lg transition-colors duration-300 ${
                location.pathname === '/aboutus' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300"
            >
              <User size={24} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;