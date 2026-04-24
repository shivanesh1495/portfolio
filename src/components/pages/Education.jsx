import React, { memo } from "react";
import { useInView } from "../../hooks/useInView";
import amritaLogo from "../../assets/education/amrita.png";
import bvbLogo from "../../assets/education/bvb.png";

function Education() {
  const { targetRef, isInView } = useInView();

  const educationData = [
    {
      degree: "B.Tech in Computer Science and Engineering",
      period: "Aug 2023 – Present",
      institution: "Amrita School of Computing, Amrita Vishwa Vidyapeetham",
      location: "Coimbatore, India",
      logo: amritaLogo,
    },
    {
      degree: "Higher Secondary Education",
      period: "Apr 2018 – Mar 2023",
      institution: "Bharathi Vidya Bhavan",
      location: "Erode, India",
      logo: bvbLogo,
    },
  ];

  return (
    <div
      className={`scene scene--education${isInView ? " is-active" : ""}`}
      ref={targetRef}
    >
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">02</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-display">Education</h2>
            <p className="scene__description">
              Academic foundation and specialized training in computing and
              engineering.
            </p>
          </div>
        </header>

        <div className="education-list">
          {educationData.map((item, index) => (
            <article className="education-card" key={index}>
              <div className="education-card__content">
                <div className="education-card__header">
                  <h3 className="education-card__degree">{item.degree}</h3>
                  <span className="education-card__period">{item.period}</span>
                </div>
                <div className="education-card__institution">
                  <p className="education-card__name">{item.institution}</p>
                  <p className="education-card__location">{item.location}</p>
                </div>
              </div>
              <div className="education-card__logo">
                <img src={item.logo} alt={`${item.institution} logo`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Education);
