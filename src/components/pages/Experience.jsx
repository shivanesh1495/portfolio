import React, { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubExperience } from "../../hooks/useGitHub";

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
  NodeJS: "nodejs/nodejs-original.svg",
  Express: "express/express-original.svg",
  "Express.js": "express/express-original.svg",
  HTML: "html5/html5-original.svg",
  CSS: "css3/css3-original.svg",
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
  Shopify: "/shopify_glyph.svg",
  "Android Studio": "androidstudio/androidstudio-original.svg",
  Firebase: "firebase/firebase-original.svg",
  MATLAB: "matlab/matlab-original.svg",
  PostgreSQL: "postgresql/postgresql-original.svg",
  Whatsapp: "https://cdn.simpleicons.org/whatsapp/25D366",
};

function resolveIconSrc(path) {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${DEVICON_BASE}/${path}`;
}

function Experience() {
  const { experience, loading, error } = useGitHubExperience();

  return (
    <div className="scene scene--experience">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">04</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-display">Industry Experience</h2>
            <p className="scene__description">
              Roles shaped across product, design-aware engineering, and systems
              delivery.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="scene-state">
            <p>Loading experience...</p>
          </div>
        ) : error ? (
          <div className="scene-state section-state--error">
            <p>Error loading experience: {error}</p>
          </div>
        ) : (
          <div className="experience-stage">
            <div className="experience-timeline">
              {experience.map((item, index) => (
                <article
                  className="experience-entry"
                  key={item.id || item.slug || index}
                >
                  <div className="experience-entry__top">
                    <div className="experience-copy">
                      <p className="experience-company">{item.company}</p>
                      <span className="experience-role">{item.role}</span>
                    </div>
                  </div>

                  <p className="experience-description">{item.desc}</p>
                  <span className="experience-period">{item.period}</span>

                  {item.associatedProjects?.length > 0 && (
                    <div className="experience-projects">
                      <h4 className="experience-projects__title">
                        Key Projects
                      </h4>
                      <div className="experience-projects__grid">
                        {item.associatedProjects.map((project) => (
                          <div
                            key={project.id}
                            className="experience-project-card"
                          >
                            <div className="experience-project-card__content">
                              <div className="experience-project-card__header">
                                <h5>{project.title}</h5>
                              </div>
                              <p>{project.desc}</p>
                              <div className="experience-project-card__stacks">
                                {project.stacks?.map((stack) => {
                                  const iconKey =
                                    Object.keys(ICON_PATHS).find(
                                      (key) =>
                                        key.toLowerCase() ===
                                        stack.toLowerCase(),
                                    ) || stack;
                                  const src = resolveIconSrc(
                                    ICON_PATHS[iconKey],
                                  );
                                  if (!src) return null;
                                  return (
                                    <img
                                      key={stack}
                                      src={src}
                                      alt={stack}
                                      title={stack}
                                      className="experience-project-card__stack-icon"
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Experience);
