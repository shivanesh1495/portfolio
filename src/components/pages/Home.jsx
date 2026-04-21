import React, { memo } from "react";

function Home({ onCinematraphie }) {
  return (
    <div className="hero-card">
      <div className="hero-glow hero-glow--left" aria-hidden="true" />
      <div className="hero-glow hero-glow--right" aria-hidden="true" />

      <img
        src="/shivanesh.svg"
        alt="Shivanesh signature"
        className="hero-signature"
        draggable="false"
      />

      <p className="hero-subtitle">full stack &amp; cloud engineer</p>

      <nav className="hero-nav" aria-label="Quick links">
        <a className="hero-nav-link" href="#writings">
          blogs
        </a>
        <a className="hero-nav-link" href="#projects">
          projects
        </a>
        <a className="hero-nav-link" href="#resume">
          resume
        </a>
        <a className="hero-nav-link" href="#contact">
          contact
        </a>
      </nav>

      <button
        type="button"
        className="hero-cta"
        onClick={() => onCinematraphie?.()}
      >
        cinematraphie
      </button>
    </div>
  );
}

export default memo(Home);
