import React, { memo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { useGitHubProfile } from "../hooks/useGitHub";
import { floatLoop, revealIn } from "../utils/animations";

import { GitHubIcon, LinkedinIcon, InstagramIcon } from "./icons/BrandIcons";
import ResumeButton from "./ui/ResumeButton";

function Sidebar({
  isExpanded,
  isMobile,
  onCinematraphie,
  onContact,
  onToggleMobile,
}) {
  const { profile } = useGitHubProfile();
  const container = useRef();
  const yearsExp = profile?.yearsExperience || 3;

  useGSAP(
    () => {
      revealIn(
        ".card-eyebrow, .sidebar-top, .sidebar-actions, .card-socials .social-link",
        {
          stagger: 0.08,
          duration: 0.58,
        },
      );

      floatLoop(".photo-bg");
    },
    { scope: container },
  );

  const avatarNode = profile?.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt="GitHub Avatar"
      className="github-avatar"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "20px",
      }}
    />
  ) : (
    <div className="avatar-silhouette" aria-label="Avatar">
      <svg
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="100" cy="82" rx="48" ry="54" fill="#0a0a0a" />
        <rect x="82" y="128" width="36" height="26" rx="8" fill="#0a0a0a" />
        <path
          d="M10 260 Q20 165 100 155 Q180 165 190 260Z"
          fill="#0a0a0a"
        />
      </svg>
    </div>
  );

  return (
    <aside className={`sidebar${isMobile ? " sidebar--mobile" : ""}`} ref={container}>
      <div
        className={`sidebar-card${isMobile ? " sidebar-card--mobile" : ""}${
          isMobile && !isExpanded ? " is-collapsed" : ""
        }`}
      >
        {isMobile ? (
          <button
            type="button"
            className="mobile-profile-toggle"
            onClick={onToggleMobile}
            aria-expanded={isExpanded}
          >
            <span className="mobile-profile-summary">
              <span className="mobile-profile-avatar">{avatarNode}</span>
              <span className="mobile-profile-copy">
                <strong>{profile?.name || "Shivanesh MC"}</strong>
                <small>Full Stack & Cloud Engineer</small>
              </span>
            </span>
            <ChevronDown className="mobile-toggle-icon" size={18} />
          </button>
        ) : null}

        <div className="sidebar-body">
          <p className="card-eyebrow">Shivanesh MC / Portfolio</p>

          <div className="sidebar-top">
            <div className="photo-block">
              <div className="photo-bg">{avatarNode}</div>
            </div>

            <div className="sidebar-intro">
              <p className="card-name">{profile?.name || "Shivanesh MC"}</p>
              <p className="card-role">Full Stack & Cloud Engineer</p>
              <p className="card-bio">
                3rd Year CSE Undergrad | WebD | Mobile App developer | Aspiring
                Cloud Engineer
              </p>

              <div className="sidebar-meta">
                <div className="meta-item">
                  <span>Experience</span>
                  <strong>{yearsExp}+ years</strong>
                </div>
                <div className="meta-item">
                  <span>Repositories</span>
                  <strong>{profile?.public_repos ?? "--"}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-actions">
            <ResumeButton />

            <div className="action-buttons">
              <button
                type="button"
                className="action-btn editing-btn"
                onClick={() => onCinematraphie?.()}
              >
                <div className="button-outer">
                  <div className="button-inner">
                    <span>Open Cinematraphie</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="action-btn connect-btn"
                onClick={() => onContact?.()}
              >
                <div className="button-outer">
                  <div className="button-inner">
                    <span>Contact</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="card-socials">
            <a
              href="https://github.com/shivanesh1495"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="social-link github"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://linkedin.com/in/shivaneshmc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="social-link linkedin"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://instagram.com/shivanesh_1495"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-link instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
