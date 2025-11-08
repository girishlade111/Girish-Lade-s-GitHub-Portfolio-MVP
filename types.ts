import React from 'react';

export interface Project {
  name: string;
  description: string;
  longDescription?: string;
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
  url?: string;
}

export interface SocialLink {
  icon: React.ReactNode;
  url: string;
  name: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: GroundingSource[];
}