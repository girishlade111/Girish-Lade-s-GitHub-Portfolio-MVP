import React, { useState, useEffect } from 'react';
import { STATS } from '../constants';
import type { Stat } from '../types';

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
  <div className="glass-card rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#00AEEF]/50 hover:-translate-y-1">
    {stat.icon}
    <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stat.value}</p>
    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
  </div>
);

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

        const [userRes, prRes, issueRes, commitRes] = await Promise.all([
          fetch('https://api.github.com/users/girishlade111'),
          fetch('https://api.github.com/search/issues?q=author:girishlade111+is:pr'),
          fetch('https://api.github.com/search/issues?q=author:girishlade111+is:issue'),
          fetch(`https://api.github.com/search/commits?q=author:girishlade111+author-date:>${dateString}`, {
            headers: {
              'Accept': 'application/vnd.github.cloak-preview+json'
            }
          })
        ]);

        const userData = await userRes.json();
        const prData = await prRes.json();
        const issueData = await issueRes.json();
        const commitData = await commitRes.json();
        
        let allRepos = [];
        let page = 1;
        let reposData;
        do {
          const reposRes = await fetch(`https://api.github.com/users/girishlade111/repos?per_page=100&page=${page}`);
          if (!reposRes.ok) break;
          reposData = await reposRes.json();
          if (Array.isArray(reposData)) {
            allRepos = allRepos.concat(reposData);
          }
          page++;
        } while (Array.isArray(reposData) && reposData.length === 100);

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