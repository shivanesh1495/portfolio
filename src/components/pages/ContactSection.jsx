import React, { memo } from "react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "../icons/BrandIcons";
import ResumeButton from "../ui/ResumeButton";

function ContactSection() {
  return (
    <div className="content-block content-block--contact">
      <article className="section-card">
        <div className="contact-header">
          <h2 className="section-title-serif">Contact</h2>
          <p className="section-copy">
            Available for collaborations, internships, and thoughtful product
            work where engineering craft matters.
          </p>
        </div>

        <div className="contact-actions" id="resume">
          <ResumeButton />
        </div>
      </article>

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
  );
}

export default memo(ContactSection);
