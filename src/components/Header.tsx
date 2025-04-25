import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaCode, FaPencilRuler } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        isScrolled ? 'bg-white shadow-soft py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-md mr-2 transition-all duration-300 ${
            isScrolled ? 'bg-primary-600 animate-pulse-glow' : 'bg-secondary-500 animate-pulse-glow'
          }`}>
            <FaCode className={`text-lg transition-colors duration-300 ${
              isScrolled ? 'text-white' : 'text-primary-900'
            }`} />
          </div>
          <h1 className={`font-serif font-bold text-2xl transition-colors duration-300 ${
            isScrolled ? 'text-slate-800' : 'text-white'
          }`}>
            Topea
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['home', 'portfolio', 'services', 'contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className={`capitalize font-medium text-sm tracking-wide transition-colors hover:text-primary-500 ${
                    isScrolled ? 'text-slate-700' : 'text-white'
                  }`}
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
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu fixed inset-0 bg-primary-900 bg-opacity-95 flex flex-col justify-center items-center transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}>
          <div className="absolute top-6 left-6 flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-md mr-2 bg-secondary-500 animate-pulse-glow">
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