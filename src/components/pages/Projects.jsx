import React, { memo, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubProjects } from "../../hooks/useGitHub";

function Projects() {
  const { projects, loading, error } = useGitHubProjects();
  const featuredProjects = useMemo(() => projects.slice(0, 4), [projects]);

  return (
    <div className="content-block">
      <header className="section-header">
        <h2 className="section-title-display">Projects</h2>
        <p className="section-copy section-copy--muted">
          A curated set of builds automagically synced from GitHub.
        </p>
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
          <p>Loading featured projects...</p>
        </div>
      ) : error ? (
        <div className="section-card section-state section-state--error">
          <p>Error loading projects: {error}</p>
        </div>
      ) : featuredProjects.length === 0 ? (
        <div className="section-card section-state">
          <p>No projects are available right now.</p>
        </div>
      ) : (
        <div className="project-grid">
          {featuredProjects.map((project) => (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="project-card"
              key={project.id}
            >
              <div className="project-card__top">
                <h3>{project.title}</h3>
                <ArrowUpRight size={18} className="card-arrow" />
              </div>

              <p className="project-card__copy">{project.desc}</p>

              <div className="tag-row">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Projects);
