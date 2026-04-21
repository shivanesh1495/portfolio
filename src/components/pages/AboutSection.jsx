import React, { memo, useEffect, useState } from "react";
import { useGitHubProfile } from "../../hooks/useGitHub";
import { fetchGitHubBio } from "../../services/github";

const FALLBACK_BIO_PARAGRAPHS = [
  "Full-stack developer with a bias for clean code and a passion for building tools that solve real problems. Currently exploring systems programming with Go while shipping web apps that actually matter.",
  "I believe in shipping fast and iterating faster, turning complex problems into elegant, minimal solutions. Always at the intersection of backend engineering and thoughtful design.",
];

function AboutSection() {
  const { profile } = useGitHubProfile();
  const [bioParagraphs, setBioParagraphs] = useState(FALLBACK_BIO_PARAGRAPHS);
  const yearsExp = profile?.yearsExperience || 3;
  const repositories = profile?.public_repos || 15;
  const joinedYear = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : 2023;

  useEffect(() => {
    let cancelled = false;

    async function loadBio() {
      try {
        const bioText = await fetchGitHubBio();
        const parsedParagraphs = bioText
          .split(/\r?\n\s*\r?\n/g)
          .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
          .filter(Boolean);

        if (!cancelled && parsedParagraphs.length > 0) {
          setBioParagraphs(parsedParagraphs);
        }
      } catch {
        // Keep fallback copy when remote fetch fails.
      }
    }

    loadBio();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="scene scene--about">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">01</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body scene__body--about">
        <div className="scene__lead">
          <header className="scene__intro">
            <h2 className="section-title-serif">About</h2>
            <p className="scene__description">
              I design and build digital products that are both technically
              robust and visually compelling.
            </p>
          </header>

          <div className="section-copy section-copy--spacious about-copy">
            {bioParagraphs.map((paragraph, index) => (
              <p key={`about-bio-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="about-metrics" role="list" aria-label="About metrics">
            <div className="about-metric" role="listitem">
              <span>Experience</span>
              <strong>{yearsExp}+</strong>
              <small>Years</small>
            </div>
            <div className="about-metric" role="listitem">
              <span>Repositories</span>
              <strong>{repositories}+</strong>
              <small>Shipped work</small>
            </div>
            <div className="about-metric" role="listitem">
              <span>Focused Since</span>
              <strong>{joinedYear}</strong>
              <small>Building systems</small>
            </div>
          </div>
        </div>

        <div className="about-visual" aria-hidden="true">
          <div className="about-orb">
            <span className="about-orb__ring about-orb__ring--1" />
            <span className="about-orb__ring about-orb__ring--2" />
            <span className="about-orb__ring about-orb__ring--3" />
            <span className="about-orb__core" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AboutSection);
