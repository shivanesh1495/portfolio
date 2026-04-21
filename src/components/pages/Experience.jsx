import React, { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubExperience } from "../../hooks/useGitHub";

function Experience() {
  const { experience, loading, error } = useGitHubExperience();

  return (
    <div className="content-block">
      <header className="section-header">
        <h2 className="section-title-display">Industry</h2>
        <p className="section-copy section-copy--muted">
          Roles shaped across product, design-aware engineering, and systems
          delivery.
        </p>
      </header>

      {loading ? (
        <div className="section-card section-state">
          <p>Loading experience from GitHub...</p>
        </div>
      ) : error ? (
        <div className="section-card section-state section-state--error">
          <p>Error loading experience: {error}</p>
        </div>
      ) : (
        <div className="experience-list">
          {experience.map((item, index) => (
            <article
              className="section-card section-card--tight"
              key={item.id || item.slug || index}
            >
              <div className="experience-card__top">
                <div className="experience-copy">
                  <p className="experience-company">{item.company}</p>
                  <span className="experience-role">{item.role}</span>
                </div>
                <ArrowUpRight size={18} className="card-arrow" />
              </div>

              <p className="experience-description">{item.desc}</p>
              <span className="experience-period">{item.period}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Experience);
