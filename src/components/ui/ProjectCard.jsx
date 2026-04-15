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
      <div className="card-container noselect">
        <div className="canvas">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`tracker tr-${i + 1}`}></div>
          ))}
          <div className="card-3d project-card">
            <div className="project-card-top">
              <h3>{project.title}</h3>
              <ArrowUpRight size={17} className="card-arrow" />
            </div>
            <p>{project.desc}</p>
            <div className="card-footer">
              <div className="card-tags">
                {project.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
