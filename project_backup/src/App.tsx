import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

// Lazy load components that are not needed for initial render
const Portfolio = lazy(() => import('./components/Portfolio'));
const Services = lazy(() => import('./components/Services'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Portfolio...</div>}>
          <Portfolio />
        </Suspense>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Services...</div>}>
          <Services />
        </Suspense>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Contact...</div>}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<div className="py-10 text-center">Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;