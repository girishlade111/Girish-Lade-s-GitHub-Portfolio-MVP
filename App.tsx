
import React from 'react';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ContributionsSection from './components/ContributionsSection';
import Socials from './components/Socials';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <div className="bg-[#0D1117] text-gray-300 min-h-screen">
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#00aeef40_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col gap-20 md:gap-32">
          <ErrorBoundary componentName="Hero">
            <HeroSection />
          </ErrorBoundary>
          <ErrorBoundary componentName="About">
            <AboutSection />
          </ErrorBoundary>
          <ErrorBoundary componentName="Projects">
            <ProjectsSection />
          </ErrorBoundary>
          <ErrorBoundary componentName="Contributions">
            <ContributionsSection />
          </ErrorBoundary>
          <Socials />
          <Footer />
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default App;
