import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components that are not needed for initial render
const Portfolio = lazy(() => import('./components/Portfolio'));
const Services = lazy(() => import('./components/Services'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Hero />
          <ErrorBoundary fallback={
            <div className="py-24 md:py-32 bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">Failed to load Portfolio section</p>
              </div>
            </div>
          }>
            <Suspense fallback={
              <div className="py-24 md:py-32 bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading Portfolio...</p>
                </div>
              </div>
            }>
              <Portfolio />
            </Suspense>
          </ErrorBoundary>
        <Suspense fallback={
          <div className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading Services...</p>
            </div>
          </div>
        }>
          <Services />
        </Suspense>
        <Suspense fallback={
          <div className="py-24 md:py-32 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-secondary-400/30 border-t-secondary-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/80 font-medium">Loading Contact...</p>
            </div>
          </div>
        }>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={
        <div className="py-10 bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-600 border-t-secondary-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-400 text-sm">Loading Footer...</p>
          </div>
        </div>
      }>
        <Footer />
      </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;