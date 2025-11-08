
import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { Github, ExternalLink, Star, GitBranch, Clock } from 'lucide-react';

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervalInYears = seconds / 31536000;
    if (intervalInYears > 1) return `~${Math.floor(intervalInYears)}y ago`;
    
    const intervalInMonths = seconds / 2592000;
    if (intervalInMonths > 1) return `~${Math.floor(intervalInMonths)}mo ago`;
    
    const intervalInDays = seconds / 86400;
    if (intervalInDays > 1) return `~${Math.floor(intervalInDays)}d ago`;

    return `recently`;
};

const LanguageIndicator: React.FC<{ language: string }> = ({ language }) => {
    const colorFromLanguage = (lang: string) => {
        let hash = 0;
        for (let i = 0; i < lang.length; i++) {
            hash = lang.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }
    return <div style={{ backgroundColor: colorFromLanguage(language) }} className="w-3 h-3 rounded-full"></div>
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="glass-card rounded-lg p-6 flex flex-col h-full transition-all duration-300 hover:border-[#00AEEF]/50 hover:-translate-y-1 group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-white group-hover:text-[#00AEEF] transition-colors">{project.name}</h3>
      <div className="flex items-center gap-4">
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={`${project.name} on GitHub`}>
          <Github className="w-5 h-5" />
        </a>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={`${project.name} live demo`}>
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
    <p className="text-gray-400 text-base flex-grow mb-4">{project.description}</p>
    
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-4 font-jetbrains">
        {project.language && (
            <span className="flex items-center gap-1.5">
                <LanguageIndicator language={project.language} />
                {project.language}
            </span>
        )}
        {project.stars !== undefined && <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {project.stars}</span>}
        {project.forks !== undefined && <span className="flex items-center gap-1"><GitBranch className="w-4 h-4" /> {project.forks}</span>}
        {project.updatedAt && (
             <span className="flex items-center gap-1" title={`Last updated: ${new Date(project.updatedAt).toLocaleString()}`}>
                <Clock className="w-4 h-4" />
                Updated {timeAgo(project.updatedAt)}
            </span>
        )}
    </div>

    <div className="flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <span key={tag} className="bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-jetbrains font-medium px-2 py-1 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectPromises = PROJECTS.map(p => {
          const repoName = p.githubUrl.split('/').pop();
          return fetch(`https://api.github.com/repos/girishlade111/${repoName}`).then(res => {
            if (res.ok) return res.json();
            return Promise.resolve(null);
          });
        });

        const repos = await Promise.all(projectPromises);

        const updatedProjects = PROJECTS.map((p, i) => {
          const repo = repos[i];
          if (repo) {
            return {
              ...p,
              description: repo.description || p.description,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              updatedAt: repo.updated_at,
              liveUrl: repo.homepage || p.liveUrl,
            };
          }
          return p;
        });
        setProjects(updatedProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
        Pinned Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
