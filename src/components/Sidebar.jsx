import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame } from "lucide-react";
import { useGitHubProfile } from "../hooks/useGitHub";

import { GitHubIcon, LinkedinIcon, InstagramIcon } from "./icons/BrandIcons";
import ResumeButton from "./ui/ResumeButton";

export default function Sidebar() {
  const { profile } = useGitHubProfile();
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(
        ".photo-block, .card-name, .flame-row, .card-bio, .Documents-btn, .card-socials .social-link",
        {
          opacity: 0,
          y: 15,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "all",
        },
      );
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
            <span className="btn-icon">🎨</span>
            <span className="btn-text">Checkout My Editing</span>
          </a>
          <a href="#" className="action-btn connect-btn">
            <span className="btn-icon">💬</span>
            <span className="btn-text">Connect With Me</span>
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
