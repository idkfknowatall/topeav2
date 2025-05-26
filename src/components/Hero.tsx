import React, { useEffect, useRef } from 'react';
import { FaChevronDown } from './icons';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay adding the parallax effect until after initial render
    let timeoutId: number;

    const handleParallax = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const parallaxBg = heroRef.current.querySelector('.parallax-bg') as HTMLElement;
        if (parallaxBg) {
          // Use requestAnimationFrame for smoother performance
          requestAnimationFrame(() => {
            parallaxBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
          });
        }
      }
    };

    // Delay adding scroll listener to not interfere with initial render
    timeoutId = window.setTimeout(() => {
      window.addEventListener('scroll', handleParallax, { passive: true });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleParallax);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden"
      role="region"
      aria-label="Hero section"
    >
      <picture>
        <source
          srcSet="/images/hero-bg-2048.webp 2048w, /images/hero-bg-1536.webp 1536w, /images/hero-bg-1024.webp 1024w, /images/hero-bg-768.webp 768w"
          type="image/webp"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 100vw, 100vw"
          fetchpriority="high"
        />
        <img
          src="/images/hero-bg.jpg"
          alt="Hero background"
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-15 parallax-bg"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          width="2048"
          height="1365"
          style={{ contentVisibility: 'auto' }}
        />
      </picture>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-primary-900/60 to-primary-950/90"></div>

      <div className="container mx-auto px-6 md:px-8 z-10 text-center md:text-left pt-20 md:pt-0">
        <div className="max-w-5xl mx-auto md:mx-0">
          <h2 className="text-secondary-400 font-medium text-xs sm:text-sm md:text-base mb-3 md:mb-4 tracking-widest uppercase font-sans">Web Developer & Designer</h2>
          <h1 className="font-display text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">
            Transforming <span className="text-secondary-400 relative">
              Ideas
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-secondary-400/30 rounded-full"></span>
            </span>
            <br />
            Into Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-300">Reality</span>
          </h1>
          <p
            className="text-slate-200 text-lg sm:text-xl md:text-2xl max-w-2xl mb-8 md:mb-12 leading-relaxed font-light px-4 sm:px-0"
            data-lcp="true"
            id="hero-description"
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '0 100px',
              display: 'block',
            }}
          >
            We create exceptional digital experiences that elevate brands and drive business growth through innovative design and development.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start mb-16 sm:mb-20 md:mb-0">
            <button
              onClick={scrollToPortfolio}
              className="group px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-600 hover:to-secondary-500 text-slate-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-secondary-500/25 focus:outline-none focus:ring-4 focus:ring-secondary-500/50 focus:scale-105 relative overflow-hidden"
              aria-label="View our work"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                View Our Work
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-6 sm:px-8 md:px-10 py-4 sm:py-5 border-2 border-white/80 hover:border-secondary-400 hover:bg-secondary-400/10 text-white hover:text-secondary-400 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/30 focus:scale-105"
              aria-label="Let's talk"
            >
              <span className="flex items-center gap-2 text-sm sm:text-base">
                Let's Talk
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll arrow - enhanced design with proper mobile positioning */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 w-full flex justify-center z-20">
        <button
          onClick={scrollToPortfolio}
          className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white/60 hover:text-secondary-400 hover:border-secondary-400/60 hover:bg-secondary-400/10 transition-all duration-300 transform hover:scale-110 animate-bounce hover:animate-none focus:outline-none focus:ring-4 focus:ring-white/20"
          aria-label="Scroll down"
        >
          <FaChevronDown
            size={20}
            className="sm:text-xl md:text-2xl transition-transform duration-300 group-hover:translate-y-1"
          />
        </button>
      </div>
    </section>
  );
};

export default Hero;
