const GITHUB_USERNAME = "shivanesh1495";
const PORTFOLIO_TOPIC = "portfolio";
const DATA_REPO_OWNER = "shivanesh1495";
const DATA_REPO_NAME = "PORTFOLIO-DB";
const DATA_REPO_BRANCH = "main";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function fetchRepoFolderFiles(folder) {
  const url = `https://api.github.com/repos/${DATA_REPO_OWNER}/${DATA_REPO_NAME}/contents/${folder}?ref=${DATA_REPO_BRANCH}`;
  const files = await fetchJson(url);

  if (!Array.isArray(files)) {
    throw new Error(`Expected a file list from ${folder}`);
  }

  return files.filter(
    (file) => file.type === "file" && file.name.endsWith(".txt"),
  );
}

function parseStructuredTextFile(content) {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    try {
      // The data files are maintained as simple object literals.
      return new Function(`return (${trimmed});`)();
    } catch (error) {
      throw new Error(`Failed to parse data file: ${error.message}`);
    }
  }
}

async function fetchStructuredFile(downloadUrl) {
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }

  const text = await response.text();
  return parseStructuredTextFile(text);
}

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

export async function fetchGitHubWritings() {
  try {
    const files = await fetchRepoFolderFiles("writings");
    const writings = await Promise.all(
      files.map(async (file) => {
        const data = await fetchStructuredFile(file.download_url);
        return {
          id: file.sha || file.name,
          slug: file.name.replace(/\.txt$/i, ""),
          ...data,
        };
      }),
    );

    return writings.sort((a, b) => {
      const aDate = Date.parse(a.date || 0);
      const bDate = Date.parse(b.date || 0);
      return bDate - aDate;
    });
  } catch (error) {
    console.error("Error fetching writings:", error);
    return [];
  }
}

export async function fetchGitHubExperience() {
  try {
    const files = await fetchRepoFolderFiles("experience");
    const experience = await Promise.all(
      files.map(async (file) => {
        const data = await fetchStructuredFile(file.download_url);
        return {
          id: file.sha || file.name,
          slug: file.name.replace(/\.txt$/i, ""),
          ...data,
        };
      }),
    );

    return experience;
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}
