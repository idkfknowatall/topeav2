import React, { useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update document title
    document.title = 'Privacy Policy | Topea';
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="text-slate-600 mb-12 text-center max-w-3xl mx-auto">
          Last updated: April 23, 2024
        </p>

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-slate-50 rounded-xl max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => scrollToSection('introduction')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                1. Introduction
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('information-we-collect')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                2. Information We Collect
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('how-we-use-information')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                3. How We Use Your Information
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('cookies')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                4. Cookies and Similar Technologies
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('third-party-services')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                5. Third-Party Services
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('data-retention')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                6. Data Retention
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('your-rights')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                7. Your Rights
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('security')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                8. Security
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('children')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                9. Children's Privacy
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('changes')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                10. Changes to This Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                11. Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto prose prose-lg prose-slate">
          <section id="introduction" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Welcome to Topea ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
            <p>
              This privacy policy applies to all information collected through our website, as well as any related services, sales, marketing, or events (collectively, the "Services").
            </p>
            <p>
              Please read this privacy policy carefully as it will help you understand what we do with the information that we collect.
            </p>
          </section>

          <section id="information-we-collect" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Services to you.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
            <p>
              While using our Services, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name</li>
              <li>Message content when you contact us</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
            <p>
              We may also collect information about how the Services are accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Services that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
            </p>
          </section>

          <section id="how-we-use-information" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>

          <section id="cookies" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">4. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our Services and hold certain information.
            </p>
            <p>
              Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Services.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.
            </p>
            <p>
              Examples of Cookies we use:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Session Cookies:</strong> We use Session Cookies to operate our Services.</li>
              <li><strong>Preference Cookies:</strong> We use Preference Cookies to remember your preferences and various settings.</li>
              <li><strong>Security Cookies:</strong> We use Security Cookies for security purposes.</li>
              <li><strong>Analytics Cookies:</strong> We use Analytics Cookies to track and analyze website usage.</li>
            </ul>
          </section>

          <section id="third-party-services" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
            <p>
              We may use third-party service providers to monitor and analyze the use of our Services.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Google Analytics</h3>
            <p>
              Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Services. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.
            </p>
            <p>
              You can opt-out of having made your activity on the Services available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js, and dc.js) from sharing information with Google Analytics about visits activity.
            </p>
            <p>
              For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: <a href="https://policies.google.com/privacy" className="text-primary-600 hover:text-primary-800 transition-colors" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
            </p>
          </section>

          <section id="data-retention" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
            <p>
              To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements.
            </p>
          </section>

          <section id="your-rights" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access, update or delete the information we have on you</li>
              <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
              <li>The right to object - the right to object to our processing of your personal data</li>
              <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
              <li>The right to data portability - the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format</li>
              <li>The right to withdraw consent - the right to withdraw your consent at any time where we relied on your consent to process your personal information</li>
            </ul>
            <p>
              If you wish to exercise any of these rights, please contact us using the contact information provided below.
            </p>
          </section>

          <section id="security" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">8. Security</h2>
            <p>
              The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section id="children" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <p>
              Our Services are not intended for use by children under the age of 16 ("Children").
            </p>
            <p>
              We do not knowingly collect personally identifiable information from Children under 16. If you become aware that a Child has provided us with personal information, please contact us. If we become aware that we have collected personal information from Children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>

          <section id="changes" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>By email: contact@topea.me</li>
              <li>By phone: +44 (204) 587-6543</li>
              <li>By mail: Topea, 123 Web Street, London, UK</li>
            </ul>
          </section>
        </div>

        {/* Back to Top Button */}
        <div className="text-center mt-12">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaArrowUp className="mr-2" /> Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
