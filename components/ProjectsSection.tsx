import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { Github, ExternalLink, Star, GitBranch, Clock, Search } from 'lucide-react';
import ProjectModal from './ProjectModal';

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

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => (
  <button onClick={onClick} className="glass-card rounded-lg p-6 flex flex-col h-full transition-all duration-300 hover:border-[#00AEEF]/50 hover:-translate-y-1 group text-left w-full">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-white group-hover:text-[#00AEEF] transition-colors">{project.name}</h3>
      <div className="flex items-center gap-4">
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-white transition-colors" aria-label={`${project.name} on GitHub`}>
          <Github className="w-5 h-5" />
        </a>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-white transition-colors" aria-label={`${project.name} live demo`}>
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
                Last updated {timeAgo(project.updatedAt)}
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
  </button>
);

const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filters = useMemo(() => {
    const uniqueFilters = new Set<string>();
    PROJECTS.forEach(p => {
        if (p.language) uniqueFilters.add(p.language);
        p.tags.forEach(t => uniqueFilters.add(t));
    });
    return ['All', ...Array.from(uniqueFilters).sort()];
  }, []);

  const filteredProjects = useMemo(() => {
    let projectsToFilter = PROJECTS;

    // Apply category filter
    if (activeFilter !== 'All') {
      projectsToFilter = projectsToFilter.filter(p => 
        p.tags.includes(activeFilter) || p.language === activeFilter
      );
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        projectsToFilter = projectsToFilter.filter(p => 
            p.name.toLowerCase().includes(lowercasedSearchTerm) ||
            p.description.toLowerCase().includes(lowercasedSearchTerm)
        );
    }

    return projectsToFilter;
  }, [activeFilter, searchTerm]);

  return (
    <section id="projects" className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Pinned Projects
      </h2>
      
      <div className="w-full max-w-4xl mb-8 flex flex-col gap-6">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/50 transition-colors duration-300"
          />
        </div>
        {filters.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.name} project={project} onClick={() => setSelectedProject(project)} />
        ))}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
};

export default ProjectsSection;