import React, { memo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useGitHubProfile } from "../../hooks/useGitHub";
import { revealIn } from "../../utils/animations";

function Home() {
  const { profile } = useGitHubProfile();

  // Default values while loading
  const yearsExp = profile?.yearsExperience || 3;
  const projects = profile?.public_repos || 15;

  const container = useRef();

  useGSAP(
    () => {
      revealIn(".home-heading span, .stat-card", {
        y: 14,
        stagger: 0.09,
        duration: 0.52,
      });
    },
    { scope: container },
  );

  return (
    <div className="home-page" ref={container}>
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="home-heading">
            <span className="heading-line solid">FULL STACK</span>
            <span className="heading-line solid">& CLOUD </span>
            <span className="heading-line ghost">ENGINEER</span>
          </h1>
        </div>
      </div>

      <div className="home-stats-grid">
        <div className="stat-card">
          <div className="stat-number">{yearsExp}</div>
          <div className="stat-text">
            Years Into
            <br />
            Coding Journey
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">+{projects}</div>
          <div className="stat-text">
            Projects
            <br />
            Completed
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Home);
