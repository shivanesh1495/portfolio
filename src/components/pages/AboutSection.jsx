import React, { memo } from "react";
import { useGitHubProfile } from "../../hooks/useGitHub";

function AboutSection() {
  const { profile } = useGitHubProfile();
  const yearsExp = profile?.yearsExperience || 3;
  const repositories = profile?.public_repos || 15;
  const followers = profile?.followers ?? "--";
  const joinedYear = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : 2023;

  return (
    <div className="about-page">
      <article className="about-card">
        <h2 className="about-heading">About</h2>
        <div className="about-copy">
          <p>
            Full-stack developer with a bias for clean code and a passion for
            building tools that solve real problems. Currently exploring systems
            programming with Go while shipping web apps that actually matter.
          </p>
          <p>
            I believe in shipping fast and iterating faster, turning complex
            problems into elegant, minimal solutions. Always at the
            intersection of backend engineering and thoughtful design.
          </p>
        </div>
      </article>

      <div className="home-stats-grid about-stats-grid">
        <div className="stat-card">
          <div className="stat-number">{yearsExp}+</div>
          <div className="stat-text">Years of active build experience</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{repositories}</div>
          <div className="stat-text">Public repositories in motion</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{followers}</div>
          <div className="stat-text">Followers tracking the journey</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{joinedYear}</div>
          <div className="stat-text">GitHub presence since</div>
        </div>
      </div>
    </div>
  );
}

export default memo(AboutSection);
