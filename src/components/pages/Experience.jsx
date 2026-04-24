import React, { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubExperience } from "../../hooks/useGitHub";

function Experience() {
  const { experience, loading, error } = useGitHubExperience();

  return (
    <div className="scene scene--experience">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">03</span>
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
                    <ArrowUpRight
                      size={18}
                      className="experience-entry__arrow"
                    />
                  </div>

                  <p className="experience-description">{item.desc}</p>
                  <span className="experience-period">{item.period}</span>
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
