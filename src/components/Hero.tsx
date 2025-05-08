import React, { useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

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
      className="relative h-screen flex items-center justify-center bg-gradient-to-r from-primary-900 to-primary-800 text-white overflow-hidden"
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

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-primary-900/50 to-primary-900/80"></div>

      <div className="container mx-auto px-4 md:px-6 z-10 text-center md:text-left">
        <div className="max-w-3xl mx-auto md:mx-0">
          <h2 className="text-secondary-400 font-medium text-lg md:text-xl mb-3 tracking-wide">Web Developer & Designer</h2>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            Transforming <span className="text-secondary-400">Ideas</span>
            <br />
            Into Digital Reality
          </h1>
          <p
            className="text-slate-200 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
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

          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
            <button
              onClick={scrollToPortfolio}
              className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-slate-900 font-medium rounded-lg transition-all transform hover:scale-105 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
              aria-label="View our work"
            >
              View Our Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white hover:border-secondary-400 hover:text-secondary-400 font-medium rounded-lg transition-all hover:shadow-soft"
              aria-label="Let's talk"
            >
              Let's Talk
            </button>
          </div>
        </div>
      </div>

      {/* Scroll arrow - improved mobile alignment */}
      <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
        <button
          onClick={scrollToPortfolio}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-secondary-400 hover:text-secondary-400 transition-all"
          aria-label="Scroll down"
        >
          <FaChevronDown size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
