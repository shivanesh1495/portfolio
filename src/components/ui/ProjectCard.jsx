import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="project-card-link"
    >
      <article className="project-card">
        <div className="project-card-top">
          <h3>{project.title}</h3>
          <ArrowUpRight size={17} className="card-arrow" />
        </div>
        <p>{project.desc}</p>
        <div className="card-footer">
          <div className="card-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </a>
  );
}
