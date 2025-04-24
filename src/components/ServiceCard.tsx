import React from 'react';
import { Service } from '../types';
import { FaCheck } from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = service.icon;

  return (
    <div className="bg-white rounded-xl shadow-soft p-8 transition-all duration-300 hover:shadow-elevated hover:translate-y-[-5px] h-full flex flex-col">
      <div className="flex flex-col h-[280px]">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-2">
            <Icon size={28} />
          </div>
        </div>

        <h3 className="font-serif text-xl font-bold text-center mb-3 text-slate-800">{service.title}</h3>
        <p className="text-slate-600 text-center mb-6">{service.description}</p>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <div className="text-center mb-5">
          <span className="text-secondary-600 font-semibold text-lg">{service.price}</span>
        </div>
        <ul className="space-y-3">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-slate-700">
              <span className="mr-2 text-primary-500 flex-shrink-0">
                <FaCheck size={16} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default ServiceCard;
