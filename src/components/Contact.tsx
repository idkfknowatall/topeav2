import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  honeypot?: string; // Hidden field to catch bots
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
    message: '',
    honeypot: ''
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

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Always use the non-www API endpoint since we're redirecting www to non-www
        const apiEndpoint = '/api/contact';

        console.log(`Submitting form to: ${apiEndpoint}`);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        // Log the response status and headers
        console.log(`Response status: ${response.status}`);
        console.log(`Response type: ${response.headers.get('content-type')}`);

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // If not JSON, get the text and log it
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned non-JSON response. Please try again later.');
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong. Please try again later.');
        }

        // Success
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          projectType: '',
          budget: '',
          message: '',
          honeypot: ''
        });
      } catch (error) {
        setIsSubmitting(false);
        setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-primary-900 to-primary-950 text-white" role="region" aria-label="Contact section">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-secondary-400 font-medium tracking-wide mb-3">Get In Touch</h3>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Let's Discuss Your Project</h2>
          <div className="w-24 h-1 bg-secondary-500 mx-auto"></div>
          <p className="mt-6 text-slate-200 max-w-2xl mx-auto text-lg">
            Ready to elevate your online presence with a professionally designed, high-performance website?
            Contact us to discuss your frontend design and SEO requirements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-1 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-gradient-to-br from-primary-800/80 to-primary-900/90 backdrop-blur-sm rounded-xl p-8 md:p-10 h-full shadow-elevated border border-primary-700/30 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <h3 className="font-serif text-2xl font-bold mb-10 relative">
                  Contact Information
                  <span className="block w-16 h-1 bg-secondary-500 mt-3"></span>
                </h3>

                <div className="space-y-12 relative z-10">
                  <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                    <div className="mr-5 bg-secondary-500 rounded-full p-4 text-primary-900 shadow-lg">
                      <FaEnvelope size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-300 mb-2">Email</h4>
                      <a href="mailto:contact@topea.me" className="text-white hover:text-secondary-400 transition-colors text-lg">contact@topea.me</a>
                    </div>
                  </div>

                  <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                    <div className="mr-5 bg-secondary-500 rounded-full p-4 text-primary-900 shadow-lg">
                      <FaMapMarkerAlt size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-300 mb-2">Location</h4>
                      <p className="text-white text-lg">London, United Kingdom</p>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-primary-700/30">
                    <p className="text-slate-300 text-sm">
                      We're available Monday through Friday, 9:00 AM to 6:00 PM GMT. We typically respond to all inquiries within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white text-slate-800 rounded-xl p-8 md:p-10 shadow-elevated">
                <h3 className="font-serif text-2xl font-bold mb-6 text-primary-800">Send a Message</h3>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg relative mb-6 shadow-soft" role="alert">
                    <strong className="font-bold">Thank you for contacting us!</strong>
                    <span className="block sm:inline"> Your message has been received. Our design team will review your requirements and respond promptly.</span>
                  </div>
                ) : null}

                {submitError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-soft" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {submitError}</span>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} aria-describedby="form-instructions">
                  <p id="form-instructions" className="sr-only">
                    All fields marked with an asterisk are required.
                  </p>
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
                        aria-required="true"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
                          {errors.name}
                        </p>
                      )}
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
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                          {errors.email}
                        </p>
                      )}
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
                        aria-describedby="projectType-help"
                      >
                        <option value="">Select project type</option>
                        <option value="frontend">Frontend Website Design</option>
                        <option value="responsive">Responsive Web Design</option>
                        <option value="ui-design">UI/UX Design</option>
                        <option value="seo">SEO Optimization</option>
                        <option value="performance">Performance Improvement</option>
                        <option value="other">Other</option>
                      </select>
                      <p id="projectType-help" className="sr-only">
                        Select the type of project you are interested in.
                      </p>
                    </div>

                    <div>
                      <div
                        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shadow-elevated group"
                        onClick={() => setFormData((prev) => ({ ...prev, budget: 'flexible' }))}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setFormData((prev) => ({ ...prev, budget: 'flexible' }));
                          }
                        }}
                        aria-pressed={formData.budget === 'flexible'}
                        aria-label="Select flexible budget option"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 to-primary-600 opacity-30 blur-xl group-hover:opacity-70 transition-opacity duration-500 group-hover:duration-200 animate-pulse-slow"></div>

                        <div className="relative flex flex-col items-center text-center z-20 transition-colors duration-300 group-hover:text-primary-900">
                          <h4 className="font-serif text-lg font-bold mb-2">Flexible Budget Options</h4>
                          <p className="text-sm opacity-90 group-hover:opacity-100">
                            No project is too big or small - we fit every budget with tailored solutions.
                          </p>
                          <input type="hidden" name="budget" value="flexible" />
                        </div>

                        <div className="absolute top-0 right-0 -mt-3 -mr-3 h-16 w-16 bg-secondary-500 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 z-10"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 bg-primary-900 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 z-10"></div>
                      </div>
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
                      placeholder="Tell us about your website design needs, SEO requirements, and project goals..."
                      aria-required="true"
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    ></textarea>
                    {errors.message && (
                      <p id="message-error" className="mt-1 text-sm text-red-500" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Honeypot field - hidden from users but bots will fill it out */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="honeypot" className="hidden">
                      Leave this field empty
                    </label>
                    <input
                      type="text"
                      id="honeypot"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Centered button container */}
                  <div className="flex justify-center">
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
                  </div>
                  <p className="mt-4 text-sm text-slate-500 text-center">
                    Your inquiry is important to us. We respond to all messages within 24 business hours.
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

export default Contact;
