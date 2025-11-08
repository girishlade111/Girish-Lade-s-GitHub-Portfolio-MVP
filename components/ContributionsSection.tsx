import React from 'react';

const ContributionsSection: React.FC = () => {
  return (
    <section id="contributions" className="flex flex-col items-center w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        GitHub Contributions
      </h2>
      <div className="p-4 md:p-6 glass-card rounded-lg w-full max-w-4xl">
        <a href="https://github.com/users/girishlade111/contributions" target="_blank" rel="noopener noreferrer" aria-label="View my contributions on GitHub">
          <img 
            src="https://ghchart.rshah.org/00AEEF/girishlade111" 
            alt="Girish Lade's GitHub Contributions Chart"
            className="w-full"
          />
        </a>
      </div>
    </section>
  );
};

export default ContributionsSection;