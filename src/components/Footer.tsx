import React from 'react';
import { FaEnvelope, FaArrowUp, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const FooterWithReactIcons: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md mr-2 bg-secondary-500"></div>
              <h3 className="font-serif font-bold text-xl">Topea</h3>
            </div>
            <p className="text-slate-300 text-sm mt-1 mb-4">Web Developer & Designer based in London, working worldwide.</p>
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
            <h4 className="font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-slate-300 text-sm mb-4">Subscribe to our newsletter for the latest updates and insights.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-secondary-400 text-white text-sm w-full"
              />
              <button className="bg-secondary-500 hover:bg-secondary-600 text-primary-900 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
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

export default FooterWithReactIcons;
