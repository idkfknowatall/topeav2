import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaArrowUp, FaInstagram } from './icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <p className="text-slate-300 text-sm mb-4">Web Developer & Designer based in London, working worldwide.</p>
            <a
              href="mailto:contact@topea.me"
              className="inline-flex items-center text-secondary-400 hover:text-secondary-300 transition-colors text-sm"
            >
              <FaEnvelope size={16} className="mr-2" />
              contact@topea.me
            </a>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-300 hover:text-secondary-400 transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-300 hover:text-secondary-400 transition-colors text-sm"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-300 hover:text-secondary-400 transition-colors text-sm"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-300 hover:text-secondary-400 transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-secondary-400 transition-colors text-sm">
                  UI/UX Design
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-secondary-400 transition-colors text-sm">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-secondary-400 transition-colors text-sm">
                  Branding & Identity
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-secondary-400 transition-colors text-sm">
                  Digital Marketing
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Follow Us</h4>
            <p className="text-slate-300 text-sm mb-6">Check out our Instagram for design inspiration and behind-the-scenes content.</p>

            <a
              href="https://www.instagram.com/topea1/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`
                relative overflow-hidden rounded-xl
                bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400
                p-6 shadow-lg transform transition-all duration-500
                ${isHovered ? 'scale-105 shadow-xl' : ''}
                ${isAnimating ? 'animate-pulse' : ''}
              `}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white opacity-10 rounded-full"></div>

                <div className="relative z-10 flex items-center">
                  <div className={`
                    mr-4 bg-white bg-opacity-20 rounded-full p-4
                    transform transition-all duration-500
                    ${isHovered ? 'rotate-12 scale-110' : ''}
                  `}>
                    <FaInstagram size={28} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-lg mb-1">@topea1</h5>
                    <p className="text-white text-opacity-80 text-sm">Follow our creative journey</p>
                  </div>
                </div>

                <div className={`
                  mt-4 bg-white bg-opacity-10 rounded-lg px-4 py-2
                  transform transition-all duration-500 origin-left
                  ${isHovered ? 'scale-x-105' : ''}
                `}>
                  <span className="text-white text-sm font-medium">View Profile</span>
                  <span className={`
                    ml-2 inline-block transform transition-transform duration-500
                    ${isHovered ? 'translate-x-2' : ''}
                  `}>→</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Topea. All rights reserved.
          </p>

          <div className="flex items-center">
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-primary-800 hover:bg-secondary-500 hover:text-primary-900 text-white transition-all flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <FaArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
