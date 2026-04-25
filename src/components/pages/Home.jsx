import React, { memo } from "react";
import TextHoverEffect from "../ui/TextHoverEffect";
import HangingBoard from "../ui/HangingBoard";
import { useGitHubResume } from "../../hooks/useGitHub";

function Home({
  introActive = false,
  signatureRef = null,
  onCinematraphie = null,
}) {
  const { resume } = useGitHubResume();

  const handleSectionScroll = (sectionId) => {
    if (sectionId === "cinematraphie") {
      onCinematraphie?.();
      return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const scrollBehavior = document.body.classList.contains("is-hydrated")
      ? "smooth"
      : "auto";
    section.scrollIntoView({ behavior: scrollBehavior, block: "start" });
  };

  return (
    <section
      className={`hero-card${introActive ? " hero-card--intro-active" : ""}`}
      aria-label="Introduction"
    >
      <HangingBoard />
      <img
        src="/shivanesh.svg"
        alt="Shivanesh signature"
        className="hero-signature"
        ref={signatureRef}
        draggable="false"
      />

      <div className="hero-subtitle-wrap">
        <TextHoverEffect
          className="hero-subtitle-effect"
          text="full stack & cloud engineer"
        />
      </div>

      <nav className="hero-nav" aria-label="Quick links">
        <button
          type="button"
          className="hero-nav-link"
          onClick={() => handleSectionScroll("projects")}
        >
          projects
        </button>
        <button
          type="button"
          className="hero-nav-link"
          onClick={() => handleSectionScroll("experience")}
        >
          experience
        </button>
        {resume ? (
          <a
            href={resume.previewUrl || resume.url}
            target="_blank"
            rel="noreferrer"
            className="hero-nav-link"
          >
            resume
          </a>
        ) : (
          <button
            type="button"
            className="hero-nav-link"
            onClick={() => handleSectionScroll("resume")}
          >
            resume
          </button>
        )}
        <button
          type="button"
          className="hero-nav-link"
          onClick={() => handleSectionScroll("contact")}
        >
          contact
        </button>
        <button
          type="button"
          className="hero-nav-link"
          onClick={() => handleSectionScroll("cinematraphie")}
        >
          cinematraphie
        </button>
      </nav>
    </section>
  );
}

export default memo(Home);
