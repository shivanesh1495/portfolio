import React, { memo, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubProjects } from "../../hooks/useGitHub";
import { useInView } from "../../hooks/useInView";

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
        <span className="scene__index">02</span>
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
