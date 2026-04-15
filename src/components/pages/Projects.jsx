import React, { memo, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Search } from "lucide-react";
import { useGitHubProjects } from "../../hooks/useGitHub";
import { revealIn } from "../../utils/animations";
import ProjectCard from "../ui/ProjectCard";

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="projects-grid">
      {[1, 2, 3, 4].map((i) => (
        <div className="project-card skeleton" key={i}>
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
  const container = useRef();

  const FILTERS = useMemo(() => {
    const stacks = new Set(["all"]);
    projects.forEach((p) => p.stacks.forEach((s) => stacks.add(s)));
    return Array.from(stacks).sort();
  }, [projects]);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const visible = useMemo(
    () =>
      projects.filter((p) => {
        const matchesFilter = filter === "all" || p.stacks.includes(filter);
        const matchesQuery =
          !normalizedQuery ||
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.desc.toLowerCase().includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    [projects, filter, normalizedQuery],
  );

  useGSAP(
    () => {
      if (!loading && visible.length > 0) {
        revealIn(".card-container", {
          y: 20,
          duration: 0.5,
          stagger: 0.1,
        });
      }
    },
    { dependencies: [visible, loading], scope: container },
  );

  return (
    <div className="projects-page" ref={container}>
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects by title, stack, or description"
        />
      </div>

      <div className="filter-chips">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
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
          {visible.map((p) => (
            <div key={p.id} className="card-container">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Projects);
