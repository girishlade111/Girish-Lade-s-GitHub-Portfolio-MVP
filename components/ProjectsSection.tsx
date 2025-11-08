import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { Github, ExternalLink, Star, GitBranch, Clock, AlertTriangle } from 'lucide-react';
import { fetchGitHubAPI } from '../utils/api';

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

const ProjectCardSkeleton: React.FC = () => (
    <div className="glass-card rounded-lg p-6 flex flex-col h-full animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-5 w-5 bg-gray-700/50 rounded"></div>
        </div>
        <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6 mb-4"></div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
            <div className="h-4 bg-gray-700/50 rounded w-20"></div>
            <div className="h-4 bg-gray-700/50 rounded w-16"></div>
            <div className="h-4 bg-gray-700/50 rounded w-16"></div>
        </div>

        <div className="flex flex-wrap gap-2">
            <div className="h-5 bg-gray-700/50 rounded-full w-16"></div>
            <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
            <div className="h-5 bg-gray-700/50 rounded-full w-24"></div>
        </div>
    </div>
);


const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<string[]>(['All']);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const projectPromises = PROJECTS.map(p => {
          const repoName = p.githubUrl.split('/').pop();
          return fetchGitHubAPI(`/repos/girishlade111/${repoName}`);
        });

        const results = await Promise.allSettled(projectPromises);

        let didAnyFail = false;
        const updatedProjects = PROJECTS.map((p, i) => {
          const result = results[i];
          if (result.status === 'fulfilled') {
            const repo = result.value;
            return {
              ...p,
              description: repo.description || p.description,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              updatedAt: repo.updated_at,
              liveUrl: repo.homepage || p.liveUrl,
            };
          } else {
            const reasonMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);
            console.error(`Could not fetch data for project "${p.name}". Reason:`, reasonMessage);
            didAnyFail = true;
            return p; // Fallback to the original static project data
          }
        });

        if (didAnyFail) {
          setError("Could not fetch latest data for some projects. Displaying cached versions where needed.");
        }
        
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);

        const uniqueFilters = new Set<string>();
        updatedProjects.forEach(p => {
            if (p.language) uniqueFilters.add(p.language);
            p.tags.forEach(t => uniqueFilters.add(t));
        });
        setFilters(['All', ...Array.from(uniqueFilters).sort()]);

      } catch (err) {
        const error = err as Error;
        console.error("An unexpected error occurred while fetching projects:", error.message);
        setError("Could not fetch latest project data. Displaying cached versions.");
        setProjects(PROJECTS);
        setFilteredProjects(PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      const newFilteredProjects = projects.filter(p => 
        p.tags.includes(activeFilter) || p.language === activeFilter
      );
      setFilteredProjects(newFilteredProjects);
    }
  }, [activeFilter, projects]);

  return (
    <section id="projects" className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Pinned Projects
      </h2>
      
      {error && (
        <div className="glass-card rounded-lg p-4 mb-8 text-yellow-300/90 border border-yellow-400/30 flex items-center gap-3 w-full max-w-4xl" role="alert">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && filters.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-jetbrains transition-all duration-200 border ${
                activeFilter === filter
                  ? 'bg-[#00AEEF] text-[#0D1117] border-[#00AEEF]'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-[#00AEEF]/20 hover:border-[#00AEEF]/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
