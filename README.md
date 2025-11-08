# Girish Lade's GitHub Portfolio

This repository contains the source code for my personal portfolio website. It's a modern, responsive, and fast single-page application designed to showcase my GitHub profile, pinned projects, and contributions in a visually appealing way.

The portfolio is built with static data to ensure maximum reliability and performance, avoiding issues with API rate limits and ensuring the site is always available.

---

## ✨ Key Features

*   **Curated Stats & Projects:** Displays key statistics and a hand-picked selection of pinned projects to highlight my most important work.
*   **Live Contribution Graph:** Embeds the GitHub contributions chart for a visual overview of my activity.
*   **Interactive UI:** Features a typing animation for my roles, project filtering by technology, and smooth hover effects.
*   **Responsive Design:** A mobile-first approach ensures a seamless experience across all devices, from phones to desktops.
*   **Modern Aesthetics:** Utilizes a sleek dark theme with "glassmorphism" card effects and a subtle background pattern.
*   **High Performance:** By using static data, the site loads instantly without relying on external API calls during runtime.

---

## 🚀 Tech Stack

*   **Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Font:** [Inter](https://fonts.google.com/specimen/Inter) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 🛠️ How It Works & Customization Guide

This project is designed to be easily customized for your own portfolio. Here’s a guide to get you started:

### 1. **Fork the Repository**

Start by forking this repository to your own GitHub account.

### 2. **Update Personal Information**

All personal data and configuration are centralized for easy editing. To adapt the portfolio for your profile, follow these steps:

*   **`constants.tsx`**: This is the main configuration file.
    *   Update the `STATS` array with your own GitHub statistics.
    *   Update the `PROJECTS` array with your own pinned repositories. You can get details like stars and forks from your repository pages.
    *   Update the `SOCIAL_LINKS` array with your own social media URLs.

*   **`components/HeroSection.tsx`**:
    *   Change the `avatarUrl` to the URL of your GitHub profile picture (e.g., `https://github.com/your-username.png`).
    *   Update the `ROLES` array to reflect your skills and titles.
    *   Update the main heading and subheading with your name and bio.

*   **`components/AboutSection.tsx`**:
    *   Update the "About Me" paragraph with your own introduction.

*   **`components/ContributionsSection.tsx`**:
    *   Change the username `girishlade111` in the `src` URL for the GitHub contributions chart to your own.

*   **`index.html`**:
    *   Update the `<title>` tag with your name.

*   **`metadata.json`**:
    *   Update the `name` and `description` of the application.

### 3. **Deploy**

Once you've made these changes, you can deploy the website to your preferred hosting platform (like Vercel, Netlify, or GitHub Pages).

---

This project was built with a clean and component-based architecture, making it easy to understand, modify, and extend. Enjoy building your portfolio!