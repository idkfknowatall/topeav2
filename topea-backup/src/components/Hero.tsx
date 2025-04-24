import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800 text-white"
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7135121/pexels-photo-7135121.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 z-10 text-center md:text-left">
        <div className="max-w-3xl mx-auto md:mx-0">
          <h2 className="text-amber-500 font-medium text-lg md:text-xl mb-2 tracking-wide">Web Developer & Designer</h2>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Crafting Digital<br />Experiences
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            I design and build beautiful websites that help businesses grow and make their customers happy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={scrollToPortfolio}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              View My Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border-2 border-white hover:border-amber-500 hover:text-amber-500 font-medium rounded-lg transition-all"
            >
              Let's Talk
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToPortfolio}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white transition-all"
          aria-label="Scroll down"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;