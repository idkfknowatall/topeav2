import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface PortfolioCardProps {
  project: Project;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        <div 
          className={`absolute inset-0 bg-slate-900 bg-opacity-70 flex flex-col justify-center items-center p-6 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-white font-serif text-xl font-bold mb-2">{project.title}</h3>
          <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-amber-500 rounded-full mb-4">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
          <p className="text-slate-200 text-center mb-4">{project.description}</p>
          <button 
            className="inline-flex items-center px-4 py-2 border border-white text-white text-sm rounded hover:bg-white hover:text-slate-900 transition-colors"
          >
            View Case Study <ExternalLink size={14} className="ml-1" />
          </button>
        </div>
      </div>
      <div className="p-5 border-t">
        <h3 className="font-serif text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-slate-500 capitalize">{project.category}</p>
      </div>
    </div>
  );
};

export default PortfolioCard;