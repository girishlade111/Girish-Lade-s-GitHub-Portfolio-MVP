
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Github, ExternalLink, Star, GitBranch, GitCommit, Loader2, AlertTriangle, Link2 } from 'lucide-react';
import type { Project, GitHubCommit } from '../types';
import { fetchGitHubAPI } from '../utils/api';
import { PROJECTS } from '../constants';

const timeAgo = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
  
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
  
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  
    if (seconds < 10) return "just now";
  
    return `${Math.floor(seconds)} seconds ago`;
};

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    onSelectProject: (project: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSelectProject }) => {
    const [commits, setCommits] = useState<GitHubCommit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [handleKeyDown]);

    const fetchCommits = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const repoPath = new URL(project.githubUrl).pathname;
            const data = await fetchGitHubAPI(`/repos${repoPath}/commits?per_page=5`);
            setCommits(data);
        } catch (err: any) {
            console.error("Failed to fetch commits:", err);
            setError('Could not load recent commits. This might be due to GitHub API rate limits. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [project.githubUrl]);

    useEffect(() => {
        fetchCommits();
    }, [fetchCommits]);

    const relatedProjects = useMemo(() => {
        const currentTags = new Set(project.tags);
        const currentLang = project.language;

        return PROJECTS
            .filter(p => p.name !== project.name) // Exclude self
            .map(p => {
                let score = 0;
                if (p.language === currentLang) {
                    score += 2; // Higher score for same language
                }
                p.tags.forEach(tag => {
                    if (currentTags.has(tag)) {
                        score += 1;
                    }
                });
                return { ...p, score };
            })
            .filter(p => p.score > 0) // Only include projects with some relation
            .sort((a, b) => b.score - a.score) // Sort by score
            .slice(0, 2); // Take top 2
    }, [project]);

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
        >
            <div 
                className="glass-card rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 md:p-6 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
                    <h2 id="project-modal-title" className="text-xl md:text-2xl font-bold text-white">{project.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                        <X className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="p-4 md:p-6 flex-grow overflow-y-auto">
                    <p className="text-gray-300 mb-6">{project.longDescription || project.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                        {project.stars !== undefined && <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> {project.stars} Stars</span>}
                        {project.forks !== undefined && <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4" /> {project.forks} Forks</span>}
                    </div>

                    <div className="mb-6">
                        <h4 className="font-bold text-white mb-3">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span key={tag} className="bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-jetbrains font-medium px-2.5 py-1 rounded-full">
                                {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-bold text-white mb-4">Recent Commits</h4>
                        {isLoading && (
                            <div className="flex items-center justify-center p-8 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                                <span>Loading commits...</span>
                            </div>
                        )}
                        {error && (
                             <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-3 rounded-md">
                                <AlertTriangle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        )}
                        {!isLoading && !error && (
                            <ul className="space-y-4">
                                {commits.map(commit => (
                                    <li key={commit.sha} className="flex gap-4">
                                        <div className="text-[#00AEEF] pt-1"><GitCommit className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-white truncate" title={commit.commit.message}>{commit.commit.message.split('\n')[0]}</p>
                                            <p className="text-gray-400 text-sm">
                                                <a href={commit.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{commit.sha.substring(0, 7)}</a>
                                                {' '}by {commit.commit.author.name} &bull; {timeAgo(commit.commit.author.date)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {relatedProjects.length > 0 && (
                        <div>
                            <h4 className="font-bold text-white mb-4">Related Projects</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {relatedProjects.map(related => (
                                    <button
                                        key={related.name}
                                        onClick={() => onSelectProject(related)}
                                        className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-[#00AEEF]/50 transition-all text-left group"
                                    >
                                        <p className="font-bold text-white group-hover:text-[#00AEEF] transition-colors">{related.name}</p>
                                        <p className="text-sm text-gray-400 mt-1 truncate">{related.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                 <footer className="p-4 md:p-6 border-t border-gray-700/50 flex-shrink-0 flex items-center justify-end gap-4">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-md text-white transition-colors text-sm font-medium">
                        <Github className="w-4 h-4" /> View on GitHub
                    </a>
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/90 hover:bg-[#00AEEF] rounded-md text-white transition-colors text-sm font-medium">
                            <ExternalLink className="w-4 h-4" /> Live Demo
                        </a>
                    )}
                </footer>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ProjectModal;
