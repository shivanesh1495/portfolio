import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubExperience } from "../../hooks/useGitHub";

export default function Experience() {
  const { experience, loading, error } = useGitHubExperience();
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".exp-card", {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { scope: container, dependencies: [experience] },
  );

  return (
    <div className="experience-page" ref={container}>
      <h1 className="exp-hero-heading">
        <span className="solid">INDUSTRY</span>
        <span className="ghost">EXPERIENCE</span>
      </h1>

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
          {experience.map((exp, i) => (
            <div className="exp-card" key={exp.id || exp.slug || i}>
              <div className="exp-card-top">
                <div>
                  <p className="exp-company-name">{exp.company}</p>
                  <span className="exp-role-title">{exp.role}</span>
                </div>
                <ArrowUpRight size={20} className="exp-arrow-icon" />
              </div>
              <p className="exp-description">{exp.desc}</p>
              <span className="exp-period">{exp.period}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
