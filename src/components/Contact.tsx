import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaRedo, FaExclamationTriangle } from './icons';
import { useScrollAnimation } from '../hooks/useIntersectionObserver';
import { useDebounce } from '../hooks/useDebounce';
import { useFormSubmission } from '../hooks/useApiCall';
import { logger } from '../services/logger';

// Type definitions for form state and validation
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
  // Performance hooks
  const { isVisible, elementRef } = useScrollAnimation(0.1);

  // Form state management
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
    honeypot: ''
  });

  // UI state management
  const [errors, setErrors] = useState<FormErrors>({});

  // API call management with retry functionality
  const {
    loading: isSubmitting,
    error: submitError,
    data: submitResponse,
    retryCount,
    isRetrying,
    submitForm,
    retry: retrySubmission,
    reset: resetSubmission,
  } = useFormSubmission({
    onSuccess: (data) => {
      logger.logUserAction('Contact Form Submitted Successfully', {
        formData: {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType
        },
      });
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        message: '',
        honeypot: ''
      });
    },
    onError: (error) => {
      logger.error('Contact Form Submission Failed', {
        error: {
          name: error.name,
          message: error.message,
          status: error.status,
        },
        formData: {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType
        },
        retryCount,
      });
    },
    onRetry: (attempt, error) => {
      logger.info('Contact Form Retry Attempt', {
        attempt,
        error: error.message,
        formData: {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType
        },
      });
    },
  });

  // Check if form was successfully submitted
  const isSubmitted = !!submitResponse;

  // Debounced form values for validation
  const debouncedName = useDebounce(formData.name, 500);
  const debouncedEmail = useDebounce(formData.email, 500);
  const debouncedMessage = useDebounce(formData.message, 800);

  // Real-time validation with debounced values
  useEffect(() => {
    if (debouncedName && formData.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  }, [debouncedName, formData.name]);

  useEffect(() => {
    if (debouncedEmail && formData.email) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (emailRegex.test(debouncedEmail)) {
        setErrors(prev => ({ ...prev, email: undefined }));
      } else {
        setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
      }
    }
  }, [debouncedEmail, formData.email]);

  useEffect(() => {
    if (debouncedMessage && formData.message) {
      setErrors(prev => ({ ...prev, message: undefined }));
    }
  }, [debouncedMessage, formData.message]);

  // Form validation logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission with comprehensive error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous submission state
    resetSubmission();

    // Validate form before submission
    if (validateForm()) {
      logger.logUserAction('Contact Form Submission Started', {
        formData: {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType
        },
      });

      // Submit form using the new API hook
      await submitForm('/api/contact', formData);
    } else {
      logger.logUserAction('Contact Form Validation Failed', {
        errors: Object.keys(errors),
        formData: {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType
        },
      });
    }
  };

  // Handle manual retry
  const handleRetry = async () => {
    logger.logUserAction('Contact Form Manual Retry', {
      retryCount,
      formData: {
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType
      },
    });

    await retrySubmission();
  };

  return (
    <section
      id="contact"
      ref={elementRef}
      className="py-24 md:py-32 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white relative overflow-hidden"
      role="region"
      aria-label="Contact section"
    >
      {/* Background decorative elements for visual appeal */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        {/* Section header with animation */}
        <div className={`text-center mb-20 md:mb-24 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-secondary-400 font-semibold tracking-widest uppercase text-sm mb-4">
            Get In Touch
          </h3>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Let's Discuss Your Project
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-secondary-500 to-secondary-300 mx-auto rounded-full"></div>
          <p className="mt-8 text-slate-200 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Ready to elevate your online presence with a professionally designed, high-performance website?
            Contact us to discuss your frontend design and SEO requirements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Contact Information Panel */}
            <div className={`lg:col-span-1 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="bg-gradient-to-br from-primary-800/80 to-primary-900/90 backdrop-blur-sm rounded-xl p-8 md:p-10 h-full shadow-elevated border border-primary-700/30 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <h3 className="font-serif text-2xl font-bold mb-10 relative">
                  Contact Information
                  <span className="block w-16 h-1 bg-secondary-500 mt-3"></span>
                </h3>

                <div className="space-y-12 relative z-10">
                  {/* Email contact */}
                  <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                    <div className="mr-5 bg-secondary-500 rounded-full p-4 text-primary-900 shadow-lg">
                      <FaEnvelope size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-300 mb-2">Email</h4>
                      <a
                        href="mailto:contact@topea.me"
                        className="text-white hover:text-secondary-400 transition-colors text-lg"
                      >
                        contact@topea.me
                      </a>
                    </div>
                  </div>

                  {/* Location information */}
                  <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                    <div className="mr-5 bg-secondary-500 rounded-full p-4 text-primary-900 shadow-lg">
                      <FaMapMarkerAlt size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-300 mb-2">Location</h4>
                      <p className="text-white text-lg">London, United Kingdom</p>
                    </div>
                  </div>

                  {/* Business hours and response time */}
                  <div className="mt-12 pt-8 border-t border-primary-700/30">
                    <p className="text-slate-300 text-sm">
                      We're available Monday through Friday, 9:00 AM to 6:00 PM GMT.
                      We typically respond to all inquiries within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Panel */}
            <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="bg-white text-slate-800 rounded-xl p-8 md:p-10 shadow-elevated">
                <h3 className="font-serif text-2xl font-bold mb-6 text-primary-800">
                  Send a Message
                </h3>

                {/* Success message display */}
                {isSubmitted && (
                  <div
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-8 py-6 rounded-xl relative mb-8 shadow-lg backdrop-blur-sm"
                    role="alert"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <strong className="font-bold text-lg">Thank you for contacting us!</strong>
                        <p className="mt-1">
                          Your message has been received. Our design team will review your requirements and respond promptly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message display with retry functionality */}
                {submitError && (
                  <div
                    className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800 px-8 py-6 rounded-xl relative mb-8 shadow-lg backdrop-blur-sm"
                    role="alert"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaExclamationTriangle className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <strong className="font-bold text-lg">
                          {isRetrying ? 'Retrying...' : 'Submission Failed'}
                        </strong>
                        <p className="mt-1">{submitError}</p>
                        {retryCount > 0 && (
                          <p className="mt-2 text-sm text-red-600">
                            Retry attempt {retryCount} failed.
                          </p>
                        )}
                        {!isRetrying && (
                          <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={handleRetry}
                              disabled={isSubmitting}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                            >
                              <FaRedo className="w-3 h-3" />
                              Try Again
                            </button>
                            <button
                              onClick={resetSubmission}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {isRetrying && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                          <span>Attempting to resend your message...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} aria-describedby="form-instructions">
                  <p id="form-instructions" className="sr-only">
                    All fields marked with an asterisk are required.
                  </p>

                  {/* Name and Email Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name Field */}
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
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 backdrop-blur-sm ${
                          errors.name
                            ? 'border-red-400 bg-red-50/80'
                            : 'border-slate-200/60 focus:bg-white/90 bg-white/60 hover:bg-white/80'
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

                    {/* Email Field */}
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
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 backdrop-blur-sm ${
                          errors.email
                            ? 'border-red-400 bg-red-50/80'
                            : 'border-slate-200/60 focus:bg-white/90 bg-white/60 hover:bg-white/80'
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

                  {/* Project Type and Budget Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Project Type Dropdown */}
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-2">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-5 py-4 border-2 border-slate-200/60 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 bg-white/60 focus:bg-white/90 hover:bg-white/80 backdrop-blur-sm"
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

                    {/* Budget Selection Card */}
                    <div>
                      <div
                        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shadow-elevated group cursor-pointer"
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
                        {/* Hover overlay effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 to-primary-600 opacity-30 blur-xl group-hover:opacity-70 transition-opacity duration-500 group-hover:duration-200 animate-pulse-slow"></div>

                        {/* Content */}
                        <div className="relative flex flex-col items-center text-center z-20 transition-colors duration-300 group-hover:text-primary-900">
                          <h4 className="font-serif text-lg font-bold mb-2">Flexible Budget Options</h4>
                          <p className="text-sm opacity-90 group-hover:opacity-100">
                            No project is too big or small - we fit every budget with tailored solutions.
                          </p>
                          <input type="hidden" name="budget" value="flexible" />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 -mt-3 -mr-3 h-16 w-16 bg-secondary-500 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 z-10"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 bg-primary-900 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 z-10"></div>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 backdrop-blur-sm resize-none ${
                        errors.message
                          ? 'border-red-400 bg-red-50/80'
                          : 'border-slate-200/60 focus:bg-white/90 bg-white/60 hover:bg-white/80'
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

                  {/* Honeypot field - hidden spam protection */}
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

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting || isRetrying}
                      className={`group flex items-center justify-center px-10 py-5 bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-600 hover:to-secondary-500 text-primary-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-secondary-500/25 focus:outline-none focus:ring-4 focus:ring-secondary-500/50 focus:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden ${
                        (isSubmitting || isRetrying) ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting || isRetrying ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {isRetrying ? (
                            <>Retrying... (Attempt {retryCount + 1})</>
                          ) : (
                            <>Sending...</>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center gap-3">
                            Send Message
                            <FaPaperPlane
                              size={18}
                              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                            />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Response time notice */}
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
