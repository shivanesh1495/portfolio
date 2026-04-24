import React, { memo } from "react";
import TextHoverEffect from "../ui/TextHoverEffect";

function Home() {
  const handleSectionScroll = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero-card" aria-label="Introduction">
      <img
        src="/shivanesh.svg"
        alt="Shivanesh signature"
        className="hero-signature"
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
          onClick={() => handleSectionScroll("writings")}
        >
          blogs
        </button>
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
          onClick={() => handleSectionScroll("resume")}
        >
          resume
        </button>
        <button
          type="button"
          className="hero-nav-link"
          onClick={() => handleSectionScroll("contact")}
        >
          contact
        </button>
      </nav>
    </section>
  );
}

export default memo(Home);
