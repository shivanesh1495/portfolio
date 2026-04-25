const TEXT_FILE_MODULES = import.meta.glob("../../database/**/*.txt", {
  query: "?raw",
  import: "default",
});

const RESUME_ASSET_MODULES = import.meta.glob(
  "../../database/resume/*.{pdf,png,jpg,jpeg,webp,svg}",
  { import: "default" },
);

const START_YEAR = 2023;

function getCurrentYearsExperience() {
  const yearsExperience = new Date().getFullYear() - START_YEAR;
  return Math.max(yearsExperience, 1);
}

function hasAllowedExtension(fileName, extensions) {
  const lowerName = fileName.toLowerCase();
  return extensions.some((extension) => lowerName.endsWith(extension));
}

function formatRepositoryAssetName(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toRelativeDatabasePath(modulePath) {
  return modulePath.replace(/^\.\.\/\.\.\/database\//, "").replace(/\\/g, "/");
}

function getFileNameFromPath(path) {
  return path.split("/").pop() || path;
}

async function fetchDatabaseFolderFiles(folder, extensions = [".txt"]) {
  const prefix = `${folder}/`;

  const entries = Object.keys(TEXT_FILE_MODULES)
    .map((modulePath) => {
      const relativePath = toRelativeDatabasePath(modulePath);
      const name = getFileNameFromPath(relativePath);

      return {
        relativePath,
        name,
        folder,
        loader: TEXT_FILE_MODULES[modulePath],
      };
    })
    .filter(
      (file) =>
        file.relativePath.startsWith(prefix) &&
        hasAllowedExtension(file.name, extensions),
    )
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  return entries;
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

async function fetchStructuredFile(loader) {
  const text = await loader();
  return parseStructuredTextFile(text);
}

export async function fetchGitHubBio() {
  const bioLoader = TEXT_FILE_MODULES["../../database/bio.txt"];

  if (!bioLoader) {
    throw new Error("Missing database/bio.txt");
  }

  return bioLoader();
}

export async function fetchGitHubUserProfile() {
  try {
    const profileFiles = await fetchDatabaseFolderFiles("profile");
    let profileData = {};

    if (profileFiles.length > 0) {
      profileData = await fetchStructuredFile(profileFiles[0].loader);
    }

    return {
      avatar_url: profileData.avatar_url || null,
      created_at: profileData.created_at || `${START_YEAR}-01-01T00:00:00Z`,
      yearsExperience:
        profileData.yearsExperience || getCurrentYearsExperience(),
      public_repos: profileData.public_repos || 15,
      followers: profileData.followers || 0,
      name: profileData.name || "Shivanesh",
      bio: profileData.bio || null,
    };
  } catch (error) {
    console.error("Error fetching local profile:", error);
    return null;
  }
}

export async function fetchGitHubProjects(options = {}) {
  const { includeHidden = false } = options;
  try {
    const files = await fetchDatabaseFolderFiles("projects");

    const projects = await Promise.all(
      files.map(async (file, index) => {
        const data = await fetchStructuredFile(file.loader);
        const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");

        return {
          id: data.id || file.relativePath || `${index + 1}`,
          title: data.title || formatRepositoryAssetName(nameWithoutExt),
          desc: data.desc || "No description provided.",
          tags: Array.isArray(data.tags) ? data.tags : [],
          stacks: Array.isArray(data.stacks)
            ? data.stacks
            : Array.isArray(data.tools)
              ? data.tools
              : [],
          stars: Number.isFinite(data.stars) ? data.stars : 0,
          forks: Number.isFinite(data.forks) ? data.forks : 0,
          url: data.url || data.link || data.href || "#",
          hideFromProjects: !!data.hideFromProjects,
        };
      }),
    );

    if (includeHidden) {
      return projects;
    }

    return projects.filter((p) => !p.hideFromProjects);
  } catch (error) {
    console.error("Error fetching local projects:", error);
    return [];
  }
}

export async function fetchGitHubWritings() {
  try {
    const files = await fetchDatabaseFolderFiles("writings");
    const writings = await Promise.all(
      files.map(async (file) => {
        const data = await fetchStructuredFile(file.loader);
        return {
          id: file.relativePath || file.name,
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
    console.error("Error fetching local writings:", error);
    return [];
  }
}

export async function fetchGitHubExperience() {
  try {
    const [experienceFiles, allProjects] = await Promise.all([
      fetchDatabaseFolderFiles("experience"),
      fetchGitHubProjects({ includeHidden: true }),
    ]);

    const experience = await Promise.all(
      experienceFiles.map(async (file) => {
        const data = await fetchStructuredFile(file.loader);

        // Resolve associated projects if any
        let associatedProjects = [];
        if (Array.isArray(data.projects)) {
          associatedProjects = data.projects
            .map((proj) => {
              if (typeof proj === "string") {
                // Find project by matching filename in its id or relativePath
                return allProjects.find(
                  (p) =>
                    p.id.endsWith(proj) ||
                    p.id === proj ||
                    p.title.toLowerCase() ===
                      proj.replace(".txt", "").toLowerCase(),
                );
              } else if (proj && typeof proj === "object") {
                // Inline project object - normalize to match project structure
                return {
                  id: proj.id || proj.title || Math.random().toString(36).substr(2, 9),
                  title: proj.title || "Untitled Project",
                  desc: proj.desc || "No description provided.",
                  url: proj.url || proj.link || proj.href || "#",
                  stacks: Array.isArray(proj.stacks)
                    ? proj.stacks
                    : Array.isArray(proj.tools)
                      ? proj.tools
                      : [],
                  ...proj,
                };
              }
              return null;
            })
            .filter(Boolean);
        }

        return {
          id: file.relativePath || file.name,
          slug: file.name.replace(/\.txt$/i, ""),
          ...data,
          associatedProjects,
        };
      }),
    );

    return experience;
  } catch (error) {
    console.error("Error fetching local experience:", error);
    return [];
  }
}

export async function fetchGitHubResume() {
  try {
    const files = await Promise.all(
      Object.entries(RESUME_ASSET_MODULES).map(async ([path, loader]) => {
        const relativePath = toRelativeDatabasePath(path);
        const name = getFileNameFromPath(relativePath);
        const url = await loader();

        return {
          id: relativePath,
          name,
          url,
        };
      }),
    );

    files.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true }),
    );

    if (files.length === 0) {
      return null;
    }

    const file = files[0];

    return {
      id: file.id,
      type: file.name.split(".").pop().toUpperCase(),
      previewUrl: file.url,
      url: file.url,
    };
  } catch (error) {
    console.error("Error fetching local resume:", error);
    return null;
  }
}
