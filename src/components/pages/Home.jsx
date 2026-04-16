import React, { memo } from "react";

function Home({ onCinematraphie, onNavigate }) {
  return (
    <div className="home-page">
      <section className="home-hero">
        <p className="hero-eyebrow">Portfolio / Systems-minded builder</p>

        <div className="hero-center">
          <img
            src="/shivanesh.svg"
            alt="Shivanesh signature"
            className="hero-signature"
            draggable="false"
          />
          <p className="hero-subtitle">Full stack & cloud engineer</p>
        </div>

        <div className="hero-inline-nav" aria-label="Quick links">
          <button
            type="button"
            className="hero-inline-link"
            onClick={() => onNavigate?.("writings")}
          >
            blogs
          </button>
          <button
            type="button"
            className="hero-inline-link"
            onClick={() => onNavigate?.("projects")}
          >
            projects
          </button>
          <button
            type="button"
            className="hero-inline-link"
            onClick={() => onNavigate?.("contact")}
          >
            resume
          </button>
          <button
            type="button"
            className="hero-inline-link"
            onClick={() => onNavigate?.("contact")}
          >
            contact
          </button>
        </div>

        <button
          type="button"
          className="hero-cta"
          onClick={() => onCinematraphie?.()}
        >
          cinematraphie
        </button>
      </section>
    </div>
  );
}

export default memo(Home);
