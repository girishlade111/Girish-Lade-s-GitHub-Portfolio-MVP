import React, { useState, useEffect } from 'react';

const ROLES = [
  "UX/UI Designer",
  "AI Agent Builder",
  "Open Source Developer",
  "Startup Founder",
];

const HeroSection: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const avatarUrl = "https://github.com/girishlade111.png";

  useEffect(() => {
    const handleTyping = () => {
      const fullRole = ROLES[roleIndex];
      if (isDeleting) {
        setDisplayedRole(fullRole.substring(0, displayedRole.length - 1));
      } else {
        setDisplayedRole(fullRole.substring(0, displayedRole.length + 1));
      }

      if (!isDeleting && displayedRole === fullRole) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedRole === "") {
        setIsDeleting(false);
        setRoleIndex((prevIndex) => (prevIndex + 1) % ROLES.length);
      }
    };

    const typingSpeed = isDeleting ? 100 : 150;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex]);

  return (
    <section id="home" className="flex flex-col items-center text-center min-h-[60vh] justify-center">
      <div className="w-36 h-36 rounded-full border-4 border-gray-700 shadow-lg mb-6 bg-gray-800">
        <img
          src={avatarUrl}
          alt="Girish Balaso Lade"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
        Girish Balaso Lade
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-4">
        UX/UI Designer & Developer obsessed with building stuff people actually use... for free.
      </p>
      <div className="text-xl md:text-2xl font-jetbrains text-[#00AEEF] h-8">
        <span>{displayedRole}</span>
        <span className="border-r-2 border-[#00AEEF] typewriter-cursor" aria-hidden="true"></span>
      </div>
    </section>
  );
};

export default HeroSection;