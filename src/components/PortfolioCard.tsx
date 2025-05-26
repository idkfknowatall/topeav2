import React, { useState } from 'react';
import { Project } from '../types';

interface PortfolioCardProps {
  project: Project;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
      style={{
        borderRadius: '1rem',
        overflow: 'hidden', // This is crucial to prevent corner artifacts
        boxShadow: isHovered
          ? '0 25px 50px -12px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.05)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        className="relative h-72"
        style={{
          overflow: 'hidden',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem'
        }}
      >
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

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-900/85 to-primary-800/60 flex flex-col justify-center items-center p-8 transition-all duration-500 backdrop-blur-sm ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-white font-display text-2xl font-bold mb-4 text-center transform transition-transform duration-500 group-hover:scale-105">
            {project.title}
          </h3>
          <span className="inline-block px-5 py-2 text-xs font-semibold text-primary-900 bg-gradient-to-r from-secondary-400 to-secondary-300 rounded-full mb-6 shadow-lg transform transition-transform duration-500 group-hover:scale-110">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
          <p className="text-white/90 text-center max-w-xs leading-relaxed transform transition-transform duration-500 delay-100 group-hover:translate-y-0">
            {project.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-secondary-400 font-medium text-sm transform transition-all duration-500 delay-200 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
            <span>View Project</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className="p-8 bg-gradient-to-b from-white to-slate-50/50"
        style={{
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)' // Subtle border instead of Tailwind class
        }}
      >
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold text-slate-800 mb-2 group-hover:text-primary-700 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 capitalize font-medium tracking-wide">
            {project.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
