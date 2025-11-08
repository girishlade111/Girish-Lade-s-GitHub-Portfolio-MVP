import React, { useState, useEffect } from 'react';
import { STATS } from '../constants';
import type { Stat } from '../types';
import { fetchGitHubAPI } from '../utils/api';

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const cardClasses = "glass-card rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#00AEEF]/50 hover:-translate-y-1";
  
  const cardContent = (
    <>
      {stat.icon}
      <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stat.value}</p>
      <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
    </>
  );

  if (stat.url) {
    return (
      <a href={stat.url} target="_blank" rel="noopener noreferrer" className={cardClasses}>
        {cardContent}
      </a>
    );
  }
  
  return <div className={cardClasses}>{cardContent}</div>;
};

const AboutSection: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>(STATS);

  useEffect(() => {
    const formatStatValue = (value: number | undefined) => {
      if (value === undefined) return '...';
      if (value >= 1000) {
        const formatted = (value / 1000).toFixed(value % 1000 !== 0 ? 1 : 0);
        return `${formatted}K`;
      }
      return value.toString();
    };

    const fetchStats = async () => {
      try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateString = oneYearAgo.toISOString().split('T')[0];

        const [userData, prData, issueData, commitData] = await Promise.all([
          fetchGitHubAPI('/users/girishlade111'),
          fetchGitHubAPI(`/search/issues?q=author:girishlade111+is:pr`),
          fetchGitHubAPI(`/search/issues?q=author:girishlade111+is:issue`),
          fetchGitHubAPI(`/search/commits?q=author:girishlade111+author-date:>${dateString}`, {
            headers: {
              'Accept': 'application/vnd.github.cloak-preview+json'
            }
          })
        ]);
        
        let allRepos: any[] = [];
        let page = 1;
        while (true) {
          try {
            const reposData = await fetchGitHubAPI(`/users/girishlade111/repos?per_page=100&page=${page}`);
            if (Array.isArray(reposData) && reposData.length > 0) {
              allRepos = allRepos.concat(reposData);
              if (reposData.length < 100) break; // Last page
              page++;
            } else {
              break; // No more repos or not an array
            }
          } catch (error) {
            console.error(`Error fetching repository page ${page}:`, error);
            break; // Stop fetching on error
          }
        }

        const totalStars = allRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        setStats(prevStats => [
          { ...prevStats[0], value: formatStatValue(totalStars) },
          { ...prevStats[1], value: `${formatStatValue(commitData.total_count)}+` },
          { ...prevStats[2], value: formatStatValue(prData.total_count) },
          { ...prevStats[3], value: formatStatValue(issueData.total_count) },
          { ...prevStats[4], value: formatStatValue(userData.public_repos) },
          prevStats[5], // Contributions (static)
        ]);

      } catch (error) {
        console.error("Failed to fetch GitHub stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section id="about" className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        About Me
      </h2>
      <p className="text-center max-w-3xl text-gray-400 text-lg mb-12">
        I’m Girish Balaso Lade — a developer, designer, and AI enthusiast passionate about creating open-source tools and modern web experiences. I love mixing creativity with code to bring design to life.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
};

export default AboutSection;