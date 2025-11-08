import React from 'react';

export interface Project {
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  stars?: number;
  forks?: number;
  language?: string;
  updatedAt?: string;
}

export interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export interface SocialLink {
  icon: React.ReactNode;
  url: string;
  name: string;
}