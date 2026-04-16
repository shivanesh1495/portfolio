import React, { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubExperience } from "../../hooks/useGitHub";

function Experience() {
  const { experience, loading, error } = useGitHubExperience();

  return (
    <div className="experience-page">
      <div className="page-header">
        <h1 className="exp-hero-heading">
          <span className="solid">INDUSTRY</span>
          <span className="ghost">EXPERIENCE</span>
        </h1>
        <p className="page-subtitle">
          Roles shaped across product, design-aware engineering, and systems
          delivery.
        </p>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading experience from GitHub...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error loading experience: {error}</p>
        </div>
      ) : (
        <div className="exp-list">
          {experience.map((item, index) => (
            <div className="exp-card" key={item.id || item.slug || index}>
              <div className="exp-card-top">
                <div>
                  <p className="exp-company-name">{item.company}</p>
                  <span className="exp-role-title">{item.role}</span>
                </div>
                <ArrowUpRight size={20} className="exp-arrow-icon" />
              </div>
              <p className="exp-description">{item.desc}</p>
              <span className="exp-period">{item.period}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Experience);
