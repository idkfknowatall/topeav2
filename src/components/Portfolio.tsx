import React, { useState } from 'react';
import PortfolioCard from './PortfolioCard';
import { Project } from '../types';
import { useScrollAnimation } from '../hooks/useIntersectionObserver';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const { isVisible, elementRef } = useScrollAnimation(0.1);

  const projects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Redesign',
      category: 'web',
      image: '/images/portfolio-1.jpg',
      webp: '/images/portfolio-1.webp',
      srcSet: '/images/portfolio-1-2048.webp 2048w, /images/portfolio-1-1024.webp 1024w, /images/portfolio-1-640.webp 640w, /images/portfolio-1-320.webp 320w',
      description: 'A complete redesign of an e-commerce platform with improved UX and conversion rate optimization.'
    },
    {
      id: 2,
      title: 'Mobile Banking Website',
      category: 'web',
      image: '/images/portfolio-2.jpg',
      webp: '/images/portfolio-2.webp',
      srcSet: '/images/portfolio-2-1024.webp 1024w, /images/portfolio-2-640.webp 640w, /images/portfolio-2-320.webp 320w',
      description: 'A secure and user-friendly mobile-friendly banking website with stunning UI and advanced features.'
    },
    {
      id: 3,
      title: 'Restaurant Website',
      category: 'web',
      image: '/images/portfolio-3.jpg',
      webp: '/images/portfolio-3.webp',
      srcSet: '/images/portfolio-3-1024.webp 1024w, /images/portfolio-3-640.webp 640w, /images/portfolio-3-320.webp 320w',
      description: 'An elegant website design for a high-end restaurant with online reservation system.'
    },
    {
      id: 4,
      title: 'Fitness Tracker Website',
      category: 'web',
      image: '/images/portfolio-4.jpg',
      webp: '/images/portfolio-4.webp',
      srcSet: '/images/portfolio-4-1024.webp 1024w, /images/portfolio-4-640.webp 640w, /images/portfolio-4-320.webp 320w',
      description: 'A responsive health and fitness tracking website with workout plans and progress visualization.'
    },
    {
      id: 5,
      title: 'Corporate Identity',
      category: 'branding',
      image: '/images/portfolio-5.jpg',
      webp: '/images/portfolio-5.webp',
      srcSet: '/images/portfolio-5-1024.webp 1024w, /images/portfolio-5-640.webp 640w, /images/portfolio-5-320.webp 320w',
      description: 'Complete brand identity design for a tech startup including logo, stationery, and guidelines.'
    },
    {
      id: 6,
      title: 'Photography Portfolio',
      category: 'web',
      image: '/images/portfolio-6.jpg',
      webp: '/images/portfolio-6.webp',
      srcSet: '/images/portfolio-6-1024.webp 1024w, /images/portfolio-6-640.webp 640w, /images/portfolio-6-320.webp 320w',
      description: 'A minimalist portfolio website for a professional photographer with gallery layout.'
    }
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter);

  const categories = ['all', ...new Set(projects.map(project => project.category))];

  return (
    <section
      id="portfolio"
      ref={elementRef}
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className={`text-center mb-20 md:mb-24 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-secondary-500 font-semibold tracking-widest uppercase text-sm mb-4">Our Work</h3>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">Featured Projects</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary-600 to-secondary-500 mx-auto rounded-full"></div>
          <p className="mt-8 text-slate-600 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Explore our portfolio of successful projects that have helped businesses achieve their digital goals through innovative design and development.
          </p>
        </div>

        <div className={`flex justify-center mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                  filter === category
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/25 border-2 border-primary-500'
                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-200/50 border-2 border-slate-200 hover:border-primary-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`transition-all duration-700 rounded-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${200 + index * 100}ms`,
                borderRadius: '1rem', // Ensure wrapper doesn't interfere with card corners
                overflow: 'hidden' // Prevent any content from bleeding outside rounded corners
              }}
            >
              <PortfolioCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
