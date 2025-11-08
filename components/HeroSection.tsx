import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const ROLES = [
  "UX/UI Designer",
  "AI Agent Builder",
  "Open Source Developer",
  "Startup Founder",
];

// Animation timing constants for easy adjustment
const TYPING_INTERVAL = 150;
const DELETING_INTERVAL = 100;
const PAUSE_DURATION = 2000;

const HeroSection: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const avatarUrl = "https://github.com/girishlade111.png";

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    const fullRole = ROLES[roleIndex];
    let timer: number;

    // State 1: Pausing after a role is fully typed
    if (!isDeleting && displayedRole === fullRole) {
      timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, PAUSE_DURATION);
    } 
    // State 2: Switching to the next role after deleting is complete
    else if (isDeleting && displayedRole === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } 
    // State 3: Typing or deleting one character at a time
    else {
      timer = window.setTimeout(() => {
        setDisplayedRole(current => {
          if (isDeleting) {
            return fullRole.substring(0, current.length - 1);
          }
          return fullRole.substring(0, current.length + 1);
        });
      }, isDeleting ? DELETING_INTERVAL : TYPING_INTERVAL);
    }

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex]);

  return (
    <section id="home" className="flex flex-col items-center text-center min-h-[60vh] justify-center">
      <div className={`w-36 h-36 rounded-full border-4 border-gray-700 shadow-lg mb-6 bg-gray-800 transition-opacity duration-700 animate-pulse-slow ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={avatarUrl}
          alt="Girish Balaso Lade"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <h1 className={`text-4xl md:text-6xl font-bold text-white mb-3 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Girish Balaso Lade
      </h1>
      <p className={`text-lg md:text-xl text-gray-400 max-w-2xl mb-4 transition-all duration-700 ease-out delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        UX/UI Designer & Developer obsessed with building stuff people actually use... for free.
      </p>
      <div className={`text-xl md:text-2xl font-jetbrains text-[#00AEEF] h-8 mb-8 transition-all duration-700 ease-out delay-400 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span>{displayedRole}</span>
        <span className="border-r-2 border-[#00AEEF] typewriter-cursor" aria-hidden="true"></span>
      </div>
      <a
        href="https://jottacloud.com/s/393f4ef74c70cf241a5b9a61e2472a7910d"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 bg-[#00AEEF] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#00AEEF]/80 transform hover:scale-105 transition-all duration-700 ease-out delay-600 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <Download className="w-5 h-5" />
        Download Resume
      </a>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 174, 239, 0.4);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(0, 174, 239, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
