import React, { memo, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useGitHubProjects } from "../../hooks/useGitHub";
import ProjectCard from "../ui/ProjectCard";

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="projects-grid">
      {[1, 2, 3, 4].map((item) => (
        <div className="project-card skeleton" key={item}>
          <div className="skeleton-line title"></div>
          <div className="skeleton-line desc"></div>
          <div className="skeleton-line tags"></div>
        </div>
      ))}
    </div>
  );
});

function Projects() {
  const { projects, loading, error } = useGitHubProjects();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filters = useMemo(() => {
    const stacks = new Set(["all"]);
    projects.forEach((project) =>
      project.stacks.forEach((stack) => stacks.add(stack)),
    );
    return Array.from(stacks).sort();
  }, [projects]);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        const matchesFilter =
          filter === "all" || project.stacks.includes(filter);
        const matchesQuery =
          !normalizedQuery ||
          project.title.toLowerCase().includes(normalizedQuery) ||
          project.desc.toLowerCase().includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    [projects, filter, normalizedQuery],
  );

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1 className="projects-hero-heading">
          <span className="solid">FEATURED</span>
          <span className="ghost">PROJECTS</span>
        </h1>
        <p className="page-subtitle">
          A curated set of builds automagically synced from GitHub.
        </p>
      </div>

      <div className="search-bar">
        <Search size={17} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects by title, stack, or description"
        />
      </div>

      <div className="filter-chips">
        {filters.map((item) => (
          <button
            key={item}
            className={`chip${filter === item ? " active" : ""}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="error-state">
          <p>Error loading projects: {error}</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <p>No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {visible.map((project) => (
            <div key={project.id} className="card-container">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Projects);
