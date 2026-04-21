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
    <div className="content-block">
     
        <h2 className="section-title-serif">About</h2>

        <div className="section-copy section-copy--spacious">
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

        <div className="about-stats">
          <div className="mini-stat">
            <span>Experience</span>
            <strong>{yearsExp}+</strong>
          </div>
          <div className="mini-stat">
            <span>Repositories</span>
            <strong>{repositories}</strong>
          </div>
          <div className="mini-stat">
            <span>Followers</span>
            <strong>{followers}</strong>
          </div>
          <div className="mini-stat">
            <span>Since</span>
            <strong>{joinedYear}</strong>
          </div>
        </div>
    </div>
  );
}

export default memo(AboutSection);
