import React from 'react';
import { Service } from '../types';
import { FaCheck } from './icons';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = service.icon;

  return (
    <div className="group bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:translate-y-[-8px] h-full flex flex-col relative overflow-hidden border border-slate-100 hover:border-primary-200">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16"></div>

      {/* Header Section - Icon, Title, Description */}
      <div className="flex flex-col relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 mb-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-primary-500/20">
            <Icon size={32} className="transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-center mb-4 text-slate-800 group-hover:text-primary-700 transition-colors duration-300">
          {service.title}
        </h3>

        {/* Fixed height description to ensure consistent divider line positioning */}
        <div style={{ height: '140px' }} className="flex items-start justify-center mb-6">
          <p className="text-slate-600 text-center leading-relaxed max-w-xs">
            {service.description}
          </p>
        </div>
      </div>

      {/* Pricing and Features Section - Now perfectly aligned across all cards */}
      <div className="border-t border-slate-200/60 pt-6 relative z-10">
        <div className="text-center mb-6">
          <span className="text-secondary-600 font-bold text-xl bg-gradient-to-r from-secondary-600 to-secondary-500 bg-clip-text text-transparent">
            {service.price}
          </span>
        </div>

        <ul className="space-y-3">
          {service.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start text-sm text-slate-700 group-hover:text-slate-800 transition-colors duration-300"
            >
              <span className="mr-3 text-primary-500 flex-shrink-0 w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300 mt-0.5">
                <FaCheck size={12} />
              </span>
              <span className="font-medium leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;
