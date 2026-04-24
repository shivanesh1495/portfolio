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

export async function fetchGitHubProjects() {
  try {
    const files = await fetchDatabaseFolderFiles("projects");

    return Promise.all(
      files.map(async (file, index) => {
        const data = await fetchStructuredFile(file.loader);
        const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");

        return {
          id: data.id || file.relativePath || `${index + 1}`,
          title: data.title || formatRepositoryAssetName(nameWithoutExt),
          desc: data.desc || "No description provided.",
          tags: Array.isArray(data.tags) ? data.tags : [],
          stacks: Array.isArray(data.stacks) ? data.stacks : [],
          stars: Number.isFinite(data.stars) ? data.stars : 0,
          forks: Number.isFinite(data.forks) ? data.forks : 0,
          url: data.url || data.link || data.href || "#",
        };
      }),
    );
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
    const files = await fetchDatabaseFolderFiles("experience");
    const experience = await Promise.all(
      files.map(async (file) => {
        const data = await fetchStructuredFile(file.loader);
        return {
          id: file.relativePath || file.name,
          slug: file.name.replace(/\.txt$/i, ""),
          ...data,
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
