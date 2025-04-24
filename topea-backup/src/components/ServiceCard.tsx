import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = service.icon;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
      <div className="flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 text-amber-500 mb-5">
          <Icon size={28} />
        </div>
      </div>
      
      <h3 className="font-serif text-xl font-bold text-center mb-3">{service.title}</h3>
      <p className="text-slate-600 text-center mb-5">{service.description}</p>
      
      <div className="border-t border-slate-200 pt-4 mt-4">
        <div className="text-center mb-4">
          <span className="text-amber-500 font-semibold">{service.price}</span>
        </div>
        <ul className="space-y-2">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-slate-700">
              <span className="mr-2 text-amber-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;