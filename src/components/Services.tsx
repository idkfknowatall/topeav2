import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '../types';
import { FaPalette, FaCode, FaLayerGroup, FaGlobe, FaBolt } from 'react-icons/fa';

const Services: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const section = document.getElementById('services');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const services: Service[] = [
    {
      id: 1,
      title: 'UI/UX Design',
      description: 'Creating visually stunning and intuitive frontend interfaces that enhance user experience and drive engagement.',
      icon: FaPalette,
      price: 'Custom pricing',
      features: [
        'Responsive Interface Design',
        'Interactive Prototyping',
        'Mobile-First Design',
        'User Flow Optimization',
        'Design System Creation'
      ]
    },
    {
      id: 2,
      title: 'Frontend Development',
      description: 'Building beautiful, responsive, and fast-loading websites with modern frontend technologies and frameworks.',
      icon: FaCode,
      price: 'Custom pricing',
      features: [
        'Responsive Website Development',
        'Frontend Performance Optimization',
        'Interactive UI Components',
        'Cross-Browser Compatibility',
        'Mobile-Friendly Implementation'
      ]
    },
    {
      id: 3,
      title: 'Web Design Systems',
      description: 'Developing cohesive design systems that ensure consistency across your digital presence and strengthen brand identity.',
      icon: FaLayerGroup,
      price: 'Custom pricing',
      features: [
        'Component Libraries',
        'Design Tokens & Guidelines',
        'Responsive Grid Systems',
        'Typography Hierarchies',
        'Color & Style Systems'
      ]
    },
    {
      id: 4,
      title: 'SEO & Performance',
      description: 'Optimizing your website for search engines and performance to increase visibility, traffic, and user satisfaction.',
      icon: FaGlobe,
      price: 'Custom pricing',
      features: [
        'Technical SEO Implementation',
        'Performance Optimization',
        'Semantic HTML Structure',
        'Core Web Vitals Improvement',
        'Accessibility Enhancements'
      ]
    }
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-secondary-500 font-medium tracking-wide mb-3">What We Offer</h3>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Our Services</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            We specialize in creating beautiful, high-performance frontend websites with exceptional user experiences
            and strong SEO foundations to help your business stand out online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        <div className={`mt-20 text-center transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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