# Girish Lade's GitHub Portfolio

This repository contains the source code for my personal portfolio website. It's a modern, responsive, and dynamic single-page application designed to showcase my GitHub profile, pinned projects, and contributions in a visually appealing way.

The entire portfolio is built to be data-driven, pulling most of the information directly from the GitHub API in real-time.

---

## ✨ Key Features

*   **Dynamic GitHub Stats:** Automatically fetches and displays real-time statistics like stars earned, total commits, PRs, issues, and public repositories.
*   **Pinned Projects Showcase:** Fetches data for pinned repositories, including descriptions, stars, forks, primary language, and last update time.
*   **Live Contribution Graph:** Embeds the GitHub contributions chart for a visual overview of my activity.
*   **Interactive UI:** Features a typing animation for my roles, project filtering by technology, and smooth hover effects.
*   **Responsive Design:** A mobile-first approach ensures a seamless experience across all devices, from phones to desktops.
*   **Modern Aesthetics:** Utilizes a sleek dark theme with "glassmorphism" card effects and a subtle background pattern.

---

## 🚀 Tech Stack

*   **Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **API:** [GitHub REST API](https://docs.github.com/en/rest)
*   **Font:** [Inter](https://fonts.google.com/specimen/Inter) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 🛠️ How It Works & Customization Guide

This project is designed to be easily customized for your own portfolio. Here’s a guide to get you started:

### 1. **Fork the Repository**

Start by forking this repository to your own GitHub account.

### 2. **Update Personal Information**

Most of the personal data and configuration is centralized. To adapt the portfolio for your profile, you'll need to update the GitHub username `girishlade111` across the project.

*   **`constants.tsx`**:
    *   Update the `PROJECTS` array with your own pinned repositories. The script will fetch data based on the `githubUrl`.
    *   Update the `SOCIAL_LINKS` array with your own social media URLs.
    *   The `STATS` array provides the initial structure and fallback values. The GitHub API calls in `AboutSection.tsx` will update these values dynamically.

*   **`components/HeroSection.tsx`**:
    *   Change the username in the `fetchGitHubAPI('/users/girishlade111')` call to fetch your avatar.
    *   Update the `ROLES` array to reflect your skills and titles.
    *   Update the main heading and subheading with your name and bio.

*   **`components/AboutSection.tsx`**:
    *   Replace all instances of `girishlade111` in the API calls with your GitHub username.
    *   Update the "About Me" paragraph.

*   **`components/ProjectsSection.tsx`**:
    *   Update the API endpoint from `/repos/girishlade111/...` to use your username.

*   **`components/ContributionsSection.tsx`**:
    *   Change the username in the `src` URL for the GitHub contributions chart.

*   **`index.html`**:
    *   Update the `<title>` tag with your name.

*   **`metadata.json`**:
    *   Update the `name` and `description` of the application.

### 3. **Deploy**

Once you've made these changes, you can deploy the website to your preferred hosting platform (like Vercel, Netlify, or GitHub Pages).

---

This project was built with a clean and component-based architecture, making it easy to understand, modify, and extend. Enjoy building your portfolio!
