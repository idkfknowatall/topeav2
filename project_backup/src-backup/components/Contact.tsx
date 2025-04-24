import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactWithReactIcons: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    const section = document.getElementById('contact');
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          projectType: '',
          budget: '',
          message: ''
        });
      }, 1500);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-primary-900 to-primary-950 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-secondary-400 font-medium tracking-wide mb-3">Get In Touch</h3>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
          <div className="w-24 h-1 bg-secondary-500 mx-auto"></div>
          <p className="mt-6 text-slate-200 max-w-2xl mx-auto text-lg">
            Ready to transform your digital presence? Reach out to discuss how we can help you achieve your goals.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-1 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-primary-800/50 backdrop-blur-sm rounded-xl p-8 md:p-10 h-full shadow-elevated">
                <h3 className="font-serif text-2xl font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="mr-4 bg-secondary-500 rounded-full p-3 text-primary-900">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Email</h4>
                      <a href="mailto:contact@topea.me" className="text-white hover:text-secondary-400 transition-colors">contact@topea.me</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-secondary-500 rounded-full p-3 text-primary-900">
                      <FaPhone size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Phone</h4>
                      <a href="tel:+442045876543" className="text-white hover:text-secondary-400 transition-colors">+44 (204) 587-6543</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-secondary-500 rounded-full p-3 text-primary-900">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Location</h4>
                      <p className="text-white">London, United Kingdom</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h4 className="font-medium mb-4 text-secondary-400">Connect with us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-primary-700 hover:bg-secondary-500 hover:text-primary-900 text-white transition-all flex items-center justify-center">
                      <FaTwitter size={18} />
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-primary-700 hover:bg-secondary-500 hover:text-primary-900 text-white transition-all flex items-center justify-center">
                      <FaLinkedin size={18} />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-primary-700 hover:bg-secondary-500 hover:text-primary-900 text-white transition-all flex items-center justify-center">
                      <FaGithub size={18} />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white text-slate-800 rounded-xl p-8 md:p-10 shadow-elevated">
                <h3 className="font-serif text-2xl font-bold mb-6 text-primary-800">Send a Message</h3>
                
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg relative mb-6 shadow-soft">
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                          errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:bg-white bg-slate-50'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                          errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:bg-white bg-slate-50'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-2">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-slate-50 focus:bg-white"
                      >
                        <option value="">Select project type</option>
                        <option value="website">Website Design</option>
                        <option value="app">Application Development</option>
                        <option value="branding">Branding & Identity</option>
                        <option value="marketing">Digital Marketing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-slate-50 focus:bg-white"
                      >
                        <option value="">Select budget range</option>
                        <option value="less-than-5k">Less than $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-20k">$10,000 - $20,000</option>
                        <option value="20k-50k">$20,000 - $50,000</option>
                        <option value="50k-plus">$50,000+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.message ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:bg-white bg-slate-50'
                      }`}
                      placeholder="Tell us about your project and goals..."
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium rounded-lg transition-all transform hover:scale-105 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-opacity-50 disabled:opacity-75 disabled:cursor-not-allowed ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <FaPaperPlane size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-sm text-slate-500 text-center">
                    We typically respond within 24-48 business hours.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactWithReactIcons;
