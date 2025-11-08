
import React from 'react';
import { SOCIAL_LINKS } from '../constants';

const Socials: React.FC = () => {
  return (
    <section id="contact" className="flex justify-center items-center py-8">
      <div className="flex gap-6 md:gap-8">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="group"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </section>
  );
};

export default Socials;
