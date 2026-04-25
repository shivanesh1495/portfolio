import React, { memo, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubProjects } from "../../hooks/useGitHub";
import { useInView } from "../../hooks/useInView";

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const ICON_PATHS = {
  "C++": "cplusplus/cplusplus-original.svg",
  Python: "python/python-original.svg",
  Java: "java/java-original.svg",
  C: "c/c-original.svg",
  Dart: "dart/dart-original.svg",
  Haskell: "haskell/haskell-original.svg",
  HTML5: "html5/html5-original.svg",
  CSS3: "css3/css3-original.svg",
  JavaScript: "javascript/javascript-original.svg",
  TypeScript: "typescript/typescript-original.svg",
  React: "react/react-original.svg",
  "Next.js": "nextjs/nextjs-original.svg",
  "Node.js": "nodejs/nodejs-original.svg",
  HTML: "html5/html5-original.svg",
  HTML5: "html5/html5-original.svg",
  CSS: "css3/css3-original.svg",
  CSS3: "css3/css3-original.svg",
  Tailwind: "tailwindcss/tailwindcss-original.svg",
  "Tailwind CSS": "tailwindcss/tailwindcss-original.svg",
  Vite: "vitejs/vitejs-original.svg",
  GSAP: "https://cdn.simpleicons.org/greensock/88CE02",
  Framer: "framer/framer-original.svg",
  "Framer Motion": "framer/framer-original.svg",
  Remix: "remix/remix-original.svg",
  "Three.js": "threejs/threejs-original.svg",
  MongoDB: "mongodb/mongodb-original.svg",
  MySQL: "mysql/mysql-original.svg",
  Flutter: "flutter/flutter-original.svg",
  Git: "git/git-original.svg",
  Linux: "linux/linux-original.svg",
  Arduino: "arduino/arduino-original.svg",
  "Visual Studio Code": "vscode/vscode-original.svg",
  Eclipse: "eclipse/eclipse-original.svg",
  Postman: "postman/postman-original.svg",
  Figma: "figma/figma-original.svg",
  shopify: "/shopify_glyph.svg",
  "Android Studio": "androidstudio/androidstudio-original.svg",
  Firebase: "firebase/firebase-original.svg",
  MATLAB: "matlab/matlab-original.svg",
};

function resolveIconSrc(path) {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${DEVICON_BASE}/${path}`;
}

function Projects() {
  const { projects, loading, error } = useGitHubProjects();
  const { targetRef, isInView } = useInView();
  const marqueeProjects = useMemo(() => {
    if (projects.length === 0) {
      return [];
    }

    const visibleProjects = projects.slice(0, 6);
    return [...visibleProjects, ...visibleProjects];
  }, [projects]);

  return (
    <div className="scene scene--projects">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">03</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-display">Projects</h2>
            <p className="scene__description">
              Selected repositories, backend experiments, and products shaped
              through systems thinking.
            </p>
          </div>
          <a
            className="section-link"
            href="https://github.com/shivanesh1495?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            View all repositories
          </a>
        </header>

        {loading ? (
          <div className="scene-state">
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="scene-state section-state--error">
            <p>Error loading projects: {error}</p>
          </div>
        ) : marqueeProjects.length === 0 ? (
          <div className="scene-state">
            <p>No projects are available right now.</p>
          </div>
        ) : (
          <div
            className={`projects-marquee${isInView ? " is-active" : ""}`}
            ref={targetRef}
            aria-label="Project repositories"
          >
            <div className="projects-marquee__track">
              {marqueeProjects.map((project, index) => (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="project-row"
                  key={`${project.id}-${index}`}
                >
                  <span className="project-row__index">
                    {String(
                      (index % (marqueeProjects.length / 2)) + 1,
                    ).padStart(2, "0")}
                  </span>

                  <div className="project-row__content">
                    <div className="project-row__top">
                      <h3>{project.title}</h3>
                      <ArrowUpRight size={18} className="project-row__arrow" />
                    </div>

                    <p className="project-row__copy">{project.desc}</p>

                    <div className="project-row__stacks">
                      {project.stacks?.map((stack) => {
                        // Case-insensitive lookup
                        const iconKey =
                          Object.keys(ICON_PATHS).find(
                            (key) => key.toLowerCase() === stack.toLowerCase(),
                          ) || stack;

                        const src = resolveIconSrc(ICON_PATHS[iconKey]);
                        if (!src) return null;
                        return (
                          <img
                            key={stack}
                            src={src}
                            alt={stack}
                            title={stack}
                            className="project-row__stack-icon"
                          />
                        );
                      })}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Projects);
