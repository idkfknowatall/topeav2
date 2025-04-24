import React, { useState, useEffect } from 'react';
import PortfolioCard from './PortfolioCard';
import { Project } from '../types';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const section = document.getElementById('portfolio');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

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
      title: 'Mobile Banking App',
      category: 'app',
      image: '/images/portfolio-2.jpg',
      webp: '/images/portfolio-2.webp',
      srcSet: '/images/portfolio-2-1024.webp 1024w, /images/portfolio-2-640.webp 640w, /images/portfolio-2-320.webp 320w',
      description: 'A secure and user-friendly banking application with stunning UI and advanced features.'
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
      title: 'Fitness Tracker',
      category: 'app',
      image: '/images/portfolio-4.jpg',
      webp: '/images/portfolio-4.webp',
      srcSet: '/images/portfolio-4-1024.webp 1024w, /images/portfolio-4-640.webp 640w, /images/portfolio-4-320.webp 320w',
      description: 'A health and fitness tracking application with workout plans and progress visualization.'
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
    <section id="portfolio" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-secondary-500 font-medium tracking-wide mb-3">Our Work</h3>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Featured Projects</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            Explore our portfolio of successful projects that have helped businesses achieve their digital goals.
          </p>
        </div>

        <div className={`flex justify-center mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  filter === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-soft'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <PortfolioCard project={project} />
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-slate-600 mb-6 text-lg">
            Looking for more examples of our work? We have many more projects to share.
          </p>
          <button
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            View Full Portfolio
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
