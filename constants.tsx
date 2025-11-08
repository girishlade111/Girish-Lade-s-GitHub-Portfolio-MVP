
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
    githubUrl: "https://github.com/girishlade111/AetherCanvas",
    stars: 29,
    forks: 4,
    language: "TypeScript",
    updatedAt: "2024-07-20T10:00:00Z",
  },
  {
    name: "Synergy-Flow",
    description: "An open-source project management tool designed for agile development workflows.",
    tags: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/girishlade111/Synergy-Flow",
    stars: 26,
    forks: 2,
    language: "JavaScript",
    updatedAt: "2024-06-15T10:00:00Z",
  },
  {
    name: "GB-Coder Public Beta",
    description: "A coding playground and educational platform for learning web development.",
    tags: ["Vue.js", "Firebase", "TypeScript"],
    githubUrl: "https://github.com/girishlade111/GB-Coder-Public-Beta",
    stars: 1,
    forks: 0,
    language: "Vue",
    updatedAt: "2023-01-10T10:00:00Z",
  },
  {
    name: "Lade-Studio",
    description: "A digital agency website showcasing modern design and animation techniques.",
    tags: ["Gatsby", "Framer Motion", "Contentful"],
    githubUrl: "https://github.com/girishlade111/Lade-Studio",
    liveUrl: "https://ladestudio.vercel.app/",
    stars: 5,
    forks: 0,
    language: "JavaScript",
    updatedAt: "2023-05-22T10:00:00Z",
  },
  {
    name: "Lade Notion",
    description: "A Notion Clone built with Next.js 14, Supabase, and Tailwind CSS.",
    tags: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/girishlade111/Lade-Notion",
    liveUrl: "https://lade-notion.vercel.app/",
    stars: 47,
    forks: 7,
    language: "TypeScript",
    updatedAt: "2024-07-18T10:00:00Z",
  },
  {
    name: "Lade Auth",
    description: "Advanced Authentication with Next.js 14 using Auth.js, Server Actions, and more.",
    tags: ["Next.js", "Auth.js", "TypeScript", "Zod"],
    githubUrl: "https://github.com/girishlade111/Lade-Auth",
    stars: 19,
    forks: 1,
    language: "TypeScript",
    updatedAt: "2024-07-01T10:00:00Z",
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
