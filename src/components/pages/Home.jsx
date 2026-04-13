import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useGitHubProfile } from "../../hooks/useGitHub";

function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const Stat = ({ value, label, showPlus = true }) => {
  const count = useCountUp(value);
  return (
    <div className="stat-block">
      <span className="stat-value">
        {showPlus ? "+" : ""}
        {count}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default function Home() {
  const { profile } = useGitHubProfile();

  // Default values while loading
  const yearsExp = profile?.yearsExperience || 1;
  const projects = profile?.public_repos || 46;

  const container = useRef();

  useGSAP(() => {
    gsap.from(".home-heading span, .home-bio, .stat-block", {
      opacity: 0,
      y: 15,
      stagger: 0.1,
      duration: 0.5,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: container });

  return (
    <div className="home-page" ref={container}>
      <div className="home-hero">
        <h1 className="home-heading">
          <span className="heading-line solid">FULL STACK</span>
          <span className="heading-line ghost">ENGINEER</span>
        </h1>

        <p className="home-bio">
          Passionate about creating intuitive and engaging
          <br />
          <em className="bio-highlight">
            USER EXPERIENCES. SPECIALIZE IN TRANSFORMING IDEAS
          </em>
          <br />
          into beautifully crafted products.
        </p>
      </div>

      <div className="home-stats">
        <Stat
          value={yearsExp}
          label={
            <>
              YEARS INTO MY CODING
              <br />
              JOURNEY
            </>
          }
          showPlus={false}
        />
        <Stat
          value={projects}
          label={
            <>
              PROJECTS
              <br />
              COMPLETED
            </>
          }
        />
      </div>
    </div>
  );
}
