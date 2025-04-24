import React, { useState } from 'react';
import { Project } from '../types';

interface PortfolioCardProps {
  project: Project;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl shadow-soft bg-white transition-all duration-300 hover:shadow-elevated"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-72 overflow-hidden">
        <picture>
          <source
            srcSet={project.srcSet}
            type="image/webp"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div
          className={`absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-primary-900/60 flex flex-col justify-center items-center p-8 transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-white font-serif text-2xl font-bold mb-3">{project.title}</h3>
          <span className="inline-block px-4 py-1 text-xs font-medium text-primary-900 bg-secondary-400 rounded-full mb-4">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
          <p className="text-white text-center max-w-xs">{project.description}</p>
        </div>
      </div>
      <div className="p-6 border-t border-slate-100">
        <div className="text-center">
          <h3 className="font-serif text-xl font-semibold text-slate-800">{project.title}</h3>
          <p className="text-sm text-slate-500 capitalize mt-1">{project.category}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
