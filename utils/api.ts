export const fetchGitHubAPI = async (endpoint: string, options: RequestInit = {}) => {
  const GITHUB_API_BASE = 'https://api.github.com';
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`;

  const baseHeaders = {
    'User-Agent': 'girishlade111-portfolio',
    'Accept': 'application/vnd.github.v3+json',
  };

  const headers = { ...baseHeaders, ...options.headers };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint} (${response.status})`);
  }

  return response.json();
};
