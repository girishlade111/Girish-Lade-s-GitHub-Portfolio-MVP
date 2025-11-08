
import React from 'react';
import { STATS } from '../constants';
import type { Stat } from '../types';

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const cardClasses = "glass-card rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#00AEEF]/50 hover:-translate-y-1";
  
  const cardContent = (
    <>
      {stat.icon}
      <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stat.value}</p>
      <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
    </>
  );

  if (stat.url) {
    return (
      <a href={stat.url} target="_blank" rel="noopener noreferrer" className={cardClasses}>
        {cardContent}
      </a>
    );
  }
  
  return <div className={cardClasses}>{cardContent}</div>;
};

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        About Me
      </h2>
      <p className="text-center max-w-3xl text-gray-400 text-lg mb-12">
        I’m Girish Balaso Lade — a developer, designer, and AI enthusiast passionate about creating open-source tools and modern web experiences. I love mixing creativity with code to bring design to life.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
