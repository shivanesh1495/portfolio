import React, { memo } from "react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "../icons/BrandIcons";
import TechTicker from "../ui/TechTicker";
import ResumeButton from "../ui/ResumeButton";

function ContactSection({ onCinematraphie }) {
  return (
    <div className="contact-page">
      <section className="stack-showcase">
        <div className="stack-header">
          <h2 className="stack-heading">Stack</h2>
          <p className="stack-copy">
            Daily tooling across product engineering, cloud workflows, and
            systems-oriented builds.
          </p>
        </div>
        <TechTicker />
      </section>

      <section className="contact-showcase">
        <div className="contact-header">
          <h2 className="contact-heading">Contact</h2>
          <p className="contact-copy">
            Available for collaborations, internships, and thoughtful product
            work where engineering craft matters.
          </p>
        </div>

        <div className="contact-actions">
          <ResumeButton />

          <a
            href="https://linkedin.com/in/shivaneshmc"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn connect-btn"
          >
            <div className="button-outer">
              <div className="button-inner">
                <span>Let&apos;s Collaborate</span>
              </div>
            </div>
          </a>

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
        </div>

        <div className="contact-socials card-socials">
          <a
            href="https://instagram.com/shivanesh_1495"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link instagram"
          >
            <InstagramIcon />
          </a>
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
        </div>
      </section>
    </div>
  );
}

export default memo(ContactSection);
