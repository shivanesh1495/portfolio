import React, { memo, useMemo } from "react";
import { useGitHubProjects } from "../../hooks/useGitHub";

function Projects() {
  const { projects, loading, error } = useGitHubProjects();
  const marqueeProjects = useMemo(() => projects, [projects]);

  return (
    <div className="content-block">
      <header className="section-header">
        <h2 className="section-title-display">Projects</h2>
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
        <div className="section-card section-state">
          <p>Loading projects...</p>
        </div>
      ) : error ? (
        <div className="section-card section-state section-state--error">
          <p>Error loading projects: {error}</p>
        </div>
      ) : marqueeProjects.length === 0 ? (
        <div className="section-card section-state">
          <p>No projects are available right now.</p>
        </div>
      ) : (
        <div
          className="project-marquee"
          aria-label="GitHub repositories marquee"
        >
          {[0, 1].map((lane) => (
            <div
              className="project-marquee__lane"
              aria-hidden={lane === 1}
              key={`lane-${lane}`}
            >
              {marqueeProjects.map((project) => (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card project-card--marquee"
                  key={`${lane}-${project.id}`}
                >
                  <h3>{project.title}</h3>

                  <p className="project-card__copy">{project.desc}</p>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Projects);
