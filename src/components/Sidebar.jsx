import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame } from "lucide-react";
import { useGitHubProfile } from "../hooks/useGitHub";

import { DribbbleIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from './icons/BrandIcons';
import ResumeButton from './ui/ResumeButton';

export default function Sidebar() {
  const { profile } = useGitHubProfile();
  const container = useRef();

  useGSAP(() => {
    gsap.from(".photo-block, .card-name, .flame-row, .card-bio, .Documents-btn, .card-socials .social-link", {
      opacity: 0,
      y: 15,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: container });

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

        {/* ── Flame icon ── */}
        <div className="flame-row">
          <div className="flame-circle">
            <Flame size={15} color="#fff" strokeWidth={2.5} />
          </div>
        </div>

        {/* ── Bottom dashed orange arc ── */}


        {/* ── Bio ── */}
        <p className="card-bio">
          {profile?.bio ||
            "A Software Engineer who has developed countless innovative solutions."}
        </p>

        {/* ── Resume button (Animated Folder) ── */}
        <ResumeButton />

        {/* ── Social icons ── */}
        <div className="card-socials">
          <a href="#" aria-label="Dribbble" className="social-link">
            <DribbbleIcon />
          </a>
          <a href="#" aria-label="Twitter" className="social-link">
            <TwitterIcon />
          </a>
          <a href="#" aria-label="Instagram" className="social-link">
            <InstagramIcon />
          </a>
          <a href="#" aria-label="YouTube" className="social-link">
            <YoutubeIcon />
          </a>
        </div>
      </div>
    </aside>
  );
}
