import React from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '../types';
import { Palette, Code, Layout, Globe } from 'lucide-react';

const Services: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      title: 'UI/UX Design',
      description: 'Crafting intuitive user experiences with beautiful interfaces that engage and delight your audience.',
      icon: Palette,
      price: 'From $2,000',
      features: [
        'User Research & Personas',
        'Wireframing & Prototyping',
        'Interface Design',
        'Usability Testing'
      ]
    },
    {
      id: 2,
      title: 'Web Development',
      description: 'Building fast, responsive, and scalable websites with modern technologies and best practices.',
      icon: Code,
      price: 'From $3,500',
      features: [
        'Custom Website Development',
        'E-commerce Solutions',
        'CMS Integration',
        'Web Applications'
      ]
    },
    {
      id: 3,
      title: 'Branding & Identity',
      description: 'Creating distinctive brand identities that capture your essence and connect with your target audience.',
      icon: Layout,
      price: 'From $1,800',
      features: [
        'Logo Design',
        'Brand Guidelines',
        'Visual Identity',
        'Marketing Materials'
      ]
    },
    {
      id: 4,
      title: 'SEO & Marketing',
      description: 'Optimizing your digital presence to increase visibility, attract more visitors, and convert leads.',
      icon: Globe,
      price: 'From $1,200',
      features: [
        'SEO Optimization',
        'Content Strategy',
        'Analytics & Reporting',
        'Marketing Automation'
      ]
    }
  ];

  return (
    <section id="services" className="py-20 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-amber-500 font-medium tracking-wide mb-2">What I Offer</h3>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">My Services</h2>
          <div className="w-24 h-1 bg-slate-800 mx-auto"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
            I provide comprehensive design and development solutions tailored to your business needs,
            helping you stand out in today's competitive digital landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">
            Need a custom solution for your project? Let's discuss your specific requirements.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
          >
            Get Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;