import React, { memo } from "react";
import { GitHubIcon, InstagramIcon, LinkedinIcon } from "../icons/BrandIcons";
import ResumeButton from "../ui/ResumeButton";

function ContactSection({ onCinematraphie }) {
  return (
    <div className="scene scene--contact">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">07</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <div className="contact-stage">
          <div className="contact-copy">
            <div className="contact-header">
              <h2 className="section-title-serif">Contact</h2>
              <p className="section-copy">
                Available for collaborations, internships, and thoughtful
                product work where engineering craft matters.
              </p>
            </div>

            <div className="contact-actions" id="resume">
              <ResumeButton />
              <button
                type="button"
                className="hero-cta contact-cta"
                onClick={() => onCinematraphie?.()}
              >
                cinematraphie
              </button>
            </div>

            <div className="contact-socials">
              <a
                href="https://instagram.com/shivanesh_1495"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://github.com/shivanesh1495"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="social-link"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://linkedin.com/in/shivaneshmc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-link"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ContactSection);
