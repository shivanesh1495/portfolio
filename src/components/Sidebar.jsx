import React, { memo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useGitHubProfile } from "../hooks/useGitHub";
import { floatLoop, revealIn } from "../utils/animations";

import { GitHubIcon, LinkedinIcon, InstagramIcon } from "./icons/BrandIcons";
import ResumeButton from "./ui/ResumeButton";

function Sidebar() {
  const { profile } = useGitHubProfile();
  const container = useRef();

  useGSAP(
    () => {
      revealIn(
        ".photo-block, .card-name, .flame-row, .card-bio, .Documents-btn, .card-socials .social-link",
        {
          stagger: 0.08,
          duration: 0.58,
        },
      );

      floatLoop(".photo-bg");
    },
    { scope: container },
  );

  return (
    <aside className="sidebar" ref={container}>
      <div className="sidebar-card">
        {/* ── Top dashed orange arc ── */}

        {/* ── Photo block ── */}
        <div className="photo-block">
          <div className="photo-bg">
            {profile?.avatar_url ? (
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
                  {/* Head */}
                  <ellipse cx="100" cy="82" rx="48" ry="54" fill="#0a0a0a" />
                  {/* Neck */}
                  <rect
                    x="82"
                    y="128"
                    width="36"
                    height="26"
                    rx="8"
                    fill="#0a0a0a"
                  />
                  {/* Shoulders */}
                  <path
                    d="M10 260 Q20 165 100 155 Q180 165 190 260Z"
                    fill="#0a0a0a"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ── Name ── */}
        <p className="card-name">
          {profile?.name ? profile.name.toUpperCase() : "SHIVANESH MC"}
        </p>

        {/* ── Action buttons ── */}
        <ResumeButton />

        <div className="action-buttons">
          <a href="#" className="action-btn editing-btn">
            <div className="button-outer">
              <div className="button-inner">
                <span>Editing Profile</span>
              </div>
            </div>
          </a>
          <a href="#" className="action-btn connect-btn">
            <div className="button-outer">
              <div className="button-inner">
                <span>Get In Touch</span>
              </div>
            </div>
          </a>
        </div>

        {/* ── Social icons ── */}
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
    </aside>
  );
}

export default memo(Sidebar);
