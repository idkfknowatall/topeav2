import React from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '../types';
import { FaPalette, FaCode, FaLayerGroup, FaGlobe, FaBolt } from './icons';
import { useScrollAnimation } from '../hooks/useIntersectionObserver';

const Services: React.FC = () => {
  const { isVisible, elementRef } = useScrollAnimation(0.1);

  const services: Service[] = [
    {
      id: 1,
      title: 'UI/UX Design',
      description:
        'Creating visually stunning and intuitive frontend interfaces that enhance user experience and drive engagement.',
      icon: FaPalette,
      price: 'Custom pricing',
      features: [
        'Responsive Interface Design',
        'Interactive Prototyping',
        'Mobile-First Design',
        'User Flow Optimization',
        'Design System Creation',
      ],
    },
    {
      id: 2,
      title: 'Frontend Development',
      description:
        'Building beautiful, responsive, and fast-loading websites with modern frontend technologies and frameworks.',
      icon: FaCode,
      price: 'Custom pricing',
      features: [
        'Responsive Website Development',
        'Frontend Performance Optimization',
        'Interactive UI Components',
        'Cross-Browser Compatibility',
        'Mobile-Friendly Implementation',
      ],
    },
    {
      id: 3,
      title: 'Web Design Systems',
      description:
        'Developing cohesive design systems that ensure consistency across your digital presence and strengthen brand identity.',
      icon: FaLayerGroup,
      price: 'Custom pricing',
      features: [
        'Component Libraries',
        'Design Tokens & Guidelines',
        'Responsive Grid Systems',
        'Typography Hierarchies',
        'Color & Style Systems',
      ],
    },
    {
      id: 4,
      title: 'SEO & Performance',
      description:
        'Optimizing your website for search engines and performance to increase visibility, traffic, and user satisfaction.',
      icon: FaGlobe,
      price: 'Custom pricing',
      features: [
        'Technical SEO Implementation',
        'Performance Optimization',
        'Semantic HTML Structure',
        'Core Web Vitals Improvement',
        'Accessibility Enhancements',
      ],
    },
  ];

  return (
    <section
      id="services"
      ref={elementRef}
      className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white relative"
      role="region"
      aria-label="Services section"
    >
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div
          className={`text-center mb-20 md:mb-24 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-secondary-500 font-semibold tracking-widest uppercase text-sm mb-4">What We Offer</h3>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Services</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-secondary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="mt-8 text-slate-600 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            We specialize in creating beautiful, high-performance frontend websites with exceptional user experiences and strong SEO foundations to help your business stand out online.
          </p>
        </div>

        {/* Improved grid layout with better alignment and consistent heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-8 items-stretch">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`transition-all duration-700 flex ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        <div
          className={`mt-20 text-center transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-10 md:p-16 max-w-5xl mx-auto shadow-elevated">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-500 text-primary-900">
                <FaBolt size={32} />
              </div>
            </div>
            <h3 className="text-white font-serif text-2xl md:text-3xl font-bold mb-4">Need a Custom Website Design?</h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
              Our team can create a tailored frontend design solution that perfectly matches your brand and business goals while ensuring optimal performance and SEO.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium rounded-lg transition-all transform hover:scale-105 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-opacity-50"
              aria-label="Get custom quote"
            >
              Get Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
