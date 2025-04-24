import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

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

const Contact: React.FC = () => {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate sending form data
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Reset form after submission
        setFormData({
          name: '',
          email: '',
          projectType: '',
          budget: '',
          message: ''
        });
        
        // Reset submission status after a delay
        setTimeout(() => setIsSubmitted(false), 5000);
      }, 1500);
    }
  };
  
  return (
    <section id="contact" className="py-20 md:py-24 bg-slate-800 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-amber-500 font-medium tracking-wide mb-2">Get In Touch</h3>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
          <div className="w-24 h-1 bg-white mx-auto"></div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-slate-700 rounded-lg p-6 md:p-8 h-full">
                <h3 className="font-serif text-xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 bg-amber-500 rounded-full p-2 text-white">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Email</h4>
                      <a href="mailto:hello@example.com" className="text-white hover:text-amber-500 transition-colors">hello@example.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-amber-500 rounded-full p-2 text-white">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Phone</h4>
                      <a href="tel:+1234567890" className="text-white hover:text-amber-500 transition-colors">+1 (234) 567-890</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-amber-500 rounded-full p-2 text-white">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Location</h4>
                      <p className="text-white">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h4 className="font-medium mb-4">Connect with me</h4>
                  <div className="flex space-x-3">
                    {/* Social media icons would go here */}
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-600 hover:bg-amber-500 transition-colors flex items-center justify-center">
                      {/* Replace with actual social icons */}
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-600 hover:bg-amber-500 transition-colors flex items-center justify-center">
                      <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-600 hover:bg-amber-500 transition-colors flex items-center justify-center">
                      <span className="sr-only">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white text-slate-800 rounded-lg p-6 md:p-8">
                <h3 className="font-serif text-xl font-bold mb-6">Send a Message</h3>
                
                {isSubmitted ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> Your message has been sent successfully. I'll get back to you soon.</span>
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors ${
                          errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-1">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
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
                      <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                      >
                        <option value="">Select budget range</option>
                        <option value="less-than-5k">Less than $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-20k">$10,000 - $20,000</option>
                        <option value="20k-plus">$20,000+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors ${
                        errors.message ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Tell me about your project..."
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-75 disabled:cursor-not-allowed ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;