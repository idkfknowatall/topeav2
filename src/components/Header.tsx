import React, { useState } from 'react';
import { FaBars, FaTimes, FaCode, FaPencilRuler } from './icons';
import { useHeaderScroll } from '../hooks/useThrottledScroll';

const Header: React.FC = () => {
  const { isScrolled } = useHeaderScroll(10);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-soft py-2 sm:py-3' : 'bg-transparent py-3 sm:py-4 md:py-5'
      }`}
      role="banner"
      aria-label="Primary"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md mr-2 transition-all duration-300 ${
              isScrolled ? 'bg-primary-600 animate-pulse-glow' : 'bg-secondary-500 animate-pulse-glow'
            }`}
            aria-hidden="true"
          >
            <FaCode
              className={`text-sm sm:text-base md:text-lg transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-primary-900'
              }`}
            />
          </div>
          <h1
            className={`font-display font-bold text-lg sm:text-xl md:text-2xl transition-colors duration-300 tracking-tight ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}
          >
            Topea
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block" role="navigation" aria-label="Primary navigation">
          <ul className="flex space-x-10">
            {['home', 'portfolio', 'services', 'contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className={`capitalize font-medium text-sm tracking-wider transition-all duration-300 hover:text-primary-500 hover:scale-105 ${
                    isScrolled ? 'text-slate-700' : 'text-white'
                  }`}
                  aria-label={`Scroll to ${item} section`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden z-50 transition-colors ${
            isMenuOpen ? 'text-white' : isScrolled ? 'text-slate-800' : 'text-white'
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`mobile-menu fixed inset-0 bg-primary-900 bg-opacity-95 flex flex-col justify-center items-center transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          } md:hidden`}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="absolute top-6 left-6 flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-md mr-2 bg-secondary-500 animate-pulse-glow" aria-hidden="true">
              <FaCode className="text-lg text-primary-900" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-white">Topea</h1>
          </div>
          <nav>
            <ul className="flex flex-col space-y-8 text-center">
              {['home', 'portfolio', 'services', 'contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className="text-white text-xl font-medium capitalize tracking-wide hover:text-secondary-400 transition-colors"
                    role="menuitem"
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
