import React from 'react';
import type { Project, Stat, SocialLink } from './types';
import { Github, Link, Star, GitCommit, GitPullRequest, AlertCircle, GitBranch, Instagram, Linkedin, Mail, Code } from 'lucide-react';


const iconProps = {
  className: "w-6 h-6 text-[#00AEEF]",
};

export const STATS: Stat[] = [
  { icon: <Star {...iconProps} />, value: "588", label: "Stars Earned", url: "https://github.com/girishlade111?tab=stars" },
  { icon: <GitCommit {...iconProps} />, value: "3.8K+", label: "Total Commits (Last Year)" },
  { icon: <GitPullRequest {...iconProps} />, value: "16", label: "PRs" },
  { icon: <AlertCircle {...iconProps} />, value: "42", label: "Issues" },
  { icon: <GitBranch {...iconProps} />, value: "614", label: "Repositories", url: "https://github.com/girishlade111?tab=repositories" },
  { icon: <Github {...iconProps} />, value: "3,183+", label: "Contributions" },
];

export const PROJECTS: Project[] = [
  {
    name: "AetherCanvas AI",
    description: "AetherCanvas: AI Image Generation Studio (Ideogram Style)",
    tags: ["TypeScript", "Next.js", "AI"],
    githubUrl: "https://github.com/girishlade111/AetherCanvas-AI-Image-Generation-Studio-Ideogram-Style",
  },
  {
    name: "Synergy-Flow",
    description: "An open-source project management tool designed for agile development workflows.",
    tags: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/girishlade111/Synergy-Flow",
  },
  {
    name: "GB-Coder Public Beta",
    description: "A coding playground and educational platform for learning web development.",
    tags: ["Vue.js", "Firebase", "TypeScript"],
    githubUrl: "https://github.com/girishlade111/GB-Coder-Public-Beta",
  },
  {
    name: "Lade-Studio",
    description: "A digital agency website showcasing modern design and animation techniques.",
    tags: ["Gatsby", "Framer Motion", "Contentful"],
    githubUrl: "https://github.com/girishlade111/Lade-Studio",
    liveUrl: "https://ladestudio.vercel.app/",
  },
  {
    name: "Lade Stack AI Dev Hub",
    description: "A developer hub with AI-powered tools, resources, and community forums.",
    tags: ["Next.js", "Supabase", "OpenAI"],
    githubUrl: "https://github.com/girishlade111/lade-stack-ai-dev-hub",
    liveUrl: "https://www.ladestack.in/",
  },
  {
    name: "Artify",
    description: "An AI-powered image generation and editing tool using modern APIs.",
    tags: ["React", "Cloudinary AI", "Tailwind CSS"],
    githubUrl: "https://github.com/girishlade111/Artify",
    liveUrl: "https://artify-gules.vercel.app/",
  },
];

const socialIconProps = {
  className: "w-7 h-7 text-gray-400 group-hover:text-[#00AEEF] transition-colors duration-300",
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "GitHub", url: "https://github.com/girishlade111", icon: <Github {...socialIconProps} /> },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/girish-lade-075bba201/", icon: <Linkedin {...socialIconProps} /> },
  { name: "Instagram", url: "https://www.instagram.com/girish_lade_/", icon: <Instagram {...socialIconProps} /> },
  { name: "CodePen", url: "https://codepen.io/Girish-Lade-the-looper", icon: <Code {...socialIconProps} /> },
  { name: "Email", url: "mailto:girish@ladestack.in", icon: <Mail {...socialIconProps} /> },
];