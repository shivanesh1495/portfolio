const GITHUB_USERNAME = "shivanesh1495";
const PORTFOLIO_TOPIC = "portfolio";

export async function fetchGitHubUserProfile() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
    );
    if (!response.ok) throw new Error("Failed to fetch user profile");

    const data = await response.json();

    // Calculate years of experience from 2023
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    const yearsExperience = currentYear - startYear;

    return {
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      yearsExperience: Math.max(yearsExperience, 1), // At least 1 year
      public_repos: data.public_repos,
      followers: data.followers,
      name: data.name,
      bio: data.bio,
    };
  } catch (error) {
    console.error("Error fetching GitHub user profile:", error);
    return null;
  }
}

export async function fetchGitHubProjects() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    );
    if (!response.ok) throw new Error("Failed to fetch repositories");

    const data = await response.json();

    // Filter by 'portfolio' topic if any exist
    let filtered = data.filter(
      (repo) => repo.topics && repo.topics.includes(PORTFOLIO_TOPIC),
    );

    // If no repos have the topic, fallback to all non-fork public repositories
    if (filtered.length === 0) {
      filtered = data.filter((repo) => !repo.fork);
    }

    return filtered.map((repo) => ({
      id: repo.id,
      title: repo.name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      desc: repo.description || "No description provided.",
      tags: [
        repo.language,
        ...(repo.topics || []).filter((t) => t !== PORTFOLIO_TOPIC),
      ].filter(Boolean),
      stacks: [
        repo.language,
        ...(repo.topics || []).filter((t) => t !== PORTFOLIO_TOPIC),
      ]
        .filter(Boolean)
        .map((t) => t.toLowerCase()),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
    }));
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return [];
  }
}
