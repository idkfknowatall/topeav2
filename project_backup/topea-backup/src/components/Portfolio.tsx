import React, { useState } from 'react';
import PortfolioCard from './PortfolioCard';
import { Project } from '../types';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const projects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Redesign',
      category: 'web',
      image: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260',
      description: 'A complete redesign of an e-commerce platform with improved UX and conversion rate optimization.'
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'app',
      image: 'https://images.pexels.com/photos/3471423/pexels-photo-3471423.jpeg?auto=compress&cs=tinysrgb&w=1260',
      description: 'A secure and user-friendly banking application with stunning UI and advanced features.'
    },
    {
      id: 3,
      title: 'Restaurant Website',
      category: 'web',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260',
      description: 'An elegant website design for a high-end restaurant with online reservation system.'
    },
    {
      id: 4,
      title: 'Fitness Tracker',
      category: 'app',
      image: 'https://images.pexels.com/photos/5386754/pexels-photo-5386754.jpeg?auto=compress&cs=tinysrgb&w=1260',
      description: 'A health and fitness tracking application with workout plans and progress visualization.'
    },
    {
      id: 5,
      title: 'Corporate Identity',
      category: 'branding',
      image: 'https://images.pexels.com/photos/5792908/pexels-photo-5792908.jpeg?auto=compress&cs=tinysrgb&w=1260',
      description: 'Complete brand identity design for a tech startup including logo, stationery, and guidelines.'
    },
    {
      id: 6,
      title: 'Photography Portfolio',
      category: 'web',
      image: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1260',
      description: 'A minimalist portfolio website for a professional photographer with gallery layout.'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);
    
  const categories = ['all', ...new Set(projects.map(project => project.category))];

  return (
    <section id="portfolio" className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-amber-500 font-medium tracking-wide mb-2">My Work</h3>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-slate-800 mx-auto"></div>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === category 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;